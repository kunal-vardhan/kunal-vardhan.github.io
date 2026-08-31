(() => {
  const path = location.pathname;
  if (!path.includes('/case-studies/')) return;

  // Proof screenshots are currently stored as original JPEG/PNG data inside SVG wrapper files.
  // Some browsers are inconsistent when those SVG wrappers are used as <img> or <object>.
  // Fetch the same-origin wrapper, extract the original raster data URI, and render that directly.
  const proofImages = document.querySelectorAll('.proof-frame img[src*=".svg"], .evidence-frame img[src*=".svg"]');
  proofImages.forEach(async img => {
    const wrapperSrc = img.getAttribute('src');
    if (!wrapperSrc || img.dataset.proofReady === 'true') return;

    try {
      const wrapperUrl = wrapperSrc.split('?')[0];
      const response = await fetch(`${wrapperUrl}?proof=4`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Proof asset returned ${response.status}`);
      const svgText = await response.text();
      const match = svgText.match(/(?:href|xlink:href)=["'](data:image\/(?:jpeg|jpg|png|webp);base64,[^"']+)["']/i);
      if (!match) throw new Error('Embedded screenshot data was not found');

      img.src = match[1];
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.dataset.proofReady = 'true';
      img.classList.add('proof-raster-ready');
    } catch (error) {
      img.dataset.proofError = 'true';
      console.error('Unable to render case-study evidence screenshot:', error);
    }
  });

  const insertAfterH2 = (selector, html) => {
    const section = document.querySelector(selector);
    if (!section || section.querySelector('.case-diagram')) return;
    const h2 = section.querySelector('h2');
    if (h2) h2.insertAdjacentHTML('afterend', html);
  };

  const addMeta = items => {
    const hero = document.querySelector('.case-page-hero .container');
    if (!hero || hero.querySelector('.case-meta')) return;
    const metrics = hero.querySelector('.case-page-metrics');
    if (!metrics) return;
    metrics.insertAdjacentHTML('afterend', `<div class="case-meta">${items.map(([k,v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>`);
  };

  // The current detailed case studies already contain their primary diagrams. These
  // fallbacks only enrich older case-page structures if one is ever served from cache.
  if (path.includes('api-organic-growth')) {
    addMeta([['Company / product','DigitalAPI · API management platform'],['Scope','Content strategy, research, briefs, production, internal linking, refreshes'],['Audience','Developers, API teams, technical evaluators and buyers'],['Evidence','First-party Google Analytics, Jan–Sep 2025']]);
    insertAfterH2('#plan', `<div class="case-diagram"><p class="case-diagram-title">How the content system was structured</p><p class="case-diagram-note">The point was to connect buyer questions instead of publishing isolated keyword pages.</p><div class="case-flow"><div class="case-flow-step"><b>1 · Product & ICP</b><span>Start with the API problems and use cases the product actually addresses.</span></div><div class="case-flow-step"><b>2 · Search intent</b><span>Separate education, troubleshooting, comparison, pricing and vendor-evaluation intent.</span></div><div class="case-flow-step"><b>3 · Pillars & clusters</b><span>Group related pages around API-management themes so coverage compounds.</span></div><div class="case-flow-step"><b>4 · Internal paths</b><span>Move readers to the next useful guide, use case, comparison or commercial page.</span></div></div></div>`);
  }

  if (path.includes('logistics-search-growth')) {
    addMeta([['Company / product','FarEye · Logistics / delivery software'],['Scope','Research and content execution across operational and software-evaluation topics'],['Audience','Supply-chain, logistics and delivery-operations teams'],['Evidence','Original Ahrefs page snapshot supplied for this portfolio']]);
    insertAfterH2('#coverage', `<div class="case-diagram"><p class="case-diagram-title">How the coverage moved with the buyer</p><p class="case-diagram-note">The content did not treat every logistics query as the same kind of reader need.</p><div class="case-flow"><div class="case-flow-step"><b>Understand</b><span>Direct-store delivery, last-mile terminology and operational concepts.</span></div><div class="case-flow-step"><b>Diagnose</b><span>Tracking, visibility, routing and delivery-process problems.</span></div><div class="case-flow-step"><b>Evaluate</b><span>Software categories, capabilities and comparison criteria.</span></div><div class="case-flow-step"><b>Connect</b><span>Bring the reader to the relevant FarEye solution when it genuinely fits.</span></div></div></div>`);
  }

  if (path.includes('enterprise-software-content')) {
    addMeta([['Content environment','Enterprise SaaS / digital adoption'],['Scope','Research, buyer education and commercial-intent content execution'],['Audience','Enterprise software evaluators, operations and digital-adoption stakeholders'],['Proof type','Point-in-time third-party SEO-tool snapshots']]);
    insertAfterH2('#direction', `<div class="case-diagram"><p class="case-diagram-title">A high-intent enterprise question has layers</p><p class="case-diagram-note">“What does implementation cost?” is rarely only a pricing question.</p><div class="case-flow"><div class="case-flow-step"><b>Question</b><span>What will this cost and what changes the price?</span></div><div class="case-flow-step"><b>Risk</b><span>Scope, training, consultants, customisation and support.</span></div><div class="case-flow-step"><b>Decision</b><span>Budget, implementation effort, adoption and expected ROI.</span></div><div class="case-flow-step"><b>Product fit</b><span>Only then connect the reader to the relevant solution.</span></div></div></div>`);
  }

  if (path.includes('learniverse-growth')) {
    addMeta([['Company','Learniverse'],['Starting point','No meaningful established blog / organic content base'],['Contribution','Helped build the organic content foundation from scratch'],['Evidence available','Endpoint result only; old detailed strategy records are no longer available']]);
    insertAfterH2('#work', `<div class="case-diagram"><p class="case-diagram-title">What building from scratch means</p><p class="case-diagram-note">This is a process illustration, not a reconstruction of missing historical analytics.</p><div class="case-flow"><div class="case-flow-step"><b>Start</b><span>Little to no meaningful organic-content base.</span></div><div class="case-flow-step"><b>Foundation</b><span>Create useful, discoverable content that gives search something to rank.</span></div><div class="case-flow-step"><b>Coverage</b><span>Build enough relevant pages for organic visibility to compound.</span></div><div class="case-flow-step"><b>Endpoint</b><span>Roughly 2,500 monthly organic visits by the time the engagement ended.</span></div></div></div>`);
  }
})();