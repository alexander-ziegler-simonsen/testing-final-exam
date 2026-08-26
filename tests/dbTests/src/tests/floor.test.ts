import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("floor table - positive tests (+)", () => {
  test("(+) check count of  floors", async () => {
    const res = await getClient().query("SELECT COUNT(*) from floor");
    expect(res.rows[0].count).toBe("7"); // pg returns (COUNT) as string
  });

  test("(+) select floors and check the values", async () => {
    const res = await getClient().query("SELECT * from floor");
    expect(res.rows[0].name).toBe("ground floor");
    expect(res.rows[1].name).toBe("first floor");
    expect(res.rows[5].name).toBe("second floor");
    expect(res.rows[0].fk_building_id).toBe(1);
    expect(res.rows[1].fk_building_id).toBe(1);
    expect(res.rows[5].fk_building_id).toBe(2);
  });

  // add
  test("(+) add new floor and check if it was added", async () => {
    const name = "newAddedFloor";
    const buildingId = 1;
    const newId = 8;
    const res = await getClient().query("INSERT INTO floor (name, fk_building_id) VALUES ($1,$2)", [name,buildingId]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT name FROM floor WHERE id = $1", [newId]);
    expect(check.rows[0].name).toBe(name);
  });

  // edit
  test("(+) edit a floor name", async () => {
    const id = 4;
    const newName = "newfloorName";

    const res = await getClient().query("UPDATE floor SET name = $1 WHERE id = $2", [newName, id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query("SELECT name FROM floor WHERE id = $1", [id]);
    expect(check.rows[0].name).toBe(newName);
  });

  // delete
  test("(+) delete a floor", async () => {
    const id = 7;
    const res = await getClient().query("DELETE FROM floor WHERE id = $1", [id]);
    expect(res.rowCount).toBe(1);
  });
});

describe("floor table - negative tests (-)", () => {
  test("(-) add a floor with too long a name", async () => {
    const floor = "1".repeat(101); 
    const buildingId = 1;
    await expect(
      getClient().query("insert into floor (name, fk_building_id) VALUES ($1,$2)", [floor, buildingId])
    ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
  });

  test("(-) add a floor with NULL name", async () => {
    const floor = null;
    const buildingId = 1;
    await expect(
      getClient().query("insert into floor (name, fk_building_id) VALUES ($1,$2)", [floor,buildingId])
    ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
  });

  test("(-) edit a  floor by an id that does not exist", async () => {
    const id = 40;
    const newName = "newfloorName";
    const res = await getClient().query("UPDATE floor SET name = $1 WHERE id = $2", [newName, id]);
    expect(res.rowCount).toBe(0);
  });
});
