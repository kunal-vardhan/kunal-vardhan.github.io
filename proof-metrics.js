/* homepage living proof metrics */
document.addEventListener('DOMContentLoaded',()=>{
  const row=document.querySelector('.hero-proof');
  if(!row||row.dataset.metricsReady==='true')return;
  row.dataset.metricsReady='true';

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const isBoring=()=>document.documentElement.classList.contains('boring-mode');
  const strongs=[...row.querySelectorAll('strong')];
  if(strongs.length<3)return;

  const configs=[
    {el:strongs[0],start:29,end:3842,prefix:'',suffix:'',duration:1750,delay:0,showStart:true,label:'DigitalAPI Organic Search sessions increased from 29 to 3,842'},
    {el:strongs[1],start:0,end:2500,prefix:'~',suffix:'',duration:1500,delay:260,showStart:true,label:'Learniverse monthly organic visits increased from 0 to approximately 2,500'},
    {el:strongs[2],start:0,end:5,prefix:'',suffix:' years',duration:1150,delay:520,showStart:false,label:'5 years across full-time and independent content work'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .hero-proof strong.proof-live{position:relative;display:flex;align-items:baseline;gap:.18em;width:max-content;max-width:100%;font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1;transition:opacity .18s ease,transform .18s ease}
    .proof-live-start,.proof-live-arrow,.proof-live-number{display:inline-block!important;margin:0!important;color:inherit!important;font:inherit!important;line-height:inherit!important}
    .proof-live-arrow{color:var(--sage)!important}
    .proof-live-number{min-width:5.2ch}
    .hero-proof strong.proof-live.proof-years .proof-live-number{min-width:6.1ch}
    .hero-proof strong.proof-live.is-resetting{opacity:.38;transform:translateY(2px)}
    html.boring-mode .hero-proof strong.proof-live{opacity:1!important;transform:none!important;transition:none!important}
    @media(max-width:520px){.proof-live-number{min-width:4.8ch}.hero-proof strong.proof-live.proof-years .proof-live-number{min-width:5.8ch}}
  `;
  document.head.appendChild(style);

  const fmt=value=>Math.round(value).toLocaleString('en-US');

  configs.forEach((cfg,index)=>{
    cfg.el.classList.add('proof-live');
    if(index===2)cfg.el.classList.add('proof-years');
    cfg.el.setAttribute('aria-label',cfg.label);

    const parts=[];
    if(cfg.showStart){
      const start=document.createElement('span');
      start.className='proof-live-start';
      start.setAttribute('aria-hidden','true');
      start.textContent=fmt(cfg.start);
      parts.push(start);

      const arrow=document.createElement('span');
      arrow.className='proof-live-arrow';
      arrow.setAttribute('aria-hidden','true');
      arrow.textContent='→';
      parts.push(arrow);
    }

    const number=document.createElement('span');
    number.className='proof-live-number';
    number.setAttribute('aria-hidden','true');
    number.textContent=`${cfg.prefix}${fmt(cfg.end)}${cfg.suffix}`;
    parts.push(number);

    cfg.el.replaceChildren(...parts);
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

  const setValue=(cfg,value)=>{
    cfg.number.textContent=`${cfg.prefix}${fmt(value)}${cfg.suffix}`;
  };

  const setFinal=()=>{
    configs.forEach(cfg=>{
      cfg.el.classList.remove('is-resetting');
      setValue(cfg,cfg.end);
    });
  };

  const animate=(cfg,token)=>{
    later(()=>{
      if(!visible||document.hidden||isBoring()||token!==cycleToken)return;
      const started=performance.now();
      const tick=now=>{
        if(!visible||document.hidden||isBoring()||token!==cycleToken)return;
        const raw=Math.min(1,(now-started)/cfg.duration);
        const eased=1-Math.pow(1-raw,4);
        setValue(cfg,cfg.start+(cfg.end-cfg.start)*eased);
        if(raw<1){
          const id=requestAnimationFrame(tick);
          frames.add(id);
        }else{
          setValue(cfg,cfg.end);
        }
      };
      const id=requestAnimationFrame(tick);
      frames.add(id);
    },cfg.delay);
  };

  const runCycle=()=>{
    if(!visible||document.hidden||isBoring()){
      setFinal();
      return;
    }
    const token=++cycleToken;

    configs.forEach(cfg=>cfg.el.classList.add('is-resetting'));
    later(()=>{
      if(token!==cycleToken||!visible||isBoring())return;
      configs.forEach(cfg=>setValue(cfg,cfg.start));
    },170);
    later(()=>{
      if(token!==cycleToken||!visible||isBoring())return;
      configs.forEach(cfg=>cfg.el.classList.remove('is-resetting'));
      configs.forEach(cfg=>animate(cfg,token));
    },360);

    later(()=>{
      if(token===cycleToken&&visible&&!document.hidden&&!isBoring())runCycle();
    },9600);
  };

  const setVisible=value=>{
    if(value===visible)return;
    visible=value;
    cancelWork();
    setFinal();
    if(visible&&!document.hidden&&!isBoring())later(runCycle,520);
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
    setFinal();
    if(!document.hidden&&visible&&!isBoring())later(runCycle,500);
  });

  window.addEventListener('portfolio:boringchange',event=>{
    cancelWork();
    setFinal();
    if(!event.detail?.boring&&visible&&!document.hidden)later(runCycle,420);
  });
});
