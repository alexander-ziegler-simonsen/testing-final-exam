import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { openTestPool } from "./helpers/testDb.js";

let pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

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
