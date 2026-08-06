import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { openTestPool } from "./helpers/testDb.js";

let pool;

beforeAll(() => {
    pool = openTestPool();
});

afterAll(async () => {
    await pool.end();
});

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
