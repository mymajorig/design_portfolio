// Seed the database with sample project data. Run with:  npm run db:seed
// Re-running is safe: rows are matched by `slug` and updated in place.
import { db, schema } from './db/index.js';

// Placeholder project using the text from the Querri detail page (project.html).
const PROJECTS = [
  {
    slug: 'querri',
    title: 'Querri',
    headliner: 'A UI/UX Website Redesign',
    label: 'A WashUX Project',
    oneLiner: 'This is a one liner\nabout what I had to do',
    previewImage: '',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    goals:
      'Collaborated with other designers to serve as Pretus’ core design team, delivering iterative improvements while shaping a clear strategy for future growth. Our goal is to leverage strong UI/UX design principles to enhance the Pretus website so it is both visually compelling and intuitive, while clearly communicating the company’s mission and unique value. Through thoughtful design choices, we aimed to distinguish Pretus from other IB prep platforms and create a cohesive, standout digital experience that reinforces its brand identity.',
    research:
      'We began by auditing the existing experience and studying competing IB prep platforms to understand where Pretus could stand apart. Through user interviews and heuristic reviews, we mapped the pain points that kept prospective students from understanding the product’s value at a glance. These insights grounded every design decision that followed and gave the team a shared vocabulary for what a stronger experience needed to accomplish.',
    process:
      'Working in rapid iterations, we moved from low-fidelity wireframes to polished, interactive prototypes, testing each round with real users. We refined the information architecture so the mission and unique value read clearly on the first screen, then tightened the visual system for consistency across the site. Frequent design critiques kept the team aligned and let us fold feedback back into the work quickly.',
    outcome:
      'The redesigned experience gave Pretus a cohesive, standout identity that clearly communicates who it serves and why it matters. The new interface is both visually compelling and intuitive, reducing friction for prospective students and reinforcing the brand at every step. Beyond the immediate improvements, the work established a clear design strategy the team can carry forward as the platform continues to grow.',
    keyLearnings: ['Thing one', 'Thing two', 'Thing three'],
    sortOrder: 0,
  },
];

for (const p of PROJECTS) {
  db.insert(schema.projects)
    .values(p)
    .onConflictDoUpdate({ target: schema.projects.slug, set: p })
    .run();
  console.log(`Seeded: ${p.slug}`);
}

console.log('Done.');
