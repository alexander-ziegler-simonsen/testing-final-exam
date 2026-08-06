import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { openTestPool } from "./helpers/testDb.js";

let pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

describe("DB view: vw_nurses", () => {
    test("returns at least one row", async () => {
        const res = await pool.query("SELECT * FROM vw_nurses LIMIT 1");
        expect(res.rows.length).toBeGreaterThan(0);
    });

    test("all rows have a nurse_id", async () => {
        const res = await pool.query("SELECT nurse_id FROM vw_nurses WHERE nurse_id IS NULL");
        expect(res.rows.length).toBe(0);
    });

    test("returns rows only for staff with role 'nurse'", async () => {
        const res = await pool.query(`
            SELECT v.nurse_id
            FROM vw_nurses v
            JOIN staff s ON s.id = v.nurse_id
            JOIN staff_role sr ON sr.id = s.fk_role_id
            WHERE sr.name != 'nurse'
        `);
        expect(res.rows.length).toBe(0);
    });
});

describe("DB view: vw_doctors", () => {
    test("returns at least one row", async () => {
        const res = await pool.query("SELECT * FROM vw_doctors LIMIT 1");
        expect(res.rows.length).toBeGreaterThan(0);
    });

    test("all rows have doctor_id, firstname, and lastname", async () => {
        const res = await pool.query(`
            SELECT * FROM vw_doctors
            WHERE doctor_id IS NULL OR firstname IS NULL OR lastname IS NULL
        `);
        expect(res.rows.length).toBe(0);
    });

    test("returns rows only for staff with role 'doctor'", async () => {
        const res = await pool.query(`
            SELECT v.doctor_id
            FROM vw_doctors v
            JOIN staff s ON s.id = v.doctor_id
            JOIN staff_role sr ON sr.id = s.fk_role_id
            WHERE sr.name != 'doctor'
        `);
        expect(res.rows.length).toBe(0);
    });
});

describe("DB view: vw_week_shifts", () => {
    test("returns at least one row", async () => {
        const res = await pool.query("SELECT * FROM vw_week_shifts LIMIT 1");
        expect(res.rows.length).toBeGreaterThan(0);
    });

    test("all rows have a shift_id, start_time, and end_time", async () => {
        const res = await pool.query(`
            SELECT * FROM vw_week_shifts
            WHERE shift_id IS NULL OR start_time IS NULL OR end_time IS NULL
        `);
        expect(res.rows.length).toBe(0);
    });
});
