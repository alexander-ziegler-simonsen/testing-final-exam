import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("treatment_staff table - positive tests (+)", () => {
    test("(+) check count of treatment_staffs", async () => {
        const res = await getClient().query("SELECT COUNT(*) from treatment_staff");
        expect(res.rows[0].count).toBe('51'); // pg returns (COUNT) as string
    });

    test("(+) select treatment_staffs and check the values", async () => {
        const res = await getClient().query("SELECT * from treatment_staff");
        expect(res.rows[0].fk_treatment_id).toBe(1);
        expect(res.rows[0].fk_staff_id).toBe(1);
        expect(res.rows[1].fk_treatment_id).toBe(1);
        expect(res.rows[1].fk_staff_id).toBe(26);
    });

    // add
    test("(+) add new treatment_staff and check if it was added", async () => {
        const treatment_id = 1;
        const newId = 52;
        const staff_id = 28;
        const res = await getClient().query("INSERT INTO treatment_staff (fk_treatment_id, fk_staff_id) VALUES ($1,$2)", [treatment_id, staff_id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT fk_treatment_id, fk_staff_id FROM treatment_staff WHERE id = $1", [newId]);
        expect(check.rows[0].fk_treatment_id).toBe(treatment_id);
        expect(check.rows[0].fk_staff_id).toBe(staff_id);
    });

    // edit
    test("(+) edit a treatment_staff", async () => {
        const id = 4;
        const treatment_id = 1;

        const res = await getClient().query("UPDATE treatment_staff SET fk_treatment_id = $1 WHERE id = $2", [treatment_id, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT fk_treatment_id FROM treatment_staff WHERE id = $1", [id]);
        expect(check.rows[0].fk_treatment_id).toBe(treatment_id);
    });

    // delete
    // does not work , since FK is in used somewhere else.
    // get this error - 23503
    //   test("(+) delete a treatment_staff", async () => {
    //     const res = await getClient().query("DELETE FROM treatment_staff WHERE id = 4");
    //     expect(res.rowCount).toBe(1);
    //   });
});

describe("treatment_staff table - negative tests (-)", () => {
    test("(-) add a treatment_staff with NULL fk_treatment_id", async () => {
        const treatment_staff = null;
        const staff_id = 1;
        await expect(getClient().query("insert into treatment_staff (fk_treatment_id, fk_staff_id) VALUES ($1,$2)", [treatment_staff, staff_id])).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    });

    test("(-) edit a treatment_staff by an id that does not exist", async () => {
        const id = 400;
        const fk_treatment_id = 1;
        const res = await getClient().query("UPDATE treatment_staff SET fk_treatment_id = $1 WHERE id = $2", [fk_treatment_id, id]);
        expect(res.rowCount).toBe(0);
    });
});
