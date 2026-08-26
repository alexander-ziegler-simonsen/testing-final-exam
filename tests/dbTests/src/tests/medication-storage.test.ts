import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("medication_storage table - positive tests (+)", () => {
    test("(+) check count of medication-storage", async () => {
        const res = await getClient().query("SELECT COUNT(*) from medication_storage");
        expect(res.rows[0].count).toBe("27"); // pg returns (COUNT) as string
    });

    test("(+) select and check the values", async () => {
        const res = await getClient().query("SELECT * from medication_storage");
        expect(res.rows[0].fk_medication_id).toBe(1);
        expect(res.rows[1].fk_medication_id).toBe(2);
        expect(res.rows[2].fk_medication_id).toBe(3);
        expect(res.rows[0].amount).toBe(500);
        expect(res.rows[1].amount).toBe(400);
        expect(res.rows[2].amount).toBe(300);
    });

    // add
    test("(+) add new medication-storage and check if it was added", async () => {
        const fk_medication_id = 1
        const amount = 2

        const newId = 28
        const res = await getClient().query("INSERT INTO medication_storage (fk_medication_id, amount) VALUES ($1,$2)", [fk_medication_id, amount]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT fk_medication_id FROM medication_storage WHERE id = $1", [newId]);
        expect(check.rows[0].fk_medication_id).toBe(fk_medication_id);
    });

    // edit
    test("(+) edit a medication-storage medication-storage", async () => {
        const id = 4;
        const newfk_medication_id = 2;

        const res = await getClient().query("UPDATE medication_storage SET fk_medication_id = $1 WHERE id = $2", [newfk_medication_id, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT fk_medication_id FROM medication_storage WHERE id = $1", [id]);
        expect(check.rows[0].fk_medication_id).toBe(newfk_medication_id);
    });

    // delete
    test("(+) delete a medication-storage medication-storage", async () => {
        const res = await getClient().query("DELETE FROM medication_storage WHERE id = 4");
        expect(res.rowCount).toBe(1);
    });
});

describe("medication_storage table - negative tests (-)", () => {
    //   test("(-) add a medication-storage with too long a fk_medication_id", async () => {
    //     const fk_medication_id = 1
    //     const amount = 2
    //     await expect(
    //       getClient().query("insert into medication_storage (fk_medication_id) VALUES ($1)", [fk_medication_id, amount])
    //     ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    //   });

    test("(-) add a medication-storage with NULL fk_medication_id", async () => {
        const fk_medication_id = null;
        const amount = 2;
        await expect(
            getClient().query("insert into medication_storage (fk_medication_id, amount) VALUES ($1,$2)", [fk_medication_id, amount])
        ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    });

    test("(-) edit a medication-storage medication-storage by an id that does not exist", async () => {
        const id = 40;
        const newfk_medication_id = 2;
        const res = await getClient().query("UPDATE medication_storage SET fk_medication_id = $1 WHERE id = $2", [newfk_medication_id, id]);
        expect(res.rowCount).toBe(0);
    });
});
