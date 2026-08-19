const enhancementStyles=document.createElement('link');enhancementStyles.rel='stylesheet';enhancementStyles.href='/enhancements.css?v=1';document.head.appendChild(enhancementStyles);

const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
if(menuToggle&&nav){menuToggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(isOpen));});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));}

const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

function addResumeButtons(){
  const heroActions=document.querySelector('.hero-actions');
  if(heroActions&&!heroActions.querySelector('.resume-download')){const a=document.createElement('a');a.href='#';a.className='btn btn-secondary resume-download';a.textContent='Download résumé ↓';heroActions.appendChild(a);}
  const contactActions=document.querySelector('.contact-actions');
  if(contactActions&&!contactActions.querySelector('.resume-download')){const a=document.createElement('a');a.href='#';a.className='btn btn-secondary resume-download';a.textContent='Download résumé ↓';contactActions.appendChild(a);}
  const aboutLinks=document.querySelector('.about-links');
  if(aboutLinks&&!aboutLinks.querySelector('.resume-download')){const a=document.createElement('a');a.href='#';a.className='text-link resume-download';a.textContent='Download résumé ↓';aboutLinks.appendChild(a);}
  if(nav&&!nav.querySelector('.resume-nav')){const contact=nav.querySelector('.nav-cta');const a=document.createElement('a');a.href='#';a.className='resume-download resume-nav';a.textContent='Résumé';if(contact)nav.insertBefore(a,contact);else nav.appendChild(a);}
}
addResumeButtons();

function showToast(message){let toast=document.querySelector('.resume-toast');if(!toast){toast=document.createElement('div');toast.className='resume-toast';document.body.appendChild(toast);}toast.textContent=message;requestAnimationFrame(()=>toast.classList.add('show'));clearTimeout(window.__resumeToast);window.__resumeToast=setTimeout(()=>toast.classList.remove('show'),3000);}

