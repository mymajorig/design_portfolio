// Standalone demo server: serves the demo page AND the project API from the
// SAME origin (so no Vite proxy / CORS changes are needed). Reuses your real
// db layer. Run it with:  node server/demo.js   then open the printed URL.
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { asc, eq } from 'drizzle-orm';
import { db, schema } from './db/index.js';

// Shown ONLY when your projects table is empty, so the demo has something to
// render. These live in memory — nothing is written to portfolio.db.
const SAMPLE = [
  {
    slug: 'querri',
    title: 'Querri',
    headliner: 'A UI/UX Website Redesign',
    label: 'A WashUX Project',
    oneLiner: 'This is a one liner\nabout what I had to do',
    previewImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCdq2pOp2SDxA-psAVSyqzKE0g2ewPXefkSHhoai9xJ4iS9hxdvriw4jqv&s=10',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    keyLearnings: ['Design systems', 'User research', 'Prototyping in Figma'],
  },
  {
    slug: 'sample-two',
    title: 'Sample Project Two',
    headliner: 'A Brand Identity Study',
    label: 'A Personal Project',
    oneLiner: 'A second sample row\nso the grid has variety',
    previewImage: '',
    description: 'Placeholder project so the demo grid shows more than one item.',
    keyLearnings: ['Typography', 'Color theory'],
  },
  {
    slug: 'sample-three',
    title: 'Sample Project Three',
    headliner: 'A Motion Experiment',
    label: 'A Course Project',
    oneLiner: 'A third sample row',
    previewImage: '',
    description: 'Another placeholder to demonstrate rendering multiple projects.',
    keyLearnings: ['Animation timing'],
  },
];

const app = new Hono();

// Same endpoints as your real API, with the sample fallback added.
app.get('/api/projects', (c) => {
  const rows = db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id))
    .all();
  return c.json(rows.length ? rows : SAMPLE);
});

app.get('/api/projects/:slug', (c) => {
  const slug = c.req.param('slug');
  const row =
    db.select().from(schema.projects).where(eq(schema.projects.slug, slug)).get() ??
    SAMPLE.find((p) => p.slug === slug);
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

// Serve the two demo files.
app.get('/', serveStatic({ path: './demo/index.html' }));
app.get('/demo.js', serveStatic({ path: './demo/demo.js' }));

const port = Number(process.env.DEMO_PORT ?? 4000);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Demo running at http://localhost:${info.port}`);
});
