import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-500.css';
import '@fontsource/geist/latin-600.css';
import './style.css';
import downRight from '@phosphor-icons/core/assets/regular/arrow-down-right.svg?raw';
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import caret from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import house from '@phosphor-icons/core/assets/regular/house.svg?raw';
import key from '@phosphor-icons/core/assets/regular/key.svg?raw';
import bank from '@phosphor-icons/core/assets/regular/bank.svg?raw';
import shield from '@phosphor-icons/core/assets/regular/shield-check.svg?raw';
import sun from '@phosphor-icons/core/assets/regular/sun.svg?raw';
import moon from '@phosphor-icons/core/assets/regular/moon.svg?raw';
import list from '@phosphor-icons/core/assets/regular/list.svg?raw';
import close from '@phosphor-icons/core/assets/regular/x.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import { properties, services, sourceDate } from './data.js';
import { renderPage, setupPage } from './pages.js';
import { initMotion, scrollToTarget, closeFaq } from './motion.js';

const app = document.querySelector('#app');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = svg => `<span class="icon" aria-hidden="true">${svg}</span>`;
const img = (name,alt,cls='',eager=false) => `<img src="/assets/${name}.webp" alt="${esc(alt)}" class="${cls}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''} decoding="async" width="1400" height="1050">`;
const button = (href,text,variant='') => `<a class="button ${variant}" href="${href}"><span class="button-label">${text}</span><span class="button-icon" aria-hidden="true">${downRight}</span></a>`;
const logo = `<span class="brand-dot" aria-hidden="true"></span><span>basalic<span class="brand-partner"> &amp; partner</span></span>`;
let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
let cleanupMotion = ()=>{};
let cleanupPage = ()=>{};
let cleanupHome = ()=>{};
document.documentElement.dataset.theme = theme;

function header(path){
 return `<header class="site-header"><a class="brand" href="/" aria-label="Basalic & Partner – Startseite">${logo}</a>
 <nav class="desktop-nav" aria-label="Hauptnavigation">
  <div class="nav-dropdown"><button type="button" class="nav-trigger" aria-expanded="false" aria-controls="services-menu">Leistungen ${icon(caret)}</button><div class="nav-menu" id="services-menu" hidden>${services.map(s=>`<a href="${s.path}" ${path===s.path?'aria-current="page"':''}>${s.title} ${icon(arrowRight)}</a>`).join('')}</div></div>
  <div class="nav-dropdown"><button type="button" class="nav-trigger" aria-expanded="false" aria-controls="company-menu">Unternehmen ${icon(caret)}</button><div class="nav-menu" id="company-menu" hidden><a href="/ueber-uns">Über uns ${icon(arrowRight)}</a><a href="/kontakt">Kontakt ${icon(arrowRight)}</a><a href="/immobilien?status=sold">Verkaufte Referenzen ${icon(arrowRight)}</a></div></div>
  <a href="/immobilien" ${path.startsWith('/immobilien')?'aria-current="page"':''}>Immobilien</a>
 </nav>
 <div class="header-contact">${button('/kontakt','Kontakt')}</div>
 <button type="button" class="mobile-toggle" aria-controls="mobile-nav" aria-expanded="false" aria-label="Menü öffnen">${icon(list)}</button>
 <nav id="mobile-nav" class="mobile-nav" aria-label="Mobile Navigation" hidden>${[...services.map(s=>[s.path,s.title]),['/ueber-uns','Über uns'],['/kontakt','Kontakt']].map(([href,label])=>`<a href="${href}">${label} ${icon(arrowRight)}</a>`).join('')}</nav>
 </header>`;
}

