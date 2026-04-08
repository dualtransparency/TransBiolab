/* ═══════════════════ PLRealsense Evaluation Report — App Logic ═══════════════════ */

// Frame data — 20 frames across scenes 000013 and 000014
const FRAMES = [
  { id: '01', scene: '000013', frame: '000102', vp: 'VP01' },
  { id: '02', scene: '000013', frame: '000316', vp: 'VP04' },
  { id: '03', scene: '000013', frame: '000389', vp: 'VP06' },
  { id: '04', scene: '000013', frame: '000938', vp: 'VP05' },
  { id: '05', scene: '000013', frame: '001368', vp: 'VP09' },
  { id: '06', scene: '000013', frame: '001456', vp: 'VP07' },
  { id: '07', scene: '000013', frame: '002116', vp: 'VP03' },
  { id: '08', scene: '000013', frame: '002622', vp: 'VP08' },
  { id: '09', scene: '000013', frame: '003019', vp: 'VP02' },
  { id: '10', scene: '000013', frame: '003219', vp: 'VP10' },
  { id: '11', scene: '000014', frame: '000152', vp: 'VP01' },
  { id: '12', scene: '000014', frame: '000319', vp: 'VP04' },
  { id: '13', scene: '000014', frame: '000831', vp: 'VP02' },
  { id: '14', scene: '000014', frame: '000891', vp: 'VP05' },
  { id: '15', scene: '000014', frame: '001299', vp: 'VP09' },
  { id: '16', scene: '000014', frame: '001393', vp: 'VP07' },
  { id: '17', scene: '000014', frame: '002329', vp: 'VP03' },
  { id: '18', scene: '000014', frame: '002556', vp: 'VP06' },
  { id: '19', scene: '000014', frame: '002594', vp: 'VP08' },
  { id: '20', scene: '000014', frame: '003217', vp: 'VP10' },
];

const IMG_TYPES = ['rgb', 'sam3', 'fp_gt', 'fp_pred'];

function imgPath(type, frame) {
  return `${type}/${frame.id}_${frame.scene}_f${frame.frame}.png`;
}

// ═══════════════════ State ═══════════════════
let currentFrameIdx = 0;
let currentImgType = 'rgb';
let currentViewMode = 'comparison';
let currentSceneFilter = 'all';
let currentGalleryType = 'sam3';
let lightboxIdx = -1;

const filteredFrames = () => {
  if (currentSceneFilter === 'all') return FRAMES;
  return FRAMES.filter(f => f.scene === currentSceneFilter);
};

// ═══════════════════ DOM Ready ═══════════════════
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavScroll();
  initNavHighlight();
  initTableTabs();
  initViewModes();
  initSceneFilter();
  initImgTabs();
  initCompNav();
  initGallery();
  initLightbox();
  renderComparison();
  renderThumbs();
});

// ═══════════════════ Background Particles ═══════════════════
function initParticles() {
  const container = document.getElementById('bgParticles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 300 + 100;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 20 + 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// ═══════════════════ Navigation ═══════════════════
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => observer.observe(s));
}

// ═══════════════════ Table Tabs ═══════════════════
function initTableTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      const table = document.getElementById('mainTable');
      table.removeAttribute('data-tab');
      if (tab !== 'combined') table.dataset.tab = tab;
    });
  });
}

// ═══════════════════ View Modes ═══════════════════
function initViewModes() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewMode = btn.dataset.view;
      document.getElementById('visComparison').style.display = currentViewMode === 'comparison' ? '' : 'none';
      document.getElementById('visGallery').style.display = currentViewMode === 'gallery' ? '' : 'none';
      if (currentViewMode === 'gallery') renderGallery();
    });
  });
}

// ═══════════════════ Scene Filter ═══════════════════
function initSceneFilter() {
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSceneFilter = btn.dataset.scene;
      currentFrameIdx = 0;
      renderComparison();
      renderThumbs();
      if (currentViewMode === 'gallery') renderGallery();
    });
  });
}

// ═══════════════════ Image Type Tabs ═══════════════════
function initImgTabs() {
  document.querySelectorAll('.img-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.img-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentImgType = tab.dataset.type;
      renderComparison();
    });
  });
}

