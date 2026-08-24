import { beforeAll, beforeEach } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const initScripts = path.join(__dirname, "../../../../initScripts/postgres");

let container: StartedPostgreSqlContainer | undefined;

beforeAll(async () => {
  // this is loaded across all tests, sicne isolate and  fileParallelism are sat to false
  if (container) return;

  container = await new PostgreSqlContainer("postgres:16-alpine").withDatabase("app_test").start();

  const client = new Client({ connectionString: container.getConnectionUri() });
  await client.connect();
  await client.query(readFileSync(path.join(initScripts, "01_schema.sql"), "utf-8"));
  await client.query(readFileSync(path.join(initScripts, "02_seed.sql"), "utf-8"));
  await client.end();

  await container.snapshot();
}, 60_000);

beforeEach(async () => {
  await container!.restoreSnapshot();
});

export function getConnectionUri() {
  return container!.getConnectionUri();
}
