import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { openTestPool } from "./helpers/testDb.js";

let pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

describe("Seed data", () => {
    test("patient table has 25 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM patient");
        expect(Number(res.rows[0].count)).toBe(25);
    });

    test("staff table has 51 seeded rows (25 doctors + 25 nurses + 1 admin)", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM staff");
        expect(Number(res.rows[0].count)).toBe(51);
    });

    test("staff has exactly 25 doctors and 25 nurses", async () => {
        const res = await pool.query(`
            SELECT sr.name AS role, COUNT(*) AS count
            FROM staff s
            JOIN staff_role sr ON sr.id = s.fk_role_id
            WHERE sr.name IN ('doctor', 'nurse')
            GROUP BY sr.name
        `);
        const counts = Object.fromEntries(res.rows.map((r) => [r.role, Number(r.count)]));
        expect(counts.doctor).toBe(25);
        expect(counts.nurse).toBe(25);
    });

    test("medication table has 26 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM medication");
        expect(Number(res.rows[0].count)).toBe(26);
    });

    test("every medication has a corresponding storage entry", async () => {
        const res = await pool.query(`
            SELECT m.id
            FROM medication m
            LEFT JOIN medication_storage ms ON ms.fk_medication_id = m.id
            WHERE ms.id IS NULL
        `);
        expect(res.rows.length).toBe(0);
    });

    test("room_booking table has 10 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM room_booking");
        expect(Number(res.rows[0].count)).toBe(10);
    });

    test("treatment table has 25 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM treatment");
        expect(Number(res.rows[0].count)).toBe(25);
    });

    test("seeded patient michael conklin has correct CPR number", async () => {
        const res = await pool.query(
            "SELECT cpr_number FROM patient WHERE firstname = 'michael' AND lastname = 'conklin'"
        );
        expect(res.rows[0]?.cpr_number).toBe("150553-4561");
    });
});
