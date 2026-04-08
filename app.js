/* ═══════════════════ TransBiolab Website — App.js ═══════════════════ */

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

function imgPath(type, frame) {
  return `${type}/${frame.id}_${frame.scene}_f${frame.frame}.png`;
}

// ═══════════════════ State ═══════════════════
let currentFrameIdx = 0;
let currentImgType = 'rgb';
let currentSceneFilter = 'all';

const filteredFrames = () => {
  if (currentSceneFilter === 'all') return FRAMES;
  return FRAMES.filter(f => f.scene === currentSceneFilter);
};

// ═══════════════════ Init ═══════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initNavHighlight();
  initSceneFilter();
  initImgTabs();
  initCompNav();
  renderComparison();
  renderThumbs();
});

// ═══════════════════ Navigation ═══════════════════
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => { if (s.id) observer.observe(s); });
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
    });
  });
}

// ═══════════════════ Image Tabs ═══════════════════
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

// ═══════════════════ Frame Navigation ═══════════════════
function initCompNav() {
  const prev = document.getElementById('prevFrame');
  const next = document.getElementById('nextFrame');
  if (!prev || !next) return;

  prev.addEventListener('click', () => {
    const frames = filteredFrames();
    currentFrameIdx = (currentFrameIdx - 1 + frames.length) % frames.length;
    renderComparison();
    updateThumbActive();
  });
  next.addEventListener('click', () => {
    const frames = filteredFrames();
    currentFrameIdx = (currentFrameIdx + 1) % frames.length;
    renderComparison();
    updateThumbActive();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev.click();
    if (e.key === 'ArrowRight') next.click();
  });
}

// ═══════════════════ Render Comparison ═══════════════════
function renderComparison() {
  const frames = filteredFrames();
  if (frames.length === 0) return;
  const frame = frames[currentFrameIdx];

  const counter = document.getElementById('compCounter');
  const scene = document.getElementById('compScene');
  if (counter) counter.textContent = `${currentFrameIdx + 1} / ${frames.length}`;
  if (scene) scene.textContent = `Scene ${frame.scene} · Frame ${frame.frame} · ${frame.vp}`;

  const single = document.getElementById('compImgSingle');
  const sbs = document.getElementById('compSideBySide');
  if (!single || !sbs) return;

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
  if (!strip) return;
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
  const active = document.querySelector('.thumb-item.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}
