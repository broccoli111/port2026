
/* Good Trouble / Project editorial chapters. Each project uses its original assets and narrative. */
(()=>{'use strict';
const root=document.getElementById('case-root');if(!root)return;
const id=new URLSearchParams(location.search).get('id')||'meta-inevitable';
const configs={
'meta-inevitable':{family:'systems',eyebrow:'A system for thousands of decisions',headline:['ONE','SYSTEM.','MANY','TEAMS.'],poster:'MAKE GOOD DESIGN INEVITABLE',beats:['FROM COMPONENTS','TO CULTURE','TO A FOUNDATION'],images:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-03-item-01.png','gallery-04-item-01.png','gallery-05-item-01.png','gallery-06-item-01.png'],color:'#272bff'},
'meta-consistency':{family:'systems',eyebrow:'A common language without compromise',headline:['STAY','COHERENT.','STAY','FLEXIBLE.'],poster:'DIFFERENT SURFACES. SHARED LOGIC.',beats:['DEFINE THE PATTERN','RESPECT THE EDGE CASE','MAKE IT REUSABLE'],images:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-03-item-01.png','gallery-04-item-01.png','gallery-05-item-01.png','gallery-06-item-01.png'],color:'#262aff'},
'meta-clutter':{family:'systems',eyebrow:'When less becomes meaningful',headline:['CUT','THROUGH','THE','NOISE.'],poster:'CLARITY AT EVERY TOUCHPOINT',beats:['FIND THE FRICTION','REMOVE THE NOISE','RESTORE THE SIGNAL'],images:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-03-item-01.png','gallery-04-item-01.png','gallery-05-item-01.png','gallery-06-item-01.png'],color:'#262aff'},
'citi-platform':{family:'architecture',eyebrow:'A foundation designed to travel',headline:['ONE','FOUNDATION.','MANY','FUTURES.'],poster:'BUILT TO SCALE ACROSS BOUNDARIES',beats:['FIND COMMON GROUND','DESIGN FOR VARIATION','BUILD A PLATFORM'],images:['gallery-01-item-01.png','gallery-01-item-05.png','gallery-01-item-11.png','gallery-01-item-16.png','gallery-02-item-01.png','gallery-02-item-03.png'],color:'#2455fd'},
'citi-guidance':{family:'architecture',eyebrow:'Making financial guidance useful',headline:['LESS','UNCERTAINTY.','MORE','DIRECTION.'],poster:'MAKE THE NEXT STEP CLEAR',beats:['MEET PEOPLE WHERE THEY ARE','MAKE CHOICES VISIBLE','TURN GUIDANCE INTO ACTION'],images:['gallery-01-item-01.png','gallery-01-item-02.png','gallery-01-item-03.png','gallery-02-item-01.png','gallery-02-item-03.png','gallery-04-item-01.png'],color:'#2455fd'},
'feelmore-wellness':{family:'human',eyebrow:'From an unfamiliar device to a familiar ritual',headline:['DESIGN','FOR','REAL','LIFE.'],poster:'THE EXPERIENCE IS THE PRODUCT',beats:['MAKE IT APPROACHABLE','MAKE IT FEEL NATURAL','MAKE IT WORTH RETURNING TO'],images:['gallery-02-item-01.png','screen-01.png','screen-06.png','screen-08-background.png','screen-11.png','screen-14.png'],color:'#ed4b9d'},
'feelmore-confidence':{family:'human',eyebrow:'Earning trust through understanding',headline:['BEFORE','THE BUY,','BUILD','BELIEF.'],poster:'UNDERSTANDING CHANGES EVERYTHING',beats:['EXPLAIN THE UNFAMILIAR','ANSWER THE QUESTIONS','EARN THE DECISION'],images:['gallery-01-item-01.png','gallery-01-item-02.png','gallery-02-item-01.png','gallery-03-item-01.png','gallery-04-item-01.png','gallery-05-item-01.png'],color:'#ed4b9d'},
'weight-watchers':{family:'brand',eyebrow:'A new expression across every surface',headline:['ONE','BRAND.','EVERY','MOMENT.'],poster:'TURN IDENTITY INTO EXPERIENCE',beats:['EXPRESS THE IDEA','CONNECT THE SURFACES','MAKE IT FEEL COHERENT'],images:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-02-item-02.png','gallery-03-item-01.png','gallery-04-item-01.png','gallery-05-item-01.png'],color:'#fc632a'}
};
const c=configs[id];if(!c)return;
const intro=document.querySelector('.case-intro-v3'), signals=document.querySelector('.case-signals'),thesis=document.querySelector('.case-thesis'),facts=document.querySelector('.case-facts'),heading=document.querySelector('.case-gallery-heading'),gallery=document.querySelector('.case-gallery');
if(!intro||!facts||!heading||!gallery)return;
const esc=x=>String(x||'').replace(/[&<>"']/g,y=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[y]));
const path=f=>'assets/cases/'+id+'/'+f;
const pic=(index,extra='')=>'<img loading="lazy" decoding="async" alt="Original '+esc(id.replace(/-/g,' '))+' project artifact" class="'+extra+'" src="'+path(c.images[index])+'">';
const arrow='<svg class="gte-arrow" viewBox="0 0 28 28" aria-hidden="true"><path d="M5 23 23 5M9 5h14v14"/></svg>';
const impact=[...((signals&&signals.querySelectorAll(':scope > div'))||[])].map(el=>({number:el.querySelector('strong')?.textContent||'',label:el.querySelector('span')?.textContent||''})).filter(v=>v.number&&v.label);
const items=[...facts.querySelectorAll(':scope > div')].map(el=>({heading:el.querySelector('h2')?.textContent||'',body:el.querySelector('p')?.textContent||''}));
const thesisText=thesis?.querySelector('blockquote')?.textContent||'';
const chapters=document.createElement('div');chapters.className='gte-chapters gte-'+c.family;chapters.style.setProperty('--gte-accent',c.color);
const mini=(i,n)=>'<span class="gte-chapter-index">0'+i+' / '+n+'</span>';
chapters.innerHTML=
'<section class="gte-opening gte-reveal" aria-label="Project opening statement">'+
'<div class="gte-opening-top"><span class="gte-eyebrow">01 / THE IDEA</span><span class="gte-eyebrow">'+esc(c.eyebrow)+'</span></div>'+
'<h2>'+c.headline.map((w,i)=>'<span class="'+(i===1||i===3?'gte-emphasis':'')+'">'+esc(w)+'</span>').join('')+'</h2>'+
'<div class="gte-opening-base"><p>'+esc(items[0]?.body)+'</p><span class="gte-ring" aria-hidden="true"></span></div></section>'+
'<section class="gte-spread gte-spread--one gte-reveal">'+
'<div class="gte-section-label">'+mini(2,'THE CHALLENGE')+'<strong>'+esc(c.beats[0])+'</strong></div>'+
'<div class="gte-artboard gte-artboard--one"><span class="gte-artword" aria-hidden="true">'+esc(c.poster)+'</span><div class="gte-image gte-image--hero">'+pic(0)+'</div><div class="gte-image gte-image--detail">'+pic(1)+'</div><div class="gte-imprint">FRAGMENTS / CONTEXT / 01</div><svg viewBox="0 0 120 120" class="gte-cross" aria-hidden="true"><path d="M60 5v110M5 60h110M21 21l78 78M99 21 21 99"/></svg></div>'+
'<p class="gte-art-caption">A closer look at the system, product, and constraints behind the challenge.</p>'+
'</section>'+
'<section class="gte-narrative gte-reveal"><div class="gte-narrative-num">03<span>/ THE MOVE</span></div><div class="gte-narrative-content"><h2>'+esc(c.beats[1])+'</h2><p>'+esc(items[1]?.body)+'</p></div></section>'+
'<section class="gte-spread gte-spread--two gte-reveal"><div class="gte-section-label">'+mini(4,'DESIGN IN ACTION')+'<strong>'+esc(c.beats[2])+'</strong></div>'+
'<div class="gte-artboard gte-artboard--two"><span class="gte-layer-label">ITERATE / ALIGN / SHIP</span><div class="gte-image gte-image--cut">'+pic(2)+'</div><div class="gte-image gte-image--slice">'+pic(3)+'</div><div class="gte-image gte-image--floating">'+pic(4)+'</div><div class="gte-type-ribbon">'+esc(c.beats[2])+'</div></div>'+
'<div class="gte-detail-strip"><span class="gte-eyebrow">DESIGN DECISIONS INTO PRODUCT REALITY</span><div class="gte-detail-art">'+pic(5)+'</div><p>Selected artifacts from the original project, recontextualized as an editorial visual narrative.</p></div>'+
'</section>'+
'<section class="gte-impact gte-reveal" aria-label="Project impact"><span class="gte-eyebrow">05 / WHY IT MATTERED</span><h2>'+esc(c.beats[2])+'</h2><p class="gte-impact-copy">'+esc(items[2]?.body)+'</p>'+
(impact.length?'<div class="gte-metrics">'+impact.map(x=>'<div><strong>'+esc(x.number)+'</strong><span>'+esc(x.label)+'</span></div>').join('')+'</div>':'')+
(thesisText?'<blockquote>'+esc(thesisText)+'</blockquote>':'')+'</section>';
intro.after(chapters);
for(const el of [signals,thesis,facts])if(el)el.remove();
const archive=document.createElement('details');archive.className='gte-archive';
const summary=document.createElement('summary');summary.innerHTML='<span class="gte-eyebrow">06 / THE ORIGINAL MATERIAL</span><strong>EXPLORE THE ARTIFACTS</strong>'+arrow+'<small>Original product screens, process documentation, and detailed visual evidence</small>';
heading.before(archive);archive.append(summary,heading,gallery);
archive.addEventListener('toggle',()=>{if(archive.open){requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('scroll'))})}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){const nodes=[...chapters.querySelectorAll('.gte-reveal')];const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('gte-visible');obs.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -50px 0px'});nodes.forEach(el=>obs.observe(el));}
else chapters.querySelectorAll('.gte-reveal').forEach(el=>el.classList.add('gte-visible'));
chapters.querySelectorAll('img').forEach(el=>el.addEventListener('error',()=>el.closest('.gte-image,.gte-detail-art')?.classList.add('gte-missing'),{once:true}));
})();