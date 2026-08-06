import pkg from "pg";

const { Pool } = pkg;

// Connects to the single Postgres container started once in globalSetup.js.
// Each test file opens its own Pool and closes it in afterAll; the
// container itself is only stopped after the whole run finishes.
export function openTestPool() {
    return new Pool({
        host: process.env.TEST_PG_HOST,
        port: Number(process.env.TEST_PG_PORT),
        database: process.env.TEST_PG_DATABASE,
        user: process.env.TEST_PG_USER,
        password: process.env.TEST_PG_PASSWORD,
    });
}
