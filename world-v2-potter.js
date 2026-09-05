(() => {
  const body = document.body;
  const html = document.documentElement;
  if (!body?.classList.contains('world-v2')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer:fine)');

  const addNote = (container, text) => {
    if (!container || container.querySelector('.world-hp-note')) return;
    const note = document.createElement('p');
    note.className = 'world-hp-note';
    note.textContent = text;
    container.appendChild(note);
  };

  const hero = document.querySelector('.page-hero .container, .case-page-hero .container');

  if (body.classList.contains('page-home')) {
    const heroCopy = document.querySelector('.hero-copy');
    const title = heroCopy?.querySelector('h1');
    const text = heroCopy?.querySelector('.hero-text');
    if (title) title.textContent = 'I write the stuff people need before they trust a complicated product.';
    if (text) text.textContent = 'Most of my recent work has been B2B SaaS, APIs, logistics, cybersecurity, and enterprise software. I start with what the product does and what the buyer needs to understand, then work out what should be written, refreshed, connected, or built from scratch.';
    addNote(heroCopy, '50+ Harry Potter rewatches. I blame the decor.');
  } else if (body.classList.contains('page-strategy')) {
    addNote(hero, 'No Time-Turner. The calendar still comes after the thinking.');
  } else if (body.classList.contains('page-work')) {
    addNote(hero, 'Restricted Section, minus the permission slip. Open whatever you want.');
  } else if (body.classList.contains('page-cases')) {
    addNote(hero, 'The moving pictures are showing off. The numbers are real.');
  } else if (body.classList.contains('page-about')) {
    addNote(hero, 'This is where the biotechnology degree enters the plot.');
  } else if (body.classList.contains('page-case')) {
    addNote(hero, 'Proof first. Wand later.');
  }

  /* Lightweight custom wand cursor. */
  if (finePointer.matches && !reduceMotion.matches) {
    const style = document.createElement('style');
    style.textContent = '.wizard-cursor-live,.wizard-cursor-live *{cursor:none!important}.wizard-cursor-live iframe{cursor:auto!important}';
    document.head.appendChild(style);
    html.classList.add('wizard-cursor-live');

    const wand = document.createElement('div');
    wand.className = 'wizard-wand';
    wand.setAttribute('aria-hidden', 'true');
    body.appendChild(wand);

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;
    let lastSpark = 0;

    const tick = () => {
      x += (targetX - x) * .42;
      y += (targetY - y) * .42;
      wand.style.transform = `translate3d(${x - 4}px,${y - 2}px,0) rotate(-32deg)`;
      if (Math.abs(targetX - x) > .25 || Math.abs(targetY - y) > .25) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    const makeSpark = (sx, sy, burst = false) => {
      const count = burst ? 4 : 1;
      for (let i = 0; i < count; i += 1) {
        const spark = document.createElement('i');
        spark.className = 'wizard-spark';
        spark.style.left = `${sx}px`;
        spark.style.top = `${sy}px`;
        const angle = burst ? (Math.PI * 2 * i / count) + Math.random() * .35 : Math.random() * Math.PI * 2;
        const distance = burst ? 16 + Math.random() * 14 : 7 + Math.random() * 6;
        spark.style.setProperty('--sx', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--sy', `${Math.sin(angle) * distance}px`);
        body.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove(), { once: true });
      }
    };

    window.addEventListener('pointermove', event => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      wand.classList.add('is-visible');
      wand.classList.toggle('is-link', !!event.target.closest('a,button,[role="button"]'));
      if (!raf) raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (now - lastSpark > 58) {
        lastSpark = now;
        makeSpark(event.clientX + 18, event.clientY - 12);
      }
    }, { passive: true });

    window.addEventListener('mouseout', event => {
      if (!event.relatedTarget) wand.classList.remove('is-visible');
    });

    window.addEventListener('pointerdown', event => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      makeSpark(event.clientX + 18, event.clientY - 12, true);
    }, { passive: true });
  }

  /* Broom scroll progress + back to top. */
  const rail = document.createElement('div');
  rail.className = 'wizard-scroll-rail';
  rail.setAttribute('aria-hidden', 'false');
  const broom = document.createElement('button');
  broom.className = 'wizard-broom';
  broom.type = 'button';
  broom.setAttribute('aria-label', 'Back to top');
  broom.innerHTML = '<svg viewBox="0 0 28 56" aria-hidden="true"><path d="M17 3 10 38" stroke="#5a3d27" stroke-width="2.2" stroke-linecap="round"/><path d="M8 34c5 0 9 2 12 7-4 8-10 11-17 12 4-6 5-12 5-19Z" fill="#b28b49" stroke="#6d4c2c" stroke-width="1"/><path d="m6 40 12 3M5 44l12 2M4 48l10 1" stroke="#71502f" stroke-width=".8"/></svg>';
  rail.appendChild(broom);
  body.appendChild(rail);

  let scrollRaf = 0;
  const updateBroom = () => {
    scrollRaf = 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
    const travel = Math.max(0, rail.clientHeight - broom.offsetHeight);
    broom.style.transform = `translate(-50%,${Math.round(travel * progress)}px) rotate(${(-6 + progress * 12).toFixed(1)}deg)`;
    rail.style.display = maxScroll < 240 ? 'none' : '';
  };
  const scheduleBroom = () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(updateBroom); };
  window.addEventListener('scroll', scheduleBroom, { passive: true });
  window.addEventListener('resize', scheduleBroom, { passive: true });
  broom.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }));
  requestAnimationFrame(updateBroom);

  /* Homepage-only Snitch easter egg. */
  if (body.classList.contains('page-home')) {
    const homeHero = document.querySelector('.story-hero');
    if (homeHero) {
      const snitch = document.createElement('button');
      snitch.className = 'wizard-snitch';
      snitch.type = 'button';
      snitch.setAttribute('aria-label', 'Catch the Golden Snitch');
      snitch.innerHTML = '<span class="wing left"></span><span class="orb"></span><span class="wing right"></span>';
      homeHero.appendChild(snitch);

      const toast = document.createElement('div');
      toast.className = 'wizard-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      body.appendChild(toast);
      let toastTimer;
      snitch.addEventListener('click', () => {
        snitch.style.animationPlayState = 'paused';
        toast.textContent = 'Caught it. That was the whole side quest.';
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('show');
          snitch.style.animationPlayState = '';
        }, 2200);
      });
    }
  }

  /* Strategy cluster gets real connector lines. */
  if (body.classList.contains('page-strategy')) {
    const cluster = document.querySelector('.cluster');
    const hub = cluster?.querySelector('.hub');
    const nodes = cluster ? [...cluster.querySelectorAll('.node')] : [];
    if (cluster && hub && nodes.length && !cluster.querySelector('.wizard-cluster-lines')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('wizard-cluster-lines');
      svg.setAttribute('aria-hidden', 'true');
      const paths = nodes.map(() => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('pathLength', '1');
        svg.appendChild(path);
        return path;
      });
      cluster.prepend(svg);

      let lineRaf = 0;
      const drawLines = () => {
        lineRaf = 0;
        if (innerWidth <= 760) return;
        const box = cluster.getBoundingClientRect();
        const hr = hub.getBoundingClientRect();
        const hx = hr.left - box.left + hr.width / 2;
        const hy = hr.top - box.top + hr.height / 2;
        svg.setAttribute('viewBox', `0 0 ${Math.max(1, cluster.clientWidth)} ${Math.max(1, cluster.clientHeight)}`);
        nodes.forEach((node, index) => {
          const nr = node.getBoundingClientRect();
          const nx = nr.left - box.left + nr.width / 2;
          const ny = nr.top - box.top + nr.height / 2;
          const bx = (hx + nx) / 2;
          const by = (hy + ny) / 2 + (index % 2 ? 12 : -12);
          paths[index].setAttribute('d', `M ${hx} ${hy} Q ${bx} ${by} ${nx} ${ny}`);
        });
      };
      const scheduleLines = () => { if (!lineRaf) lineRaf = requestAnimationFrame(drawLines); };
      window.addEventListener('resize', scheduleLines, { passive: true });
      window.addEventListener('load', scheduleLines, { once: true });
      document.fonts?.ready.then(drawLines).catch(() => {});
      requestAnimationFrame(drawLines);
    }
  }

  /* Owl Post cue without delaying mailto. */
  if (body.classList.contains('page-about')) {
    const contact = document.querySelector('#contact');
    const mail = contact?.querySelector('a[href^="mailto:"]');
    if (contact && mail && !contact.querySelector('.wizard-owl-note')) {
      const note = document.createElement('span');
      note.className = 'wizard-owl-note';
      note.textContent = '✉ Owl unavailable. Email works.';
      note.style.cssText = 'display:inline-block;margin-top:12px;color:#76583b;font:600 .62rem/1.4 "Libre Franklin",sans-serif;letter-spacing:.02em';
      mail.insertAdjacentElement('afterend', note);
      mail.addEventListener('pointerdown', () => {
        note.textContent = '✉ Sending it the Muggle way.';
        setTimeout(() => { note.textContent = '✉ Owl unavailable. Email works.'; }, 1500);
      }, { passive: true });
    }
  }

  /* Marauder's Map inspired navigation opened from the footer. */
  const footer = document.querySelector('.site-footer .footer-wrap');
  if (footer && !footer.querySelector('.mischief-toggle')) {
    footer.querySelector('.world-footer-note')?.remove();
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mischief-toggle';
    toggle.textContent = 'Mischief managed';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'wizard-map');

    const lastLink = footer.querySelector('a');
    if (lastLink) footer.insertBefore(toggle, lastLink);
    else footer.appendChild(toggle);

    const map = document.createElement('div');
    map.className = 'wizard-map';
    map.id = 'wizard-map';
    map.hidden = true;
    map.innerHTML = `
      <div class="wizard-map-backdrop" data-map-close></div>
      <section class="wizard-map-sheet" role="dialog" aria-modal="true" aria-labelledby="wizard-map-title">
        <button class="wizard-map-close" type="button" data-map-close>Fold the map</button>
        <div class="wizard-map-head">
          <span class="wizard-map-kicker">Kunal Vardhan · Portfolio map</span>
          <h2 class="wizard-map-title" id="wizard-map-title">I probably shouldn't show you this.</h2>
          <p>Too late. Pick a room.</p>
        </div>
        <div class="wizard-map-field">
          <svg class="wizard-map-path" viewBox="0 0 1000 560" aria-hidden="true" preserveAspectRatio="none">
            <path class="base" d="M118 300 C205 160 300 165 388 270 S535 420 615 270 S785 132 890 260"/>
            <path class="draw" d="M118 300 C205 160 300 165 388 270 S535 420 615 270 S785 132 890 260"/>
          </svg>
          <a class="wizard-map-stop home" href="/"><b>01</b><strong>Home</strong><small>The front door</small></a>
          <a class="wizard-map-stop cases" href="/case-studies/"><b>02</b><strong>Case studies</strong><small>The receipts</small></a>
          <a class="wizard-map-stop strategy" href="/strategy.html"><b>03</b><strong>Strategy</strong><small>The map room</small></a>
          <a class="wizard-map-stop work" href="/work.html"><b>04</b><strong>Work library</strong><small>Restricted-ish section</small></a>
          <a class="wizard-map-stop about" href="/about.html"><b>05</b><strong>About</strong><small>The plot twist</small></a>
          <a class="wizard-map-stop contact" href="/about.html#contact"><b>06</b><strong>Contact</strong><small>Owl unavailable</small></a>
          <div class="wizard-map-footprints" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </section>`;
    body.appendChild(map);

    const closeTargets = [...map.querySelectorAll('[data-map-close]')];
    const firstStop = map.querySelector('.wizard-map-stop');
    let restoreFocus = null;
    let closeTimer;

    const openMap = () => {
      clearTimeout(closeTimer);
      restoreFocus = document.activeElement;
      map.hidden = false;
      body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        map.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        firstStop?.focus({ preventScroll: true });
      });
    };

    const closeMap = () => {
      map.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      const finish = () => {
        map.hidden = true;
        restoreFocus?.focus?.({ preventScroll: true });
      };
      if (reduceMotion.matches) finish();
      else closeTimer = setTimeout(finish, 360);
    };

    toggle.addEventListener('click', openMap);
    closeTargets.forEach(target => target.addEventListener('click', closeMap));
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !map.hidden) closeMap();
    });
  }
})();
