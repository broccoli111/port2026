
(()=>{'use strict';
const sections=[...document.querySelectorAll('.e-scene')];
const active=document.getElementById('e-current'),bar=document.getElementById('e-progress'),next=document.getElementById('e-next');
if(!sections.length)return;
const set=i=>{
  active.textContent=String(i+1).padStart(2,'0');
  bar.style.width=((i+1)/sections.length*100)+'%';
  document.body.classList.toggle('e-dark',sections[i].classList.contains('e-scene--contact'));
  next.href='#'+sections[(i+1)%sections.length].id;
  next.setAttribute('aria-label',i===sections.length-1?'Back to the beginning':'Go to next scene');
  next.querySelector('span').textContent=i===sections.length-1?'Back to start':'Next scene';
};
if('IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(visible[0])set(sections.indexOf(visible[0].target));
 },{threshold:[.3,.45,.6,.75]});
 sections.forEach(s=>observer.observe(s));
}
const update=()=>{let best=0,dist=Infinity;sections.forEach((s,i)=>{const d=Math.abs(s.getBoundingClientRect().top);if(d<dist){dist=d;best=i}});set(best)};
addEventListener('scroll',()=>{if(!('IntersectionObserver'in window))update()},{passive:true});
set(0);
})();