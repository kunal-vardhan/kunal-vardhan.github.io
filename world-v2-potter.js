(() => {
  const body = document.body;
  const html = document.documentElement;
  if (!body?.classList.contains('world-v2')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const smooth = t => {
    t = clamp(t);
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  const addNote = (container, text) => {
    if (!container || container.querySelector('.world-hp-note')) return;
    const note = document.createElement('p');
    note.className = 'world-hp-note';
    note.textContent = text;
    container.appendChild(note);
  };

  const hero = document.querySelector('.page-hero .container, .case-page-hero .container');

  /* Copy should sound like Kunal first. Potter references are the side-eye, not the pitch. */
  if (body.classList.contains('page-home')) {
    const heroCopy = document.querySelector('.hero-copy');
    const title = heroCopy?.querySelector('h1');
    const text = heroCopy?.querySelector('.hero-text');
    if (title) title.textContent = 'I make complicated products easier to understand and easier to choose.';
    if (text) text.textContent = 'Most of my recent work has been in B2B SaaS, APIs, logistics, cybersecurity, and enterprise software. I start with the product and the buyer, then work out what needs to be written, refreshed, connected, or built from scratch.';
    addNote(heroCopy, '50+ Harry Potter rewatches. This website never stood a chance.');
  } else if (body.classList.contains('page-strategy')) {
    addNote(hero, 'No Time-Turner. I actually have to plan this stuff.');
  } else if (body.classList.contains('page-work')) {
    addNote(hero, 'Restricted Section rules do not apply here. Open whatever you want.');
  } else if (body.classList.contains('page-cases')) {
    addNote(hero, 'The receipts are less exciting than a Pensieve. Still useful.');
  } else if (body.classList.contains('page-about')) {
    addNote(hero, 'Yes, the Harry Potter thing is real. I stopped counting after 50 rewatches.');
  } else if (body.classList.contains('page-case')) {
    addNote(hero, 'Proof first. Wand later.');
  }

  /* First-glance Potter cue: the existing threshold becomes a short folding map entrance. */
  const threshold = body.classList.contains('page-home') ? document.querySelector('[data-threshold]') : null;
  if (threshold) {
    const sticky = threshold.querySelector('.threshold-sticky');
    const arrival = threshold.querySelector('.threshold-arrival');
    const left = threshold.querySelector('.threshold-wing-left');
    const right = threshold.querySelector('.threshold-wing-right');
    const light = threshold.querySelector('.threshold-light');
    const heroSection = threshold.querySelector('.story-hero');
    const hpLine = threshold.querySelector('.threshold-hp');
    const enter = threshold.querySelector('.threshold-enter-copy');

    if (hpLine) hpLine.textContent = '50+ rewatches. This was never going to be a normal entrance.';
    if (enter) enter.textContent = 'Scroll to unfold';

    if (sticky && arrival && left && right && light && heroSection) {
      body.classList.add('hp-entry');

      const ticket = document.createElement('div');
      ticket.className = 'hp-entry-ticket';
      ticket.setAttribute('aria-hidden', 'true');
      ticket.innerHTML = '<span>Platform</span><strong>9¾</strong><small>Portfolio Express</small>';
      arrival.appendChild(ticket);

      const footsteps = document.createElement('div');
      footsteps.className = 'hp-entry-steps';
      footsteps.setAttribute('aria-hidden', 'true');
      footsteps.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
      sticky.appendChild(footsteps);

      let target = 0;
      let rendered = 0;
      let raf = 0;
      let last = performance.now();

      const measure = () => {
        if (innerWidth <= 760 || reduceMotion.matches) {
          target = 1;
          return;
        }
        const rect = threshold.getBoundingClientRect();
        const travel = Math.max(1, threshold.offsetHeight - innerHeight);
        target = clamp(-rect.top / travel);
      };

      const paint = value => {
        const opening = smooth((value - .05) / .76);
        const ink = smooth((value - .02) / .46) * (1 - .5 * smooth((value - .66) / .28));
        const copyOut = 1 - smooth((value - .14) / .38);
        const heroIn = smooth((value - .18) / .62);
        sticky.style.setProperty('--hp-open', opening.toFixed(4));
        sticky.style.setProperty('--hp-ink', ink.toFixed(4));
        sticky.style.setProperty('--hp-copy', copyOut.toFixed(4));
        sticky.style.setProperty('--hp-hero', heroIn.toFixed(4));
        threshold.classList.toggle('hp-entry-open', value > .7);
      };

      const tick = now => {
        raf = 0;
        const dt = Math.min(40, Math.max(1, now - last));
        last = now;
        const follow = 1 - Math.exp(-dt / 105);
        rendered += (target - rendered) * follow;
        if (Math.abs(target - rendered) < .0007) rendered = target;
        paint(rendered);
        if (rendered !== target) raf = requestAnimationFrame(tick);
      };

      const schedule = () => {
        measure();
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };

      if (innerWidth <= 760 || reduceMotion.matches) {
        target = rendered = 1;
        paint(1);
      } else {
        measure();
        rendered = target;
        paint(rendered);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
        window.addEventListener('pageshow', schedule, { passive: true });
      }
    }
  }

  /* Strategy: the relationship should be visible before anyone reads the labels. */
  if (body.classList.contains('page-strategy')) {
    const grid = document.querySelector('.strategy-grid-2');
    const funnel = grid?.querySelector('.funnel');
    const cluster = grid?.querySelector('.cluster');
    const hub = cluster?.querySelector('.hub');
    const nodes = cluster ? [...cluster.querySelectorAll('.node')] : [];

    if (funnel && !funnel.querySelector('.hp-funnel-spine')) {
      const spine = document.createElement('span');
      spine.className = 'hp-funnel-spine';
      spine.setAttribute('aria-hidden', 'true');
      funnel.prepend(spine);
    }

    if (cluster && hub && nodes.length) {
      cluster.classList.add('hp-topic-map');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('hp-cluster-lines');
      svg.setAttribute('aria-hidden', 'true');
      cluster.prepend(svg);
      const paths = nodes.map((node, index) => {
        node.dataset.clusterIndex = String(index + 1);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('pathLength', '1');
        svg.appendChild(path);
        return path;
      });

      let lineRaf = 0;
      const draw = () => {
        lineRaf = 0;
        if (innerWidth <= 700) return;
        const box = cluster.getBoundingClientRect();
        const hr = hub.getBoundingClientRect();
        const hx = hr.left - box.left + hr.width / 2;
        const hy = hr.top - box.top + hr.height / 2;
        svg.setAttribute('viewBox', `0 0 ${Math.max(1, cluster.clientWidth)} ${Math.max(1, cluster.clientHeight)}`);
        nodes.forEach((node, i) => {
          const nr = node.getBoundingClientRect();
          const nx = nr.left - box.left + nr.width / 2;
          const ny = nr.top - box.top + nr.height / 2;
          const bendX = (hx + nx) / 2;
          const bendY = (hy + ny) / 2 + (i % 2 ? 12 : -12);
          paths[i].setAttribute('d', `M ${hx} ${hy} Q ${bendX} ${bendY} ${nx} ${ny}`);
        });
      };
      const schedule = () => { if (!lineRaf) lineRaf = requestAnimationFrame(draw); };
      requestAnimationFrame(draw);
      document.fonts?.ready.then(draw).catch(() => {});
      window.addEventListener('resize', schedule, { passive: true });
      window.addEventListener('load', schedule, { once: true });
    }

    const roadmap = document.querySelector('.roadmap');
    if (roadmap && !roadmap.querySelector('.hp-route-label')) {
      const routeLabel = document.createElement('span');
      routeLabel.className = 'hp-route-label';
      routeLabel.textContent = 'Next stop: whatever the evidence says';
      roadmap.appendChild(routeLabel);
    }
  }

  /* Functional Marauder's Map-inspired site navigation. */
  const footer = document.querySelector('.site-footer .footer-wrap');
  if (footer && !footer.querySelector('.hp-map-toggle')) {
    footer.querySelector('.world-footer-note')?.remove();

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'hp-map-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'portfolio-map');
    toggle.textContent = 'Mischief managed';

    const homeLink = footer.querySelector('a');
    if (homeLink) footer.insertBefore(toggle, homeLink);
    else footer.appendChild(toggle);

    const overlay = document.createElement('div');
    overlay.className = 'hp-site-map';
    overlay.id = 'portfolio-map';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="hp-site-map-backdrop" data-map-close></div>
      <section class="hp-site-map-sheet" role="dialog" aria-modal="true" aria-labelledby="hp-map-title">
        <button class="hp-map-close" type="button" data-map-close aria-label="Close portfolio map">Mischief managed</button>
        <div class="hp-map-heading">
          <span>Kunal Vardhan</span>
          <h2 id="hp-map-title">The portfolio map</h2>
          <p>If you get lost, the map is doing a poor job.</p>
        </div>
        <div class="hp-map-field">
          <svg class="hp-map-paths" viewBox="0 0 1000 560" aria-hidden="true" preserveAspectRatio="none">
            <path class="hp-map-ink" d="M120 300 C210 165 300 160 385 270 S535 420 615 270 S780 130 890 260"/>
            <path class="hp-map-trail" d="M120 300 C210 165 300 160 385 270 S535 420 615 270 S780 130 890 260"/>
          </svg>
          <a class="hp-map-stop hp-stop-home" href="/"><b>01</b><span>Home</span><small>Start here</small></a>
          <a class="hp-map-stop hp-stop-cases" href="/case-studies/"><b>02</b><span>Case studies</span><small>The receipts</small></a>
          <a class="hp-map-stop hp-stop-strategy" href="/strategy.html"><b>03</b><span>Strategy</span><small>The map room</small></a>
          <a class="hp-map-stop hp-stop-work" href="/work.html"><b>04</b><span>Work library</span><small>Restricted-ish section</small></a>
          <a class="hp-map-stop hp-stop-about" href="/about.html"><b>05</b><span>About</span><small>The less professional bit</small></a>
          <a class="hp-map-stop hp-stop-contact" href="/about.html#contact"><b>06</b><span>Contact</span><small>Owl unavailable</small></a>
          <div class="hp-map-footprints" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </section>`;
    body.appendChild(overlay);

    const closeButtons = [...overlay.querySelectorAll('[data-map-close]')];
    const firstLink = overlay.querySelector('.hp-map-stop');
    let restoreFocus = null;

    const openMap = () => {
      restoreFocus = document.activeElement;
      overlay.hidden = false;
      requestAnimationFrame(() => {
        body.classList.add('hp-map-open');
        toggle.setAttribute('aria-expanded', 'true');
        firstLink?.focus({ preventScroll: true });
      });
    };

    const closeMap = () => {
      body.classList.remove('hp-map-open');
      toggle.setAttribute('aria-expanded', 'false');
      const finish = () => {
        overlay.hidden = true;
        overlay.removeEventListener('transitionend', finish);
      };
      if (reduceMotion.matches) finish();
      else {
        overlay.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, 500);
      }
      restoreFocus?.focus?.({ preventScroll: true });
    };

    toggle.addEventListener('click', openMap);
    closeButtons.forEach(button => button.addEventListener('click', closeMap));
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && body.classList.contains('hp-map-open')) closeMap();
    });
  }
})();
