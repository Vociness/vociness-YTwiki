(function () {
  const paneBody = document.getElementById('paneBody');
  const crumbCurrent = document.getElementById('crumbCurrent');
  const backBtn = document.getElementById('backBtn');
  const railButtons = document.querySelectorAll('.rail-btn');
  const lastUpdatedEl = document.getElementById('lastUpdated');

  // ---- last updated date (today's date, formatted) ----
  if (lastUpdatedEl) {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    lastUpdatedEl.textContent = 'last updated — ' + formatted;
  }

  // Build DOM for a guide page and cache it so re-visits are instant.
  const renderedPages = {};

  function buildGuidePage(key) {
    const g = GUIDES[key];
    if (!g) return null;

    const section = document.createElement('section');
    section.className = 'page guide';
    section.id = 'page-' + key;

    const statHTML = g.stat
      ? `<div class="guide-stat">
           <span class="guide-stat-num">${g.stat.num}</span>
           <span class="guide-stat-label">${g.stat.label}</span>
         </div>`
      : '';

    const rulesHTML = g.rules.map((r, i) => `
      <div class="rule">
        <div class="rule-head">
          <span class="rule-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="rule-title">${r.title}</span>
        </div>
        <div class="rule-body">${r.body}</div>
        ${r.example ? `<div class="rule-example"><span class="tag">example</span>${r.example.replace(/\n/g, '<br>')}</div>` : ''}
      </div>
    `).join('');

    section.innerHTML = `
      ${statHTML}
      <h1>${g.title}</h1>
      <p class="guide-intro">${g.intro}</p>
      ${rulesHTML}
    `;

    return section;
  }

  function showPage(key) {
    // hide all pages currently in DOM
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    if (key === 'home') {
      document.getElementById('page-home').classList.add('active');
      crumbCurrent.textContent = 'home';
      setActiveButton(null);
      backBtn.classList.remove('visible');
      history.replaceState(null, '', '#');
      return;
    }

    if (!renderedPages[key]) {
      const el = buildGuidePage(key);
      if (!el) return;
      paneBody.appendChild(el);
      renderedPages[key] = el;
    }

    renderedPages[key].classList.add('active');
    crumbCurrent.textContent = GUIDES[key].title.toLowerCase();
    setActiveButton(key);
    backBtn.classList.add('visible');
    paneBody.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    // reflect in URL hash without triggering a reload
    history.replaceState(null, '', '#' + key);
  }

  function setActiveButton(key) {
    railButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === key);
    });
  }

  // Wire up every button that has a data-page attribute (rail + home cards)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn) return;
    showPage(btn.dataset.page);
  });

  // Back button always returns to home
  backBtn.addEventListener('click', () => showPage('home'));

  // Deep-link support: opening #retention loads straight to that guide
  const initial = window.location.hash.replace('#', '');
  if (initial && GUIDES[initial]) {
    showPage(initial);
  } else {
    showPage('home');
  }
})();
