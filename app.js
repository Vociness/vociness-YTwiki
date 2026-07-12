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

  // ---- simulated "live" stat counters on home page ----
  (function initLiveStats() {
    const viewsEl = document.getElementById('statViews');
    const subsEl = document.getElementById('statSubs');
    if (!viewsEl || !subsEl) return;

    let views = 128430;
    let subs = 4820;

    function format(n) {
      return n.toLocaleString('en-US');
    }

    function render() {
      viewsEl.textContent = format(views);
      subsEl.textContent = format(subs);
    }

    render();

    setInterval(() => {
      views += Math.floor(Math.random() * 40) + 5;
      if (Math.random() < 0.3) subs += 1;
      render();
    }, 4000);
  })();

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

    const graphHTML = g.hasGraph ? buildRetentionGraph() : (g.hasWaveGraph ? buildWaveGraph() : '');

    section.innerHTML = `
      ${statHTML}
      <h1>${g.title}</h1>
      <p class="guide-intro">${g.intro}</p>
      ${graphHTML}
      ${rulesHTML}
    `;

    if (g.hasGraph) {
      requestAnimationFrame(() => wireRetentionGraph(section));
    }
    if (g.hasWaveGraph) {
      requestAnimationFrame(() => wireWaveGraph(section));
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
        <div class="graph-canvas">
          <svg class="graph-svg" id="graphSvg" viewBox="0 0 560 220" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="200" x2="560" y2="200" stroke="var(--border)" stroke-width="1"/>
            <line x1="0" y1="20" x2="0" y2="200" stroke="var(--border)" stroke-width="1"/>
            <path id="graphPath" fill="none" stroke="var(--violet-bright)" stroke-width="3" stroke-linecap="round"
                  d="M0,40 C80,60 160,70 240,90 S400,120 560,140" />
            <line id="hoverLine" x1="0" y1="20" x2="0" y2="200" stroke="var(--violet-bright)" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>
            <circle id="hoverDot" cx="0" cy="0" r="5" fill="var(--violet-bright)" stroke="var(--bg-raised)" stroke-width="2" opacity="0"/>
          </svg>
          <div class="graph-tooltip" id="graphTooltip"></div>
        </div>
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

  // ---- interactive wave-system bar chart ----
  const WAVES = [
    { label: 'Wave 1', impressions: 400, desc: 'Small test group. YouTube watches CTR + early retention closely. 🧪' },
    { label: 'Wave 2', impressions: 1200, desc: 'Responded well → ramp up. Still browse feed only. 📈' },
    { label: 'Wave 3', impressions: 4500, desc: 'Continued strong signal → bigger push, browse feed expands. 🚀' },
    { label: 'Wave 4', impressions: 9000, desc: 'Suggested feed unlocks — the high-value placement. 💎' },
    { label: 'Wave 5', impressions: 15000, desc: 'Full push. Session-time data now decides how far this goes. 🌊' }
  ];

  function buildWaveGraph() {
    const max = Math.max(...WAVES.map(w => w.impressions));
    const bars = WAVES.map((w, i) => {
      const heightPct = Math.round((w.impressions / max) * 100);
      return `
        <button class="wave-bar-wrap" data-index="${i}" type="button">
          <span class="wave-bar" style="height:${heightPct}%"></span>
          <span class="wave-bar-label">${w.label}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="graph-widget">
        <div class="wave-chart">${bars}</div>
        <div class="wave-caption" id="waveCaption">${WAVES[0].desc}</div>
      </div>
    `;
  }

  function wireWaveGraph(scope) {
    const bars = scope.querySelectorAll('.wave-bar-wrap');
    const caption = scope.querySelector('#waveCaption');
    bars.forEach(bar => {
      const setActive = () => {
        bars.forEach(b => b.classList.remove('active'));
        bar.classList.add('active');
        caption.textContent = WAVES[Number(bar.dataset.index)].desc;
      };
      bar.addEventListener('mouseenter', setActive);
      bar.addEventListener('click', setActive);
      bar.addEventListener('focus', setActive);
    });
  }

  function wireRetentionGraph(scope) {
    const tabs = scope.querySelectorAll('.graph-tab');
    const path = scope.querySelector('#graphPath');
    const caption = scope.querySelector('#graphCaption');
    const svg = scope.querySelector('#graphSvg');
    const hoverDot = scope.querySelector('#hoverDot');
    const hoverLine = scope.querySelector('#hoverLine');
    const tooltip = scope.querySelector('#graphTooltip');

    // sample N points along the current path so we can find y for any x
    function sampleCurve() {
      const len = path.getTotalLength();
      const samples = [];
      const steps = 140;
      for (let i = 0; i <= steps; i++) {
        const pt = path.getPointAtLength((i / steps) * len);
        samples.push(pt);
      }
      return samples;
    }

    let samples = sampleCurve();

    function retentionAtX(xSvg) {
      // 220 viewBox height, plot area is y:20(top)-200(bottom) => retention 100%-0%... but graphs represent ~90%→~30% range visually
      // Map y position to an approximate retention percent for display purposes
      const topY = 20, bottomY = 200;
      const clampedY = Math.max(topY, Math.min(bottomY, xSvg.y));
      const pct = 100 - ((clampedY - topY) / (bottomY - topY)) * 100;
      return Math.round(pct);
    }

    function timeLabelAtX(xFraction) {
      // assumes an 8 minute (480s) video for labeling purposes
      const totalSeconds = 480;
      const s = Math.round(xFraction * totalSeconds);
      const m = Math.floor(s / 60);
      const sec = String(s % 60).padStart(2, '0');
      return `${m}:${sec}`;
    }

    function updateHover(clientX) {
      const rect = svg.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const svgX = relX * 560;

      // find nearest sample by x
      let nearest = samples[0];
      let nearestDist = Infinity;
      for (const s of samples) {
        const d = Math.abs(s.x - svgX);
        if (d < nearestDist) { nearestDist = d; nearest = s; }
      }

      hoverDot.setAttribute('cx', nearest.x);
      hoverDot.setAttribute('cy', nearest.y);
      hoverDot.setAttribute('opacity', '1');
      hoverLine.setAttribute('x1', nearest.x);
      hoverLine.setAttribute('x2', nearest.x);
      hoverLine.setAttribute('opacity', '1');

      const pct = retentionAtX(nearest);
      const time = timeLabelAtX(nearest.x / 560);

      tooltip.innerHTML = `<span class="tt-time">${time}</span><span class="tt-pct">${pct}% retention</span>`;
      tooltip.style.opacity = '1';

      // position tooltip near the dot, keep inside bounds
      const tooltipX = Math.min(Math.max(nearest.x / 560 * rect.width - 55, 4), rect.width - 114);
      const tooltipY = Math.max((nearest.y / 220) * rect.height - 54, 4);
      tooltip.style.left = tooltipX + 'px';
      tooltip.style.top = tooltipY + 'px';
    }

    function hideHover() {
      hoverDot.setAttribute('opacity', '0');
      hoverLine.setAttribute('opacity', '0');
      tooltip.style.opacity = '0';
    }

    svg.addEventListener('mousemove', (e) => updateHover(e.clientX));
    svg.addEventListener('mouseleave', hideHover);
    svg.addEventListener('touchmove', (e) => {
      if (e.touches[0]) updateHover(e.touches[0].clientX);
    }, { passive: true });
    svg.addEventListener('touchend', hideHover);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const curve = CURVES[tab.dataset.curve];
        path.style.opacity = '0';
        hideHover();
        setTimeout(() => {
          path.setAttribute('d', curve.path);
          caption.textContent = curve.caption;
          path.style.opacity = '1';
          samples = sampleCurve();
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
      setActiveButton('home');
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
