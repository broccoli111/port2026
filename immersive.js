
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


/* All scene changes use the browser's SAME native smooth-scroll animation.
   Wheel only selects the destination. It never applies its own easing curve. */
const desktopScenes=matchMedia('(min-width:761px) and (min-height:701px) and (pointer:fine)');
const transitionLinks=[...document.querySelectorAll('a[href^="#"]')];
const sceneFromHash=hash=>scenes.findIndex(s=>('#'+s.id)===hash);
const sceneTop=i=>Math.round(scenes[i].getBoundingClientRect().top+scrollY);
const nearestScene=()=>scenes.reduce((best,s,i)=>Math.abs(sceneTop(i)-scrollY)<Math.abs(sceneTop(best)-scrollY)?i:best,0);
const controlled=()=>desktopScenes.matches&&!reduced;
let transitioning=false,wheelBuffer=0,transitionTimer=0,lastWheel=0,unlockAt=0;
const setMode=()=>{document.documentElement.classList.toggle('i-controlled',controlled());if(!controlled()){transitioning=false;wheelBuffer=0;clearTimeout(transitionTimer)}};
setMode();
desktopScenes.addEventListener('change',setMode);
const clearTransition=()=>{transitioning=false;wheelBuffer=0;unlockAt=performance.now()+230;clearTimeout(transitionTimer)};
const goScene=(index,updateHash=false)=>{
 index=Math.max(0,Math.min(scenes.length-1,index));
 const target=scenes[index];
 if(!target)return;
 if(updateHash&&location.hash!=='#'+target.id)history.pushState(null,'','#'+target.id);
 // The same call is used for numbered links, header links, wheel and keyboard.
 if(Math.abs(sceneTop(index)-scrollY)<3){mark(index);clearTransition();return}
 transitioning=controlled();
 wheelBuffer=0;mark(index);
 target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 clearTimeout(transitionTimer);
 if(transitioning){
   // This safety fallback covers browsers without scrollend.
   transitionTimer=setTimeout(clearTransition,1150);
 }
};
addEventListener('scrollend',()=>{
 if(!transitioning)return;
 const i=nearestScene();
 if(Math.abs(sceneTop(i)-scrollY)<5)clearTransition();
},{passive:true});
transitionLinks.forEach(a=>{
 const i=sceneFromHash(a.getAttribute('href'));
 if(i<0)return;
 a.addEventListener('click',e=>{
   if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   e.preventDefault();
   goScene(i,true);
 });
});
addEventListener('wheel',e=>{
 if(!controlled()||e.ctrlKey)return;
 e.preventDefault();
 if(transitioning||performance.now()<unlockAt)return;
 const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(!delta)return;
 // Treat a new trackpad gesture separately from its momentum tail.
 const now=performance.now();
 if(now-lastWheel>170||Math.sign(wheelBuffer)!==Math.sign(delta))wheelBuffer=0;
 lastWheel=now;
 wheelBuffer=Math.max(-130,Math.min(130,wheelBuffer+delta));
 if(Math.abs(wheelBuffer)<45)return;
 const direction=Math.sign(wheelBuffer);
 wheelBuffer=0;
 const i=nearestScene()+direction;
 if(i>=0&&i<scenes.length)goScene(i);
 else unlockAt=performance.now()+220;
},{passive:false});
addEventListener('keydown',e=>{
 if(!controlled()||e.defaultPrevented||e.altKey||e.metaKey||e.ctrlKey)return;
 if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')||document.activeElement?.isContentEditable)return;
 const dir=['ArrowDown','PageDown',' '].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
 if(dir){e.preventDefault();if(!transitioning)goScene(nearestScene()+dir);return}
 if(e.key==='Home'){e.preventDefault();goScene(0)}
 if(e.key==='End'){e.preventDefault();goScene(scenes.length-1)}
});
addEventListener('popstate',()=>{const i=sceneFromHash(location.hash);if(i>=0)goScene(i)});


/* Mobile: symmetrical swipe-to-scene navigation.
   Fix: short viewport minimum heights previously disabled upward swipes.
   The destination always uses goScene(), just like side navigation. */
const touchScenes=matchMedia('(max-width:760px) and (pointer:coarse)');
let gesture=null,gestureLock=0;
const touchEnabled=()=>touchScenes.matches&&!reduced;
const updateTouchMode=()=>document.documentElement.classList.toggle('i-touch-scenes',touchEnabled());
updateTouchMode();
touchScenes.addEventListener('change',updateTouchMode);

const interactiveGestureTarget=el=>!!el?.closest('a,button,input,textarea,select,[contenteditable],[role="slider"],[data-native-scroll]');
const tallScene=section=>section.getBoundingClientRect().height>innerHeight+36;
addEventListener('touchstart',e=>{
 gesture=null;
 if(!touchEnabled()||e.touches.length!==1)return;
 const element=e.target instanceof Element?e.target:null;
 if(!element||interactiveGestureTarget(element))return;
 const section=element.closest('.i-scene');
 if(!section)return;
 const t=e.touches[0];
 gesture={x:t.clientX,y:t.clientY,axis:null,section,atStart:scrollY<=sceneTop(scenes.indexOf(section))+12,
 atEnd:scrollY>=sceneTop(scenes.indexOf(section))+section.offsetHeight-innerHeight-12,
 oversize:tallScene(section)};
},{passive:true});
addEventListener('touchmove',e=>{
 if(!gesture||!touchEnabled()||e.touches.length!==1)return;
 const t=e.touches[0],dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;
 if(!gesture.axis&&Math.max(Math.abs(dx),Math.abs(dy))>10)gesture.axis=Math.abs(dy)>Math.abs(dx)*1.2?'vertical':'horizontal';
 if(gesture.axis!=='vertical')return;
 // For oversized scenes permit scrolling through their actual content.
 const needsContentScroll=gesture.oversize&&((dy<0&&!gesture.atEnd)||(dy>0&&!gesture.atStart));
 if(needsContentScroll)return;
 if(e.cancelable)e.preventDefault();
},{passive:false});
addEventListener('touchend',e=>{
 const g=gesture;gesture=null;
 if(!g||!touchEnabled()||g.axis!=='vertical'||e.changedTouches.length!==1)return;
 const dy=e.changedTouches[0].clientY-g.y;
 if(Math.abs(dy)<42||performance.now()<gestureLock)return;
 if(g.oversize&&((dy<0&&!g.atEnd)||(dy>0&&!g.atStart)))return;
 const currentIndex=scenes.indexOf(g.section);
 if(currentIndex<0)return;
 const nextIndex=currentIndex+(dy<0?1:-1);
 if(nextIndex<0||nextIndex>=scenes.length)return;
 goScene(nextIndex);
 gestureLock=performance.now()+650;
},{passive:true});
addEventListener('touchcancel',()=>{gesture=null},{passive:true});

mark(current);
})();