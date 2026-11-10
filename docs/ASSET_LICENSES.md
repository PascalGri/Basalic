# Bildherkunft und lokale Schriften

Dokumentationsstand **10.11.2026**. Alle eingesetzten Bilddateien und Schriften werden lokal ausgeliefert. Der Bildbestand umfasst die 54 ursprünglichen Quelldateien aus **www.basalic.de**, vier neue KI-Servicebilder und zwölf zusätzliche echte Objektfotos aus belegten ImmoScout-Inseraten. Die vier alten Leistungsmotive bleiben als historische Quelldateien erhalten, werden jedoch nicht mehr in der Oberfläche verwendet. Es gibt beim Öffnen der Website keine externen Bild- oder Fontabrufe.

Die ursprünglichen 54 Einträge stehen unverändert als Herkunftsnachweis in `public/assets/manifest.json`. Die neuen Motive sind getrennt in `docs/SERVICE_IMAGE_PROMPTS.md` und `docs/PROPERTY_GALLERY_SOURCES.json` dokumentiert.

## Ursprüngliches Startmotiv und frühere Leistungsmotive

| Datei | Originalseite | Originaldatei / Motiv |
| --- | --- | --- |
| `hero-original.webp` | https://www.basalic.de/ | `10562.jpeg`: Person vor Sonnenaufgang; Hintergrundbild aus der seitenspezifischen Home-CSS |
| `mietverwaltung.webp` | https://www.basalic.de/Mietverwaltung | `116719.jpeg`: Figuren als Menschenpyramide |
| `finanzierung.webp` | https://www.basalic.de/finanzierung | `113667.jpeg`: Modellhaus mit Münzen |
| `absicherung.webp` | https://www.basalic.de/Vorsorge | `112107.jpeg`: Ärztin und ältere Frau |
| `altersvorsorge.webp` | https://www.basalic.de/Vorsorge | `125224.jpeg`: Paar im Golfcart |

Das frühere Startmotiv bleibt im historischen Bestand und in bestehenden Teilenvorschauen erhalten. Der Hero und die Kontaktfläche der aktuellen Website verwenden grafische Farbverläufe. Die vier übrigen Motive in dieser Tabelle sind ausschließlich der historische Quellenbestand; die Website nutzt stattdessen die unten dokumentierten neuen Servicebilder. Das zuvor verwendete Villenbild von Unsplash (`architektur.webp`) wurde entfernt. Es war ein zusätzliches Inspirationsmotiv und kein Bild der Originalwebsite.

## Neue KI-Servicebilder

| Datei | Motiv |
| --- | --- |
| `public/assets/services/finanzierung.webp` | Eine Frau und ein Mann besprechen einen Wohnungsgrundriss am Tisch |
| `public/assets/services/mietverwaltung.webp` | Gepflegtes helles Mehrfamilienhaus mit grauen Balkonen und Pflanzen |
| `public/assets/services/absicherung.webp` | Elternteil hilft einem Kind beim Anziehen einer Jacke |
| `public/assets/services/altersvorsorge.webp` | Ältere Frau beim Umtopfen in einer Gartenwerkstatt, zweite Person mit Tee im Hintergrund |

Diese vier fiktiven Illustrationsszenen wurden mit dem eingebauten `image_gen.imagegen`-Tool erzeugt. Sie zeigen keine tatsächlichen Kunden, Mitarbeiter oder angebotenen Immobilien. Die Bilder der dritten Auswahl entstanden am 04.11.2026; das Finanzierungsmotiv wurde am 10.11.2026 ersetzt. Die früheren Bilder und ihre Prompts sind im lokalen Bildarchiv dokumentiert.

Alle vier Dateien sind WebP-Bilder mit Qualität 85 und Effort 5. [SERVICE_IMAGE_SOURCES.json](SERVICE_IMAGE_SOURCES.json) dokumentiert Maße, Dateigrößen und SHA-256-Prüfsummen. Exakte Prompts, Methode und finale Pfade stehen in `docs/SERVICE_IMAGE_PROMPTS.md`. Die visuellen Ausgaben wurden bei ihrer Erstellung geprüft. Für die KI-Motive wird keine externe Stockfotolizenz behauptet.

### Aktuelle WebP-Dateien

| Motiv | Maße | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| finanzierung | 1448 × 1086 | 206578 | `d07d8d1c934994ae32bec319f9e047ba1871d1c057109d19cd315450c4dd8e31` |
| mietverwaltung | 1536 × 1024 | 245956 | `85d62271f3d9a5356d6d511c482cf19244d90ee728dc8643adaa2b4cae436e47` |
| absicherung | 1536 × 1024 | 212314 | `2629e55ffd596c8c3f083706fb0f67a7944988d75873d8fc5db9e5130b2ba50f` |
| altersvorsorge | 1536 × 1024 | 236990 | `eae427c0f84a64ff93874a54f96ae2d33201692361cf4c7c3e5d1d1591a2c927` |

## Immobilienabbildungen und Porträt

48 Immobilienabbildungen stammen aus https://www.basalic.de/Immobilien; das Porträt aus https://www.basalic.de/about. Für jedes Objekt ist die stabile HTML-Zeilen-ID (`sourceRow`) in den Daten und im Manifest gespeichert. Text und Bild werden aus derselben Quellzeile zugeordnet. Das vollständige Archiv enthält 40 verkaufte Referenzen, daneben 7 Verkaufsangebote und 2 Auslandsobjekte.

