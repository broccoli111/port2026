
(()=>{'use strict';
const body=document.body;
const isCase=!!document.getElementById('case-root');
const isNote=!!document.getElementById('note-root');
if(!isCase&&!isNote)return;
body.classList.add('ci-page');
const arrow='<svg class="ci-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 20 4M8 4h12v12"/></svg>';
const nav=document.createElement('header');nav.className='ci-nav';
nav.innerHTML='<a class="ci-brand" href="home.html#intro" aria-label="Ross Lauda home">Ross Lauda</a><nav class="ci-links" aria-label="Main navigation"><a href="home.html#meta">Work</a><a href="home.html#philosophy">Approach</a><a href="mailto:hello@rosslauda.com">Let’s talk '+arrow+'</a></nav>';
body.prepend(nav);
const grain=document.createElement('div');grain.className='ci-grain';grain.setAttribute('aria-hidden','true');body.appendChild(grain);
const progress=document.createElement('div');progress.className='ci-reading-progress';progress.setAttribute('aria-hidden','true');body.appendChild(progress);
let pending=false;
const updateProgress=()=>{progress.style.transform='scaleX('+Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))+')';pending=false};
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateProgress)}},{passive:true});updateProgress();
const safe=t=>String(t||'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
if(isCase){
const hero=document.querySelector('.case-hero');
const intro=document.querySelector('.case-intro-story');
const title=intro?.querySelector('h1');
const dek=intro?.querySelector('p');
const company=document.querySelector('.case-intro-meta .case-company');
if(hero&&title){
 const id=new URLSearchParams(location.search).get('id')||'meta-inevitable';
 const family=id.startsWith('citi')?'citi':id.startsWith('feelmore')?'feelmore':id.startsWith('weight')?'weight':'meta';
 hero.dataset.ciFamily=family;
 const lead=document.createElement('div');lead.className='ci-case-lead ci-fade';
 const t=title.textContent.trim();
 const words=t.replace(/[.!?]+$/,'').split(/\s+/);
 const last=words.pop()||'';
 const first=words.join(' ');
 const index=['meta-inevitable','citi-platform','feelmore-wellness','meta-consistency','feelmore-confidence','citi-guidance','meta-clutter','weight-watchers'].indexOf(id);
 lead.innerHTML='<div class="ci-hero-meta ci-kicker">Selected work / '+safe(company?.textContent||'Project')+'</div><h1>'+safe(first)+' <span>'+safe(last)+'</span></h1><p>'+safe(dek?.textContent||'')+'</p>';
 hero.prepend(lead);
 const foot=document.createElement('div');foot.className='ci-case-foot ci-kicker';foot.innerHTML='<span>PROJECT '+String(Math.max(index,0)+1).padStart(2,'0')+' / 08</span><span>SCROLL TO EXPLORE ↓</span>';hero.appendChild(foot);
 }
 document.querySelectorAll('.gts-chapter-copy,.gts-artifact,.gts-prologue,.case-intro-story').forEach(el=>el.classList.add('ci-fade'));
}
if(isNote){
 const article=document.querySelector('.note-article');
 const heading=article?.querySelector('.note-heading');
 const noteBody=article?.querySelector('.note-body');
 if(heading&&noteBody){
  const over=document.createElement('div');over.className='ci-note-overline ci-kicker';over.textContent='Field notes / Design, systems & people';heading.prepend(over);
  const wrap=document.createElement('div');wrap.className='ci-note-body-wrap';
  const aside=document.createElement('aside');aside.className='ci-note-sidebar ci-kicker';aside.innerHTML='<span>THE LONG VIEW / REFLECTION</span><a href="home.html#philosophy">BACK TO HOME '+arrow+'</a>';
  noteBody.before(wrap);wrap.append(aside,noteBody);
  heading.querySelectorAll('h1,p').forEach(el=>el.classList.add('ci-fade'));
 }
}
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){
 const targets=[...document.querySelectorAll('.ci-fade')];
 document.body.classList.add('ci-ready');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ci-shown');observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -20px 0px'});
 targets.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.9)el.classList.add('ci-shown');else observer.observe(el)});
}
})();