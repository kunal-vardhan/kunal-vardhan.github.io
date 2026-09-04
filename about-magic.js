(() => {
  const board = document.querySelector('.lumos-board');
  if (!board) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  const trigger = board.querySelector('.lumos-trigger');
  const message = board.querySelector('.lumos-message');
  const facts = [...board.querySelectorAll('.lumos-fact')];

  if (reduceMotion.matches) {
    facts.forEach(fact => fact.classList.add('is-revealed'));
    if (message) message.textContent = 'No spells required. Everything is visible.';
    return;
  }

  if (coarsePointer.matches) {
    facts.forEach(fact => {
      fact.tabIndex = 0;
      const reveal = () => {
        const open = fact.classList.toggle('is-revealed');
        if (open) facts.filter(x => x !== fact).forEach(x => x.classList.remove('is-revealed'));
      };
      fact.addEventListener('click', reveal);
      fact.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          reveal();
        }
      });
    });
  }

  let visible = true;
  let pointerInside = false;
  let lumos = false;
  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let lastParticleAt = 0;
  let lastX = 0;
  let lastY = 0;

  const canvas = document.createElement('canvas');
  canvas.className = 'lumos-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  board.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => {
    const rect = board.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  new ResizeObserver(resize).observe(board);
  resize();

  const addSpark = (x, y, burst = false) => {
    const count = burst ? 28 : 2;
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? 0.8 + Math.random() * 2.4 : 0.25 + Math.random() * 0.7;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 0.35 : 0.1),
        age: 0,
        life: 34 + Math.random() * 28,
        size: 0.8 + Math.random() * (burst ? 2.2 : 1.1)
      });
    }
    if (particles.length > 120) particles = particles.slice(-120);
    start();
  };

  const draw = () => {
    raf = 0;
    ctx.clearRect(0, 0, width, height);

    particles = particles.filter(p => p.age < p.life);
    particles.forEach(p => {
      p.age += 1;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      const alpha = Math.max(0, 1 - p.age / p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 210, 145, ${alpha * 0.82})`;
      ctx.fill();
    });

    if (particles.length && visible && (pointerInside || lumos)) start();
  };

  function start() {
    if (!raf && visible) raf = requestAnimationFrame(draw);
  }

  const moveLight = event => {
    if (coarsePointer.matches) return;
    const rect = board.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    board.style.setProperty('--mx', `${x}px`);
    board.style.setProperty('--my', `${y}px`);

    const now = performance.now();
    const distance = Math.hypot(x - lastX, y - lastY);
    if (distance > 8 && now - lastParticleAt > 28) {
      addSpark(x, y, false);
      lastParticleAt = now;
      lastX = x;
      lastY = y;
    }
  };

  board.addEventListener('pointerenter', event => {
    if (coarsePointer.matches) return;
    pointerInside = true;
    board.classList.add('is-lit');
    moveLight(event);
  });

  board.addEventListener('pointermove', moveLight);

  board.addEventListener('pointerleave', () => {
    pointerInside = false;
    if (!lumos) board.classList.remove('is-lit');
  });

  const setLumos = state => {
    lumos = state;
    board.classList.toggle('is-lumos', state);
    board.classList.toggle('is-lit', state || pointerInside);
    facts.forEach(fact => fact.classList.toggle('is-revealed', state || fact.classList.contains('is-revealed')));
    if (trigger) {
      trigger.setAttribute('aria-pressed', String(state));
      trigger.textContent = state ? 'Nox' : 'Lumos?';
    }
    if (message) {
      message.textContent = state
        ? 'You found it. Ten points to your house. I do not make the rules.'
        : 'Move the light around. Or try a spell.';
    }
    if (state) addSpark(width * 0.5, height * 0.48, true);
  };

  if (trigger) trigger.addEventListener('click', () => setLumos(!lumos));

  let typed = '';
  window.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.target.matches('input,textarea,[contenteditable="true"]')) return;
    if (event.key.length !== 1 || !/[a-z]/i.test(event.key)) return;
    typed = (typed + event.key.toLowerCase()).slice(-5);
    if (typed.endsWith('lumos')) setLumos(true);
    if (typed.endsWith('nox')) setLumos(false);
  });

  const observer = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    if (!visible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, width, height);
    } else if (visible && particles.length) {
      start();
    }
  }, { threshold: 0.05 });
  observer.observe(board);

  window.addEventListener('portfolio:boringchange', () => {
    if (document.documentElement.classList.contains('boring-mode')) {
      setLumos(false);
      particles = [];
      ctx.clearRect(0, 0, width, height);
    }
  });
})();
