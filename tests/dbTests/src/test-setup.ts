import { afterEach, beforeAll, beforeEach } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const initScripts = path.join(__dirname, "../../../initScripts/postgres");

let container: StartedPostgreSqlContainer | undefined;
let client: Client | undefined;

beforeAll(async () => {
  // this is loaded across all tests, sicne isolate and  fileParallelism are sat to false
  if (container) return;

  container = await new PostgreSqlContainer("postgres:16-alpine").withDatabase("app_test").start();

  const setupClient = new Client({ connectionString: container.getConnectionUri() });
  await setupClient.connect();
  await setupClient.query(readFileSync(path.join(initScripts, "01_schema.sql"), "utf-8"));
  await setupClient.query(readFileSync(path.join(initScripts, "02_seed.sql"), "utf-8"));
  await setupClient.end();

  await container.snapshot();
}, 60_000);

// restoreSnapshot() kills existing connections, so a fresh client is opened
// after each restore and handed to tests via getClient().
beforeEach(async () => {
  await container!.restoreSnapshot();
  client = new Client({ connectionString: container!.getConnectionUri() });
  await client.connect();
});

afterEach(async () => {
  await client?.end();
});

export function getClient(): Client {
  return client!;
}

export function getConnectionUri() {
  return container!.getConnectionUri();
}
