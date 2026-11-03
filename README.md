# Senad Basalic & Partner

Aktuelle Basalic-Website auf `main`. Referenz: https://rbp-saas-template.vercel.app/ . Alle Quelldateien liegen direkt in diesem Hauptverzeichnis. Frühere Vorschau-Entwürfe sind aus dem Projekt entfernt und separat gesichert.

```sh
npm ci
npm run build
npm run preview
```

Vorschau: http://127.0.0.1:5104/ . Nur auf dem eigenen Rechner erreichbar. Einen bereits laufenden Prozess auf diesem Port weiterverwenden.

## Gestaltung und Effekte

- Geist mit kursiven Systemserifen, Lime-Akzent, runde Außenkontur und schwebende Navigation.
- An die Referenz angelehnte aufgesteckte Text-/Pfeilbuttons mit Rotation bei Hover/Fokus.
- Gestaffelte Hero-Einblendungen mit Blur, Mausparallaxe des echten Basalic-Motivs und Lenis-Scrollverhalten.
- Laufende Berufsprofil-Leiste, wortweiser Scroll-Blur, asymmetrische Leistungskarten.
- Verkaufte Referenzen mit echten Objektabbildungen, manueller Auswahl, pausierbarem 10-Sekunden-Wechsel und Tastaturbedienung.
- Sticky-Themenbereich mit scrollender Verbindungslinie, animierte FAQ, große Kontakt-CTA.
- Helles und dunkles Design ohne dauerhafte Speicherung. Systemeinstellung für reduzierte Bewegung berücksichtigt.

Alle Inhalte wurden sinnvoll für einen Immobilien- und Finanzdienstleister adaptiert. Es gibt keine erfundenen SaaS-Abos, Produktpreise, Kundenbewertungen oder Nutzerzahlen. Alle Medien stammen aus der bisherigen Website; die Template-Dashboardgrafik und Fremdmarken sind nicht übernommen.

## Vollständige Inhalte und Unterseiten

- Immobilien mit Suche, Objektartfilter und getrennter Referenzansicht.
- Alle 49 Objektseiten: 7 Verkaufsangebote, 2 Auslandsobjekte, 40 verkaufte Referenzen. 48 zugeordnete Objektabbildungen; für Salach bleibt das Beispielbild ausdrücklich ohne vermeintliche Objektfoto-Zuordnung.
- Mietverwaltung, Baufinanzierung/Privatkredite/Umschuldung, Absicherung/Altersvorsorge.
- Über uns mit Berufsrollen, IHK-Ausbildungsbetrieb, Göppinger Herkunft, Tätigkeit seit 2001, Partnern und persönlicher Profilerstellung.
- Kontakt mit belegten Telefonnummern/Fachadressen, optionaler Rückrufnummer und Antwortadresse. Formulare bereiten lediglich einen E-Mail-Entwurf vor; es wird nichts automatisch verschickt.
- Impressum, Datenschutz, Erstinformationen, Barrierefreiheit und Bildnachweise. Die bekannten widersprüchlichen Geschäftsadressen bleiben offen und Rechtstexte als Entwurf erkennbar.
- Ursprüngliche Pfade `/Immobilien`, `/Mietverwaltung`, `/Vorsorge` und `/about` werden auf die entsprechenden neuen Seiten geführt.

## Analyse und Nachweise

- `docs/TEMPLATE_ANALYSIS.md`: detaillierte Referenzanalyse einschließlich Maßen, Bewegung und Basalic-Zuordnung.
- `docs/CONTENT_PARITY.md`: Abgleich aller Geschäfts- und Objektinhalte.
- `docs/SOURCES.md`, `public/assets/manifest.json`: Originalseiten, stabile Quellzeilen, Bild-/Exposé-Zuordnungen.
- `docs/ASSET_LICENSES.md`, `licenses/`: Medienherkunft und lokale Schrift-/Iconlizenzen.
- `docs/QA.md`, `screenshots/`: tatsächliche Prüfungen und Browseraufnahmen.

`npm run check` prüft Daten, Dateien und die lokale Auslieferung. `node scripts/check-sources.mjs` gleicht den übernommenen Immobilienbestand und sämtliche Bildquellen live ab. Eine Veränderung der alten Website wird dabei als Abweichung gemeldet und nicht stillschweigend übernommen.

Dies ist lokale Weiterentwicklung, kein Deployment. Ein späterer öffentlicher Betrieb benötigt passende Hosting-/Formulartechnik und die Vervollständigung der bereits dokumentierten Betreiber- und Rechtsthemen.
