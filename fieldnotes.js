
(()=>{'use strict';
const root=document.body;if(!root.classList.contains('studio'))return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets=[...document.querySelectorAll('.field-reveal')];
if(!reduce&&'IntersectionObserver'in window){root.classList.add('field-motion');const o=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');o.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});targets.forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight*.92)el.classList.add('is-visible');else o.observe(el)})}
const bar=document.querySelector('.field-progress');let ticking=false;function progress(){const d=document.documentElement;const max=Math.max(1,d.scrollHeight-innerHeight);if(bar)bar.style.transform='scaleX('+Math.min(1,scrollY/max)+')';ticking=false}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(progress)}},{passive:true});progress();
const spin=document.querySelector('.field-stamp');if(spin&&!reduce&&matchMedia('(pointer:fine)').matches){let last=0;window.addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*13;const y=(e.clientY/innerHeight-.5)*13;if(performance.now()-last<40)return;last=performance.now();spin.style.transform='translate('+x+'px,'+y+'px) rotate(19deg)'},{passive:true})}
})();
