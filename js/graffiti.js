// ── GRAFFITI TAG DRAWING TOOL ──
const canvas = document.getElementById('graffiti-canvas');
if (!canvas) { console.warn('No graffiti canvas found'); }
else {
const ctx = canvas.getContext('2d');

// State
let painting = false;
let currentTool = 'spray'; // spray | brush | drip | eraser
let currentColor = '#ff2d78';
let brushSize = 18;
let lastX = 0, lastY = 0;

// Resize canvas to fill container
function resizeCanvas() {
  const saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.offsetWidth || 800;
  canvas.height = canvas.offsetHeight || 500;
  ctx.putImageData(saved, 0, 0);
  ctx.fillStyle = '#111';
  // Only clear on first load
}

canvas.width = 800;
canvas.height = 480;
ctx.fillStyle = '#111111';
ctx.fillRect(0, 0, canvas.width, canvas.height);
// Draw subtle background grid
ctx.strokeStyle = 'rgba(255,255,255,0.04)';
ctx.lineWidth = 1;
for (let x = 0; x < canvas.width; x += 40) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
}
for (let y = 0; y < canvas.height; y += 40) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
}

// ── TOOLS ──
function sprayPaint(x, y) {
  const density = 60;
  const radius = brushSize;
  ctx.fillStyle = currentColor;
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.5) * radius;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    const alpha = Math.random() * 0.6 + 0.1;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(px, py, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function brushPaint(x, y) {
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function dripPaint(x, y) {
  // Main blob
  ctx.fillStyle = currentColor;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(x, y, brushSize * 0.8, 0, Math.PI * 2);
  ctx.fill();
  // Drip down
  const dripLen = Math.random() * 60 + 20;
  ctx.beginPath();
  ctx.moveTo(x, y + brushSize * 0.7);
  ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 8, y + dripLen / 2, x + (Math.random() - 0.5) * 6, y + dripLen);
  ctx.lineWidth = brushSize * 0.4;
  ctx.strokeStyle = currentColor;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function erasePaint(x, y) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.arc(x, y, brushSize, 0, Math.PI * 2);
  ctx.fill();
}

// ── PAINT FUNCTION ──
function paint(x, y) {
  if (currentTool === 'spray') sprayPaint(x, y);
  else if (currentTool === 'brush') brushPaint(x, y);
  else if (currentTool === 'drip') dripPaint(x, y);
  else if (currentTool === 'eraser') erasePaint(x, y);
  lastX = x; lastY = y;
}

// ── EVENT HELPERS ──
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// ── MOUSE EVENTS ──
canvas.addEventListener('mousedown', e => {
  painting = true;
  const {x,y} = getPos(e);
  lastX = x; lastY = y;
  paint(x, y);
});
canvas.addEventListener('mousemove', e => {
  if (!painting) return;
  const {x,y} = getPos(e);
  paint(x, y);
});
canvas.addEventListener('mouseup', () => painting = false);
canvas.addEventListener('mouseleave', () => painting = false);

// ── TOUCH EVENTS ──
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  painting = true;
  const {x,y} = getPos(e);
  lastX = x; lastY = y;
  paint(x, y);
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!painting) return;
  const {x,y} = getPos(e);
  paint(x, y);
}, { passive: false });
canvas.addEventListener('touchend', () => painting = false);

// ── CONTROLS ──
// Tool buttons
document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTool = btn.dataset.tool;
    document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Color swatches
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    currentColor = swatch.dataset.color;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
  });
});

// Custom color picker
const customColor = document.getElementById('custom-color');
if (customColor) {
  customColor.addEventListener('input', e => {
    currentColor = e.target.value;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  });
}

// Size slider
const sizeSlider = document.getElementById('brush-size');
if (sizeSlider) {
  sizeSlider.addEventListener('input', e => {
    brushSize = parseInt(e.target.value);
    const sizeLabel = document.getElementById('size-label');
    if (sizeLabel) sizeLabel.textContent = brushSize + 'px';
  });
}

// Clear button
const clearBtn = document.getElementById('clear-canvas');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  });
}

// Save / add to gallery
const saveBtn = document.getElementById('save-tag');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    // Add to gallery
    addToGallery(dataURL);
    // Flash effect
    saveBtn.textContent = '✓ SAVED!';
    saveBtn.style.borderColor = '#39ff14';
    saveBtn.style.color = '#39ff14';
    setTimeout(() => {
      saveBtn.textContent = '💾 SAVE TAG';
      saveBtn.style.borderColor = '';
      saveBtn.style.color = '';
    }, 2000);
  });
}

// Download
const downloadBtn = document.getElementById('download-tag');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-graffiti-tag.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// ── COMMUNITY GALLERY ──
const gallery = JSON.parse(localStorage.getItem('graffiti-gallery') || '[]');

function addToGallery(dataURL) {
  const entry = { src: dataURL, ts: Date.now() };
  gallery.unshift(entry);
  if (gallery.length > 20) gallery.pop();
  localStorage.setItem('graffiti-gallery', JSON.stringify(gallery));
  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (gallery.length === 0) {
    grid.innerHTML = '<p style="font-family:VT323,monospace;font-size:22px;color:#bf00ff;text-align:center;grid-column:1/-1;">NO TAGS YET — BE THE FIRST!</p>';
    return;
  }
  gallery.forEach((entry, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const d = new Date(entry.ts);
    item.innerHTML = `<img src="${entry.src}" alt="Community tag ${i+1}">
      <div class="gallery-label">TAG #${i+1} · ${d.toLocaleDateString()}</div>`;
    grid.appendChild(item);
  });
}

renderGallery();

// Set first tool active
const firstTool = document.querySelector('.tool-btn[data-tool="spray"]');
if (firstTool) firstTool.classList.add('active');
const firstColor = document.querySelector('.color-swatch');
if (firstColor) firstColor.classList.add('active');

} // end if canvas
