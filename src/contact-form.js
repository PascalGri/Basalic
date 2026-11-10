import { contactLimits, contactTopics, validateContact } from './contact-fields.js';
import { isPagesPreview } from './site-paths.js';

const endpoint = isPagesPreview ? import.meta.env.VITE_BASALIC_CONTACT_ENDPOINT : '/api/contact';
const unavailable = 'Der Direktversand ist für diese Vorschau noch nicht eingerichtet. Bitte kontaktieren Sie uns per E-Mail oder Telefon.';
const invalidFields = 'Bitte prüfen Sie die markierten Felder.';
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const fieldFeedback = name => `<p id="contact-${name}-feedback" class="contact-field-feedback" role="status"></p>`;

export function contactFormMarkup(topic, message, arrow) {
  return `<div class="contact-form-panel">
    <h2>Was haben Sie vor?</h2>
    <p>Schreiben Sie uns direkt. Wir melden uns per E-Mail oder, wenn Sie eine Nummer angeben, telefonisch.</p>
    <form id="page-contact-form" method="post" novalidate>
      <label for="contact-topic">Worum geht es?</label>
      <select id="contact-topic" name="topic" required aria-describedby="contact-topic-feedback">
        <option value="">Bitte wählen</option>
        ${contactTopics.map(value => `<option${topic === value ? ' selected' : ''}>${esc(value)}</option>`).join('')}
      </select>
      ${fieldFeedback('topic')}
      <div class="form-columns">
        <div>
          <label for="contact-name">Vor- und Nachname</label>
          <input id="contact-name" name="name" autocomplete="name" maxlength="${contactLimits.name}" required aria-describedby="contact-name-feedback">
          ${fieldFeedback('name')}
        </div>
        <div>
          <label for="contact-phone">Telefon <span>(optional)</span></label>
          <input id="contact-phone" name="phone" type="tel" autocomplete="tel" maxlength="${contactLimits.phone}" aria-describedby="contact-phone-feedback">
          ${fieldFeedback('phone')}
        </div>
      </div>
      <label for="contact-email">Ihre E-Mail-Adresse</label>
      <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="${contactLimits.email}" required aria-describedby="contact-email-feedback">
      ${fieldFeedback('email')}
      <label for="contact-message">Ihr Anliegen</label>
      <textarea id="contact-message" name="message" rows="5" maxlength="${contactLimits.message}" required aria-describedby="contact-message-feedback" placeholder="Erzählen Sie uns von Ihren Plänen.">${esc(message)}</textarea>
      ${fieldFeedback('message')}
      <p class="form-note">Bitte übermitteln Sie hier keine Gesundheits- oder Finanzunterlagen. <a href="/datenschutz">Datenschutzhinweise</a></p>
      <button class="button" type="submit"><span class="button-label">Nachricht senden</span><span class="button-icon">${arrow}</span></button>
      <p class="mail-help" id="page-mail-help" role="status">${endpoint ? '' : unavailable}</p>
    </form>
  </div>`;
}

export function setupContactForm(form) {
  const controls = ['topic', 'name', 'phone', 'email', 'message'].map(name => form.elements.namedItem(name));
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('.button-label');
  const status = form.querySelector('#page-mail-help');
  const checked = new Set();

  function showFieldFeedback(control, value = '', error = '') {
    const hint = form.querySelector(`#contact-${control.name}-feedback`);
    const message = error || (value ? 'Gültige Eingabe.' : '');
    if (hint.textContent !== message) hint.textContent = message;
    if (message) control.setAttribute('aria-invalid', String(Boolean(error)));
    else control.removeAttribute('aria-invalid');
  }

  function showValidation({ values, errors }) {
    controls.forEach(control => {
      checked.add(control);
      showFieldFeedback(control, values[control.name], errors[control.name]);
    });
    const firstInvalid = controls.find(control => errors[control.name]);
    firstInvalid?.focus();
    return Boolean(firstInvalid);
  }

  function feedback(message, error = false) {
    status.textContent = message;
    status.classList.toggle('contact-send-error', error);
  }

  function validateField(control) {
    checked.add(control);
    const { values, errors } = validateContact({ [control.name]: control.value });
    showFieldFeedback(control, values[control.name], errors[control.name]);
    if (status.textContent === invalidFields && !form.querySelector('[aria-invalid="true"]')) feedback('');
  }

  form.addEventListener('focusout', event => {
    if (controls.includes(event.target) && !checked.has(event.target)) validateField(event.target);
  });
  form.addEventListener('input', event => {
    if (checked.has(event.target)) validateField(event.target);
  });
  form.elements.namedItem('topic').addEventListener('change', event => {
    validateField(event.target);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    const { values, errors } = validateContact(Object.fromEntries(new FormData(form)));
    if (showValidation({ values, errors })) {
      feedback(invalidFields, true);
      return;
    }
    if (!endpoint) {
      feedback(unavailable, true);
      return;
    }

    let serverFields;
    button.disabled = true;
    controls.forEach(control => { control.disabled = true; });
    label.textContent = 'Wird gesendet …';
    feedback('Ihre Nachricht wird gesendet.');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (response.ok && result.ok === true) {
        controls.forEach(control => {
          control.value = '';
          showFieldFeedback(control);
        });
        checked.clear();
        feedback('Vielen Dank. Ihre Nachricht wurde gesendet.');
      } else {
        serverFields = result.fields;
        feedback(result.error || 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.', true);
      }
    } catch {
      feedback('Der Versand konnte nicht bestätigt werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns per E-Mail.', true);
    } finally {
      button.disabled = false;
      controls.forEach(control => { control.disabled = false; });
      label.textContent = 'Nachricht senden';
      if (serverFields) showValidation({ values, errors: serverFields });
    }
  });
}
