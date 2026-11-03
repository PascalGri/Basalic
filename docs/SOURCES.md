# Quellen und redaktionelle Entscheidungen

Recherche-/Datenstand: **03.11.2026**, Europe/Berlin. Grundlage ist die zu diesem Zeitpunkt öffentlich erreichbare Website **www.basalic.de**. Texte, Bilder und Links wurden erneut mit den Originalseiten abgeglichen. Keine laufende Bestandssynchronisierung; die Originalwebsite wurde nicht verändert.

Ziel: dieselben Leistungen, Unternehmensinformationen und Immobilien wie bisher, verständlicher formuliert und mit der gewählten Premium-Gestaltung präsentiert. Ausgangsbefunde und Korrekturen stehen in [CONTENT_AUDIT.md](CONTENT_AUDIT.md).

## Originalseiten

| Quelle | Übernommene, neu formulierte Inhalte |
| --- | --- |
| https://www.basalic.de/ | Immobilien, Mietverwaltung, Finanzierung und Vorsorge; Berufsrollen Immobilienmakler, Mietverwalter, Immobiliardarlehensvermittler und Versicherungsmakler; IHK-Ausbildungsbetrieb; „einfach individuell“. Original-Startseitenmotiv `10562.jpeg` statt externem Architektur-Stimmungsbild. |
| https://www.basalic.de/Immobilien | Vollständiger Bestand: 49 Einträge, davon sieben als zu verkaufen beschrieben, zwei Auslandsobjekte mit Informationsanfrage und 40 als verkauft markiert. Orte, Objektarten, Flächen, Baujahre, Zimmer, Ausstattung, Besonderheiten sowie Bild-/Exposé-Zuordnung. |
| https://www.basalic.de/Mietverwaltung | Unterstützung von Kapitalanlegern und Vertretung von Vermietern. Keine zusätzlichen konkreten Verwaltungsleistungen oder verbindlichen Prozessabläufe erfunden. Zugehöriges Originalmotiv. |
| https://www.basalic.de/finanzierung | Baufinanzierung durch Kooperationen, unter anderem mit regionalen Banken; Privatkredite und Umschuldung als eigener sichtbarer Inhalt. Keine garantierte Zinsersparnis. Zugehöriges Originalmotiv. |
| https://www.basalic.de/Vorsorge | Beratung zu Versorgungslücken bei Krankheit, Berufsunfähigkeit, Pflege und Todesfall sowie Hilfe bei der Altersvorsorge und Rentenlücken. Keine Produkte oder Renditen erfunden. Beide zugehörigen Originalmotive. |
| https://www.basalic.de/about | Senad Basalic, geboren in Göppingen, seit 2001 tätig; Berufsrollen und IHK-Ausbildungsbetrieb; komplexe Finanzfragen verständlich erklären; Suche, Verkauf und Finanzierung begleiten; persönliches Profil und Partnernetzwerk, wenn möglich regional. Originalporträt. |
| https://www.basalic.de/kontakt | `info@basalic.de`; Kontaktangaben Name, E-Mail, Telefon und Nachricht. Kein produktives Formular eingebunden oder für Testversand verwendet. Die lokale Vorschau bereitet einen E-Mail-Entwurf vor. |
| https://www.basalic.de/impressum | Name, Mobilkontakt, Berufs-/Registerangaben als Quellangaben; Anschrift Dürnau als eine von zwei widersprüchlichen Adressen dokumentiert. Persönliche Steuernummer und alte TMG-Texte nicht blind übernommen. |
| https://www.basalic.de/datenschutz | Übereinstimmender Mobilkontakt; abweichende Anschrift Heiningen dokumentiert. Alte technische Datenschutzbausteine nicht als Beschreibung der anders aufgebauten lokalen Vorschau verwendet. |

## Kontaktabgleich

- `info@basalic.de`: Kontakt, Impressum, Datenschutz, Mietverwaltung und Vorsorge.
- `+49 178 6654819`: Impressum und Datenschutz, maschinenlesbar `tel:+491786654819`.
- `immobilien@basalic.de`: Immobilienseite.
- `finanzierung@basalic.de`: Finanzierungsseite.
- Die im globalen Kopf stehende `555-555-5555` ist ein Platzhalter und wird nicht übernommen.
- Impressum: Zeppelinstrasse 4, 73105 Dürnau. Datenschutz: Buchenstrasse 6, 73092 Heiningen. Keine Adresse wird ohne Klärung als aktuell ausgewählt.
- Keine Testnachricht, kein Anruf und kein produktiver Formularversand. Zustellbarkeit und Erreichbarkeit wurden nicht durch Kontaktaufnahme bestätigt.

## Immobilien und Fotozuordnung

