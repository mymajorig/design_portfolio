import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

// DB_PATH lets a host point at a mounted volume; defaults to a file in the repo.
const sqlite = new Database(process.env.DB_PATH ?? 'portfolio.db');
// WAL improves concurrent read/write behavior and is standard for app use.
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export { schema };
