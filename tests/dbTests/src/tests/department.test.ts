import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("department table - positive tests (+)", () => {
  test("(+) check count of  departments", async () => {
    const res = await getClient().query("SELECT COUNT(*) from department");
    expect(res.rows[0].count).toBe("6"); // pg returns (COUNT) as string
  });

  test("(+) select departments and check the values", async () => {
    const res = await getClient().query("SELECT * from department");
    expect(res.rows[0].name).toBe("emergency");
    expect(res.rows[1].name).toBe("surgery");
    expect(res.rows[2].name).toBe("cardiology");
    expect(res.rows[0].type).toBe("critical care");
    expect(res.rows[1].type).toBe("operation");
    expect(res.rows[2].type).toBe("specialist");
  });

  // add
  test("(+) add new department and check if it was added", async () => {
    const name = "newAddedDepartment";
    const type = "type";
    const newId = 7;
    const res = await getClient().query("INSERT INTO department (name, type) VALUES ($1,$2)", [name,type]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT * FROM department WHERE id = $1", [newId]);
    expect(check.rows[0].name).toBe(name);
    expect(check.rows[0].type).toBe(type);
  });

  // edit
  test("(+) edit a department name", async () => {
    const id = 4;
    const newName = "newDepartmentName";

    const res = await getClient().query("UPDATE department SET name = $1 WHERE id = $2", [newName, id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT name FROM department WHERE id = $1", [id]);
    expect(check.rows[0].name).toBe(newName);
  });

  // delete
  test("(+) delete a department", async () => {
    const id = 6;
    const res = await getClient().query("DELETE FROM department WHERE id = $1", [id]);
    expect(res.rowCount).toBe(1);
  });
});

describe("department table - negative tests (-)", () => {
  test("(-) add a department with too long a name", async () => {
    const department = "1".repeat(101); 
    const type = "type";
    await expect(
      getClient().query("insert into department (name, type) VALUES ($1,$2)", [department, type])
    ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
  });

//   test("(-) add a department with NULL name", async () => {
//     const department = null;
//     const type = "type";
//     await expect(
//       getClient().query("insert into department (name, type) VALUES ($1,$2)", [department,type])
//     ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
//   });

  test("(-) edit a  department by an id that does not exist", async () => {
    const id = 40;
    const newName = "newDepartmentName";
    const res = await getClient().query("UPDATE department SET name = $1 WHERE id = $2", [newName, id]);
    expect(res.rowCount).toBe(0);
  });
});
