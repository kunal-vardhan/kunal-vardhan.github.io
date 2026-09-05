(() => {
  const shell = document.querySelector('[data-threshold]');
  if (!shell) return;

  const hero = shell.querySelector('.story-hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const boring = () => document.documentElement.classList.contains('boring-mode');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoother = (from, to, value) => {
    const t = clamp((value - from) / Math.max(.0001, to - from));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  let raf = 0;
  let proofReady = false;
  let lastWidth = window.innerWidth;
  let targetProgress = 0;
  let renderedProgress = 0;
  let lastFrameTime = 0;

  const getProgress = () => {
    const rect = shell.getBoundingClientRect();
    const range = Math.max(1, shell.offsetHeight - window.innerHeight);
    return clamp(-rect.top / range);
  };

  const setHeroAccessible = open => {
    if (!hero) return;
    if (open) {
      hero.removeAttribute('aria-hidden');
      hero.inert = false;
    } else {
      hero.setAttribute('aria-hidden', 'true');
      hero.inert = true;
    }
  };

  const markProofReady = () => {
    if (proofReady) return;
    proofReady = true;
    shell.classList.add('is-proof-ready');
    window.dispatchEvent(new CustomEvent('portfolio:threshold-open'));
  };

  const render = progress => {
    const open = smoother(.08, .78, progress);
    const arrival = 1 - smoother(.04, .32, progress);
    const arch = 1 - smoother(.22, .80, progress);
    const heroReveal = smoother(.23, .73, progress);
    const spellIn = smoother(.19, .40, progress);
    const spellOut = 1 - smoother(.55, .76, progress);
    const spell = spellIn * spellOut;
    const lightIn = smoother(.15, .49, progress);
    const lightOut = 1 - .38 * smoother(.82, 1, progress);
    const light = lightIn * lightOut;

    const half = Math.max(360, lastWidth * .56 + 44);
    const shift = open * half;
    const scale = .978 + heroReveal * .022;

    shell.style.setProperty('--gate-left', `${(-shift).toFixed(2)}px`);
    shell.style.setProperty('--gate-right', `${shift.toFixed(2)}px`);
    shell.style.setProperty('--arrival-opacity', arrival.toFixed(4));
    shell.style.setProperty('--arch-opacity', arch.toFixed(4));
    shell.style.setProperty('--hero-opacity', heroReveal.toFixed(4));
    shell.style.setProperty('--hero-scale', scale.toFixed(5));
    shell.style.setProperty('--spell-opacity', spell.toFixed(4));
    shell.style.setProperty('--light-opacity', light.toFixed(4));

    const entered = progress >= .58;
    shell.classList.toggle('is-open', entered);
    document.body.classList.toggle('threshold-entered', entered);
    setHeroAccessible(progress >= .45);

    if (progress >= .70) markProofReady();
  };

  const finish = () => {
    targetProgress = 1;
    renderedProgress = 1;
    lastFrameTime = 0;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    render(1);
    shell.style.setProperty('--light-opacity', '.42');
    shell.classList.add('is-open');
    document.body.classList.add('threshold-entered');
    setHeroAccessible(true);
    markProofReady();
  };

  const tick = time => {
    if (reduceMotion.matches || boring()) {
      finish();
      return;
    }

    const dt = Math.min(50, Math.max(8, lastFrameTime ? time - lastFrameTime : 16.67));
    lastFrameTime = time;

    const distance = targetProgress - renderedProgress;
    const follow = 1 - Math.exp(-dt / 105);
    renderedProgress += distance * follow;

    if (Math.abs(distance) < .00035) renderedProgress = targetProgress;
    render(renderedProgress);

    if (renderedProgress !== targetProgress) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      lastFrameTime = 0;
    }
  };

  const schedule = () => {
    if (reduceMotion.matches || boring()) {
      finish();
      return;
    }
    targetProgress = getProgress();
    if (!raf) raf = requestAnimationFrame(tick);
  };

  if (reduceMotion.matches || boring()) {
    finish();
  } else {
    setHeroAccessible(false);
    targetProgress = getProgress();
    renderedProgress = targetProgress;
    render(renderedProgress);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      lastWidth = window.innerWidth;
      schedule();
    }, { passive: true });
    window.addEventListener('pageshow', () => {
      targetProgress = getProgress();
      renderedProgress = targetProgress;
      render(renderedProgress);
    });
  }

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) finish();
    else {
      proofReady = shell.classList.contains('is-proof-ready');
      targetProgress = getProgress();
      renderedProgress = targetProgress;
      render(renderedProgress);
    }
  });

  window.addEventListener('portfolio:boringchange', event => {
    if (event.detail?.boring || boring()) finish();
    else {
      targetProgress = getProgress();
      renderedProgress = targetProgress;
      render(renderedProgress);
    }
  });
})();
