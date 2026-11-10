# Immobilien auf der Website verwalten

Im [Testportal auf GitHub Pages](https://pascalgri.github.io/Basalic/admin/) können Sie die folgenden Schritte ohne Anmeldung ausprobieren. Testobjekte und Fotos bleiben im verwendeten Browser. In der Testvorschau sehen Sie, wie sich die Änderungen auf der Website auswirken. Über **Demo zurücksetzen** stellen Sie den Ausgangsbestand wieder her.

Für die gemeinsame Immobilienverwaltung auf dem Server gelten diese Schritte:

1. Öffnen Sie `/admin` auf Ihrer Website und melden Sie sich mit Ihrem Passwort an.
2. Wählen Sie **Neues Angebot**. Ergänzen Sie Titel, Ort und Objektart. Sie können Beschreibung, Ausstattung, Preis, Energieangaben, einen Exposé-Link und bis zu acht Fotos hinzufügen. Das erste Foto ist das Titelbild. Bei Bedarf können Sie ein anderes Foto als Titelbild wählen.
3. Mit **Als Entwurf speichern** bleibt der Eintrag nur für Sie sichtbar. Mit **Angebot veröffentlichen** erscheint die Immobilie auf der Website unter **Immobilien**. Für Änderungen öffnen Sie das Objekt im Bestand und speichern erneut.
4. Ist eine Immobilie verkauft, wählen Sie **Als verkauft markieren** und bestätigen Sie den Wechsel. Sie erscheint jetzt unter **Verkaufte Referenzen**, behält ihre Adresse und zeigt keine Kaufanfrage mehr. Bei Bedarf können Sie sie mit **Wieder anbieten** zurückholen.

## Zugang lokal einrichten

Im Terminal aus dem Hauptverzeichnis des Projekts:

```sh
npm ci
cp -n .env.example .env
npm run admin:password
```

Das letzte Kommando erzeugt ein zufälliges Passwort und gibt eine Zeile `BASALIC_ADMIN_PASSWORD_HASH=…` aus. Ersetzen Sie damit die entsprechende Zeile in `.env`. Geben Sie das Passwort separat an Herrn Basalic weiter, zum Beispiel über den verwendeten Passwortmanager. Die `.env` und das Datenverzeichnis gehören nicht ins Repository. Ohne Hash ist die Anmeldung deaktiviert. Für einen Passwortwechsel erzeugen Sie einen neuen Hash und starten den Server neu. Ein Neustart beendet bestehende Anmeldungen.

```sh
npm run build
npm start
```

Das Portal ist dann unter `http://127.0.0.1:5104/admin` erreichbar. Falls dort bereits die lokale Vorschau läuft, können Sie den Server alternativ mit `PORT=5105 npm start` starten. Für Entwicklung oder Vorschau unterstützen `npm run dev` und `npm run preview` dieselbe Datenablage und Anmeldung.

## Betrieb auf der Website

- `npm run build` und `npm start` verwenden. Der Node-Prozess liefert die öffentlichen Seiten und das Portal gemeinsam aus; ein rein statischer Upload von `dist/` kann Änderungen aus dem Portal nicht speichern oder ausliefern.
- HTTPS vor dem Node-Prozess bereitstellen, etwa über den Reverse Proxy des Hosters, und `BASALIC_SITE_ORIGIN` auf die tatsächliche öffentliche HTTPS-Adresse setzen, z. B. `https://www.example.com`. Die Website und das Portal müssen dieselbe Origin verwenden. Die getrennte Freigabe für Suchmaschinen steht in [SEO_MEDIA.md](SEO_MEDIA.md).
- `BASALIC_DATA_DIR` auf ein privates, dauerhaftes Verzeichnis setzen. Den Prozess mit Schreibrechten dafür und in einer einzelnen Instanz betreiben. `properties.json` enthält die Ergänzungen und Änderungen zum mitgelieferten Bestand; `photos/` enthält die hochgeladenen Bilder. Beide zusammen sichern und bei einem Umzug gemeinsam übernehmen. Das Datenverzeichnis liegt außerhalb von `dist/` und wird bei einem neuen Build nicht ersetzt.
- Nach einem Build prüft `npm run check:admin` den Ablauf mit einem temporären Zugang und Datenverzeichnis. Der tatsächliche Immobilienbestand wird dabei nicht geändert.