const references = ['referenz-plochingen','referenz-eislingen','referenz-uhingen','referenz-eislingen-garten'].map(id=>properties.find(p=>p.id===id));
const faqItems = [
 ['Welche Leistungen bietet Basalic & Partner?','Wir begleiten Sie rund um Immobilien, Mietverwaltung, Finanzierung und Vorsorge. Senad Basalic ist Immobilienmakler, Immobiliardarlehensvermittler und Versicherungsmakler.'],
 ['Ich suche eine Immobilie. Wie fange ich an?','Sehen Sie sich unsere Immobilien an und sprechen Sie uns auf Ihre Wünsche an. Gemeinsam erstellen wir ein persönliches Profil für Ihre Suche.'],
 ['Kann ich auch meine eigene Immobilie verkaufen?','Ja. Wir begleiten Sie auch beim Verkauf Ihres Objekts. Nehmen Sie Kontakt auf und erzählen Sie uns von Ihrer Immobilie.'],
 ['Was umfasst die Mietverwaltung?','Wir unterstützen Kapitalanleger und vertreten Vermieter in ihren Angelegenheiten. Welche Unterstützung Sie wünschen, besprechen wir persönlich.'],
 ['Wie erreiche ich Senad Basalic?','Per E-Mail an info@basalic.de oder telefonisch unter +49 178 6654819. Für Immobilien schreiben Sie an immobilien@basalic.de, für Finanzierungsfragen an finanzierung@basalic.de.']
];
function home(){
 const first=properties.find(p=>p.id==='faurndau');
 return `<main id="main" tabindex="-1">
 <section class="hero" data-parallax-hero>
  <div class="hero-landscape" aria-hidden="true"><div class="hero-background">${img('hero-original','')}</div><div class="hero-wash"></div><div class="hero-grain"></div></div>
  <div class="hero-content"><span class="hero-badge hero-reveal">Göppingen &amp; die Region <span aria-hidden="true">✦</span></span>
   <h1 class="hero-reveal">Ihr Zuhause.<br>Ihre <em>Zukunft.</em></h1>
   <p class="hero-reveal">Immobilien, Mietverwaltung, Finanzierung und Vorsorge.<br class="desktop-break"> Persönlich für Sie da. Seit 2001.</p>
   <div class="hero-reveal">${button('/kontakt','Pläne besprechen','hero-button')}</div>
  </div>
  <div class="showcase container" aria-label="Ausgewählte Immobilien">
   <div class="showcase-header"><a class="showcase-brand" href="/immobilien">${icon(house)} Immobilien entdecken</a><span>Göppingen &amp; die Region</span><a href="/immobilien">Alle Objekte ${icon(arrowRight)}</a></div>
   <div class="showcase-grid"><a class="showcase-main" href="/immobilien/${first.id}">${img(first.image,first.kind+' in '+first.city,'',true)}<div class="showcase-property"><span>GÖPPINGEN-FAURNDAU</span><h2>Zwei Familien.<br>Viele Möglichkeiten.</h2><div><span>ca. 155 m² Wohnfläche</span><span>ca. 244 m² Grundstück</span>${icon(downRight)}</div></div></a>
    <div class="showcase-side"><div class="showcase-note"><span class="tiny-label">EINFACH INDIVIDUELL</span><h3>Ein Ort für<br>Ihre Pläne.</h3><p>Finden Sie Ihr Zuhause.<br>Wir begleiten Sie.</p></div>${properties.slice(1,3).map(p=>`<a class="showcase-small" href="/immobilien/${p.id}">${img(p.image,p.kind+' in '+p.city)}<span><strong>${p.city}</strong><small>${p.area} m² · ${p.kind}</small></span>${icon(arrowRight)}</a>`).join('')}</div>
   </div><div class="showcase-bottom"><span>7 Verkaufsangebote · 2 Auslandsobjekte</span><span>Quellenstand ${sourceDate}</span></div>
  </div>
  <div class="marquee" aria-label="Unser Berufsprofil"><div class="marquee-track">${[0,1].map(i=>`<div class="marquee-set" ${i?'aria-hidden="true"':''}>${[[house,'Immobilienmakler'],[key,'Mietverwalter'],[bank,'Immobiliardarlehensvermittler'],[shield,'Versicherungsmakler']].map(([svg,text])=>`<span>${icon(svg)}${text}</span>`).join('')}</div>`).join('')}</div></div>
 </section>
 <section class="statement-section container"><p data-word-reveal>Ein Zuhause finden. Eigentum verwalten. Eine Finanzierung planen. Für morgen vorsorgen. Was Sie auch vorhaben: Wir begleiten Sie persönlich und erklären komplexe Fragen verständlich.</p></section>
 <section class="bento-section container" id="leistungen" aria-label="Unsere vier Leistungen">
  <a class="bento-card bento-main reveal" href="/immobilien"><div class="bento-copy"><h2>Immobilien.<br>Raum für Ihre Pläne.</h2><p>Finden Sie eine passende Immobilie oder verkaufen Sie Ihr eigenes Objekt.</p>${icon(downRight)}</div><div class="bento-property">${img('neidlingen','Zweifamilienhaus mit Einliegerwohnung in Neidlingen')}<div><span>Neidlingen</span><strong>201 m². Viele Möglichkeiten.</strong><small>Zwei Wohnungen + Einliegerwohnung</small></div></div></a>
  <a class="bento-card bento-management reveal" href="/mietverwaltung"><div class="bento-copy"><h2>Mietverwaltung.<br>Freiheit für Eigentümer.</h2><p>Unterstützung für Kapitalanleger.<br>Vertretung Ihrer Interessen als Vermieter.</p>${icon(downRight)}</div><div class="management-visual" aria-hidden="true"><div>${icon(key)}<span>Ihr Eigentum.</span></div><div>${icon(check)}<span>Persönlich begleitet.</span></div><div>${icon(house)}<span>Mehr Freiraum.</span></div></div></a>
  <a class="bento-card bento-finance reveal" href="/finanzierung"><h2>Finanzierung.<br>Gut durchdacht.</h2><p>Baufinanzierung, Privatkredite und Umschuldung.</p>${img('finanzierung','Originales Modellhaus-Motiv zur Baufinanzierung')}${icon(downRight)}</a>
  <a class="bento-card bento-protection reveal" href="/vorsorge"><h2>Vorsorge.<br>Für Ihr Morgen.</h2><p>Absicherung und Altersvorsorge, die bei Ihren Fragen beginnen.</p><div class="protection-symbol" aria-hidden="true">${icon(shield)}<span>Krankheit · Berufsunfähigkeit<br>Pflege · Todesfall · Ruhestand</span></div>${icon(downRight)}</a>
 </section>
 <section class="reference-section"><div class="container"><h2 class="section-title reveal">Gute Räume.<br class="mobile-break"> <span>Erfolgreich vermittelt.</span></h2>
  <div class="reference-grid reveal"><div class="reference-choice"><div class="reference-tabs" role="tablist" aria-label="Verkaufte Immobilien">${references.map((p,i)=>`<button type="button" id="reference-tab-${i}" class="reference-tab ${i===0?'is-active':''}" data-reference="${i}" role="tab" aria-selected="${i===0}" aria-controls="reference-panel" tabindex="${i===0?0:-1}" aria-label="${p.kind} in ${p.city}, ${p.area} Quadratmeter">${img(p.image,'')}<span class="reference-ring" aria-hidden="true"></span></button>`).join('')}</div><button class="reference-pause" type="button" aria-pressed="false">Automatischen Wechsel pausieren</button></div>
   <div id="reference-panel" class="reference-panel" role="tabpanel" aria-labelledby="reference-tab-0">${referencePanel(references[0])}</div>
  </div><div class="reference-cities">${references.map((p,i)=>`<button type="button" data-reference-city="${i}" aria-label="${p.city}, ${p.area} Quadratmeter, verkaufte Referenz" class="${i===0?'is-active':''}">${p.city} ${icon(arrowRight)}</button>`).join('')}</div><a class="subtle-link" href="/immobilien?status=sold">Alle 40 verkauften Referenzen ansehen ${icon(arrowRight)}</a>
 </div></section>
 <section class="timeline-section container"><div class="timeline-intro"><h2 class="section-title">Was Sie<br><em>vorhaben.</em></h2><p>Von der Suche nach Ihrer Immobilie bis zu Finanzierung und Vorsorge: Wir denken Ihre Fragen zusammen.</p>${button('/kontakt','Darüber sprechen')}</div>
  <div class="timeline-steps"><div class="timeline-track" aria-hidden="true"><span class="timeline-fill"></span></div>
   ${[[house,'Eine Immobilie finden.','Was macht Ihr Zuhause aus? Wir sprechen über Ihre Wünsche und erstellen gemeinsam Ihr persönliches Suchprofil.','/immobilien','Immobilien entdecken'],[key,'Eigentum weiterdenken.','Sie möchten verkaufen oder Unterstützung als Vermieter? Wir begleiten Sie beim Verkauf und vertreten Ihre Anliegen in der Mietverwaltung.','/mietverwaltung','Mietverwaltung kennenlernen'],[shield,'Zukunft im Blick behalten.','Bankkooperationen für Ihre Baufinanzierung. Beratung zu Versorgungslücken und Altersvorsorge. Persönlich und verständlich.','/finanzierung','Finanzierung kennenlernen']].map(([svg,title,text,href,label])=>`<article class="timeline-step reveal"><span class="timeline-icon">${icon(svg)}</span><div><h3>${title}</h3><p>${text}</p><a class="subtle-link" href="${href}">${label} ${icon(arrowRight)}</a></div></article>`).join('')}
  </div>
 </section>
 <section class="contact-paths container" id="kontaktwege"><div class="centered-heading reveal"><span class="section-kicker">Ihr direkter Kontakt</span><h2>Ihr Anliegen.<br>Die richtige <em>Verbindung.</em></h2><p>Eine Frage genügt für den ersten Schritt.</p></div>
  <div class="contact-card-grid">${[
   {title:'Immobilien',heading:'Ein Zuhause.',email:'immobilien@basalic.de',path:'/immobilien',list:['Immobilie finden','Eigenes Objekt verkaufen','Angebote & Referenzen']},
   {title:'Finanzierung',heading:'Ein guter Plan.',email:'finanzierung@basalic.de',path:'/finanzierung',list:['Baufinanzierung','Privatkredite & Umschuldung','Kooperationen mit Banken']},
   {title:'Verwaltung & Vorsorge',heading:'Ihr Freiraum.',email:'info@basalic.de',path:'/vorsorge',list:['Kapitalanleger & Vermieter','Absicherung','Altersvorsorge']}
  ].map((c,i)=>`<article class="contact-card ${i===1?'is-featured':''} reveal">${i===1?'<span class="card-top-label">PERSÖNLICH BESPRECHEN</span>':''}<h3>${c.title}</h3><p class="contact-card-title">${c.heading}</p><a class="contact-email" href="mailto:${c.email}">${c.email}</a>${button('/kontakt?thema='+encodeURIComponent(i===2?'Allgemeine Anfrage':c.title),'Kontakt aufnehmen')}<span class="card-list-label">Darum geht es:</span><ul>${c.list.map(t=>`<li>${icon(check)}${t}</li>`).join('')}</ul><a class="subtle-link" href="${c.path}">Mehr erfahren ${icon(arrowRight)}</a></article>`).join('')}
  </div>
 </section>
 <section class="home-about container reveal"><div>${img('senad-basalic','Senad Basalic, geboren in Göppingen und seit 2001 am Markt tätig')}</div><article><span class="section-kicker">Senad Basalic &amp; Partner</span><h2>Einfach<br><em>individuell.</em></h2><p>In Göppingen geboren. Seit 2001 am Markt. Als Immobilienmakler, Immobiliardarlehensvermittler und Versicherungsmakler erklärt Senad Basalic komplexe Finanzfragen verständlich.</p><p>Mit zahlreichen Kooperationen und Partnern, wenn möglich aus der Region. Und als IHK-Ausbildungsbetrieb mit Erfahrung, die weitergegeben wird.</p>${button('/ueber-uns','Lernen Sie uns kennen')}</article></section>
 <section class="faq-section container"><div class="centered-heading reveal"><span class="section-kicker">Häufige Fragen</span><h2>Was Sie<br><em>wissen möchten.</em></h2><p>Noch eine Frage offen? Sprechen Sie uns an.</p><div class="faq-actions">${button('/kontakt','Kontakt aufnehmen')}<a href="mailto:info@basalic.de" class="subtle-link">E-Mail schreiben ${icon(arrowRight)}</a></div></div><div class="faq-list">${faqItems.map(([q,a],i)=>`<details class="faq-item reveal" ${i===0?'open':''}><summary>${q}${icon(caret)}</summary><div><p>${a}</p></div></details>`).join('')}</div></section>
 </main>`;
}
function referencePanel(p){return `<span class="section-kicker">Verkauft · Referenz</span><h3>${p.kind} in ${p.city}.</h3><p>${p.area?p.area+' m² Fläche · ':''}${p.features.slice(0,2).join(' · ')}</p><a class="subtle-link" href="/immobilien/${p.id}">Diese Referenz ansehen ${icon(arrowRight)}</a>`;}
function footer(){return `<footer class="site-footer"><section class="footer-cta container reveal"><div class="footer-landscape" aria-hidden="true">${img('hero-original','')}</div><div class="footer-cta-copy"><h2>Ihre Pläne.<br>Unser nächstes <em>Gespräch.</em></h2><form id="quick-contact" class="quick-contact"><label class="sr-only" for="quick-email">Ihre E-Mail-Adresse</label><input id="quick-email" name="email" type="email" placeholder="Ihre E-Mail-Adresse" autocomplete="email" required><button class="button" type="submit"><span class="button-label">Kontakt aufnehmen</span><span class="button-icon" aria-hidden="true">${downRight}</span></button></form><p>Weiter zur Kontaktseite. Diese Eingabe versendet keine Nachricht.</p></div></section>
 <div class="footer-base"><div class="container footer-grid"><div><a class="brand" href="/" aria-label="Basalic & Partner – Startseite">${logo}</a><p>Senad Basalic &amp; Partner<br>Einfach individuell. Seit 2001.</p><a href="tel:+491786654819">+49 178 6654819</a><a href="mailto:info@basalic.de">info@basalic.de</a></div><nav aria-label="Leistungen"><h3>Leistungen</h3>${services.map(s=>`<a href="${s.path}">${s.title}</a>`).join('')}</nav><nav aria-label="Unternehmen"><h3>Unternehmen</h3><a href="/ueber-uns">Über uns</a><a href="/kontakt">Kontakt</a><a href="/immobilien?status=sold">Verkaufte Referenzen</a></nav><nav aria-label="Informationen"><h3>Informationen</h3><a href="/impressum">Impressum · Entwurf</a><a href="/datenschutz">Datenschutz · Entwurf</a><a href="/erstinformationen">Erstinformationen</a><a href="/barrierefreiheit">Barrierefreiheit</a><a href="/bildnachweise">Bildnachweise</a></nav></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Senad Basalic &amp; Partner.</span><span>Lokale Gestaltungsvorschau · Quellenstand ${sourceDate}</span></div></div></footer>`;}

