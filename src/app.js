import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-500.css';
import '@fontsource/geist/latin-600.css';
import './style.css';
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import caret from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import house from '@phosphor-icons/core/assets/regular/house.svg?raw';
import key from '@phosphor-icons/core/assets/regular/key.svg?raw';
import bank from '@phosphor-icons/core/assets/regular/bank.svg?raw';
import shield from '@phosphor-icons/core/assets/regular/shield-check.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import plus from '@phosphor-icons/core/assets/regular/plus.svg?raw';
import pauseIcon from '@phosphor-icons/core/assets/regular/pause.svg?raw';
import playIcon from '@phosphor-icons/core/assets/regular/play.svg?raw';
import { services } from './data.js';
import { loadPublicProperties, propertyCity, propertyForPath, propertyLabel, publishedProperties as properties } from './public-properties.js';
import { renderPage, setupPage } from './pages.js';
import { initMotion, scrollToTarget, closeFaq } from './motion.js';
import { initFinanceReferences } from './finance-carousel.js';
import { imageMarkup } from './media.js';
import { updateSeo } from './seo.js';
import { routeAliases, routePath, setSiteLinks, sitePath } from './site-paths.js';
import './finance.css';
import './finance-pages.css';
import './finance-motion.css';
import './finance-atmosphere.css';

const app = document.querySelector('#app');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = svg => `<span class="icon" aria-hidden="true">${svg}</span>`;
const img = (name,alt,cls='',eager=false,sizes='(max-width: 850px) 100vw, 50vw') => imageMarkup(name,alt,{className:cls,eager,sizes});
const button = (href,text,variant='') => `<a class="button ${variant}" href="${href}"><span class="button-label">${text}</span><span class="button-icon" aria-hidden="true">${arrowRight}</span></a>`;
const logo = `<span>basalic<span class="brand-partner"> &amp; partner</span></span>`;
const serviceNavigation = [{path:'/immobilien',title:'Immobilie finden'},{path:'/immobilie-verkaufen',title:'Immobilie verkaufen'},...services.filter(service=>service.path!=='/immobilien')];
let cleanupMotion = ()=>{};
let cleanupPage = ()=>{};
let cleanupHome = ()=>{};
let cleanupHeader = ()=>{};

function header(path){
 return `<header class="site-header"><a class="brand" href="/" aria-label="Basalic & Partner - Startseite">${logo}</a>
 <nav class="desktop-nav" aria-label="Hauptnavigation">
  <div class="nav-dropdown"><button type="button" class="nav-trigger" aria-expanded="false" aria-controls="services-menu">Leistungen ${icon(caret)}</button><div class="nav-menu" id="services-menu" hidden>${serviceNavigation.map(s=>`<a href="${s.path}" ${path===s.path?'aria-current="page"':''}>${s.title} ${icon(arrowRight)}</a>`).join('')}</div></div>
  <div class="nav-dropdown"><button type="button" class="nav-trigger" aria-expanded="false" aria-controls="company-menu">Unternehmen ${icon(caret)}</button><div class="nav-menu" id="company-menu" hidden><a href="/ueber-uns">Über uns ${icon(arrowRight)}</a><a href="/kontakt">Kontakt ${icon(arrowRight)}</a><a href="/immobilien?status=sold">Verkaufte Referenzen ${icon(arrowRight)}</a></div></div>
  <a href="/immobilien" ${path.startsWith('/immobilien')?'aria-current="page"':''}>Immobilien</a>
 </nav>
 <div class="header-contact">${button('/kontakt','Kontakt')}</div>
 <button type="button" class="mobile-toggle" aria-controls="mobile-nav" aria-expanded="false" aria-label="Menü öffnen"><span class="menu-bars" aria-hidden="true"><span></span><span></span></span></button>
 <nav id="mobile-nav" class="mobile-nav" aria-label="Mobile Navigation" hidden>${[...serviceNavigation.map(s=>[s.path,s.title]),['/ueber-uns','Über uns'],['/kontakt','Kontakt']].map(([href,label])=>`<a href="${href}" ${path===href?'aria-current="page"':''}>${label} ${icon(arrowRight)}</a>`).join('')}</nav>
 </header>`;
}

