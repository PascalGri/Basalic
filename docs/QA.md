# Prüfung der Website auf main

Stand: 10.11.2026. Die helle Startseite „Für Ihr Zuhause. Und alles, was folgt.“ ist der Ausgangspunkt für die aktuelle Website. Der Immobilienbestand ist mit dem Portal verbunden.

- `npm run build` baut die Website und erzeugt die Metadaten, Vorschaubilder und responsiven Bildvarianten.
- `npm run check` prüft die 49 mitgelieferten Objekte, ihre Bildquellen und die 62 Seiten gegen den laufenden lokalen Server.
- `npm run check:admin` prüft Anmeldung, Zugriffsschutz, private Entwürfe und Fotos, Veröffentlichung, Bearbeitung, den Wechsel zu den Referenzen und Daten nach einem Neustart mit einem temporären Bestand.

Der sichtbare Startbereich wurde in Chrome bei 390, 780 und 1440 Pixel Breite mit der ausgewählten Vorlage verglichen. Die Aufnahmen stimmen pixelgenau überein. [Aufnahme bei 780 Pixel Breite](../screenshots/startseite-tablet.png).

Der Browserablauf verwendet einen separaten Testbestand: Zwei Fotos hochladen und das Titelbild wählen, als Entwurf speichern, veröffentlichen und das Objekt als verkauft markieren. Dabei erscheint es zunächst in der Angebotsliste und auf der Startseite und wechselt dann mit derselben Adresse in die Referenzen.

Frühere Prüfberichte zur Gestaltung sind an den jeweils dokumentierten Entwurfsstand gebunden. [Gestaltungsabgleich](FINANCE_TEMPLATE.md) und [Mediennachweise](ASSET_LICENSES.md) beschreiben die aktuelle Grundlage.
