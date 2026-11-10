import { RequestError } from './properties.mjs';
import { contactDeliveryPaused } from '../src/contact-fields.js';

const sendEmailUrl = 'https://api.resend.com/emails';
const unavailable = 'Das Kontaktformular ist derzeit nicht verfügbar. Bitte schreiben Sie uns direkt per E-Mail.';
const deliveryError = 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt per E-Mail.';
const rateWindow = 15 * 60 * 1000;
const topicRecipients = new Map([
  ['Immobilien', 'immobilien@basalic.de'],
  ['Finanzierung', 'finanzierung@basalic.de'],
]);

export function createContactMailer({ apiKey = '', from = '', to = '' } = {}) {
  const configured = !contactDeliveryPaused && Boolean(apiKey && from);
  const attempts = [];

  async function send({ name, email, phone, topic, message }) {
    if (contactDeliveryPaused) throw new RequestError(503, 'Der Versand über das Kontaktformular ist vorübergehend pausiert.');
    if (!configured) throw new RequestError(503, unavailable);

    const now = Date.now();
    while (attempts.length && attempts[0].at <= now - rateWindow) attempts.shift();
    const sender = email.toLowerCase();
    if (attempts.length >= 30 || attempts.filter(attempt => attempt.sender === sender).length >= 5) {
      throw new RequestError(429, 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.');
    }
    attempts.push({ at: now, sender });

    let response;
    try {
      response = await fetch(sendEmailUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Basalic Website <${from}>`,
          to: [to || topicRecipients.get(topic) || 'info@basalic.de'],
          reply_to: email,
          subject: `Website-Anfrage: ${topic}`,
          text: `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone || '–'}\nThema: ${topic}\n\n${message}`,
        }),
        redirect: 'error',
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      console.error('Kontaktversand: Der E-Mail-Dienst war nicht erreichbar.');
      throw new RequestError(502, deliveryError);
    }
    const result = await response.json().catch(() => null);
    if (!response.ok || typeof result?.id !== 'string' || !result.id) {
      console.error(`Kontaktversand: Der E-Mail-Dienst hat die Anfrage nicht bestätigt (HTTP ${response.status}).`);
      throw new RequestError(502, deliveryError);
    }
  }

  return { configured, send };
}