const referenceHighlights = ['referenz-plochingen', 'referenz-eislingen', 'referenz-uhingen', 'referenz-eislingen-garten'];

function featuredReferences(sold) {
 const recent = sold.filter(property => property.soldAt);
 const highlights = referenceHighlights.map(id => sold.find(property => property.id === id)).filter(Boolean);
 return [...new Set([...recent, ...highlights, ...sold])].slice(0, 4);
}

function propertyPhoto(property, sizes) {
 return img(property.image, propertyLabel(property), '', false, sizes)
  || `<span class="finance-property-no-photo" aria-hidden="true">${icon(house)}</span>`;
}

function offerCard(property) {
 const area = property.area ? `${property.area} m² ${property.areaLabel || 'Wohnfläche'}` : property.kind;
 const city = propertyCity(property);
 return `<a href="/immobilien/${esc(property.id)}" class="finance-property reveal">
  <div class="finance-property-photo">${propertyPhoto(property, '(max-width: 700px) 90vw, 380px')}</div>
  <div class="finance-property-copy">${city ? `<span>${esc(city)}</span>` : ''}<h3>${esc(property.title)}</h3>
   <div><p>${esc(area)}</p>${icon(arrowRight)}</div>
  </div>
 </a>`;
}

function referenceCard(property) {
 const city = propertyCity(property);
 return `<a class="finance-reference" href="/immobilien/${esc(property.id)}">
  ${propertyPhoto(property, '(max-width: 700px) 80vw, 370px')}
  <div><span>Verkauft</span><h3>${esc(property.kind)}</h3>${city ? `<p>${esc(city)}</p>` : ''}
   ${property.area ? `<small>${esc(property.area)} m² Fläche</small>` : ''}${icon(arrowRight)}
  </div>
 </a>`;
}

