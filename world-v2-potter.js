(() => {
  const body = document.body;
  if (!body?.classList.contains('world-v2')) return;

  /* Small visual corrections shared across the live site. */
  if (!document.querySelector('link[href^="/visual-cleanup.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/visual-cleanup.css?v=1';
    document.head.appendChild(link);
  }

  const setHeroCopy = (container, title, intro) => {
    if (!container) return;
    const heading = container.querySelector('h1');
    if (heading && title) heading.textContent = title;
    const introP = [...container.children].find(el =>
      el.tagName === 'P' &&
      !el.classList.contains('eyebrow') &&
      !el.classList.contains('hero-kicker') &&
      !el.classList.contains('world-hp-note')
    );
    if (introP && intro) introP.textContent = intro;
  };

  const addNote = (container, text) => {
    if (!container || container.querySelector('.world-hp-note')) return;
    const note = document.createElement('p');
    note.className = 'world-hp-note';
    note.textContent = text;
    container.appendChild(note);
  };

  const pageHero = document.querySelector('.page-hero .container, .case-page-hero .container');

  if (body.classList.contains('page-home')) {
    const heroCopy = document.querySelector('.hero-copy');
    setHeroCopy(
      heroCopy,
      'I write and plan content for products that are hard to explain.',
      'Most of my recent work has been in B2B SaaS, APIs, logistics, cybersecurity, and enterprise software. I write articles, commercial pages, comparisons, guides, and help decide what should be created or refreshed next.'
    );
    addNote(heroCopy, '50+ Harry Potter rewatches. That explains some of the website.');
  } else if (body.classList.contains('page-strategy')) {
    setHeroCopy(
      pageHero,
      "I don't start with a content calendar.",
      'First I need to understand the product, the buyer, the questions they ask, what already exists, what competitors cover, and what the business actually needs. Then I plan what to create, refresh, or connect.'
    );
    addNote(pageHero, 'No Time-Turner. Research first, calendar later.');
  } else if (body.classList.contains('page-work')) {
    setHeroCopy(
      pageHero,
      "A library of things I've written and helped build.",
      'Articles, website copy, commercial pages, eBooks, and other client work. The full-page previews scroll inside their own frames, so you can look through the work without leaving the page.'
    );
    addNote(pageHero, "Restricted Section. Except you're allowed to open everything.");
  } else if (body.classList.contains('page-cases')) {
    setHeroCopy(
      pageHero,
      'Four projects. The work, the results, and the proof.',
      'Each case study shows the problem, my role, what I created, how I approached it, and the results I can still support with evidence.'
    );
    addNote(pageHero, 'Revelio works. The proof is already on the page.');
  } else if (body.classList.contains('page-about')) {
    setHeroCopy(
      pageHero,
      'I started in biotechnology. I ended up writing about software.',
      "I've spent 5 years writing, researching, editing, planning content, and reviewing performance. Most of my recent work is in B2B SaaS and other products that take a little more explaining."
    );
    addNote(pageHero, 'Harry Potter has been rewatched 50+ times. That explains some things.');
  } else if (body.classList.contains('page-case')) {
    addNote(pageHero, 'Evidence first. Enchantment second.');
  }

  const footer = document.querySelector('.site-footer .footer-wrap');
  if (footer && !footer.querySelector('.world-footer-note')) {
    const note = document.createElement('span');
    note.className = 'world-footer-note';
    note.textContent = 'Mischief managed-ish.';
    const homeLink = footer.querySelector('a');
    if (homeLink) footer.insertBefore(note, homeLink);
    else footer.appendChild(note);
  }
})();
