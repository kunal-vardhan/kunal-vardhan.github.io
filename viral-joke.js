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
    .viral-joke-stage{position:relative;height:76px;max-width:360px;margin-top:7px;overflow:visible}
    .viral-joke-button{position:absolute;left:0;top:0;appearance:none;border:1px solid var(--ink);background:var(--surface);color:var(--ink);padding:7px 10px;font:700 .68rem Inter,sans-serif;cursor:pointer;white-space:nowrap;transform:translate3d(0,0,0);transition:transform .24s cubic-bezier(.2,.9,.25,1),background .18s ease,color .18s ease,border-color .18s ease}
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

  const surrender=()=>{
    if(done)return;
    done=true;
    button.classList.add('is-done');
    button.textContent='Okay. Strategy first.';
    response.textContent='Much better.';
    response.classList.add('is-visible');
  };

  const dodge=e=>{
    if(done||reduced)return surrender();
    const stageRect=stage.getBoundingClientRect();
    const buttonRect=button.getBoundingClientRect();
    const maxX=Math.max(0,stageRect.width-buttonRect.width);
    const maxY=Math.max(0,stageRect.height-buttonRect.height-18);
    const px=(e?.clientX??stageRect.left)-stageRect.left;
    const py=(e?.clientY??stageRect.top)-stageRect.top;
    const candidates=[
      {x:0,y:0},
      {x:maxX,y:0},
      {x:0,y:maxY},
      {x:maxX,y:maxY},
      {x:maxX*.5,y:maxY*.55}
    ].filter(p=>Math.abs(p.x-current.x)>8||Math.abs(p.y-current.y)>6);
    candidates.sort((a,b)=>{
      const da=Math.hypot(a.x+buttonRect.width/2-px,a.y+buttonRect.height/2-py);
      const db=Math.hypot(b.x+buttonRect.width/2-px,b.y+buttonRect.height/2-py);
      return db-da;
    });
    current=candidates[0]||current;
    button.style.transform=`translate3d(${current.x.toFixed(1)}px,${current.y.toFixed(1)}px,0)`;
    escapes+=1;
    if(escapes===1){response.textContent='Nope.';response.classList.add('is-visible');}
    if(escapes===2)response.textContent='Still nope.';
    if(escapes>=3)window.setTimeout(surrender,420);
  };

  if(finePointer&&!reduced){
    button.addEventListener('pointerenter',dodge);
  }else{
    button.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse')return;
      if(escapes<2)dodge(e);else surrender();
    },{passive:true});
  }

  button.addEventListener('click',()=>{
    if(!finePointer||reduced||escapes>=3)surrender();
  });
});
