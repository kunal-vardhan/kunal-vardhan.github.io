(() => {
  const body = document.body;
  const html = document.documentElement;
  if (!body || !body.classList.contains('world-v2')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const boring = () => html.classList.contains('boring-mode');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  /* Keep page identity stable even if one body class is missed in markup. */
  const path = location.pathname;
  if (path === '/' || path.endsWith('/index.html')) body.classList.add('page-home');
  if (path === '/strategy.html') body.classList.add('page-strategy');
  if (path === '/work.html') body.classList.add('page-work');
  if (path === '/about.html') body.classList.add('page-about');
  if (path === '/case-studies/' || path.endsWith('/case-studies/index.html')) body.classList.add('page-cases');
  if (path.includes('/case-studies/') && !body.classList.contains('page-cases')) {
    body.classList.add('page-case');
    if (path.includes('api-organic-growth')) body.classList.add('case-api');
    if (path.includes('logistics-search-growth')) body.classList.add('case-logistics');
    if (path.includes('enterprise-software-content')) body.classList.add('case-enterprise');
    if (path.includes('learniverse-growth')) body.classList.add('case-learniverse');
  }

  /* Header reacts to the world, not to individual sections. */
  const updateHeader = () => body.classList.toggle('world-scrolled', window.scrollY > 28);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* A quiet route running through the whole document. */
  const main = document.querySelector('main');
  let routeSvg = null;
  let routeRaf = 0;
  const drawRoute = () => {
    routeRaf = 0;
    if (!main || reduceMotion.matches || boring()) return;
    if (!routeSvg) {
      routeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      routeSvg.setAttribute('class', 'world-route');
      routeSvg.setAttribute('aria-hidden', 'true');
      routeSvg.setAttribute('preserveAspectRatio', 'none');
      routeSvg.innerHTML = '<path class="world-route-solid"></path><path></path>';
      main.prepend(routeSvg);
    }
    const h = Math.max(main.scrollHeight, window.innerHeight);
    routeSvg.setAttribute('viewBox', `0 0 1000 ${h}`);
    routeSvg.style.height = `${h}px`;
    const points = [];
    const step = Math.max(520, Math.min(760, h / 8));
    for (let y = 120, i = 0; y < h - 100; y += step, i++) {
      const x = i % 4 === 0 ? 160 : i % 4 === 1 ? 790 : i % 4 === 2 ? 330 : 700;
      points.push([x, y]);
    }
    if (!points.length) return;
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [px, py] = points[i - 1];
      const [x, y] = points[i];
      const cy = py + (y - py) * .5;
      d += ` C ${px} ${cy}, ${x} ${cy}, ${x} ${y}`;
    }
    routeSvg.querySelectorAll('path').forEach(el => el.setAttribute('d', d));
  };
  const scheduleRoute = () => {
    if (!routeRaf) routeRaf = requestAnimationFrame(drawRoute);
  };
  drawRoute();
  window.addEventListener('resize', scheduleRoute, { passive: true });
  window.addEventListener('load', scheduleRoute, { once: true });

  /* Cohesive entrance physics for content blocks. */
  const revealTargets = [...document.querySelectorAll([
    '.section-head',
    '.about-layout',
    '.strategy-map',
    '.strategy-grid-2 .panel',
    '.roadmap article',
    '.visual-work-card',
    '.case-hub-card',
    '.case-prose > section',
    '.review-card',
    '.about-teaser',
    '.contact-card',
    '.full-brand-wall'
  ].join(','))];

  if (reduceMotion.matches || boring() || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('world-reveal', 'world-visible'));
  } else {
    revealTargets.forEach((el, i) => {
      el.classList.add('world-reveal');
      el.style.setProperty('--world-enter-y', `${28 + (i % 3) * 7}px`);
    });
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('world-visible');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* Strategy is a map room. Existing content becomes the map itself. */
  const strategyMap = document.querySelector('.strategy-map');
  const strategyFlow = strategyMap?.querySelector('.strategy-flow');
  let strategyLines = null;
  let strategyCenter = null;
  let lineRaf = 0;

  const drawStrategyLines = () => {
    lineRaf = 0;
    if (!strategyMap || !strategyFlow || innerWidth <= 980 || reduceMotion.matches || boring()) return;
    if (!strategyCenter) {
      strategyCenter = document.createElement('div');
      strategyCenter.className = 'world-strategy-center';
      strategyCenter.textContent = 'Content plan';
      strategyFlow.appendChild(strategyCenter);
    }
    if (!strategyLines) {
      strategyLines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      strategyLines.setAttribute('class', 'world-strategy-lines');
      strategyLines.setAttribute('aria-hidden', 'true');
      strategyMap.prepend(strategyLines);
    }
    const mapRect = strategyMap.getBoundingClientRect();
    const centerRect = strategyCenter.getBoundingClientRect();
    const cx = centerRect.left - mapRect.left + centerRect.width / 2;
    const cy = centerRect.top - mapRect.top + centerRect.height / 2;
    const w = strategyMap.clientWidth;
    const h = strategyMap.clientHeight;
    strategyLines.setAttribute('viewBox', `0 0 ${w} ${h}`);
    strategyLines.innerHTML = '';
    strategyFlow.querySelectorAll('.strategy-node').forEach(node => {
      const r = node.getBoundingClientRect();
      const x = r.left - mapRect.left + r.width / 2;
      const y = r.top - mapRect.top + r.height / 2;
      const bend = (x < cx ? -1 : 1) * Math.min(70, Math.abs(x - cx) * .18);
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M ${x} ${y} C ${x + bend} ${y}, ${cx - bend} ${cy}, ${cx} ${cy}`);
      strategyLines.appendChild(p);
    });
  };
  const scheduleStrategy = () => {
    if (!lineRaf) lineRaf = requestAnimationFrame(drawStrategyLines);
  };
  drawStrategyLines();
  window.addEventListener('resize', scheduleStrategy, { passive: true });
  window.addEventListener('load', scheduleStrategy, { once: true });

  document.querySelectorAll('.roadmap article').forEach((article, index) => {
    article.dataset.worldStep = String(index + 1).padStart(2, '0');
  });

  /* Case-study sections become numbered records with a tiny reading compass. */
  const caseSections = [...document.querySelectorAll('.case-prose > section')];
  if (caseSections.length) {
    caseSections.forEach((section, index) => {
      section.dataset.worldIndex = String(index + 1).padStart(2, '0');
    });
    if (!reduceMotion.matches && !boring()) {
      const compass = document.createElement('div');
      compass.className = 'world-case-progress';
      compass.setAttribute('aria-hidden', 'true');
      caseSections.forEach(() => compass.appendChild(document.createElement('span')));
      body.appendChild(compass);
      const dots = [...compass.children];
      const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = caseSections.indexOf(visible.target);
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -45% 0px' });
      caseSections.forEach(section => sectionObserver.observe(section));
    }
  }

  /* About stops being a Lumos demo and becomes the common room. */
  const lumosGrid = document.querySelector('.lumos-grid');
  if (lumosGrid && body.classList.contains('page-about')) {
    const gag = document.createElement('p');
    gag.className = 'world-dash-gag';
    gag.innerHTML = 'I tried to explain the punctuation feud<span class="world-dash">—</span>then it left.';
    lumosGrid.insertAdjacentElement('afterend', gag);
    const dash = gag.querySelector('.world-dash');
    if (dash && !reduceMotion.matches && !boring()) {
      const dashObserver = new IntersectionObserver(entries => {
        if (!entries[0]?.isIntersecting) return;
        dashObserver.disconnect();
        setTimeout(() => dash.classList.add('is-gone'), 700);
      }, { threshold: .7 });
      dashObserver.observe(gag);
    }
  }

  /* Same-origin page movement gets one quiet curtain. */
  const curtain = document.createElement('div');
  curtain.className = 'world-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  body.appendChild(curtain);

  if (!reduceMotion.matches) {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      let url;
      try { url = new URL(link.href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      event.preventDefault();
      body.classList.add('world-leaving');
      setTimeout(() => { location.href = url.href; }, 420);
    });
  }

  /* Spells are easter eggs, not navigation requirements. */
  const status = document.createElement('div');
  status.className = 'world-spell-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  body.appendChild(status);
  let typed = '';
  let statusTimer = 0;
  const announce = message => {
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add('is-visible');
    statusTimer = setTimeout(() => status.classList.remove('is-visible'), 1800);
  };
  const cast = spell => {
    if (spell === 'lumos') {
      html.classList.add('magic-lumos');
      try { sessionStorage.setItem('kv-magic-lumos', '1'); } catch {}
      announce('Lumos. Useful things were already visible. They are just being dramatic now.');
    }
    if (spell === 'nox') {
      html.classList.remove('magic-lumos');
      try { sessionStorage.removeItem('kv-magic-lumos'); } catch {}
      announce('Nox. Back to normal-ish.');
    }
    if (spell === 'revelio') {
      const target = document.querySelector('.evidence-frame, .feature-result, .case-outcome, .byline-note');
      if (target) {
        target.animate?.([
          { transform: 'translateY(0) scale(1)', boxShadow: '0 0 0 rgba(168,135,85,0)' },
          { transform: 'translateY(-4px) scale(1.012)', boxShadow: '0 0 32px rgba(168,135,85,.24)' },
          { transform: 'translateY(0) scale(1)', boxShadow: '0 0 0 rgba(168,135,85,0)' }
        ], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' });
        announce('Revelio. There. The receipts.');
      } else {
        announce('Revelio. Nothing was hiding on this bit.');
      }
    }
  };
  window.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || event.target?.isContentEditable) return;
    if (event.key.length !== 1) return;
    typed = (typed + event.key.toLowerCase()).slice(-12);
    for (const spell of ['revelio', 'lumos', 'nox']) {
      if (typed.endsWith(spell)) {
        cast(spell);
        typed = '';
        break;
      }
    }
  });

  try {
    if (sessionStorage.getItem('kv-magic-lumos') === '1') html.classList.add('magic-lumos');
  } catch {}

  /* Existing boring-mode control remains authoritative. */
  window.addEventListener('portfolio:boringchange', event => {
    if (event.detail?.boring) {
      routeSvg?.remove();
      routeSvg = null;
      document.querySelector('.world-case-progress')?.remove();
    } else {
      scheduleRoute();
      scheduleStrategy();
    }
  });
})();
