(() => {
  const section = document.querySelector('#strategy-samples');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-heading split-heading">
        <div>
          <p class="eyebrow">Strategy made visible</p>
          <h2>How I turn a content strategy into a working system.</h2>
        </div>
        <p>The diagrams explain the logic quickly. The workbook underneath shows how that logic becomes an actual roadmap, content calendar, cluster plan, distribution plan, and separate performance review.</p>
      </div>

      <div class="strategy-visual-suite" aria-label="Content strategy diagrams">
        <article class="strategy-visual">
          <p class="eyebrow">Full-funnel content</p>
          <h3>Different questions, different jobs.</h3>
          <p>I map what the buyer needs at each stage before deciding what gets produced.</p>
          <div class="funnel-flow">
            <div class="funnel-node"><strong>TOFU</strong><span>Understand the problem, category, workflow, or terminology.</span></div>
            <div class="funnel-node"><strong>MOFU</strong><span>Compare approaches, solve specific problems, and understand solution fit.</span></div>
            <div class="funnel-node"><strong>BOFU</strong><span>Evaluate cost, vendors, implementation, alternatives, and buying risk.</span></div>
            <div class="funnel-arrow" aria-hidden="true"></div>
          </div>
        </article>

        <article class="strategy-visual">
          <p class="eyebrow">Topical authority & clusters</p>
          <h3>The site should feel connected, not like a folder of articles.</h3>
          <p>A pillar gives the topic a centre. Supporting pages cover adjacent intents and link back into the system.</p>
          <div class="cluster-map" aria-label="Illustrative API management topic cluster">
            <div class="cluster-hub">API Management<br>Pillar</div>
            <div class="cluster-node n1">Cost & pricing</div>
            <div class="cluster-node n2">Tools & vendors</div>
            <div class="cluster-node n3">Rate limits</div>
            <div class="cluster-node n4">Implementation</div>
            <div class="cluster-node n5">Gateway vs management</div>
          </div>
        </article>

        <article class="strategy-visual">
          <p class="eyebrow">Planning cadence</p>
          <h3>Strategy, roadmap, production, review.</h3>
          <p>The calendar is one operating layer. It should sit underneath the strategy rather than replace it.</p>
          <div class="cadence-flow">
            <div class="cadence-step"><b>Quarterly</b><span>Business goals, ICP, pillars, funnel gaps</span></div>
            <div class="cadence-step"><b>Monthly</b><span>Priority roadmap, briefs, SME needs</span></div>
            <div class="cadence-step"><b>Weekly</b><span>Production, editing, internal links, distribution</span></div>
            <div class="cadence-step"><b>Review</b><span>Performance, refreshes, expansion decisions</span></div>
          </div>
        </article>

        <article class="strategy-visual">
          <p class="eyebrow">Distribution & efficiency</p>
          <h3>One strong asset should create more than one touchpoint.</h3>
          <p>Distribution and refreshes extend the useful life of the work instead of treating publish as the finish line.</p>
          <div class="distribution-loop">
            <div class="loop-step"><b>1 · Publish</b><span>Create the core asset around a clear buyer job.</span></div>
            <div class="loop-step"><b>2 · Distribute</b><span>Adapt it for LinkedIn, newsletter, sales, or communities.</span></div>
            <div class="loop-step"><b>3 · Measure</b><span>Review search, engagement, product-path, and conversion signals.</span></div>
            <div class="loop-step"><b>4 · Improve</b><span>Refresh, expand, consolidate, or reuse what the data supports.</span></div>
          </div>
          <p class="loop-note">Efficiency comes from reusing strong thinking, not from producing more content for the sake of volume.</p>
        </article>
      </div>

      <div class="section-heading split-heading" style="margin-top:54px">
        <div><p class="eyebrow">Sample strategy workbook</p><h2>An actual workbook-style planning system.</h2></div>
        <p>This is an illustrative sample. Open the tabs to see strategy overview, quarterly roadmap, content calendar, topic clusters, distribution, and performance kept as separate working layers.</p>
      </div>

      <div class="actual-workbook">
        <div class="actual-workbook-top">
          <div class="actual-workbook-file">B2B_Content_Strategy_Planner.xlsx</div>
          <div class="actual-workbook-actions"><a href="/strategy-workbook.html" target="_blank" rel="noopener">Open full workbook preview ↗</a></div>
        </div>
        <div class="actual-workbook-note">Illustrative sample, not a client document. The structure is designed to show how I organise strategy work rather than present a decorative content calendar.</div>
        <iframe src="/strategy-workbook.html?v=2" title="Interactive sample B2B content strategy workbook" loading="lazy" style="display:block;width:100%;height:690px;border:0;background:#fff"></iframe>
        <div class="actual-sheet-caption"><strong>Why it is split this way:</strong> strategy defines the system; the roadmap prioritises it; the calendar operationalises it; clusters keep topics connected; distribution extends reach; performance decides what happens next.</div>
      </div>
    </div>`;
})();
