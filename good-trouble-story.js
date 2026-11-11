
/* Good Trouble / Guided Stories — a narrative, not an image gallery. */
(()=>{'use strict';
const root=document.getElementById('case-root');if(!root)return;
const id=new URLSearchParams(location.search).get('id')||'meta-inevitable';
const configuration={
'meta-inevitable':{family:'systems',tone:'BLUEPRINT FOR BETTER',steps:['MAKE THE COMPLEXITY VISIBLE','TURN JUDGMENT INTO SHARED GUIDANCE','LET THE SYSTEM COMPOUND'],assets:['gallery-01-item-01.png','gallery-03-item-01.png','gallery-05-item-01.png'],accent:'#292cff'},
'meta-consistency':{family:'systems',tone:'CONSISTENCY WITH ROOM TO MOVE',steps:['UNDERSTAND THE DIFFERENCES','FIND THE SHARED PATTERN','LEAVE ROOM FOR THE REAL WORLD'],assets:['gallery-01-item-01.png','gallery-03-item-01.png','gallery-05-item-01.png'],accent:'#292cff'},
'meta-clutter':{family:'systems',tone:'LESS, BUT BETTER',steps:['SEE WHAT WAS COMPETING','RESTORE A CLEAR HIERARCHY','MAKE THE PATTERN REPEATABLE'],assets:['gallery-01-item-01.png','gallery-03-item-01.png','gallery-05-item-01.png'],accent:'#292cff'},
'citi-platform':{family:'architecture',tone:'A FOUNDATION FOR MANY FUTURES',steps:['FIND THE COMMON FOUNDATION','CREATE SPACE FOR MANY PRODUCTS','MAKE THE SYSTEM WORK AT SCALE'],assets:['gallery-01-item-01.png','gallery-01-item-11.png','gallery-02-item-02.png'],accent:'#255ce7'},
'citi-guidance':{family:'architecture',tone:'MAKING MONEY MAKE SENSE',steps:['START WITH CUSTOMER QUESTIONS','MAKE THE NEXT STEP UNDERSTANDABLE','BRING GUIDANCE INTO THE PRODUCT'],assets:['gallery-01-item-01.png','gallery-02-item-01.png','gallery-04-item-01.png'],accent:'#255ce7'},
'feelmore-wellness':{family:'human',tone:'FROM DEVICE TO DAILY RITUAL',steps:['INTRODUCE SOMETHING NEW','DESIGN A CALMER ONBOARDING','BUILD A REASON TO RETURN'],assets:['screen-01.png','screen-06.png','screen-11.png'],accent:'#df4592'},
'feelmore-confidence':{family:'human',tone:'UNDERSTANDING BUILDS CONFIDENCE',steps:['MAKE THE UNFAMILIAR CLEAR','ANSWER QUESTIONS THROUGH DESIGN','EARN TRUST BEFORE CONVERSION'],assets:['gallery-01-item-01.png','gallery-03-item-01.png','gallery-05-item-01.png'],accent:'#df4592'},
'weight-watchers':{family:'brand',tone:'A BRAND PEOPLE CAN USE',steps:['MAKE THE NEW IDENTITY TANGIBLE','CONNECT THE PRODUCT EXPERIENCES','BUILD A SHARED VISUAL STANDARD'],assets:['gallery-01-item-01.png','gallery-03-item-01.png','gallery-05-item-01.png'],accent:'#f46a2b'}
};
const config=configuration[id];if(!config)return;
const intro=document.querySelector('.case-intro-v3');
const facts=document.querySelector('.case-facts');
const signals=document.querySelector('.case-signals');
const thesis=document.querySelector('.case-thesis');
const gallery=document.querySelector('.case-gallery');
const galleryHeading=document.querySelector('.case-gallery-heading');
if(!intro||!facts||!gallery||!galleryHeading)return;
const factText=[...facts.querySelectorAll(':scope > div')].map(el=>el.querySelector('p')?.textContent?.trim()||'');
const metrics=[...(signals?.querySelectorAll(':scope > div')||[])].map(el=>({value:el.querySelector('strong')?.textContent?.trim()||'',label:el.querySelector('span')?.textContent?.trim()||''})).filter(m=>m.value&&m.label);
const thesisCopy=thesis?.querySelector('blockquote')?.textContent?.trim()||'';
const safe=t=>String(t||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const arrow='<svg viewBox="0 0 28 28" aria-hidden="true" class="gts-icon"><path d="M5 23L23 5M9 5h14v14"/></svg>';
const src=i=>'assets/cases/'+id+'/'+config.assets[i];
const chapter=(i)=>{
  const n=i+1;const variant=['scene','focus','proof'][i];
  return '<section class="gts-chapter gts-'+variant+'" aria-labelledby="gts-title-'+n+'">'+
    '<div class="gts-chapter-head"><span class="gts-meta">0'+n+' / '+['THE CHALLENGE','THE RESPONSE','THE RESULT'][i]+'</span><span class="gts-meta">'+safe(config.tone)+'</span></div>'+
    '<div class="gts-chapter-layout">'+
      '<div class="gts-chapter-copy"><div class="gts-chapter-number" aria-hidden="true">0'+n+'</div><h2 id="gts-title-'+n+'">'+safe(config.steps[i])+'</h2><p>'+safe(factText[i])+'</p></div>'+
      '<figure class="gts-artifact"><div class="gts-artifact-stage"><img src="'+src(i)+'" loading="lazy" decoding="async" alt="Original '+safe(id.replace(/-/g,' '))+' project work illustrating '+safe(config.steps[i].toLowerCase())+'"></div><figcaption><span class="gts-meta">ACTUAL PROJECT ARTIFACT / 0'+n+'</span><span class="gts-meta">DESIGN EVIDENCE</span></figcaption></figure>'+
    '</div></section>';
};
const story=document.createElement('div');story.className='gts-story gts-'+config.family;story.style.setProperty('--gts-accent',config.accent);
story.innerHTML=
'<div class="gts-prologue"><span class="gts-meta">THE STORY BEHIND THE SCREENS</span><h2>'+safe(config.tone)+'</h2><p>What needed to change, how the design moved forward, and why the work mattered.</p><nav aria-label="Jump to project chapters"><a href="#gts-title-1">01 / Challenge</a><a href="#gts-title-2">02 / Response</a><a href="#gts-title-3">03 / Result</a></nav></div>'+
chapter(0)+chapter(1)+chapter(2)+
'<section class="gts-conclusion" aria-label="Project takeaway"><span class="gts-meta">WHAT THIS WORK MADE POSSIBLE</span>'+
(thesisCopy?'<blockquote>'+safe(thesisCopy)+'</blockquote>':'')+
(metrics.length?'<div class="gts-metrics">'+metrics.map(m=>'<div><strong>'+safe(m.value)+'</strong><span>'+safe(m.label)+'</span></div>').join('')+'</div>':'')+
'</section>';
intro.after(story);
for(const old of [facts,signals,thesis])old?.remove();
const archive=document.createElement('details');archive.className='gts-archive';
const summary=document.createElement('summary');summary.innerHTML='<span class="gts-meta">OPTIONAL DEEP DIVE / ORIGINAL WORK</span><strong>EXPLORE THE ARTIFACTS</strong>'+arrow+'<span class="gts-archive-description">Detailed screens, intermediate explorations, and source project materials</span>';
galleryHeading.before(archive);
archive.append(summary,gallery); galleryHeading.remove();
archive.addEventListener('toggle',()=>{if(archive.open)requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('scroll'))})});
story.querySelectorAll('.gts-artifact img').forEach(img=>{
 const update=()=>{
   const shell=img.closest('.gts-artifact');
   if(!shell||!img.naturalWidth||!img.naturalHeight)return;
   const ratio=img.naturalWidth/img.naturalHeight;
   shell.classList.add(ratio<.78?'gts-portrait':ratio>1.25?'gts-wide':'gts-near-square');
   shell.style.setProperty('--gts-image-ratio',ratio.toFixed(5));
 };
 if(img.complete&&img.naturalWidth)update();else img.addEventListener('load',update,{once:true});
 img.addEventListener('error',()=>img.closest('.gts-artifact')?.classList.add('gts-missing'),{once:true});
});
})();