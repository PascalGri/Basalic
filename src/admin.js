import './admin.css';
import buildings from '@phosphor-icons/core/assets/regular/buildings.svg?raw';
import external from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw';
import searchIcon from '@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw';
import signOut from '@phosphor-icons/core/assets/regular/sign-out.svg?raw';
import plus from '@phosphor-icons/core/assets/regular/plus.svg?raw';
import pencil from '@phosphor-icons/core/assets/regular/pencil-simple.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check-circle.svg?raw';
import draft from '@phosphor-icons/core/assets/regular/note-pencil.svg?raw';
import photo from '@phosphor-icons/core/assets/regular/image-square.svg?raw';
import upload from '@phosphor-icons/core/assets/regular/upload-simple.svg?raw';
import arrowLeft from '@phosphor-icons/core/assets/regular/arrow-left.svg?raw';
import caretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import house from '@phosphor-icons/core/assets/regular/house.svg?raw';
import lock from '@phosphor-icons/core/assets/regular/lock-simple.svg?raw';
import close from '@phosphor-icons/core/assets/regular/x.svg?raw';
import restore from '@phosphor-icons/core/assets/regular/arrow-counter-clockwise.svg?raw';
import globe from '@phosphor-icons/core/assets/regular/globe.svg?raw';
import { getImageData } from './media.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = svg => `<span class="a-icon" aria-hidden="true">${svg}</span>`;
const brand = `<span class="a-wordmark">basalic<span> &amp; partner</span></span>`;
const supportEmail = 'info@schafundgrimm.de';
const supportContact = `<p class="a-support">Bei technischen Problemen, Änderungswünschen oder Fragen schreiben Sie an <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>`;
const api = '/api/admin';
const uploaded = /^\/property-media\/[a-z0-9-]+\.webp$/;
const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const types = ['Haus', 'Wohnung', 'Grundstück'];
const statusLabels = { offer: 'Im Angebot', sold: 'Verkauft', draft: 'Entwurf', information: 'Auslandsobjekt' };
const filters = [['all', 'Alle Objekte'], ['offer', 'Angebote'], ['sold', 'Referenzen'], ['draft', 'Entwürfe'], ['information', 'Ausland']];
const pageSize = 8;
const requiredFields = ['title', 'city', 'kind', 'type'];
const formFields = ['title', 'city', 'type', 'kind', 'note', 'area', 'areaLabel', 'land', 'rooms', 'year', 'listingUrl', 'price', 'commission', 'energyCertificate', 'energyYear'];
const propertyUrl = p => '/immobilien/' + encodeURIComponent(p.id);
const propertyName = p => p.title || p.kind || 'Unbenanntes Objekt';
const imageSrc = name => uploaded.test(name || '') ? name : getImageData(name)?.src || '';
const badge = status => `<span class="a-badge a-badge-${esc(status)}"><i aria-hidden="true"></i>${esc(statusLabels[status] || 'Unbekannt')}</span>`;
const action = (name, label, svg, cls = 'a-secondary', extra = '') => `<button type="button" class="a-button ${cls}" data-action="${name}" ${extra}>${svg ? icon(svg) : ''}${label}</button>`;
const externalLink = (href, label, cls = 'a-secondary') => `<a class="a-button ${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}${icon(external)}</a>`;