function setupHeader(){
 const toggles=[...document.querySelectorAll('.nav-trigger')];
 const closeMenus=()=>toggles.forEach(t=>{t.setAttribute('aria-expanded','false');document.getElementById(t.getAttribute('aria-controls')).hidden=true;});
 toggles.forEach(t=>t.addEventListener('click',()=>{const open=t.getAttribute('aria-expanded')!=='true';closeMenus();t.setAttribute('aria-expanded',String(open));document.getElementById(t.getAttribute('aria-controls')).hidden=!open;}));
 const mobile=document.querySelector('.mobile-toggle');
 const mobileNav=document.querySelector('#mobile-nav');
 mobile.addEventListener('click',()=>{const open=mobile.getAttribute('aria-expanded')!=='true';mobile.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');mobile.innerHTML=icon(open?close:list);mobileNav.hidden=!open;});
 document.onkeydown=e=>{if(e.key==='Escape'){const open=toggles.find(t=>t.getAttribute('aria-expanded')==='true');closeMenus();if(open)open.focus();if(!mobileNav.hidden){mobileNav.hidden=true;mobile.setAttribute('aria-expanded','false');mobile.setAttribute('aria-label','Menü öffnen');mobile.innerHTML=icon(list);mobile.focus();}}};
 document.querySelector('#quick-contact').addEventListener('submit',e=>{e.preventDefault();const email=new FormData(e.currentTarget).get('email');navigate('/kontakt?email='+encodeURIComponent(email));});
}
function setupHome(){
 const tabs=[...document.querySelectorAll('[data-reference]')];
 const cities=[...document.querySelectorAll('[data-reference-city]')];
 let active=0,elapsed=0,last=0,raf=0,manualPause=false;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let reduce=preference.matches;
 const panel=document.querySelector('#reference-panel');
 const pause=document.querySelector('.reference-pause');
 if(pause){pause.hidden=reduce;pause.addEventListener('click',()=>{manualPause=!manualPause;pause.setAttribute('aria-pressed',String(manualPause));pause.textContent=manualPause?'Automatischen Wechsel fortsetzen':'Automatischen Wechsel pausieren';});}
 document.querySelectorAll('.faq-item').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.faq-item').forEach(other=>{if(other!==d)closeFaq(other);});}));
 const setActive=(index,focus=false)=>{
  active=(index+references.length)%references.length;elapsed=0;
  tabs.forEach((t,i)=>{t.classList.toggle('is-active',i===active);t.setAttribute('aria-selected',String(i===active));t.tabIndex=i===active?0:-1;t.style.setProperty('--progress','0');});
  cities.forEach((t,i)=>t.classList.toggle('is-active',i===active));
  panel.innerHTML=referencePanel(references[active]);panel.setAttribute('aria-labelledby','reference-tab-'+active);
  if(!reduce)panel.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.23,1,.32,1)'});
  if(focus)tabs[active].focus();
 };
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>setActive(i));t.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();setActive(e.key==='Home'?0:e.key==='End'?3:active+(e.key==='ArrowRight'?1:-1),true);}});});
 cities.forEach((t,i)=>t.addEventListener('click',()=>setActive(i)));
 const section=document.querySelector('.reference-section');
 const tick=now=>{const rect=section.getBoundingClientRect();const paused=manualPause||section.matches(':hover')||section.contains(document.activeElement)||document.hidden||rect.bottom<0||rect.top>innerHeight;if(last&&!paused)elapsed+=Math.min(now-last,100);last=now;tabs[active].style.setProperty('--progress',String(Math.min(elapsed/10000,1)));if(elapsed>=10000)setActive(active+1);raf=requestAnimationFrame(tick);};
 if(!reduce)raf=requestAnimationFrame(tick);
 const onPreference=()=>{reduce=preference.matches;cancelAnimationFrame(raf);last=0;if(pause)pause.hidden=reduce;if(!reduce)raf=requestAnimationFrame(tick);};
 preference.addEventListener('change',onPreference);
 return()=>{cancelAnimationFrame(raf);preference.removeEventListener('change',onPreference);};
}
function normalizePath(){let path=decodeURI(location.pathname).replace(/\/$/,'')||'/';const aliases={'/Immobilien':'/immobilien','/Mietverwaltung':'/mietverwaltung','/Vorsorge':'/vorsorge','/about':'/ueber-uns'};if(aliases[path]){path=aliases[path];history.replaceState({},'',path+location.search+location.hash);}return path;}
function navigate(url){cleanupMotion();window.scrollTo({top:0,left:0,behavior:'instant'});history.pushState({},'',url);render();if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)scrollToTarget(target);}else window.scrollTo({top:0,behavior:'instant'});document.querySelector('#main')?.focus({preventScroll:true});}
function render(){
 cleanupMotion();cleanupPage();cleanupHome();
 const path=normalizePath();
 const page=path==='/'?{html:home(),title:'Einfach individuell'}:renderPage(path,location.search);
 const body=page||{html:`<main id="main" tabindex="-1" class="not-found container"><span class="section-kicker">Seite nicht gefunden</span><h1>Hier geht es<br><em>weiter.</em></h1><p>Diese Seite ist nicht vorhanden. Finden Sie Ihren Weg zurück.</p>${button('/','Zur Startseite')}</main>`,title:'Seite nicht gefunden'};
 app.innerHTML=header(path)+body.html+footer();document.title=body.title+' · Senad Basalic & Partner';
 setupHeader();cleanupPage=setupPage(path)||(()=>{});cleanupHome=path==='/'?setupHome():(()=>{});
 cleanupMotion=initMotion({isHome:path==='/'});
 const themeToggle=document.querySelector('#theme-toggle');themeToggle.innerHTML=icon(theme==='dark'?sun:moon);themeToggle.setAttribute('aria-label',theme==='dark'?'Helles Design aktivieren':'Dunkles Design aktivieren');
}
const themeButton=document.createElement('button');themeButton.id='theme-toggle';themeButton.className='theme-toggle';themeButton.type='button';themeButton.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;themeButton.innerHTML=icon(theme==='dark'?sun:moon);themeButton.setAttribute('aria-label',theme==='dark'?'Helles Design aktivieren':'Dunkles Design aktivieren');});document.body.appendChild(themeButton);
document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach(t=>{t.setAttribute('aria-expanded','false');document.getElementById(t.getAttribute('aria-controls')).hidden=true;});const a=e.target.closest('a');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;const url=new URL(a.href);if(url.origin!==location.origin||!['http:','https:'].includes(url.protocol))return;if(url.pathname===location.pathname&&url.search===location.search&&url.hash){const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(target){e.preventDefault();history.pushState({},'',url.pathname+url.search+url.hash);scrollToTarget(target);if(target.id==='main')target.focus({preventScroll:true});}return;}e.preventDefault();navigate(url.pathname+url.search+url.hash);});
window.addEventListener('popstate',()=>render());
render();
