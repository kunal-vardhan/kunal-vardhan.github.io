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
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;},{threshold:0});
    observer.observe(strip);
  }
  const frame=(now)=>{
    const dt=Math.min(.05,(now-lastTime)/1000);
    lastTime=now;
    if(visible&&groupWidth>0){
      impulse*=Math.exp(-4.2*dt);
      const resting=hovering?-1.5:-18;
      const target=resting+impulse;
      velocity+=(target-velocity)*Math.min(1,6*dt);
      offset+=velocity*dt;
      while(offset<=-groupWidth)offset+=groupWidth;
      while(offset>0)offset-=groupWidth;
      track.style.transform=`translate3d(${offset.toFixed(2)}px,0,0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});