async function request(path, { method = 'GET', data, file: body } = {}) {
  let response;
  try {
    response = await fetch(api + path, {
      method, cache: 'no-store', credentials: 'same-origin',
      headers: body ? { 'Content-Type': body.type } : data ? { 'Content-Type': 'application/json' } : {},
      body: body || (data ? JSON.stringify(data) : undefined),
    });
  } catch {
    throw new Error('Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
  }
  if (response.status === 204) return {};
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    const error = new Error(result?.error || 'Das Portal ist gerade nicht erreichbar. Bitte versuchen Sie es erneut.');
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function mountAdmin(root) {
  document.body.classList.add('admin-mode');
  document.title = 'Immobilienverwaltung · Basalic & Partner';
  let inventory = [], filter = 'all', query = '', page = 0;
  let editing = null, baseline = '', uploading = false, saving = false, notice = '';
  let pendingTransition = null, transitionTrigger = null;
  const beforeUnload = event => {
    if (editing && (uploading || saving || hasEdits())) {
      event.preventDefault();
      event.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', beforeUnload);

  const thumbnail = (p) => {
    const src = imageSrc(p.image || p.photos?.[0]);
    return `<span class="a-thumb">${src ? `<img src="${esc(src)}" alt="" width="68" height="52" loading="lazy">` : icon(house)}</span>`;
  };
  const counts = () => inventory.reduce((tally, p) => ({ ...tally, [p.status]: (tally[p.status] || 0) + 1 }), {});
  const focusMain = () => root.querySelector('#main')?.focus({ preventScroll: true });
  const top = () => window.scrollTo({ top: 0, behavior: 'instant' });

  function login({ configured = true, error = '', unavailable = false } = {}) {
    editing = null;
    inventory = [];
    root.innerHTML = `<main id="main" tabindex="-1" class="a-login">
      <header class="a-login-header"><a class="a-brand" href="/" aria-label="Basalic und Partner – Startseite">${brand}</a><a class="a-login-back" href="/">${icon(arrowLeft)} Zur Website</a></header>
      <div class="a-login-side">
        <div class="a-login-story"><span class="a-kicker"><i></i> Immobilienverwaltung</span><p>Ihre Immobilien.<br>An einem Ort.</p></div>
        <span class="a-login-caption">Immobilien · Göppingen und die Region</span>
      </div>
      <div class="a-login-content">
        <div class="a-login-panel"><span class="a-login-icon">${icon(lock)}</span><p class="a-kicker">Verwaltung</p><h1>Willkommen zurück.</h1>
        <p class="a-login-lede">Melden Sie sich an, um Angebote und verkaufte Referenzen zu verwalten.</p>
        ${unavailable ? `<p class="a-feedback a-error" role="alert">${esc(error)}</p>${action('retry', 'Erneut versuchen', restore, 'a-primary')}` : configured
          ? `<form id="a-login-form"><div class="a-field"><label for="a-password">Passwort</label><input id="a-password" name="password" type="password" autocomplete="current-password" required maxlength="1024"></div>
          <p class="a-feedback a-error" role="alert"${error ? '' : ' hidden'}>${esc(error)}</p><button class="a-button a-primary" type="submit">Anmelden ${icon(caretRight)}</button></form>`
          : '<p class="a-feedback">Der Zugang ist noch nicht eingerichtet.</p>'}
        ${supportContact}
        </div><p class="a-login-foot">Geschützter Bereich · Basalic &amp; Partner</p>
      </div></main>`;
  }

  async function initialize() {
    root.innerHTML = `<main id="main" class="a-loading" tabindex="-1"><span class="a-login-icon">${icon(buildings)}</span><p role="status">Portal wird geladen …</p></main>`;
    try {
      const session = await request('/session');
      if (session.authenticated) {
        await loadInventory();
        dashboard();
      } else login({ configured: session.configured });
    } catch (error) {
      if (error.status === 401) login();
      else login({ unavailable: true, error: error.message });
    }
  }

  async function loadInventory() {
    const data = await request('/properties');
    inventory = data.properties;
  }

  function shell(content, locationLabel) {
    root.innerHTML = `<div class="a-shell">
      <aside class="a-sidebar">
        <a class="a-brand" href="/admin" aria-label="Basalic und Partner – Verwaltung">${brand}</a>
        <div class="a-sidebar-nav"><p class="a-sidebar-label">Verwaltung</p>${action('list', 'Immobilien', buildings, 'a-nav-active')}</div>
        <div class="a-sidebar-foot">
          <div class="a-person"><span class="a-avatar" aria-hidden="true">SB</span><span><strong>Senad Basalic</strong><small>Verwaltung</small></span></div>
          ${action('logout', '<span>Abmelden</span>', signOut, 'a-sign-out', 'aria-label="Abmelden"')}
        </div>
      </aside>
      <div class="a-body">
        <header class="a-top"><div class="a-crumb"><span>Verwaltung</span><i aria-hidden="true">/</i><strong>${locationLabel}</strong></div>${externalLink('/', 'Website öffnen', 'a-top-link')}</header>
        <aside class="a-support-bar" aria-label="Hilfe und Kontakt">${supportContact}</aside>
        <main id="main" tabindex="-1" class="a-main">
          <div id="a-notice" role="status" aria-atomic="true" class="a-notice"${notice ? '' : ' hidden'}>${notice ? icon(check) + esc(notice) : ''}</div>
          ${content}
        </main>
      </div>
      <dialog id="a-dialog" aria-labelledby="a-dialog-title" aria-describedby="a-dialog-copy">
        <div class="a-dialog-inner"><div id="a-dialog-content"></div><p id="a-dialog-error" class="a-feedback a-error" role="alert" hidden></p>
          <div class="a-dialog-actions">${action('cancel-dialog', 'Abbrechen', '', 'a-secondary', 'autofocus')}${action('confirm-dialog', 'Bestätigen', '', 'a-primary')}</div>
        </div>
      </dialog>
    </div>`;
  }

  function dashboard() {
    editing = null;
    const total = counts();
    const metrics = [
      ['offer', 'Aktive Angebote', 'Auf der Website gelistet', house],
      ['sold', 'Verkaufte Referenzen', 'Erfolgreich vermittelt', check],
      ['draft', 'Entwürfe', 'Nur hier sichtbar', draft],
    ];
    shell(`<div class="a-heading">
      <div><p class="a-kicker"><i></i> Objektverwaltung</p><h1>Immobilien</h1><p class="a-intro">Angebote veröffentlichen und verkaufte Objekte als Referenzen zeigen.</p></div>
      ${action('new', 'Neues Angebot', plus, 'a-primary')}
      </div>
      <div class="a-metrics" aria-label="Bestand nach Status">
        ${metrics.map(([key, label, note, svg]) => `<button type="button" class="a-metric a-metric-${key}" data-filter="${key}" aria-pressed="${filter === key}"><span class="a-metric-top"><span class="a-metric-icon">${icon(svg)}</span><span>${label}</span></span><span class="a-metric-value">${total[key] || 0}</span><span class="a-metric-note">${note}</span></button>`).join('')}
      </div>
      <section class="a-register" aria-labelledby="a-register-title">
        <div class="a-register-top"><div><h2 id="a-register-title">Objektbestand</h2><p>Alle Immobilien Ihrer Website im Überblick.</p></div>
        <label class="a-search">${icon(searchIcon)}<span class="sr-only">Objekte suchen</span><input id="a-search" type="search" placeholder="Objekt suchen …" value="${esc(query)}"></label></div>
        <div class="a-filters" role="group" aria-label="Nach Status filtern">
          ${filters.map(([key, label]) => `<button type="button" class="a-filter" data-filter="${key}" aria-pressed="${filter === key}">${label}<span>${key === 'all' ? inventory.length : total[key] || 0}</span></button>`).join('')}
        </div>
        <div id="a-results"></div>
      </section>`, 'Immobilien');
    results();
  }

  function results() {
    const normalized = query.trim().toLocaleLowerCase('de');
    const list = inventory.filter(p => (filter === 'all' || p.status === filter) &&
      [p.title, p.city, p.type, p.kind].join(' ').toLocaleLowerCase('de').includes(normalized));
    const last = Math.max(0, Math.ceil(list.length / pageSize) - 1);
    page = Math.max(0, Math.min(last, page));
    const first = page * pageSize;
    const items = list.slice(first, first + pageSize);
    root.querySelector('#a-results').innerHTML = `
      ${items.length ? `<table class="a-table" role="table" aria-label="Objektbestand">
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Immobilie</th><th scope="col" role="columnheader">Status</th><th scope="col" role="columnheader">Aktionen</th></tr></thead><tbody role="rowgroup">
        ${items.map(p => {
          const id = esc(p.id);
          const name = esc(propertyName(p));
          const description = [p.city, p.kind, p.area ? p.area + ' m²' : ''].filter(Boolean).join(' · ');
          return `<tr role="row">
            <td role="cell"><button class="a-property" type="button" data-action="edit" data-id="${id}">${thumbnail(p)}<span><strong>${name}</strong><small>${esc(description || 'Noch keine Objektdaten')}</small></span></button></td>
            <td role="cell">${badge(p.status)}</td>
            <td role="cell"><div class="a-row-actions">
              ${p.status === 'offer' ? action('transition', 'Als verkauft markieren', check, 'a-row-text', `data-id="${id}" data-status="sold"`) : ''}
              ${p.status === 'sold' ? action('transition', 'Wieder anbieten', restore, 'a-row-text', `data-id="${id}" data-status="offer"`) : ''}
              ${action('edit', '<span class="sr-only">Bearbeiten: ' + name + '</span>', pencil, 'a-square', `data-id="${id}" title="Bearbeiten"`)}
            </div></td>
          </tr>`;
        }).join('')}
        </tbody></table>` : `<div class="a-empty">${icon(searchIcon)}<h3>${normalized ? 'Keine passenden Objekte' : 'Keine Objekte in dieser Ansicht'}</h3><p>${normalized ? 'Versuchen Sie es mit einem anderen Suchbegriff.' : 'Neue Angebote können Sie jederzeit anlegen.'}</p></div>`}
      <div class="a-register-foot"><p role="status" aria-atomic="true">${list.length ? `${first + 1}–${first + items.length} von ${list.length} ${list.length === 1 ? 'Objekt' : 'Objekten'}` : '0 Objekte'}</p>
        ${last ? `<div class="a-pagination">${action('prev-page', '<span class="sr-only">Vorherige Seite</span>', caretLeft, 'a-square', page === 0 ? 'disabled' : '')}<span>Seite ${page + 1} von ${last + 1}</span>${action('next-page', '<span class="sr-only">Nächste Seite</span>', caretRight, 'a-square', page === last ? 'disabled' : '')}</div>` : ''}
      </div>`;
  }

  function formData() {
    const form = root.querySelector('#a-editor');
    if (!form || !editing) return null;
    const data = new FormData(form);
    return {
      ...Object.fromEntries(formFields.map(key => [key, String(data.get(key) ?? '').trim()])),
      features: String(data.get('features') ?? '').split(/\r?\n/).map(value => value.trim()).filter(Boolean),
      photos: editing.photos || [],
    };
  }

  function hasEdits() {
    const current = formData();
    return Boolean(current && JSON.stringify(current) !== baseline);
  }

  function editor(p = {}) {
    editing = { ...p, photos: [...(p.photos || [])] };
    const status = p.status || 'draft';
    const isDraft = status === 'draft';
    const field = (key, label, options = {}) => {
      const { hint = '', multiline = false, placeholder = '', max = 160, inputType = 'text', mode = '', wide = false } = options;
      const value = key === 'features' ? (p.features || []).join('\n') : key === 'listingUrl' ? p.listingUrl || (p.expose ? 'https://www.immobilienscout24.de/expose/' + p.expose : '') : p[key];
      const attr = `id="a-field-${key}" name="${key}" maxlength="${max}"${requiredFields.includes(key) ? ' aria-required="true"' : ''}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}${hint ? ` aria-describedby="a-help-${key}"` : ''}`;
      return `<div class="a-field${wide ? ' a-wide' : ''}"><label for="a-field-${key}">${label}</label>${multiline ? `<textarea ${attr} rows="${key === 'features' ? 3 : 5}">${esc(value)}</textarea>` : `<input ${attr} type="${inputType}" ${mode ? `inputmode="${mode}"` : ''} value="${esc(value)}">`}${hint ? `<small id="a-help-${key}">${hint}</small>` : ''}</div>`;
    };
    const section = (number, title, description, body) => `<section class="a-form-section"><div class="a-section-heading"><span>${number}</span><div><h2>${title}</h2><p>${description}</p></div></div>${body}</section>`;
    shell(`<div class="a-editor-head">${action('list', 'Zurück zu Immobilien', arrowLeft, 'a-back')}
      <p class="a-kicker"><i></i> ${p.id ? 'Objekt bearbeiten' : 'Objekt anlegen'}</p><h1>${p.id ? esc(propertyName(p)) : 'Neues Immobilienangebot'}</h1>
      <p class="a-intro">${p.id ? 'Hier können Sie die Angaben und Fotos dieser Immobilie ändern.' : 'Erfassen Sie die wichtigsten Angaben. Bilder und Details können Sie später ergänzen.'}</p>
      <a class="a-button a-secondary a-jump" href="#a-publish">Zu den Speicheroptionen</a></div>
      <form id="a-editor" novalidate>
        <div class="a-editor-grid">
          <div class="a-form-stack">
            ${section('01', 'Stammdaten', 'Diese Angaben stehen auf der Website beim Objekt.', `<div class="a-fields">
              ${field('title', 'Titel *', { placeholder: 'z. B. Helle Wohnung mit Balkon', wide: true, max: 140 })}
              ${field('city', 'Ort *', { placeholder: 'z. B. Göppingen', max: 100 })}
              <div class="a-field"><label for="a-field-type">Objektart *</label><select name="type" id="a-field-type" aria-required="true"><option value="">Bitte auswählen</option>${types.map(type => `<option${p.type === type ? ' selected' : ''}>${type}</option>`).join('')}</select></div>
              ${field('kind', 'Genaue Objektart *', { placeholder: 'z. B. 3-Zimmer-Wohnung', wide: true, max: 120 })}
              ${field('area', 'Fläche in m²', { placeholder: 'z. B. 82,5', max: 40 })}
              ${field('areaLabel', 'Art der Fläche', { placeholder: 'z. B. Wohnfläche', max: 50 })}
              ${field('rooms', 'Zimmer', { placeholder: 'z. B. 3', max: 40 })}
              ${field('land', 'Grundstück in m²', { max: 40 })}
              ${field('year', 'Baujahr', { placeholder: 'z. B. 1998', max: 40 })}
              ${field('listingUrl', 'Link zum Exposé', { inputType: 'url', placeholder: 'https://…', max: 2048 })}
            </div>`)}
            ${section('02', 'Beschreibung', 'Halten Sie fest, was die Immobilie auszeichnet.', `<div class="a-fields">
              ${field('note', 'Beschreibung', { multiline: true, max: 6000, wide: true })}
              ${field('features', 'Ausstattung', { multiline: true, max: 4019, wide: true, hint: 'Ein Punkt pro Zeile (bis zu 20 Punkte mit je 200 Zeichen).' })}
            </div>`)}
            ${section('03', 'Objektfotos', 'Das erste Foto erscheint als Titelbild.', `<div class="a-photo-area">
              <label class="a-upload">${icon(upload)}<span><strong>Fotos auswählen</strong><small>JPG, PNG oder WebP · bis zu 8 Fotos · je max. 12 MB</small></span><input type="file" id="a-photos" multiple accept="image/jpeg,image/png,image/webp" aria-label="Objektfotos auswählen"></label>
              <p id="a-photo-message" class="a-feedback" role="status" aria-atomic="true" hidden></p><div id="a-photo-list"></div>
            </div>`)}
            ${section('04', 'Preis und Energie', 'Ergänzen Sie die Angaben, die zum Angebot gehören.', `<div class="a-fields">
              ${field('price', 'Kaufpreis', { placeholder: 'z. B. 349.000 €', max: 100 })}
              ${field('commission', 'Käuferprovision', { placeholder: 'z. B. provisionsfrei', max: 240 })}
              ${field('energyCertificate', 'Energieausweis', { multiline: true, max: 900, wide: true, hint: 'Übernehmen Sie, falls vorhanden, Ausweisart, Kennwert, Energieträger und Effizienzklasse aus dem Energieausweis.' })}
              ${field('energyYear', 'Baujahr laut Energieausweis', { max: 40 })}
            </div>`)}
          </div>
          <aside class="a-publish" id="a-publish" tabindex="-1"><section class="a-form-section">
            <div class="a-section-heading"><span>${icon(globe)}</span><div><h2>Sichtbarkeit</h2><p>Stand auf Ihrer Website</p></div></div>
            ${badge(status)}
            <p class="a-publish-copy">${isDraft ? 'Entwürfe sind nur im Portal sichtbar. Sobald Sie das Angebot veröffentlichen, erscheint es auf Ihrer Website.' : status === 'sold' ? 'Diese Immobilie ist auf Ihrer Website bei den verkauften Referenzen sichtbar.' : 'Diese Immobilie ist auf Ihrer Website sichtbar.'}</p>
            <p id="a-save-error" class="a-feedback a-error" role="alert" tabindex="-1" hidden></p>
            <div class="a-publish-actions">
              <button class="a-button a-primary" type="submit" data-save="${isDraft ? 'offer' : status}">${isDraft ? 'Angebot veröffentlichen' : status === 'sold' ? 'Referenz speichern' : 'Änderungen speichern'}${icon(isDraft ? external : check)}</button>
              ${isDraft ? '<button class="a-button a-secondary" type="submit" data-save="draft">Als Entwurf speichern</button>' : externalLink(propertyUrl(p), 'Auf Website ansehen')}
              ${status === 'offer' ? action('transition', 'Als verkauft markieren', check, 'a-secondary', `data-id="${esc(p.id)}" data-status="sold"`) : ''}
            </div>
            <p class="a-required-note">* Pflichtfelder für die Veröffentlichung</p>
          </section></aside>
        </div>
      </form>`, 'Immobilien / Bearbeiten');
    updatePhotos();
    baseline = JSON.stringify(formData());
  }

  function updatePhotos() {
    const list = root.querySelector('#a-photo-list');
    const photos = editing.photos;
    const legacy = imageSrc(editing.image);
    list.innerHTML = photos.length ? `<ul class="a-photos">${photos.map((url, index) => `<li><img src="${esc(imageSrc(url))}" alt="Objektfoto ${index + 1}" width="144" height="100"><div>
      ${index === 0 ? '<strong>Titelbild</strong>' : action('cover', 'Als Titelbild', '', 'a-quiet', `data-index="${index}" aria-label="Foto ${index + 1} als Titelbild verwenden"`)}
      ${action('remove-photo', '<span class="sr-only">Foto ' + (index + 1) + ' entfernen</span>', close, 'a-square', `data-index="${index}" title="Foto entfernen"`)}</div></li>`).join('')}</ul>`
      : legacy && !uploaded.test(editing.image) ? `<div class="a-legacy-photo"><img src="${esc(legacy)}" alt="Bisheriges Titelbild" width="96" height="65"><p>Das bisherige Titelbild und die zugehörigen Fotos bleiben erhalten, bis Sie neue Fotos speichern.</p></div>` : '';
  }

  function feedback(element, message, isError = true) {
    element.textContent = message;
    element.hidden = !message;
    element.classList.toggle('a-error', isError);
  }

  function updateNotice(message) {
    notice = message;
    const element = root.querySelector('#a-notice');
    if (element) {
      element.hidden = !message;
      element.innerHTML = message ? icon(check) + esc(message) : '';
    }
  }

  function openDialog({ title, copy, label, run }) {
    const dialog = root.querySelector('#a-dialog');
    pendingTransition = run;
    transitionTrigger = document.activeElement;
    dialog.querySelector('#a-dialog-content').innerHTML = `<span class="a-login-icon">${icon(check)}</span><h2 id="a-dialog-title">${esc(title)}</h2><p id="a-dialog-copy">${esc(copy)}</p>`;
    dialog.querySelector('[data-action="confirm-dialog"]').textContent = label;
    feedback(dialog.querySelector('#a-dialog-error'), '');
    dialog.addEventListener('close', () => {
      pendingTransition = null;
      if (transitionTrigger?.isConnected) transitionTrigger.focus();
      transitionTrigger = null;
    }, { once: true });
    dialog.showModal();
  }

  function leaveEditor(next, label = 'Änderungen verwerfen') {
    if (saving || uploading) return;
    if (!hasEdits()) return next();
    openDialog({
      title: 'Änderungen verwerfen?',
      copy: 'Die Änderungen an diesem Objekt wurden noch nicht gespeichert.',
      label,
      run: async () => { root.querySelector('#a-dialog').close(); await next(); },
    });
  }

  async function save(status) {
    if (!editing || saving || uploading) return;
    const form = root.querySelector('#a-editor');
    const errorBox = root.querySelector('#a-save-error');
    const data = formData();
    form.querySelectorAll('[aria-invalid]').forEach(element => {
      element.removeAttribute('aria-invalid');
      element.removeAttribute('aria-errormessage');
    });
    const invalid = status !== 'draft' ? requiredFields.filter(key => !data[key]) : [];
    if (data.listingUrl) {
      try {
        const url = new URL(data.listingUrl);
        if (url.protocol !== 'https:' || url.username || url.password) throw new Error();
      }
      catch { invalid.push('listingUrl'); }
    }
    if (data.features.length > 20 || data.features.some(value => value.length > 200)) invalid.push('features');
    if (invalid.length) {
      const message = invalid[0] === 'listingUrl' ? 'Geben Sie für das Exposé einen vollständigen HTTPS-Link ein.'
        : invalid[0] === 'features' ? 'Geben Sie höchstens 20 Ausstattungspunkte mit je 200 Zeichen ein.' : 'Bitte füllen Sie die mit * markierten Felder aus.';
      feedback(errorBox, message);
      invalid.forEach(key => form.elements[key].setAttribute('aria-invalid', 'true'));
      const target = form.elements[invalid[0]];
      target.setAttribute('aria-errormessage', 'a-save-error');
      target.focus();
      return;
    }
    feedback(errorBox, '');
    saving = true;
    const buttons = [...form.querySelectorAll('button, input, textarea, select')];
    buttons.forEach(button => { button.disabled = true; });
    const active = form.querySelector(`[data-save="${status}"]`);
    const label = active.innerHTML;
    active.textContent = 'Wird gespeichert …';
    try {
      const { property } = await request(editing.id ? '/properties/' + encodeURIComponent(editing.id) : '/properties', {
        method: editing.id ? 'PUT' : 'POST', data: { ...data, status },
      });
      const wasDraft = !editing.id || editing.status === 'draft';
      inventory = [property, ...inventory.filter(item => item.id !== property.id)];
      filter = property.status;
      query = '';
      page = 0;
      notice = status === 'draft' ? 'Der Entwurf wurde gespeichert.' : status === 'offer' && wasDraft ? 'Das Angebot ist jetzt auf Ihrer Website sichtbar.' : 'Die Änderungen wurden gespeichert.';
      dashboard();
      top();
      focusMain();
    } catch (error) {
      if (error.status === 401) return login({ error: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.' });
      feedback(errorBox, error.message);
      errorBox.focus();
    } finally {
      saving = false;
      buttons.forEach(button => { button.disabled = false; });
      active.innerHTML = label;
    }
  }

  async function uploadPhotos(files) {
    if (saving || uploading || !files.length) return;
    const message = root.querySelector('#a-photo-message');
    const fileInput = root.querySelector('#a-photos');
    fileInput.value = '';
    if (editing.photos.length + files.length > 8) return feedback(message, 'Wählen Sie insgesamt höchstens 8 Fotos.');
    if (files.some(file => !photoTypes.includes(file.type) || file.size > 12 * 1024 * 1024)) return feedback(message, 'Bitte wählen Sie JPG-, PNG- oder WebP-Dateien mit höchstens 12 MB pro Foto.');
    uploading = true;
    fileInput.disabled = true;
    root.querySelectorAll('[data-save]').forEach(button => { button.disabled = true; });
    let completed = 0;
    try {
      for (const file of files) {
        feedback(message, `Foto ${completed + 1} von ${files.length} wird hochgeladen …`, false);
        const { url } = await request('/uploads', { method: 'POST', file });
        editing.photos.push(url);
        completed++;
        updatePhotos();
      }
      feedback(message, completed === 1 ? 'Ein Foto wurde hinzugefügt.' : `${completed} Fotos wurden hinzugefügt.`, false);
    } catch (error) {
      if (error.status === 401) return login({ error: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.' });
      feedback(message, error.message);
    } finally {
      uploading = false;
      fileInput.disabled = false;
      root.querySelectorAll('[data-save]').forEach(button => { button.disabled = false; });
    }
  }

  function changeStatus(id, status) {
    const property = inventory.find(item => item.id === id);
    if (!property || saving || uploading) return;
    const sold = status === 'sold';
    const fromEditor = Boolean(editing);
    openDialog({
      title: sold ? 'Als verkauft markieren?' : 'Wieder als Angebot anzeigen?',
      copy: sold ? `„${propertyName(property)}“ erscheint danach bei den verkauften Referenzen. Die Adresse der Objektseite bleibt gleich.`
        : `„${propertyName(property)}“ erscheint danach wieder unter den aktuellen Angeboten.`,
      label: sold ? 'Als verkauft markieren' : 'Wieder anbieten',
      run: async () => {
        const updated = await request('/properties/' + encodeURIComponent(id), { method: 'PATCH', data: { status } });
        inventory = [updated.property, ...inventory.filter(item => item.id !== id)];
        root.querySelector('#a-dialog').close();
        if (fromEditor) { filter = status; page = 0; query = ''; }
        notice = sold ? 'Das Objekt steht jetzt bei den verkauften Referenzen.' : 'Das Objekt ist wieder als Angebot sichtbar.';
        dashboard();
        focusMain();
      },
    });
  }

  async function logout() {
    try {
      await request('/session', { method: 'DELETE' });
      notice = '';
      filter = 'all';
      query = '';
      page = 0;
      login();
      focusMain();
    } catch (error) {
      const box = root.querySelector('#a-notice');
      if (box) feedback(box, error.message);
    }
  }

  root.addEventListener('submit', async event => {
    event.preventDefault();
    if (event.target.id === 'a-editor') return save(event.submitter?.dataset.save || (editing?.status === 'draft' || !editing?.id ? 'offer' : editing.status));
    if (event.target.id !== 'a-login-form') return;
    const form = event.target;
    const button = form.querySelector('button');
    if (button.disabled) return;
    const data = { password: form.elements.password.value };
    button.disabled = true;
    button.textContent = 'Anmeldung läuft …';
    feedback(form.querySelector('.a-feedback'), '');
    try {
      await request('/session', { method: 'POST', data });
      await loadInventory();
      dashboard();
      focusMain();
    } catch (error) {
      feedback(form.querySelector('.a-feedback'), error.message);
      form.elements.password.focus();
      form.elements.password.select();
    } finally {
      button.disabled = false;
      button.innerHTML = 'Anmelden ' + icon(caretRight);
    }
  });

  root.addEventListener('input', event => {
    if (event.target.id === 'a-search') { query = event.target.value; page = 0; results(); }
    if (event.target.closest('#a-editor')) {
      event.target.removeAttribute('aria-invalid');
      event.target.removeAttribute('aria-errormessage');
    }
  });
  root.addEventListener('change', event => {
    if (event.target.id === 'a-photos') uploadPhotos([...event.target.files]);
  });
  root.addEventListener('click', async event => {
    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) {
      filter = filterButton.dataset.filter;
      page = 0;
      root.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
      results();
      return;
    }
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action: name, id, status, index } = button.dataset;
    const openEditor = p => { updateNotice(''); editor(p); top(); focusMain(); };
    const showList = () => { dashboard(); top(); focusMain(); };
    if (name === 'new') return openEditor({});
    if (name === 'list') return editing ? leaveEditor(showList) : showList();
    if (name === 'edit') return openEditor(inventory.find(item => item.id === id));
    if (name === 'logout') return editing ? leaveEditor(logout, 'Verwerfen und abmelden') : logout();
    if (name === 'retry') return initialize();
    if (name === 'transition') {
      if (editing && hasEdits()) {
        const box = root.querySelector('#a-save-error');
        feedback(box, 'Speichern Sie zuerst Ihre Änderungen. Anschließend können Sie das Objekt als verkauft markieren.');
        box.focus();
        return;
      }
      return changeStatus(id, status);
    }
    if (name === 'prev-page' || name === 'next-page') {
      page += name === 'prev-page' ? -1 : 1;
      results();
      (root.querySelector(`[data-action="${name}"]:not(:disabled)`) || root.querySelector('.a-pagination button:not(:disabled)'))?.focus();
      root.querySelector('#a-register-title')?.scrollIntoView({ block: 'nearest' });
    }
    if ((name === 'remove-photo' || name === 'cover') && !uploading && !saving) {
      const [url] = editing.photos.splice(Number(index), 1);
      if (name === 'cover') editing.photos.unshift(url);
      updatePhotos();
      (root.querySelector('#a-photo-list button') || root.querySelector('#a-photos'))?.focus();
    }
    if (name === 'cancel-dialog') root.querySelector('#a-dialog').close();
    if (name === 'confirm-dialog' && pendingTransition) {
      const dialog = root.querySelector('#a-dialog');
      const cancel = dialog.querySelector('[data-action="cancel-dialog"]');
      const title = button.textContent;
      const preventClose = event => event.preventDefault();
      dialog.addEventListener('cancel', preventClose);
      button.disabled = cancel.disabled = true;
      button.textContent = 'Wird ausgeführt …';
      try { await pendingTransition(); }
      catch (error) {
        if (error.status === 401) login({ error: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.' });
        else feedback(dialog.querySelector('#a-dialog-error'), error.message);
      } finally {
        button.disabled = cancel.disabled = false;
        button.textContent = title;
        dialog.removeEventListener('cancel', preventClose);
      }
    }
  });

  await initialize();
}
