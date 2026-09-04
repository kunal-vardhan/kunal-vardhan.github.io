(() => {
  const cards = [...document.querySelectorAll('.case-hub-card')];
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const liveTimers = new WeakMap();
  const played = new WeakSet();

  const clearTimers = card => {
    (liveTimers.get(card) || []).forEach(clearTimeout);
    liveTimers.set(card, []);
  };

  const clearStep = card => {
    card.classList.remove('is-step-role', 'is-step-proof', 'is-step-result', 'has-focused-step');
  };

  const setStep = (card, step, focused = false) => {
    clearStep(card);
    if (step) card.classList.add(`is-step-${step}`);
    if (focused) card.classList.add('has-focused-step');
  };

  const finish = card => {
    clearTimers(card);
    clearStep(card);
    card.classList.add('is-scan-complete');
    played.add(card);
  };

  const runScan = card => {
    if (played.has(card)) return;
    played.add(card);

    if (reduceMotion.matches || document.documentElement.classList.contains('boring-mode')) {
      finish(card);
      return;
    }

    const timers = [
      setTimeout(() => setStep(card, 'role'), 80),
      setTimeout(() => setStep(card, 'proof'), 430),
      setTimeout(() => setStep(card, 'result'), 780),
      setTimeout(() => finish(card), 1180)
    ];
    liveTimers.set(card, timers);
  };

  cards.forEach(card => {
    card.classList.add('case-scan-motion');
    const role = card.querySelector('.case-scan p:first-child');
    const proof = card.querySelector('.case-scan p:nth-child(2)');
    const result = card.querySelector('.case-outcome');

    const focusArea = (el, step) => {
      if (!el) return;
      el.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'mouse') return;
        clearTimers(card);
        setStep(card, step, true);
      });
      el.addEventListener('pointerleave', event => {
        if (event.pointerType === 'mouse') clearStep(card);
      });
    };

    focusArea(role, 'role');
    focusArea(proof, 'proof');
    focusArea(result, 'result');

    card.addEventListener('focus', () => {
      clearTimers(card);
      setStep(card, 'result', true);
    });
    card.addEventListener('blur', () => clearStep(card));
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      runScan(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .52 });

  cards.forEach(card => observer.observe(card));

  reduceMotion.addEventListener?.('change', event => {
    if (!event.matches) return;
    cards.forEach(finish);
  });

  window.addEventListener('portfolio:boringchange', () => {
    if (!document.documentElement.classList.contains('boring-mode')) return;
    cards.forEach(finish);
  });
})();
