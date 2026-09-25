import { playEnterFromProject } from './transitions.js';
import { showIndividualProject } from "./projects_array.js";

showIndividualProject();

// CURSOR GLOW
const cursorGlow = document.getElementById('cursor-glow');

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('.back-button').forEach((el) => {
  el.addEventListener('mouseenter', () => cursorGlow.classList.add('hidden'));
  el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hidden'));
});

// LOAD PROJECT CONTENT FROM THE DATABASE
// The URL looks like project.html?slug=querri — we read that slug, fetch that
// one project from the API, and drop its text into the page.
//  async function loadProject() {
//   const slug = new URLSearchParams(location.search).get('slug');
//   if (!slug) return; // no slug in the URL: leave the placeholder text as-is

//   let project;
//   try {
//     //const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
//     if (!res.ok) return;
//     project = await res.json();
//   } catch (err) {
//     console.error('Could not load project:', err);
//     return;
//   }

//   document.title = project.title;

//   const oneLiner = document.querySelector('.one-liner');
//   if (oneLiner && project.oneLiner) {
//     oneLiner.style.whiteSpace = 'pre-line'; // render the \n as a line break
//     oneLiner.textContent = project.oneLiner;
//   }

//   const label = document.querySelector('.project-label');
//   if (label) label.textContent = project.label ?? '';

//   const title = document.querySelector('.project-name-title');
//   if (title) title.textContent = project.title ?? '';

//   // Key Learnings: rebuild the <ol> from the array stored in the database
//   const learningsList = document.querySelector('.key-learnings ol');
//   if (learningsList && Array.isArray(project.keyLearnings)) {
//     learningsList.innerHTML = '';
//     project.keyLearnings.forEach((item) => {
//       const li = document.createElement('li');
//       li.textContent = item;
//       learningsList.appendChild(li);
//     });
//   }

//   // Match each section to its blurb by the header text (Goals/Research/etc.)
//   const blurbs = {
//     goals: project.goals,
//     research: project.research,
//     process: project.process,
//     outcome: project.outcome,
//   };
//   document.querySelectorAll('.trait-section').forEach((section) => {
//     const heading = section.querySelector('h2')?.textContent.trim().toLowerCase();
//     const paragraph = section.querySelector('.project-text p');
//     if (heading && paragraph && blurbs[heading] != null) {
//       paragraph.textContent = blurbs[heading];
//     }
//   });
//  }

//  loadProject();

// PAGE ENTER TRANSITION
// If we arrived from a project card, a colored curtain collapses into the Back
// button; otherwise this just fades the page in.
playEnterFromProject();

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.remove('page-loaded');
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});
