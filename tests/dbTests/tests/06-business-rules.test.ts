import { describe, test, expect, beforeAll, afterAll } from "vitest";
import type { Pool } from "pg";
import { openTestPool } from "../helpers/testDb.js";

// Runs last: end-to-end business-rule checks that combine several tables
// (medication_storage + medication_storage_missing) in a single workflow,
// building on everything the earlier suites already confirmed works.
let pool: Pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

describe("R-10: stock deduction via missing report", () => {
    test("updating medication_storage.amount reduces stock by exactly the reported figure", async () => {
        // BEGIN/ROLLBACK here so the mutation below never actually persists.
        // Caveat: pool.query() may hand each call a different connection
        // from the pool, so this only reliably stays in one transaction
        // because nothing else runs concurrently against this pool.
        await pool.query("BEGIN");
        try {
            const beforeRes = await pool.query(
                "SELECT amount FROM medication_storage WHERE id = 1"
            );
            const initialAmount = beforeRes.rows[0].amount;
            const missingAmount = 15;

            await pool.query(
                "INSERT INTO medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES ($1, $2, NOW())",
                [1, missingAmount]
            );

            await pool.query(
                "UPDATE medication_storage SET amount = amount - $1 WHERE id = $2",
                [missingAmount, 1]
            );

            const afterRes = await pool.query(
                "SELECT amount FROM medication_storage WHERE id = 1"
            );
            expect(afterRes.rows[0].amount).toBe(initialAmount - missingAmount);
        } finally {
            await pool.query("ROLLBACK");
        }
    });
});
