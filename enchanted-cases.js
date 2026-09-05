(() => {
  const section = document.querySelector('.enchanted-cases');
  if (!section) return;

  const cards = [...section.querySelectorAll('.feature-card')];
  const footsteps = section.querySelector('.enchanted-footsteps');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const isBoring = () => document.documentElement.classList.contains('boring-mode');

  let activeCard = null;
  let frame = 0;
  let lastEvent = null;
  let walked = false;

  const resetCardTransform = card => {
    card?.style.setProperty('--rx', '0deg');
    card?.style.setProperty('--ry', '0deg');
    card?.style.setProperty('--lift', '0px');
  };

  const wake = card => {
    if (!card || reduceMotion.matches || isBoring()) return;
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove('is-awake');
      resetCardTransform(activeCard);
    }
    activeCard = card;
    card.classList.add('is-awake');
  };

  const sleep = card => {
    if (!card) return;
    card.classList.remove('is-awake');
    resetCardTransform(card);
    if (activeCard === card) activeCard = null;
  };

  const applyPointerResponse = () => {
    frame = 0;
    if (!lastEvent || !finePointer.matches || reduceMotion.matches || isBoring()) return;

    let nearest = null;
    let nearestDistance = Infinity;

    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = lastEvent.clientX - cx;
      const dy = lastEvent.clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = { card, rect, dx, dy };
      }
    }

    if (!nearest || nearestDistance > 330) {
      if (activeCard && !activeCard.matches(':hover,:focus-visible')) sleep(activeCard);
      return;
    }

    const { card, rect, dx, dy } = nearest;
    wake(card);

    const nx = Math.max(-1, Math.min(1, dx / Math.max(1, rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, dy / Math.max(1, rect.height / 2)));
    card.style.setProperty('--ry', `${(nx * 1.55).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(-ny * 1.15).toFixed(2)}deg`);
    card.style.setProperty('--lift', '-5px');
  };

  const schedulePointer = event => {
    lastEvent = event;
    if (!frame) frame = requestAnimationFrame(applyPointerResponse);
  };

  if (finePointer.matches && !reduceMotion.matches) {
    section.addEventListener('pointermove', schedulePointer, { passive: true });
    section.addEventListener('pointerleave', () => {
      lastEvent = null;
      if (activeCard && !activeCard.matches(':focus-visible')) sleep(activeCard);
    }, { passive: true });
  }

  cards.forEach(card => {
    card.addEventListener('pointerenter', () => wake(card), { passive: true });
    card.addEventListener('pointerleave', () => {
      if (!finePointer.matches && !card.matches(':focus-visible')) sleep(card);
    }, { passive: true });
    card.addEventListener('focus', () => wake(card));
    card.addEventListener('blur', () => sleep(card));
  });

  const startFootsteps = () => {
    if (!footsteps || walked || reduceMotion.matches || isBoring()) return;
    walked = true;
    footsteps.classList.add('is-walking');
    window.setTimeout(() => footsteps.classList.remove('is-walking'), 4200);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry?.isIntersecting && entry.intersectionRatio >= .28) {
        startFootsteps();
      }
    }, { threshold: [0, .28, .55] });
    observer.observe(section);
  } else {
    startFootsteps();
  }

  window.addEventListener('portfolio:boringchange', event => {
    if (event.detail?.boring) {
      cards.forEach(sleep);
      footsteps?.classList.remove('is-walking');
    }
  });

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) {
      cards.forEach(sleep);
      footsteps?.classList.remove('is-walking');
    }
  });
})();
