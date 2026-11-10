
(() => {
'use strict';
const root=document.body;if(!root.classList.contains('gt'))return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const els=[...document.querySelectorAll('.gt-reveal')];
if(!reduce && 'IntersectionObserver' in window){
root.classList.add('gt-enhanced');
const io=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('gt-in');io.unobserve(entry.target)}}},{threshold:.07,rootMargin:'0px 0px -22px 0px'});
for(const el of els){if(el.getBoundingClientRect().top < innerHeight*.95)el.classList.add('gt-in');else io.observe(el)}
}
const p=document.querySelector('.gt-scroll-progress');let active=false;
const set=()=>{if(p)p.style.transform='scaleX('+Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))+')';active=false};
window.addEventListener('scroll',()=>{if(!active){active=true;requestAnimationFrame(set)}},{passive:true});set();
const sculpture=document.querySelector('.gt-hero-art');
if(sculpture&&!reduce&&matchMedia('(pointer:fine)').matches){
let frame=0;let px=0,py=0;
window.addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*12;py=(e.clientY/innerHeight-.5)*10;if(frame)return;frame=requestAnimationFrame(()=>{sculpture.style.transform='translate3d('+px+'px,'+py+'px,0)';frame=0})},{passive:true});
}
})();
