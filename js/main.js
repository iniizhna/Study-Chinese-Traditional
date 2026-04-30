/* ═══════════════════════════════════════════════════════════
   main.js — shared utilities loaded on every page
   ═══════════════════════════════════════════════════════════ */

/* ── LocalStorage helpers ───────────────────────────────────── */
const Storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

/* ── Toast notification ─────────────────────────────────────── */
function showToast(msg, ms = 2400) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

/* ── Nav: active link + mobile toggle ──────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Active link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Mobile hamburger
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !links.contains(e.target))
        links.classList.remove('open');
    });
  }

  // Streak tracking
  trackStreak();
});

/* ── Streak ─────────────────────────────────────────────────── */
function trackStreak() {
  const today     = new Date().toDateString();
  const lastVisit = Storage.get('lastVisit');
  if (lastVisit === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const prev = Storage.get('streak', 0);
  const streak = (lastVisit === yesterday.toDateString()) ? prev + 1 : 1;

  Storage.set('streak',    streak);
  Storage.set('lastVisit', today);
  Storage.set('totalDays', (Storage.get('totalDays', 0)) + 1);
}

/* ── Dashboard stats ────────────────────────────────────────── */
function renderDashboardStats() {
  const learned  = Storage.get('learnedWords', []).length;
  const read     = Storage.get('readPassages', []).length;
  const streak   = Storage.get('streak', 0);
  const days     = Storage.get('totalDays', 1);

  const $ = id => document.getElementById(id);
  if ($('stat-streak'))   $('stat-streak').textContent   = streak;
  if ($('stat-vocab'))    $('stat-vocab').textContent    = learned;
  if ($('stat-passages')) $('stat-passages').textContent = read;
  if ($('stat-days'))     $('stat-days').textContent     = days;
}

/* ══════════════════════════════════════════════════════════════
   VOCABULARY PAGE
══════════════════════════════════════════════════════════════ */
function initVocabularyPage() {
  if (!document.getElementById('vocabGrid')) return;

  let activeCategory = 'all';
  let searchQuery    = '';
  const learned      = new Set(Storage.get('learnedWords', []));

  const categories = ['all', ...new Set(vocabData.map(w => w.category))];

  renderFilterChips();
  renderVocab();

  document.getElementById('vocabSearch').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderVocab();
  });

  function renderFilterChips() {
    const container = document.getElementById('vocabFilters');
    container.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? '全部 All' : categoryLabel(cat);
      return `<button class="chip${cat === activeCategory ? ' active' : ''}"
                data-cat="${cat}">${label}</button>`;
    }).join('');

    container.addEventListener('click', e => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      activeCategory = btn.dataset.cat;
      container.querySelectorAll('.chip').forEach(c =>
        c.classList.toggle('active', c.dataset.cat === activeCategory)
      );
      renderVocab();
    });
  }

  function renderVocab() {
    const grid = document.getElementById('vocabGrid');
    let words = vocabData;

    if (activeCategory !== 'all')
      words = words.filter(w => w.category === activeCategory);

    if (searchQuery)
      words = words.filter(w =>
        w.chinese.includes(searchQuery) ||
        w.pinyin.toLowerCase().includes(searchQuery) ||
        w.meaning.toLowerCase().includes(searchQuery)
      );

    if (!words.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No words match your search.</div>
      </div>`;
      return;
    }

    grid.innerHTML = words.map(w => {
      const isLearned = learned.has(w.id);
      return `
      <div class="vocab-card${isLearned ? ' learned' : ''}" id="vc-${w.id}">
        <div class="vocab-char chinese">${w.chinese}</div>
        <div class="vocab-pinyin">${w.pinyin}</div>
        <div class="vocab-meaning">${w.meaning}</div>
        <div class="vocab-example">
          <span class="ex-chinese">${w.example.chinese}</span>
          <span class="ex-pinyin pinyin">${w.example.pinyin}</span>
          <span class="ex-english">${w.example.english}</span>
        </div>
        <div class="vocab-footer">
          <span class="badge badge-category">${categoryLabel(w.category)}</span>
          <button class="btn btn-sm ${isLearned ? 'btn-ghost' : 'btn-outline'}"
                  onclick="toggleLearned('${w.id}')">
            ${isLearned ? '✓ Learned' : '＋ Learn'}
          </button>
        </div>
      </div>`;
    }).join('');
  }

  window.toggleLearned = function(id) {
    if (learned.has(id)) {
      learned.delete(id);
    } else {
      learned.add(id);
      showToast('Marked as learned! 🎉');
    }
    Storage.set('learnedWords', [...learned]);

    const card = document.getElementById('vc-' + id);
    const isNow = learned.has(id);
    card.classList.toggle('learned', isNow);
    const btn = card.querySelector('.btn');
    btn.className = `btn btn-sm ${isNow ? 'btn-ghost' : 'btn-outline'}`;
    btn.textContent = isNow ? '✓ Learned' : '＋ Learn';
  };
}

function categoryLabel(cat) {
  const map = {
    greetings: '招呼 Greetings',
    food:      '食物 Food',
    numbers:   '數字 Numbers',
    daily:     '日常 Daily'
  };
  return map[cat] || cat;
}

/* ══════════════════════════════════════════════════════════════
   READING PAGE
══════════════════════════════════════════════════════════════ */
function initReadingPage() {
  if (!document.getElementById('readingList')) return;

  const readPassages = new Set(Storage.get('readPassages', []));
  let popup;

  renderPassageList();

  function renderPassageList() {
    const list = document.getElementById('readingList');
    list.innerHTML = readingData.map(p => {
      const done = readPassages.has(p.id);
      return `
      <div class="reading-card${done ? ' completed' : ''}" onclick="openPassage('${p.id}')">
        <div class="reading-card-info">
          <div class="reading-card-title">
            <span class="chinese">${p.title}</span>
            <span class="badge badge-difficulty ${diffClass(p.difficulty)}">${p.difficulty}</span>
            ${done ? '<span class="badge badge-difficulty badge-beginner">✓ Read</span>' : ''}
          </div>
          <div class="reading-card-preview">${p.text.slice(0, 40)}…</div>
        </div>
        <span style="color:var(--muted);font-size:1.2rem">›</span>
      </div>`;
    }).join('');
  }

  window.openPassage = function(id) {
    const passage = readingData.find(p => p.id === id);
    if (!passage) return;

    document.getElementById('readingList').style.display = 'none';
    const view = document.getElementById('passageView');
    view.classList.add('active');

    document.getElementById('passageTitle').innerHTML =
      `<span class="chinese">${passage.title}</span>
       <span class="badge badge-difficulty ${diffClass(passage.difficulty)}">${passage.difficulty}</span>`;

    renderPassageText(passage, true);

    document.getElementById('btnMarkRead').onclick = () => {
      readPassages.add(id);
      Storage.set('readPassages', [...readPassages]);
      document.getElementById('btnMarkRead').textContent = '✓ Marked as Read';
      document.getElementById('btnMarkRead').disabled = true;
      showToast('Passage marked as read! 📖');
    };
    if (readPassages.has(id)) {
      document.getElementById('btnMarkRead').textContent = '✓ Marked as Read';
      document.getElementById('btnMarkRead').disabled = true;
    } else {
      document.getElementById('btnMarkRead').textContent = '✓ Mark as Read';
      document.getElementById('btnMarkRead').disabled = false;
    }

    document.getElementById('btnPinyinToggle').onclick = function() {
      document.body.classList.toggle('hide-pinyin');
      this.classList.toggle('btn-outline');
      this.classList.toggle('btn-ghost');
      this.textContent = document.body.classList.contains('hide-pinyin')
        ? 'Show Pinyin' : 'Hide Pinyin';
    };
  };

  window.backToList = function() {
    document.getElementById('readingList').style.display = 'flex';
    document.getElementById('passageView').classList.remove('active');
    document.body.classList.remove('hide-pinyin');
    if (popup) popup.classList.remove('visible');
  };

  function renderPassageText(passage, showPinyin) {
    const container = document.getElementById('passageTextEl');
    const ann = passage.annotations;
    const keys = Object.keys(ann).sort((a, b) => b.length - a.length);
    let text = passage.text;
    let html = '';
    let i = 0;

    while (i < text.length) {
      let matched = false;
      for (const k of keys) {
        if (text.startsWith(k, i)) {
          const a = ann[k];
          html += `<ruby class="ann" data-char="${escHtml(k)}"
                         data-pinyin="${escHtml(a.pinyin)}"
                         data-meaning="${escHtml(a.meaning)}">${escHtml(k)}<rt>${escHtml(a.pinyin)}</rt></ruby>`;
          i += k.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        html += escHtml(text[i]);
        i++;
      }
    }
    container.innerHTML = html;
    setupCharPopup(container);
  }

  function setupCharPopup(container) {
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'char-popup';
      document.body.appendChild(popup);
    }

    container.addEventListener('click', e => {
      const ruby = e.target.closest('.ann');
      if (!ruby) { popup.classList.remove('visible'); return; }
      popup.innerHTML = `
        <span class="popup-char">${ruby.dataset.char}</span>
        <span class="popup-pinyin">${ruby.dataset.pinyin}</span>
        <span class="popup-meaning">${ruby.dataset.meaning}</span>`;
      const r = ruby.getBoundingClientRect();
      let left = r.left + window.scrollX;
      let top  = r.bottom + window.scrollY + 8;
      // keep in viewport
      popup.style.left = Math.min(left, window.innerWidth - 180) + 'px';
      popup.style.top  = top + 'px';
      popup.classList.add('visible');
      e.stopPropagation();
    });

    document.addEventListener('click', () => popup.classList.remove('visible'));
  }
}

function diffClass(d) {
  if (d === '初級') return 'badge-beginner';
  if (d === '中級') return 'badge-intermediate';
  return 'badge-advanced';
}

/* ══════════════════════════════════════════════════════════════
   GRAMMAR PAGE
══════════════════════════════════════════════════════════════ */
function initGrammarPage() {
  if (!document.getElementById('grammarList')) return;

  const list = document.getElementById('grammarList');
  list.innerHTML = grammarData.map((g, i) => `
    <div class="grammar-item" id="gi-${g.id}">
      <div class="grammar-header" onclick="toggleGrammar('${g.id}')">
        <div class="grammar-header-left">
          <span class="grammar-index">${i + 1}</span>
          <span class="grammar-header-title">${escHtml(g.title)}</span>
        </div>
        <span class="grammar-chevron">▼</span>
      </div>
      <div class="grammar-body">
        <div class="grammar-pattern chinese">${escHtml(g.pattern)}</div>
        <div class="grammar-explanation">${escHtml(g.explanation)}</div>
        <div class="grammar-examples">
          ${g.examples.map(ex => `
          <div class="grammar-example">
            <span class="ex-chinese">${escHtml(ex.chinese)}</span>
            <span class="ex-pinyin">${escHtml(ex.pinyin)}</span>
            <span class="ex-english">${escHtml(ex.english)}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

window.toggleGrammar = function(id) {
  const item = document.getElementById('gi-' + id);
  item.classList.toggle('open');
};

/* ══════════════════════════════════════════════════════════════
   STROKES PAGE
══════════════════════════════════════════════════════════════ */
function initStrokesPage() {
  if (!document.getElementById('strokesGrid')) return;

  const strokeState = {}; // per card: { current: -1 | n, drawn: Set }

  const grid = document.getElementById('strokesGrid');
  grid.innerHTML = strokesData.map(s => {
    strokeState[s.id] = { current: -1 };
    const pathsHtml = s.svgPaths.map((d, i) =>
      `<path class="stroke-path pending" id="sp-${s.id}-${i}" d="${d}" />`
    ).join('');
    const stepsHtml = s.strokes.map((desc, i) =>
      `<div class="stroke-step" id="ss-${s.id}-${i}">
         <span class="stroke-step-num">${i + 1}</span>
         <span>${escHtml(desc)}</span>
       </div>`
    ).join('');

    return `
    <div class="stroke-card">
      <div class="stroke-char-row">
        <span class="stroke-char chinese">${s.chinese}</span>
        <span class="stroke-pinyin pinyin">${s.pinyin}</span>
      </div>
      <div class="stroke-meaning">${escHtml(s.meaning)}</div>
      <div class="stroke-meta">
        <span class="stroke-meta-item">✏️ ${s.strokeCount} stroke${s.strokeCount > 1 ? 's' : ''}</span>
        <span class="stroke-meta-item">部首 ${s.radical}</span>
      </div>
      <div class="stroke-svg-wrap">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <line class="stroke-guide-h" x1="0" y1="100" x2="200" y2="100"/>
          <line class="stroke-guide-v" x1="100" y1="0"   x2="100" y2="200"/>
          ${pathsHtml}
        </svg>
      </div>
      <div class="stroke-steps">${stepsHtml}</div>
      <div class="stroke-controls">
        <button class="btn btn-sm btn-ghost" onclick="strokeReset('${s.id}',${s.strokeCount})">↺</button>
        <button class="btn btn-sm btn-outline" onclick="strokePrev('${s.id}',${s.strokeCount})">‹ Prev</button>
        <button class="btn btn-sm btn-primary" onclick="strokeNext('${s.id}',${s.strokeCount})">Next ›</button>
        <button class="btn btn-sm btn-ghost" onclick="strokeAnimate('${s.id}',${s.strokeCount})">▶</button>
      </div>
    </div>`;
  }).join('');

  // Set path lengths for dash animation
  strokesData.forEach(s => {
    s.svgPaths.forEach((_, i) => {
      const path = document.getElementById(`sp-${s.id}-${i}`);
      if (!path) return;
      const len = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
    });
  });

  function setStroke(cardId, strokeCount, idx) {
    for (let i = 0; i < strokeCount; i++) {
      const path = document.getElementById(`sp-${cardId}-${i}`);
      const step = document.getElementById(`ss-${cardId}-${i}`);
      if (!path || !step) continue;

      if (i < idx) {
        path.classList.remove('pending', 'drawing');
        path.classList.add('done');
        path.style.strokeDashoffset = 0;
        step.classList.remove('active');
      } else if (i === idx) {
        path.classList.remove('pending', 'done');
        path.classList.add('drawing');
        path.style.transition = 'stroke-dashoffset .5s ease';
        path.style.strokeDashoffset = 0;
        step.classList.add('active');
      } else {
        path.classList.remove('done', 'drawing');
        path.classList.add('pending');
        const len = path.getTotalLength ? path.getTotalLength() : 200;
        path.style.transition = 'none';
        path.style.strokeDashoffset = len;
        step.classList.remove('active');
      }
    }
    strokeState[cardId].current = idx;
  }

  window.strokeNext = function(id, count) {
    const cur = strokeState[id].current;
    if (cur < count - 1) setStroke(id, count, cur + 1);
  };

  window.strokePrev = function(id, count) {
    const cur = strokeState[id].current;
    if (cur > 0) setStroke(id, count, cur - 1);
    else strokeReset(id, count);
  };

  window.strokeReset = function(id, count) {
    strokeState[id].current = -1;
    for (let i = 0; i < count; i++) {
      const path = document.getElementById(`sp-${id}-${i}`);
      const step = document.getElementById(`ss-${id}-${i}`);
      if (!path || !step) continue;
      path.classList.remove('done', 'drawing');
      path.classList.add('pending');
      const len = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.transition = 'none';
      path.style.strokeDashoffset = len;
      step.classList.remove('active');
    }
  };

  window.strokeAnimate = function(id, count) {
    strokeReset(id, count);
    let i = 0;
    function next() {
      if (i >= count) return;
      setStroke(id, count, i);
      i++;
      setTimeout(next, 650);
    }
    setTimeout(next, 150);
  };
}

/* ── HTML escape helper ─────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Initialise whichever page we're on ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardStats();
  initVocabularyPage();
  initReadingPage();
  initGrammarPage();
  initStrokesPage();
});