- Das Original-Salach-Bild ist als Beispielbild bezeichnet. Die Vorschau zeigt hierfür bewusst keinen vermeintlichen Objektfotobeleg.
- Die 77-m²-Erdgeschosswohnung in Eislingen besitzt einen Grundriss; Alttext und Bildunterschrift benennen dies.
- Plochingen-Angebot (50 m²) und verkaufte Referenz (51 m²) haben getrennte Dateien.
- Zwei Plattenhardt-Einträge verwenden bereits in der Quelle dieselbe Originalabbildung. Sie werden als getrennte Quelleinträge erhalten.

Die bestehende Dokumentation zu Betreiber-, Urheber- und Porträtfreigaben für einen späteren öffentlichen Betrieb bleibt bestehen. Der Herkunftsabgleich ist kein zusätzlicher Lizenznachweis; es wird keine freie Bildlizenz behauptet. Diese Änderung ist eine lokale Weiterentwicklung der Vorschau.

## Zusätzliche echte Objektfotos

Für Faurndau, Mühlhausen im Täle und Neidlingen wurden jeweils vier weitere, eindeutig zugeordnete Fotos übernommen. Zusammen mit dem bestehenden Hauptfoto bietet jedes dieser drei Angebote fünf Bilder in einer Galerie mit Tastaturbedienung und vergrößerter Ansicht im nativen Dialog. Die zwölf Zusatzdateien liegen unter `public/assets/property-gallery/`.

`docs/PROPERTY_GALLERY_SOURCES.json` enthält die genauen Bild-URLs, Inserate, Identitätsbelege, Maße, Dateigrößen und SHA-256-Prüfsummen. Faurndaus Fotos stammen unmittelbar aus dem ursprünglich verlinkten Inserat. Mühlhausen und Neidlingen stammen aus Folgeinseraten desselben Anbieters; Objektangaben und das jeweils identische Hauptfoto sichern die Zuordnung. Die vorhandenen ImmoScout-Links wurden durch die Bildrecherche nicht verändert.

Die Zusatzfotos wurden ausschließlich anhand öffentlich abrufbarer Fotoverlinkungen übernommen, ohne geratenen Bildpfad oder Umgehung eines Zugangsschutzes. Sie sind als WebP mit Qualität 85 und höchstens 1600 × 1600 px ohne Vergrößerung gespeichert. Es gibt keine inhaltliche Bildbearbeitung und keine KI-erzeugten Objektfotos. Die öffentliche Abrufbarkeit ersetzt keine Nutzungsfreigabe; die Betreiberfreigabe einschließlich der Rechte an diesen Inseratsfotos bleibt intern zu bestätigen.

Für Bezgenriet und Salach liegt kein belegter Original-Exposé-Link vor. Für Plochingen und Schwäbisch Hall wurden keine sicher zugeordneten weiteren Fotos gefunden. Grenzen und verworfene Kandidaten stehen im Galerienachweis. Der Objektbestand bleibt unverändert bei 49 Einträgen: sieben Angebote, zwei Auslandsinformationen und 40 verkaufte Referenzen.

## Schriften und Wortmarke

Geist wird lokal über `@fontsource/geist` geladen (SIL Open Font License 1.1, vollständig in `licenses/Geist-OFL.txt`). Kursive Akzente verwenden die auf dem Gerät installierten Systemschriften Georgia beziehungsweise Times New Roman. Phosphor-Icons werden lokal gebündelt (MIT-Lizenz, `licenses/Phosphor-MIT.txt`).

Die Wortmarke ist eine neue typografische Darstellung des bestehenden Namens. Die Angabe IHK-Ausbildungsbetrieb bleibt eine Textinformation; kein neues Gütesiegel wird behauptet.

Der Hero und die Kontaktfläche im Fußbereich verwenden grafische Farbverläufe. Diese Flächen zeigen keine Immobilienaufnahme. Vom Referenztemplate wurden keine Landschaftsbilder, Dashboard-Abbildungen, Kundenporträts oder Fremdlogos kopiert. Die Umsetzung ist eigener Code; die Referenz wurde visuell und anhand ihrer öffentlichen Darstellung analysiert.

## Reproduktion

`node scripts/assets.mjs` lädt den ursprünglichen Bildbestand erneut anhand der verifizierten Quellzeilen und des historischen Manifests. `--references-only` aktualisiert ausschließlich die Referenzabbildungen. Die neuen KI-Motive werden damit nicht erzeugt; ihre Produktionsprompts stehen in `docs/SERVICE_IMAGE_PROMPTS.md`. Die Zusatzfotos sind über die konkreten Quellen und Prüfsummen in `docs/PROPERTY_GALLERY_SOURCES.json` nachvollziehbar. Nach Assetänderungen mit `npm run build` neu bauen. Die Quellenprüfung ist ein eigener bewusster Recherchevorgang; im Frontend erfolgt keine automatische Bestandssynchronisierung.

Die Website wird weiterhin nur lokal unter `http://127.0.0.1:5104/` weiterentwickelt. Diese Änderungen enthalten kein Deployment. Offene Betreiberanschrift, erforderliche Rechtstexte und Bildfreigaben bleiben in den internen Prüfunterlagen dokumentiert.

Pfeil-Icons: `@phosphor-icons/core`, MIT-Lizenz, vollständig in `licenses/Phosphor-MIT.txt`. Originale SVG-Pfade aus dem offiziellen Paket, lokal gebündelt.
