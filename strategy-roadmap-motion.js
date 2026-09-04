(() => {
  const roadmap = document.querySelector('.roadmap');
  const phases = roadmap ? [...roadmap.querySelectorAll(':scope > article')] : [];
  if (!roadmap || phases.length !== 4) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenarios = [
    {
      phase: 'Foundation',
      title: 'Turn the priority into evidence.',
      detail: 'Map the audience, audit what already exists, choose priority topics, and set a baseline before adding more content.',
      outputs: ['Audience map', 'Content audit', 'Baseline']
    },
    {
      phase: 'Build depth',
      title: 'Turn the evidence into connected coverage.',
      detail: 'Build the supporting cluster, repair internal links, refresh useful pages, and close the gaps around the priority.',
      outputs: ['Topic cluster', 'Internal links', 'Refresh list']
    },
    {
      phase: 'Capture demand',
      title: 'Turn coverage into buyer-facing decisions.',
      detail: 'Add the comparison, cost, implementation, case-study, and sales-use assets that help evaluation happen.',
      outputs: ['Comparison', 'Cost / implementation', 'Case study']
    },
    {
      phase: 'Review',
      title: 'Turn performance into the next decision.',
      detail: 'Use the results to decide what stays, what improves, what gets consolidated, and what belongs in the next roadmap.',
      outputs: ['Keep', 'Improve', 'Consolidate']
    }
  ];

  let demoPlayed = false;
  let demoTimers = [];
  let activeIndex = 0;
  let resizeTimer;

  roadmap.classList.add('strategy-roadmap-live');

  const chip = document.createElement('div');
  chip.className = 'strategy-priority-chip';
  chip.innerHTML = '<span>Illustrative priority</span><strong>Reduce buyer uncertainty</strong>';
  roadmap.appendChild(chip);

  const output = document.createElement('aside');
  output.className = 'strategy-quarter-output';
  output.id = 'strategy-quarter-output';
  output.innerHTML = '<div class="strategy-quarter-copy"><span class="strategy-quarter-kicker"></span><strong class="strategy-quarter-title"></strong><p class="strategy-quarter-detail"></p></div><div class="strategy-quarter-artifacts" aria-label="Outputs at this phase"></div><span class="strategy-quarter-hint">Hover, focus, or tap a phase to move the priority through the quarter.</span>';
  roadmap.insertAdjacentElement('afterend', output);

  phases.forEach((phase, index) => {
    phase.tabIndex = 0;
    phase.dataset.roadmapIndex = String(index);
    phase.setAttribute('aria-controls', output.id);
  });

  const cancelDemo = () => {
    demoTimers.forEach(clearTimeout);
    demoTimers = [];
    demoPlayed = true;
  };

  const moveChip = index => {
    const phaseRect = phases[index].getBoundingClientRect();
    const roadmapRect = roadmap.getBoundingClientRect();
    const center = phaseRect.left - roadmapRect.left + phaseRect.width / 2;
    chip.style.left = `${center}px`;
  };

  const render = (index, fromUser = false) => {
    if (fromUser) cancelDemo();
    activeIndex = index;
    const scenario = scenarios[index];

    phases.forEach((phase, i) => {
      phase.classList.toggle('is-active', i === index);
      phase.classList.toggle('is-past', i < index);
    });

    output.querySelector('.strategy-quarter-kicker').textContent = `Phase ${index + 1} · ${scenario.phase}`;
    output.querySelector('.strategy-quarter-title').textContent = scenario.title;
    output.querySelector('.strategy-quarter-detail').textContent = scenario.detail;
    output.querySelector('.strategy-quarter-artifacts').innerHTML = scenario.outputs.map(item => `<span>${item}</span>`).join('');

    moveChip(index);

    if (!reduceMotion.matches && !document.documentElement.classList.contains('boring-mode')) {
      output.animate(
        [
          { opacity: .55, transform: 'translateY(5px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 230, easing: 'ease-out' }
      );
    }
  };

  const runDemo = () => {
    if (demoPlayed) return;
    demoPlayed = true;

    if (reduceMotion.matches || document.documentElement.classList.contains('boring-mode')) {
      render(0);
      return;
    }

    scenarios.forEach((_, index) => {
      demoTimers.push(setTimeout(() => render(index), index * 880));
    });
  };

  phases.forEach((phase, index) => {
    phase.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') render(index, true);
    });
    phase.addEventListener('focus', () => render(index, true));
    phase.addEventListener('click', () => render(index, true));
  });

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      runDemo();
      observer.disconnect();
    }
  }, { threshold: .34 });
  observer.observe(roadmap);

  const scheduleMove = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => moveChip(activeIndex), 90);
  };

  window.addEventListener('resize', scheduleMove, { passive: true });
  window.addEventListener('load', () => moveChip(activeIndex), { once: true });
  document.fonts?.ready.then(() => moveChip(activeIndex)).catch(() => {});
  requestAnimationFrame(() => {
    render(0);
    moveChip(0);
  });

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) {
      cancelDemo();
      render(activeIndex);
    }
  });

  window.addEventListener('portfolio:boringchange', () => {
    if (document.documentElement.classList.contains('boring-mode')) {
      cancelDemo();
      render(activeIndex);
    }
  });
})();
