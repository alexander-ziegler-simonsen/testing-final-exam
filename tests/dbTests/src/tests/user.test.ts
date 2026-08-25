import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("user table - positive tests (+)", () => {
  test("(+) check count of user", async () => {
    const res = await getClient().query('SELECT COUNT(*) from "user"');
    expect(res.rows[0].count).toBe("6"); // pg returns (COUNT) as string
  });

  test("(+) select user and check the values", async () => {
    const res = await getClient().query('SELECT username from "user"');
    expect(res.rows[0].username).toBe("larsc");
    expect(res.rows[1].username).toBe("doctor");
    expect(res.rows[2].username).toBe("annaj");
    expect(res.rows[3].username).toBe("nurse");
    expect(res.rows[4].username).toBe("admin");
  });

  // add
  test("(+) add new user and check if it was added", async () => {
    const username = "newUserName";
    const password = "password";
    const salt = "salt";
    const fk_staff_id = 1;
    const newId = 7;
    const res = await getClient().query('INSERT INTO "user" (username, password_hash, salt, fk_staff_id) VALUES ($1,$2,$3,$4)', [username, password, salt, fk_staff_id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query('SELECT * FROM "user" WHERE id = $1', [newId]);

    expect(check.rows[0].username).toBe(username);
    expect(check.rows[0].password_hash).toBe(password);
    expect(check.rows[0].salt).toBe(salt);
    expect(check.rows[0].fk_staff_id).toBe(fk_staff_id);
  });

  // edit
  test("(+) edit a user", async () => {
    const id = 1;
    const newUserName = "newUserName";

    const res = await getClient().query('UPDATE "user" SET username = $1 WHERE id = $2', [newUserName, id]);
    expect(res.rowCount).toBe(1);

    const check = await getClient().query('SELECT username FROM "user" WHERE id = $1', [id]);
    expect(check.rows[0].username).toBe(newUserName);
  });

  // delete
  test("(+) delete a user", async () => {
    const id = 5;
    const res = await getClient().query('DELETE FROM "user" WHERE id = $1', [id]);
    expect(res.rowCount).toBe(1);
  });
});

describe("user table - negative tests (-)", () => {
  test("(-) add a user with too long a username", async () => {
    const password = "password";
    const salt = "salt";
    const fk_staff_id = 1;
    // 101 chars
    const userName = "123456789x123456789x123456789x123456789x123456789x123456789x123456789x123456789x123456789x123456789x1";
    await expect(getClient().query('INSERT INTO "user" (username, password_hash, salt, fk_staff_id) VALUES ($1,$2,$3,$4)', [userName, password, salt, fk_staff_id])).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
  });

  test("(-) add a user with NULL username", async () => {
    const username = null;
    const password = "password";
    const salt = "salt";
    const fk_staff_id = 1;
    await expect(getClient().query('INSERT INTO "user" (username, password_hash, salt, fk_staff_id) VALUES ($1,$2,$3,$4)', [username, password, salt, fk_staff_id])).rejects.toMatchObject({ code: "23502" }); // not_null_violation
  });

  test("(-) edit a user by an id that does not exist", async () => {
    const id = 400;
    const newUserName = "newUserName";
    const res = await getClient().query('UPDATE "user" SET username = $1 WHERE id = $2', [newUserName, id]);
    expect(res.rowCount).toBe(0);
  });
});
