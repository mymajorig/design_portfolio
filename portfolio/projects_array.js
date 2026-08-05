
const PROJECTS = [
  {
    slug: 'querri',
    title: 'Querri',
    headliner: 'A UI/UX Website Redesign',
    label: 'A WashUX Project',
    oneLiner: 'This is a one liner\nabout what I had to do',
    previewImage: '/images/querri-logo.jpeg',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    goals:
      'Collaborated with other designers to serve as Pretus’ core design team, delivering iterative improvements while shaping a clear strategy for future growth. Our goal is to leverage strong UI/UX design principles to enhance the Pretus website so it is both visually compelling and intuitive, while clearly communicating the company’s mission and unique value. Through thoughtful design choices, we aimed to distinguish Pretus from other IB prep platforms and create a cohesive, standout digital experience that reinforces its brand identity.',
    impact:
      'We began by auditing the existing experience and studying competing IB prep platforms to understand where Pretus could stand apart. Through user interviews and heuristic reviews, we mapped the pain points that kept prospective students from understanding the product’s value at a glance. These insights grounded every design decision that followed and gave the team a shared vocabulary for what a stronger experience needed to accomplish.',
    process:
      'Working in rapid iterations, we moved from low-fidelity wireframes to polished, interactive prototypes, testing each round with real users. We refined the information architecture so the mission and unique value read clearly on the first screen, then tightened the visual system for consistency across the site. Frequent design critiques kept the team aligned and let us fold feedback back into the work quickly.',
    final_design:
      'The redesigned experience gave Pretus a cohesive, standout identity that clearly communicates who it serves and why it matters. The new interface is both visually compelling and intuitive, reducing friction for prospective students and reinforcing the brand at every step. Beyond the immediate improvements, the work established a clear design strategy the team can carry forward as the platform continues to grow.',
    final_design_images: ["/images/blue-book.png", "/images/cake.png"],
      keyLearnings: ['Thing one', 'Thing two', 'Thing three'],
    sortOrder: 0,
    themeColor: '#e0662e'
  },
  {
    slug: 'pretus',
    title: 'Pretus',
    headliner: 'A UI/UX Website Redesign',
    label: 'A WashUX Project',
    oneLiner: 'This is a one liner\nabout what I had to do',
    previewImage: '/images/pretus-logo.jpeg',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    goals:
      'Collaborated with other designers to serve as Pretus’ core design team, delivering iterative improvements while shaping a clear strategy for future growth. Our goal is to leverage strong UI/UX design principles to enhance the Pretus website so it is both visually compelling and intuitive, while clearly communicating the company’s mission and unique value. Through thoughtful design choices, we aimed to distinguish Pretus from other IB prep platforms and create a cohesive, standout digital experience that reinforces its brand identity.',
    impact:
      'Our design directly influenced Pretus’ digital direction, culminating in the company adopting one of our final website designs. The redesigned interface strengthened brand clarity, improved visual cohesion, and more clearly communicated Pretus’ mission and competitive positioning within the IB prep market. By aligning user experience with strategic goals, our work provided Pretus with a scalable foundation for future growth and continued iteration.',
    process:
      'Working in rapid iterations, we moved from low-fidelity wireframes to polished, interactive prototypes, testing each round with real users. We refined the information architecture so the mission and unique value read clearly on the first screen, then tightened the visual system for consistency across the site. Frequent design critiques kept the team aligned and let us fold feedback back into the work quickly.',
    final_design:
      'The redesigned experience gave Pretus a cohesive, standout identity that clearly communicates who it serves and why it matters. The new interface is both visually compelling and intuitive, reducing friction for prospective students and reinforcing the brand at every step. Beyond the immediate improvements, the work established a clear design strategy the team can carry forward as the platform continues to grow.',
    final_design_images: ["/images/blue-book.png", "/images/cake.png"],
      keyLearnings: ['Thing one', 'Thing two', 'Thing three'],
    sortOrder: 0,
    themeColor: 'rgb(13, 148, 136)'
  },
  {
    slug: 'wexler',
    title: 'Optimization of Lennard Jones and Atomic Configurations for Potential Energy',
    headliner: 'A Computational Chemistry Design',
    label: 'A WashUX Project',
    oneLiner: 'This is a one liner\nabout what I had to do',
    previewImage: '',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    goals:
      'Collaborated with other designers to serve as Pretus’ core design team, delivering iterative improvements while shaping a clear strategy for future growth. Our goal is to leverage strong UI/UX design principles to enhance the Pretus website so it is both visually compelling and intuitive, while clearly communicating the company’s mission and unique value. Through thoughtful design choices, we aimed to distinguish Pretus from other IB prep platforms and create a cohesive, standout digital experience that reinforces its brand identity.',
    impact:
      'We began by auditing the existing experience and studying competing IB prep platforms to understand where Pretus could stand apart. Through user interviews and heuristic reviews, we mapped the pain points that kept prospective students from understanding the product’s value at a glance. These insights grounded every design decision that followed and gave the team a shared vocabulary for what a stronger experience needed to accomplish.',
    process:
      'Working in rapid iterations, we moved from low-fidelity wireframes to polished, interactive prototypes, testing each round with real users. We refined the information architecture so the mission and unique value read clearly on the first screen, then tightened the visual system for consistency across the site. Frequent design critiques kept the team aligned and let us fold feedback back into the work quickly.',
    final_design:
      'The redesigned experience gave Pretus a cohesive, standout identity that clearly communicates who it serves and why it matters. The new interface is both visually compelling and intuitive, reducing friction for prospective students and reinforcing the brand at every step. Beyond the immediate improvements, the work established a clear design strategy the team can carry forward as the platform continues to grow.',
    final_design_images: ["/images/blue-book.png", "/images/cake.png"],
      keyLearnings: ['Thing one', 'Thing two', 'Thing three'],
    sortOrder: 0,
  },
];


