(() => {
  const path = location.pathname;
  const isCase = path.includes('/case-studies/');
  if (!isCase) return;

  // The proof assets are SVG documents containing the supplied screenshots.
  // Loading them as <object> avoids the nested-image restriction some browsers apply to <img src="...svg">.
  document.querySelectorAll('.proof-frame img[src$=".svg"], .proof-frame img[src*=".svg?"]').forEach(img => {
    const obj = document.createElement('object');
    obj.data = img.getAttribute('src').split('?')[0];
    obj.type = 'image/svg+xml';
    obj.className = 'proof-object';
    obj.setAttribute('aria-label', img.alt || 'Case study evidence screenshot');
    obj.innerHTML = `<p>${img.alt || 'Case study evidence screenshot'}</p>`;
    img.replaceWith(obj);
  });

  const insertAfterH2 = (selector, html) => {
    const section = document.querySelector(selector);
    if (!section || section.querySelector('.case-diagram[data-added="true"]')) return;
    const h2 = section.querySelector('h2');
    if (!h2) return;
    h2.insertAdjacentHTML('afterend', html);
  };

  const addMeta = items => {
    const hero = document.querySelector('.case-page-hero .container');
    if (!hero || hero.querySelector('.case-meta')) return;
    const metrics = hero.querySelector('.case-page-metrics');
    if (!metrics) return;
    metrics.insertAdjacentHTML('afterend', `<div class="case-meta">${items.map(([k,v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>`);
  };

  if (path.includes('api-organic-growth')) {
    addMeta([
      ['Company / product','DigitalAPI · API management platform'],
      ['Scope','Content strategy, research, briefs, production, internal linking, refreshes'],
      ['Audience','Developers, API teams, technical evaluators and buyers'],
      ['Evidence','First-party Google Analytics, Jan–Sep 2025']
    ]);
    insertAfterH2('#plan', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">How the content system was structured</p><p class="case-diagram-note">The point was to connect buyer questions instead of publishing isolated keyword pages.</p><div class="case-flow"><div class="case-flow-step"><b>1 · Product & ICP</b><span>Start with the API problems and use cases the product actually addresses.</span></div><div class="case-flow-step"><b>2 · Search intent</b><span>Separate education, troubleshooting, comparison, pricing and vendor-evaluation intent.</span></div><div class="case-flow-step"><b>3 · Pillars & clusters</b><span>Group related pages around API-management themes so coverage compounds.</span></div><div class="case-flow-step"><b>4 · Internal paths</b><span>Move readers to the next useful guide, use case, comparison or commercial page.</span></div></div></div>`);
    document.querySelector('#plan ul')?.insertAdjacentHTML('afterend', `<div class="journey-lanes"><article class="journey-lane"><b>TOFU</b><h4>Build category understanding</h4><p>Core API concepts, marketplaces, frameworks and broader education.</p></article><article class="journey-lane"><b>MOFU</b><h4>Help solve and compare</h4><p>Rate limits, governance problems, architecture choices and use-case content.</p></article><article class="journey-lane"><b>BOFU</b><h4>Reduce buying friction</h4><p>Cost, tools, platforms, implementation and vendor-evaluation questions.</p></article></div>`);
    insertAfterH2('#execution', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">The operating loop</p><p class="case-diagram-note">Publishing was one step in a repeatable content operation.</p><div class="case-flow"><div class="case-flow-step"><b>Research</b><span>SERP, competitor, product and buyer context.</span></div><div class="case-flow-step"><b>Brief</b><span>Intent, angle, structure, sources, product relevance and links.</span></div><div class="case-flow-step"><b>Publish</b><span>Write, edit, fact-check and connect the page into the cluster.</span></div><div class="case-flow-step"><b>Review</b><span>Use performance to refresh, expand, consolidate or reprioritise.</span></div></div></div>`);
  }

  if (path.includes('logistics-search-growth')) {
    addMeta([
      ['Company / product','FarEye · Logistics / delivery software'],
      ['Scope','Research and content execution across operational and software-evaluation topics'],
      ['Audience','Supply-chain, logistics and delivery-operations teams'],
      ['Evidence','Original Ahrefs page snapshot supplied for this portfolio']
    ]);
    insertAfterH2('#coverage', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">How the coverage moved with the buyer</p><p class="case-diagram-note">The content did not treat every logistics query as the same kind of reader need.</p><div class="case-flow"><div class="case-flow-step"><b>Understand</b><span>Direct-store delivery, last-mile terminology and operational concepts.</span></div><div class="case-flow-step"><b>Diagnose</b><span>Tracking, visibility, routing and delivery-process problems.</span></div><div class="case-flow-step"><b>Evaluate</b><span>Software categories, capabilities and comparison criteria.</span></div><div class="case-flow-step"><b>Connect</b><span>Bring the reader to the relevant FarEye solution when it genuinely fits.</span></div></div></div>`);
    insertAfterH2('#execution', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">Research sequence for operational content</p><p class="case-diagram-note">The workflow comes before the software pitch.</p><div class="journey-lanes"><article class="journey-lane"><b>01 · Workflow</b><h4>Understand how the operation works</h4><p>Actors, steps, constraints, hand-offs and where the reader is likely losing time or visibility.</p></article><article class="journey-lane"><b>02 · Search language</b><h4>Map how people describe the problem</h4><p>Terminology, queries, SERP expectations and the level of detail the reader already knows.</p></article><article class="journey-lane"><b>03 · Product fit</b><h4>Introduce technology where it belongs</h4><p>Explain the job first, then show how software can support the workflow without forcing a pitch.</p></article></div></div>`);
  }

  if (path.includes('enterprise-software-content')) {
    addMeta([
      ['Content environment','Enterprise SaaS / digital adoption'],
      ['Scope','Research, buyer education and commercial-intent content execution'],
      ['Audience','Enterprise software evaluators, operations and digital-adoption stakeholders'],
      ['Proof type','Point-in-time third-party SEO-tool snapshots']
    ]);
    insertAfterH2('#direction', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">A high-intent enterprise question has layers</p><p class="case-diagram-note">“What does implementation cost?” is rarely only a pricing question.</p><div class="case-flow"><div class="case-flow-step"><b>Question</b><span>What will this cost and what changes the price?</span></div><div class="case-flow-step"><b>Risk</b><span>Scope, training, consultants, customisation and support.</span></div><div class="case-flow-step"><b>Decision</b><span>Budget, implementation effort, adoption and expected ROI.</span></div><div class="case-flow-step"><b>Product fit</b><span>Only then connect the reader to the relevant solution.</span></div></div></div>`);
    insertAfterH2('#execution', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">What made the content commercially useful</p><div class="journey-lanes"><article class="journey-lane"><b>Clarity</b><h4>Answer the decision first</h4><p>Structure around what the buyer needs to know rather than around internal product messaging.</p></article><article class="journey-lane"><b>Evidence</b><h4>Make claims concrete</h4><p>Use credible sources, cost drivers, process examples and realistic implementation factors.</p></article><article class="journey-lane"><b>Relevance</b><h4>Bridge to the product naturally</h4><p>Connect the solution after the reader understands the problem, trade-offs and buying context.</p></article></div></div>`);
  }

  if (path.includes('learniverse-growth')) {
    addMeta([
      ['Company','Learniverse'],
      ['Starting point','No meaningful established blog / organic content base'],
      ['Contribution','Helped build the organic content foundation from scratch'],
      ['Evidence available','Endpoint result only; old detailed strategy records are no longer available']
    ]);
    insertAfterH2('#work', `<div class="case-diagram" data-added="true"><p class="case-diagram-title">What building from scratch means</p><p class="case-diagram-note">This is a process illustration, not a reconstruction of missing historical analytics.</p><div class="case-flow"><div class="case-flow-step"><b>Start</b><span>Little to no meaningful organic-content base.</span></div><div class="case-flow-step"><b>Foundation</b><span>Create useful, discoverable content that gives search something to rank.</span></div><div class="case-flow-step"><b>Coverage</b><span>Build enough relevant pages for organic visibility to compound.</span></div><div class="case-flow-step"><b>Endpoint</b><span>Roughly 2,500 monthly organic visits by the time the engagement ended.</span></div></div></div>`);
  }
})();
