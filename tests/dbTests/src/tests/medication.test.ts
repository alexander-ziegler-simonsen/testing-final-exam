import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("medication table - positive tests (+)", () => {
    test("(+) check count of medication name", async () => {
        const res = await getClient().query("SELECT COUNT(*) from medication");
        expect(res.rows[0].count).toBe("27"); // pg returns (COUNT) as string
    });

    test("(+) select name and check the values", async () => {
        const res = await getClient().query("SELECT * from medication");
        expect(res.rows[0].name).toBe("paracetamol");
        expect(res.rows[1].name).toBe("amoxicillin");
        expect(res.rows[2].name).toBe("atorvastatin");
    });

    // add
    test("(+) add new medication and check if it was added", async () => {
        const generic_name = "newGeneric_name";
        const newId = 28;
        const name = "name";
        const brand = "brand";
        const form = "pill";
        const str = "2";
        const category = "stuff";
        const descrip = "yep";
        const res = await getClient().query("INSERT INTO medication (generic_name, name, brand, form, strength, category, description) VALUES ($1,$2,$3,$4,$5,$6,$7)", [generic_name, name, brand, form, str, category, descrip]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT * FROM medication WHERE id = $1", [newId]);
        expect(check.rows[0].generic_name).toBe(generic_name);
        expect(check.rows[0].name).toBe(name);
        expect(check.rows[0].id).toBe(newId);

    });

    // edit
    test("(+) edit a medication generic_name", async () => {
        const id = 4;
        const newgeneric_name = "newgeneric_name";

        const res = await getClient().query("UPDATE medication SET generic_name = $1 WHERE id = $2", [newgeneric_name, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT generic_name FROM medication WHERE id = $1", [id]);
        expect(check.rows[0].generic_name).toBe(newgeneric_name);
    });

    // // delete
    // test("(+) delete a medication", async () => {
    //     const id = 26;
    //     const res = await getClient().query("DELETE FROM medication WHERE id = $1", [id]);
    //     expect(res.rowCount).toBe(1);
    // });
});

describe("medication table - negative tests (-)", () => {
    test("(-) add a medication with too long a generic_name", async () => {
        const generic_name = "1".repeat(101);
        const newId = 27;
        const name = "name";
        const brand = "brand";
        const form = "pill";
        const str = "2";
        const category = "stuff";
        const descrip = "yep";
        await expect(
            getClient().query("INSERT INTO medication (generic_name, name, brand, form, strength, category, description) VALUES ($1,$2,$3,$4,$5,$6,$7)", [generic_name, name, brand, form, str, category, descrip])
        ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    });

    //   test("(-) add a generic_name with NULL generic_name", async () => {
    //     const generic_name = null;
    //     const name = "name";
    //     const roleFkId = 1;
    //     await expect(
    //       getClient().query("insert into medication (generic_name, name, fk_role_id) VALUES ($1,$2,$3)", [generic_name, name, roleFkId])
    //     ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    //   });

    test("(-) edit a medication generic_name by an id that does not exist", async () => {
        const id = 400;
        const newgeneric_name = "newgeneric_name";
        const res = await getClient().query("UPDATE medication SET generic_name = $1 WHERE id = $2", [newgeneric_name, id]);
        expect(res.rowCount).toBe(0);
    });
});
