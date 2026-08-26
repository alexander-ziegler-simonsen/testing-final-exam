import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("medication_storage_missing table - positive tests (+)", () => {
    test("(+) check count of medication-storage-missing", async () => {
        const res = await getClient().query("SELECT COUNT(*) from medication_storage_missing");
        expect(res.rows[0].count).toBe("3"); // pg returns (COUNT) as string
    });

    test("(+) select and check the values", async () => {
        const res = await getClient().query("SELECT * from medication_storage_missing");
        expect(res.rows[0].fk_medication_storage_id).toBe(1);
        expect(res.rows[1].fk_medication_storage_id).toBe(2);
        expect(res.rows[2].fk_medication_storage_id).toBe(27);
        expect(res.rows[0].amount_missing).toBe(10);
        expect(res.rows[1].amount_missing).toBe(5);
        expect(res.rows[2].amount_missing).toBe(1);
        expect(res.rows[0].went_missing_at).toEqual(new Date('2025-10-07 12:00:00'));
        expect(res.rows[1].went_missing_at).toEqual(new Date('2025-10-07 15:30:00'));
        expect(res.rows[2].went_missing_at).toEqual(new Date('2099-01-01 08:00:00'));
    });

    // add
    test("(+) add new medication-storage-missing and check if it was added", async () => {
        const fk_medication_storage_id = 1
        const amount_missing = 2
        const went_missing = '2025-10-07 12:00:00'

        const newId = 4
        const res = await getClient().query("INSERT INTO medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES ($1,$2,$3)", [fk_medication_storage_id, amount_missing,went_missing]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT * FROM medication_storage_missing WHERE id = $1", [newId]);
        expect(check.rows[0].fk_medication_storage_id).toBe(fk_medication_storage_id);
        expect(check.rows[0].amount_missing).toBe(amount_missing);
        expect(check.rows[0].went_missing_at).toEqual(new Date(went_missing));

    });

    // edit
    test("(+) edit a medication-storage-missing medication-storage-missing", async () => {
        const id = 3;
        const newfk_medication_storage_id = 2;

        const res = await getClient().query("UPDATE medication_storage_missing SET fk_medication_storage_id = $1 WHERE id = $2", [newfk_medication_storage_id, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT fk_medication_storage_id FROM medication_storage_missing WHERE id = $1", [id]);
        expect(check.rows[0].fk_medication_storage_id).toBe(newfk_medication_storage_id);
    });

    // delete
    test("(+) delete a medication-storage-missing medication-storage-missing", async () => {
        const res = await getClient().query("DELETE FROM medication_storage_missing WHERE id = 3");
        expect(res.rowCount).toBe(1);
    });
});

describe("medication_storage_missing table - negative tests (-)", () => {
    //   test("(-) add a medication-storage-missing with too long a fk_medication_storage_id", async () => {
    //     const fk_medication_storage_id = 1
    //     const amount_missing = 2
    //     await expect(
    //       getClient().query("insert into medication_storage_missing (fk_medication_storage_id) VALUES ($1)", [fk_medication_storage_id, amount_missing])
    //     ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    //   });

    test("(-) add a medication-storage-missing with NULL fk_medication_storage_id", async () => {
        const fk_medication_storage_id = null;
        const amount_missing = 2;
        const went_missing = '2025-10-07 12:00:00'

        await expect(
            getClient().query("insert into medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) VALUES ($1,$2,$3)", [fk_medication_storage_id, amount_missing, went_missing])
        ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    });

    test("(-) edit a medication-storage-missing by an id that does not exist", async () => {
        const id = 40;
        const newfk_medication_storage_id = 2;
        const res = await getClient().query("UPDATE medication_storage_missing SET fk_medication_storage_id = $1 WHERE id = $2", [newfk_medication_storage_id, id]);
        expect(res.rowCount).toBe(0);
    });
});
