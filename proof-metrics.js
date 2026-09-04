/* homepage living proof metrics */
document.addEventListener('DOMContentLoaded',()=>{
  const row=document.querySelector('.hero-proof');
  if(!row||row.dataset.metricsReady==='true')return;
  row.dataset.metricsReady='true';

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const strongs=[...row.querySelectorAll('strong')];
  if(strongs.length<2)return;

  const configs=[
    {el:strongs[0],start:29,end:3842,prefix:'',duration:1750,label:'DigitalAPI Organic Search sessions increased from 29 to 3,842'},
    {el:strongs[1],start:0,end:2500,prefix:'~',duration:1500,label:'Learniverse monthly organic visits increased from 0 to approximately 2,500'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .hero-proof strong.proof-live{--proof-progress:1;position:relative;display:flex;align-items:baseline;gap:.18em;width:max-content;max-width:100%;padding-bottom:5px;font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1;transition:opacity .18s ease,transform .18s ease}
    .hero-proof strong.proof-live::after{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;background:var(--sand);transform:scaleX(var(--proof-progress));transform-origin:left center;opacity:.62;will-change:transform}
    .proof-live-start,.proof-live-arrow,.proof-live-number{display:inline-block!important;margin:0!important;color:inherit!important;font:inherit!important;line-height:inherit!important}
    .proof-live-arrow{color:var(--sage)!important}
    .proof-live-number{min-width:5.2ch}
    .hero-proof strong.proof-live.is-resetting{opacity:.38;transform:translateY(2px)}
    @media(max-width:520px){.proof-live-number{min-width:4.8ch}}
  `;
  document.head.appendChild(style);

  const fmt=value=>Math.round(value).toLocaleString('en-US');

  configs.forEach(cfg=>{
    cfg.el.classList.add('proof-live');
    cfg.el.setAttribute('aria-label',cfg.label);

    const start=document.createElement('span');
    start.className='proof-live-start';
    start.setAttribute('aria-hidden','true');
    start.textContent=fmt(cfg.start);

    const arrow=document.createElement('span');
    arrow.className='proof-live-arrow';
    arrow.setAttribute('aria-hidden','true');
    arrow.textContent='→';

    const number=document.createElement('span');
    number.className='proof-live-number';
    number.setAttribute('aria-hidden','true');
    number.textContent=`${cfg.prefix}${fmt(cfg.end)}`;

    cfg.el.replaceChildren(start,arrow,number);
    cfg.number=number;
  });

  let visible=false;
  let cycleToken=0;
  const timers=new Set();
  const frames=new Set();

  const later=(fn,ms)=>{
    const id=window.setTimeout(()=>{timers.delete(id);fn();},ms);
    timers.add(id);
    return id;
  };

  const cancelWork=()=>{
    cycleToken+=1;
    timers.forEach(id=>window.clearTimeout(id));
    timers.clear();
    frames.forEach(id=>window.cancelAnimationFrame(id));
    frames.clear();
  };

  const setValue=(cfg,value,progress)=>{
    cfg.number.textContent=`${cfg.prefix}${fmt(value)}`;
    cfg.el.style.setProperty('--proof-progress',String(progress));
  };

  const setFinal=()=>{
    configs.forEach(cfg=>{
      cfg.el.classList.remove('is-resetting');
      setValue(cfg,cfg.end,1);
    });
  };

  const animate=(cfg,delay,token)=>{
    later(()=>{
      if(!visible||document.hidden||token!==cycleToken)return;
      const started=performance.now();
      const tick=now=>{
        if(!visible||document.hidden||token!==cycleToken)return;
        const raw=Math.min(1,(now-started)/cfg.duration);
        const eased=1-Math.pow(1-raw,4);
        setValue(cfg,cfg.start+(cfg.end-cfg.start)*eased,eased);
        if(raw<1){
          const id=requestAnimationFrame(tick);
          frames.add(id);
        }else{
          setValue(cfg,cfg.end,1);
        }
      };
      const id=requestAnimationFrame(tick);
      frames.add(id);
    },delay);
  };

  const runCycle=()=>{
    if(!visible||document.hidden)return;
    const token=++cycleToken;

    configs.forEach(cfg=>cfg.el.classList.add('is-resetting'));
    later(()=>{
      if(token!==cycleToken||!visible)return;
      configs.forEach(cfg=>setValue(cfg,cfg.start,0));
    },170);
    later(()=>{
      if(token!==cycleToken||!visible)return;
      configs.forEach(cfg=>cfg.el.classList.remove('is-resetting'));
      animate(configs[0],0,token);
      animate(configs[1],260,token);
    },360);

    later(()=>{
      if(token===cycleToken&&visible&&!document.hidden)runCycle();
    },9600);
  };

  const setVisible=value=>{
    if(value===visible)return;
    visible=value;
    cancelWork();
    if(visible&&!document.hidden){
      setFinal();
      later(runCycle,520);
    }else{
      setFinal();
    }
  };

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const entry=entries[0];
      setVisible(Boolean(entry&&entry.isIntersecting&&entry.intersectionRatio>=.45));
    },{threshold:[0,.45,1]});
    observer.observe(row);
  }else{
    setVisible(true);
  }

  document.addEventListener('visibilitychange',()=>{
    cancelWork();
    if(document.hidden){
      setFinal();
    }else if(visible){
      setFinal();
      later(runCycle,500);
    }
  });
});
