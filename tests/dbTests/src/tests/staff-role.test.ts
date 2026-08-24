import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { Client } from "pg";
import { getConnectionUri } from "../test-setup.js";

// A fresh client is opened after each test's snapshot restore (registered
// in test-setup.ts's beforeEach), since that restore kills existing connections.
let client: Client;

beforeEach(async () => {
  client = new Client({ connectionString: getConnectionUri() });
  await client.connect();
});

afterEach(async () => {
  await client.end();
});

describe("staff_role", () => {
  test("row with the lowest id is 'doctor'", async () => {
    const res = await client.query("SELECT name FROM staff_role ORDER BY id ASC LIMIT 1");
    expect(res.rows[0].name).toBe("doctor");
  });
});
