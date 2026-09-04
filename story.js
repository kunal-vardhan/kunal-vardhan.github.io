if(document.querySelector('.case-body')){const caseStyles=document.createElement('link');caseStyles.rel='stylesheet';caseStyles.href='/case-study-layout.css?v=1';document.head.appendChild(caseStyles);}if(location.pathname==='/work.html'||location.pathname==='/work'){const ebookStyles=document.createElement('link');ebookStyles.rel='stylesheet';ebookStyles.href='/ebook-library.css?v=1';document.head.appendChild(ebookStyles);}document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();const btn=document.querySelector('.menu-toggle'),nav=document.getElementById('site-nav');if(btn&&nav){btn.addEventListener('click',()=>{const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}));}if(location.pathname==='/work.html'||location.pathname==='/work'){const hero=document.querySelector('.page-hero .container');if(hero&&!hero.querySelector('.byline-note')){const note=document.createElement('p');note.className='byline-note';note.innerHTML='<strong>Byline note:</strong> Some samples in this library were created as ghostwritten client work, so my name may not appear on the published page or asset.';hero.appendChild(note);}const other=[...document.querySelectorAll('main>.section')].find(section=>section.querySelector('.eyebrow')?.textContent.trim()==='Other formats');if(other&&!document.querySelector('#ebooks')){const section=document.createElement('section');section.id='ebooks';section.className='section';section.innerHTML=`<div class="container"><div class="section-head"><div><p class="eyebrow">eBooks & long-form guides</p><h2>Long-form work that had to hold together beyond a single page.</h2></div><p>These projects involved structuring and writing content across complete multi-page assets, from practical guides and meal plans to self-development material and recipe collections.</p></div><div class="ebook-grid"><article class="ebook-card"><div class="ebook-cover fastmate" aria-label="Cover-inspired preview for Your Personal Meal Plan"><span class="ebook-brand">FastMate</span><strong>Your Personal<br>Meal Plan</strong><small>30 days · balanced diet for sustainable weight loss</small></div><div class="ebook-copy"><p class="ebook-meta">FastMate · Nutrition guide</p><h3>30 Days Meal Plan To a Slimmer You</h3><p>A 61-page meal-planning eBook built around a 30-day plan, including vegetarian, vegan, and low-carb options alongside nutrition and intermittent-fasting guidance.</p><div class="ebook-facts"><span>61 pages</span><span>Meal planning</span><span>Long-form guide</span></div></div></article><article class="ebook-card"><div class="ebook-cover fifth-warm" aria-label="Cover-inspired preview for Loving Yourself"><span class="ebook-brand">The Fifth Element Life</span><strong>Loving<br>Yourself</strong><small>physical · intellectual · emotional · spiritual</small></div><div class="ebook-copy"><p class="ebook-meta">The Fifth Element Life · Self-development</p><h3>Loving Yourself</h3><p>A 38-page eBook organized around physical, intellectual, emotional, and spiritual self-care, with practical guidance across each area.</p><a class="ebook-source" href="https://fifthelementlife.com/blogs/blog/how-to-love-yourself" target="_blank" rel="noopener">See client page ↗</a><div class="ebook-facts"><span>38 pages</span><span>Self-development</span><span>Long-form guide</span></div></div></article><article class="ebook-card"><div class="ebook-cover fifth-night" aria-label="Cover-inspired preview for Live the Best Year of Your Life"><span class="ebook-brand">The Fifth Element Life</span><strong>Live the Best<br>Year of Your Life</strong><small>reflection · balance · goals · follow-through</small></div><div class="ebook-copy"><p class="ebook-meta">The Fifth Element Life · Self-development</p><h3>Live the Best Year of Your Life</h3><p>A 50-page guide covering reflection, balance, goal-setting, resources, obstacles, and the practical work of following through.</p><div class="ebook-facts"><span>50 pages</span><span>Goal-setting</span><span>Long-form guide</span></div></div></article><article class="ebook-card"><div class="ebook-cover soupchick" aria-label="Cover-inspired preview for Weight Loss Soup and Broth Recipes"><span class="ebook-brand">SoupChick</span><strong>Weight Loss<br>Soup & Broth Recipes</strong><small>22 soup and broth recipes</small></div><div class="ebook-copy"><p class="ebook-meta">SoupChick · Recipe eBook</p><h3>Weight Loss Soup & Broth Recipes</h3><p>A 26-page recipe eBook bringing 22 weight-loss soup and broth recipes into one structured, easy-to-use collection.</p><a class="ebook-source" href="https://soupchick.com/" target="_blank" rel="noopener">See client site ↗</a><div class="ebook-facts"><span>26 pages</span><span>22 recipes</span><span>Recipe collection</span></div></div></article></div></div>`;other.parentNode.insertBefore(section,other);}}document.querySelectorAll('.filterable-work').forEach(group=>{const filters=[...group.querySelectorAll('.work-filter')],cards=[...group.querySelectorAll('.visual-work-card')];if(!filters.length||!cards.length)return;filters.forEach(filter=>filter.addEventListener('click',()=>{const value=filter.dataset.filter;filters.forEach(button=>button.classList.toggle('is-active',button===filter));cards.forEach(card=>{card.hidden=value!=='all'&&card.dataset.category!==value;});}));});});
/* homepage brand marquee motion */
document.addEventListener('DOMContentLoaded',()=>{
  const strip=document.querySelector('.brand-strip .wordmark-strip');
  if(!strip||strip.dataset.motionReady==='true')return;
  strip.dataset.motionReady='true';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const original=[...strip.querySelectorAll(':scope > .wordmark')];
  if(!original.length)return;
  const track=document.createElement('div');
  track.className='wordmark-track';
  const group=document.createElement('div');
  group.className='wordmark-group';
  original.forEach(item=>group.appendChild(item));
  track.appendChild(group);
  for(let i=0;i<2;i++){
    const clone=group.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.querySelectorAll('*').forEach(el=>el.setAttribute('aria-hidden','true'));
    track.appendChild(clone);
  }
  strip.appendChild(track);
  strip.classList.add('is-marquee');
  if(reduced.matches)return;
  let offset=0;
  let velocity=-18;
  let impulse=0;
  let lastTime=performance.now();
  let lastScroll=window.scrollY;
  let groupWidth=group.getBoundingClientRect().width;
  let hovering=false;
  let visible=true;
  const refreshWidth=()=>{groupWidth=group.getBoundingClientRect().width||groupWidth;};
  const onScroll=()=>{
    const y=window.scrollY;
    if(!visible){lastScroll=y;return;}
    const delta=y-lastScroll;
    lastScroll=y;
    impulse=Math.max(-150,Math.min(150,impulse-delta*1.7));
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',refreshWidth,{passive:true});
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    strip.addEventListener('pointerenter',()=>{hovering=true;});
    strip.addEventListener('pointerleave',()=>{hovering=false;});
  }
  let rafId=0;
  let waitingForBoring=false;
  const stopFrame=()=>{
    if(rafId){cancelAnimationFrame(rafId);rafId=0;}
  };
  const scheduleFrame=()=>{
    if(!rafId&&visible&&!document.documentElement.classList.contains('boring-mode'))rafId=requestAnimationFrame(frame);
  };
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const nextVisible=entries[0]?.isIntersecting??true;
      if(nextVisible===visible)return;
      visible=nextVisible;
      if(!visible){stopFrame();return;}
      lastTime=performance.now();
      scheduleFrame();
    },{threshold:0});
    observer.observe(strip);
  }
  const frame=(now)=>{
    rafId=0;
    if(document.documentElement.classList.contains('boring-mode')){
      offset=0;
      velocity=-18;
      impulse=0;
      track.style.transform='translate3d(0,0,0)';
      if(!waitingForBoring){
        waitingForBoring=true;
        const resume=event=>{
          if(event.detail?.boring)return;
          waitingForBoring=false;
          window.removeEventListener('portfolio:boringchange',resume);
          lastTime=performance.now();
          scheduleFrame();
        };
        window.addEventListener('portfolio:boringchange',resume);
      }
      return;
    }
    if(!visible)return;
    const dt=Math.min(.05,(now-lastTime)/1000);
    lastTime=now;
    if(groupWidth>0){
      impulse*=Math.exp(-4.2*dt);
      const resting=hovering?-1.5:-18;
      const target=resting+impulse;
      velocity+=(target-velocity)*Math.min(1,6*dt);
      offset+=velocity*dt;
      while(offset<=-groupWidth)offset+=groupWidth;
      while(offset>0)offset-=groupWidth;
      track.style.transform=`translate3d(${offset.toFixed(2)}px,0,0)`;
    }
    scheduleFrame();
  };
  scheduleFrame();
});
/* homepage workflow with opinions */
document.addEventListener('DOMContentLoaded',()=>{
  const map=document.querySelector('.story-hero ~ .brand-strip ~ .section + .section-soft .mini-map')||document.querySelector('.teaser-split .mini-map');
  const svg=map?.querySelector('svg');
  if(!map||!svg||map.dataset.workflowReady==='true')return;
  map.dataset.workflowReady='true';

  const rects=[...svg.querySelectorAll('g:first-of-type rect')];
  const texts=[...svg.querySelectorAll('g:first-of-type text')];
  if(rects.length<6||texts.length<6)return;

  const messages=[
    'First question: what are we actually selling?',
    'Someone has to read this. Ideally the right someone.',
    'Now we find what everyone else missed.',
    'Still not writing yet. I know.',
    'Nice try. Research first.',
    'Published? Cool. We’re not done.'
  ];

  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const note=document.createElement('p');
  note.className='workflow-whisper';
  note.setAttribute('aria-live','polite');
  note.textContent=finePointer?'Hover a step. It has opinions.':'Tap a step. It has opinions.';
  map.appendChild(note);

  const style=document.createElement('style');
  style.textContent=`
    .mini-map .workflow-whisper{min-height:1.5em;margin:4px 0 0;color:var(--sage);font-size:.65rem;font-weight:600;letter-spacing:.01em;transition:opacity .16s ease,transform .16s ease}
    .mini-map .workflow-whisper.is-speaking{color:var(--ink);transform:translateX(3px)}
    .mini-map svg .workflow-node-hit{transform-box:fill-box;transform-origin:center;transition:transform .2s cubic-bezier(.2,.8,.2,1),fill .2s ease,stroke .2s ease}
    .mini-map svg rect.workflow-node-hit{cursor:help}
    .mini-map svg text.workflow-node-hit{pointer-events:auto;cursor:help}
    .mini-map svg rect.workflow-node-hit.is-active{fill:#e6ece7!important;stroke:#687b70!important;transform:translateY(-3px)}
    .mini-map svg text.workflow-node-hit.is-active{transform:translateY(-3px)}
    .mini-map svg rect.workflow-node-hit.is-nope{transform:translate(-7px,-2px) rotate(-1deg)}
    .mini-map svg text.workflow-node-hit.is-nope{transform:translate(-7px,-2px) rotate(-1deg)}
    @media(prefers-reduced-motion:reduce){.mini-map svg .workflow-node-hit,.mini-map .workflow-whisper{transition:none!important;transform:none!important}}
  `;
  document.head.appendChild(style);

  let resetTimer=0;
  let touchTimer=0;
  const hint=note.textContent;

  const clear=()=>{
    rects.forEach(el=>el.classList.remove('is-active','is-nope'));
    texts.forEach(el=>el.classList.remove('is-active','is-nope'));
    note.classList.remove('is-speaking');
    note.textContent=hint;
  };

  const activate=index=>{
    window.clearTimeout(resetTimer);
    window.clearTimeout(touchTimer);
    rects.forEach((el,i)=>{
      el.classList.toggle('is-active',i===index);
      el.classList.toggle('is-nope',i===index&&index===4);
    });
    texts.forEach((el,i)=>{
      el.classList.toggle('is-active',i===index);
      el.classList.toggle('is-nope',i===index&&index===4);
    });
    note.textContent=messages[index];
    note.classList.add('is-speaking');
  };

  rects.forEach((rect,index)=>{
    const text=texts[index];
    rect.classList.add('workflow-node-hit');
    text.classList.add('workflow-node-hit');
    [rect,text].forEach(el=>{
      el.addEventListener('pointerenter',()=>{if(finePointer)activate(index);});
      el.addEventListener('pointerleave',()=>{if(finePointer)resetTimer=window.setTimeout(clear,90);});
      el.addEventListener('pointerdown',()=>{
        if(finePointer)return;
        activate(index);
        touchTimer=window.setTimeout(clear,1900);
      },{passive:true});
    });
  });
});

