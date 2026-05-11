import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer } from "testcontainers";
import pkg from "pg";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;

let container;
let pool;

beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:15").start();

    pool = new Pool({
        connectionString: container.getConnectionString(),
    });

    const initSql = fs.readFileSync(
        path.join(__dirname, "../../initScripts/postgres/init.sql"),
        "utf-8"
    );

    await pool.query(initSql);
});

afterAll(async () => {
    await pool.end();
    await container.stop();
});

describe("Database tests", () => {
    test("should have patients in database", async () => {
        const res = await pool.query("SELECT * FROM patients");
        expect(res.rows.length).toBeGreaterThan(0);
    });

    test("appointments should reference valid patients", async () => {
        const res = await pool.query(`
      SELECT *
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE p.id IS NULL
    `);

        expect(res.rows.length).toBe(0);
    });

    test("should fetch at least one appointment", async () => {
        const res = await pool.query(`
      SELECT * FROM appointments LIMIT 1
    `);

        expect(res.rows.length).toBe(1);
    });
});