const faqItems = [
 ['Welche Leistungen bietet Basalic & Partner?','Wir begleiten Sie rund um Immobilien, Mietverwaltung, Finanzierung und Vorsorge. Senad Basalic ist Immobilienmakler, Immobiliardarlehensvermittler und Versicherungsmakler.'],
 ['Ich suche eine Immobilie. Wie fange ich an?','Sehen Sie sich unsere Immobilien an und sprechen Sie uns auf Ihre Wünsche an. Gemeinsam erstellen wir ein persönliches Profil für Ihre Suche.'],
 ['Kann ich auch meine eigene Immobilie verkaufen?','Ja. Wir begleiten Sie beim Verkauf Ihres Objekts. Auf unserer <a href="/immobilie-verkaufen">Seite für Immobilienverkäufer</a> finden Sie den nächsten Schritt für Ihr Vorhaben.'],
 ['Was umfasst die Mietverwaltung?','Wir unterstützen Kapitalanleger und vertreten Vermieter in ihren Angelegenheiten. Welche Unterstützung Sie wünschen, besprechen wir persönlich.'],
 ['Wie erreiche ich Senad Basalic?','Per E-Mail an info@basalic.de oder telefonisch unter +49 178 6654819. Für Immobilien schreiben Sie an immobilien@basalic.de, für Finanzierungsfragen an finanzierung@basalic.de.']
];
function home(){
 const featured = properties.filter(property => property.status === 'offer').slice(0, 3);
 const sold = properties.filter(property => property.status === 'sold');
 const references = featuredReferences(sold);
 return `<main id="main" tabindex="-1" class="finance-home">
 <section class="finance-hero">
  <div class="finance-glow" aria-hidden="true"></div>
  <div class="finance-hero-inner container">
   <h1>Für Ihr Zuhause.<br> Und alles, was folgt.</h1>
   <p>Immobilien, Finanzierung, Mietverwaltung und Vorsorge.<br class="desktop-break"> Persönlich an Ihrer Seite. In Göppingen und der Region.</p>
   <div class="finance-hero-actions" role="group" aria-label="Ihr nächster Schritt">${button('/immobilien','Immobilie finden')}${button('/immobilie-verkaufen','Immobilie verkaufen','button-outline')}</div>
   <a class="finance-hero-finance" href="/finanzierung">Sie planen eine Finanzierung? ${icon(arrowRight)}</a>
  </div>
 </section>
 <nav class="finance-disciplines container" aria-label="Unsere Fachgebiete">${[[house,'Immobilien','/immobilien'],[key,'Mietverwaltung','/mietverwaltung'],[bank,'Finanzierung','/finanzierung'],[shield,'Vorsorge','/vorsorge']].map(([svg,title,path])=>`<a href="${path}">${icon(svg)}<span>${title}</span></a>`).join('')}</nav>
 ${featured.length ? `<section class="finance-offers container finance-section">
  <div class="finance-heading reveal"><h2>Ein neuer Ort.<br> Für Ihre nächsten Kapitel.</h2><p>Entdecken Sie ausgewählte Immobilien in unserer Region.</p></div>
  <div class="finance-offer-grid">${featured.map(offerCard).join('')}</div>
  <div class="finance-section-end"><a href="/immobilien" class="subtle-link">Alle Immobilien ansehen ${icon(arrowRight)}</a></div>
 </section>` : ''}
 <section class="finance-services container finance-section" id="leistungen">
  <div class="finance-heading reveal"><h2>Immobilien. Finanzen.<br> Zusammen gedacht.</h2><p>Vier Fachgebiete. Ein persönlicher Ansprechpartner.</p></div>
  <div class="finance-service-grid">
   <a class="finance-service service-property reveal" href="/immobilie-verkaufen"><div class="finance-service-copy">${icon(house)}<h3>Immobilien.<br> Mit Perspektive.</h3><p>Ein Zuhause suchen oder Eigentum verkaufen. Wir begleiten Ihren nächsten Schritt.</p><span class="subtle-link">Verkauf besprechen ${icon(arrowRight)}</span></div><div class="finance-service-image">${img('neidlingen','Zweifamilienhaus mit Einliegerwohnung in Neidlingen','',false,'(max-width: 700px) 90vw, 540px')}</div></a>
   <a class="finance-service service-finance reveal" href="/finanzierung"><div class="finance-service-copy">${icon(bank)}<h3>Finanzierung.<br> Gut durchdacht.</h3><p>Baufinanzierung, Privatkredite und Umschuldung. Ausgehend von Ihrem Vorhaben.</p><span class="subtle-link">Möglichkeiten besprechen ${icon(arrowRight)}</span></div><div class="finance-service-image">${img('services/finanzierung','Eine Frau und ein Mann besprechen einen Wohnungsgrundriss am Tisch','',false, '(max-width: 700px) 90vw, 450px')}<span class="image-disclosure">KI-generiertes Beispielbild</span></div></a>
   <a class="finance-service service-management reveal" href="/mietverwaltung"><div class="finance-service-copy">${icon(key)}<h3>Eigentum behalten.<br> Freiraum gewinnen.</h3><p>Mietverwaltung für Kapitalanleger und die Interessen von Vermietern.</p><span class="subtle-link">Mietverwaltung kennenlernen ${icon(arrowRight)}</span></div><div class="finance-service-image">${img('services/mietverwaltung','Helles Mehrfamilienhaus mit grauen Balkonen und Pflanzen','',false,'(max-width: 700px) 90vw, 450px')}<span class="image-disclosure">KI-generiertes Beispielbild</span></div></a>
   <a class="finance-service service-protection reveal" href="/vorsorge"><div class="finance-service-copy">${icon(shield)}<h3>Heute absichern.<br> An morgen denken.</h3><p>Absicherung und Altersvorsorge beginnen bei Ihrem Leben und Ihren Fragen.</p><span class="subtle-link">Vorsorge kennenlernen ${icon(arrowRight)}</span></div><div class="finance-service-image">${img('services/altersvorsorge','Ältere Frau beim Umtopfen in einer Gartenwerkstatt, zweite Person mit Tee im Hintergrund','',false,'(max-width: 700px) 90vw, 540px')}<span class="image-disclosure">KI-generiertes Beispielbild</span></div></a>
  </div>
 </section>
 <section class="finance-about container finance-section">
  <figure class="finance-about-photo reveal">${img('senad-basalic','Senad Basalic, Ihr persönlicher Ansprechpartner','',false,'(max-width: 700px) 90vw, 500px')}<figcaption>Senad Basalic <span>Immobilien. Finanzen. Zukunft.</span></figcaption></figure>
  <div class="finance-about-copy reveal"><span class="finance-eyebrow">Senad Basalic &amp; Partner</span><h2>Gute Beratung<br> beginnt mit Zuhören.</h2><p>Ein Zuhause, ein finanzieller Plan, ein gutes Gefühl für morgen. Was Sie beschäftigt, nehmen wir persönlich.</p><p>In Göppingen geboren und seit 2001 am Markt, verbindet Senad Basalic Immobilien, Finanzierung und Vorsorge. Verständlich erklärt und auf Ihre Fragen abgestimmt.</p><ul>${['Immobilienmakler und Mietverwalter','Immobiliardarlehensvermittler','Versicherungsmakler','IHK-Ausbildungsbetrieb'].map(t=>`<li>${icon(check)}${t}</li>`).join('')}</ul>${button('/ueber-uns','Lernen Sie uns kennen','button-outline')}</div>
 </section>
 <div class="finance-facts container" aria-label="Basalic & Partner in Zahlen und Fakten"><div><strong>2001</strong><span>Seitdem für Sie da</span></div><div><strong>4</strong><span>Fachgebiete, die zusammenpassen</span></div><div><strong>${sold.length}</strong><span>Verkaufte Immobilienreferenzen</span></div><div><strong>Göppingen</strong><span>Hier sind wir zu Hause</span></div></div>
 ${references.length ? `<section id="referenzen" class="finance-references finance-section">
  <div class="container"><div class="finance-heading reveal"><h2>Einblicke in<br> verkaufte Immobilien.</h2><p>Häuser und Wohnungen, die wir vermittelt haben.</p></div><div class="finance-reference-controls"><a href="/immobilien?status=sold" class="subtle-link">Alle verkauften Referenzen ${icon(arrowRight)}</a><div class="finance-reference-buttons"><button type="button" class="finance-slide-prev" aria-label="Vorherige Referenzen">${icon(arrowRight)}</button><button type="button" class="finance-slide-next" aria-label="Weitere Referenzen">${icon(arrowRight)}</button></div></div>
  <div class="finance-reference-track" tabindex="0" aria-label="Verkaufte Immobilien, horizontal scrollbar">${references.map(referenceCard).join('')}</div></div>
 </section>` : ''}
 <section class="finance-contact-paths container finance-section" id="kontaktwege">
  <div class="finance-heading reveal"><h2>Was haben Sie vor?</h2><p>Wählen Sie Ihr Anliegen. Wir besprechen den Rest persönlich.</p></div><div class="finance-contact-grid">${[
   {title:'Immobilien',heading:'Ein neues Zuhause.',email:'immobilien@basalic.de',cta:'Immobilienwunsch besprechen',list:['Immobilie finden','Eigentum verkaufen','Persönliches Suchprofil']},
   {title:'Finanzierung',heading:'Ein passender Plan.',email:'finanzierung@basalic.de',cta:'Finanzierung besprechen',list:['Baufinanzierung','Privatkredite','Umschuldung']},
   {title:'Verwaltung & Vorsorge',heading:'Ein guter Ausblick.',email:'info@basalic.de',cta:'Anliegen besprechen',list:['Mietverwaltung','Absicherung','Altersvorsorge']}
  ].map((c,i)=>`<article class="finance-contact-card ${i===1?'is-featured':''} reveal"><span>${c.title}</span><h3>${c.heading}</h3><a href="mailto:${c.email}" class="finance-email">${c.email}</a>${button('/kontakt?thema='+encodeURIComponent(i===2?'Allgemeine Anfrage':c.title),c.cta,i===1?'':'button-outline')}<ul>${c.list.map(t=>`<li>${icon(check)}${t}</li>`).join('')}</ul></article>`).join('')}</div>
 </section>
 <section class="finance-faq container finance-section"><div class="finance-heading reveal"><h2>Ihre Fragen.<br> Unsere Antworten.</h2><p>Der erste Schritt ist oft eine gute Frage.</p></div><div class="faq-list">${faqItems.map(([q,a])=>`<details class="faq-item"><summary>${q}${icon(plus)}</summary><div><p>${a}</p></div></details>`).join('')}</div><p class="finance-faq-end">Noch etwas offen? <a href="/kontakt">Sprechen Sie uns an. ${icon(arrowRight)}</a></p></section>
 </main>`;
}
function footer(path){return `<footer class="site-footer">${path === '/kontakt' ? '' : `<section class="footer-cta container"><div class="finance-glow" aria-hidden="true"></div><div class="footer-cta-copy"><h2>Ihre Zukunft beginnt<br> mit einem Gespräch.</h2>${button('/kontakt','Kontakt aufnehmen')}</div></section>`}
 <div class="footer-base"><div class="container footer-grid"><div><a class="brand" href="/" aria-label="Basalic & Partner - Startseite">${logo}</a><p>Senad Basalic &amp; Partner<br> Einfach individuell. Seit 2001.</p><a href="tel:+491786654819">+49 178 6654819</a><a href="mailto:info@basalic.de">info@basalic.de</a></div><nav aria-label="Leistungen"><h3>Leistungen</h3>${serviceNavigation.map(s=>`<a href="${s.path}">${s.title}</a>`).join('')}</nav><nav aria-label="Unternehmen"><h3>Unternehmen</h3><a href="/ueber-uns">Über uns</a><a href="/kontakt">Kontakt</a><a href="/immobilien?status=sold">Verkaufte Referenzen</a></nav><nav aria-label="Informationen"><h3>Informationen</h3><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/erstinformationen">Erstinformationen</a><a href="/barrierefreiheit">Barrierefreiheit</a><a href="/bildnachweise">Bildnachweise</a></nav></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Senad Basalic &amp; Partner</span><span>Immobilien. Finanzen. Zukunft.</span></div></div></footer>`;}

