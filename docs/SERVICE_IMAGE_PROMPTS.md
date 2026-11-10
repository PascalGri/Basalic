# Leistungsbilder: Herkunft und Produktionsprompts

Stand: 10.11.2026. Die Auswahl Editorial V3 vom 04.11.2026 wurde beim Finanzierungsmotiv aktualisiert.

Die vier Motive wurden vollständig neu mit dem eingebauten `image_gen.imagegen`-Tool erzeugt. Es handelt sich um KI-generierte, fiktive Szenen mit natürlicher dokumentarischer Bildsprache. Sie zeigen keine tatsächlichen Kunden, Mitarbeiter oder angebotenen Immobilien. Echte Objektfotos und das Porträt von Senad Basalic bleiben erhalten. Alle Verwendungen tragen weiterhin den Text „KI-generiertes Beispielbild“ direkt am Bild.

Die ausgewählten Tool-Ausgaben wurden visuell geprüft und unverändert als PNG gesichert. Für die Website wurden die PNGs mit Sharp nach WebP konvertiert: Qualität 85, Effort 5, höchstens 1600 × 1600 px ohne Vergrößerung. Das Finanzierungsmotiv hat ein Seitenverhältnis von 4:3, die anderen drei Motive haben 3:2. Es wurden keine weiteren inhaltlichen Bildbearbeitungen vorgenommen.

Die ersetzten WebP-Dateien, PNG-Ausgaben und Produktionsmanifeste der früheren Bildauswahlen bleiben im lokalen Bildarchiv außerhalb des Repositorys erhalten.

Produktions- und Integrationsnachweise:

- Die Produktionsprompts stehen bei den einzelnen Motiven in diesem Dokument.
- Maße sowie PNG- und WebP-Prüfsummen stehen in [SERVICE_IMAGE_SOURCES.json](SERVICE_IMAGE_SOURCES.json).

## finanzierung

Eine Frau und ein Mann besprechen bei Tageslicht einen Wohnungsgrundriss. Die fiktive Szene veranschaulicht ein erstes Gespräch zur Baufinanzierung.

Finaler Dateipfad: `public/assets/services/finanzierung.webp`

Finale Datei: 1448 × 1086 px, 206578 Bytes. SHA-256: `d07d8d1c934994ae32bec319f9e047ba1871d1c057109d19cd315450c4dd8e31`.

PNG SHA-256: `6db8b09262fb857cd6418f772165be94910dcbc9892e21fdc0f87f6cec93f251`. Vorheriges WebP SHA-256: `58c2b5d1e483f1e236c2076c4db898bf94454bf9ebd9960944f882b8fa43bdb9`.

Exakter Prompt:

```text
Use case: photorealistic-natural
Asset type: website service photograph for the Baufinanzierung (home financing) page of an independent German real estate and finance practice.
Primary request: An unstaged, personal first consultation about buying a home. A woman in her thirties and a male adviser in his forties in a dark navy overshirt sit at neighboring sides of a light oak table, looking down together at a simple residential floor plan next to a few understated, softly out-of-focus financing papers. The woman is engaged and thoughtful, holding a plain pencil loosely; the adviser listens attentively, one relaxed hand resting naturally near the papers. Nobody looks into the camera. The floor plan reads as a real floor plan with fine architectural lines, without legible labels. No signing, handshake, or posed smiles.
Scene and style: a modest, bright consultation room in southern Germany, soft off-white plaster, an out-of-focus window and a touch of foliage. Natural editorial lifestyle photography with believable candid expressions and accurate anatomy, visible skin and wood texture, soft side daylight, warm cream and oak neutrals balanced with muted slate blue and sage. Calm, contemporary, approachable, and grounded.
Composition: landscape 4:3, eye-level to slightly elevated medium shot. The two faces and the floor plan form one compact visual triangle in the central 65% of the frame, with margins above the heads and on both sides to survive a centered near-square crop. Keep the bottom-left corner quiet for a small disclosure added by the website. Moderately deep focus so the consultation reads instantly at thumbnail size.
Avoid logos, text overlays, watermarks, legible words or numbers, miniature houses, coins, calculators, laptops, keys, ties, luxury office decor, exaggerated bokeh, and the polished look of staged stock photography.
```

## mietverwaltung

Fiktives gepflegtes Mehrfamilienhaus mit heller Fassade, grauen Balkonen und Pflanzen. Keine Aufnahme einer angebotenen Immobilie.

Finaler Dateipfad: `public/assets/services/mietverwaltung.webp`

Finale Datei: 1536 × 1024 px, 245956 Bytes. SHA-256: `85d62271f3d9a5356d6d511c482cf19244d90ee728dc8643adaa2b4cae436e47`.

PNG SHA-256: `e64e65896f88e631e7b93f5d1fc9f262cf7fe1119f00d68785aa04db374688a9`. Vorheriges WebP SHA-256: `984cedfede698ca5c41656a49e50cc79f51d28998b5ca26025eb94a3da03a022`.

Exakter Prompt:

