(() => {
  const body = document.body;
  if (!body?.classList.contains('page-work')) return;

  /* This file is now only a migration shell for work.html on the redesign branch.
     The preview frames, filters and eBook engines are deliberately left untouched. */
  body.classList.remove('world-v2');
  body.classList.add('hp-site');

  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.remove('site-header');
    header.classList.add('spellbook-header');
    header.querySelector('.brand-lockup')?.classList.replace('brand-lockup','spellbook-brand');
    header.querySelector('.site-nav')?.classList.replace('site-nav','spellbook-nav');
  }

  const hero = document.querySelector('.page-hero');
  const heroContainer = hero?.querySelector('.container');
  if (hero && heroContainer && !heroContainer.querySelector('.work-intro-grid')) {
    hero.classList.remove('page-hero');
    hero.classList.add('page-hero-revamp');
    const aside = heroContainer.querySelector('.byline-note');
    const copy = document.createElement('div');
    const wrapper = document.createElement('div');
    wrapper.className = 'work-intro-grid';
    [...heroContainer.children].forEach(child => {
      if (child !== aside) copy.appendChild(child);
    });
    const note = document.createElement('p');
    note.className = 'hero-aside-note';
    note.textContent = 'Restricted Section rules do not apply. The moving pages are intentional.';
    copy.appendChild(note);
    if (aside) {
      aside.classList.remove('byline-note');
      aside.classList.add('byline-note-revamp');
      aside.querySelector('.byline-label')?.classList.add('eyebrow');
    }
    wrapper.appendChild(copy);
    if (aside) wrapper.appendChild(aside);
    heroContainer.appendChild(wrapper);
  }

  document.querySelectorAll('.visual-work-grid').forEach((grid, index) => {
    grid.dataset.archive = index === 0 ? 'commercial' : 'editorial';
  });
  document.querySelectorAll('.visual-work-card').forEach((card, index) => {
    card.dataset.folio = String(index + 1).padStart(2,'0');
  });
  document.querySelectorAll('.section-head').forEach(head => head.classList.add('archive-heading'));

  const cta = document.querySelector('.cta-band');
  if (cta) cta.classList.add('work-archive-cta');

  const footer = document.querySelector('.site-footer');
  if (footer) {
    footer.classList.remove('site-footer');
    footer.classList.add('hp-footer');
    const wrap = footer.querySelector('.footer-wrap');
    if (wrap && !wrap.querySelector('.mischief-button')) {
      const button = document.createElement('button');
      button.className = 'mischief-button';
      button.type = 'button';
      button.textContent = 'Mischief managed';
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-controls','hp-map');
      const home = wrap.querySelector('a');
      if (home) wrap.insertBefore(button, home); else wrap.appendChild(button);
    }
  }

  /* revamp.js runs after the DOM has the new structural classes. */
  const script = document.createElement('script');
  script.src = '/revamp.js?v=1';
  script.defer = true;
  document.body.appendChild(script);
})();
