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
}
