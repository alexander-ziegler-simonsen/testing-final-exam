import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("staff table - positive tests (+)", () => {
    test("(+) check count of staff firstnames", async () => {
        const res = await getClient().query("SELECT COUNT(*) from staff");
        expect(res.rows[0].count).toBe("52"); // pg returns (COUNT) as string
    });

    test("(+) select firstnames and check the values", async () => {
        const res = await getClient().query("SELECT * from staff");
        expect(res.rows[0].firstname).toBe("lars");
        expect(res.rows[0].lastname).toBe("christensen");
        expect(res.rows[0].fk_role_id).toBe(1);
        expect(res.rows[1].firstname).toBe("eva");
        expect(res.rows[1].lastname).toBe("møller");
        expect(res.rows[1].fk_role_id).toBe(1);
        expect(res.rows[25].firstname).toBe("anna");
        expect(res.rows[25].lastname).toBe("jensen");
        expect(res.rows[25].fk_role_id).toBe(2);
    });

    // add
    test("(+) add new firstname and check if it was added", async () => {
        const firstname = "newAddedStafffirstname";
        const newId = 53;
        const lastname = "lastname";
        const fkRoleId = 1;
        const res = await getClient().query("INSERT INTO staff (firstname, lastname, fk_role_id) VALUES ($1,$2,$3)", [firstname, lastname, fkRoleId]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT * FROM staff WHERE id = $1", [newId]);
        expect(check.rows[0].firstname).toBe(firstname);
        expect(check.rows[0].lastname).toBe(lastname);
        expect(check.rows[0].id).toBe(newId);

    });

    // edit
    test("(+) edit a staff firstname", async () => {
        const id = 4;
        const newfirstname = "newfirstnamefirstname";

        const res = await getClient().query("UPDATE staff SET firstname = $1 WHERE id = $2", [newfirstname, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT firstname FROM staff WHERE id = $1", [id]);
        expect(check.rows[0].firstname).toBe(newfirstname);
    });

    // delete
    test("(+) delete a staff", async () => {
        const id = 52;
        const res = await getClient().query("DELETE FROM staff WHERE id = $1", [id]);
        expect(res.rowCount).toBe(1);
    });
});

describe("staff table - negative tests (-)", () => {
    test("(-) add a staff with too long a firstname", async () => {
        const firstname = "1".repeat(101);
        const lastname = "lastname";
        const roleFkId = 1;
        await expect(
            getClient().query("insert into staff (firstname, lastname, fk_role_id) VALUES ($1,$2,$3)", [firstname, lastname, roleFkId])
        ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    });

    //   test("(-) add a firstname with NULL firstname", async () => {
    //     const firstname = null;
    //     const lastname = "lastname";
    //     const roleFkId = 1;
    //     await expect(
    //       getClient().query("insert into staff (firstname, lastname, fk_role_id) VALUES ($1,$2,$3)", [firstname, lastname, roleFkId])
    //     ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    //   });

    test("(-) edit a staff firstname by an id that does not exist", async () => {
        const id = 400;
        const newfirstname = "newfirstnamefirstname";
        const res = await getClient().query("UPDATE staff SET firstname = $1 WHERE id = $2", [newfirstname, id]);
        expect(res.rowCount).toBe(0);
    });
});
