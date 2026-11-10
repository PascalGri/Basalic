# Responsive Bilder und Seitenmetadaten

## Bildvarianten

`node scripts/prepare-media.mjs` verarbeitet die tatsächlich eingesetzten lokalen Bildquellen: 48 Objektabbildungen, Startmotiv, Porträt, vier Servicebilder und zwölf zusätzliche Galeriefotos. Die vier historischen Leistungsmotive im ursprünglichen Assetmanifest werden nicht erneut für die Oberfläche vorbereitet.

Die Originaldateien bleiben unverändert. Unter `public/assets/responsive/` entstehen WebP-Varianten mit 320, 640, 960 und 1440 Pixeln Breite, soweit die Quelle diese Breite hergibt. Kleinere Originale erhalten zusätzlich ihre tatsächliche Breite; es wird nicht hochskaliert. Seitenverhältnisse und Bildinhalte bleiben erhalten. SHA-256 der Quellen, Maße und Varianten stehen im generierten `src/media-manifest.js`. Unveränderte Varianten und Sharebilder werden anhand des Quellhashs, der Produktionsparameter und vorhandener Dateien wiederverwendet.

`imageMarkup(name, alt, { className, eager, sizes })` aus `src/media.js` erzeugt ein sicher escaptes lokales `<img>` mit `srcset`, `sizes`, tatsächlichen intrinsischen Maßen und asynchroner Dekodierung. Ohne `eager: true` werden Bilder verzögert geladen; wichtige Einstiegsbilder bekommen `loading="eager"` und `fetchpriority="high"`. Die aufrufende Komponente setzt `sizes` passend zu ihrer tatsächlichen Layoutbreite.

Namen werden ohne Dateiendung relativ zu `/assets/` angegeben, beispielsweise `faurndau`, `services/finanzierung` oder `property-gallery/faurndau-kueche`. `getImageData(name)` liefert `{ src, srcset, width, height }` für einen Bildwechsel in der Galerie. Unbekannte oder unsichere Namen liefern `null`; `imageMarkup` lässt sie aus, statt externe oder geratene Bildpfade einzusetzen. Nach Ergänzung einer echten Bildquelle deshalb das Vorbereitungsskript erneut ausführen.

## Seiten und Teilen-Bilder

`src/seo.js` exportiert `routeMetadata`, `metadataFor(path)`, `seoTagsFor(path)` und `updateSeo(path)`. Die Bibliothek enthält individuelle Titel und Beschreibungen für die Hauptseiten, die Verkäuferseite `/immobilie-verkaufen` und alle 49 Objekte. Verkaufte Referenzen bleiben auch in den Metadaten als verkauft gekennzeichnet. Such- und Filterparameter werden nicht als eigene Seiten behandelt.

Für jede der 62 Routen entsteht unter `public/assets/social/` ein JPEG mit 1200 × 630 Pixeln für Linkvorschauen, mit hellem Aurora-Hintergrund, Serifentitel und Basalic-Schriftzug. Wo ein passendes Motiv vorhanden ist, zeigt die Vorschau das zugeordnete lokale Foto. Die drei Service-Sharebilder mit KI-Motiv tragen die sichtbare Kennzeichnung „KI-generiertes Beispielbild“. Die Startseite und Seiten ohne Bildmotiv verwenden die Aurora als alleinigen Hintergrund. Ältere WebP-Adressen bleiben für bereits geteilte Links abrufbar.

Die HTML-Vorlage bindet das Aurora-Favicon als PNG unter `/favicon.png` mit 96 × 96 Pixeln ein. Aus der Vektorfassung unter `/favicon.svg` entsteht außerdem `/apple-touch-icon.png` mit 180 × 180 Pixeln für iOS. Die PNG-Datei des Favicons steht Google für die Suchergebnisse zur Verfügung, sobald Google die öffentlich erreichbare Startseite und das Favicon erneut gecrawlt hat.

`npm run build` führt drei Schritte aus:

1. Bildvarianten und Sharebilder vorbereiten.
2. Vite-Produktionsbuild erzeugen.
3. Mit `node scripts/prepare-media.mjs --page-heads` für jede Route eine eigene `dist/.../index.html` mit fertigem Titel, Beschreibung, Open-Graph- und Twitter-Metadaten schreiben. Zusätzlich wird dieselbe Seite als `dist/<route>.html` erzeugt, damit Vites Vorschau auch Links ohne abschließenden Schrägstrich auf den richtigen individuellen Head auflöst.

Dadurch können auch Crawler ohne JavaScript die individuellen Metadaten einer direkt geöffneten Seite lesen. `updateSeo(path)` aktualisiert denselben Head bei interner Navigation. Die Seiteninhalte bleiben eine clientseitig gerenderte Anwendung; dies ist kein vollständiges SSR oder serverseitig vorgerenderter Seiteninhalt. Statisches Hosting muss die erzeugten Routendateien ausliefern und für unbekannte Anwendungspfade einen passenden Fallback unterstützen.

## Staging und Vorbereitung eines späteren Livebetriebs

Standardmäßig bleiben sämtliche Seiten auf `noindex,nofollow,noarchive`. Der Build schreibt zusätzlich eine `dist/robots.txt` mit `Disallow: /`. Ohne ausdrücklich konfigurierte Website-Origin werden weder Canonical-Links noch `og:url` oder eine Sitemap mit erfundener Domain erzeugt. Die Sharebilder werden in diesem Zustand mit lokalen Pfaden referenziert.

Die bestätigte spätere Origin kann über `SITE_URL` oder `VITE_SITE_URL` gesetzt werden. Erlaubt ist eine absolute HTTP(S)-Origin ohne Zugangsdaten, Unterpfad, Suchparameter oder Fragment. Konfiguration kann aus der Umgebung oder aus Vites lokalen Umgebungsdateien kommen; sensible Werte gehören nicht ins Repository. Eine Domainangabe allein hebt `noindex` nicht auf.

Erst nach tatsächlicher Freigabe des Livebetriebs zusätzlich `ALLOW_INDEXING=true` oder `VITE_ALLOW_INDEXING=true` setzen und neu bauen. Nur die Kombination aus explizitem Indexierungsflag und gültiger Origin erzeugt indexierbare Heads, absolute Canonical-/Sharing-URLs und `dist/sitemap.xml` mit den bestätigten absoluten Routen. Die `robots.txt` verweist dann auf diese Sitemap. Ohne beides bleibt die Indexierung gesperrt.

Es werden keine Produktionsdomain, Adresse, Bewertungen, Aggregate-Ratings oder LocalBusiness-Pflichtangaben ergänzt oder geraten. Herkunft und Rechte der Bildquellen stehen in `docs/ASSET_LICENSES.md`, `docs/SERVICE_IMAGE_PROMPTS.md` und `docs/PROPERTY_GALLERY_SOURCES.json`. Diese Umsetzung enthält kein Deployment.
