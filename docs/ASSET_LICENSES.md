# Bildherkunft und lokale Schriften

Geprüft am **03.11.2026**. Alle 54 verwendeten Bilddateien sind lokal gespeichert und stammen aus der bestehenden Website **www.basalic.de**. Es gibt keine externen Bild- oder Fontabrufe beim Öffnen der Vorschau. Die präzisen URLs und Objektzuordnungen stehen in `public/assets/manifest.json`.

## Startseite und Leistungsmotive

| Datei | Originalseite | Originaldatei / Motiv |
| --- | --- | --- |
| `hero-original.webp` | https://www.basalic.de/ | `10562.jpeg`: Person vor Sonnenaufgang; Hintergrundbild aus der seitenspezifischen Home-CSS |
| `mietverwaltung.webp` | https://www.basalic.de/Mietverwaltung | `116719.jpeg`: Figuren als Menschenpyramide |
| `finanzierung.webp` | https://www.basalic.de/finanzierung | `113667.jpeg`: Modellhaus mit Münzen |
| `absicherung.webp` | https://www.basalic.de/Vorsorge | `112107.jpeg`: Ärztin und ältere Frau |
| `altersvorsorge.webp` | https://www.basalic.de/Vorsorge | `125224.jpeg`: Paar im Golfcart |

Das zuvor verwendete Villenbild von Unsplash (`architektur.webp`) wurde entfernt. Es war ein zusätzliches Inspirationsmotiv und kein Bild der Originalwebsite. Die neue Vorschau verwendet ausschließlich Bildmotive der alten Website. Motive werden in Größe und Ausschnitt an die Premium-Gestaltung angepasst, ohne ihren Inhalt zu verändern.

## Immobilienabbildungen und Porträt

48 Immobilienabbildungen stammen aus https://www.basalic.de/Immobilien; das Porträt aus https://www.basalic.de/about. Für jedes Objekt ist die stabile HTML-Zeilen-ID (`sourceRow`) in den Daten und im Manifest gespeichert. Text und Bild werden aus derselben Quellzeile zugeordnet. Das vollständige Archiv enthält 40 verkaufte Referenzen, daneben 7 Verkaufsangebote und 2 Auslandsobjekte.

- Das Original-Salach-Bild ist als Beispielbild bezeichnet. Die Vorschau zeigt hierfür bewusst keinen vermeintlichen Objektfotobeleg.
- Die 77-m²-Erdgeschosswohnung in Eislingen besitzt einen Grundriss; Alttext und Bildunterschrift benennen dies.
- Plochingen-Angebot (50 m²) und verkaufte Referenz (51 m²) haben getrennte Dateien.
- Zwei Plattenhardt-Einträge verwenden bereits in der Quelle dieselbe Originalabbildung. Sie werden als getrennte Quelleinträge erhalten.

Die bestehende Dokumentation zu Betreiber-, Urheber- und Porträtfreigaben für einen späteren öffentlichen Betrieb bleibt bestehen. Der Herkunftsabgleich ist kein zusätzlicher Lizenznachweis; es wird keine freie Bildlizenz behauptet. Diese Änderung ist eine lokale Weiterentwicklung der Vorschau.

## Schriften und Wortmarke

Geist wird lokal über `@fontsource/geist` geladen (SIL Open Font License 1.1, vollständig in `licenses/Geist-OFL.txt`). Kursive Akzente verwenden die auf dem Gerät installierten Systemschriften Georgia beziehungsweise Times New Roman. Phosphor-Icons werden lokal gebündelt (MIT-Lizenz, `licenses/Phosphor-MIT.txt`).

Die Wortmarke ist eine neue typografische Darstellung des bestehenden Namens. Die Angabe IHK-Ausbildungsbetrieb bleibt eine Textinformation; kein neues Gütesiegel wird behauptet.

Der Hero und die Fußbereichs-CTA verwenden ausschließlich das ursprüngliche Basalic-Startseitenmotiv. Grün-/Cyanfärbung, Rasterung und Aufhellung werden per CSS darübergelegt. Vom Referenztemplate wurden keine Landschaftsbilder, Dashboard-Abbildungen, Kundenporträts oder Fremdlogos kopiert. Die Umsetzung ist eigener Code; die Referenz wurde visuell und anhand ihrer öffentlichen Darstellung analysiert.

## Reproduktion

`node scripts/assets.mjs` lädt Bilder erneut anhand der verifizierten Quellzeilen und des Manifests. `--references-only` aktualisiert ausschließlich die Referenzabbildungen. Anschließend mit `npm run build` neu bauen. Die Quellenprüfung ist ein eigener bewusster Recherchevorgang; im Frontend erfolgt keine automatische Bestandssynchronisierung.

Pfeil-Icons: `@phosphor-icons/core`, MIT-Lizenz, vollständig in `licenses/Phosphor-MIT.txt`. Originale SVG-Pfade aus dem offiziellen Paket, lokal gebündelt.
