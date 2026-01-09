// PosterCraft — main.js
// Created by Rishita Bajaj 💜
// Fixed: JSON path, event sync, live preview, template dropdown

// Fetch JSON templates (file is in main folder)
async function fetchTemplates() {
  try {
    const response = await fetch('./templates.json'); // ✅ correct path for same folder
    if (!response.ok) throw new Error('Failed to load');
    return await response.json();
  } catch (e) {
    console.warn('Could not fetch templates:', e);
    return [
      { id: 'clean', name: 'Clean Modern', color: '#ff7a59', sample: 'assets/sample1.jpg' },
      { id: 'bold', name: 'Bold & Bright', color: '#7dd3fc', sample: 'assets/sample2.jpg' },
      { id: 'retro', name: 'Retro Pop', color: '#fef08a', sample: 'assets/sample3.jpg' }
    ];
  }
}

// Initialize once DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  const templates = await fetchTemplates();
  initIndexTemplates(templates);
  initDesigner(templates);
  initContactForm();
});

// ---------- 🏠 INDEX PAGE ----------
function initIndexTemplates(templates) {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;

  grid.innerHTML = '';
  templates.forEach(t => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
      <img class="template-thumb" src="${t.sample}" alt="${t.name}">
      <div class="template-name">${t.name}</div>
      <div style="padding:0.6rem;text-align:center;">
        <button class="btn" data-id="${t.id}">Use Template</button>
      </div>
    `;
    grid.appendChild(card);

    card.querySelector('button').addEventListener('click', () => {
      location.href = `designer.html#template=${t.id}`;
    });
  });
}

// ---------- 💌 CONTACT FORM ----------
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('contactStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = "✅ Thank you! Your message has been recorded (simulation).";
    form.reset();
  });
}

