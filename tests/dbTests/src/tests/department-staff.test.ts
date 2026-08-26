import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("department_staff table - positive tests (+)", () => {
  test("(+) check count of department staff", async () => {
    const res = await getClient().query("SELECT COUNT(*) from department_staff");
    expect(res.rows[0].count).toBe("51"); // pg returns (COUNT) as string
  });

  test("(+) select departmentStaffs and check some of the values", async () => {
    const res = await getClient().query("SELECT fk_staff_id from department_staff");
    expect(res.rows[0].fk_staff_id).toBe(1);
    expect(res.rows[1].fk_staff_id).toBe(2);
    expect(res.rows[2].fk_staff_id).toBe(3);
    expect(res.rows[3].fk_staff_id).toBe(4);
  });

  // add
  test("(+) add new departmentStaff and check if it was added", async () => {
    const fk_department = 2;
    const fk_staff = 1;
    const newId = 52;
    const res = await getClient().query("INSERT INTO department_staff (fk_staff_id, fk_department_id) VALUES ($1, $2)", [fk_staff, fk_department]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT * FROM department_staff WHERE id = $1", [newId]);
    expect(check.rows[0].fk_staff_id).toBe(fk_staff);
    expect(check.rows[0].fk_department_id).toBe(fk_department);
    expect(check.rows[0].id).toBe(newId);
  });

  // edit
  test("(+) edit a departmentStaff", async () => {
    const id = 1;
    const newDepartmentId = 2;
    const oldStaffId = 1;

    const res = await getClient().query("UPDATE department_staff SET fk_department_id = $1 WHERE id = $2", [newDepartmentId, id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT * FROM department_staff WHERE id = $1", [id]);
    expect(check.rows[0].fk_staff_id).toBe(oldStaffId);
    expect(check.rows[0].fk_department_id).toBe(newDepartmentId);
  });

  // delete
  test("(+) delete a departmentStaff", async () => {
    const res = await getClient().query("DELETE FROM department_staff WHERE id = 51");
    expect(res.rowCount).toBe(1);
  });
});

describe("department_staff table - negative tests (-)", () => {
  //   test("(-) add a role with too long a name", async () => {
  //     const role = "1".repeat(51); // 51 chars
  //     await expect(
  //       getClient().query("insert into department_staff (name) VALUES ($1)", [role])
  //     ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
  //   });

  test("(-) add a new department_staff with NULL staffId", async () => {
    const staffId = null;
    const id = "1";
    const departmentId = "5";
    await expect(getClient().query("insert into department_staff (fk_staff_id, fk_department_id) VALUES ($1, $2)", [staffId, departmentId])).rejects.toMatchObject({ code: "23502" }); // not_null_violation
  });

  // test("(-) edit a department_staff by a staff id that does not exist", async () => {
  //   const id = 1;
  //   const newStaffId = 400;
  //   const res = await getClient().query("UPDATE department_staff SET fk_staff_id = $1 WHERE id = $2", [newStaffId, id]);
  //   expect(res.rowCount).toBe(0);
  // });

  test("(-) edit a department_staff by a staff id that does not exist", async () => {
    const id = 1;
    const newStaffId = 400;

    await expect(getClient().query("UPDATE department_staff SET fk_staff_id = $1 WHERE id = $2", [newStaffId, id])).rejects.toMatchObject({ code: "23503" }); // foreign_key_violation
  });
});
