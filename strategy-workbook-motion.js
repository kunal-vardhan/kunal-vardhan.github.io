(() => {
  const app = document.querySelector('.excel-app');
  const tabs = [...document.querySelectorAll('.tab')];
  const sheets = [...document.querySelectorAll('.sheet')];
  const wrap = document.querySelector('.sheet-wrap');
  const formula = document.querySelector('.formula');
  const formulaInput = document.querySelector('.formula-input');
  const namebox = document.querySelector('.namebox');
  const statusbar = document.querySelector('.statusbar');
  if (!app || tabs.length !== 6 || sheets.length !== 6 || !wrap || !formula || !formulaInput || !namebox || !statusbar) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const defaultFormula = formulaInput.textContent;
  const defaultName = namebox.textContent;
  const defaultStatus = statusbar.firstElementChild?.textContent || 'Ready';
  const steps = [
    {target:'overview', row:1, cell:4, name:'D2', formula:'Start with the business goal: what should content help the business achieve?'},
    {target:'roadmap', row:4, cell:8, name:'H5', formula:'Prioritise work by buyer need, business value, and opportunity.'},
    {target:'calendar', row:4, cell:10, name:'J5', formula:'Turn the roadmap into production without letting the calendar become the strategy.'},
    {target:'clusters', row:4, cell:7, name:'G5', formula:'Connect supporting pages so useful content strengthens the wider topic system.'},
    {target:'distribution', row:1, cell:5, name:'E2', formula:'Extend one strong asset into more useful touchpoints instead of publish-and-wait.'},
    {target:'performance', row:4, cell:7, name:'G5', formula:'Use performance to decide what gets refreshed, expanded, consolidated, or deprioritised.'}
  ];

  let timers = [];
  let demoStarted = false;
  let internalClick = false;
  let selectedCell = null;
  let selectedRow = null;

  const pill = document.createElement('span');
  pill.className = 'workbook-guide-pill';
  pill.textContent = 'Guided workbook pass';
  const ribbon = document.querySelector('.ribbon');
  ribbon?.appendChild(pill);

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const clearSelection = () => {
    selectedCell?.classList.remove('sheet-guide-cell');
    selectedRow?.classList.remove('sheet-guide-row');
    selectedCell = null;
    selectedRow = null;
    tabs.forEach(tab => tab.classList.remove('guide-active'));
  };

  const restoreChrome = () => {
    formula.classList.remove('is-guided');
    formulaInput.textContent = defaultFormula;
    namebox.textContent = defaultName;
    if (statusbar.firstElementChild) {
      statusbar.firstElementChild.textContent = defaultStatus;
      statusbar.firstElementChild.classList.remove('guide-status');
    }
    app.classList.remove('is-guiding');
  };

  const cancelDemo = (keepCurrent = true) => {
    clearTimers();
    demoStarted = true;
    if (!keepCurrent) clearSelection();
    restoreChrome();
  };

  const activateStep = (step, index) => {
    const tab = tabs.find(item => item.dataset.target === step.target);
    const sheet = sheets.find(item => item.dataset.sheet === step.target);
    if (!tab || !sheet) return;

    clearSelection();
    internalClick = true;
    tab.click();
    internalClick = false;
    tab.classList.add('guide-active');

    wrap.scrollTop = 0;
    wrap.scrollLeft = 0;

    selectedRow = sheet.querySelector(`tbody tr:nth-child(${step.row})`);
    selectedCell = selectedRow?.querySelector(`td:nth-child(${step.cell})`) || null;
    selectedRow?.classList.add('sheet-guide-row');
    selectedCell?.classList.add('sheet-guide-cell');
    selectedCell?.scrollIntoView({block:'nearest', inline:'nearest'});

    formula.classList.add('is-guided');
    namebox.textContent = step.name;
    formulaInput.textContent = step.formula;
    if (statusbar.firstElementChild) {
      statusbar.firstElementChild.textContent = `Step ${index + 1} of ${steps.length}`;
      statusbar.firstElementChild.classList.add('guide-status');
    }
  };

  const finishDemo = () => {
    clearSelection();
    restoreChrome();
    internalClick = true;
    tabs[0].click();
    internalClick = false;
    wrap.scrollTop = 0;
    wrap.scrollLeft = 0;
  };

  const runDemo = () => {
    if (demoStarted) return;
    demoStarted = true;
    if (reduceMotion.matches) return;

    app.classList.add('is-guiding');
    steps.forEach((step, index) => {
      timers.push(setTimeout(() => activateStep(step, index), 420 + index * 900));
    });
    timers.push(setTimeout(finishDemo, 420 + steps.length * 900 + 700));
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (!internalClick && app.classList.contains('is-guiding')) cancelDemo(true);
      if (!internalClick) clearSelection();
    }, true);
  });

  wrap.addEventListener('pointerdown', () => {
    if (app.classList.contains('is-guiding')) cancelDemo(true);
  }, {passive:true});
  wrap.addEventListener('wheel', () => {
    if (app.classList.contains('is-guiding')) cancelDemo(true);
  }, {passive:true});

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      runDemo();
      observer.disconnect();
    }
  }, {threshold:.45});
  observer.observe(app);

  reduceMotion.addEventListener?.('change', event => {
    if (event.matches) cancelDemo(false);
  });
})();
