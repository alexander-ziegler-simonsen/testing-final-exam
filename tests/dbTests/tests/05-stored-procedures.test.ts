import { describe, test, expect, beforeAll, afterAll } from "vitest";
import type { Pool } from "pg";
import { openTestPool } from "../helpers/testDb.js";

// Runs fifth: checks the sp_get_* stored procedures, which are the
// heaviest read queries (joining rooms/floors/buildings, shifts + staff,
// etc.) and are the layer the application backend actually calls.
let pool: Pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

describe("Stored procedures (sp_get_*)", () => {
    test("sp_get_patient_by_id returns correct patient data", async () => {
        const res = await pool.query("SELECT * FROM sp_get_patient_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].firstname).toBe("michael");
        expect(res.rows[0].cpr_number).toBe("150553-4561");
    });

    test("sp_get_patient_by_id returns empty for non-existent id", async () => {
        const res = await pool.query("SELECT * FROM sp_get_patient_by_id($1)", [99999]);
        expect(res.rows.length).toHaveLength(0);
    });

    test("sp_get_nurse_by_id returns correct nurse data", async () => {
        const res = await pool.query("SELECT * FROM sp_get_nurse_by_id($1)", [26]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].firstname).toBe("anna");
        expect(res.rows[0].lastname).toBe("jensen");
    });

    test("sp_get_doctor_by_id returns correct doctor data", async () => {
        const res = await pool.query("SELECT * FROM sp_get_doctor_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].firstname).toBe("lars");
        expect(res.rows[0].lastname).toBe("christensen");
    });

    test("sp_get_department_by_id returns correct department with staff", async () => {
        const res = await pool.query("SELECT * FROM sp_get_department_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].department_name).toBe("emergency");
    });

    test("sp_get_shift_by_id returns shift with assigned staff", async () => {
        const res = await pool.query("SELECT * FROM sp_get_shift_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].shift_id).toBe(1);
        expect(res.rows[0].firstname).not.toBeNull();
    });

    test("sp_get_room_by_id returns room with floor and building", async () => {
        const res = await pool.query("SELECT * FROM sp_get_room_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].room_name).toBe("room a101");
        expect(res.rows[0].floor_name).not.toBeNull();
        expect(res.rows[0].building_name).not.toBeNull();
    });

    test("sp_get_floor_by_id returns floor with its rooms", async () => {
        const res = await pool.query("SELECT * FROM sp_get_floor_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].building_name).toBe("main hospital");
    });

    test("sp_get_building_by_id returns building with floors and rooms", async () => {
        const res = await pool.query("SELECT * FROM sp_get_building_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].building_name).toBe("main hospital");
    });
});
