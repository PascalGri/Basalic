import { isPagesPreview } from './site-paths.js';

const hasContactEndpoint = !isPagesPreview || Boolean(import.meta.env?.VITE_BASALIC_CONTACT_ENDPOINT);

export const getLegalContent = arrow => ({
 '/impressum': {
  title: 'Impressum.',
  intro: 'Angaben zu Senad Basalic & Partner.',
  body: `<h2>Anbieter und Kontakt</h2>
<p>Senad Basalic<br>Senad Basalic &amp; Partner</p>
<p>E-Mail <a href="mailto:info@basalic.de">info@basalic.de</a><br>Telefon <a href="tel:+491786654819">+49 178 6654819</a></p>
<h2>Tätigkeiten und berufsrechtliche Regelungen</h2>
<p>Immobilienvermittlung, Wohnimmobilienverwaltung und allgemeine Darlehensvermittlung fallen unter <a href="https://www.gesetze-im-internet.de/gewo/__34c.html" target="_blank" rel="noopener noreferrer">§ 34c GewO ${arrow}</a>.</p>
<p>Registrierungsnummer für die Versicherungsvermittlung D-ITJM-VPCW6-67. Die berufsrechtlichen Regelungen stehen in <a href="https://www.gesetze-im-internet.de/gewo/__34d.html" target="_blank" rel="noopener noreferrer">§ 34d GewO ${arrow}</a> und der <a href="https://www.gesetze-im-internet.de/versvermv_2018/" target="_blank" rel="noopener noreferrer">Versicherungsvermittlungsverordnung ${arrow}</a>.</p>
<p>Registrierungsnummer für die Immobiliardarlehensvermittlung D-W-175-RJTU-55. Berufsrechtliche Regelungen finden Sie in <a href="https://www.gesetze-im-internet.de/gewo/__34i.html" target="_blank" rel="noopener noreferrer">§ 34i GewO ${arrow}</a>.</p>
<p><a href="/erstinformationen">Vermittler- und Verbraucherinformationen ${arrow}</a></p>`
 },
 '/datenschutz': {
  title: 'Datenschutz.',
  intro: 'Informationen zur Nutzung dieser Website und zur Kontaktaufnahme.',
  body: `<h2>1. Verantwortlicher</h2>
<p>Senad Basalic · Senad Basalic &amp; Partner<br>E-Mail <a href="mailto:info@basalic.de">info@basalic.de</a><br>Telefon <a href="tel:+491786654819">+49 178 6654819</a></p>
<h2>2. Technische Bereitstellung</h2>
<p>Beim Aufruf werden Verbindungsdaten verarbeitet, insbesondere die IP-Adresse, die angeforderte Adresse und Browserinformationen. Zweck ist die Bereitstellung und der störungsfreie Betrieb der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
${isPagesPreview ? '<p>Diese Vorschau wird über GitHub Pages bereitgestellt. GitHub protokolliert beim Abruf die IP-Adresse zu Sicherheitszwecken. Weitere Informationen finden Sie in der <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub-Datenschutzerklärung</a>.</p>' : ''}
<h2>3. Cookies und externe Inhalte</h2>
<p>Auf den öffentlichen Seiten verwenden wir weder Cookies noch Tracking und speichern Ihre Formulareingaben nicht dauerhaft im Browser. Schriften und Bilder werden direkt mit der Website geladen. Externe Anbieter werden aufgerufen, wenn Sie deren Links öffnen. Dort gelten die jeweiligen Datenschutzhinweise.</p>
<h2>4. E-Mail und Telefon</h2>
${hasContactEndpoint ? '<p>Wenn der Direktversand eingerichtet ist, übermitteln Sie beim Absenden des Kontaktformulars Ihren Namen, Ihre E-Mail-Adresse, das Thema, Ihre Nachricht und gegebenenfalls Ihre Telefonnummer. Der Versanddienst Resend stellt uns die Nachricht per E-Mail zu.</p>' : '<p>In dieser Vorschau erreichen Sie uns über die angegebene E-Mail-Adresse und per Telefon.</p>'}
<p>Wenn Sie uns kontaktieren, bearbeiten wir Ihre Kontaktdaten und Ihr Anliegen zur Beantwortung der Anfrage. Geht es um einen Vertrag oder vorvertragliche Maßnahmen, ist Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage. Bei anderen Anfragen gilt Art. 6 Abs. 1 lit. f DSGVO mit dem berechtigten Interesse, Ihre Anfrage zu beantworten. Die Kontaktaufnahme ist freiwillig. Ohne die für Ihr Anliegen notwendigen Angaben können wir es gegebenenfalls nicht bearbeiten.</p>
<h2>5. Ihre Rechte</h2>
<p>Unter den gesetzlichen Voraussetzungen haben Sie Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO können Sie aus Gründen Ihrer besonderen Situation Widerspruch einlegen. Eine erteilte Einwilligung können Sie jederzeit für die Zukunft widerrufen. Die Rechtmäßigkeit der bisherigen Verarbeitung bleibt unberührt. Wenden Sie sich dafür an die oben genannten Kontaktdaten.</p>
<p>Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere am Ort Ihres gewöhnlichen Aufenthalts, Ihres Arbeitsplatzes oder des vermuteten Verstoßes.</p>
<h2>6. Automatisierte Entscheidungen</h2>
<p>Diese Website verwendet keine automatisierte Entscheidungsfindung oder Profilbildung.</p>`
 },
 '/erstinformationen': {
  title: 'Gut informiert.<br><em>Von Anfang an.</em>',
  intro: 'Informationen zu unseren Vermittlungstätigkeiten.',
  body: `<h2>Identität und Kontakt</h2>
<p>Senad Basalic · Senad Basalic &amp; Partner<br><a href="mailto:info@basalic.de">info@basalic.de</a> · <a href="tel:+491786654819">+49 178 6654819</a></p>
<h2>Versicherungsvermittlung</h2>
<p>Registrierungsnummer D-ITJM-VPCW6-67.</p>
<p>Wir beraten zu Absicherung und Altersvorsorge. Nach §§ 15 und 16 VersVermV wird die Erstinformation beim ersten Geschäftskontakt erteilt.</p>
<h2>Vermittlerregister</h2>
<p>Deutsche Industrie- und Handelskammer (DIHK), Breite Straße 29, 10178 Berlin. Telefon 0180 6005850 (0,20 € je Anruf). Die DIHK führt das gemeinsame <a href="https://www.vermittlerregister.info/recherche" target="_blank" rel="noopener noreferrer">Vermittlerregister ${arrow}</a>.</p>
<h2>Immobiliardarlehensvermittlung</h2>
<p>Registrierungsnummer D-W-175-RJTU-55.</p>
<p>Die Informationen nach Art. 247 §§ 13 und 13b EGBGB sind rechtzeitig vor dem Vermittlungsvertrag auf einem dauerhaften Datenträger bereitzustellen. Beginnt die Vermittlung früher, werden die dafür vorgesehenen Informationen vor dieser Tätigkeit erteilt.</p>
<h2>Beschwerde und Schlichtung</h2>
<p>Beschwerden können Sie an <a href="mailto:info@basalic.de">info@basalic.de</a> richten. Informationen zur Schlichtung in Versicherungssachen finden Sie beim <a href="https://www.versicherungsombudsmann.de/kontakt/" target="_blank" rel="noopener noreferrer">Versicherungsombudsmann e. V. ${arrow}</a>, Postfach 080632, 10006 Berlin, und beim <a href="https://www.pkv-ombudsmann.de/servicebereich/kontakt/" target="_blank" rel="noopener noreferrer">Ombudsmann Private Kranken- und Pflegeversicherung ${arrow}</a>, Postfach 06 02 22, 10052 Berlin.</p>
<h2>Immobilien und weitere Dienstleistungen</h2>
<p>Vor einer Beauftragung informieren wir Sie über Leistungsumfang, Preis und gegebenenfalls Provision. Für Kaufmaklerverträge über Wohnungen und Einfamilienhäuser gilt die Textform nach § 656a BGB. Für Verbraucher gelten gegebenenfalls auch §§ 656c und 656d BGB.</p>
<h2>Vertragsschluss und Widerruf</h2>
<p>Eine Anfrage an uns ist unverbindlich. Bei einem späteren Fernabsatzvertrag oder einem Vertrag außerhalb von Geschäftsräumen erhalten Sie die dazugehörigen Verbraucherinformationen und Widerrufsbelehrungen gesondert.</p>`
 },
 '/barrierefreiheit': {
  title: 'Zugänglich<br><em>gedacht.</em>',
  intro: 'Informationen zur Bedienung dieser Website und zu Ihren Möglichkeiten, uns auf eine Barriere hinzuweisen.',
  body: `<h2>Bedienung und Darstellung</h2>
<p>Mit der Sprungnavigation gelangen Sie direkt zum Inhalt. Bedienelemente lassen sich per Tastatur erreichen und haben sichtbare Fokusmarkierungen. Formularfelder sind beschriftet und Bilder haben Beschreibungen. Die Darstellung passt sich auch schmalen Bildschirmen an. Bewegungen werden bei entsprechender Systemeinstellung reduziert.</p>
<h2>Rückmeldung zur Bedienung</h2>
<p>Wenn Sie auf eine Barriere stoßen, schreiben Sie uns an <a href="mailto:info@basalic.de?subject=Hinweis%20zur%20Barrierefreiheit">info@basalic.de</a> oder rufen Sie uns unter <a href="tel:+491786654819">+49 178 6654819</a> an. Beschreiben Sie möglichst die betroffene Seite und die aufgetretene Schwierigkeit, damit wir Ihr Anliegen prüfen können.</p>
<p><a href="https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/FAQ-Immobilien/faq-immobilien_node" target="_blank" rel="noopener noreferrer">Offizielle BFSG-Informationen zur Immobilienbranche (extern) ${arrow}</a></p>`
 },
 '/bildnachweise': {
  title: 'Bilder mit<br><em>Herkunft.</em>',
  intro: 'Informationen zu unseren Immobilienabbildungen, den illustrativen Motiven und den verwendeten Schriften und Symbolen.',
  body: `<h2>Immobilien und Porträt</h2>
<p>Die Objektfotos und das Porträt von Senad Basalic verwenden wir mit Freigabe des Anbieters. Grundrisse sind als solche gekennzeichnet.</p>
<h2>Illustrative Motive</h2>
<p>KI-generierte Beispielbilder veranschaulichen Finanzierung, Mietverwaltung, Absicherung und Altersvorsorge.</p>
<h2>Schriften und Symbole</h2>
<p>Geist wird lokal über Fontsource eingebunden und steht unter der SIL Open Font License 1.1. Die Website verwendet zusätzlich Systemschriften des Geräts. Die Symbole stammen aus der Phosphor-Icons-Bibliothek unter MIT-Lizenz.</p>
<h2>Gestaltung</h2>
<p>Wortmarke und grafische Elemente wurden für Senad Basalic &amp; Partner gestaltet.</p>`
 }
});
