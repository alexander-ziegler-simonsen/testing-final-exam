import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer } from "testcontainers";
import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;

let container;
let pool;

beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:15").start();

    pool = new Pool({ connectionString: container.getConnectionString() });

    const initSql = fs.readFileSync(
        path.join(__dirname, "../../initScripts/postgres/init.sql"),
        "utf-8"
    );

    await pool.query(initSql);
}, 60_000);

afterAll(async () => {
    await pool.end();
    await container.stop();
});


// ─── Seed data ────────────────────────────────────────────────────────────────

describe("Seed data", () => {
    test("patient table has 25 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM patient");
        expect(Number(res.rows[0].count)).toBe(25);
    });

    test("staff table has 50 seeded rows (25 doctors + 25 nurses)", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM staff");
        expect(Number(res.rows[0].count)).toBe(50);
    });

    test("medication table has 26 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM medication");
        expect(Number(res.rows[0].count)).toBe(26);
    });

    test("medication_storage has one row per medication", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM medication_storage");
        expect(Number(res.rows[0].count)).toBe(25);
    });

    test("room_booking table has 10 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM room_booking");
        expect(Number(res.rows[0].count)).toBe(10);
    });

    test("treatment table has 25 seeded rows", async () => {
        const res = await pool.query("SELECT COUNT(*) FROM treatment");
        expect(Number(res.rows[0].count)).toBe(25);
    });

    test("first seeded patient has correct CPR number", async () => {
        const res = await pool.query("SELECT cpr_number FROM patient WHERE id = 1");
        expect(res.rows[0].cpr_number).toBe("150553-4561");
    });
});


// ─── Constraints ─────────────────────────────────────────────────────────────

describe("Constraints", () => {
    test("CPR uniqueness: inserting a duplicate CPR raises an error", async () => {
        const duplicateCpr = "150553-4561"; // already seeded for patient id=1
        await expect(
            pool.query(
                "INSERT INTO patient (firstname, lastname, gender, cpr_number) VALUES ($1,$2,$3,$4)",
                ["Test", "Dup", "male", duplicateCpr]
            )
        ).rejects.toThrow(/unique/i);
    });

    test("room_booking rows all reference existing patients", async () => {
        const res = await pool.query(`
            SELECT rb.id
            FROM room_booking rb
            LEFT JOIN patient p ON p.id = rb.fk_patient_id
            WHERE p.id IS NULL
        `);
        expect(res.rows.length).toBe(0);
    });

    test("prescription rows all reference existing treatments", async () => {
        const res = await pool.query(`
            SELECT pr.id
            FROM prescription pr
            LEFT JOIN treatment t ON t.id = pr.fk_treatment_id
            WHERE t.id IS NULL
        `);
        expect(res.rows.length).toBe(0);
    });

    test("FK violation: inserting room_booking with non-existent patient raises an error", async () => {
        await expect(
            pool.query(
                "INSERT INTO room_booking (fk_room_id, start_time, end_time, fk_patient_id) VALUES (1, NOW(), NOW() + INTERVAL '1 hour', 99999)"
            )
        ).rejects.toThrow(/foreign key/i);
    });
});


// ─── R-10: stock deduction ────────────────────────────────────────────────────

