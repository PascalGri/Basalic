# RBP-Template: Analyse und Übertragung auf Basalic

Stand: **03.11.2026**. Referenz: https://rbp-saas-template.vercel.app/ . Analysiert wurden das öffentlich ausgelieferte HTML und die zugehörigen CSS-/JavaScript-Dateien; zusätzlich erfolgt die visuelle und interaktive Prüfung durch den betreuenden Hauptagenten. Diese Datei ist keine Behauptung einer unverändert übernommenen oder lizenzierten Template-Codebasis.

## Was die Referenz auszeichnet

Das Template ist eine SaaS-Landingpage mit der Demomarke Circular. Für Basalic wird dessen gestalterische und interaktive Sprache auf einen Immobilien- und Finanzdienstleister übertragen. Die Leistungen, Unternehmensdaten und Immobilien stammen weiterhin von basalic.de.

- Schwebender, zentrierter Header mit abgerundeter Unterkante und kompakter Navigation. Referenz-HTML: maximal 1024 px breit, bei höchstens 1200 px maximal 672 px; 80 px hoch, mobil 72 px. Unter 850 px wird ein aufklappbares Menü verwendet.
- Große, zentrierte Sans-Serif-Typografie im Hero, mobil linksbündig. Im Referenz-HTML 96 px, unter 850 px 48 px, Gewicht 500, Zeilenhöhe 1,1, Laufweite −0,025 em. Die Schriftfamilie ist Geist als variable Sans von 100–900; Geist Mono ist zusätzlich definiert. Kursive Akzente verwenden eine Systemserif mit Georgia/Cambria/Times, keine besondere lizenzpflichtige Display-Schrift.
- Helles und dunkles Thema, initial nach der Systemeinstellung; jederzeit umschaltbar. Große Radien, weiche Schatten und eine zurückhaltende Akzentfarbe verbinden Header, Schaltflächen, Inhaltsflächen und Footer.
- Breite Bild-/Produktfläche unter der Heroaussage, danach eine bewegte horizontale Leiste und ein beim Scrollen wortweise hervorgehobener Einführungstext.
- Asymmetrisches Inhaltsraster: Hauptkarte links, rechte Inhaltsgruppe; im Referenz-HTML ab mittlerer Breite `1fr 1.5fr`, darunter eine Spalte. Große Kartenradien von 32 px, Abstände überwiegend 16 px. Rechts darunter zwei weitere Karten nebeneinander, schmal untereinander.
- Wechselnde Referenzinhalte, eine links haftende Einleitung neben fortschreitenden Inhalten sowie ein abschließender Kontaktbereich erzeugen Bewegung und Orientierung beim Scrollen.
- Das Referenz-Template besitzt nur die Landingpage. Die Basalic-Unterseiten werden als eigenständige, konsistente Fortsetzung neu gebaut.

### Farb- und Flächentokens der Referenz

| Token | Dunkel | Hell |
| --- | --- | --- |
| Seitenhintergrund | `#141414` | `#f5f5f5` |
| Vordergrund | `#fafafa` | `#0a0a0a` |
| Rahmen-/Inhaltsfläche | `#000000` | `#ffffff` |
| Sekundärtext | `#a3a3a3` | `#737373` |
| Rand | `#262626` | `#e5e5e5` |
| Akzent / primäre Karte | `#a8d946` | `#a8d946` |
| Sekundäre Karte | `#2a3a1a` | `#e8f5c8` |

Hauptcontainer: 1024 px; Herotext: 896 px; FAQ: 768 px; horizontaler Abschnittsabstand: 24 px. Der äußere 10-px-Rahmen des Desktops entfällt unter 850 px. Der Header bleibt innerhalb seines Breakpoints gleich breit; im untersuchten Referenzcode existiert keine beim Scrollen veränderte Headerbreite.

