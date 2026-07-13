(function () {
  const paneBody = document.getElementById('paneBody');
  const crumbCurrent = document.getElementById('crumbCurrent');
  const backBtn = document.getElementById('backBtn');
  const railButtons = document.querySelectorAll('.rail-btn');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  const toTopBtn = document.getElementById('toTopBtn');

  // ---- last updated date ----
  if (lastUpdatedEl) {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    lastUpdatedEl.textContent = 'last updated: ' + formatted;
  }

  // ---- back to top button ----
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
    });
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- odometer-style rolling number display ----
  // renders a number as individual digit "reels" that slide when the value changes
  function renderOdometer(el, value) {
    const str = value.toLocaleString('en-US');
    const chars = str.split('');

    // build structure once, then just update reel positions on subsequent calls
    if (!el.dataset.odoBuilt) {
      el.innerHTML = chars.map(ch => {
        if (ch === ',') return `<span class="odo-comma">,</span>`;
        return `<span class="odo-digit"><span class="odo-digit-strip">${
          Array.from({length:10}, (_,i)=>`<span>${i}</span>`).join('')
        }</span></span>`;
      }).join('');
      el.dataset.odoBuilt = '1';
      el.dataset.odoLen = chars.length;
      // set initial position instantly (no slide-in on first render)
      let digitIndex = 0;
      chars.forEach(ch => {
        if (ch === ',') return;
        const strip = el.querySelectorAll('.odo-digit-strip')[digitIndex];
        strip.style.transition = 'none';
        strip.style.transform = `translateY(${-parseInt(ch, 10) * 32}px)`;
        digitIndex++;
      });
      requestAnimationFrame(() => {
        el.querySelectorAll('.odo-digit-strip').forEach(s => s.style.transition = '');
      });
      return;
    }

    // if digit count changed (number grew a digit), rebuild fresh
    if (parseInt(el.dataset.odoLen, 10) !== chars.length) {
      el.dataset.odoBuilt = '';
      renderOdometer(el, value);
      return;
    }

    let digitIndex = 0;
    chars.forEach(ch => {
      if (ch === ',') { digitIndex += 0; return; }
      const strip = el.querySelectorAll('.odo-digit-strip')[digitIndex];
      if (strip) strip.style.transform = `translateY(${-parseInt(ch, 10) * 32}px)`;
      digitIndex++;
    });
  }

  // ---- simulated "live" stat counters on home page ----
  (function initLiveStats() {
    const viewsEl = document.getElementById('statViews');
    const subsEl = document.getElementById('statSubs');
    if (!viewsEl || !subsEl) return;

    let views = 128430;
    let subs = 4820;

    renderOdometer(viewsEl, views);
    renderOdometer(subsEl, subs);

    setInterval(() => {
      views += Math.floor(Math.random() * 40) + 5;
      if (Math.random() < 0.3) subs += 1;
      renderOdometer(viewsEl, views);
      renderOdometer(subsEl, subs);
    }, 4000);
  })();

  // ---- section number lookup for crumbs ----
  const SECTION_LABELS = {
    scripting: '01 · scripting',
    packaging: '02 · packaging',
    algorithm: '03 · algorithm',
    channelops: '04 · channel ops'
  };

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
  // viewBox is 560 x 220. Plot area: y=20 (100% retention) to y=200 (0% retention).
  // pctToY(pct) = 20 + (1 - pct/100) * 180
  function pctToY(pct) {
    return 20 + (1 - pct / 100) * 180;
  }

  const CURVES = {
    good: {
      // starts ~92%, small dip, flattens, ends exactly at 60% (target)
      path: `M0,${pctToY(92)} C80,${pctToY(84)} 160,${pctToY(78)} 240,${pctToY(72)} S400,${pctToY(64)} 560,${pctToY(60)}`,
      caption: "Small initial dip, mostly flat line, ends right at the 60% target. This is what YouTube wants to keep pushing. 🚀"
    },
    bad: {
      // starts ~92%, steep early drop, steep mid drop, ends ~18%
      path: `M0,${pctToY(92)} C40,${pctToY(48)} 120,${pctToY(38)} 240,${pctToY(32)} S420,${pctToY(20)} 560,${pctToY(18)}`,
      caption: "Steep drop right at the start (bad hook), then another steep drop mid-video (bad pacing / restated point). This kills the push. 📉"
    }
  };

  function buildRetentionGraph() {
    return `
      <div class="graph-widget">
        <div class="graph-toggle" role="tablist">
          <button class="graph-tab active" data-curve="good" type="button">✅ Good retention</button>
          <button class="graph-tab" data-curve="bad" type="button">❌ Bad retention</button>
        </div>
        <div class="graph-axes">
          <div class="graph-ylabels">
            <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
          </div>
          <div class="graph-canvas">
            <svg class="graph-svg" id="graphSvg" viewBox="0 0 560 220" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="200" x2="560" y2="200" stroke="var(--border)" stroke-width="1"/>
              <line x1="0" y1="20" x2="0" y2="200" stroke="var(--border)" stroke-width="1"/>
              <path id="graphPath" fill="none" stroke="var(--violet-bright)" stroke-width="3" stroke-linecap="round"
                    d="${CURVES.good.path}" />
              <line id="hoverLine" x1="0" y1="20" x2="0" y2="200" stroke="var(--violet-bright)" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>
              <circle id="hoverDot" cx="0" cy="0" r="5" fill="var(--violet-bright)" stroke="var(--bg-raised)" stroke-width="2" opacity="0"/>
            </svg>
            <div class="graph-tooltip" id="graphTooltip"></div>
          </div>
          <div class="graph-xlabels">
            <span>0:00</span><span>2:00</span><span>4:00</span><span>6:00</span><span>8:00</span>
          </div>
        </div>
        <div class="graph-caption" id="graphCaption">${CURVES.good.caption}</div>
      </div>
    `;
  }

  function wireRetentionGraph(scope) {
    const tabs = scope.querySelectorAll('.graph-tab');
    const path = scope.querySelector('#graphPath');
    const caption = scope.querySelector('#graphCaption');
    const svg = scope.querySelector('#graphSvg');
    const hoverDot = scope.querySelector('#hoverDot');
    const hoverLine = scope.querySelector('#hoverLine');
    const tooltip = scope.querySelector('#graphTooltip');

    function sampleCurve() {
      const len = path.getTotalLength();
      const samples = [];
      const steps = 140;
      for (let i = 0; i <= steps; i++) {
        samples.push(path.getPointAtLength((i / steps) * len));
      }
      return samples;
    }

    let samples = sampleCurve();

    function retentionAtY(y) {
      const topY = 20, bottomY = 200;
      const clampedY = Math.max(topY, Math.min(bottomY, y));
      return Math.round(100 - ((clampedY - topY) / (bottomY - topY)) * 100);
    }

    function timeLabelAtX(xFraction) {
      const totalSeconds = 480; // 8 minute reference video
      const s = Math.round(xFraction * totalSeconds);
      const m = Math.floor(s / 60);
      const sec = String(s % 60).padStart(2, '0');
      return `${m}:${sec}`;
    }

    function updateHover(clientX) {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;
      const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const svgX = relX * 560;

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

      const pct = retentionAtY(nearest.y);
      const time = timeLabelAtX(nearest.x / 560);

      tooltip.innerHTML = `<span class="tt-time">${time}</span><span class="tt-pct">${pct}% retention</span>`;
      tooltip.style.opacity = '1';

      const tooltipX = Math.min(Math.max((nearest.x / 560) * rect.width - 55, 4), rect.width - 114);
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
        path.style.transition = 'opacity 0.15s ease';
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

  // ---- interactive wave-system bar chart (fidget-bounce on click) ----
  const WAVES = [
    { label: 'Wave 1', impressions: 400, desc: 'Small test group. YouTube watches CTR + early retention closely. 🧪' },
    { label: 'Wave 2', impressions: 1200, desc: 'Responded well, so it ramps up. Still browse feed only. 📈' },
    { label: 'Wave 3', impressions: 4500, desc: 'Continued strong signal, bigger push, browse feed expands. 🚀' },
    { label: 'Wave 4', impressions: 9000, desc: 'Suggested feed unlocks, the high-value placement. 💎' },
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
      bar.addEventListener('click', () => {
        bars.forEach(b => b.classList.remove('active'));
        bar.classList.add('active');
        caption.textContent = WAVES[Number(bar.dataset.index)].desc;

        // fidget-toy bounce feedback on every click
        bar.classList.remove('bounce');
        // force reflow so animation restarts even on repeat clicks
        void bar.offsetWidth;
        bar.classList.add('bounce');
      });
    });
  }

  function showPage(key) {
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

    history.replaceState(null, '', '#' + key);
  }

  function setActiveButton(key) {
    railButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === key);
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn) return;
    showPage(btn.dataset.page);
  });

  backBtn.addEventListener('click', () => showPage('home'));

  const initial = window.location.hash.replace('#', '');
  if (initial && GUIDES[initial]) {
    showPage(initial);
  } else {
    showPage('home');
  }
})();
