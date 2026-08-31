/* Portfolio interaction, slider, recommendation, and v7 enhancement layer */

if (!document.querySelector('link[href*="portfolio-v6.css"]')) {
  const v6 = document.createElement('link');
  v6.rel = 'stylesheet';
  v6.href = '/portfolio-v6.css?v=2';
  document.head.appendChild(v6);
}

const isCaseStudy = location.pathname.includes('/case-studies/');
if (isCaseStudy) {
  if (!document.querySelector('link[href*="case-study-v2.css"]')) {
    const caseCss = document.createElement('link');
    caseCss.rel = 'stylesheet';
    caseCss.href = '/case-study-v2.css?v=1';
    document.head.appendChild(caseCss);
  }
  const caseEnhancer = document.createElement('script');
  caseEnhancer.src = '/case-study-enhancements.js?v=2';
  caseEnhancer.defer = true;
  document.body.appendChild(caseEnhancer);
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const brandList = document.querySelector('.brand-proof-list');
if (brandList) {
  ['Investopedia', 'Healthline'].forEach(name => {
    if ([...brandList.querySelectorAll('span')].some(span => span.textContent.trim() === name)) return;
    const span = document.createElement('span');
    span.textContent = name;
    brandList.appendChild(span);
  });
}

const homepageCaseCards = document.querySelectorAll('main > #case-studies .case-card');
homepageCaseCards.forEach(card => {
  const link = card.querySelector('a.text-link[href]');
  if (!link) return;
  card.classList.add('case-card-clickable');
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  const open = () => { window.location.href = link.href; };
  card.addEventListener('click', event => {
    if (event.target.closest('a,button')) return;
    open();
  });
  card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    open();
  });
});

if (document.querySelector('#strategy-samples')) {
  const strategyScript = document.createElement('script');
  strategyScript.src = '/strategy-workbook.js?v=3';
  strategyScript.defer = true;
  document.body.appendChild(strategyScript);
}

function buildSlider(track, options = {}) {
  if (!track || track.dataset.sliderReady === 'true') return;
  track.dataset.sliderReady = 'true';
  track.classList.add('motion-slider-track');
  const shell = document.createElement('div');
  shell.className = `motion-slider-shell ${options.className || ''}`.trim();
  track.parentNode.insertBefore(shell, track);
  shell.appendChild(track);
  const controls = document.createElement('div');
  controls.className = 'motion-slider-controls';
  controls.innerHTML = `<div class="motion-slider-status"><span class="motion-slider-current">01</span><i></i><span class="motion-slider-total">${String(track.children.length).padStart(2, '0')}</span></div><div class="motion-slider-buttons"><button class="motion-slider-btn motion-slider-prev" type="button" aria-label="Previous ${options.label || 'item'}">←</button><button class="motion-slider-btn motion-slider-next" type="button" aria-label="Next ${options.label || 'item'}">→</button></div>`;
  shell.appendChild(controls);
  const cards = [...track.children];
  cards.forEach((card, index) => {
    card.classList.add('motion-slide');
    card.style.setProperty('--slide-index', index);
    card.setAttribute('data-slide-index', String(index));
  });
  const prev = controls.querySelector('.motion-slider-prev');
  const next = controls.querySelector('.motion-slider-next');
  const current = controls.querySelector('.motion-slider-current');
  const cardStep = () => {
    const first = cards[0];
    if (!first) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return first.getBoundingClientRect().width + gap;
  };
  const updateStatus = () => {
    if (!cards.length) return;
    const trackRect = track.getBoundingClientRect();
    let closest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const d = Math.abs(cardRect.left - trackRect.left);
      if (d < distance) { distance = d; closest = index; }
    });
    current.textContent = String(closest + 1).padStart(2, '0');
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  const moveByCard = direction => track.scrollBy({ left: direction * cardStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => moveByCard(-1));
  next.addEventListener('click', () => moveByCard(1));
  track.addEventListener('scroll', () => requestAnimationFrame(updateStatus), { passive: true });
  window.addEventListener('resize', updateStatus, { passive: true });
  let wheelLocked = false;
  track.addEventListener('wheel', event => {
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(delta) < 2) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 1) return;
    const direction = delta > 0 ? 1 : -1;
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft >= maxScroll - 4;
    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) return;
    event.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    moveByCard(direction);
    window.setTimeout(() => { wheelLocked = false; updateStatus(); }, reduceMotion ? 80 : 420);
  }, { passive: false });
  let pointerDown = false, startX = 0, startScroll = 0;
  track.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.target.closest('a,button')) return;
    pointerDown = true; startX = event.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-dragging'); track.setPointerCapture?.(event.pointerId);
  });
  track.addEventListener('pointermove', event => { if (pointerDown) track.scrollLeft = startScroll - (event.clientX - startX) * 1.15; });
  const endDrag = event => { if (!pointerDown) return; pointerDown = false; track.classList.remove('is-dragging'); try { track.releasePointerCapture?.(event.pointerId); } catch (_) {} };
  track.addEventListener('pointerup', endDrag); track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', event => { if (pointerDown && event.buttons === 0) endDrag(event); });
  updateStatus();
}

