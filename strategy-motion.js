(() => {
  const map = document.querySelector('.strategy-map');
  const flow = map?.querySelector('.strategy-flow');
  const nodes = flow ? [...flow.querySelectorAll('.strategy-node')] : [];
  if (!map || !flow || nodes.length !== 6) return;

  const focusDetails = [
    'Positioning · complexity · product fit',
    'Questions · objections · buying stage · language',
    'Intent · demand · gaps · existing traction',
    'Refresh · consolidate · overlap · internal links',
    'Accuracy · objections · product detail · sales questions',
    'What matters now · markets · use cases · timing'
  ];
  const defaultDetail = 'Priority topics · asset types · internal links · distribution · measurement';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let played = false;
  let timers = [];

  map.classList.add('strategy-motion-shell');

  const output = document.createElement('div');
  output.className = 'strategy-plan-output';
  output.id = 'strategy-plan-output';
  output.innerHTML = '<span class="strategy-plan-label">Those inputs become</span><strong>Content plan</strong><span class="strategy-plan-detail"></span><span class="strategy-plan-hint">Hover, focus, or tap an input to see what it changes.</span>';
  output.querySelector('.strategy-plan-detail').textContent = defaultDetail;
  map.appendChild(output);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('strategy-motion-lines');
  svg.setAttribute('aria-hidden', 'true');
  map.insertBefore(svg, flow);

  const paths = nodes.map(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('pathLength', '1');
    svg.appendChild(path);
    return path;
  });

  const drawLines = () => {
    if (window.matchMedia('(max-width:700px)').matches) return;
    const mapRect = map.getBoundingClientRect();
    const outputRect = output.getBoundingClientRect();
    const width = Math.max(1, map.clientWidth);
    const height = Math.max(1, map.scrollHeight);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));

    const targetX = outputRect.left - mapRect.left + outputRect.width / 2;
    const targetY = outputRect.top - mapRect.top;

    nodes.forEach((node, index) => {
      const rect = node.getBoundingClientRect();
      const startX = rect.left - mapRect.left + rect.width / 2;
      const startY = rect.bottom - mapRect.top;
      const bendY = startY + Math.max(18, (targetY - startY) * .48);
      paths[index].setAttribute('d', `M ${startX} ${startY} C ${startX} ${bendY}, ${targetX} ${bendY}, ${targetX} ${targetY}`);
    });
  };

  nodes.forEach((node, index) => {
    node.tabIndex = 0;
    node.setAttribute('aria-describedby', output.id);
    node.dataset.strategyIndex = String(index);
  });

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const finish = () => {
    clearTimers();
    nodes.forEach(node => node.classList.add('is-fed'));
    paths.forEach(path => path.classList.add('is-fed'));
    output.classList.add('is-visible');
    map.classList.add('is-complete');
    played = true;
  };

  const run = () => {
    if (played) return;
    if (reduceMotion.matches || document.documentElement.classList.contains('boring-mode')) {
      finish();
      return;
    }
    played = true;
    nodes.forEach((node, index) => {
      timers.push(setTimeout(() => {
        node.classList.add('is-fed');
        paths[index].classList.add('is-fed');
      }, index * 230));
    });
    timers.push(setTimeout(() => {
      output.classList.add('is-visible');
      map.classList.add('is-complete');
    }, nodes.length * 230 + 120));
  };

  const setFocus = (index) => {
    nodes.forEach((node, i) => node.classList.toggle('is-focused', i === index));
    paths.forEach((path, i) => path.classList.toggle('is-focused', i === index));
    output.classList.add('is-focused');
    output.querySelector('.strategy-plan-detail').textContent = focusDetails[index];
  };

  const resetFocus = () => {
    nodes.forEach(node => node.classList.remove('is-focused'));
    paths.forEach(path => path.classList.remove('is-focused'));
    output.classList.remove('is-focused');
    output.querySelector('.strategy-plan-detail').textContent = defaultDetail;
  };

  nodes.forEach((node, index) => {
    node.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') setFocus(index);
    });
    node.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') resetFocus();
    });
    node.addEventListener('focus', () => setFocus(index));
    node.addEventListener('blur', resetFocus);
    node.addEventListener('click', () => setFocus(index));
  });

  document.addEventListener('pointerdown', event => {
    if (!map.contains(event.target)) resetFocus();
  });

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      run();
      observer.disconnect();
    }
  }, { threshold: .34 });
  observer.observe(map);

  let resizeTimer;
  const scheduleDraw = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawLines, 90);
  };
  window.addEventListener('resize', scheduleDraw, { passive: true });
  window.addEventListener('load', drawLines, { once: true });
  document.fonts?.ready.then(drawLines).catch(() => {});
  requestAnimationFrame(drawLines);

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) finish();
  });
  window.addEventListener('portfolio:boringchange', () => {
    if (document.documentElement.classList.contains('boring-mode')) finish();
  });
})();