function loadJsPdf(){return new Promise((resolve,reject)=>{if(window.jspdf&&window.jspdf.jsPDF)return resolve(window.jspdf.jsPDF);const existing=document.querySelector('script[data-jspdf]');if(existing){existing.addEventListener('load',()=>resolve(window.jspdf.jsPDF),{once:true});existing.addEventListener('error',reject,{once:true});return;}const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';script.async=true;script.dataset.jspdf='true';script.onload=()=>resolve(window.jspdf.jsPDF);script.onerror=reject;document.head.appendChild(script);});}

async function downloadResume(trigger){
  if(trigger)trigger.classList.add('is-loading');
  try{
    const jsPDF=await loadJsPdf();
    const doc=new jsPDF({unit:'pt',format:'a4'});
    const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
    const L=48,R=48,T=48,B=42,C='#171b2f',M='#52576d';
    let y=T;
    const setColor=(hex)=>{const n=parseInt(hex.slice(1),16);doc.setTextColor((n>>16)&255,(n>>8)&255,n&255);};
    const line=(yy)=>{doc.setDrawColor(180,184,196);doc.setLineWidth(.6);doc.line(L,yy,W-R,yy);};
    const pageBreak=(need=28)=>{if(y+need>H-B){doc.addPage();y=T;return true;}return false;};
    const text=(value,size=10,style='normal',color=C,x=L,maxWidth=W-L-R,leading=1.35)=>{pageBreak(size*leading*2);doc.setFont('helvetica',style);doc.setFontSize(size);setColor(color);const lines=doc.splitTextToSize(value,maxWidth);doc.text(lines,x,y);y+=lines.length*size*leading;return lines.length;};
    const section=(title)=>{pageBreak(40);y+=8;doc.setFont('helvetica','bold');doc.setFontSize(10);setColor(C);doc.text(title.toUpperCase().split('').join(' '),L,y);y+=9;line(y);y+=17;};
    const bullet=(value)=>{pageBreak(38);doc.setFont('helvetica','normal');doc.setFontSize(9.5);setColor(C);const width=W-L-R-18;const lines=doc.splitTextToSize(value,width);doc.text('•',L+3,y);doc.text(lines,L+16,y);y+=lines.length*12.7+4;};
    const role=(title,org,location,date,tags)=>{pageBreak(54);doc.setFont('helvetica','bold');doc.setFontSize(10);setColor(C);doc.text(title,L,y);const x2=L+doc.getTextWidth(title)+9;doc.setFont('helvetica','normal');setColor(M);doc.text(`|  ${org}  |  ${location}`,x2,y);doc.setFont('helvetica','italic');doc.setFontSize(8.7);doc.text(date,W-R,y,{align:'right'});y+=14;doc.setFont('helvetica','italic');doc.setFontSize(8.5);doc.text(tags,L,y);y+=15;};

    doc.setFont('helvetica','bold');doc.setFontSize(28);setColor('#101426');doc.text('Kunal Vardhan',L,y);y+=24;
    doc.setFont('helvetica','normal');doc.setFontSize(11.5);setColor(M);doc.text('Content Strategist  |  Content Marketer  |  SEO and Growth',L,y);y+=17;
    doc.setFontSize(8.8);doc.text('+91 78760-74045',L,y);doc.text('kunalvardhan.vk@gmail.com',L+115,y);doc.text('linkedin.com/in/kunal-vardhan',L+285,y);doc.setFont('helvetica','italic');doc.text('Open to Remote',W-R,y,{align:'right'});y+=18;line(y);y+=14;

    section('Profile');
    text('Content strategist and marketer with 4.5 years building SEO-led content programs for B2B SaaS, API platforms, logistics, cybersecurity, and automotive brands. Specializes in topical authority, full-funnel content strategy, and search intent optimization. Has worked across 10 plus client engagements, partnering with founders, product teams, and SMEs to build content that connects organic traffic to pipeline and revenue. Also runs paid campaigns on Meta, Facebook, LinkedIn, and Google Ads alongside organic programs.',9.5,'normal',C,L,W-L-R,1.33);

    section('Skills');
    const skill=(label,value)=>{pageBreak(30);doc.setFont('helvetica','bold');doc.setFontSize(9.5);setColor(C);doc.text(label,L,y);doc.setFont('helvetica','normal');setColor(C);const lines=doc.splitTextToSize(value,W-L-R-105);doc.text(lines,L+105,y);y+=Math.max(15,lines.length*12.3);};
    skill('Strategy','Content Strategy, Content Marketing, Full-Funnel Content, Topical Authority, Content Cluster Planning, Buyer Journey Mapping, Content Audits, Content Calendar Management, Content Operations, Sales Enablement');
    skill('SEO','Search Intent Analysis, Semantic SEO, On-Page SEO, Keyword Research, E-E-A-T, Featured Snippets, AI Search Optimization, GEO, Content Briefs, Internal Linking');
    skill('Growth','Demand Generation, Content Repurposing, Cross-Channel Distribution, Meta Ads, Facebook Ads, LinkedIn Ads, Google Ads, Campaign Setup and Management');
    skill('Analytics','GA4, Google Search Console, Organic Traffic Analysis, Content Performance Tracking');
    skill('Tools','Surfer SEO, Ahrefs, SEMrush, WordPress, Notion, Grammarly, ChatGPT, Claude, Perplexity');

    section('Experience');
    role('Content Marketing Consultant','Self-Employed','Remote','Jan 2025 to Present','B2B SaaS  |  API Platforms  |  Logistics  |  Cybersecurity  |  Travel');
    [
      'Owned end-to-end content strategy for 10 plus B2B and B2C clients, covering keyword research, cluster planning, brief creation, production, and performance review.',
      'Planned quarterly content calendars and topic roadmaps for 4 out of 5 clients based on keyword gaps, search volume, and business priorities.',
      'Built topical authority frameworks and content clusters that improved organic search visibility for clients across SaaS, logistics, and cybersecurity.',
      'Developed BOFU case studies, comparison pages, and landing pages that directly supported enterprise sales conversations and deal movement.',
      'Tracked content performance using GA4 and Google Search Console and identified underperforming content for strategic refreshes.',
      'Ran paid campaigns on Meta, Facebook, LinkedIn, and Google Ads to extend organic reach and support lead generation goals.',
      'Interviewed subject matter experts and domain specialists to build content with genuine technical depth and authority.',
      'Managed content repurposing across LinkedIn posts, email newsletters, and short-form social copy for cross-channel distribution.',
      'Partnered with founders and marketing leads on SEO roadmaps, content strategy, and audience positioning.'
    ].forEach(bullet);

    role('Content Writer','Esferasoft Solutions','Mohali','Sep 2024 to Dec 2024','SaaS  |  Content Strategy  |  Brand Communication  |  Campaign Management');
    [
      'Planned and executed content campaigns across SEO blogs, case studies, and social media to grow brand visibility and search presence.',
      'Developed content strategy and editorial briefs aligned to product positioning and the buyer journey across each campaign.',
      'Produced website copy, UI/UX copy, FAQs, and landing pages that improved how users understood and engaged with the product.',
      'Coordinated with product and marketing teams to align content with go-to-market messaging and launch timelines.',
      'Repurposed long-form content into LinkedIn posts and short-form copy to extend campaign reach beyond organic search.'
    ].forEach(bullet);

    role('Content Writer','Hesper IT Labs','Mohali','Jul 2023 to Aug 2024','Lifestyle  |  Wellness  |  Travel  |  Education  |  Sustainability  |  Food  |  Fashion');
    [
      'Owned content strategy, topic planning, and production across seven verticals, managing briefs and publishing schedules without quality drop.',
      'Built content clusters around search intent and topical depth to grow organic reach across niche audiences in each vertical.',
      'Planned and produced content for sustainable fashion and clothing brands including Wild Cause, covering product storytelling and SEO.',
      'Applied E-E-A-T and expert sourcing across all content to build credibility and maintain search performance across verticals.',
      'Produced wellness, educational, and sustainability content with thorough research for audience relevance and factual accuracy.',
      'Structured every piece with semantic clarity and narrative flow to maximize readability and search performance.'
    ].forEach(bullet);

    role('Content Writer','Paa Creations','Chandigarh','Oct 2021 to Jun 2023','Automotive  |  Insurance  |  Home Appliances  |  Affiliate');
    [
      'Managed content strategy and production across automotive, insurance, and home appliance verticals without compromising quality or output across any of them.',
      'Planned and executed SEO content covering car reviews, model comparisons, spec breakdowns, buying guides, and new model launch coverage.',
      'Built affiliate content programs around automotive accessories, home appliances, and insurance products that supported revenue goals.',
      'Covered homeowners, renters, pet, liability, and automotive insurance topics across dedicated niche blogs with research-backed accuracy.',
      'Wrote email copy and newsletters for automotive product and insurance campaign communications.',
      'Optimized all content for on-page SEO and edited every piece before publishing to maintain quality across every batch.'
    ].forEach(bullet);

    section('Results');
    bullet('Contributed to an API platform growing from 30 to 3,000 plus monthly organic visits in under 5 months. The strategy involved building a topical cluster around core use cases, mapping each piece to a specific search intent stage, and creating pillar pages with strong internal linking. Underperforming content was refreshed regularly to maintain ranking momentum throughout the period.');
    bullet('A single travel article generated 10,000 plus organic views with zero paid promotion. It ranked purely on search intent alignment, semantic structure, and content depth.');
    bullet('Across client and employer projects, content lands on Page 1 with most pieces ranking in the top 1 to 3 positions on commercial and high-intent keywords.');

    section('Education');
    role('MS Biotechnology','Chandigarh University','Mohali','May 2019 to Apr 2021','');
    role('BS Biotechnology','HP University','Shimla','Apr 2016 to Apr 2019','');
    y+=6;doc.setFont('helvetica','bold');doc.setFontSize(9.5);setColor(C);doc.text('Languages',L,y);doc.setFont('helvetica','normal');doc.text('Hindi  |  English',L+60,y);

    const pages=doc.internal.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(7.2);doc.setTextColor(130,134,145);doc.text(`Kunal Vardhan · Resume · ${i}/${pages}`,W-R,H-20,{align:'right'});}
    doc.save('Kunal_Vardhan_Content_Marketer_Resume.pdf');
    showToast('Résumé downloaded as PDF.');
  }catch(error){console.error(error);showToast('Could not generate the PDF. Please try again.');}
  finally{if(trigger)trigger.classList.remove('is-loading');}
}

document.addEventListener('click',event=>{const trigger=event.target.closest('.resume-download');if(!trigger)return;event.preventDefault();downloadResume(trigger);});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion){
  const revealTargets=['.section-heading','.case-card','.strategy-grid article','.execution-block','.work-card','.about-sticky','.about-copy','.contact-box','.case-page-hero .container','.case-prose section','.case-aside'];
  document.querySelectorAll(revealTargets.join(',')).forEach((element,index)=>{element.classList.add('reveal');if(element.matches('.about-sticky,.case-aside'))element.classList.add('reveal-left');if(element.matches('.about-copy'))element.classList.add('reveal-right');element.style.transitionDelay=`${Math.min(index%4,3)*65}ms`;});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
}

if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduceMotion){
  const ring=document.createElement('div'),glow=document.createElement('div'),spotlight=document.createElement('div');ring.className='cursor-ring';glow.className='cursor-glow';spotlight.className='mouse-spotlight';document.body.append(ring,glow,spotlight);
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,gx=mx,gy=my,raf;
  const move=event=>{mx=event.clientX;my=event.clientY;document.documentElement.style.setProperty('--mouse-x',`${mx}px`);document.documentElement.style.setProperty('--mouse-y',`${my}px`);document.body.classList.add('cursor-ready');if(!raf)raf=requestAnimationFrame(tick);};
  const tick=()=>{rx+=(mx-rx)*.32;ry+=(my-ry)*.32;gx+=(mx-gx)*.12;gy+=(my-gy)*.12;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;glow.style.transform=`translate3d(${gx}px,${gy}px,0)`;raf=requestAnimationFrame(tick);};
  document.addEventListener('mousemove',move,{passive:true});
  document.addEventListener('mouseover',event=>{if(event.target.closest('a,button,.case-card,.work-card,.strategy-grid article,.about-facts div,.case-page-metrics div'))ring.classList.add('is-active');});
  document.addEventListener('mouseout',event=>{if(event.target.closest('a,button,.case-card,.work-card,.strategy-grid article,.about-facts div,.case-page-metrics div'))ring.classList.remove('is-active');});
  document.addEventListener('mousedown',()=>ring.classList.add('is-pressed'));document.addEventListener('mouseup',()=>ring.classList.remove('is-pressed'));
}
