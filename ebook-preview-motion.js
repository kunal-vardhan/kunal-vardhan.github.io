document.addEventListener('DOMContentLoaded',()=>{
  if(location.pathname!=='/work.html'&&location.pathname!=='/work')return;
  const frames=[...document.querySelectorAll('.ebook-scroll-frame')];
  if(!frames.length)return;

  frames.forEach(frame=>{if(!frame.hasAttribute('tabindex'))frame.tabIndex=0;});

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(reduced||!finePointer)return;

  const states=new WeakMap();
  const easeOut=t=>1-Math.pow(1-t,3);

  const cancel=frame=>{
    const state=states.get(frame);
    if(state?.raf){cancelAnimationFrame(state.raf);state.raf=0;}
  };

  const loadAhead=frame=>{
    const threshold=frame.scrollTop+frame.clientHeight*3;
    frame.querySelectorAll('img[loading="lazy"]').forEach(img=>{
      if(img.offsetTop<threshold)img.loading='eager';
    });
  };

  const returnTop=frame=>{
    const state=states.get(frame);
    cancel(frame);
    if(!state||frame.scrollTop<=0){frame.scrollTop=0;return;}
    const start=frame.scrollTop;
    const duration=Math.max(700,Math.min(1800,560+start*.04));
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
    loadAhead(frame);
    state.shell.classList.add('is-touring');
    let last=performance.now();
    let lastLoadCheck=0;
    const tick=now=>{
      const live=states.get(frame);
      if(!live||!live.hovering||live.manual)return;
      const dt=Math.min(.04,Math.max(.001,(now-last)/1000));
      last=now;
      const target=Math.max(0,frame.scrollHeight-frame.clientHeight);
      const distance=Math.max(0,target-frame.scrollTop);
      if(distance<=1){live.raf=0;frame.scrollTop=target;return;}
      if(now-lastLoadCheck>280){loadAhead(frame);lastLoadCheck=now;}
      const total=Math.max(1,target);
      const speed=Math.max(260,Math.min(620,total/48));
      frame.scrollTop=Math.min(target,frame.scrollTop+speed*dt);
      live.raf=requestAnimationFrame(tick);
    };
    state.raf=requestAnimationFrame(tick);
  };

  frames.forEach(frame=>{
    if(frame.dataset.ebookAutoPreviewReady==='true')return;
    frame.dataset.ebookAutoPreviewReady='true';

    const shell=document.createElement('div');
    shell.className='work-preview-shell ebook-preview-shell';
    frame.parentNode.insertBefore(shell,frame);
    shell.appendChild(frame);

    const hint=document.createElement('span');
    hint.className='work-preview-hint';
    hint.setAttribute('aria-hidden','true');
    hint.textContent='hover to browse ↓';
    shell.appendChild(hint);

    const state={raf:0,hovering:false,manual:false,shell};
    states.set(frame,state);

    const takeManual=()=>{
      if(!state.hovering)return;
      state.manual=true;
      cancel(frame);
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
      shell.classList.remove('is-touring','is-manual');
      returnTop(frame);
    });

    frame.addEventListener('wheel',takeManual,{passive:true});
    frame.addEventListener('pointerdown',takeManual,{passive:true});
    frame.addEventListener('keydown',takeManual);
  });
});
