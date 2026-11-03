# Prüfung der Basalic-RBP-Vorschau

Stand **03.11.2026**. Produktionsbuild unter http://127.0.0.1:5104/ . Lokale Arbeit, keine Änderung an basalic.de und kein Deployment.

## Daten und Auslieferung

- `npm install` / `npm run build`: erfolgreich, Vite 7.3.7. Bei Installation keine gemeldeten Schwachstellen.
- `npm run check`: 49 eindeutige Objekte (7 Angebote, 2 Auslandsinformationen, 40 verkauft), 54 zugeordnete und dekodierbare Originalbilder, 61 HTTP-Routen, sieben gültige JavaScript-Module. Alle ausgelieferten Module, Styles und Bilder haben passende MIME-Typen. Keine `href="#"`-Platzhalter oder JavaScript-Links.
- `node scripts/check-sources.mjs`: alle 49 Originalzeilen und ihre Verkaufsstatus-, Bild- und Exposé-Zuordnung sowie die 54 Bildnachweise live gegen www.basalic.de abgeglichen.
- Originale Plochingen-Objekte mit 50/51 m² bleiben getrennt. Das Salach-Beispielbild wird nicht als echtes Objektfoto ausgegeben. Der Eislingen-Grundriss ist als Grundriss benannt.

## Tatsächlicher Browserdurchlauf

Alle 61 Seiten wurden in drei Breiten im In-App-Browser gerendert:

| Ansicht | Umfang | Ergebnis |
| --- | --- | --- |
| Desktop 1440 × 1000 | 61 Seiten | Jeweils genau eine H1, kein horizontaler Überlauf, keine leeren oder `#`-Links, keine extern geladenen DOM-Assets. Alle 61 Seiten werden durch echte interne Links erreicht. |
| Mobil 390 × 844 | 61 Seiten | Jeweils genau eine H1 und kein horizontaler Überlauf. |
| Schmal 320 × 800 | 61 Seiten | Jeweils genau eine H1 und kein horizontaler Überlauf. Lange deutsche Objekt- und Informationsüberschriften werden lesbar umbrochen. |

Die JSON-Berichte liegen in `screenshots/browser-desktop-audit.json`, `browser-mobile-audit.json` und `browser-narrow-audit.json`.

## Funktions- und Bewegungsprüfung

- Immobilienübersicht: 9 Einträge; Referenztab: 40 Einträge. Suche nach Tamm: 1 Eintrag. Unbekannter Ort: verständlicher Leerzustand. Reset: wieder 40 Referenzen. Geteilte Suchparameter stehen in der URL.
- Referenzkontakt aus dem 77-m²-Eislingen-Grundriss führt zur Kontaktseite mit dem Wunsch nach einer ähnlichen Immobilie. Die verkaufte Referenz wird nicht als verfügbares Angebot angefragt.
- Alle Kontaktfelder vorhanden. Optionales E-Mail-Prefill wird sicher übernommen und vom Browser als E-Mail-Feld validiert. Der Footer-Einstieg führt zur Kontaktseite mit dieser Antwortadresse. Es wurde keine Nachricht gesendet und kein Geräte-Mailprogramm gestartet.
- Mobile Navigation öffnet; Escape schließt und gibt den Fokus an den Menüschalter zurück. Dropdown-Leistungsnavigation öffnet die echte Mietverwaltungsseite.
- Hell-/Dunkelumschaltung funktioniert ohne horizontalen Überlauf. Der alte Pfad `/Immobilien` wird zur neuen Übersicht aufgelöst.
- Seitenwechsel starten nach dem Abbau der vorherigen Lenis-Instanz zuverlässig bei Scrollposition 0. Kontakt und Rückkehr zur Startseite wurden im Browser ausdrücklich nach der Korrektur geprüft.
- Hero und Showcase erscheinen mit gestaffelter Schärfe-/Positionsanimation. Die Berufsprofil-Leiste bewegt sich. Der Scrolltext startet vollständig bei 15 % Deckkraft/8 px Blur und ist nach Durchscrollen vollständig scharf. Die Timeline-Linie füllt sich beim Scrollen.
- Referenzkarussell: Auswahl per Maus und Pfeiltasten korrekt, Uhingen/Eislingen-Inhalte passend. Die sichtbare Pausefunktion hält den automatischen Wechsel an. Es werden ausschließlich wirkliche verkaufte Immobilien gezeigt.
- FAQ: zweite Antwort öffnet, die erste schließt. Zweite Antwort schließt wieder; nach der 0,3-Sekunden-Animation werden die temporären Höhenstile entfernt.
- Browserkonsole im geprüften Ablauf ohne Fehler.

## Aufnahmen

- `screenshots/desktop-home.png`
- `screenshots/mobile-home.png`
- `screenshots/desktop-services.png`
- `screenshots/desktop-references.png`
- `screenshots/desktop-faq.png`

## Grenzen

Kein vollständiges Accessibility-Audit, kein Test auf physischer Mobilhardware und keine unabhängige Bestätigung heutiger Objektverfügbarkeit. Reduced Motion ist im Code und den Media Queries berücksichtigt; ein tatsächlicher Wechsel der Betriebssystemeinstellung wurde im Browser nicht emuliert. Mausparallaxe und Hover-Abbremsung sind implementiert; nicht jede denkbare Zeigerposition wurde einzeln vermessen. Rechtsangaben bleiben dort Entwurf, wo die Originalwebsite widersprüchliche oder unvollständige Daten enthält. Kontakt ist bewusst ein lokaler E-Mail-Entwurf, kein Formular-Backend.
