import { services } from './data.js';

export const contactTopics = Object.freeze([...services.map(service => service.title), 'Allgemeine Anfrage']);
export const contactLimits = Object.freeze({ name: 100, email: 200, phone: 50, message: 3000 });

const nameWord = /^\p{L}[\p{L}\p{M}]*(?:['’\p{Pd}]\p{L}[\p{L}\p{M}]*)*\.?$/u;
const mailbox = /^[a-z\d!#$%&'*+/=?^_`{|}~.-]+$/i;
const domainLabel = /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i;

export function isContactEmail(value) {
  if (typeof value !== 'string' || value.length > contactLimits.email) return false;
  const [local, domain, ...rest] = value.split('@');
  if (!local || !domain || rest.length || local.length > 64 || !mailbox.test(local) || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every(label => domainLabel.test(label)) && /[a-z]/i.test(labels.at(-1));
}

export function validateContact(input) {
  const text = key => typeof input?.[key] === 'string' ? input[key].trim() : '';
  const values = {
    name: text('name').replace(/\s+/gu, ' '),
    email: text('email'),
    phone: text('phone'),
    topic: text('topic'),
    message: text('message'),
  };
  const errors = {};
  const nameWords = values.name.split(' ');
  if (values.name.length > contactLimits.name || nameWords.length < 2 || !nameWords.every(word => nameWord.test(word))) {
    errors.name = 'Bitte Vor- und Nachnamen eingeben.';
  }
  if (!isContactEmail(values.email)) errors.email = 'Bitte geben Sie eine E-Mail-Adresse wie name@beispiel.de ein.';
  if (values.phone || (input?.phone != null && typeof input.phone !== 'string')) {
    const digits = values.phone.replace(/\D/g, '').length;
    if (values.phone.length > contactLimits.phone || digits < 5 || digits > 20 || !/^\+?[\d ()/.-]+$/.test(values.phone)) {
      errors.phone = 'Telefonnummer eingeben, z. B. +49 170 1234567.';
    }
  }
  if (!contactTopics.includes(values.topic)) errors.topic = 'Bitte wählen Sie ein Thema aus.';
  if (!values.message || values.message.length > contactLimits.message || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(values.message)) {
    errors.message = `Bitte geben Sie eine Nachricht mit höchstens ${contactLimits.message} Zeichen ein.`;
  }
  return { values, errors };
}