// ---------- 🎨 DESIGNER PAGE ----------
function initDesigner(templates) {
  const canvas = document.getElementById('posterCanvas');
  if (!canvas) return;

  // Grab elements
  const templateSelect = document.getElementById('templateSelect');
  const titleInput = document.getElementById('titleInput');
  const subtitleInput = document.getElementById('subtitleInput');
  const bodyInput = document.getElementById('bodyInput');
  const dateInput = document.getElementById('dateInput');
  const colorInput = document.getElementById('colorInput');
  const titleSize = document.getElementById('titleSize');
  const fontSelect = document.getElementById('fontSelect');
  const bgUpload = document.getElementById('bgUpload');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');
  const canvasSize = document.getElementById('canvasSize');
  const loadingStatus = document.getElementById('loadingStatus');

  const pTitle = document.getElementById('pTitle');
  const pSubtitle = document.getElementById('pSubtitle');
  const pBody = document.getElementById('pBody');
  const pDate = document.getElementById('pDate');
  const posterBg = document.getElementById('posterBg');
  const posterContent = document.getElementById('posterContent');

  // ✅ Populate templates dropdown
  templates.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    templateSelect.appendChild(opt);
  });

  // 🔄 Update poster preview
  function syncPreview() {
    pTitle.textContent = titleInput.value || 'Your Event';
    pSubtitle.textContent = subtitleInput.value || 'Tagline';
    pBody.textContent = bodyInput.value || 'Details here...';
    pDate.textContent = dateInput.value ? `Date: ${dateInput.value}` : '';
    pTitle.style.fontSize = titleSize.value + 'px';
    posterContent.style.fontFamily = fontSelect.value;
    posterBg.style.backgroundColor = colorInput.value + '33';
  }

  [titleInput, subtitleInput, bodyInput, dateInput, colorInput, titleSize, fontSelect].forEach(el =>
    el?.addEventListener('input', syncPreview)
  );

  // 🖼️ Background image upload
  bgUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      posterBg.style.backgroundImage = `url(${ev.target.result})`;
      posterBg.style.backgroundSize = 'cover';
      posterBg.style.filter = 'brightness(0.85)';
    };
    reader.readAsDataURL(file);
  });

  // 📏 Canvas size change
  canvasSize.addEventListener('change', () => {
    const [w, h] = canvasSize.value.split('x').map(Number);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  });

  // 💾 Save design
  saveBtn.addEventListener('click', () => {
    const state = {
      template: templateSelect.value,
      title: titleInput.value,
      subtitle: subtitleInput.value,
      body: bodyInput.value,
      date: dateInput.value,
      color: colorInput.value,
      titleSize: titleSize.value,
      font: fontSelect.value,
      bg: posterBg.style.backgroundImage || posterBg.style.backgroundColor || ''
    };
    localStorage.setItem('posterCraft_design', JSON.stringify(state));
    loadingStatus.textContent = "💾 Design Saved!";
    setTimeout(() => loadingStatus.textContent = "Ready", 1200);
  });

  // 📂 Load design
  loadBtn.addEventListener('click', () => {
    const saved = localStorage.getItem('posterCraft_design');
    if (!saved) {
      loadingStatus.textContent = "No saved design found.";
      setTimeout(() => loadingStatus.textContent = "Ready", 1200);
      return;
    }
    const s = JSON.parse(saved);
    titleInput.value = s.title || '';
    subtitleInput.value = s.subtitle || '';
    bodyInput.value = s.body || '';
    dateInput.value = s.date || '';
    colorInput.value = s.color || '#ff7a59';
    titleSize.value = s.titleSize || 42;
    fontSelect.value = s.font || fontSelect.value;
    if (s.bg && s.bg.startsWith('url('))
      posterBg.style.backgroundImage = s.bg;
    else
      posterBg.style.backgroundColor = s.bg;
    syncPreview();
    loadingStatus.textContent = "✅ Design Loaded!";
    setTimeout(() => loadingStatus.textContent = "Ready", 1200);
  });

  // 🧹 Clear
  clearBtn.addEventListener('click', () => {
    if (!confirm("Clear current design?")) return;
    [titleInput, subtitleInput, bodyInput, dateInput].forEach(i => i.value = '');
    colorInput.value = '#ff7a59';
    titleSize.value = 42;
    fontSelect.value = 'Inter, sans-serif';
    posterBg.style.backgroundImage = '';
    posterBg.style.backgroundColor = '';
    syncPreview();
  });

  // 🖨️ Export as PNG
  exportBtn.addEventListener('click', () => {
    loadingStatus.textContent = "⏳ Rendering...";
    html2canvas(canvas, { useCORS: true, scale: 2 })
      .then(canvasImg => {
        const link = document.createElement('a');
        link.download = 'poster-design.png';
        link.href = canvasImg.toDataURL('image/png');
        link.click();
        loadingStatus.textContent = "✅ Exported!";
        setTimeout(() => loadingStatus.textContent = "Ready", 1200);
      })
      .catch(() => {
        loadingStatus.textContent = "❌ Export failed.";
        setTimeout(() => loadingStatus.textContent = "Ready", 1200);
      });
  });

  // 🧩 Apply template on select
  templateSelect.addEventListener('change', () => {
    const t = templates.find(x => x.id === templateSelect.value);
    if (t && t.sample) {
      posterBg.style.backgroundImage = `url(${t.sample})`;
      posterBg.style.backgroundSize = 'cover';
      posterBg.style.filter = 'brightness(0.8)';
      titleInput.value = t.title || titleInput.value;
      subtitleInput.value = t.subtitle || subtitleInput.value;
      bodyInput.value = t.body || bodyInput.value;
      colorInput.value = t.color || colorInput.value;
      titleSize.value = t.titleSize || titleSize.value;
      syncPreview();
    }
  });

  // 🔄 Make text draggable & editable
  document.querySelectorAll('.draggable').forEach(el => makeDraggable(el));

  function makeDraggable(el) {
    let startX, startY, origX, origY;
    el.style.position = 'absolute';
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      origX = parseInt(el.style.left || el.offsetLeft);
      origY = parseInt(el.style.top || el.offsetTop);
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
    function move(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = origX + dx + 'px';
      el.style.top = origY + dy + 'px';
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    }
    el.addEventListener('dblclick', () => {
      el.contentEditable = 'true';
      el.focus();
      el.addEventListener('blur', () => el.contentEditable = 'false', { once: true });
    });
  }

  syncPreview();
}
