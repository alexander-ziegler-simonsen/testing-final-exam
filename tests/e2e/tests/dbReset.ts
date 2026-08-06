import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } = process.env;

export async function resetDb() {
  const client = new Client({
    host: 'localhost',
    port: Number(POSTGRES_PORT),
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: 'postgres',
  });

  await client.connect();
  try {
    await client.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [POSTGRES_DB],
    );
    await client.query(`DROP DATABASE IF EXISTS "${POSTGRES_DB}"`);
    await client.query(`CREATE DATABASE "${POSTGRES_DB}" TEMPLATE "${POSTGRES_DB}_template"`);
  } finally {
    await client.end();
  }

  // Dropping the database also invalidates the API's pooled Npgsql connections.
  // Poll the login endpoint (always does a DB lookup) until the API has
  // reconnected, so callers don't race ahead of it with a real request.
  await waitForApiReady();
}

async function waitForApiReady() {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    try {
      const res = await fetch('http://localhost:5028/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: '__db_reset_healthcheck__', password: '__db_reset_healthcheck__' }),
      });
      if (res.status === 200 || res.status === 401) return;
    } catch {
      // API not accepting connections yet, or still failing over to the new database - retry.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error('API did not reconnect to the database after resetDb()');
}
