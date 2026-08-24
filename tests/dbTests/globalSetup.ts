import { PostgreSqlContainer } from "@testcontainers/postgresql";
import pkg from "pg";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pkg;

// Runs once for the whole run: one Postgres container is shared by every
// file under tests/*.test.ts instead of each file starting (and tearing
// down) its own container.
export default async function setup() {
    const container = await new PostgreSqlContainer("postgres:16-alpine").start();

    const connection = {
        host: container.getHost(),
        port: container.getPort(),
        database: container.getDatabase(),
        user: container.getUsername(),
        password: container.getPassword(),
    };

    const client = new Client(connection);
    await client.connect();

    // Same schema + seed data the real app is initialized with, so the
    // tests run against a container that looks like a fresh production DB.
    const schemaSql = fs.readFileSync(
        path.join(__dirname, "../../initScripts/postgres/01_schema.sql"),
        "utf-8"
    );
    const seedSql = fs.readFileSync(
        path.join(__dirname, "../../initScripts/postgres/02_seed.sql"),
        "utf-8"
    );
    await client.query(schemaSql);
    await client.query(seedSql);
    await client.end();

    // Handed to each test file via env vars so openTestPool() (helpers/testDb.ts)
    // can connect without knowing about the container directly.
    process.env.TEST_PG_HOST = connection.host;
    process.env.TEST_PG_PORT = String(connection.port);
    process.env.TEST_PG_DATABASE = connection.database;
    process.env.TEST_PG_USER = connection.user;
    process.env.TEST_PG_PASSWORD = connection.password;

    return async () => {
        await container.stop();
    };
}
