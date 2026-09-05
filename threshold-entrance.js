(() => {
  const shell = document.querySelector('[data-threshold]');
  if (!shell) return;

  const hero = shell.querySelector('.story-hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const boring = () => document.documentElement.classList.contains('boring-mode');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = (from, to, value) => {
    const t = clamp((value - from) / Math.max(.0001, to - from));
    return t * t * (3 - 2 * t);
  };

  let raf = 0;
  let proofReady = false;
  let lastWidth = window.innerWidth;

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

  const finish = () => {
    shell.style.setProperty('--gate-left', '-56vw');
    shell.style.setProperty('--gate-right', '56vw');
    shell.style.setProperty('--arrival-opacity', '0');
    shell.style.setProperty('--arch-opacity', '0');
    shell.style.setProperty('--hero-opacity', '1');
    shell.style.setProperty('--hero-scale', '1');
    shell.style.setProperty('--spell-opacity', '0');
    shell.style.setProperty('--light-opacity', '.42');
    shell.classList.add('is-open');
    document.body.classList.add('threshold-entered');
    setHeroAccessible(true);
    markProofReady();
  };

  const update = () => {
    raf = 0;

    if (reduceMotion.matches || boring()) {
      finish();
      return;
    }

    const rect = shell.getBoundingClientRect();
    const range = Math.max(1, shell.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / range);

    const open = smooth(.12, .66, progress);
    const arrival = 1 - smooth(.07, .27, progress);
    const arch = 1 - smooth(.30, .70, progress);
    const heroReveal = smooth(.31, .61, progress);
    const spellIn = smooth(.24, .36, progress);
    const spellOut = 1 - smooth(.53, .68, progress);
    const spell = spellIn * spellOut;
    const lightIn = smooth(.22, .45, progress);
    const lightOut = 1 - .46 * smooth(.76, 1, progress);
    const light = lightIn * lightOut;

    const half = Math.max(360, lastWidth * .53 + 44);
    const shift = open * half;
    const scale = .982 + heroReveal * .018;

    shell.style.setProperty('--gate-left', `${(-shift).toFixed(1)}px`);
    shell.style.setProperty('--gate-right', `${shift.toFixed(1)}px`);
    shell.style.setProperty('--arrival-opacity', arrival.toFixed(3));
    shell.style.setProperty('--arch-opacity', arch.toFixed(3));
    shell.style.setProperty('--hero-opacity', heroReveal.toFixed(3));
    shell.style.setProperty('--hero-scale', scale.toFixed(4));
    shell.style.setProperty('--spell-opacity', spell.toFixed(3));
    shell.style.setProperty('--light-opacity', light.toFixed(3));

    const entered = progress >= .56;
    shell.classList.toggle('is-open', entered);
    document.body.classList.toggle('threshold-entered', entered);
    setHeroAccessible(progress >= .48);

    if (progress >= .68) markProofReady();
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  if (reduceMotion.matches || boring()) {
    finish();
  } else {
    setHeroAccessible(false);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      lastWidth = window.innerWidth;
      schedule();
    }, { passive: true });
    window.addEventListener('pageshow', schedule);
  }

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) finish();
    else {
      proofReady = shell.classList.contains('is-proof-ready');
      schedule();
    }
  });

  window.addEventListener('portfolio:boringchange', event => {
    if (event.detail?.boring || boring()) finish();
    else schedule();
  });
})();
