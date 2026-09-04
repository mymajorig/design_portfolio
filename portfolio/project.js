import * as THREE from 'three';
import { playEnterFromProject } from './transitions.js';

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

// ============================================================================
// 3D LANDSCAPE WALKTHROUGH STRUCTURE
// ============================================================================
// To replace this placeholder with a video walkthrough:
// Option A: Set `type: 'video'` and `src: 'videos/your-walkthrough.mp4'` in WALKTHROUGH_CONFIG below.
// Option B: Add `walkthroughVideo: 'videos/your-walkthrough.mp4'` to the project in `projects_array.js`.
// You can also call `window.setWalkthroughMedia({ type: 'video', src: '...' })` anytime.
// ============================================================================

export const WALKTHROUGH_CONFIG = {
  type: 'image', // 'image' | 'video' | 'placeholder'
  src: '',       // Path to video (mp4/webm) or image file. If empty, uses project preview/placeholder.
  autoplay: true,
  loop: true,
  muted: true,   // Keep true to allow browser autoplay without blocking
};

const container = document.querySelector('#header-3d');
if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 11;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const pictureGroup = new THREE.Group();
  scene.add(pictureGroup);

  // Read the project's theme color (set on <html> by showIndividualProject)
  const themeColorValue = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-color').trim() || '#e0662e';

  // Read current project info from projects_array.js (by URL slug)
  const currentSlug = new URLSearchParams(window.location.search).get('slug') || 'querri';
  const currentProject = (typeof PROJECTS !== 'undefined')
    ? (PROJECTS.find((p) => p.slug === currentSlug) || PROJECTS[0])
    : null;
  const projectTitle = currentProject?.title || (document.querySelector('.project-name-title')?.textContent || 'Project').trim();

  // 16:10 Landscape Dimensions
  const width = 9.6;
  const height = 6.0;
  const depth = 2.4;

  // 1. 3D Wireframe Chassis (box enclosing the screen with depth struts extending back)
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const boxEdges = new THREE.EdgesGeometry(boxGeometry);
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x1e1e1e,
  });
  const wireframe = new THREE.LineSegments(boxEdges, wireframeMaterial);
  pictureGroup.add(wireframe);

  // 2. Back Panel with translucent theme-color wash
  const backPlaneGeometry = new THREE.PlaneGeometry(width, height);
  const BACK_FILL_RESTING_OPACITY = 0.22;
  const BACK_FILL_HOVER_OPACITY = 0.45;
  let fillOpacityTarget = BACK_FILL_RESTING_OPACITY;

  const backFillMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(themeColorValue),
    transparent: true,
    opacity: BACK_FILL_RESTING_OPACITY,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const backFill = new THREE.Mesh(backPlaneGeometry, backFillMaterial);
  backFill.position.z = -depth / 2;
  pictureGroup.add(backFill);

  // 3. Front Landscape Screen (displays the walkthrough placeholder image or video)
  const screenGeometry = new THREE.PlaneGeometry(width, height);
  const screenMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.FrontSide,
  });
  const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
  screenMesh.position.z = depth / 2 + 0.01;
  pictureGroup.add(screenMesh);

  // Helper to draw a crisp 16:10 walkthrough preview placeholder card
  function createWalkthroughPlaceholder(title, accentColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#1c1d22');
    bgGrad.addColorStop(1, '#0e0f12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle technical grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Top window bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(0, 0, canvas.width, 54);

    // Window control dots
    const dotY = 27;
    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(36 + i * 22, dotY, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tag in top-right
    ctx.fillStyle = accentColor;
    ctx.font = '600 16px "Bebas Neue", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('PRODUCT WALKTHROUGH', canvas.width - 36, dotY);

    // Center Play Button Badge
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 25;

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    const tri = 20;
    ctx.moveTo(centerX - tri * 0.5 + 4, centerY - tri);
    ctx.lineTo(centerX + tri + 4, centerY);
    ctx.lineTo(centerX - tri * 0.5 + 4, centerY + tri);
    ctx.closePath();
    ctx.fill();

    // Title & subtitle
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 48px "Bebas Neue", sans-serif';
    ctx.fillText(`${title.toUpperCase()} WALKTHROUGH`, centerX, centerY + 95);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '400 20px "Rokkitt", serif';
    ctx.fillText('Video Walkthrough Preview', centerX, centerY + 140);

    // Bottom video progress bar
    const barY = canvas.height - 35;
    const barMargin = 40;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(barMargin, barY, canvas.width - barMargin * 2, 4);

    ctx.fillStyle = accentColor;
    ctx.fillRect(barMargin, barY, 220, 4);
    ctx.beginPath();
    ctx.arc(barMargin + 220, barY + 2, 6, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  let currentVideoElement = null;

  /**
   * Sets or updates the media on the 3D landscape screen.
   * Foundation ready for video walkthroughs or images.
   */
  function setWalkthroughMedia(media = {}) {
    if (currentVideoElement) {
      try {
        currentVideoElement.pause();
        currentVideoElement.removeAttribute('src');
        currentVideoElement.load();
      } catch (e) {}
      currentVideoElement = null;
    }

    const type = media.type || (media.src && media.src.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const src = media.src;

    if (type === 'video' && src) {
      const video = document.createElement('video');
      video.src = src;
      video.crossOrigin = 'anonymous';
      video.loop = media.loop !== false;
      video.muted = true; // Required for reliable autoplay across browsers
      video.playsInline = true;
      video.autoplay = media.autoplay !== false;

      video.addEventListener('canplay', () => {
        video.play().catch((err) => {
          console.warn('Autoplay prevented. User interaction required to play video:', err);
        });
      });

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      screenMaterial.map = videoTexture;
      screenMaterial.needsUpdate = true;
      currentVideoElement = video;
      return;
    }

    if (type === 'image' && src) {
      // Normalize any leading slash for consistent relative path resolution
      const resolvedSrc = src.startsWith('/images/') ? src.substring(1) : src;
      const loader = new THREE.TextureLoader();
      loader.load(
        resolvedSrc,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          screenMaterial.map = texture;
          screenMaterial.needsUpdate = true;
        },
        undefined,
        () => {
          // Fallback to stylized walkthrough placeholder if image fails to load
          screenMaterial.map = createWalkthroughPlaceholder(projectTitle, themeColorValue);
          screenMaterial.needsUpdate = true;
        }
      );
      return;
    }

    // Default: generate stylized walkthrough placeholder card
    screenMaterial.map = createWalkthroughPlaceholder(projectTitle, themeColorValue);
    screenMaterial.needsUpdate = true;
  }

  // Expose function globally so the user can test videos or swap media dynamically
  window.setWalkthroughMedia = setWalkthroughMedia;

  // Initialize media from WALKTHROUGH_CONFIG, project definition, or styled placeholder
  const activeMedia = (WALKTHROUGH_CONFIG.src && WALKTHROUGH_CONFIG)
    || currentProject?.walkthroughMedia
    || (currentProject?.walkthroughVideo ? { type: 'video', src: currentProject.walkthroughVideo } : null)
    || (currentProject?.walkthroughImage ? { type: 'image', src: currentProject.walkthroughImage } : null)
    || { type: 'placeholder' };

  setWalkthroughMedia(activeMedia);

  // Resting 3D perspective angle - showcases the 3D depth and wireframe chassis without moving
  const RESTING_ROTATION_Y = -0.26;
  const RESTING_ROTATION_X = 0.12;

  pictureGroup.rotation.y = RESTING_ROTATION_Y;
  pictureGroup.rotation.x = RESTING_ROTATION_X;

  let targetRotationY = RESTING_ROTATION_Y;
  let targetRotationX = RESTING_ROTATION_X;

  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  const MAX_ROTATION_Y = 0.65;
  const MAX_ROTATION_X = 0.45;

  container.style.cursor = 'grab';

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    container.style.cursor = 'grabbing';
    fillOpacityTarget = BACK_FILL_HOVER_OPACITY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPointerX;
    const deltaY = e.clientY - lastPointerY;
    pictureGroup.rotation.y = THREE.MathUtils.clamp(
      pictureGroup.rotation.y + deltaX * 0.008,
      -MAX_ROTATION_Y,
      MAX_ROTATION_Y
    );
    pictureGroup.rotation.x = THREE.MathUtils.clamp(
      pictureGroup.rotation.x + deltaY * 0.008,
      -MAX_ROTATION_X,
      MAX_ROTATION_X
    );
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';
    fillOpacityTarget = BACK_FILL_RESTING_OPACITY;
    // Smoothly springs back to resting angle
    targetRotationY = RESTING_ROTATION_Y;
    targetRotationX = RESTING_ROTATION_X;
  });

  // Interactive hover glow
  container.addEventListener('mouseenter', () => {
    if (!isDragging) fillOpacityTarget = BACK_FILL_HOVER_OPACITY;
  });
  container.addEventListener('mouseleave', () => {
    if (!isDragging) fillOpacityTarget = BACK_FILL_RESTING_OPACITY;
  });

  // Clicking the screen can toggle video play/pause when a video is loaded
  container.addEventListener('click', () => {
    if (currentVideoElement) {
      if (currentVideoElement.paused) {
        currentVideoElement.play();
      } else {
        currentVideoElement.pause();
      }
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) {
      // Return smoothly to the resting 3D angle, then stay completely still (not constantly moving)
      pictureGroup.rotation.y += (targetRotationY - pictureGroup.rotation.y) * 0.08;
      pictureGroup.rotation.x += (targetRotationX - pictureGroup.rotation.x) * 0.08;
    }
    backFillMaterial.opacity += (fillOpacityTarget - backFillMaterial.opacity) * 0.15;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// SECTION DECORATIVE SHAPES (goals, research, process, outcome)
// each section header gets its own slowly rotating wireframe shape
function createTraitShape(containerId, geometry) {
  const container = document.querySelector(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  const shape = new THREE.LineSegments(edges, material);
  scene.add(shape);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.003;
    shape.rotation.y += 0.002;
    shape.rotation.x = Math.sin(time * 0.5) * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

createTraitShape('#trait-header-3d', new THREE.BoxGeometry(4, 4, 4));
createTraitShape('#research-3d', new THREE.IcosahedronGeometry(3));
createTraitShape('#process-3d', new THREE.OctahedronGeometry(3));
createTraitShape('#outcome-3d', new THREE.TetrahedronGeometry(3.2));

// LOAD PROJECT CONTENT FROM THE DATABASE
// The URL looks like project.html?slug=querri — we read that slug, fetch that
// one project from the API, and drop its text into the page.
async function loadProject() {
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) return; // no slug in the URL: leave the placeholder text as-is

  let project;
  try {
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
    if (!res.ok) return;
    project = await res.json();
  } catch (err) {
    console.error('Could not load project:', err);
    return;
  }

  document.title = project.title;

  const oneLiner = document.querySelector('.one-liner');
  if (oneLiner && project.oneLiner) {
    oneLiner.style.whiteSpace = 'pre-line'; // render the \n as a line break
    oneLiner.textContent = project.oneLiner;
  }

  const label = document.querySelector('.project-label');
  if (label) label.textContent = project.label ?? '';

  const title = document.querySelector('.project-name-title');
  if (title) title.textContent = project.title ?? '';

  // Key Learnings: rebuild the <ol> from the array stored in the database
  const learningsList = document.querySelector('.key-learnings ol');
  if (learningsList && Array.isArray(project.keyLearnings)) {
    learningsList.innerHTML = '';
    project.keyLearnings.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      learningsList.appendChild(li);
    });
  }

  // Match each section to its blurb by the header text (Goals/Research/etc.)
  const blurbs = {
    goals: project.goals,
    research: project.research,
    process: project.process,
    outcome: project.outcome,
  };
  document.querySelectorAll('.trait-section').forEach((section) => {
    const heading = section.querySelector('h2')?.textContent.trim().toLowerCase();
    const paragraph = section.querySelector('.project-text p');
    if (heading && paragraph && blurbs[heading] != null) {
      paragraph.textContent = blurbs[heading];
    }
  });
}

loadProject();

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
