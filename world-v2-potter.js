(() => {
  const body = document.body;
  if (!body?.classList.contains('world-v2')) return;

  const addNote = (container, text) => {
    if (!container || container.querySelector('.world-hp-note')) return;
    const note = document.createElement('p');
    note.className = 'world-hp-note';
    note.textContent = text;
    container.appendChild(note);
  };

  const hero = document.querySelector('.page-hero .container, .case-page-hero .container');

  if (body.classList.contains('page-home')) {
    const heroCopy = document.querySelector('.hero-copy');
    addNote(heroCopy, '50+ Harry Potter rewatches have probably affected the architecture. I am choosing not to investigate further.');
  } else if (body.classList.contains('page-strategy')) {
    addNote(hero, 'No Time-Turner here. Research first. Calendar later.');
  } else if (body.classList.contains('page-work')) {
    addNote(hero, 'The Restricted Section, except you are actually allowed to open things. The moving pages are intentional.');
  } else if (body.classList.contains('page-cases')) {
    addNote(hero, 'Revelio works here. Clicking a case study is still faster.');
  } else if (body.classList.contains('page-about')) {
    addNote(hero, 'Harry Potter: 50+ rewatches. So yes, parts of this portfolio behaving strangely are probably related.');
  } else if (body.classList.contains('page-case')) {
    addNote(hero, 'Evidence first. Enchantment second. Even Hogwarts would need receipts.');
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