function setupHeader(){
 const toggles=[...document.querySelectorAll('.nav-trigger')];
 const timers=[];
 const animations=new Map();
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motionUser==='paused';
 const menuState=(trigger,open)=>{
  const menu=document.getElementById(trigger.getAttribute('aria-controls'));
  animations.get(menu)?.cancel();
  trigger.setAttribute('aria-expanded',String(open));
  if(!open){menu.hidden=true;return;}
  menu.hidden=false;
  if(!reduced())animations.set(menu,menu.animate([{opacity:0,transform:'translateY(8px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:200,easing:'cubic-bezier(.16,1,.3,1)'}));
 };
 const closeMenus=()=>toggles.forEach(t=>menuState(t,false));
 const openMenu=t=>{closeMenus();menuState(t,true);};
 toggles.forEach(t=>{
  t.addEventListener('click',event=>{const pointer=event.detail>0&&matchMedia('(hover:hover) and (pointer:fine)').matches;const open=pointer||t.getAttribute('aria-expanded')!=='true';closeMenus();menuState(t,open);});
  const group=t.closest('.nav-dropdown');
  let leaveTimer=null;
  group.addEventListener('pointerenter',event=>{clearTimeout(leaveTimer);if(event.pointerType!=='touch')openMenu(t);});
  group.addEventListener('pointerleave',()=>{leaveTimer=setTimeout(()=>{if(!group.contains(document.activeElement))menuState(t,false);},120);timers.push(leaveTimer);});
  group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))menuState(t,false);});
  t.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openMenu(t);document.getElementById(t.getAttribute('aria-controls')).querySelector('a')?.focus();}});
 });
 const mobile=document.querySelector('.mobile-toggle');
 const mobileNav=document.querySelector('#mobile-nav');
 const setMobile=open=>{
  animations.get(mobileNav)?.cancel();
  mobile.setAttribute('aria-expanded',String(open));
  mobile.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
  mobileNav.hidden=!open;
  if(open&&!reduced())animations.set(mobileNav,mobileNav.animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'cubic-bezier(.16,1,.3,1)'}));
 };
 mobile.addEventListener('click',()=>setMobile(mobile.getAttribute('aria-expanded')!=='true'));
 document.onkeydown=e=>{if(e.key==='Escape'){const open=toggles.find(t=>t.getAttribute('aria-expanded')==='true');closeMenus();if(open)open.focus();if(!mobileNav.hidden){setMobile(false);mobile.focus();}}};
 return()=>{timers.forEach(clearTimeout);animations.forEach(animation=>animation.cancel());};
}

