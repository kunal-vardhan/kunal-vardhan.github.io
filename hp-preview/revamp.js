(() => {
  const body = document.body;
  if (!body?.classList.contains('hp-site')) return;

  const fixes = document.createElement('link');
  fixes.rel = 'stylesheet';
  fixes.href = '/hp-preview/revamp-fixes.css?v=1';
  document.head.appendChild(fixes);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer:fine)');

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.spellbook-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => {
      if (!event.target.closest('a')) return;
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  }

  const revealTargets = [...document.querySelectorAll('.section-head,.prophet-story,.process-step,.visual-card,.letter,.about-room,.strategy-intake-card,.infographic-card,.roadmap-stop,.visual-work-card,.case-frontpage-card,.case-article-revamp>section,.off-duty-card,.brand-wall-revamp>div,.contact-letter')];
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('reveal','visible'));
  } else {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }

  if (finePointer.matches && !reduceMotion.matches) {
    document.documentElement.classList.add('wand-live');
    const style = document.createElement('style');
    style.textContent = '.wand-live,.wand-live *{cursor:none!important}.wand-live iframe{cursor:auto!important}';
    document.head.appendChild(style);

    const wand = document.createElement('div');
    wand.className = 'wand-cursor';
    wand.setAttribute('aria-hidden','true');
    body.appendChild(wand);

    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0, lastSpark = 0;
    const tick = () => {
      x += (tx - x) * .42;
      y += (ty - y) * .42;
      wand.style.transform = `translate3d(${x - 4}px,${y - 2}px,0) rotate(-31deg)`;
      if (Math.abs(tx - x) > .3 || Math.abs(ty - y) > .3) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const spark = (sx, sy, burst = false) => {
      const count = burst ? 4 : 1;
      for (let i = 0; i < count; i += 1) {
        const dot = document.createElement('i');
        dot.className = 'wand-spark';
        dot.style.left = `${sx}px`;
        dot.style.top = `${sy}px`;
        const angle = burst ? (Math.PI * 2 * i / count) + Math.random() * .3 : Math.random() * Math.PI * 2;
        const distance = burst ? 15 + Math.random() * 13 : 6 + Math.random() * 7;
        dot.style.setProperty('--sx', `${Math.cos(angle) * distance}px`);
        dot.style.setProperty('--sy', `${Math.sin(angle) * distance}px`);
        body.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove(), { once: true });
      }
    };
    window.addEventListener('pointermove', event => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      tx = event.clientX; ty = event.clientY;
      wand.classList.add('visible');
      wand.classList.toggle('link', !!event.target.closest('a,button,[role="button"]'));
      if (!raf) raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (now - lastSpark > 72) { lastSpark = now; spark(event.clientX + 17, event.clientY - 11); }
    }, { passive:true });
    window.addEventListener('mouseout', event => { if (!event.relatedTarget) wand.classList.remove('visible'); });
    window.addEventListener('pointerdown', event => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      spark(event.clientX + 17, event.clientY - 11, true);
    }, { passive:true });
  }

  const rail = document.createElement('div');
  rail.className = 'broom-rail';
  const broom = document.createElement('button');
  broom.type = 'button';
  broom.className = 'broom-button';
  broom.setAttribute('aria-label','Back to top');
  broom.innerHTML = '<svg viewBox="0 0 30 54" aria-hidden="true"><path d="M19 3 11 37" stroke="#5a3c27" stroke-width="2.2" stroke-linecap="round"/><path d="M9 34c5 0 9 2 12 7-4 8-10 10-17 11 4-6 5-11 5-18Z" fill="#b28a49" stroke="#6c4b2e"/><path d="m7 40 12 3M6 44l11 2M5 48l9 1" stroke="#725031" stroke-width=".8"/></svg>';
  rail.appendChild(broom);
  body.appendChild(rail);
  let scrollRaf = 0;
  const updateBroom = () => {
    scrollRaf = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / max));
    const travel = Math.max(0, rail.clientHeight - broom.offsetHeight);
    broom.style.transform = `translate(-50%,${Math.round(travel * progress)}px) rotate(${(-6 + progress * 12).toFixed(1)}deg)`;
    rail.style.display = max < 240 ? 'none' : '';
  };
  const scheduleBroom = () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(updateBroom); };
  window.addEventListener('scroll', scheduleBroom, { passive:true });
  window.addEventListener('resize', scheduleBroom, { passive:true });
  broom.addEventListener('click', () => window.scrollTo({ top:0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }));
  requestAnimationFrame(updateBroom);

  const snitch = document.querySelector('.snitch-button');
  if (snitch) {
    const toast = document.createElement('div');
    toast.className = 'snitch-toast';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','polite');
    body.appendChild(toast);
    let toastTimer;
    snitch.addEventListener('click', () => {
      toast.textContent = 'Caught it. That was the whole side quest.';
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    });
  }

  const marker = document.querySelector('.train-marker');
  const stops = [...document.querySelectorAll('.roadmap-stop')];
  if (marker && stops.length && !reduceMotion.matches && 'IntersectionObserver' in window) {
    const roadObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = stops.indexOf(entry.target);
        if (index >= 0) marker.style.left = `${7 + index * (86 / Math.max(1, stops.length - 1))}%`;
      });
    }, { threshold:.55 });
    stops.forEach(stop => roadObserver.observe(stop));
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('pointerdown', () => {
      const note = link.closest('.contact-letter')?.querySelector('.owl-note');
      if (!note) return;
      const original = note.textContent;
      note.textContent = 'Sending it the Muggle way.';
      setTimeout(() => { note.textContent = original; }, 1500);
    }, { passive:true });
  });

  const trigger = document.querySelector('.mischief-button');
  if (trigger) {
    const map = document.createElement('div');
    map.className = 'hp-map';
    map.id = 'hp-map';
    map.hidden = true;
    map.innerHTML = `
      <div class="hp-map-backdrop" data-map-close></div>
      <section class="hp-map-sheet" role="dialog" aria-modal="true" aria-labelledby="hp-map-title">
        <button class="hp-map-close" type="button" data-map-close>Fold the map</button>
        <div class="hp-map-head"><span>Kunal Vardhan · Portfolio map</span><h2 id="hp-map-title">I probably shouldn't show you this.</h2><p>Too late. Pick a room.</p></div>
        <div class="hp-map-field">
          <svg class="hp-map-path" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true"><path class="base" d="M118 300 C205 160 300 165 388 270 S535 420 615 270 S785 132 890 260"/><path class="draw" d="M118 300 C205 160 300 165 388 270 S535 420 615 270 S785 132 890 260"/></svg>
          <a class="hp-map-stop home" href="/hp-preview/"><b>01</b><strong>Home</strong><small>The front door</small></a>
          <a class="hp-map-stop cases" href="/hp-preview/case-studies/"><b>02</b><strong>Case studies</strong><small>The receipts</small></a>
          <a class="hp-map-stop strategy" href="/hp-preview/strategy.html"><b>03</b><strong>Strategy</strong><small>The map room</small></a>
          <a class="hp-map-stop work" href="/hp-preview/work.html"><b>04</b><strong>Work library</strong><small>Restricted-ish section</small></a>
          <a class="hp-map-stop about" href="/hp-preview/about.html"><b>05</b><strong>About</strong><small>The plot twist</small></a>
          <a class="hp-map-stop contact" href="/hp-preview/about.html#contact"><b>06</b><strong>Contact</strong><small>Owl unavailable</small></a>
          <div class="map-footprints" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </section>`;
    body.appendChild(map);
    const firstStop = map.querySelector('.hp-map-stop');
    let restoreFocus = null, closeTimer;
    const openMap = () => {
      clearTimeout(closeTimer);
      restoreFocus = document.activeElement;
      map.hidden = false;
      body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        map.classList.add('open');
        trigger.setAttribute('aria-expanded','true');
        firstStop?.focus({ preventScroll:true });
      });
    };
    const closeMap = () => {
      map.classList.remove('open');
      trigger.setAttribute('aria-expanded','false');
      body.style.overflow = '';
      const finish = () => { map.hidden = true; restoreFocus?.focus?.({ preventScroll:true }); };
      if (reduceMotion.matches) finish(); else closeTimer = setTimeout(finish,330);
    };
    trigger.addEventListener('click', openMap);
    map.querySelectorAll('[data-map-close]').forEach(el => el.addEventListener('click', closeMap));
    window.addEventListener('keydown', event => { if (event.key === 'Escape' && !map.hidden) closeMap(); });
  }
})();
