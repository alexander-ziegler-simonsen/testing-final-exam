# Testing Plan

## Why this exists

The role/page access table below started as 18 minimum-positive-path tests. Adding
"one negative test per positive" pushed it to 144 (`i alt ca.` column). 144 tests built
as full round-trips (login → hit endpoint → verify) is not a plan, it's brute force —
most of that volume is the same authorization check repeated per page. This document
splits the work across six layers so each concern is tested once, in the cheapest
layer that can actually prove it, instead of every layer re-proving everything.

### Source matrix

| role                     | page            | access                | minimum test | i alt ca. |
| ------------------------ | --------------- | ---------------------- | ------------ | --------- |
| admin                    | staff           | CRUD                    | 4            | 8         |
| nurse / doctor / patient | staff           |                         | 1x3          | 6         |
| admin                    | department      | CRUD                    | 4            | 8         |
| nurse / doctor           | department      | R                       | 2x2          | 8         |
| nurse / doctor           | departmentStaff | R                       | 2x2          | 8         |
| admin                    | departmentStaff | CRUD                    | 4            | 8         |
| doctor                   | medicinStorage  | RU                      | 2            | 4         |
| nurse                    | medicinStorage  | R                       | 1            | 2         |
| admin                    | medicinStorage  | CRUD                    | 4            | 8         |
| doctor / nurse           | missingMedicin  | CR                      | 2x2          | 8         |
| admin                    | missingMedicin  | CRUD                    | 4            | 8         |
| doctor / nurse           | treatment       | CRU                     | 3x2          | 12        |
| admin                    | treatment       | CRUD                    | 4            | 8         |
| doctor / nurse           | patient         | R                       | 1x2          | 4         |
| admin                    | patient         | CRUD                    | 4            | 8         |
| doctor / nurse           | roomBooking     | CRD                     | 3x3          | 18        |
| admin                    | roomBooking     | CRUD                    | 4            | 8         |
| doctor / nurse           | shifts          | CRUD - their own info   | 4x2          | 8         |
| admin                    | shifts          | CRUD - everything       | 4            | 8         |
| **total**                |                 |                         | **18**       | **144**   |

## The six layers

Each layer has one job. If two layers would assert the same fact, that's a sign the
boundary is wrong, not a sign of thoroughness.

### 1. Client — unit / component, fake API (`client/`, vitest)
**Proves:** the UI does the right thing for a given role — hides/disables actions,
routes guard correctly, forms validate, error states render.
**Does not prove:** that the server actually enforces anything. A hidden button is
UX, not security.
**Data:** fully mocked/fake API responses. No real backend, no DB. Fast, so this is
where UI-side positive/negative cases can be cheap and numerous.
**Location:** colocated `*.test.tsx` / `*.unit.test.ts` next to components/services
(e.g. `client/src/components/LoginCompoent.test.tsx`).

### 2. API unit tests (`api/apiTesting/`, xUnit)
**Proves:** API business logic is correct, including failure modes that can't be
reproduced against a real dependency — forced 500s, thrown exceptions, malformed
input handled by a stubbed/mocked boundary. Isolated, no real data.
**This is also where the role-based access matrix lives in bulk** (the ~18-30
allowed/blocked checks from the table above) — it's the cheapest layer that can run
the full matrix on every commit.
**Data:** isolated, no DB, or a single mocked dependency (repository/service) when
forcing a failure that real infra won't produce on demand.

### 3. DB tests (`tests/dbTests/`, real Postgres via testcontainer)
**Proves:** schema constraints, cascades, triggers, and any DB-side logic that an
in-memory substitute (SQLite, pg-mem, H2) would silently behave differently on.
No API layer involved — this is the database alone.
**Why real Postgres, not in-memory:** in-memory substitutes diverge from real
Postgres on JSONB, constraint/cascade timing, error codes, isolation levels — a test
that's green against SQLite and would fail against real Postgres is worse than no
test, it's false confidence.

### 4. Postman / Newman (`tests/api/run-postman.sh`)
**Proves:** the deployed API actually works end-to-end as a real client would call
it — real HTTP, real auth headers, real DB, real network/env wiring. This is a
contract/smoke check, not a re-run of the api-unit matrix.
**Scope on purpose:** a handful of representative requests per role (happy paths +
a couple of denied cases), not all 18-30 matrix cells. If it starts duplicating
api-unit assertions, trim it — two frameworks asserting the same fact is just two
places to update when a check changes.

### 5. E2E (`tests/e2e/`, Playwright)
**Proves:** the whole system wired together for a real user journey. One flow per
role: login → fast pass over the main pages (read-check, data renders) → one real
business action (e.g. nurse gives a treatment) → logout.
**Scope on purpose:** 4-8 tests total (one per role, maybe a couple of variants),
not a test per matrix row. This is a baseline "yep, still works" smoke layer, not
where negative-case volume lives — failures here should be rare and mean something
broke in the wiring, not in one specific rule.

### 6. Stress test (`tests/stress-tests/`, JMeter, real DB + API)
**Proves:** capacity/performance under load. Excluded from the "does it work"
pass — run separately, not part of the regular suite.

## Special case: ownership boundaries (shifts)

"Doctor CRUDs their own shifts" is not a role-access case, it's a data-ownership
case — same role, different outcome depending on whose record it is. Needs its own
explicit tests, not coverage-by-assumption from the access matrix:
- Doctor A can CRUD Doctor A's shift.
- Doctor A is denied on Doctor B's shift.

Lives in api-unit tests (needs two distinct user fixtures), same reasoning as the
rest of the matrix.

## Test isolation

API-unit (when using a container), db-tests, postman, and e2e all touch a real
database. Running them together requires a clean reset between suites, not just
once at the start of the run — see the DB respawn/reseed work (full-reset +
`WithReseed` + split `init.sql`) built specifically for this. Without it, layers
will cross-contaminate (e.g. an e2e room booking left behind breaks a db-test
assertion expecting an empty calendar).

## Rough count

| Layer                          | Approx. count | What it covers                          |
| ------------------------------- | ------------- | ---------------------------------------- |
| Client (mocked)                 | as needed     | UI behavior per role, cheap and numerous |
| API unit (incl. access matrix)  | ~40-55        | access matrix, CRUD depth + negatives, ownership boundary |
| DB tests                        | as needed     | constraints, cascades, triggers          |
| Postman                         | ~10-15        | deployed-API contract/wiring smoke       |
| E2E                             | 4-8            | one real journey per role                |
| Stress                          | separate      | performance, not correctness             |

Down from 144 brute-forced round-trips to a layered set where each fact is proven
once, in the layer that can prove it cheapest.
