# Preisunterlagen für Websites und Betreuung

Stand: November 2026. Alle neuen Richtpreise sind netto kalkuliert.

- **Schaf-und-Grimm-Preisliste-Websites.pdf:** Preisübersicht für künftige Kundenangebote.
- **Schaf-und-Grimm-Preisvergleich-Basalic-intern.pdf:** Interner Vergleich mit den Basalic-Sonderkonditionen, nicht zur Weitergabe an Kunden.
- **quelle/:** Bearbeitbare Python-Quelle mit SG-Logo und Inter-Schriften einschließlich Schriftlizenz.

Die aktuellen Richtpreise sind 1.500 € für Website Basis, 2.500 € für Website Komplett, jeweils als Einstiegspreis, sowie 69 € monatlich für Hosting und Betreuung und 95 € pro Stunde für Wartung und Weiterentwicklung.

## PDFs neu erstellen

Die Beträge stehen in `quelle/erstelle_preisliste.py` unter `PRICES`. Die ursprünglichen Basalic-Beträge stehen unter `ORIGINAL`. Der interne Vergleich berechnet die Nachlässe daraus automatisch.

Voraussetzung: Python 3 mit `reportlab`.

Vom Repository-Hauptverzeichnis aus:

```sh
python3 -m pip install reportlab
python3 preisunterlagen/quelle/erstelle_preisliste.py
```

Die beiden PDFs werden direkt in diesem Ordner aktualisiert. Alle benötigten Design-Dateien sind enthalten.