// ═══════════════════ Comparison Navigation ═══════════════════
function initCompNav() {
  document.getElementById('prevFrame').addEventListener('click', () => {
    const frames = filteredFrames();
    currentFrameIdx = (currentFrameIdx - 1 + frames.length) % frames.length;
    renderComparison();
    updateThumbActive();
  });
  document.getElementById('nextFrame').addEventListener('click', () => {
    const frames = filteredFrames();
    currentFrameIdx = (currentFrameIdx + 1) % frames.length;
    renderComparison();
    updateThumbActive();
  });
  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'ArrowLeft') document.getElementById('prevFrame').click();
    if (e.key === 'ArrowRight') document.getElementById('nextFrame').click();
  });
}

// ═══════════════════ Render Comparison ═══════════════════
function renderComparison() {
  const frames = filteredFrames();
  if (frames.length === 0) return;
  const frame = frames[currentFrameIdx];

  // Update counter
  document.getElementById('compCounter').textContent = `${currentFrameIdx + 1} / ${frames.length}`;
  document.getElementById('compScene').textContent = `Scene ${frame.scene} · Frame ${frame.frame} · ${frame.vp}`;

  const single = document.getElementById('compImgSingle');
  const sbs = document.getElementById('compSideBySide');

  if (currentImgType === 'side') {
    single.style.display = 'none';
    sbs.style.display = '';
    document.getElementById('sideImgLeft').src = imgPath('sam3', frame);
    document.getElementById('sideImgRight').src = imgPath('fp_pred', frame);
  } else {
    single.style.display = '';
    sbs.style.display = 'none';
    single.src = imgPath(currentImgType, frame);
    single.alt = `${currentImgType} — Scene ${frame.scene} Frame ${frame.frame}`;
  }
}

// ═══════════════════ Thumbnails ═══════════════════
function renderThumbs() {
  const strip = document.getElementById('thumbStrip');
  strip.innerHTML = '';
  const frames = filteredFrames();
  frames.forEach((frame, idx) => {
    const div = document.createElement('div');
    div.className = 'thumb-item' + (idx === currentFrameIdx ? ' active' : '');
    div.innerHTML = `<img src="${imgPath('rgb', frame)}" alt="Frame ${frame.frame}" loading="lazy">`;
    div.addEventListener('click', () => {
      currentFrameIdx = idx;
      renderComparison();
      updateThumbActive();
    });
    strip.appendChild(div);
  });
}

function updateThumbActive() {
  const items = document.querySelectorAll('.thumb-item');
  items.forEach((item, idx) => item.classList.toggle('active', idx === currentFrameIdx));
  // Scroll active into view
  const active = document.querySelector('.thumb-item.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// ═══════════════════ Gallery ═══════════════════
function initGallery() {
  document.querySelectorAll('.gal-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gal-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalleryType = btn.dataset.gtype;
      renderGallery();
    });
  });
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  const frames = filteredFrames();
  frames.forEach((frame, idx) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.idx = idx;
    div.innerHTML = `
      <img src="${imgPath(currentGalleryType, frame)}" alt="Scene ${frame.scene} Frame ${frame.frame}" loading="lazy">
      <div class="gal-label">Scene ${frame.scene} · F${frame.frame} · ${frame.vp}</div>
    `;
    div.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(div);
  });
}

// ═══════════════════ Lightbox ═══════════════════
function initLightbox() {
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => navLightbox(-1));
  document.getElementById('lbNext').addEventListener('click', () => navLightbox(1));
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
}

function openLightbox(idx) {
  lightboxIdx = idx;
  const frames = filteredFrames();
  const frame = frames[idx];
  const lb = document.getElementById('lightbox');
  document.getElementById('lbImg').src = imgPath(currentGalleryType, frame);
  document.getElementById('lbCaption').textContent = `Scene ${frame.scene} · Frame ${frame.frame} · ${frame.vp} · ${currentGalleryType.toUpperCase()}`;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  const frames = filteredFrames();
  lightboxIdx = (lightboxIdx + dir + frames.length) % frames.length;
  const frame = frames[lightboxIdx];
  document.getElementById('lbImg').src = imgPath(currentGalleryType, frame);
  document.getElementById('lbCaption').textContent = `Scene ${frame.scene} · Frame ${frame.frame} · ${frame.vp} · ${currentGalleryType.toUpperCase()}`;
}

// ═══════════════════ Scroll-triggered Animations ═══════════════════
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-card, .finding-card, .obj-group').forEach(el => {
  el.style.animationPlayState = 'paused';
  animObserver.observe(el);
});
