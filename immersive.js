
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
mark(current);
})();