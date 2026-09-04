document.addEventListener('DOMContentLoaded',()=>{
  const copy=document.querySelector('.teaser-split > div:first-child');
  if(!copy||copy.querySelector('.viral-joke'))return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  const wrap=document.createElement('div');
  wrap.className='viral-joke';
  wrap.innerHTML=`<span class="viral-joke-label">One thing I won’t promise</span><div class="viral-joke-stage"><button class="viral-joke-button" type="button">Make it go viral</button><span class="viral-joke-response" aria-live="polite"></span></div>`;
  copy.appendChild(wrap);

  const button=wrap.querySelector('.viral-joke-button');
  const stage=wrap.querySelector('.viral-joke-stage');
  const response=wrap.querySelector('.viral-joke-response');

  const style=document.createElement('style');
  style.textContent=`
    .viral-joke{margin-top:18px;padding-top:12px;border-top:1px solid var(--line)}
    .viral-joke-label{display:block;color:var(--slate);font-size:.64rem;font-weight:600}
    .viral-joke-stage{position:relative;height:96px;max-width:360px;margin-top:7px;overflow:hidden}
    .viral-joke-button{position:absolute;left:0;top:0;appearance:none;border:1px solid var(--ink);background:var(--surface);color:var(--ink);padding:7px 10px;font:700 .68rem Inter,sans-serif;cursor:pointer;white-space:nowrap;transform:translate3d(0,0,0);transition:transform .22s cubic-bezier(.2,.9,.25,1),background .18s ease,color .18s ease,border-color .18s ease}
    .viral-joke-button:hover{background:var(--paper)}
    .viral-joke-button:focus-visible{outline:2px solid var(--sage);outline-offset:3px}
    .viral-joke-button.is-done{background:var(--ink);color:var(--paper);border-color:var(--ink);cursor:default}
    .viral-joke-response{position:absolute;left:0;bottom:0;color:var(--sage);font-size:.61rem;font-weight:600;opacity:0;transform:translateY(3px);transition:opacity .18s ease,transform .18s ease}
    .viral-joke-response.is-visible{opacity:1;transform:none}
    @media(max-width:620px){.viral-joke-stage{max-width:100%}}
    @media(prefers-reduced-motion:reduce){.viral-joke-button,.viral-joke-response{transition:none!important}}
  `;
  document.head.appendChild(style);

  let escapes=0;
  let current={x:0,y:0};
  let done=false;
  let lastDodge=0;
  let surrenderTimer=0;
  let resetTimer=0;

  const moveTo=point=>{
    current=point;
    button.style.transform=`translate3d(${point.x.toFixed(1)}px,${point.y.toFixed(1)}px,0)`;
  };

  const surrender=()=>{
    if(done)return;
    done=true;
    window.clearTimeout(resetTimer);
    window.clearTimeout(surrenderTimer);
    moveTo({x:0,y:0});
    button.classList.add('is-done');
    button.textContent='Okay. Strategy first.';
    response.textContent='Much better.';
    response.classList.add('is-visible');
  };

  const reset=()=>{
    if(done)return;
    window.clearTimeout(surrenderTimer);
    escapes=0;
    moveTo({x:0,y:0});
    response.textContent='';
    response.classList.remove('is-visible');
  };

  const getCandidates=()=>{
    const maxX=Math.max(0,stage.clientWidth-button.offsetWidth);
    const maxY=Math.max(0,stage.clientHeight-button.offsetHeight-20);
    const xs=[0,maxX*.5,maxX];
    const ys=[0,maxY*.55,maxY];
    const points=[];
    xs.forEach(x=>ys.forEach(y=>{
      if(Math.abs(x-current.x)>10||Math.abs(y-current.y)>8)points.push({x,y});
    }));
    return points;
  };

  const dodge=(clientX,clientY)=>{
    if(done)return;
    if(reduced)return surrender();
    const now=performance.now();
    if(now-lastDodge<180)return;

    const stageRect=stage.getBoundingClientRect();
    const px=clientX-stageRect.left;
    const py=clientY-stageRect.top;
    const candidates=getCandidates();
    if(!candidates.length)return surrender();

    candidates.sort((a,b)=>{
      const da=Math.hypot(a.x+button.offsetWidth/2-px,a.y+button.offsetHeight/2-py);
      const db=Math.hypot(b.x+button.offsetWidth/2-px,b.y+button.offsetHeight/2-py);
      return db-da;
    });

    lastDodge=now;
    moveTo(candidates[0]);
    escapes+=1;

    if(escapes===1){
      response.textContent='Nope.';
      response.classList.add('is-visible');
    }else if(escapes===2){
      response.textContent='Still nope.';
    }

    if(escapes>=3){
      window.clearTimeout(surrenderTimer);
      surrenderTimer=window.setTimeout(surrender,360);
    }
  };

  if(finePointer&&!reduced){
    stage.addEventListener('pointermove',e=>{
      if(done)return;
      const rect=button.getBoundingClientRect();
      const nearestX=Math.max(rect.left,Math.min(e.clientX,rect.right));
      const nearestY=Math.max(rect.top,Math.min(e.clientY,rect.bottom));
      const distance=Math.hypot(e.clientX-nearestX,e.clientY-nearestY);
      if(distance<42)dodge(e.clientX,e.clientY);
    },{passive:true});

    stage.addEventListener('pointerleave',()=>{
      if(done)return;
      window.clearTimeout(resetTimer);
      resetTimer=window.setTimeout(reset,700);
    });
  }else{
    button.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse')return;
      if(escapes<2)dodge(e.clientX,e.clientY);else surrender();
    },{passive:true});
  }

  button.addEventListener('click',()=>{
    if(!finePointer||reduced||escapes>=3)surrender();
  });
});
