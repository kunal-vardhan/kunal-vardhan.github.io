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

(() => {
  const grid = document.querySelector('.strategy-grid-2');
  const funnel = grid?.querySelector('.funnel');
  const cluster = grid?.querySelector('.cluster');
  const stages = funnel ? [...funnel.children] : [];
  const assets = cluster ? [...cluster.querySelectorAll('.node')] : [];
  const hub = cluster?.querySelector('.hub');
  const rightPanel = cluster?.closest('.panel');
  if (!grid || !funnel || !cluster || !hub || !rightPanel || stages.length !== 4 || assets.length !== 5) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenarios = [
    {stage:'Awareness',primary:0,secondary:[2],format:'Educational guide',title:'What is API management?',why:'Build category understanding before asking the reader to compare vendors.'},
    {stage:'Consideration',primary:3,secondary:[1,2],format:'Comparison guide',title:'API gateway vs API management',why:'Help the reader compare approaches and narrow the options.'},
    {stage:'Decision',primary:4,secondary:[3],format:'Commercial guide',title:'API management pricing and implementation',why:'Answer cost, implementation, and vendor questions close to a buying decision.'},
    {stage:'Lifecycle',primary:1,secondary:[0],format:'Adoption guide',title:'API governance best practices',why:'Help existing users adopt the product well and expand how they use it.'}
  ];

  let demoPlayed=false, demoTimers=[], activeIndex=null, resizeTimer;
  grid.classList.add('strategy-asset-morph');
  hub.innerHTML='<span>Same topic</span><strong>API management</strong>';

  const output=document.createElement('article');
  output.className='strategy-asset-output';
  output.id='strategy-asset-output';
  output.innerHTML='<span class="strategy-asset-kicker">Same topic · API management</span><strong class="strategy-asset-title">One topic. Four possible assets.</strong><span class="strategy-asset-meta">Pick a buyer stage on the left.</span><p class="strategy-asset-why">The subject stays the same. The reader’s job decides what the asset should become.</p>';
  rightPanel.appendChild(output);

  const note=document.createElement('div');
  note.className='strategy-asset-note';
  note.id='strategy-asset-note';
  note.innerHTML='<strong>Try it</strong><span>Pick a buyer stage. The topic stays the same. The asset changes.</span>';
  grid.appendChild(note);

  const bridge=document.createElementNS('http://www.w3.org/2000/svg','svg');
  bridge.classList.add('strategy-asset-bridge');
  bridge.setAttribute('aria-hidden','true');
  const bridgePath=document.createElementNS('http://www.w3.org/2000/svg','path');
  bridgePath.setAttribute('pathLength','1');
  bridge.appendChild(bridgePath);
  grid.insertBefore(bridge,grid.firstChild);

  const bridgeLabel=document.createElement('span');
  bridgeLabel.className='strategy-bridge-label';
  bridgeLabel.textContent='buyer intent';
  grid.appendChild(bridgeLabel);

  stages.forEach((stage,index)=>{
    stage.tabIndex=0;
    stage.dataset.stageIndex=String(index);
    stage.setAttribute('aria-controls',output.id);
    stage.setAttribute('aria-describedby',note.id);
  });

  const cancelDemo=()=>{demoTimers.forEach(clearTimeout);demoTimers=[];demoPlayed=true;};

  const drawBridge=()=>{
    if(activeIndex===null||window.matchMedia('(max-width:700px)').matches)return;
    const gridRect=grid.getBoundingClientRect();
    const stageRect=stages[activeIndex].getBoundingClientRect();
    const outputRect=output.getBoundingClientRect();
    const width=Math.max(1,grid.clientWidth),height=Math.max(1,grid.scrollHeight);
    const startX=stageRect.right-gridRect.left,startY=stageRect.top-gridRect.top+stageRect.height/2;
    const endX=outputRect.left-gridRect.left,endY=outputRect.top-gridRect.top+outputRect.height/2;
    const control=Math.max(34,(endX-startX)*.48);
    bridge.setAttribute('viewBox',`0 0 ${width} ${height}`);
    bridge.setAttribute('width',String(width));
    bridge.setAttribute('height',String(height));
    bridgePath.setAttribute('d',`M ${startX} ${startY} C ${startX+control} ${startY}, ${endX-control} ${endY}, ${endX} ${endY}`);
    bridgeLabel.style.left=`${(startX+endX)/2}px`;
    bridgeLabel.style.top=`${(startY+endY)/2}px`;
  };

  const renderOutput=scenario=>{
    output.querySelector('.strategy-asset-kicker').textContent=`Same topic · API management · ${scenario.stage}`;
    output.querySelector('.strategy-asset-title').textContent=scenario.title;
    output.querySelector('.strategy-asset-meta').textContent=scenario.format;
    output.querySelector('.strategy-asset-why').textContent=scenario.why;
    if(!reduceMotion.matches&&!document.documentElement.classList.contains('boring-mode')){
      output.animate([{opacity:.45,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
    }
  };

  const activate=(index,fromUser=false)=>{
    if(fromUser)cancelDemo();
    activeIndex=index;
    const scenario=scenarios[index];
    grid.classList.add('has-stage');
    stages.forEach((stage,i)=>stage.classList.toggle('is-active',i===index));
    assets.forEach((asset,i)=>{
      asset.classList.toggle('is-primary',i===scenario.primary);
      asset.classList.toggle('is-secondary',scenario.secondary.includes(i));
    });
    hub.classList.add('is-active');
    renderOutput(scenario);
    note.innerHTML=`<strong>${scenario.stage}</strong><span>${scenario.format}. Same topic, different job.</span>`;
    requestAnimationFrame(()=>{
      drawBridge();
      bridgePath.classList.remove('is-drawn');
      bridgeLabel.classList.remove('is-visible');
      requestAnimationFrame(()=>{
        bridgePath.classList.add('is-drawn');
        bridgeLabel.classList.add('is-visible');
      });
    });
  };

  const clearSelection=()=>{
    activeIndex=null;
    grid.classList.remove('has-stage');
    stages.forEach(stage=>stage.classList.remove('is-active'));
    assets.forEach(asset=>asset.classList.remove('is-primary','is-secondary'));
    hub.classList.remove('is-active');
    bridgePath.classList.remove('is-drawn');
    bridgeLabel.classList.remove('is-visible');
    output.querySelector('.strategy-asset-kicker').textContent='Same topic · API management';
    output.querySelector('.strategy-asset-title').textContent='One topic. Four possible assets.';
    output.querySelector('.strategy-asset-meta').textContent='Pick a buyer stage on the left.';
    output.querySelector('.strategy-asset-why').textContent='The subject stays the same. The reader’s job decides what the asset should become.';
    note.innerHTML='<strong>Try it</strong><span>Pick a buyer stage. The topic stays the same. The asset changes.</span>';
  };

  const runDemo=()=>{
    if(demoPlayed)return;
    demoPlayed=true;
    if(reduceMotion.matches||document.documentElement.classList.contains('boring-mode')){clearSelection();return;}
    scenarios.forEach((_,index)=>demoTimers.push(setTimeout(()=>activate(index),index*820)));
    demoTimers.push(setTimeout(clearSelection,scenarios.length*820+440));
  };

  stages.forEach((stage,index)=>{
    stage.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')activate(index,true);});
    stage.addEventListener('focus',()=>activate(index,true));
    stage.addEventListener('click',()=>activate(index,true));
  });

  document.addEventListener('pointerdown',event=>{if(!grid.contains(event.target))clearSelection();});

  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){runDemo();observer.disconnect();}
  },{threshold:.3});
  observer.observe(grid);

  const scheduleBridge=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawBridge,90);};
  window.addEventListener('resize',scheduleBridge,{passive:true});
  document.fonts?.ready.then(drawBridge).catch(()=>{});

  reduceMotion.addEventListener?.('change',event=>{if(event.matches){cancelDemo();clearSelection();}});
  window.addEventListener('portfolio:boringchange',()=>{if(document.documentElement.classList.contains('boring-mode')){cancelDemo();clearSelection();}});
})();
