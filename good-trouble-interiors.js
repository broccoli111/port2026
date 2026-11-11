
(() => {
'use strict';
const body=document.body;
const isCase=!!document.getElementById('case-root');
const isNote=!!document.getElementById('note-root');
if(!isCase&&!isNote)return;
body.classList.add('gt-interior');
const arrow='<svg class="gi-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L19 5M8 5h11v11"/></svg>';
const back='<svg class="gi-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
const star='<svg class="gi-icon gi-mark" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 2v32M2 18h32M6.7 6.7l22.6 22.6m0-22.6L6.7 29.3"/></svg>';
const head=document.createElement('header');head.className='gi-head';
head.innerHTML='<a class="gi-brand" href="home.html" aria-label="Ross Lauda homepage"><span>Ross</span><span>Lauda</span></a><nav class="gi-head-nav" aria-label="Site navigation"><a href="home.html#work">Work</a><a href="home.html#approach">Playbook</a><a href="home.html#notes">Notes</a><a href="home.html#about">About</a><a class="gi-head-cta" href="mailto:hello@rosslauda.com">Let’s talk '+arrow+'</a></nav>';
body.insertBefore(head,body.firstChild);
const progress=document.createElement('div');progress.className='gi-top-progress';progress.setAttribute('aria-hidden','true');body.appendChild(progress);
let ticking=false;const update=()=>{progress.style.transform='scaleX('+Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))+')';ticking=false};
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});update();
if(isCase){
const hero=document.querySelector('.case-hero');
const story=document.querySelector('.case-intro-story');const title=story?.querySelector('h1');const dek=story?.querySelector('p');const company=document.querySelector('.case-intro-meta .case-company');
if(hero&&title){
const id=new URLSearchParams(location.search).get('id')||'meta-inevitable';
const titles={
'meta-inevitable':['Good design.','At scale.'],
'meta-consistency':['Consistency.','Without compromise.'],
'meta-clutter':['Less clutter.','More clarity.'],
'citi-platform':['One system.','Many futures.'],
'citi-guidance':['Better guidance.','Every day.'],
'feelmore-wellness':['Make wellness','Feel human.'],
'feelmore-confidence':['Confidence','Before conversion.'],
'weight-watchers':['A brand','In motion.']};
const words=titles[id]||[title.textContent,'.'];
hero.classList.add(id.startsWith('citi')?'gi-citi':id.startsWith('feelmore')?'gi-feelmore':id.startsWith('weight')?'gi-weight':'gi-meta');
const cover=document.createElement('div');cover.className='gi-cover';
const indexed=['meta-inevitable','citi-platform','feelmore-wellness','meta-consistency','feelmore-confidence','citi-guidance','meta-clutter','weight-watchers'];
const position=Math.max(0,indexed.indexOf(id))+1;
cover.innerHTML='<div class="gi-cover-top gi-mono"><span class="gi-dot"></span><span>'+String(position).padStart(2,'0')+' / '+String(indexed.length).padStart(2,'0')+'</span><span>PRODUCT DESIGN / SELECTED WORK</span></div><h2 class="gi-cover-title">'+words.map((w,i)=>'<span'+(i?' class="gi-accent"':'')+' style="display:block">'+escapeText(w)+'</span>').join('')+'</h2><div><p class="gi-cover-dek">'+escapeText(dek?.textContent||'')+'</p><div class="gi-cover-bottom gi-mono"><span>'+escapeText(company?.textContent||'')+' / CASE STUDY</span>'+star+'</div></div>';
hero.insertBefore(cover,hero.firstChild);
const label=document.createElement('span');label.className='gi-cover-art-label gi-mono';label.textContent='SELECTED PRODUCT WORK';hero.appendChild(label);
/* Legacy selected-evidence heading is removed by the guided-story renderer. */
const thesis=document.querySelector('.case-thesis>p');if(thesis)thesis.textContent='02 / THE IDEA THAT MOVED THE WORK';
const fs=document.querySelectorAll('.case-facts>div');fs.forEach((el,i)=>{let n=el.querySelector('.case-fact-index');if(n)n.textContent='0'+(i+3)+' / '+['CONTEXT','INTERVENTION','OUTCOME'][i]});
const nav=document.querySelector('.case-bottom-nav');if(nav){nav.querySelectorAll('a').forEach((a,i)=>{const old=a.querySelector('svg');if(old)old.remove();a.insertAdjacentHTML(i===0?'afterbegin':'beforeend',i===0?back:arrow)})}
}
}
if(isNote){
const article=document.querySelector('.note-article');const heading=article?.querySelector('.note-heading');const noteBody=article?.querySelector('.note-body');
if(article&&heading&&noteBody){
const id=new URLSearchParams(location.search).get('id')||'most-important';
const total=document.querySelectorAll('.note-body p').length;
const over=document.createElement('div');over.className='gi-note-overline gi-mono';over.innerHTML='<span>FIELD NOTES / DESIGN, SYSTEMS &amp; PEOPLE</span><span>ROSS LAUDA — 2026</span>';
heading.insertBefore(over,heading.firstChild);
const sticker=document.createElement('span');sticker.className='gi-note-sticker';sticker.textContent='KEEP THINKING';sticker.setAttribute('aria-hidden','true');heading.appendChild(sticker);
const grid=document.createElement('div');grid.className='gi-reading-grid';
const rail=document.createElement('aside');rail.className='gi-reading-rail gi-mono';rail.setAttribute('aria-label','Article information');rail.innerHTML='<span>01 / REFLECTION</span><span>'+String(total).padStart(2,'0')+' PARAGRAPHS</span><a href="home.html#notes">'+back+' ALL NOTES</a>';
noteBody.parentNode.insertBefore(grid,noteBody);grid.appendChild(rail);grid.appendChild(noteBody);
const nav=document.querySelector('.detail-nav');if(nav)nav.querySelectorAll('a').forEach((a,i)=>{const old=a.querySelector('svg');if(old)old.remove();a.insertAdjacentHTML(i===0?'afterbegin':'beforeend',i===0?back:arrow)});
}
}
function escapeText(t){return String(t).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
})();



