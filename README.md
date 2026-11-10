# Senad Basalic & Partner

Dieses Repository enthält auf `main` die helle Basalic-Website mit der Startseite **„Für Ihr Zuhause. Und alles, was folgt.“** und das zugehörige Immobilienportal. Website und Portal laufen aus demselben Hauptverzeichnis.

```sh
npm ci
npm run build
npm start
```

Lokale Website: http://127.0.0.1:5104/
Immobilienportal: http://127.0.0.1:5104/admin

Für die Anmeldung einmalig das Passwort einrichten. Die [Anleitung zur Immobilienverwaltung](docs/ADMIN.md) erklärt Einrichtung, Bedienung und Betrieb. Ohne eingerichtetes Passwort bleibt der Zugang geschlossen.

- **Website:** Serifentitel, helle Flächen und ein dezenter Farbverlauf in Pfirsich, Rosé, Lavendel und Blau. Die bewegten Elemente lassen sich pausieren und berücksichtigen die Einstellung für reduzierte Bewegung. Design- und Quellenabgleich: [FINANCE_TEMPLATE.md](docs/FINANCE_TEMPLATE.md).
- **Immobilien:** 49 mitgelieferte Objekte, darunter 7 Angebote, 2 Auslandsobjekte und 40 verkaufte Referenzen. Die Website übernimmt neue Angebote und Statusänderungen direkt aus dem Portal. Objektadressen bleiben bei einem Verkauf erhalten.
- **Portal:** Angebote und Fotos ergänzen, private Entwürfe speichern und Angebote veröffentlichen. Verkaufte Objekte mit **Als verkauft markieren** zu den Referenzen verschieben.
- **Weitere Seiten:** Immobilienverkauf, Finanzierung, Mietverwaltung, Vorsorge, Über uns, Kontakt und rechtliche Hinweise. Das Kontaktformular kann Anfragen direkt per E-Mail zustellen.

`npm run dev` und `npm run preview` unterstützen dieselbe lokale Datenablage. Nach dem Build prüft `npm run check:admin` den Verwaltungsablauf in einem separaten Testbestand. `npm run check` prüft Daten, Bilder und die 62 mitgelieferten Seiten gegen den laufenden lokalen Server.

Die Vorschau ist von der Indexierung ausgeschlossen. [SEO und Medien](docs/SEO_MEDIA.md) beschreibt die Konfiguration für den späteren Betrieb. [Bildnachweise](docs/ASSET_LICENSES.md) und [offene Betreiberangaben](docs/LEGAL_REVIEW.md) sind separat dokumentiert.

## GitHub Pages und Kontaktversand

`npm run build:pages` erzeugt eine statische Vorschau in `dist-pages/`. `BASALIC_PAGES_BASE` bestimmt den Repository-Pfad (z. B. `/Basalic/`), `BASALIC_PAGES_ORIGIN` die öffentliche Origin. Der Pages-Branch enthält den Inhalt dieses Verzeichnisses. Die Immobilienverwaltung läuft über den Node-Server.

Für den Direktversand in der Serverumgebung `BASALIC_CONTACT_RESEND_API_KEY` und `BASALIC_CONTACT_FROM` mit einem in Resend verifizierten Absender setzen. `BASALIC_CONTACT_TO` kann die Empfänger überschreiben. Für einen separaten öffentlichen Formulardienst die Pages-Origin in `BASALIC_CONTACT_ALLOWED_ORIGIN` am Server eintragen und beim Pages-Build die öffentliche HTTPS-Adresse des Endpunkts `/api/contact` als `VITE_BASALIC_CONTACT_ENDPOINT` setzen. Der API-Schlüssel bleibt in der Serverumgebung.
