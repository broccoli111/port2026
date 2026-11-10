
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
const gh=document.querySelector('.case-gallery-heading p');if(gh)gh.textContent='The work, up close.';
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



/* Visual story — completely different from the original phone/image galleries. */
(()=>{
const root=document.getElementById('case-root');if(!root)return;
const id=new URLSearchParams(location.search).get('id')||'meta-inevitable';
const cases={
'meta-inevitable':{family:'system',label:'A SYSTEM THAT SCALES',big:'ONE / MANY',descriptor:'The component is the start. The collective practice is the product.',files:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-04-item-01.png']},
'meta-consistency':{family:'system',label:'DESIGNING SHARED LANGUAGE',big:'SAME / DIFFERENT',descriptor:'A common grammar, without flattening what makes each experience distinct.',files:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-04-item-01.png']},
'meta-clutter':{family:'system',label:'LESS IS A DESIGN DECISION',big:'CUT / THROUGH',descriptor:'Making space for what actually needs attention.',files:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-04-item-01.png']},
'citi-platform':{family:'architecture',label:'MULTIPLE PRODUCTS, ONE FOUNDATION',big:'BUILT / TOGETHER',descriptor:'A repeatable structure for many distinct financial experiences.',files:['gallery-01-item-01.png','gallery-01-item-05.png','gallery-01-item-11.png']},
'citi-guidance':{family:'architecture',label:'GUIDANCE THROUGH DESIGN',big:'MONEY / MADE CLEAR',descriptor:'An experience that helps people understand where to go next.',files:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-03-item-device.png']},
'feelmore-wellness':{family:'ritual',label:'FROM DEVICE TO DAILY RITUAL',big:'FEEL / MORE',descriptor:'A quieter, human-centered rhythm behind a new wellness habit.',files:['screen-01.png','screen-04-background.png','screen-08-background.png']},
'feelmore-confidence':{family:'ritual',label:'TRUST BEFORE TRANSACTIONS',big:'MAKE / IT REAL',descriptor:'Turning curiosity into understanding, then understanding into confidence.',files:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-03-item-01.png']},
'weight-watchers':{family:'identity',label:'A BRAND IN EVERY INTERACTION',big:'FEEL / CONNECTED',descriptor:'The character of a brand should hold together across every touchpoint.',files:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-04-item-01.png']}
};
const c=cases[id];if(!c)return;
const url=file=>'assets/cases/'+id+'/'+file;
const svgLines='<svg class="gi-art-vector" viewBox="0 0 800 620" preserveAspectRatio="none" aria-hidden="true"><path d="M20 510L236 152L526 395L765 62" /><path d="M37 78L236 152L493 65L765 62M236 152L390 570L526 395L780 546" /><circle cx="236" cy="152" r="9"/><circle cx="526" cy="395" r="9"/><circle cx="765" cy="62" r="9"/></svg>';
const panel=(file,cls)=>'<figure class="gi-art-media '+cls+'"><img src="'+url(file)+'" alt="" loading="lazy" decoding="async"></figure>';
const section=document.createElement('section');section.className='gi-art-story gi-art-story--'+c.family;section.setAttribute('aria-label','Art-directed presentation of original project visuals');
section.innerHTML='<header class="gi-art-heading"><span class="gi-mono">VISUAL STORY / '+c.label+'</span><span class="gi-mono">COMPOSED FROM ORIGINAL WORK</span></header>'+
'<div class="gi-art-canvas"><div class="gi-art-noise" aria-hidden="true"></div><span class="gi-art-outline" aria-hidden="true">'+c.big.replace(' / ','<br>')+'</span>'+svgLines+
panel(c.files[0],'gi-art-primary')+panel(c.files[1],'gi-art-secondary')+panel(c.files[2],'gi-art-tertiary')+
'<div class="gi-art-counter gi-mono">ARTIFACT STUDY<br>01 — 03</div><span class="gi-art-shape" aria-hidden="true"></span></div>'+
'<div class="gi-art-caption"><h2>'+c.big.replace(' / ','<br>')+'</h2><p>'+c.descriptor+'</p></div>';
const target=document.querySelector('.case-gallery-heading');if(!target)return;
target.parentNode.insertBefore(section,target);
section.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.closest('.gi-art-media').classList.add('gi-asset-missing')},{once:true}));
const gallery=document.querySelector('.case-gallery');
if(gallery&&target){
const details=document.createElement('details');details.className='gi-original-gallery';
const summary=document.createElement('summary');summary.innerHTML='<span class="gi-mono">ORIGINAL ARTIFACTS / PROCESSES / SCREENS</span><strong>Explore the work in detail</strong><svg class="gi-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
target.parentNode.insertBefore(details,target);details.appendChild(summary);details.appendChild(target);details.appendChild(gallery);
details.addEventListener('toggle',()=>{if(details.open){dispatchEvent(new Event('resize'));requestAnimationFrame(()=>dispatchEvent(new Event('scroll')))}});
}
})();
