import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// One row per portfolio project. Fields map to what the pages render:
// list card (title/headliner/previewImage) and detail page (label/oneLiner/
// description/keyLearnings).
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // stable, URL-safe identifier used in project.html?slug=...
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  headliner: text('headliner'),
  label: text('label'),
  oneLiner: text('one_liner'),
  previewImage: text('preview_image'),
  description: text('description'),
  // stored as a JSON array of strings, e.g. ["Thing one", "Thing two"]
  keyLearnings: text('key_learnings', { mode: 'json' }),
  // lower numbers show first on the project list
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
