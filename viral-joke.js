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
    .viral-joke-stage{position:relative;height:112px;max-width:380px;margin-top:7px;overflow:hidden}
    .viral-joke-button{position:absolute;left:0;top:0;appearance:none;border:1px solid var(--ink);background:var(--surface);color:var(--ink);padding:7px 10px;font:700 .68rem Inter,sans-serif;cursor:pointer;white-space:nowrap;transform:translate3d(0,0,0);transform-origin:center;will-change:transform;transition:background .18s ease,color .18s ease,border-color .18s ease}
    .viral-joke-button:hover{background:var(--paper)}
    .viral-joke-button:focus-visible{outline:2px solid var(--sage);outline-offset:3px}
    .viral-joke-response{position:absolute;left:0;bottom:0;color:var(--sage);font-size:.61rem;font-weight:600;opacity:0;transform:translateY(3px);transition:opacity .18s ease,transform .18s ease}
    .viral-joke-response.is-visible{opacity:1;transform:none}
    @media(max-width:620px){.viral-joke-stage{max-width:100%}}
    @media(prefers-reduced-motion:reduce){.viral-joke-button,.viral-joke-response{transition:none!important}}
  `;
  document.head.appendChild(style);

  const comments=[
    'Nope.',
    'Still nope.',
    'That’s not how virality works.',
    'I admire the persistence.',
    'We should probably talk strategy.',
    'Seriously?',
    'You’re still trying?',
    'Okay, this is getting personal.'
  ];

  let pos={x:0,y:0};
  let vel={x:0,y:0};
  let pointer={x:null,y:null};
  let maxX=0;
  let maxY=0;
  let raf=0;
  let lastFrame=0;
  let lastNear=0;
  let lastComment=0;
  let lastBurst=0;
  let commentIndex=0;
  let visible=true;

  const say=text=>{
    response.textContent=text;
    response.classList.add('is-visible');
  };

  const nextComment=()=>{
    say(comments[commentIndex%comments.length]);
    commentIndex+=1;
  };

  const updateBounds=()=>{
    maxX=Math.max(0,stage.clientWidth-button.offsetWidth);
    maxY=Math.max(0,stage.clientHeight-button.offsetHeight-24);
    pos.x=Math.max(0,Math.min(maxX,pos.x));
    pos.y=Math.max(0,Math.min(maxY,pos.y));
  };

  const render=()=>{
    const angle=Math.max(-4,Math.min(4,vel.x*.008));
    button.style.transform=`translate3d(${pos.x.toFixed(2)}px,${pos.y.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg)`;
  };

  const emergencyBurst=(clientX,clientY)=>{
    updateBounds();
    const rect=stage.getBoundingClientRect();
    const px=clientX-rect.left;
    const py=clientY-rect.top;
    const candidates=[
      {x:0,y:0},{x:maxX,y:0},{x:0,y:maxY},{x:maxX,y:maxY},
      {x:maxX*.5,y:0},{x:maxX*.5,y:maxY},{x:0,y:maxY*.5},{x:maxX,y:maxY*.5}
    ];
    candidates.sort((a,b)=>{
      const da=Math.hypot(a.x+button.offsetWidth/2-px,a.y+button.offsetHeight/2-py);
      const db=Math.hypot(b.x+button.offsetWidth/2-px,b.y+button.offsetHeight/2-py);
      return db-da;
    });
    const target=candidates[0]||{x:maxX,y:maxY};
    const dx=target.x-pos.x;
    const dy=target.y-pos.y;
    const len=Math.hypot(dx,dy)||1;
    vel.x=dx/len*820;
    vel.y=dy/len*820;
    lastBurst=performance.now();
    say('Nice try.');
  };

  const ensureLoop=()=>{
    if(!raf&&visible&&!reduced&&finePointer){
      lastFrame=performance.now();
      raf=requestAnimationFrame(frame);
    }
  };

  const frame=now=>{
    raf=0;
    if(!visible||reduced||!finePointer)return;

    const dt=Math.min(.032,Math.max(.001,(now-lastFrame)/1000));
    lastFrame=now;
    updateBounds();

    const rect=stage.getBoundingClientRect();
    const px=pointer.x==null?9999:pointer.x-rect.left;
    const py=pointer.y==null?9999:pointer.y-rect.top;
    const cx=pos.x+button.offsetWidth/2;
    const cy=pos.y+button.offsetHeight/2;
    let dx=cx-px;
    let dy=cy-py;
    let dist=Math.hypot(dx,dy);
    const influence=132;
    const pointerNearStage=pointer.x!=null&&pointer.x>rect.left-150&&pointer.x<rect.right+150&&pointer.y>rect.top-150&&pointer.y<rect.bottom+150;
    const repelling=pointerNearStage&&dist<influence;

    if(repelling){
      if(dist<1){dx=1;dy=.4;dist=1.08;}
      const nx=dx/dist;
      const ny=dy/dist;
      const strength=1-dist/influence;
      const accel=1700+3000*strength*strength;
      let fx=nx*accel;
      let fy=ny*accel;

      if((pos.x<5&&fx<0)||(pos.x>maxX-5&&fx>0)){
        fx*=.12;
        fy+=(cy>=py?1:-1)*accel*.9;
      }
      if((pos.y<5&&fy<0)||(pos.y>maxY-5&&fy>0)){
        fy*=.12;
        fx+=(cx>=px?1:-1)*accel*.9;
      }

      vel.x+=fx*dt;
      vel.y+=fy*dt;
      lastNear=now;

      if(dist<72&&now-lastComment>950){
        nextComment();
        lastComment=now;
      }
      if(dist<24&&now-lastBurst>700)emergencyBurst(pointer.x,pointer.y);
    }else if(now-lastNear>900){
      vel.x+=(-pos.x)*3.5*dt;
      vel.y+=(-pos.y)*3.5*dt;
      if(now-lastNear>2100&&Math.hypot(pos.x,pos.y)<7&&Math.hypot(vel.x,vel.y)<18){
        pos.x=0;pos.y=0;vel.x=0;vel.y=0;commentIndex=0;
        response.classList.remove('is-visible');
        response.textContent='';
      }
    }

    const speed=Math.hypot(vel.x,vel.y);
    if(speed>720){
      vel.x=vel.x/speed*720;
      vel.y=vel.y/speed*720;
    }

    const damping=Math.exp(-3.6*dt);
    vel.x*=damping;
    vel.y*=damping;
    pos.x+=vel.x*dt;
    pos.y+=vel.y*dt;

    if(pos.x<0){pos.x=0;vel.x=Math.abs(vel.x)*.72;}
    if(pos.x>maxX){pos.x=maxX;vel.x=-Math.abs(vel.x)*.72;}
    if(pos.y<0){pos.y=0;vel.y=Math.abs(vel.y)*.72;}
    if(pos.y>maxY){pos.y=maxY;vel.y=-Math.abs(vel.y)*.72;}

    render();

    const stillMoving=Math.hypot(vel.x,vel.y)>2||Math.hypot(pos.x,pos.y)>1;
    if(pointerNearStage||stillMoving)raf=requestAnimationFrame(frame);
  };

  updateBounds();
  render();
  window.addEventListener('resize',()=>{updateBounds();render();},{passive:true});

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      visible=entries[0]?.isIntersecting??true;
      if(visible)ensureLoop();
    },{threshold:0});
    observer.observe(stage);
  }

  if(finePointer&&!reduced){
    document.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
      pointer.x=e.clientX;
      pointer.y=e.clientY;
      ensureLoop();
    },{passive:true});

    button.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
      e.preventDefault();
      emergencyBurst(e.clientX,e.clientY);
      ensureLoop();
    });
  }

  button.addEventListener('click',e=>{
    e.preventDefault();
    if(finePointer&&!reduced&&e.detail>0){
      const rect=button.getBoundingClientRect();
      emergencyBurst(rect.left+rect.width/2,rect.top+rect.height/2);
      ensureLoop();
      return;
    }
    nextComment();
  });
});