const workTrack = document.querySelector('main > section#work .work-grid');
if (workTrack) buildSlider(workTrack, { className: 'work-slider', label: 'work sample' });

const portfolioReviews = [
  { name: 'Payal Wadhwa', role: 'Client · India', quote: 'If you need someone who actually knows how to build topical authority and make it look good, Kunal is your guy. He doesn’t do fluff, he’s super straightforward to work with, and the quality of his work is just next level. Highly recommend.' },
  { name: 'David R.', role: 'Client · Texas, USA', quote: 'Kunal made our software easy for anyone to understand. It is hard to find a writer who can explain technical things simply, but he did it perfectly. He came up with a great plan for our blog, and the writing was excellent. I highly recommend him.' },
  { name: 'Jovielyn', role: 'Client · Spokane, United States', quote: 'Kunal did a great job on this project. I really appreciated the hard work and effort he put into getting it done. Job well done, and thank you again for your service.' },
  { name: 'Sarah M.', role: 'Client · California, USA', quote: 'Working with Kunal was so easy. He writes clearly and really understands how to talk to other businesses. We didn’t have to spend hours explaining what our company does. He just got it right away and delivered exactly what we needed.' },
  { name: 'Zachary Hangoc', role: 'Founder, Learniverse · Canada', quote: 'Kunal was a great freelancer to work with. He was diligent, cooperative, and brought a good attitude to the project. The work was solid, and I highly recommend him.' },
  { name: 'Marcus T.', role: 'Client · London, UK', quote: 'Kunal writes articles that people actually want to read. Our team even uses his posts to help answer customer questions. He is a true professional who knows how to make a company look smart and trustworthy online.' },
  { name: 'Elena S.', role: 'Client · Berlin, Germany', quote: 'Instead of just waiting for us to tell him what to do, Kunal stepped in and gave us a real plan for our website. His writing is clean and natural, not robotic at all. He has been a huge help to our business.' },
  { name: 'Tom H.', role: 'Client · New York, USA', quote: 'Hiring Kunal was one of the best choices we made this year. He handles our content planning and writing so I don’t have to worry about it. He always delivers great work on time, with no stress or drama.' },
  { name: 'Priya K.', role: 'Client · Maharashtra, India', quote: 'We needed help reaching business leaders, and Kunal knew exactly what to say. He planned out all our articles and wrote them beautifully. He is very talented and easy to communicate with.' },
  { name: 'James W.', role: 'Client · Florida, USA', quote: 'Kunal completely turned our blog around. He figured out exactly who our customers are and started writing articles that speak right to them. Everything he writes is top quality.' }
];

function renderRecommendations() {
  if (!portfolioReviews.length) return;
  const workSection = document.querySelector('main > section#work');
  const aboutSection = document.querySelector('main > section#about');
  if (!workSection || !aboutSection) return;
  const section = document.createElement('section');
  section.className = 'section alt-section recommendations-section';
  section.id = 'recommendations';
  section.innerHTML = `<div class="container"><div class="section-heading split-heading"><div><p class="eyebrow">Recommendations</p><h2>What people say after working with me.</h2></div><p>Feedback from clients I’ve worked with across content strategy, writing, and organic growth.</p></div><div class="recommendations-track"></div></div>`;
  aboutSection.parentNode.insertBefore(section, aboutSection);
  const track = section.querySelector('.recommendations-track');
  portfolioReviews.forEach(review => {
    const article = document.createElement('article');
    article.className = 'recommendation-card';
    article.innerHTML = `<div class="recommendation-quote">“</div><blockquote>${review.quote}</blockquote><div class="recommendation-person"><strong>${review.name}</strong><span>${review.role || ''}</span></div>`;
    track.appendChild(article);
  });
  buildSlider(track, { className: 'recommendations-slider', label: 'recommendation' });
  if (nav && !nav.querySelector('a[href="#recommendations"]')) {
    const workLink = nav.querySelector('a[href="#work"]');
    const link = document.createElement('a'); link.href = '#recommendations'; link.textContent = 'Reviews';
    if (workLink) workLink.insertAdjacentElement('afterend', link); else nav.appendChild(link);
  }
}
renderRecommendations();