Das Hero-Hintergrundbild der Referenz ist die statische Rasterdatei [BG.jpg](https://rbp-saas-template.vercel.app/BG.jpg), 1517 × 848 px. Die sichtbare Tiefe entsteht durch Bildskalierung, Helligkeit und Mausparallaxe. Es wurde kein WebGL-/Shaderhintergrund gefunden. In Basalic werden dafür passende eigene bzw. bereits belegte Originalmotive verwendet, nicht das Demolandschaftsbild als vermeintlicher Unternehmensinhalt.

## Inhaltsmapping

| Element der SaaS-Referenz | Umsetzung für Basalic | Inhaltliche Grenze |
| --- | --- | --- |
| Demomarke und Produkthero | Senad Basalic & Partner, „einfach individuell“, unmittelbarer Einstieg zu Immobilien und Kontakt | Keine Softwareplattform oder KI-Leistung behaupten. |
| Dashboard-/Produktbild | Lokale Originalmotive von basalic.de und echte Immobilienabbildungen | Kein erfundenes Dashboard, keine fremden Stockfotos als Basalic-Objekte. |
| Laufende Kundenlogoleiste | Horizontale Darstellung belegter Leistungs-/Themenbegriffe | Keine erfundenen Kunden, Bankenlogos oder Partnersiegel. |
| Wortweise Scroll-Einleitung | Verständliche Verbindung von Immobilien, Mietverwaltung, Finanzierung und Vorsorge | Keine über das Original hinausgehende Leistungszusage. |
| Asymmetrische Funktionskarten | Vier tatsächliche Geschäftsbereiche mit Originalmotiven und konkreten Unterseiten | Keine SaaS-Funktionsnamen, Nutzungsmetriken oder vorgetäuschten Live-Daten. |
| Testimonialkarussell | Karussell tatsächlich verkaufter Immobilienreferenzen | Keine erfundenen Zitate, Personen, Sternebewertungen oder Verkaufserfolge. |
| Haftende Schritt-/Prozesssektion | Originalinhalte zu Senad Basalic und den zusammengehörigen Geschäftsfeldern, mit klaren nächsten Kontaktwegen | Keine als belegte Firmenabläufe ausgegebenen Demo-Prozesse. |
| SaaS-Preistabellen | Drei echte Kontaktwege für Immobilien, Finanzierung sowie Verwaltung/Vorsorge mit den belegten Fachadressen | Keine Abos, erfundenen Servicepakete oder monatlichen Preise. |
| Demo-FAQ | Sachlich belegte Orientierung zu bestehenden Leistungen und Kontaktwegen, soweit tatsächlich sinnvoll | Keine erfundenen Vertragsbedingungen, Garantien oder Produktversprechen. |
| Warteliste und Footer | Lokaler E-Mail-Kontakt, belegte Kontaktdaten, Leistungs- und Informationsnavigation | Keine vorgetäuschte Anmeldung oder Nachrichtenzustellung. |

Die Schaltflächen bestehen aus einem Textfeld und einem daneben angesetzten Lime-Pfeilfeld. Radius 12 px, leichte Skalierung auf 1,02 beim Hover und 0,98 beim Drücken; der nach rechts unten gerichtete Pfeil rotiert in 300 ms um −45°.

## Bewegung und Interaktion

Diese Parameter wurden als Referenzverhalten übertragen. Die tatsächlichen Prüfungen stehen in `QA.md`:

| Mechanik | Referenz bzw. Ziel der Übertragung |
| --- | --- |
| Header und erster Seitenaufbau | Header von −100 px in 0,5 s; Herotext in 0,8 s von 20 px/8 px Unschärfe zu normaler Position und Schärfe, zeitlich um 0,15 s versetzt. Häufige Referenzkurve: `cubic-bezier(.23,1,.32,1)`. Mobiles Menü mit sichtbarem Offen-/Geschlossen-Zustand. |
| Glattes Scrollen | Lenis mit einer Dauer von 1,6 Sekunden, Wheel-Faktor 1, Touch-Faktor 2 und Ankerabstand −100 px. Ankerziele und Bedienbarkeit müssen erhalten bleiben. |
| Mausparallaxe | Verschiebung geeigneter Heroelemente um höchstens ungefähr ±20 px je Achse; Referenzfeder Dämpfung 25 / Steifigkeit 150, unter 850 px deaktiviert, beim Verlassen zurückgesetzt. Auf Touchgeräten kein hoverabhängiger Pflichtinhalt. |
| Horizontale Endlosschleife | 60 px pro Sekunde; Referenz-Gap 124 px, Logohöhe 42 px und weiche Randmaske. Bei Hover Abbremsen bis Stillstand. Inhaltlich belegte Themen statt Demologos. |
| Wortweises Reveal | Wortweise Deckkraft 0,15→1 und Unschärfe 8→0 px. Scrollbereich: Abschnittsoberkante von 90 % bis 25 % der Viewporthöhe; Wortintervalle gleichmäßig aufgeteilt. |
| Referenzkarussell | Wechsel nach 10 Sekunden mit Fortschrittsring, direkt bedienbaren Auswahlmöglichkeiten und erkennbarem aktivem Inhalt. Basalic ergänzt eine sichtbare Pausefunktion und Tastatursteuerung; beim Fokus und Hover wird ebenfalls pausiert. |
| FAQ | Höhe und Antwortdeckkraft öffnen/schließen in 0,3 Sekunden; der Chevron dreht. Native Details bleiben die zugängliche Grundlage, jeweils eine Antwort offen. |
| Haftende Sektion und Fortschrittslinie | Ab 1024 px zwei Spalten, linke Einleitung haftet bei 192 px. Fortschrittsbereich `top 30%` bis `bottom 70%`; 2-px-Linie, 48-px-Symbole. Auf schmalen Bildschirmen normale Lesereihenfolge. |
| Bewegungsreduktion | `prefers-reduced-motion` berücksichtigen; Inhalte und echte Funktionen bleiben ohne Animation zugänglich. |

Die Umsetzung nutzt eine eigene Vite-Anwendung mit lokal eingebundener Geist, eigenen Seiten und vorhandenen Basalic-Daten. Der Wechsel des visuellen Systems rechtfertigt weder den Verlust von Originalinformationen noch die Übernahme der Platzhalteraktionen des Demos. Das Referenz-HTML enthält zahlreiche `href="#"`-Links; in der Basalic-Umsetzung erhalten echte Aktionen tatsächliche Ziele.

## Nachweise und Abgrenzung

- Lokale Analysegrundlage: `/tmp/basalic-rbp-audit/index.html`, dazugehöriges CSS und JavaScript. Das temporäre Verzeichnis gehört nicht zur auslieferbaren Website.
- Öffentliche Detailquellen: [CSS](https://rbp-saas-template.vercel.app/_next/static/chunks/da22af973784fb64.css), [Seiten-JavaScript](https://rbp-saas-template.vercel.app/_next/static/chunks/98ccb4d597fc3e91.js), [Header-/Lenis-JavaScript](https://rbp-saas-template.vercel.app/_next/static/chunks/3b638f2d8380e640.js). Die Referenz verwendet Motion und Lenis; GSAP gehört zur eigenständigen Basalic-Übertragung, nicht zur nachgewiesenen Originaltechnik.
- [CONTENT_PARITY.md](CONTENT_PARITY.md): Umfang und Erhalt sämtlicher ursprünglicher Inhalte.
- [SOURCES.md](SOURCES.md), [ASSET_LICENSES.md](ASSET_LICENSES.md): Originalquellen und lokale Bildherkunft.
- `scripts/check.mjs`: Daten-/Assetintegrität, Syntax, statische Links und HTTP-Auslieferung. Die tatsächliche Darstellung, dynamische Navigation und Animationen benötigen die separate Browserprüfung.

Kein Deployment und keine Änderung an der Originalwebsite sind Bestandteil dieser lokalen Umsetzung.
