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

    const graphHTML = g.hasGraph ? buildRetentionGraph() : '';

    section.innerHTML = `
      ${statHTML}
      <h1>${g.title}</h1>
      <p class="guide-intro">${g.intro}</p>
      ${graphHTML}
      ${rulesHTML}
    `;

    if (g.hasGraph) {
      // wire up toggle after the markup is in the DOM
      requestAnimationFrame(() => wireRetentionGraph(section));
    }

    return section;
  }

  // ---- interactive retention graph (good vs bad curve) ----
  function buildRetentionGraph() {
    return `
      <div class="graph-widget">
        <div class="graph-toggle" role="tablist">
          <button class="graph-tab active" data-curve="good" type="button">✅ Good retention</button>
          <button class="graph-tab" data-curve="bad" type="button">❌ Bad retention</button>
        </div>
        <svg class="graph-svg" viewBox="0 0 560 220" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="200" x2="560" y2="200" stroke="var(--border)" stroke-width="1"/>
          <line x1="0" y1="20" x2="0" y2="200" stroke="var(--border)" stroke-width="1"/>
          <path id="graphPath" fill="none" stroke="var(--violet-bright)" stroke-width="3" stroke-linecap="round"
                d="M0,40 C80,60 160,70 240,90 S400,120 560,140" />
        </svg>
        <div class="graph-caption" id="graphCaption">Small initial dip, mostly flat line, ends around 60% — this is what YouTube wants to keep pushing.</div>
      </div>
    `;
  }

  const CURVES = {
    good: {
      path: "M0,40 C80,60 160,70 240,90 S400,120 560,140",
      caption: "Small initial dip, mostly flat line, ends around 60% — this is what YouTube wants to keep pushing. 🚀"
    },
    bad: {
      path: "M0,40 C40,140 120,165 240,175 S420,195 560,205",
      caption: "Steep drop right at the start (bad hook), then another steep drop mid-video (bad pacing / restated point). This kills the push. 📉"
    }
  };

  function wireRetentionGraph(scope) {
    const tabs = scope.querySelectorAll('.graph-tab');
    const path = scope.querySelector('#graphPath');
    const caption = scope.querySelector('#graphCaption');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const curve = CURVES[tab.dataset.curve];
        path.style.opacity = '0';
        setTimeout(() => {
          path.setAttribute('d', curve.path);
          caption.textContent = curve.caption;
          path.style.opacity = '1';
        }, 150);
      });
    });
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
