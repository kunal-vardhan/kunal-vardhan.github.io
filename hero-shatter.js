/* homepage hero glass shatter */
(()=>{
  const hero=document.querySelector('.story-hero');
  const h1=hero?.querySelector('h1');
  if(!hero||!h1||h1.dataset.shatterReady==='true')return;
  h1.dataset.shatterReady='true';
  h1.dataset.fractureReady='true';
  const target='hard to explain.';
  const full=h1.textContent||'';
  const start=full.lastIndexOf(target);
  if(start<0)return;

  const phrase=document.createElement('span');
  phrase.className='hero-shatter';
  phrase.dataset.text=target;
  const base=document.createElement('span');
  base.className='hero-shatter-base';
  base.textContent=target;
  phrase.appendChild(base);

  const compact=window.innerWidth<760 ? .58 : 1;
  const shards=[
    ['polygon(0 0,31% 0,27% 42%,0 56%)',-52,-34,-8,1.035,0,'24%','34%'],
    ['polygon(31% 0,64% 0,57% 46%,27% 42%)',14,-48,6,1.02,22,'48%','28%'],
    ['polygon(64% 0,100% 0,100% 38%,57% 46%)',72,-28,8,1.04,10,'70%','30%'],
    ['polygon(0 56%,27% 42%,45% 63%,25% 100%,0 100%)',-64,24,7,1.025,36,'22%','72%'],
    ['polygon(27% 42%,57% 46%,72% 68%,45% 63%)',-8,9,-11,1.08,54,'50%','53%'],
    ['polygon(57% 46%,100% 38%,100% 77%,72% 68%)',82,18,-7,1.03,30,'77%','58%'],
    ['polygon(25% 100%,45% 63%,72% 68%,61% 100%)',-10,47,9,1.025,44,'49%','82%'],
    ['polygon(61% 100%,72% 68%,100% 77%,100% 100%)',56,43,12,1.04,18,'82%','84%']
  ];
  shards.forEach(([clip,dx,dy,rot,scale,delay,ox,oy])=>{
    const shard=document.createElement('span');
    shard.className='hero-shatter-shard';
    shard.textContent=target;
    shard.setAttribute('aria-hidden','true');
    shard.style.setProperty('--clip',clip);
    shard.style.setProperty('--dx',`${dx*compact}px`);
    shard.style.setProperty('--dy',`${dy*compact}px`);
    shard.style.setProperty('--rot',`${rot}deg`);
    shard.style.setProperty('--scale',String(scale));
    shard.style.setProperty('--delay',`${delay}ms`);
    shard.style.setProperty('--ox',ox);
    shard.style.setProperty('--oy',oy);
    phrase.appendChild(shard);
  });

  const impact=document.createElement('span');
  impact.className='hero-shatter-impact';
  impact.setAttribute('aria-hidden','true');
  phrase.appendChild(impact);

  const debris=[
    ['12%','24%','6px','2px',-38,-31,-34,20],
    ['24%','72%','4px','2px',-52,25,41,34],
    ['38%','18%','7px','1px',-12,-43,18,12],
    ['49%','66%','5px','2px',11,38,-47,46],
    ['62%','34%','8px','2px',36,-27,33,26],
    ['73%','76%','4px','2px',48,34,61,38],
    ['84%','22%','6px','1px',59,-36,-22,16],
    ['92%','58%','5px','2px',67,15,49,42]
  ];
  debris.forEach(([left,top,w,h,dx,dy,rot,delay])=>{
    const bit=document.createElement('span');
    bit.className='hero-shatter-debris';
    bit.setAttribute('aria-hidden','true');
    bit.style.setProperty('--left',left);
    bit.style.setProperty('--top',top);
    bit.style.setProperty('--w',w);
    bit.style.setProperty('--h',h);
    bit.style.setProperty('--dx',`${dx*compact}px`);
    bit.style.setProperty('--dy',`${dy*compact}px`);
    bit.style.setProperty('--rot',`${rot}deg`);
    bit.style.setProperty('--delay',`${delay}ms`);
    phrase.appendChild(bit);
  });

  h1.replaceChildren(document.createTextNode(full.slice(0,start)),phrase,document.createTextNode(full.slice(start+target.length)));
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  let visible=false;
  let timer=0;
  let resetTimer=0;
  const clearSchedule=()=>{window.clearTimeout(timer);timer=0;};
  const trigger=()=>{
    if(!visible||phrase.classList.contains('is-shattering'))return;
    phrase.classList.remove('is-shattering');
    void phrase.offsetWidth;
    phrase.classList.add('is-shattering');
    window.clearTimeout(resetTimer);
    resetTimer=window.setTimeout(()=>phrase.classList.remove('is-shattering'),1750);
  };
  const schedule=(delay=4300)=>{
    clearSchedule();
    if(!visible||document.hidden)return;
    timer=window.setTimeout(()=>{trigger();schedule(4800);},delay);
  };
  const setVisible=value=>{
    visible=value;
    if(visible)schedule(1500);
    else{clearSchedule();phrase.classList.remove('is-shattering');}
  };
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.intersectionRatio>=.72),{threshold:[0,.72,1]});
    observer.observe(phrase);
  }else{
    setVisible(true);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearSchedule();else if(visible)schedule(1200);});
  const manual=()=>{if(!visible)return;trigger();schedule(5200);};
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches)phrase.addEventListener('pointerenter',manual);
  phrase.addEventListener('pointerdown',manual,{passive:true});
})();
