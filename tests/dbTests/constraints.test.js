import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { openTestPool } from "./helpers/testDb.js";

let pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

describe("Constraints", () => {
    test("CPR uniqueness: inserting a duplicate CPR raises a unique_violation", async () => {
        const duplicateCpr = "150553-4561"; // already seeded for michael conklin
        await expect(
            pool.query(
                "INSERT INTO patient (firstname, lastname, gender, cpr_number) VALUES ($1,$2,$3,$4)",
                ["Test", "Dup", "male", duplicateCpr]
            )
        ).rejects.toMatchObject({ code: "23505" }); // unique_violation
    });

    test("FK violation: inserting room_booking with non-existent patient raises a foreign_key_violation", async () => {
        const roomRes = await pool.query("SELECT id FROM room LIMIT 1");
        const validRoomId = roomRes.rows[0].id;
        await expect(
            pool.query(
                "INSERT INTO room_booking (fk_room_id, start_time, end_time, fk_patient_id) VALUES ($1, NOW(), NOW() + INTERVAL '1 hour', 99999)",
                [validRoomId]
            )
        ).rejects.toMatchObject({ code: "23503" }); // foreign_key_violation
    });

    test("FK violation: inserting medication_storage_missing for non-existent storage entry raises a foreign_key_violation", async () => {
        await expect(
            pool.query(
                "INSERT INTO medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES (99999, 5, NOW())"
            )
        ).rejects.toMatchObject({ code: "23503" }); // foreign_key_violation
    });
});
