import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("patient table - positive tests (+)", () => {
    test("(+) check count of  patients", async () => {
        const res = await getClient().query("SELECT COUNT(*) from patient");
        expect(res.rows[0].count).toBe("26"); // pg returns (COUNT) as string
    });

    test("(+) select patients and check the values", async () => {
        const res = await getClient().query("SELECT * from patient");
        expect(res.rows[0].firstname).toBe("michael");
        expect(res.rows[1].firstname).toBe("darlene");
        expect(res.rows[5].firstname).toBe("sharon");
        expect(res.rows[0].lastname).toBe("conklin");
        expect(res.rows[1].lastname).toBe("kelly");
        expect(res.rows[5].lastname).toBe("miller");
    });

    // add
    test("(+) add new patient and check if it was added", async () => {
        const firstname = "newAddedpatient";
        const lastname = "lastname";
        const newId = 27;
        const gender = "test";
        const cpr = "12341234-1234";
        const birth = "1959-01-10";
        const weight = 123;
        const height = 180;
        const res = await getClient().query("INSERT INTO patient (firstname, lastname, gender, cpr_number, date_of_birth, weight_kg, height_cm) VALUES ($1,$2,$3,$4,$5,$6,$7)", [firstname, lastname, gender, cpr, birth, weight, height]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT firstname FROM patient WHERE id = $1", [newId]);
        expect(check.rows[0].firstname).toBe(firstname);
    });

    // edit
    test("(+) edit a patient firstname", async () => {
        const id = 4;
        const newfirstname = "newpatientfirstname";

        const res = await getClient().query("UPDATE patient SET firstname = $1 WHERE id = $2", [newfirstname, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT firstname FROM patient WHERE id = $1", [id]);
        expect(check.rows[0].firstname).toBe(newfirstname);
    });

    // delete
    test("(+) make a new patient and then delete that patient", async () => {
        const firstname = "newAddedpatient";
        const lastname = "lastname";
        const newId = 27;
        const gender = "test";
        const cpr = "12341234-1234";
        const birth = "1959-01-10";
        const weight = 123;
        const height = 180;
        const res = await getClient().query("INSERT INTO patient (firstname, lastname, gender, cpr_number, date_of_birth, weight_kg, height_cm) VALUES ($1,$2,$3,$4,$5,$6,$7)", [firstname, lastname, gender, cpr, birth, weight, height]);
        expect(res.rowCount).toBe(1);
        
        const check = await getClient().query("DELETE FROM patient WHERE id = $1", [newId]);
        expect(check.rowCount).toBe(1);
    });
});

describe("patient table - negative tests (-)", () => {
    test("(-) add a patient with too long a firstname", async () => {
        const firstname = "1".repeat(101);
        const lastname = "lastname";
        const gender = "test";
        const cpr = "12341234-1234";
        const birth = "1959-01-10";
        const weight = 123;
        const height = 180;
        await expect(
            getClient().query("insert into patient (firstname, lastname, gender, cpr_number, date_of_birth, weight_kg, height_cm) VALUES ($1,$2,$3,$4,$5,$6,$7)", [firstname, lastname, gender, cpr, birth, weight, height])
        ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    });

    // test("(-) add a patient with NULL firstname", async () => {
    //     const firstname = null;
    //     const lastname = "lastname";
    //     const gender = "test";
    //     const cpr = "12341234-1234";
    //     const birth = "1959-01-10";
    //     const weight = 123;
    //     const height = 180;
    //     await expect(
    //         getClient().query("insert into patient (firstname, lastname, gender, cpr_number, date_of_birth, weight_kg, height_cm) VALUES ($1,$2,$3,$4,$5,$6,$7)", [firstname, lastname, gender, cpr, birth, weight, height])
    //     ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    // });

    test("(-) edit a patient by an id that does not exist", async () => {
        const id = 260;
        const newfirstname = "newpatientfirstname";
        const res = await getClient().query("UPDATE patient SET firstname = $1 WHERE id = $2", [newfirstname, id]);
        expect(res.rowCount).toBe(0);
    });
});