```text
Use case: photorealistic-natural.
Asset type: architectural editorial photograph for a regional German rental management website, landscape 3:2.
Primary request: a freshly maintained but completely ordinary German residential rental building from the 1990s or early 2000s, three storeys, clean pale mineral plaster facade and understated grey metal balcony railings. A few individually chosen potted plants on balconies, a landscaped path leading to a simple entrance, practical paving and low green planting.
Scene: believable small-town southern Germany on a bright softly overcast day. The property is attractive, calm and well looked after, neither luxury development nor aged worn building. Fictional generic example architecture, not a real listing. Limited surrounding clutter; a bit of open sky and one restrained neighbouring edge.
Style: photorealistic architecture magazine documentary image, eye-level 35mm lens with realistic perspective and natural verticals, soft daylight, crisp real plaster and metal textures, balanced natural whites and greens, very subtle grain, unforced editorial framing.
Composition: three-quarter view that shows entrance and several balconies; landscape wide crop with breathing room. No oversized foreground tree, no busy tree canopy blocking the building.
Constraints: no people, no readable sign, address, house number, logos or watermark. Avoid stained weathered facade, abandoned or damaged appearance, manicured luxury resort, perfect CGI developer rendering, impossible balconies, HDR sky, oversaturated grass, fake lens flare or extreme symmetry.
```

## absicherung

Fiktiver Elternteil hilft einem Kind beim Anziehen einer Jacke an der Wohnungstür.

Finaler Dateipfad: `public/assets/services/absicherung.webp`

Finale Datei: 1536 × 1024 px, 212314 Bytes. SHA-256: `2629e55ffd596c8c3f083706fb0f67a7944988d75873d8fc5db9e5130b2ba50f`.

PNG SHA-256: `0ac7236cc2bcf8076207ac259a79d9930223d5c6493341145eb68769afd7cf3e`. Vorheriges WebP SHA-256: `b9d287c1415e9ba85a2042e0cb22978de41355f06e0281338c3b027fb83389d6`.

Exakter Prompt:

```text
Use case: photorealistic-natural.
Asset type: intimate candid editorial lifestyle photograph for a regional German everyday security and insurance website, landscape 3:2.
Primary request: one fictional parent quietly helping their young school-age child put on a jacket near the doorway of their ordinary sunny home. Catch the small practical mid-action moment: parent at the child's height, naturally guiding one sleeve, child looking down at the sleeve. Both seen partly from the side or back, not presenting faces to the camera. Believable hands and ordinary body language.
Scene: maintained bright southern German apartment entrance with a simple wooden bench, a few coats and shoes, soft daylight from an adjoining room. Attractive everyday home, gently lived in, no elaborate staging or clutter.
Style: photorealistic documentary editorial photograph, 35mm lens, soft available late-morning window light, authentic fabric folds, child-sized proportions, natural skin texture, subtle grain, understated neutral colour. Warm in human feeling but no golden-hour spectacle.
Composition: medium environmental landscape view, enough context to understand the doorway, quiet off-centre framing, unposed interaction rather than a family portrait.
Constraints: all people fictional and not real clients or staff. No readable text, labels, logos, watermark, insurance icon, camera gaze, corporate stock smiles, matching outfits or forced laughter. Avoid showroom perfection, poverty, damage, excessive bokeh, cartoon, CGI or plastic skin.
```

## altersvorsorge

Fiktive ältere Frau topft in einer Gartenwerkstatt eine Pflanze um; eine zweite Person bereitet im Hintergrund Tee zu.

Finaler Dateipfad: `public/assets/services/altersvorsorge.webp`

Finale Datei: 1536 × 1024 px, 236990 Bytes. SHA-256: `eae427c0f84a64ff93874a54f96ae2d33201692361cf4c7c3e5d1d1591a2c927`.

PNG SHA-256: `61eaefcc84ff81acda88b56c08df4682c7f78f2ca3b962f4f49ab00089cb3d72`. Vorheriges WebP SHA-256: `76afc2cd4a64ab0739589101f48f64906e7d2c84469ac787dec0c6f754773bfb`.

Exakter Prompt:

```text
Use case: photorealistic-natural.
Asset type: candid refined editorial lifestyle photograph for a regional German retirement planning website, landscape 3:2.
Primary request: a fictional person in their early sixties quietly repotting one small young plant at a wooden workbench in a bright small garden shed. They stand or sit comfortably, concentrating naturally on placing the plant into a plain terracotta pot; practical casual clothes, authentic gently aged face in partial profile, no camera gaze. A second fictional adult of similar age is softly out of focus further back by the open shed doorway, preparing a simple cup of tea.
Scene: clean maintained modest garden shed or small domestic workshop in southern Germany, light wood surfaces, a few ordinary useful tools and pots, open door with a small glimpse of a pleasant garden. A self-directed ordinary day, neither luxury lifestyle nor shabby poverty.
Style: photorealistic documentary editorial photography, normal 35mm perspective, bright soft natural daylight through shed door/window, realistic hands, hair, wrinkles and fabric, natural material textures, slight grain and restrained clear colours.
Composition: workbench activity in the foreground with both hands visible only as needed, second adult secondary and soft; spacious landscape crop, candid asymmetric framing. The scene is inside a shed at a workbench, not two people gardening in a flowerbed.
Constraints: entirely fictional people, no actual staff likeness. No readable text, logos or watermark. Avoid posed retirement advertising, model perfection, forced laughter, matching clothes, wine/resort tropes, dramatic golden light, CGI, HDR or artificial studio setup.
```