/* work library self-scrolling previews */
document.addEventListener('DOMContentLoaded',()=>{
  if(location.pathname!=='/work.html'&&location.pathname!=='/work')return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const frames=[...document.querySelectorAll('.visual-work-card .page-scroll-frame.page-scroll-tiles')];
  if(!frames.length)return;

  frames.forEach(frame=>{if(!frame.hasAttribute('tabindex'))frame.tabIndex=0;});
  if(reduced||!finePointer)return;

  const style=document.createElement('style');
  style.textContent=`
    .work-preview-shell{position:relative}
    .work-preview-hint{position:absolute;right:8px;bottom:8px;z-index:4;padding:4px 6px;border:1px solid rgba(28,28,28,.18);background:rgba(242,239,233,.94);color:var(--ink);font-size:.52rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;pointer-events:none;transition:opacity .16s ease,transform .16s ease}
    .work-preview-shell.is-touring .work-preview-hint,.work-preview-shell.is-manual .work-preview-hint{opacity:0;transform:translateY(4px)}
    .page-scroll-frame.is-auto-touring{scrollbar-color:var(--sage) var(--surface)}
    @media(prefers-reduced-motion:reduce){.work-preview-hint{display:none!important}}
  `;
  document.head.appendChild(style);

  const states=new WeakMap();
  const easeOut=t=>1-Math.pow(1-t,3);

  const cancel=frame=>{
    const state=states.get(frame);
    if(state?.raf){cancelAnimationFrame(state.raf);state.raf=0;}
  };

  const eagerLoad=frame=>{
    frame.querySelectorAll('img[loading="lazy"]').forEach(img=>{img.loading='eager';});
  };

  const returnTop=frame=>{
    const state=states.get(frame);
    cancel(frame);
    if(!state||frame.scrollTop<=0){frame.scrollTop=0;return;}
    const start=frame.scrollTop;
    const duration=Math.max(520,Math.min(1250,420+start*.12));
    const begun=performance.now();
    const tick=now=>{
      const live=states.get(frame);
      if(!live||live.hovering)return;
      const t=Math.min(1,(now-begun)/duration);
      frame.scrollTop=Math.round(start*(1-easeOut(t)));
      if(t<1){live.raf=requestAnimationFrame(tick);}else{live.raf=0;frame.scrollTop=0;}
    };
    state.raf=requestAnimationFrame(tick);
  };

  const startTour=frame=>{
    const state=states.get(frame);
    if(!state||state.manual)return;
    cancel(frame);
    eagerLoad(frame);
    frame.classList.add('is-auto-touring');
    state.shell.classList.add('is-touring');
    let last=performance.now();
    const tick=now=>{
      const live=states.get(frame);
      if(!live||!live.hovering||live.manual){frame.classList.remove('is-auto-touring');return;}
      const dt=Math.min(.04,Math.max(.001,(now-last)/1000));
      last=now;
      const target=Math.max(0,frame.scrollHeight-frame.clientHeight);
      const distance=Math.max(0,target-frame.scrollTop);
      if(distance<=1){live.raf=0;frame.scrollTop=target;frame.classList.remove('is-auto-touring');return;}
      const total=Math.max(1,target);
      const speed=Math.max(420,Math.min(980,total/8.2));
      frame.scrollTop=Math.min(target,frame.scrollTop+speed*dt);
      live.raf=requestAnimationFrame(tick);
    };
    state.raf=requestAnimationFrame(tick);
  };

  frames.forEach(frame=>{
    if(frame.dataset.autoPreviewReady==='true')return;
    frame.dataset.autoPreviewReady='true';
    const shell=document.createElement('div');
    shell.className='work-preview-shell';
    frame.parentNode.insertBefore(shell,frame);
    shell.appendChild(frame);
    const hint=document.createElement('span');
    hint.className='work-preview-hint';
    hint.setAttribute('aria-hidden','true');
    hint.textContent='hover to preview ↓';
    shell.appendChild(hint);

    const state={raf:0,hovering:false,manual:false,shell};
    states.set(frame,state);

    const takeManual=()=>{
      if(!state.hovering)return;
      state.manual=true;
      cancel(frame);
      frame.classList.remove('is-auto-touring');
      shell.classList.remove('is-touring');
      shell.classList.add('is-manual');
    };

    frame.addEventListener('pointerenter',()=>{
      state.hovering=true;
      state.manual=false;
      shell.classList.remove('is-manual');
      startTour(frame);
    });
    frame.addEventListener('pointerleave',()=>{
      state.hovering=false;
      state.manual=false;
      cancel(frame);
      frame.classList.remove('is-auto-touring');
      shell.classList.remove('is-touring','is-manual');
      returnTop(frame);
    });
    frame.addEventListener('wheel',takeManual,{passive:true});
    frame.addEventListener('pointerdown',takeManual,{passive:true});
    frame.addEventListener('keydown',takeManual);
  });
});
