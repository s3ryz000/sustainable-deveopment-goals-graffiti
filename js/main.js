// ── ANIMATIONS & INTERACTIVE EFFECTS ──

// Intersection Observer for scroll-reveal
const revealEls = document.querySelectorAll('.feature-card, .artist-card, .sdg-card, .section-title');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── CURSOR SPRAY TRAIL ──
const trail = [];
const TRAIL_LEN = 12;

document.addEventListener('mousemove', e => {
  trail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
  if (trail.length > TRAIL_LEN) trail.shift();

  // Create particle
  if (Math.random() > 0.6) {
    const dot = document.createElement('div');
    const colors = ['#ff2d78', '#ffe600', '#00fff7', '#bf00ff', '#39ff14'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: ${color};
      border-radius: 50%;
      left: ${e.clientX + (Math.random() - 0.5) * 16}px;
      top: ${e.clientY + (Math.random() - 0.5) * 16}px;
      opacity: 0.9;
      transition: opacity 0.6s, transform 0.6s;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = `translateY(${Math.random() * 20 + 10}px)`;
    });
    setTimeout(() => dot.remove(), 700);
  }
});

// ── NAV ACTIVE HIGHLIGHTING ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active-link');
  });
});

// ── GLITCH ON HOVER FOR ARTIST CARDS ──
document.querySelectorAll('.artist-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.filter = 'hue-rotate(15deg)';
    setTimeout(() => card.style.filter = '', 150);
  });
});

// ── RANDOM FLOATING TAGS (BG DECORATION) ──
const tags = ['DAKARA', 'SDG11', 'MALANG', 'BAYAN', 'LABAN', 'TAGXPH', 'KONFLIKT', 'DIY', 'PILIPINAS'];
const bgEl = document.getElementById('floating-tags-bg');
if (bgEl) {
  tags.forEach(tag => {
    const el = document.createElement('span');
    el.className = 'floating-bg-tag';
    el.textContent = tag;
    const colors = ['#ff2d78', '#ffe600', '#00fff7', '#bf00ff', '#39ff14'];
    el.style.cssText = `
      position: absolute;
      font-family: 'Permanent Marker', cursive;
      font-size: ${Math.random() * 24 + 14}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      opacity: 0.08;
      left: ${Math.random() * 90}%;
      top: ${Math.random() * 90}%;
      transform: rotate(${(Math.random() - 0.5) * 40}deg);
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
    `;
    bgEl.appendChild(el);
  });
}

// ── SPRAY CAN SOUND SIMULATION (visual feedback) ──
let sprayActive = false;
const canvasEl = document.getElementById('graffiti-canvas');
if (canvasEl) {
  canvasEl.addEventListener('mousedown', () => {
    sprayActive = true;
    showSprayIndicator();
  });
  canvasEl.addEventListener('mouseup', () => sprayActive = false);

  function showSprayIndicator() {
    if (!sprayActive) return;
    const indicator = document.getElementById('spray-indicator');
    if (indicator) {
      indicator.style.opacity = '1';
      setTimeout(() => { indicator.style.opacity = '0'; }, 200);
    }
  }
}

// ── TAB OF THE WEEK HIGHLIGHT ──
const tagOfWeek = document.getElementById('tag-of-week');
if (tagOfWeek) {
  // Try loading from gallery
  const gallery = JSON.parse(localStorage.getItem('graffiti-gallery') || '[]');
  if (gallery.length > 0) {
    const img = document.createElement('img');
    img.src = gallery[0].src;
    img.style.cssText = 'width:100%;border:3px solid #ffe600;display:block;';
    img.alt = 'Tag of the week';
    tagOfWeek.appendChild(img);
    const lbl = document.createElement('p');
    lbl.textContent = '⭐ FEATURED TAG — COMMUNITY PICK';
    lbl.style.cssText = "font-family:'Press Start 2P',monospace;font-size:8px;color:#ffe600;text-align:center;margin-top:10px;";
    tagOfWeek.appendChild(lbl);
  } else {
    tagOfWeek.innerHTML = '<p style="font-family:VT323,monospace;font-size:20px;color:#bf00ff;text-align:center;">CREATE & SAVE A TAG TO FEATURE IT HERE!</p>';
  }
}
