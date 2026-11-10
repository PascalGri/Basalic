import './pages.css';
import './journey-pages.css';
import { imageMarkup, primaryImageMarkup } from './media.js';
import { getLegalContent } from './legal-content.js';
import { renderPropertyGallery, setupPropertyGallery } from './property-gallery.js';
import { closeFaq } from './motion.js';
import { contactFormMarkup, setupContactForm } from './contact-form.js';
import { properties as originalProperties, services } from './data.js';
import { propertyCity, propertyForPath, propertyLabel, publishedProperties as properties } from './public-properties.js';
import { demoWebsitePath, isDemoWebsite, setSiteLinks, sitePath } from './site-paths.js';
import arrowUpRightSvg from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw';
import arrowLeftSvg from '@phosphor-icons/core/assets/regular/arrow-left.svg?raw';
import houseSvg from '@phosphor-icons/core/assets/regular/house.svg?raw';
import checkSvg from '@phosphor-icons/core/assets/regular/check.svg?raw';
import plusSvg from '@phosphor-icons/core/assets/regular/plus.svg?raw';
import phoneSvg from '@phosphor-icons/core/assets/regular/phone.svg?raw';
import envelopeSvg from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw';
import magnifySvg from '@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw';

const icon = svg => svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
const arrow = icon(arrowUpRightSvg);
const back = icon(arrowLeftSvg);
const check = icon(checkSvg);
const plus = icon(plusSvg);
const homeIcon = icon(houseSvg);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const mailto = (address, subject = '') => `mailto:${address}${subject ? '?subject=' + encodeURIComponent(subject) : ''}`;
const splitButton = (href, label, className = '', extra = '') => `<a class="button ${className}" href="${esc(href)}" ${extra}><span class="button-label">${label}</span><span class="button-icon">${arrow}</span></a>`;
const img = (name, alt, eager = false, sizes = '(max-width: 600px) calc(100vw - 48px), 50vw') => imageMarkup(name, alt, { eager, sizes });
const paramsFor = search => search instanceof URLSearchParams ? search : new URLSearchParams(search || '');
const wrapPage = html => `<main id="main" class="subpage" tabindex="-1">${html}</main>`;
const accentLast = text => { const words = text.trim().split(/\s+/); const last = words.pop(); return `${esc(words.join(' '))} <em>${esc(last)}</em>`; };

