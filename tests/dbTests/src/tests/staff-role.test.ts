import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("staff_role table - positive tests (+)", () => {
  test("(+) check count of staff roles", async () => {
    const res = await getClient().query("SELECT COUNT(*) from staff_role");
    expect(res.rows[0].count).toBe("4"); // pg returns (COUNT) as string
  });

  test("(+) select roles and check the values", async () => {
    const res = await getClient().query("SELECT name from staff_role");
    expect(res.rows[0].name).toBe("doctor");
    expect(res.rows[1].name).toBe("nurse");
    expect(res.rows[2].name).toBe("admin");
    expect(res.rows[3].name).toBe("not-in-use");
  });

  // add
  test("(+) add new role and check if it was added", async () => {
    const name = "newAddedStaffRole"
    const newId = "5"
    const res = await getClient().query("INSERT INTO staff_role (name) VALUES ($1)", [name]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT name FROM staff_role WHERE id = $1", [newId]);
    expect(check.rows[0].name).toBe(name);
  });

  // edit
  test("(+) edit a staff role", async () => {
    const id = 4;
    const newName = "newRoleName";

    const res = await getClient().query("UPDATE staff_role SET name = $1 WHERE id = $2", [newName, id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT name FROM staff_role WHERE id = $1", [id]);
    expect(check.rows[0].name).toBe(newName);
  });

  // delete
  test("(+) delete a staff role", async () => {
    const res = await getClient().query("DELETE FROM staff_role WHERE id = 4");
    expect(res.rowCount).toBe(1);
  });
});

describe("staff_role table - negative tests (-)", () => {
  test("(-) add a role with too long a name", async () => {
    const role = "123456789-123456789-123456789-123456789-123456789-1"; // 53 chars
    await expect(
      getClient().query("insert into staff_role (name) VALUES ($1)", [role])
    ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
  });

  test("(-) add a role with NULL name", async () => {
    const role = null;
    await expect(
      getClient().query("insert into staff_role (name) VALUES ($1)", [role])
    ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
  });

  test("(-) edit a staff role by an id that does not exist", async () => {
    const id = 40;
    const newName = "newRoleName";
    const res = await getClient().query("UPDATE staff_role SET name = $1 WHERE id = $2", [newName, id]);
    expect(res.rowCount).toBe(0);
  });
});