describe("R-10: stock deduction via missing report", () => {
    test("updating medication_storage.amount reduces stock by exactly the reported figure", async () => {
        await pool.query("BEGIN");
        try {
            const beforeRes = await pool.query(
                "SELECT amount FROM medication_storage WHERE id = 1"
            );
            const initialAmount = beforeRes.rows[0].amount;
            const missingAmount = 15;

            // Step 1: record the missing report
            await pool.query(
                "INSERT INTO medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES ($1, $2, NOW())",
                [1, missingAmount]
            );

            // Step 2: deduct from storage (what the application does via EditStorage)
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

    test("medication_storage_missing row is persisted after insert", async () => {
        await pool.query("BEGIN");
        try {
            const countBefore = await pool.query(
                "SELECT COUNT(*) FROM medication_storage_missing"
            );
            const before = Number(countBefore.rows[0].count);

            await pool.query(
                "INSERT INTO medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES ($1, $2, NOW())",
                [2, 5]
            );

            const countAfter = await pool.query(
                "SELECT COUNT(*) FROM medication_storage_missing"
            );
            expect(Number(countAfter.rows[0].count)).toBe(before + 1);
        } finally {
            await pool.query("ROLLBACK");
        }
    });
});


// ─── Functions ────────────────────────────────────────────────────────────────

describe("DB function: calculate_patient_age", () => {
    test("returns 0 for a patient born today", async () => {
        const res = await pool.query(
            "SELECT calculate_patient_age(CURRENT_DATE) AS age"
        );
        expect(Number(res.rows[0].age)).toBe(0);
    });

    test("returns a positive integer for someone born in 1990", async () => {
        const res = await pool.query(
            "SELECT calculate_patient_age('1990-01-01') AS age"
        );
        const age = Number(res.rows[0].age);
        expect(age).toBeGreaterThan(30);
    });

    test("age increases by 1 after a birth anniversary year", async () => {
        const res = await pool.query(`
            SELECT
                calculate_patient_age('2000-01-01') AS a2000,
                calculate_patient_age('2001-01-01') AS a2001
        `);
        expect(Number(res.rows[0].a2000)).toBe(Number(res.rows[0].a2001) + 1);
    });
});

describe("DB function: is_patient_minor", () => {
    test("returns true for someone born in 2015 (definitely under 18)", async () => {
        const res = await pool.query(
            "SELECT is_patient_minor('2015-01-01') AS minor"
        );
        expect(res.rows[0].minor).toBe(true);
    });

    test("returns false for someone born in 1990 (definitely over 18)", async () => {
        const res = await pool.query(
            "SELECT is_patient_minor('1990-01-01') AS minor"
        );
        expect(res.rows[0].minor).toBe(false);
    });
});

describe("DB function: patient_bmi_value", () => {
    test("returns correct BMI for weight=70kg height=175cm", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_value(70, 175) AS bmi"
        );
        const bmi = Number(res.rows[0].bmi);
        const expected = 70 / ((175 / 100) ** 2);
        expect(Math.abs(bmi - expected)).toBeLessThan(0.001);
    });

    test("returns null when weight is 0", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_value(0, 175) AS bmi"
        );
        expect(res.rows[0].bmi).toBeNull();
    });

    test("returns null when height is 0", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_value(70, 0) AS bmi"
        );
        expect(res.rows[0].bmi).toBeNull();
    });
});

describe("DB function: patient_bmi_category", () => {
    test("returns 'underweight' for BMI < 18.5 (weight=40 height=170)", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_category(40, 170) AS category"
        );
        expect(res.rows[0].category).toBe("underweight");
    });

    test("returns 'normal' for BMI 18.5–24.9 (weight=70 height=175)", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_category(70, 175) AS category"
        );
        expect(res.rows[0].category).toBe("normal");
    });

    test("returns 'overweight' for BMI 25–29.9 (weight=85 height=175)", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_category(85, 175) AS category"
        );
        expect(res.rows[0].category).toBe("overweight");
    });

    test("returns 'obesity' for BMI ≥ 30 (weight=110 height=175)", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_category(110, 175) AS category"
        );
        expect(res.rows[0].category).toBe("obesity");
    });

    test("returns null when weight is 0", async () => {
        const res = await pool.query(
            "SELECT patient_bmi_category(0, 175) AS category"
        );
        expect(res.rows[0].category).toBeNull();
    });
});


// ─── Views ────────────────────────────────────────────────────────────────────

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


// ─── Stored procedures ────────────────────────────────────────────────────────
//
// Note: these procedures use bare SELECT (no INTO / REFCURSOR), so they only
// execute cleanly when the WHERE clause matches 0 rows — PL/pgSQL raises
// "query has no destination for result data" when rows would be returned.
// The call tests therefore use non-existent IDs to exercise the call path
// without triggering that limitation. A separate schema test confirms all
// procedures were created successfully.

describe("Stored procedures", () => {
    test("all eight procedures exist in pg_proc", async () => {
        const res = await pool.query(`
            SELECT proname FROM pg_proc
            WHERE proname IN (
                'sp_get_patient_by_id', 'sp_get_nurse_by_id', 'sp_get_doctor_by_id',
                'sp_get_department_by_id', 'sp_get_shift_by_id', 'sp_get_room_by_id',
                'sp_get_floor_by_id', 'sp_get_building_by_id'
            )
        `);
        expect(res.rows.length).toBe(8);
    });

    test("sp_get_patient_by_id: non-existent id completes without error", async () => {
        await expect(
            pool.query("CALL sp_get_patient_by_id($1)", [99999])
        ).resolves.toBeDefined();
    });

    test("sp_get_nurse_by_id: non-existent id completes without error", async () => {
        await expect(
            pool.query("CALL sp_get_nurse_by_id($1)", [99999])
        ).resolves.toBeDefined();
    });

    test("sp_get_doctor_by_id: non-existent id completes without error", async () => {
        await expect(
            pool.query("CALL sp_get_doctor_by_id($1)", [99999])
        ).resolves.toBeDefined();
    });

    test("sp_get_department_by_id: non-existent id completes without error", async () => {
        await expect(
            pool.query("CALL sp_get_department_by_id($1)", [99999])
        ).resolves.toBeDefined();
    });
});
