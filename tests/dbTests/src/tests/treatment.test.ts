import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("treatment table - positive tests (+)", () => {
  test("(+) check count of treatments", async () => {
    const res = await getClient().query("SELECT COUNT(*) from treatment");
    expect(res.rows[0].count).toBe('26'); // pg returns (COUNT) as string
  });

  test("(+) select treatments and check the values", async () => {
    const res = await getClient().query("SELECT description from treatment");
    expect(res.rows[0].description).toBe("fever and headache");
    expect(res.rows[1].description).toBe("bacterial infection");
    expect(res.rows[2].description).toBe("cholesterol check");
    expect(res.rows[3].description).toBe("asthma management");
  });

  // add
  test("(+) add new treatment and check if it was added", async () => {
    const description = "yep, treatment was made here";
    const newId = 27;
    const patientId = 1;
    const current_timestamp = new Date().toISOString();
    const res = await getClient().query("INSERT INTO treatment (fk_patient_id, description, time) VALUES ($1,$2, $3)", [patientId, description, current_timestamp]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT fk_patient_id, description, to_char(time, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS') as time FROM treatment WHERE id = $1", [newId]);
    expect(check.rows[0].fk_patient_id).toBe(patientId);
    expect(check.rows[0].description).toBe(description);
    expect(check.rows[0].time).toBe(current_timestamp.replace('Z', ''));
  });

  // edit
  test("(+) edit a treatment", async () => {
    const id = 4;
    const newDescription = "this is a edited treatment";

    const res = await getClient().query("UPDATE treatment SET description = $1 WHERE id = $2", [newDescription, id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT description FROM treatment WHERE id = $1", [id]);
    expect(check.rows[0].description).toBe(newDescription);
  });

  // delete
  // does not work , since FK is in used somewhere else.
  // get this error - 23503
//   test("(+) delete a treatment", async () => {
//     const res = await getClient().query("DELETE FROM treatment WHERE id = 4");
//     expect(res.rowCount).toBe(1);
//   });
});

describe("treatment table - negative tests (-)", () => {
  test("(-) add a treatment with too long a description", async () => {
    const patientId = 1;
    const current_timestamp = new Date().toISOString();
    const treatment = "1".repeat(501); // 501 chars
    await expect(getClient().query("insert into treatment (fk_patient_id,description,time) VALUES ($1,$2,$3)", [patientId, treatment, current_timestamp])).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
  });

  // no null constaints
//   test("(-) add a treatment with NULL description", async () => {
//     const treatment = null;
//     const patientId = 1;
//     const current_timestamp = new Date().toISOString();
//     await expect(getClient().query("insert into treatment (fk_patient_id,description,time) VALUES ($1,$2,$3)", [patientId, treatment, current_timestamp])).rejects.toMatchObject({ code: "23502" }); // not_null_violation
//   });

  test("(-) edit a treatment by an id that does not exist", async () => {
    const id = 400;
    const newdescription = "newtreatmentdescription";
    const res = await getClient().query("UPDATE treatment SET description = $1 WHERE id = $2", [newdescription, id]);
    expect(res.rowCount).toBe(0);
  });
});
