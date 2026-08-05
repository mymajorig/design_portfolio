
const PROJECTS = [
  {
    slug: 'querri',
    title: 'Querri',
    headliner: 'A UI/UX Website Redesign',
    label: 'A WashUX Project',
    oneLiner: 'Helping users find answers before they know the questions.',
    previewImage: '/images/querri-logo-2.png',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    goals:
      "Delivering a polished, production-ready design solution requires a meticulous evaluation of the platform's foundation. The primary goal of this initiative is to optimize engagement and eliminate key friction points within the user journey, specifically targeting the initial activation path and long-term retention. By integrating a clear onboarding introduction to Querri, an AI-powered, no-code data analytics platform designed to make data accessible to people unfamiliar with data or who do not often deal with it, the interface immediately bridges the gap between business knowledge and data fluency. Focusing on the structural challenges that prevent non-technical business professionals from maximizing the platform's value, the project establishes a framework to transition casual usage into an indispensable, habit-forming daily routine.",
    impact: "Optimizing these user paths will generate a significant impact on product adoption metrics, directly driving Weekly Active Users (WAU) and Daily Active Users (DAU) upward. By systematically resolving the 'cold-start' dilemma, where individuals struggle to formulate apt data queries, and effectively managing perceived analysis latency, the system empowers users to extract a higher volume of valuable insights per session. Subsequently, this focus on efficiency and immediate value creation transforms data interactions from a complex, infrequent chore into a continuous, streamlined asset for strategic decision-making.",
    process:
      "The execution process operates as a 14-week sprint structured across three distinct phases to ensure technical alignment and user validation. Phase I (Weeks 1-4) focuses on Discovery and Definition, launching with a stakeholder kickoff to map product metrics, executing a detailed UX audit of the core interface, and conducting 3-5 user interviews to ground the problem space in empirical friction points.<br> Phase II (Weeks 5-10) center on Strategy and Design. Findings from Phase 1 are synthesized into explicit user flows and lo-fi wireframes to explore divergent concepts before developing high-fidelity interactive screens built strictly on Querri’s Poppins typography, Tangelo color palette, and generous border radius system tokens. <br>Finally, Phase III (Weeks 11-14) drives Refinement and Handoff, executing rigorous usability testing to validate the solution against the baseline experience, perfecting the interactive prototype, and delivering complete Figma redline specifications ready for engineering execution.",
    final_design: "The final design establishes an intuitive homepage and guidance experience featuring a tailored, three-question onboarding sequence designed to spin up a customized analyst experience immediately. By transitioning from a standard synchronous chat tool to a proactive, asynchronous analyst mental model, the interface strategically handles data latency while delivering automated, high-value insights. This modern interface leverages progressive disclosure to balance trust with speed, delivering production-ready interactive components and comprehensive redline specifications prepared for engineering handoff.",
    final_design_images: ["/images/blue-book.png", "/images/cake.png"],
      keyLearnings: ["<b>Designing for Digital Trust and Credibility:</b> <br> I always knew design played an important role in engaging users, but this project showed me just how much it influences a website's credibility. By intentionally using trust-building language, highlighting industry credentials, and creating a polished visual hierarchy with subtle depth instead of harsh boundaries, I realized that even small design decisions can make people feel more confident and comfortable interacting with a product.", 
        "<b>Designing Around Technical Limitations by Understanding User Expectations:</b> <br> A user's experience is shaped not only by what a product can do, but also by how the experience communicates limitations. When complex analyses required up to 15 minutes to complete, I realized that thoughtful design could shift the user's perception of waiting time. By reframing the experience from an immediate chat interaction into a more intentional asynchronous analysis process, we were able to set clearer expectations, reduce frustration, and create a more comfortable experience for users.", 
        "<b>Balancing Freedom with Guidance</b> <br> I originally expected the flexibility of an open-ended search bar to empower users, but I learned that too much freedom can sometimes create uncertainty. When users are unfamiliar with what their data can reveal, they may struggle to know where to begin. By introducing guided insights and proactive recommendations, we created a clearer path to value while helping users feel more confident and comfortable navigating the product"],
    sortOrder: 0,
    themeColor: '#e0662e'
  },
  {
    slug: 'pretus',
    title: 'Pretus',
    headliner: 'A UI/UX Website Redesign',
    label: 'A WashUX Project',
    oneLiner: "How can design make you stand out at first glance?",
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
    oneLiner: 'What Happens When Design Thinking Meets Sustainable Chemistry?',
    previewImage: '/images/the_wexler_group.webp',
    description:
      'Collaborated with other designers as the core design team, delivering iterative improvements while shaping a clear strategy for future growth.',
    goals:
    "Working with The Wexler Group, the goal of this research project was to develop a computational method for predicting the most stable atomic configurations of heterogeneous catalysts before they begin reacting. Because unstable catalyst structures can lose efficiency over time, accurately identifying low-energy configurations has the potential to improve energy conservation during industrial chemical production. <br> To simplify this problem, I used the Lennard-Jones potential to model atomic interactions and developed components of a Basin Hopping optimization algorithm capable of finding stable configurations. Throughout the project, I collaborated with a postdoctoral researcher and supervising professor while independently researching optimization techniques and implementing core portions of the algorithm.",    
    impact:
      "The long-term objective of this project is to incorporate the Basin Hopping algorithm and its supporting functions into a publicly available package that can be used by researchers studying catalyst stability and energy-efficient chemical production. Beyond its scientific applications, this experience strengthened my ability to communicate complex technical concepts through data visualization, quickly learn new programming languages and optimization libraries, and collaborate within an interdisciplinary research environment. It also reinforced the importance of building solutions that are reusable, scalable, and designed with future users in mind.",
    process:
        "The project began by building a strong foundation in numerical computing and optimization using Python libraries such as NumPy, SciPy, and Matplotlib before transitioning to Julia and the Optim package. I compared optimization methods including BFGS, Nelder-Mead, and Gradient Descent by benchmarking them on functions such as Rosenbrock and Booth, ultimately determining that BFGS provided the best performance. <br> I then designed and evaluated several approaches for calculating Lennard-Jones potential energy before selecting an implementation that accepts an N × 3 matrix of atomic coordinates because it was the most scalable and adaptable. Throughout development, I continuously tested, debugged, and refined the algorithm while using contour maps, energy plots, optimization paths, violin plots, and atomic configuration visualizations to better understand its performance and guide my decisions.",
    final_design:
      "The final solution is an optimization algorithm that accepts an N × 3 matrix of atomic positions, computes the total Lennard-Jones potential energy, applies the BFGS optimization method to determine the lowest-energy configuration, and visualizes the optimization process through energy progression plots. The experience demonstrated that thoughtful design extends beyond user interfaces, as creating an effective computational tool also requires balancing usability, scalability, efficiency, and clear communication through visualization.",
    final_design_images: ["/images/blue-book.png", "/images/cake.png"],
      keyLearnings: ["<b>Iteration drives better solutions.</b> <br> Developing an effective optimization algorithm required continuous testing, comparing approaches, and refining my implementation based on performance data. I learned that exploring multiple solutions is often more valuable than settling on the first one that works.", 
        "<b>Visualization can be a powerful problem-solving tool.</b> <br> Contour maps, plots, and graphs weren't just presentation materials, they helped me identify patterns, debug algorithms, and make informed decisions throughout the research process. This reinforced the importance of communicating complex information visually.", 
        "<b>Good design extends beyond interfaces.</b> <br> Although this wasn't a traditional UI/UX project, I found myself applying the same design mindset by balancing efficiency, scalability, and usability while creating a solution that other researchers can build upon. This experience showed me how thoughtful design can create meaningful impact in scientific and environmental applications."],
    sortOrder: 0,
    themeColor: "#C70000"
  },
];


function showProjectsList() {
  // loop over the projects JSON array of objects
  let ProjectHtml = '';
  PROJECTS.forEach((ThisProject) => {
    //console.log("this is the project we're looking at", {ThisProject})
    // create an html string
    //NOTE: style="--card-hover-accent:${ThisProject.themeColor}" takes the theme color created and js and converts it in a way that css can interpret it too so i can set accent colors for hover stuff in my css
    ProjectHtml += 
      `<a class="project" id="one" 
      href="project.html?slug=${ThisProject.slug}" 
      data-theme-color="${ThisProject.themeColor}" 
      style="--card-hover-accent:${ThisProject.themeColor}"> 
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