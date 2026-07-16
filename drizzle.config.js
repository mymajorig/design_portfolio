import { defineConfig } from 'drizzle-kit';

// Used by drizzle-kit (generate/migrate/push/studio). Switching to Postgres
// later is mostly changing `dialect` + `dbCredentials` here and the driver in
// server/db/index.js — the schema and queries stay the same.
export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DB_PATH ?? 'portfolio.db',
  },
});
