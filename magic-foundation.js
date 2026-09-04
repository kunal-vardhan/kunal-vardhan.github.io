(() => {
  const body = document.body;
  if (!body?.classList.contains('magic-home')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const hero = document.querySelector('.story-hero');
  const storageKey = 'kv-magic-lumos';

  const status = document.createElement('span');
  status.className = 'magic-sr-status';
  status.setAttribute('aria-live', 'polite');
  document.body.appendChild(status);

  const setLumos = (state, announce = true) => {
    document.documentElement.classList.toggle('magic-lumos', state);
    try { sessionStorage.setItem(storageKey, state ? '1' : '0'); } catch {}
    if (announce) status.textContent = state ? 'Lumos on.' : 'Nox. Lumos off.';
  };

  try {
    if (sessionStorage.getItem(storageKey) === '1') setLumos(true, false);
  } catch {}

  let typed = '';
  window.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target instanceof Element && event.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key.length !== 1 || !/[a-z]/i.test(event.key)) return;
    typed = (typed + event.key.toLowerCase()).slice(-7);
    if (typed.endsWith('lumos')) setLumos(true);
    if (typed.endsWith('nox')) setLumos(false);
  });

  if (hero && finePointer.matches && !reduceMotion.matches) {
    let frame = 0;
    let nextX = 78;
    let nextY = 34;

    const applyLight = () => {
      frame = 0;
      body.style.setProperty('--magic-x', `${nextX.toFixed(2)}%`);
      body.style.setProperty('--magic-y', `${nextY.toFixed(2)}%`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(applyLight);
    };

    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      nextX = Math.max(8, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100));
      nextY = Math.max(8, Math.min(92, ((event.clientY - rect.top) / rect.height) * 100));
      schedule();
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      nextX = 78;
      nextY = 34;
      schedule();
    }, { passive: true });
  }

  const curtain = document.createElement('div');
  curtain.className = 'magic-page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);

  const shouldTransition = link => {
    if (reduceMotion.matches || !link) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.protocol !== 'http:' && link.protocol !== 'https:') return false;
    if (link.origin !== location.origin) return false;
    if (link.pathname === location.pathname && link.search === location.search && link.hash) return false;
    return true;
  };

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!shouldTransition(link)) return;

    event.preventDefault();
    curtain.classList.add('is-active');
    window.setTimeout(() => { location.href = link.href; }, 190);
  });

  window.addEventListener('pageshow', () => {
    curtain.classList.remove('is-active');
  });

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) curtain.classList.remove('is-active');
  });
})();