function showProjectsList() {
  // loop over the projects JSON array of objects
  let ProjectHtml = '';
  PROJECTS.forEach((ThisProject) => {
    //console.log("this is the project we're looking at", {ThisProject})
    // create an html string
    ProjectHtml += 
      `<a class="project" id="one" href="project.html?slug=${ThisProject.slug}" data-theme-color="${ThisProject.themeColor}">
            <img class="project-preview" src="${ThisProject.previewImage}" alt="project-image">
            <div class="project-text">
                <h1 class="project-title">${ThisProject.title}</h1>
                <h2 class="project-headliner">${ThisProject.headliner}</h2>
            </div>
        </a>`
    ;
  })
  // insert string into dom
  document.getElementById("project-grid").innerHTML = ProjectHtml;
}

function showIndividualProject() { 

    ProjectHtmlHeader = '';
    ProjectHtmlSection = '';
  // this is where you would read the URL parameter of which slug you want to view
  const project_parameters = new URLSearchParams(window.location.search); //building a new constructor
  const slug = project_parameters.get("slug");
  
  // loop over the projects JSON array to find the one that matches the slug 

  const project = PROJECTS.find((project) => project.slug == slug);
  document.documentElement.style.setProperty('--theme-color', project.themeColor); //after you've found the project, apply the corresponding theme color

  ProjectHtmlHeader +=
  `
  <a href="index.html" class="back-button">Back</a>

        <div class="header-content">
            <div class="header-text">
                <p class="one-liner">${project.oneLiner}</p>
                <div class="project-name">
                    <h3 class="project-label">${project.label}</h3>
                    <h1 class="project-name-title">${project.title}</h1>
                </div>
            </div>

            <div class="header-3d" id="header-3d"></div> 
        </div>
  `
  document.querySelector("header").innerHTML = ProjectHtmlHeader;

  // build the section body — same pattern as the header, but keyLearnings is an
  // array, so we .map() each item into an <li> and .join('') them into one string
  ProjectHtmlSection +=
  `
  <section class="key-learnings">
      <h3><span class="highlight">Key Learnings</span></h3>
      <ol>
          ${project.keyLearnings.map((learning) => `<li>${learning}</li>`).join('')}
      </ol>
  </section>

  <section class="goals trait-section">
      <header class="trait-header">
          <h2>Goals</h2>
          <div class="trait-header-3d" id="trait-header-3d"></div>
      </header>
      <div class="project-text">
          <p>${project.goals}</p>
      </div>
  </section>

  <section class="trait-section">
      <header class="trait-header">
          <h2>Impact</h2>
          <div class="trait-header-3d" id="research-3d"></div>
      </header>
      <div class="project-text">
          <p>${project.impact}</p>
      </div>
  </section>

  <section class="trait-section">
      <header class="trait-header">
          <h2>Process</h2>
          <div class="trait-header-3d" id="process-3d"></div>
      </header>
      <div class="project-text">
          <p>${project.process}</p>
      </div>
  </section>

  <section class="trait-section">
      <header class="trait-header">
          <h2>Final Design</h2>
          <div class="trait-header-3d" id="outcome-3d"></div>
      </header>
      <div class="project-text">
          <p>${project.final_design}</p>
      </div>
  </section>
  `
  document.querySelector(".info-container").innerHTML = ProjectHtmlSection;
}