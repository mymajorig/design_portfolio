import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { asc, eq } from 'drizzle-orm';
import { db, schema } from './db/index.js';

const app = new Hono();

// List all projects, ordered for the project-list grid.
app.get('/api/projects', (c) => {
  const rows = db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id))
    .all();
  return c.json(rows);
});

// A single project by its slug, for the detail page.
app.get('/api/projects/:slug', (c) => {
  const row = db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.slug, c.req.param('slug')))
    .get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
