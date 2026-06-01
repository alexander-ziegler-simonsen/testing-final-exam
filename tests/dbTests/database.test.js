import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
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

    pool = new Pool({
        host: container.getHost(),
        port: container.getPort(),
        database: container.getDatabase(),
        user: container.getUsername(),
        password: container.getPassword(),
    });

    const initSql = fs.readFileSync(
        path.join(__dirname, "../../initScripts/postgres/init.sql"),
        "utf-8"
    );

    await pool.query(initSql);
}, 60_000);

afterAll(async () => {
    await pool?.end();
    await container?.stop();
});


// ─── Seed data

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


// ─── Constraints

describe("Constraints", () => {
    test("CPR uniqueness: inserting a duplicate CPR raises an error", async () => {
        const duplicateCpr = "150553-4561"; // already seeded for michael conklin
        await expect(
            pool.query(
                "INSERT INTO patient (firstname, lastname, gender, cpr_number) VALUES ($1,$2,$3,$4)",
                ["Test", "Dup", "male", duplicateCpr]
            )
        ).rejects.toThrow(/unique/i);
    });

    test("FK violation: inserting room_booking with non-existent patient raises an error", async () => {
        const roomRes = await pool.query("SELECT id FROM room LIMIT 1");
        const validRoomId = roomRes.rows[0].id;
        await expect(
            pool.query(
                "INSERT INTO room_booking (fk_room_id, start_time, end_time, fk_patient_id) VALUES ($1, NOW(), NOW() + INTERVAL '1 hour', 99999)",
                [validRoomId]
            )
        ).rejects.toThrow(/foreign key/i);
    });

    test("FK violation: inserting medication_storage_missing for non-existent storage entry raises an error", async () => {
        await expect(
            pool.query(
                "INSERT INTO medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES (99999, 5, NOW())"
            )
        ).rejects.toThrow(/foreign key/i);
    });
});


// ─── R-10: stock deduction

describe("R-10: stock deduction via missing report", () => {
    test("updating medication_storage.amount reduces stock by exactly the reported figure", async () => {
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


// ─── Functions

describe("DB function: calculate_patient_age", () => {
    test("returns 0 for a patient born today", async () => {
        const res = await pool.query(
            "SELECT calculate_patient_age(CURRENT_DATE) AS age"
        );
        expect(Number(res.rows[0].age)).toBe(0);
    });

    test("returns exact age for someone born exactly 35 years ago today", async () => {
        const res = await pool.query(
            "SELECT calculate_patient_age((CURRENT_DATE - INTERVAL '35 years')::date) AS age"
        );
        expect(Number(res.rows[0].age)).toBe(35);
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

    test("boundary: returns false for someone born exactly 18 years ago today", async () => {
        const res = await pool.query(
            "SELECT is_patient_minor((CURRENT_DATE - INTERVAL '18 years')::date) AS minor"
        );
        expect(res.rows[0].minor).toBe(false);
    });

    test("boundary: returns true for someone born one day after the 18-year cutoff", async () => {
        const res = await pool.query(
            "SELECT is_patient_minor((CURRENT_DATE - INTERVAL '18 years' + INTERVAL '1 day')::date) AS minor"
        );
        expect(res.rows[0].minor).toBe(true);
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


// ─── Views

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


// ─── Functions

describe("DB functions (sp_get_*)", () => {
    test("sp_get_patient_by_id returns correct patient data", async () => {
        const res = await pool.query("SELECT * FROM sp_get_patient_by_id($1)", [1]);
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].firstname).toBe("michael");
        expect(res.rows[0].cpr_number).toBe("150553-4561");
    });

    test("sp_get_patient_by_id returns empty for non-existent id", async () => {
        const res = await pool.query("SELECT * FROM sp_get_patient_by_id($1)", [99999]);
        expect(res.rows.length).toBe(0);
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
