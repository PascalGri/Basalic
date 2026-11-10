# Finance-Vorlage und Basalic-Zuordnung

Referenz: https://rbp-finance-template.vercel.app/ . Am 04.11.2026 im Browser bei Desktopbreite angesehen. Für diese Variante werden Gestaltung und Inhaltsfunktionen neu umgesetzt; kein Zugang zum privaten Template-Quellcode war erforderlich.

Gestaltung: ui-serif mit Georgia-Fallback für Überschriften, bestehende lokale Geist für Fließtext, dunkles Anthrazit / warmes Weiß, zurückhaltendes Salbeigrün, weiche warme/blaue Verläufe, strukturelle Linien, große vertikale Abstände, pillenförmige CTAs. Eigene responsive Umsetzung mit Breakpoints und reduzierter Bewegung. DESIGN_VARIANCE 4, MOTION_INTENSITY 6, VISUAL_DENSITY 3.

| Finance-Referenz | Basalic-Variante |
| --- | --- |
| App-Hero mit Signup | Zuhause/Zukunft mit Immobilien- und Verkäuferweg |
| Kundenlogos | Vier reale Fachgebiete als Navigation |
| Banking-Features | Immobilien, Finanzierung, Mietverwaltung und Vorsorge |
| Finanz-Dashboard | Echte ausgewählte Immobilien mit Objektverlinkung |
| Sicherheitsargumente | Persönliches Profil und belegte Berufsfakten |
| Testimonials | Tatsächlich verkaufte Immobilienreferenzen |
| Preispläne | Drei fachliche Kontaktwege ohne erfundene Preise |
| FAQ | Bestehende Basalic-Fragen und Antworten |
| Signup-CTA | Weiterleitung auf das bestehende Kontaktformular |

Inhalte: Geschäfts- und Objektinformationen, Kontaktadressen, ursprüngliche Routen und Galerien aus dem letzten lokalen Aufbau übernommen. Alle 49 Objekte bleiben im Datenbestand. Die neue Variante liegt in `finance-template/`; Dateien des vorherigen Entwurfs wurden nicht verändert. Kein Deployment, keine Umstellung der öffentlichen Website.


## Helle Variante, 10.11.2026

Die aktuelle Variante verwendet durchgehend warme Weißtöne mit einem leichten CSS-Aurora-Hintergrund. Wheel, Touch und Tastatur scrollen wie in [Sparkdesign](https://rbp-sparkdesign-template.vercel.app/) direkt im Browser. Die erste Ansicht erscheint ohne gestaffelten Einstieg. Dezente Übergänge unterhalb des ersten Bildschirms, Aurora und Fachgebietsleiste sind pausierbar. Das Referenzkarussell wird manuell bedient und zeigt alle Fotos in Farbe. Die lokale [Vorschau-Übersicht](http://127.0.0.1:5105/vorschau.html) verlinkt jede Seite.

## Bewegungen nach der Referenz, 04.11.2026

Die öffentlich sichtbare Referenz wurde visuell und auf ihre Motion-Parameter geprüft. Umsetzung in `src/motion.js`, `finance-aurora.js`, `finance-carousel.js`, `finance-marquee.js` und `finance-motion.css`. Der Shader ist eine eigene kompakte WebGL-Umsetzung derselben visuellen Richtung, keine Kopie des privaten Template-Quellcodes.

- Easing `cubic-bezier(.16,1,.3,1)`; Hero mit gestaffelten Verzögerungen .3–1.1s und Bewegungen20–30px.
- Einmalige Abschnittsreveal .5–.6s, Kartenstaffel .1s, Hoverlift4px, Bildzoom1.05/500ms.
- Transparente warme/blaue Farbfelder, Zeitfluss.15, geglättete Mausreaktion im Hero; Footer ohne Mausreaktion. WebGL-Fallback auf bestehende CSS-Verläufe.
- Zähler4 und40 in2s; die Jahreszahl2001 bleibt unverändert.
- Referenzen alle4s mit600ms Übergang, farbiger Mittelkarte, grauen Nachbarn und Loop. Pause bei Fokus, Hover, Berührung, unsichtbarem Bereich oder verborgenem Dokument.
- Fachgebietsleiste50px/s, pausierbar bei Fokus und Hover; schmale und Touch-Ansichten bleiben statisch.
- Menüs200ms, FAQ300ms mit Plusrotation. Desktop-Mausrad mit Lenis1.6s; keine festgehaltenen oder horizontalen Scrollabschnitte.
- Globale Animationspause, Systempräferenz für reduzierte Bewegung, kein dauerhafter Speicher. Hintergrund-RAF läuft nur im sichtbaren Bereich; Cleanup bei jedem Seitenwechsel.

Die vier KI-Leistungsbilder wurden durch neue dokumentarische Alltagsszenen ersetzt. Alle Originalausgaben und exakten Prompts stehen im lokalen Bildarchiv und `docs/SERVICE_IMAGE_PROMPTS.md`.


## Seitenweite Atmosphäre und Bildwechsel V3, 04.11.2026

`src/finance-atmosphere.css` ergänzt ruhige warme und blaue Farbfelder auf allen Seiten. Ein persistenter, nicht interaktiver Hintergrund liegt außerhalb der gerenderten Seitenstruktur. Der zusätzliche Shader ist auf350.000Pixel und20Bilder/s begrenzt; bei pausierter/reduzierter Bewegung bleibt die statische Farbfläche bestehen. Der Header bleibt durchlässig, Texte und Bedienelemente liegen darüber.

KI-Hinweise: kleine weiße Schrift mit dezenter Kontur beziehungsweise Textschatten, direkt im Bild, ohne Hintergrundfläche. Die Altersvorsorge-Zusatzabbildung besitzt dafür einen eigenen Bildrahmen.

Die responsive Servicegeometrie ist in `src/finance-pages.css` konsolidiert. Alte widersprüchliche Mindesthöhen und Paddingregeln sind entfernt. Der Bildinhalt ist vom intrinsischen Grid-Sizing entkoppelt; einspaltiger Aufbau bis900px. Siehe `docs/RESPONSIVE_SERVICE_FIX.md` und `screenshots/responsive-services-v3.json`.