function setupHome(){
 const stopReferences=initFinanceReferences();
 document.querySelectorAll('.faq-item').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.faq-item').forEach(other=>{if(other!==d)closeFaq(other);});}));
 return stopReferences;
}

function normalizePath() {
 const path = routePath(decodeURI(location.pathname)) || '/404';
 const alias = routeAliases[path];
 if (!alias) return path;
 history.replaceState({}, '', sitePath(alias + location.search + location.hash));
 return alias;
}

function navigate(route) {
 cleanupMotion();
 window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
 history.pushState({}, '', sitePath(route));
 render();
 if (location.hash) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) scrollToTarget(target);
 } else window.scrollTo({ top: 0, behavior: 'instant' });
 document.querySelector('#main')?.focus({ preventScroll: true });
}
function render(){
 cleanupMotion();cleanupPage();cleanupHome();cleanupHeader();
 const path=normalizePath();
 const page=path==='/'?{html:home(),title:'Einfach individuell'}:renderPage(path,location.search);
 const body=page||{html:`<main id="main" tabindex="-1" class="not-found container"><h1>Hier geht es<br> <em>weiter.</em></h1><p>Diese Seite ist nicht vorhanden. Finden Sie Ihren Weg zurück.</p>${button('/','Zur Startseite')}</main>`,title:'Seite nicht gefunden'};
 app.innerHTML=header(path)+body.html+footer(path);document.title=body.title+' · Senad Basalic & Partner';
 setSiteLinks(app);
 updateSeo(path, path.startsWith('/immobilien/') ? propertyForPath(path) : undefined);
 cleanupHeader=setupHeader();cleanupPage=setupPage(path)||(()=>{});cleanupHome=path==='/'?setupHome():(()=>{});
 cleanupMotion=initMotion({isHome:path==='/'});
}
async function startPublicSite() {
 await loadPublicProperties();
 const motionButton=document.createElement('button');motionButton.id='motion-toggle';motionButton.className='motion-toggle';motionButton.type='button';
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const syncMotionButton=()=>{const paused=document.documentElement.dataset.motionUser==='paused';motionButton.disabled=motionPreference.matches;motionButton.setAttribute('aria-pressed',String(paused));const label=motionPreference.matches?'Animationen durch Systemeinstellung reduziert':paused?'Animationen fortsetzen':'Animationen pausieren';motionButton.setAttribute('aria-label',label);motionButton.title=label;motionButton.innerHTML=icon(paused?playIcon:pauseIcon);};
motionButton.addEventListener('click',()=>{document.documentElement.dataset.motionUser=document.documentElement.dataset.motionUser==='paused'?'enabled':'paused';syncMotionButton();});
motionPreference.addEventListener('change',syncMotionButton);syncMotionButton();document.body.appendChild(motionButton);

 document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) {
   document.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = true;
   });
  }
  const link = event.target.closest('a');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
  const path = routePath(url.pathname);
  if (!path || path === '/admin') return;
  if (url.pathname === location.pathname && url.search === location.search && url.hash) {
   const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
   if (target) {
    event.preventDefault();
    history.pushState({}, '', url.pathname + url.search + url.hash);
    scrollToTarget(target);
    if (target.id === 'main') target.focus({ preventScroll: true });
   }
   return;
  }
  event.preventDefault();
  navigate(path + url.search + url.hash);
 });
 window.addEventListener('popstate',()=>render());
 render();
}

if (import.meta.env.MODE !== 'pages' && /^\/admin\/?$/.test(location.pathname)) {
 document.querySelector('.site-atmosphere')?.remove();
 document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow,noarchive');
 document.querySelector('link[rel="canonical"]')?.remove();
 import('./admin.js').then(({ mountAdmin }) => mountAdmin(app));
} else {
 startPublicSite();
}
