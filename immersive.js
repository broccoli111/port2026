
(()=>{'use strict';
const scenes=[...document.querySelectorAll('.i-scene')],rail=[...document.querySelectorAll('.i-rail a')],progress=document.querySelector('.i-progress');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){
 document.body.classList.add('i-enhanced');
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('i-visible');reveal.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -10% 0px'});
 document.querySelectorAll('.i-reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.85)el.classList.add('i-visible');else reveal.observe(el)});
}
let current=0;
const mark=i=>{current=i;rail.forEach((a,n)=>{if(n===i)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})};
if('IntersectionObserver'in window){const observe=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio).forEach((e,n)=>{if(n===0)mark(scenes.indexOf(e.target))})},{threshold:[.3,.5,.7]});scenes.forEach(s=>observe.observe(s))}
let ticking=false;const scroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{progress.style.transform='scaleX('+Math.max(0,Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))+')';ticking=false})};addEventListener('scroll',scroll,{passive:true});scroll();
if(!reduced&&matchMedia('(pointer:fine)').matches){
 let targetX=0,targetY=0,px=0,py=0,raf=false;
 const art=document.querySelector('.i-sculpture');
 addEventListener('pointermove',e=>{
 targetX=(e.clientX/innerWidth-.5)*28;targetY=(e.clientY/innerHeight-.5)*22;
 if(raf)return;raf=true;requestAnimationFrame(()=>{px+=(targetX-px)*.35;py+=(targetY-py)*.35;if(art){art.style.setProperty('--px',px.toFixed(1)+'px');art.style.setProperty('--py',py.toFixed(1)+'px')}raf=false})
 },{passive:true});
}
document.querySelectorAll('.i-project-art').forEach(art=>art.addEventListener('pointermove',e=>{
 if(reduced||!matchMedia('(pointer:fine)').matches)return;
 const r=art.getBoundingClientRect();art.style.setProperty('--px2',((e.clientX-r.left)/r.width-.5)*13+'px');art.style.setProperty('--py2',((e.clientY-r.top)/r.height-.5)*13+'px')
},{passive:true}));


/* One transition engine for wheel, trackpad, and section links.
   Desktop only: mobile retains native touch scrolling. */
const desktopScenes=matchMedia('(min-width: 761px) and (min-height: 701px) and (pointer: fine)');
const transitionLinks=[...document.querySelectorAll('a[href^="#"]')];
let animationFrame=0,transitioning=false,wheelBuffer=0,releaseAt=0,targetScene=0;
const sceneFromHash=hash=>scenes.findIndex(s=>('#'+s.id)===hash);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const sceneTop=i=>Math.round(scenes[i].getBoundingClientRect().top+window.scrollY);
const nearestScene=()=>scenes.reduce((best,s,i)=>Math.abs(sceneTop(i)-window.scrollY)<Math.abs(sceneTop(best)-window.scrollY)?i:best,0);
const controlled=()=>desktopScenes.matches&&!reduced;
const setMode=()=>{
 document.documentElement.classList.toggle('i-controlled',controlled());
 if(!controlled()){cancelAnimationFrame(animationFrame);transitioning=false;wheelBuffer=0}
};
setMode();desktopScenes.addEventListener('change',setMode);
const goScene=(index,updateHash=false)=>{
 index=Math.max(0,Math.min(scenes.length-1,index));
 const target=scenes[index];
 if(!target)return;
 targetScene=index;
 if(updateHash&&location.hash!=='#'+target.id)history.pushState(null,'','#'+target.id);
 if(!controlled()){
   target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
   mark(index);return;
 }
 cancelAnimationFrame(animationFrame);
 const from=window.scrollY,to=sceneTop(index),delta=to-from;
 if(Math.abs(delta)<2){transitioning=false;mark(index);return}
 transitioning=true;wheelBuffer=0;
 const duration=Math.min(1050,Math.max(680,720+Math.abs(delta)/Math.max(1,innerHeight)*100));
 const start=performance.now();
 mark(index);
 const step=now=>{
   const t=Math.min(1,(now-start)/duration);
   window.scrollTo(0,from+delta*ease(t));
   if(t<1){animationFrame=requestAnimationFrame(step)}
   else{
     transitioning=false;releaseAt=performance.now()+190;
     window.scrollTo(0,to);
     wheelBuffer=0;
   }
 };
 animationFrame=requestAnimationFrame(step);
};
transitionLinks.forEach(a=>{
 const i=sceneFromHash(a.getAttribute('href'));
 if(i===-1)return;
 a.addEventListener('click',e=>{
   // A modifier click retains the browser's usual link behavior.
   if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   e.preventDefault();goScene(i,true);
 });
});
addEventListener('wheel',e=>{
 if(!controlled()||e.ctrlKey)return;
 e.preventDefault();
 if(transitioning||performance.now()<releaseAt)return;
 // Accumulate small trackpad deltas but respond to ordinary wheel ticks.
 const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(!delta)return;
 if(wheelBuffer&&Math.sign(wheelBuffer)!==Math.sign(delta))wheelBuffer=0;
 wheelBuffer=Math.max(-130,Math.min(130,wheelBuffer+delta));
 if(Math.abs(wheelBuffer)<32)return;
 const direction=Math.sign(wheelBuffer);wheelBuffer=0;
 const index=nearestScene()+direction;
 if(index>=0&&index<scenes.length)goScene(index);
 else releaseAt=performance.now()+120;
},{passive:false});
addEventListener('keydown',e=>{
 if(!controlled()||e.defaultPrevented||e.altKey||e.metaKey||e.ctrlKey)return;
 if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')||document.activeElement?.isContentEditable)return;
 const direction=['ArrowDown','PageDown',' '].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
 if(direction){e.preventDefault();if(!transitioning)goScene(nearestScene()+direction);return}
 if(e.key==='Home'){e.preventDefault();goScene(0)}
 if(e.key==='End'){e.preventDefault();goScene(scenes.length-1)}
});
addEventListener('popstate',()=>{const i=sceneFromHash(location.hash);if(i>=0)goScene(i)});

mark(current);
})();