function head(title, description = '', extra = '') {
  return `<section class="page-head container reveal"><h1>${title}</h1>${description ? `<p>${description}</p>` : ''}${extra}</section>`;
}
const contextActions = { Immobilien: 'Immobilienwunsch besprechen', Mietverwaltung: 'Verwaltung anfragen', Finanzierung: 'Finanzierung besprechen', Vorsorge: 'Vorsorge besprechen' };
const contactHref = (topic, intent = '') => '/kontakt?' + new URLSearchParams({ thema: topic, ...(intent ? { anliegen: intent } : {}) }).toString();
function contactCta(topic = '', title = 'Lassen Sie uns<br> <em>darüber sprechen.</em>', options = {}) {
  return `<section class="page-cta container reveal"><div><h2>${title}</h2><p>${options.description || 'Eine Immobilie, ein Vorhaben oder eine Frage. Wir nehmen uns Zeit für Ihr Anliegen.'}</p></div>${splitButton(options.href || contactHref(topic), options.label || contextActions[topic] || 'Gespräch anfragen')}</section>`;
}
function facts(p, small = false) {
  const items = [
    ...(p.area ? [[p.areaLabel || 'Wohnfläche', `${p.area} m²`]] : []),
    ...(p.land ? [['Grundstück', `${p.land} m²`]] : []),
    ...(p.rooms ? [['Zimmer', p.rooms]] : []),
    ...(p.year ? [['Baujahr', p.year]] : [])
  ];
  return items.length ? `<dl class="${small ? 'card-facts' : 'object-facts'}">${items.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>` : '';
}
function propertyImage(p, primary = false) {
  const alt = `${p.imageRole || 'Objektabbildung'}: ${propertyLabel(p)}`;
  if (primary) return primaryImageMarkup(`/immobilien/${p.id}`, p.image, alt);
  return img(p.image, alt, false, '(max-width: 600px) calc(100vw - 48px), (max-width: 960px) 50vw, 33vw')
    || `<div class="object-no-photo" aria-hidden="true">${homeIcon}</div>`;
}
function propertyCard(p) {
  const status = p.status === 'sold' ? 'Verkauft' : p.status === 'information' ? 'Auslandsimmobilie' : 'Zum Verkauf';
  const factualTitle = propertyLabel(p);
  const mediaClass = p.status === 'sold' ? 'object-card-media' : 'object-card-media object-card-media-full';
  return `<article class="object-card"><a href="/immobilien/${esc(p.id)}" aria-label="${esc(factualTitle + (p.status === 'sold' ? ' · verkaufte Referenz' : ''))}"><div class="${mediaClass}">${propertyImage(p)}</div><div class="object-card-body"><span class="object-status">${status}</span><h2 class="object-card-title">${esc(factualTitle)}</h2><p class="object-card-story">${esc(p.title)}</p>${facts(p, true)}<div class="object-card-bottom"><span>${p.status === 'sold' ? 'Referenz ansehen' : 'Immobilie ansehen'}</span><span class="object-card-arrow">${arrow}</span></div></div></a></article>`;
}
function positiveNumber(value) {
  if (value === null || String(value).trim() === '') return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) && number >= 0 && number <= 100000 ? number : null;
}
function propertyNumber(value) {
  const match = String(value || '').match(/\d[\d.,]*/);
  if (!match) return null;
  const number = match[0].includes(',') ? match[0].replaceAll('.', '').replace(',', '.') : match[0];
  return positiveNumber(number);
}
function filteredProperties(params) {
  const sold = params.get('status') === 'sold';
  const type = params.get('art') || '';
  const term = (params.get('suche') || '').trim().toLocaleLowerCase('de');
  const rooms = positiveNumber(params.get('zimmer'));
  const minArea = positiveNumber(params.get('flaeche_von'));
  const maxArea = positiveNumber(params.get('flaeche_bis'));
  if (minArea !== null && maxArea !== null && minArea > maxArea) return [];
  return properties.filter(p => {
    const area = propertyNumber(p.area);
    const roomCount = propertyNumber(p.rooms);
    return (sold ? p.status === 'sold' : p.status === 'offer' || p.status === 'information')
      && (!type || p.type === type)
      && (!term || [propertyCity(p), p.kind, p.title, ...p.features].join(' ').toLocaleLowerCase('de').includes(term))
      && (rooms === null || (roomCount !== null && roomCount >= rooms))
      && (minArea === null || (area !== null && area >= minArea))
      && (maxArea === null || (area !== null && area <= maxArea));
  });
}
function resultMarkup(list) {
  return list.length ? list.map(propertyCard).join('') : `<div class="property-empty"><span class="empty-icon">${icon(magnifySvg)}</span><h2>Hier ist noch Raum<br> für einen neuen Versuch.</h2><p>Ändern Sie Ort, Objektart oder Eckdaten. Mit „Zurücksetzen“ sehen Sie wieder alle Objekte.</p><a class="text-link" href="${contactHref('Immobilien', 'suche')}">Suchwunsch besprechen ${arrow}</a></div>`;
}
function listing(params) {
  const sold = params.get('status') === 'sold';
  const list = filteredProperties(params);
  const roomMinimum = positiveNumber(params.get('zimmer'));
  const roomOptions = [...new Set([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, ...(roomMinimum !== null ? [roomMinimum] : [])])].sort((a, b) => a - b);
  const minArea = positiveNumber(params.get('flaeche_von'));
  const maxArea = positiveNumber(params.get('flaeche_bis'));
  const soldCount = properties.filter(p => p.status === 'sold').length;
  return wrapPage(`${head('Ein Ort, der<br> <em>zu Ihnen passt.</em>', 'Ein neues Zuhause. Eine Kapitalanlage. Ein nächstes Kapitel. Entdecken Sie unsere Immobilien und die bereits verkauften Referenzen.')}<section class="property-browser container reveal" aria-label="Immobilien finden"><div class="property-toolbar"><div class="status-tabs" role="group" aria-label="Immobilienstatus"><button type="button" data-property-status="offers" aria-pressed="${!sold}">Immobilien <span>${properties.length - soldCount}</span></button><button type="button" data-property-status="sold" aria-pressed="${sold}">Verkaufte Referenzen <span>${soldCount}</span></button></div><span class="source-date">Persönlich für Sie da</span></div><form class="property-filter property-filter-expanded" id="property-filter" role="search"><div class="property-filter-primary"><label class="property-search"><span class="sr-only">Ort oder Stichwort</span>${icon(magnifySvg)}<input id="property-search" type="search" placeholder="Ort oder Stichwort suchen" value="${esc(params.get('suche') || '')}" autocomplete="off"></label><label class="property-type"><span class="sr-only">Objektart</span><select id="property-type"><option value="">Alle Objektarten</option>${['Haus', 'Wohnung', 'Grundstück'].map(type => `<option ${params.get('art') === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label></div><fieldset class="property-refinements"><legend>Zimmer und Wohn-/Gesamtfläche</legend><div class="property-refinement-fields"><label for="property-rooms"><span>Zimmer mindestens</span><select id="property-rooms"><option value="">Alle Zimmerzahlen</option>${roomOptions.map(value => `<option value="${value}" ${roomMinimum === value ? 'selected' : ''}>ab ${String(value).replace('.', ',')}</option>`).join('')}</select></label><label for="property-area-min"><span>Fläche ab (m²)</span><input id="property-area-min" type="number" min="0" max="100000" step="any" inputmode="decimal" placeholder="Minimum" value="${minArea === null ? '' : minArea}" aria-describedby="property-area-help property-filter-feedback"></label><label for="property-area-max"><span>Fläche bis (m²)</span><input id="property-area-max" type="number" min="0" max="100000" step="any" inputmode="decimal" placeholder="Maximum" value="${maxArea === null ? '' : maxArea}" aria-describedby="property-area-help property-filter-feedback"></label></div></fieldset><div class="property-filter-footer"><p id="property-area-help">Die Flächenart steht beim Objekt. Grundstücksflächen zählen hier nicht mit. Fehlende Werte werden bei aktiven Zahlenfiltern ausgeblendet.</p><button class="filter-reset" id="property-reset" type="button">Zurücksetzen</button></div><p id="property-filter-feedback" class="property-filter-feedback" role="status">${minArea !== null && maxArea !== null && minArea > maxArea ? 'Die Mindestfläche darf nicht größer als die Höchstfläche sein.' : ''}</p></form><p class="property-result-count" id="property-count" role="status" aria-live="polite">${list.length} ${list.length === 1 ? 'Objekt' : 'Objekte'}${sold ? ' · Verkauft' : ''}</p><div class="property-grid" id="property-results">${resultMarkup(list)}</div><aside class="property-source-note"><span class="source-dot"></span><p>Sie suchen etwas Bestimmtes? Erzählen Sie uns von Ihren Wünschen. Wir begleiten Sie bei der Immobiliensuche.</p></aside></section>${contactCta('Immobilien', 'Sie möchten<br> <em>Ihre Immobilie verkaufen?</em>', { href: '/immobilie-verkaufen', label: 'Immobilie verkaufen', description: 'Ein persönliches Vorgespräch schafft Raum für Ihre Pläne, Fragen und die nächsten Schritte.' })}`);
}
function listingAddress(property) {
  if (property.status !== 'offer' || !property.listingUrl) return null;
  try {
    const url = new URL(property.listingUrl);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function propertyTerms(p) {
  const entries = [
    ['Kaufpreis', p.price],
    ['Käuferprovision', p.commission],
    ['Heizung', p.heating],
    ['Energieausweis', p.energyCertificate],
    ['Baujahr laut Energieausweis', p.energyYear],
  ].filter(([, value]) => value);
  if (!entries.length) return '';
  const hasPrice = p.price || p.commission;
  const hasEnergy = p.heating || p.energyCertificate || p.energyYear;
  const title = hasPrice && hasEnergy ? 'Preis &amp; Energie' : hasPrice ? 'Preis' : 'Energie';
  return `<section class="object-required-info" aria-labelledby="object-terms-title">
    <h2 id="object-terms-title">${title}</h2>
    <dl>${entries.map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
  </section>`;
}

function propertyDetail(p, demo) {
  const sold = p.status === 'sold';
  const offer = p.status === 'offer';
  const original = originalProperties.find(item => item.id === p.id);
  const movedToReferences = sold && original && original.status !== 'sold';
  const city = propertyCity(p);
  const topic = [city, p.kind].filter(Boolean).join(' – ');
  const contactUrl = contactHref('Immobilien', sold ? 'suche' : offer ? 'besichtigung' : 'information') + '&' + (sold ? 'referenz=' : 'objekt=') + encodeURIComponent(topic);
  const status = sold ? 'Verkauft · Referenz' : offer ? 'Zum Verkauf' : 'Auslandsimmobilie · Informationen';
  const moreUrl = '/immobilien' + (sold ? '?status=sold' : '');
  const exposeUrl = demo ? null : listingAddress(p);
  const exposeIsScout = exposeUrl && (exposeUrl.hostname === 'immobilienscout24.de' || exposeUrl.hostname.endsWith('.immobilienscout24.de'));
  const exposeLink = exposeUrl ? splitButton(exposeUrl.href, exposeIsScout ? 'Auf ImmoScout24 ansehen' : 'Externes Exposé ansehen', 'object-expose-button', 'target="_blank" rel="noopener noreferrer"') : '';
  const features = p.features;
  const note = movedToReferences && p.note === original.note ? '' : p.note;
  const related = properties.filter(item => item.id !== p.id && item.status === (sold ? 'sold' : 'offer')).slice(0, 3);

  return wrapPage(`
    <div class="container object-back"><a class="text-link" href="${moreUrl}">${back} ${sold ? 'Alle verkauften Referenzen' : 'Alle Immobilien'}</a></div>
    ${head(accentLast(p.title), esc([p.kind, city].filter(Boolean).join(' · ')), `<span class="detail-status">${status}</span>`)}
    ${renderPropertyGallery(p, propertyImage(p, true))}
    <section class="object-detail container reveal">
      <div class="object-information">
        ${facts(p)}
        ${features.length || note ? '<h2>Gut zu wissen.</h2>' : ''}
        ${features.length ? `<ul class="object-features">${features.map(feature => `<li>${check}<span>${esc(feature)}</span></li>`).join('')}</ul>` : ''}
        ${note ? `<p class="object-note">${esc(note).replace(/\r?\n/g, '<br>')}</p>` : ''}
        ${offer ? propertyTerms(p) : ''}
        ${demo ? '' : `<aside class="source-callout">
          <strong>${sold ? 'Erfolgreich vermittelt' : 'Interesse an dieser Immobilie?'}</strong>
          <p>${sold ? 'Wir begleiten Sie gern bei der Suche nach einer ähnlichen Immobilie oder beim Verkauf Ihres Eigentums.' : 'Sprechen Sie uns an, wenn Sie Fragen zum Objekt haben oder eine Besichtigung vereinbaren möchten.'}</p>
        </aside>`}
      </div>
      <aside class="object-contact">${demo ? `<h2>Objektvorschau</h2>
        <p>In der Testvorschau sind Anfragen und externe Exposés deaktiviert.</p>
        ${splitButton('/admin', 'Zurück zum Testportal')}` : `
        <h2>${sold ? 'Ähnliche<br> <em>Vorstellungen?</em>' : 'Das könnte<br> <em>passen?</em>'}</h2>
        <p>${sold ? 'Die Referenz ist verkauft. Sprechen wir über eine ähnliche Immobilie oder den Verkauf Ihres Eigentums.' : 'Wir klären Ihre Fragen zur Immobilie und besprechen Ihren nächsten Schritt.'}</p>
        ${splitButton(contactUrl, sold ? 'Ähnliche Immobilie finden' : offer ? 'Besichtigung anfragen' : 'Objektinformationen anfragen')}
        <div class="object-contact-links"><a href="${mailto('immobilien@basalic.de', (sold ? 'Anfrage zu ähnlichen Immobilien: ' : 'Objektanfrage: ') + topic)}">${icon(envelopeSvg)}immobilien@basalic.de</a><a href="tel:+491786654819">${icon(phoneSvg)}+49 178 6654819</a></div>
        ${exposeLink ? `<div class="object-expose">${exposeLink}<small>Öffnet einen neuen Tab.</small></div>` : ''}`}
      </aside>
    </section>
    ${related.length ? `<section class="related-objects container reveal">
      <div class="subsection-heading"><div><h2>${sold ? 'Weitere<br> <em>Referenzen.</em>' : 'Weitere<br> <em>Möglichkeiten.</em>'}</h2></div><a class="text-link" href="${moreUrl}">Alle ansehen ${arrow}</a></div>
      <div class="property-grid">${related.map(propertyCard).join('')}</div>
    </section>` : ''}
  `);
}

const servicePages = {
  '/mietverwaltung': {
    title: 'Mietverwaltung', headline: 'Weniger Aufwand.<br> <em>Mehr Freiraum.</em>',
    lead: 'Mietverwaltung bedeutet Freiheit. Wir unterstützen Sie als Kapitalanleger und vertreten Ihre Interessen als Vermieter.',
    image: 'services/mietverwaltung', imageAlt: 'Helles Mehrfamilienhaus mit grauen Balkonen und Pflanzen',
    intro: 'Ihr Eigentum.<br> <em>Unsere Unterstützung.</em>',
    text: 'Sie möchten Ihre vermietete Immobilie in guten Händen wissen? Sprechen Sie mit uns darüber, welche Unterstützung Sie sich als Kapitalanleger oder Vermieter wünschen.',
    topics: [{ title: 'Für Kapitalanleger und Vermieter', text: 'Wir unterstützen Sie als Kapitalanleger und vertreten Sie in Ihren Angelegenheiten als Vermieter. Sprechen Sie uns mit Ihrem Anliegen an.' }],
    email: 'info@basalic.de',
    faq: [['Für wen ist die Mietverwaltung gedacht?', 'Für Kapitalanleger und Vermieter, die sich Unterstützung bei ihren Angelegenheiten wünschen. Sprechen Sie uns zu Ihrer Immobilie an.'], ['Welche Aufgaben können übernommen werden?', 'Wir unterstützen Kapitalanleger und vertreten Vermieter in ihren Angelegenheiten. Welche Aufgaben wir für Ihre Immobilie übernehmen, stimmen wir gemeinsam mit Ihnen ab.']]
  },
  '/finanzierung': {
    title: 'Finanzierung', headline: 'Große Pläne.<br> <em>Ein guter Anfang.</em>',
    lead: 'Die eigenen vier Wände oder ein bestehender Privatkredit. Wir unterstützen Sie bei Ihren Finanzierungsfragen.',
    image: 'services/finanzierung', imageAlt: 'Eine Frau und ein Mann besprechen einen Wohnungsgrundriss am Tisch',
    intro: 'Für Ihr Zuhause.<br> <em>Und Ihre Möglichkeiten.</em>',
    text: 'Durch Kooperationen mit Banken, darunter auch regionale Institute, begleiten wir Sie auf dem Weg in die eigenen vier Wände. Ausgangspunkt ist Ihr persönliches Vorhaben.',
    topics: [{ title: 'Baufinanzierung', text: 'Sie planen den Kauf Ihrer eigenen vier Wände? Gemeinsam sprechen wir über Ihre Finanzierung und die Möglichkeiten unserer Bankkooperationen.' }, { title: 'Privatkredite und Umschuldung', text: 'Durch eine Umschuldung Ihres Privatkredits können unter Umständen Zinskosten sinken. Ob sich das für Sie lohnt, hängt von Ihrer persönlichen Situation und den Konditionen ab. Lassen Sie uns darüber sprechen.' }],
    email: 'finanzierung@basalic.de',
    faq: [['Arbeiten Sie mit regionalen Banken zusammen?', 'Ja, wir arbeiten auch mit regionalen Banken zusammen. Welche Finanzierung zu Ihrem Vorhaben passt, besprechen wir auf Grundlage Ihrer Wünsche und Ihrer persönlichen Situation.'], ['Spart eine Umschuldung immer Zinsen?', 'Das hängt vom bestehenden Kredit, den neuen Konditionen und möglichen Ablösekosten ab. Wir prüfen mit Ihnen, ob sich eine Umschuldung für Ihre Situation rechnet.']]
  },
  '/vorsorge': {
    secondaryImage: 'services/altersvorsorge', secondaryImageAlt: 'Ältere Frau beim Umtopfen in einer Gartenwerkstatt, zweite Person mit Tee im Hintergrund',
    title: 'Vorsorge', headline: 'Heute an das denken,<br> <em>was morgen zählt.</em>',
    lead: 'Absicherung und Altersvorsorge gehören zusammen. Wir beraten Sie zu Versorgungslücken und unterstützen Sie dabei, für Ihre Zukunft vorzusorgen.',
    image: 'services/absicherung', imageAlt: 'Elternteil hilft einem Kind beim Anziehen einer Jacke',
    intro: 'Für das Leben heute.<br> <em>Und die Zeit danach.</em>',
    text: 'Krankheit, Berufsunfähigkeit, Pflege, Todesfall oder Ruhestand: Wir besprechen, wo Versorgungslücken bestehen und wie Sie Ihre Vorsorge darauf ausrichten können.',
    topics: [{ title: 'Absicherung', text: 'Wir beraten Sie zu möglichen Versorgungslücken bei Krankheit, Berufsunfähigkeit, Pflege und im Todesfall.' }, { title: 'Altersvorsorge', text: 'Entstandene Rentenlücken können Ihre Pläne für den Ruhestand verändern. Wir unterstützen Sie dabei, diese Lücken zu erkennen und eine passende Vorsorge zu besprechen.' }],
    email: 'info@basalic.de',
    faq: [['Welche Lebenssituationen umfasst die Absicherung?', 'Das Beratungsangebot umfasst Versorgungslücken bei Krankheit, Berufsunfähigkeit, Pflege und im Todesfall. Ihr persönlicher Bedarf steht am Anfang des Gesprächs.'], ['Wie beginnen wir mit der Altersvorsorge?', 'Wir schauen gemeinsam auf Ihre bisherige Absicherung, Ihre Wünsche für den Ruhestand und mögliche Rentenlücken. Daraus entwickeln wir die nächsten Schritte für Ihre persönliche Vorsorge.']]
  }
};
function faq(items) {
  return `<section class="page-faq container reveal" aria-label="Häufige Fragen"><div><h2>Ein paar Antworten.<br> <em>Für den Anfang.</em></h2><p>Ihre Frage ist persönlicher? Wir sprechen gern mit Ihnen.</p></div><div class="faq-items">${items.map(([question, answer]) => `<details><summary>${question}<span>${plus}</span></summary><p>${answer}</p></details>`).join('')}</div></section>`;
}
function servicePage(path) {
  const s = servicePages[path];
  return wrapPage(`${head(s.headline, s.lead)}<section class="service-introduction container reveal"><figure class="service-illustration ${s.compact ? 'compact' : ''}">${primaryImageMarkup(path, s.image, s.imageAlt)}<figcaption class="image-disclosure">KI-generiertes Beispielbild</figcaption></figure><div><h2>${s.intro}</h2><p>${s.text}</p>${splitButton(contactHref(s.title), contextActions[s.title])}<a class="service-email" href="${mailto(s.email, s.title + ' – Gesprächsanfrage')}">${s.email} ${arrow}</a></div></section><section class="service-topics container reveal" aria-label="Beratungsschwerpunkte">${s.topics.map(topic => `<article><h2>${topic.title}</h2><p>${topic.text}</p></article>`).join('')}</section>${s.secondaryImage ? `<figure class="service-outlook container reveal"><div class="service-outlook-media">${img(s.secondaryImage, s.secondaryImageAlt, false, '(max-width: 1100px) calc(100vw - 48px), 1100px')}<span class="image-disclosure">KI-generiertes Beispielbild</span></div><figcaption><span>Zeit für das, was Ihnen wichtig ist.</span></figcaption></figure>` : ''}${path === '/finanzierung' ? financingJourney() : ''}${faq(s.faq)}<section class="other-service-links container reveal"><p>Weitere Perspektiven</p>${services.filter(service => service.path !== path).map(service => `<a href="${service.path}">${service.title}${arrow}</a>`).join('')}</section>`);
}
function advisorPanel(topic, label, intro) {
  return `<aside class="journey-advisor"><figure>${img('senad-basalic', 'Senad Basalic, Ihr persönlicher Ansprechpartner', false, '(max-width: 600px) 84px, (max-width: 900px) 74px, 88px')}<figcaption>Senad Basalic</figcaption></figure><div><h3>Persönlich<br> <em>weiterdenken.</em></h3><p>${intro}</p>${splitButton(contactHref(topic, topic === 'Immobilien' ? 'verkauf' : ''), label)}</div></aside>`;
}
function financingJourney() {
  return `<section class="journey-section container reveal"><div class="journey-heading"><h2>So kann Ihre<br> <em>Finanzierung starten.</em></h2><p>Jedes Vorhaben hat eine andere Ausgangslage. Diese Schritte können helfen, das erste Gespräch vorzubereiten.</p></div><ol class="journey-steps"><li><span class="journey-step-index" aria-hidden="true">01</span><h3>Erstgespräch</h3><p>Wir können Ihre Pläne, offene Fragen und Ihre persönliche Ausgangslage gemeinsam einordnen.</p></li><li><span class="journey-step-index" aria-hidden="true">02</span><h3>Unterlagen</h3><p>Je nach Vorhaben sind Einkommens-, Eigenkapital- und Objektunterlagen hilfreich. Was genau benötigt wird, stimmen wir persönlich ab.</p></li><li><span class="journey-step-index" aria-hidden="true">03</span><h3>Möglichkeiten</h3><p>Auf Basis Ihrer Angaben lassen sich Finanzierungsmöglichkeiten über unsere Bankkooperationen besprechen. Maßgeblich sind die tatsächlich verfügbaren Angebote.</p></li></ol><div class="journey-preparation"><div class="journey-document-list"><h2>Was für den Anfang<br> <em>hilfreich sein kann.</em></h2><ul><li>${check}<span>Eine kurze Beschreibung Ihres Vorhabens und Ihrer Fragen</span></li><li>${check}<span>Ein Überblick über Einkommen, laufende Verpflichtungen und vorhandenes Eigenkapital</span></li><li>${check}<span>Falls vorhanden: Exposé oder Eckdaten der Immobilie</span></li><li>${check}<span>Bei einer Umschuldung: Angaben zur bestehenden Finanzierung</span></li></ul><p>Vertrauliche Unterlagen müssen Sie nicht über diese Website übermitteln. Den passenden Weg besprechen wir persönlich mit Ihnen.</p></div>${advisorPanel('Finanzierung', 'Finanzierung besprechen', 'Sie müssen noch nicht auf jede Frage eine Antwort haben. Erzählen Sie uns zuerst von Ihrem Vorhaben.')}</div></section>`;
}
function sellerPage() {
  const sellerContact = contactHref('Immobilien', 'verkauf');
  return wrapPage(`${head('Ihre Immobilie.<br> <em>Der nächste Schritt.</em>', 'Sie denken über einen Verkauf nach? Besprechen wir Ihre Situation, Ihre Fragen und was Ihnen dabei wichtig ist.', `<div class="seller-hero-action">${splitButton(sellerContact, 'Verkauf besprechen')}</div>`)}<section class="journey-section seller-journey container reveal"><div class="journey-heading"><h2>Erst einmal<br> <em>in Ruhe sprechen.</em></h2><p>Ob der Verkauf schon konkret ist oder Sie sich zunächst orientieren möchten: Umfang und nächste Schritte stimmen wir passend zu Ihrer Immobilie ab.</p></div><ol class="journey-steps"><li><span class="journey-step-index" aria-hidden="true">01</span><h3>Vorgespräch</h3><p>Welche Immobilie möchten Sie verkaufen? Wo stehen Sie mit Ihren Plänen, und welche Fragen sollen zuerst geklärt werden?</p></li><li><span class="journey-step-index" aria-hidden="true">02</span><h3>Objektunterlagen</h3><p>Vorhandene Unterlagen helfen dabei, das Objekt einzuordnen. Gemeinsam lässt sich klären, welche Angaben noch benötigt werden.</p></li><li><span class="journey-step-index" aria-hidden="true">03</span><h3>Nächste Schritte</h3><p>Wie es weitergehen kann und welche Leistungen für Ihr Vorhaben sinnvoll sind, besprechen und vereinbaren wir persönlich.</p></li></ol><div class="journey-preparation"><div class="journey-document-list"><h2>Unterlagen, die<br> <em>weiterhelfen können.</em></h2><ul><li>${check}<span>Grundrisse, Flächenaufstellung und Eckdaten zu Haus oder Wohnung</span></li><li>${check}<span>Energieausweis oder Informationen zum Ausweisstatus</span></li><li>${check}<span>Angaben zu Baujahr, Modernisierungen und Ausstattung</span></li><li>${check}<span>Bei vermieteten Immobilien: ein Überblick über die Mietverhältnisse</span></li><li>${check}<span>Bei Eigentumswohnungen: vorhandene Unterlagen zur Wohnungseigentümergemeinschaft</span></li></ul><p>Für die erste Anfrage genügen Objektart, Ort und Ihre Fragen. Vertrauliche Dokumente übermitteln Sie erst auf einem persönlich abgestimmten Weg.</p><a class="text-link" href="/immobilien?status=sold">Verkaufte Referenzen ansehen ${arrow}</a></div>${advisorPanel('Immobilien', 'Verkauf besprechen', 'Ich freue mich darauf, Ihre Immobilie und Ihre Pläne kennenzulernen. Gemeinsam besprechen wir, was für Sie als Nächstes wichtig ist.')}</div></section>${contactCta('Immobilien', 'Was haben Sie<br> <em>mit Ihrer Immobilie vor?</em>', { href: sellerContact, label: 'Verkauf besprechen', description: 'Schildern Sie uns Ihr Vorhaben. Ihre Anfrage wird mit dem Anliegen „Immobilienverkauf“ für Sie vorbereitet.' })}`);
}
function aboutPage() {
  return wrapPage(`${head('Einfach individuell.<br> <em>Seit 2001.</em>', 'Immobilien und Finanzen berühren das eigene Leben. Gut, ein Gegenüber zu haben, das verständlich erklärt und persönlich begleitet.')}<section class="about-profile container reveal"><figure>${primaryImageMarkup('/ueber-uns', 'senad-basalic', 'Senad Basalic, Immobilienmakler, Immobiliardarlehensvermittler und Versicherungsmakler')}<figcaption>Senad Basalic · Ihr persönlicher Ansprechpartner</figcaption></figure><div><h2>Ihr Vorhaben.<br> <em>Persönlich begleitet.</em></h2><p>In Göppingen geboren, seit 2001 am Markt tätig: Senad Basalic ist Ihr Ansprechpartner als Immobilienmakler, Immobiliardarlehensvermittler und Versicherungsmakler.</p><p>Sein Anspruch ist, komplexe Finanzfragen einfach zu erklären und Menschen bei ihrer Immobiliensuche, dem Verkauf und der Finanzierung zu begleiten. Dafür erstellen wir gemeinsam ein passendes Profil für Ihr Vorhaben.</p><p>Basalic & Partner arbeitet mit zahlreichen Kooperationen und Partnern zusammen, wenn möglich aus der Region. Wir sind IHK-Ausbildungsbetrieb.</p>${splitButton('/kontakt', 'Persönliches Gespräch anfragen')}</div></section><section class="about-perspectives container reveal"><div class="subsection-heading"><h2>Ein Ansprechpartner.<br> <em>Mehrere Perspektiven.</em></h2></div><div class="perspective-grid">${[['Verständlich erklären.', 'Fragen zu Immobilien und Finanzen in eine Sprache übersetzen, die im Alltag weiterhilft.'], ['Persönlich begleiten.', 'Ihre Ausgangslage und Ihre Wünsche gemeinsam besprechen.'], ['Zusammen denken.', 'Immobilie, Finanzierung, Verwaltung und Vorsorge als zusammenhängende Lebensfragen betrachten.']].map(([title, text], index) => `<article><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section><section class="about-service-list container reveal">${services.map(service => `<a href="${service.path}"><span>${service.number}</span><h2>${service.title}</h2><p>${service.description}</p>${arrow}</a>`).join('')}</section>`);
}
function contactPage(params) {
  const topic = (params.get('thema') || '').slice(0, 80);
  const object = (params.get('objekt') || '').slice(0, 300);
  const reference = (params.get('referenz') || '').slice(0, 300);
  const intent = params.get('anliegen') || '';
  const topicMessages = {
    Mietverwaltung: 'Ich möchte die Verwaltung meiner vermieteten Immobilie besprechen.\n\nOrt / Objektart:\nGewünschte Unterstützung:',
    Finanzierung: 'Ich möchte eine Finanzierung besprechen.\n\nMein Vorhaben:\nGeplanter Zeitraum:\nMeine Fragen:',
    Vorsorge: 'Ich möchte meine Absicherung oder Altersvorsorge besprechen.\n\nMein Anliegen:\nMeine Fragen:'
  };
  const message = object ? (intent === 'information' ? `Ich interessiere mich für: ${object}. Bitte stellen Sie mir weitere Informationen zum Objekt und zum aktuellen Stand zur Verfügung.` : `Ich möchte eine Besichtigung für folgende Immobilie anfragen: ${object}. Bitte informieren Sie mich über die aktuelle Verfügbarkeit und mögliche Termine.`)
    : reference ? `Die verkaufte Referenz ${reference} gefällt mir. Ich suche eine ähnliche Immobilie und möchte meine Wünsche mit Ihnen besprechen.`
    : intent === 'verkauf' ? 'Ich möchte meine Immobilie verkaufen und ein persönliches Vorgespräch vereinbaren.\n\nObjektart:\nOrt:\nMeine Fragen / Wünsche:'
    : intent === 'suche' ? 'Ich suche eine Immobilie und möchte meine Wünsche mit Ihnen besprechen.\n\nGesuchter Ort / Region:\nObjektart:\nMeine Wünsche:'
    : topicMessages[topic] || '';
  return wrapPage(`${head('Ein paar Worte.<br> <em>Ein guter Anfang.</em>', 'Eine Immobilie. Ein Vorhaben. Eine Frage. Erzählen Sie uns, was Sie bewegt.')}<section class="contact-layout container reveal"><div class="contact-information"><h2>Wir freuen uns<br> <em>auf Ihre Pläne.</em></h2><div class="contact-large-links"><a href="tel:+491786654819">${icon(phoneSvg)}<span>+49 178 6654819</span>${arrow}</a><a href="mailto:info@basalic.de">${icon(envelopeSvg)}<span>info@basalic.de</span>${arrow}</a></div><div class="specialist-contacts"><div><span>Immobilien</span><a href="mailto:immobilien@basalic.de">immobilien@basalic.de ${arrow}</a></div><div><span>Finanzierung</span><a href="mailto:finanzierung@basalic.de">finanzierung@basalic.de ${arrow}</a></div><div><span>Mietverwaltung & Vorsorge</span><a href="mailto:info@basalic.de">info@basalic.de ${arrow}</a></div></div><aside class="address-information"><strong>Besuch nach Absprache.</strong><p>Für ein persönliches Gespräch vereinbaren wir gern einen Termin mit Ihnen. Die passende Besuchsadresse erhalten Sie mit der Terminbestätigung.</p></aside></div>${contactFormMarkup(topic, message, arrow)}</section>`);
}

const legalContent = getLegalContent(arrow);

const legalLabels = { '/impressum': 'Impressum', '/datenschutz': 'Datenschutz', '/erstinformationen': 'Erstinformationen', '/barrierefreiheit': 'Barrierefreiheit', '/bildnachweise': 'Bildnachweise' };
function legalPage(path) {
  const page = legalContent[path];
  return wrapPage(`${head(page.title, page.intro)}<section class="legal-layout container"><nav class="legal-page-nav" aria-label="Rechtliche Informationen">${Object.entries(legalLabels).map(([url, label]) => `<a href="${url}" ${path === url ? 'aria-current="page"' : ''}>${label}${arrow}</a>`).join('')}</nav><article class="legal-copy">${page.body}</article></section>`);
}

export function renderPage(path, search = '', { demo = false } = {}) {
  const params = paramsFor(search);
  if (path === '/immobilien') return { html: listing(params), title: 'Immobilien' };
  if (path === '/immobilie-verkaufen') return { html: sellerPage(), title: 'Immobilie verkaufen' };
  if (path.startsWith('/immobilien/')) {
    const property = propertyForPath(path);
    return property ? { html: propertyDetail(property, demo), title: propertyLabel(property) } : null;
  }
  if (servicePages[path]) return { html: servicePage(path), title: servicePages[path].title };
  if (path === '/ueber-uns') return { html: aboutPage(), title: 'Über uns' };
  if (path === '/kontakt') return { html: contactPage(params), title: 'Kontakt' };
  if (legalContent[path]) return { html: legalPage(path), title: legalLabels[path] };
  return null;
}

export function setupPage(path) {
  const cleanupGallery = setupPropertyGallery(propertyForPath(path));
  if (path === '/immobilien') {
    const params = new URLSearchParams(location.search);
    let status = params.get('status') === 'sold' ? 'sold' : 'offers';
    const search = document.querySelector('#property-search');
    const type = document.querySelector('#property-type');
    const rooms = document.querySelector('#property-rooms');
    const minArea = document.querySelector('#property-area-min');
    const maxArea = document.querySelector('#property-area-max');
    const feedback = document.querySelector('#property-filter-feedback');
    const update = () => {
      const nextParams = new URLSearchParams();
      if (status === 'sold') nextParams.set('status', 'sold');
      for (const [key, value] of [['art', type.value], ['suche', search.value], ['zimmer', rooms.value], ['flaeche_von', minArea.value], ['flaeche_bis', maxArea.value]]) {
        if (value !== '') nextParams.set(key, value);
      }
      const lower = positiveNumber(minArea.value);
      const upper = positiveNumber(maxArea.value);
      const invalidRange = lower !== null && upper !== null && lower > upper;
      const invalidNumber = [minArea, maxArea].some(input => input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow);
      feedback.textContent = invalidNumber ? 'Bitte geben Sie für die Fläche einen Wert zwischen 0 und 100.000 m² ein.' : invalidRange ? 'Die Mindestfläche darf nicht größer als die Höchstfläche sein.' : '';
      minArea.setAttribute('aria-invalid', String(invalidNumber || invalidRange));
      maxArea.setAttribute('aria-invalid', String(invalidNumber || invalidRange));
      const list = invalidNumber ? [] : filteredProperties(nextParams);
      document.querySelectorAll('[data-property-status]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.propertyStatus === status)));
      const results = document.querySelector('#property-results');
      results.innerHTML = resultMarkup(list);
      setSiteLinks(results);
      document.querySelector('#property-count').textContent = `${list.length} ${list.length === 1 ? 'Objekt' : 'Objekte'}${status === 'sold' ? ' · Verkauft' : ''}`;
      const linkPath = isDemoWebsite() ? demoWebsitePath : sitePath;
      history.replaceState({}, '', linkPath('/immobilien' + (nextParams.size ? '?' + nextParams.toString() : '')));
    };
    document.querySelectorAll('[data-property-status]').forEach(button => button.addEventListener('click', () => { status = button.dataset.propertyStatus; update(); }));
    search.addEventListener('input', update);
    type.addEventListener('change', update);
    rooms.addEventListener('change', update);
    minArea.addEventListener('input', update);
    maxArea.addEventListener('input', update);
    document.querySelector('#property-reset').addEventListener('click', () => { search.value = ''; type.value = ''; rooms.value = ''; minArea.value = ''; maxArea.value = ''; update(); });
    document.querySelector('#property-filter').addEventListener('submit', event => { event.preventDefault(); update(); });
  }
  // Native details elements remain operable without JavaScript; this only keeps
  // the compact reference-template accordion to one open answer at a time.
  document.querySelectorAll('.page-faq details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.page-faq details').forEach(other => { if (other !== detail) closeFaq(other); });
  }));
  const form = document.querySelector('#page-contact-form');
  if (form) setupContactForm(form);
  return cleanupGallery;
}