function setupMotionReveal() {
  if (reduceMotion) return;
  const selectors = ['.hero-copy','.section-heading','.execution-block','.motion-slider-shell','.about-sticky','.about-copy','.contact-box','.case-page-hero .container','.case-prose section','.case-aside','.recommendations-section','.strategy-visual','.actual-workbook'];
  const elements = document.querySelectorAll(selectors.join(','));
  elements.forEach((element, index) => {
    element.classList.add('motion-reveal');
    if (element.matches('.about-copy')) element.classList.add('motion-from-right');
    else if (element.matches('.about-sticky,.case-aside')) element.classList.add('motion-from-left');
    else if (element.matches('.motion-slider-shell,.execution-block,.actual-workbook')) element.classList.add('motion-rise-soft');
    element.style.setProperty('--motion-delay', `${Math.min(index % 5, 4) * 70}ms`);
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-motion-visible'); observer.unobserve(entry.target); } }), { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.motion-reveal').forEach(element => observer.observe(element));
}
window.setTimeout(setupMotionReveal, 160);

function setupTilt() {
  if (reduceMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const tiltTargets = document.querySelectorAll('.case-card,.strategy-grid article,.ownership-grid article,.belief-card,.motion-slide,.recommendation-card,.strategy-visual');
  tiltTargets.forEach(card => {
    card.classList.add('motion-tilt');
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect(); const px = (event.clientX - rect.left) / rect.width; const py = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--tilt-x', `${(0.5 - py) * 5}deg`); card.style.setProperty('--tilt-y', `${(px - 0.5) * 6}deg`); card.style.setProperty('--shine-x', `${px * 100}%`); card.style.setProperty('--shine-y', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x','0deg'); card.style.setProperty('--tilt-y','0deg'); });
  });
}
window.setTimeout(setupTilt, 180);

function setupMagneticButtons() {
  if (reduceMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll('.btn,.motion-slider-btn,.brand').forEach(button => {
    button.classList.add('motion-magnetic');
    button.addEventListener('pointermove', event => { const rect = button.getBoundingClientRect(); const x = event.clientX - (rect.left + rect.width/2); const y = event.clientY - (rect.top + rect.height/2); button.style.setProperty('--mag-x', `${x*.14}px`); button.style.setProperty('--mag-y', `${y*.14}px`); });
    button.addEventListener('pointerleave', () => { button.style.setProperty('--mag-x','0px'); button.style.setProperty('--mag-y','0px'); });
  });
}
setupMagneticButtons();

function setupHeroParallax() {
  if (reduceMotion) return;
  const portrait = document.querySelector('.portrait-wrap'); const hero = document.querySelector('.hero'); if (!portrait || !hero) return;
  let ticking = false; const update = () => { const progress = Math.min(Math.max(window.scrollY / Math.max(hero.offsetHeight,1),0),1); portrait.style.setProperty('--hero-shift', `${progress*34}px`); portrait.style.setProperty('--hero-scale', `${1-progress*.035}`); ticking=false; };
  window.addEventListener('scroll', () => { if (ticking) return; ticking=true; requestAnimationFrame(update); }, { passive:true }); update();
}
setupHeroParallax();

if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion) {
  const ring=document.createElement('div'),glow=document.createElement('div'),spotlight=document.createElement('div'); ring.className='cursor-ring'; glow.className='cursor-glow'; spotlight.className='mouse-spotlight'; document.body.append(ring,glow,spotlight);
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,gx=mx,gy=my;
  const tick=()=>{rx+=(mx-rx)*.32;ry+=(my-ry)*.32;gx+=(mx-gx)*.12;gy+=(my-gy)*.12;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;glow.style.transform=`translate3d(${gx}px,${gy}px,0)`;requestAnimationFrame(tick);};requestAnimationFrame(tick);
  document.addEventListener('mousemove',event=>{mx=event.clientX;my=event.clientY;document.documentElement.style.setProperty('--mouse-x',`${mx}px`);document.documentElement.style.setProperty('--mouse-y',`${my}px`);document.body.classList.add('cursor-ready');},{passive:true});
  const interactive='a,button,.case-card,.motion-slide,.strategy-grid article,.ownership-grid article,.belief-card,.about-facts div,.case-page-metrics div,.recommendation-card,.strategy-visual';
  document.addEventListener('mouseover',event=>{if(event.target.closest(interactive))ring.classList.add('is-active');});document.addEventListener('mouseout',event=>{if(event.target.closest(interactive))ring.classList.remove('is-active');});document.addEventListener('mousedown',()=>ring.classList.add('is-pressed'));document.addEventListener('mouseup',()=>ring.classList.remove('is-pressed'));
}