Die Zuordnung folgt den jeweiligen Objektzeilen der Originalseite, einschließlich ihrer `.dmRespRow`-Gruppen und Bild-/Exposé-Links. [src/data.js](../src/data.js) enthält die strukturierten Objektdaten. [public/assets/manifest.json](../public/assets/manifest.json) dokumentiert je lokalem Bild Originaldatei und Quellseite. Alle 40 Verkaufsreferenzen werden separat von den neun nicht als verkauft markierten Einträgen geführt; das Archiv ist keine Auswahl mehr.

| Objekt | Besonders geprüfte Zuordnung |
| --- | --- |
| Göppingen-Faurndau | ZFH, ca. 155 m² Wohnfläche / ca. 244 m² Grundstück; Exposé `171049343`. |
| Mühlhausen im Täle | EFH, 101 m² Wohnfläche / 814 m² Grundstück; Exposé `169662545`. |
| Neidlingen | ZFH mit Einliegerwohnung, 201 m², Baujahr 1994; Exposé `169930109`. |
| Göppingen-Bezgenriet | ZFH, 164 m², Baujahr 1997, beide Wohnungen laut Quelle vermietet. |
| Schwäbisch Hall | 3-Zimmer-EG-Wohnung, 76 m², Baujahr 1992; Exposé `168406677`. |
| Salach | EFH, 240 m² Wohnfläche, 700 m² Grundstück, Baujahr 2017, sechs Zimmer. Die Quelle kennzeichnet ihr Foto ausdrücklich als Beispielbild; hier kein vermeintlich echtes Objektfoto. |
| Plochingen, Angebot | 2-Zimmer-Wohnung, 50 m², Baujahr 1991; Exposé `166340253`. Eigenes Foto, getrennt von der verkauften 51-m²-Referenz. |
| Plochingen, verkauft | 2-Zimmer-Wohnung, 51 m², Baujahr 1991; getrennte Datei und Objektseite. |
| Istrien | ca. 18.000 m² Grundstück, Steinhaus ca. 80 m² und weitere Originalmerkmale. Informationsanfrage, keine eigene Bebaubarkeitszusage. |
| Raum Sarajevo | ca. 10.000 m² Grundstück, 110 m² Wohnfläche auf zwei Ebenen und weitere Originalmerkmale. Informationsanfrage. |
| Weitere verkaufte Referenzen | Vollständig aus dem Quellarchiv übernommen. Historische Angaben werden nicht in heutige Verfügbarkeits- oder Mietzusagen umgedeutet. |

Exposé-Links belegen die Verbindung zur Originalzeile, keine aktuelle Verfügbarkeit. Bei verkauften Referenzen werden alte Verkaufslinks nicht als aktuelle Angebote präsentiert. Lokale Objektseiten und Kontaktwege bleiben unabhängig von externen Exposé-Anbietern erreichbar.

## Offene Quellfragen

- **Tamm:** Die Quelle nennt sowohl „1 Zimmer App.“ als auch „1,5 Zimmer“. Diese Abweichung wird dokumentiert, nicht durch Raten korrigiert.
- **88-m²-Wohnung mit ca. 40 m² Garten:** In ihrer Quellzeile steht kein eindeutiger Ort. Kein Ort aus einem benachbarten Objekt wird übernommen.
- **Historische Angaben:** Frühere Bezugsfreiheitsdaten, Mietbeträge, Altersangaben und Zustände werden nicht auf das heutige Datum fortgeschrieben. Eine verkaufte Referenz bleibt verkauft.
- **Auslandsobjekte:** Quellangaben zu Entfernung, Bäumen oder Bebaubarkeit sind keine unabhängige Prüfung von Eigentum, Baurecht oder Reisezeit.
- **Anschriften:** Dürnau/Heiningen bleibt ein offener Widerspruch.

## Bilder und Gestaltung

Das große Villenfoto des ersten Premium-Entwurfs kam **nicht** von basalic.de, sondern von Unsplash. Es wurde durch das Original-Startseitenmotiv ersetzt, lokal `hero-original.webp`. Objektfotos und Senad-Basalic-Porträt stammen aus der Altwebsite; die vier Motive der bisherigen Leistungsseiten sind wieder eingebunden. Präzise CDN-Originalpfade stehen im Asset-Manifest.

Farben, Layout, Wortmarken-Satz und Schriften gehören zur neuen Gestaltung. Herkunft ist kein eigenständiger Nachweis einer öffentlichen Nutzungslizenz; die Rechte-Dokumentation bleibt maßgeblich.

Weitere Hinweise: [ASSET_LICENSES.md](ASSET_LICENSES.md), [LEGAL_REVIEW.md](LEGAL_REVIEW.md) und [QA.md](QA.md). Jeweiligen Prüfstand beachten.
