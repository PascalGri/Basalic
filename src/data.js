export const sourceDate = '03.11.2026';
// Immobilienbestand der Quellseite, geprüft am 03.11.2026.
// sourceRow verknüpft jeden Eintrag mit seiner unveränderten dmRespRow-ID.
// Flächen ohne eindeutige Wohnflächenangabe tragen ein eigenes areaLabel.
export const properties = [
  {
    "id": "faurndau",
    "city": "Göppingen-Faurndau",
    "title": "Zwei Familien. Viele Möglichkeiten.",
    "type": "Haus",
    "kind": "Freistehendes Zweifamilienhaus",
    "area": "ca. 155",
    "land": "ca. 244",
    "note": "Auf der Quellseite zu verkaufen und als bezugsfrei beschrieben. Den aktuellen Stand bitte direkt erfragen.",
    "status": "offer",
    "features": [
      "Großer Garten",
      "Einzelgarage und Stellplatz",
      "Laut Quelle bezugsfrei"
    ],
    "sourceRow": "1766087092",
    "image": "faurndau",
    "expose": "171049343"
  },
  {
    "id": "muehlhausen",
    "city": "Mühlhausen im Täle",
    "title": "Platz für Ihren eigenen Garten.",
    "type": "Haus",
    "kind": "Freistehendes Einfamilienhaus",
    "area": "101",
    "land": "814",
    "note": "Auf der Quellseite zu verkaufen und als bezugsfrei beschrieben. Eine aktuelle Verfügbarkeit wurde nicht bestätigt.",
    "status": "offer",
    "features": [
      "Großer Garten",
      "Einzelgarage und Stellplätze",
      "Laut Quelle bezugsfrei"
    ],
    "sourceRow": "1514467580",
    "image": "muehlhausen",
    "expose": "169662545"
  },
  {
    "id": "neidlingen",
    "city": "Neidlingen",
    "title": "Wohnen mit mehr Perspektiven.",
    "type": "Haus",
    "kind": "Zweifamilienhaus mit Einliegerwohnung",
    "area": "201",
    "year": "1994",
    "note": "Nutzung, Eignung als Kapitalanlage und aktuellen Stand bitte direkt bestätigen lassen.",
    "status": "offer",
    "features": [
      "2 Wohnungen und Einliegerwohnung",
      "Laut Quelle bezugsfrei",
      "In der Quelle als Kapitalanlage beschrieben"
    ],
    "sourceRow": "1432507334",
    "image": "neidlingen",
    "expose": "169930109"
  },
  {
    "id": "bezgenriet",
    "city": "Göppingen-Bezgenriet",
    "title": "Zwei Wohnungen unter einem Dach.",
    "type": "Haus",
    "kind": "Zweifamilienhaus",
    "area": "164",
    "areaLabel": "Gesamtfläche",
    "year": "1997",
    "note": "Die Quelle nennt „164 qm Gesamt“, ohne die Flächenart ausdrücklich zu bestimmen. Beide Wohnungen werden als vermietet beschrieben. Mietverhältnisse und aktuellen Stand bitte bestätigen lassen.",
    "status": "offer",
    "features": [
      "Zwei vermietete Wohnungen laut Quelle",
      "Balkon und Terrasse",
      "Zwei Stellplätze"
    ],
    "sourceRow": "1246193212",
    "image": "bezgenriet"
  },
  {
    "id": "schwaebisch-hall",
    "city": "Schwäbisch Hall",
    "title": "Wohnen mit zwei Terrassen.",
    "type": "Wohnung",
    "kind": "3-Zimmer-Erdgeschosswohnung",
    "area": "76",
    "year": "1992",
    "rooms": "3",
    "note": "Auf der Quellseite zu verkaufen, renoviert und bezugsfrei beschrieben. Aktuellen Stand bitte erfragen.",
    "status": "offer",
    "features": [
      "Zwei Terrassen",
      "Tiefgaragenstellplatz",
      "Renoviert laut Quelle",
      "Laut Quelle bezugsfrei"
    ],
    "sourceRow": "1172901170",
    "image": "schwaebisch-hall",
    "expose": "168406677"
  },
  {
    "id": "salach",
    "city": "Salach",
    "title": "Großzügig auf einer Ebene.",
    "type": "Haus",
    "kind": "Einfamilienhaus",
    "area": "240",
    "land": "700",
    "year": "2017",
    "rooms": "6",
    "note": "Die Quelle zeigt ausdrücklich nur ein Beispielbild. Hier wird es nicht als Objektfoto verwendet. Barrierefreiheit, Ausstattung und aktuellen Stand bitte vor Ort bestätigen lassen.",
    "status": "offer",
    "features": [
      "Wohnfläche auf einer Ebene",
      "Laut Quelle barrierefrei",
      "Swimmingpool",
      "Hochwertiges Interieur laut Quelle inklusive",
      "Preis auf Anfrage"
    ],
    "sourceRow": "1519572075"
  },
  {
    "id": "plochingen",
    "city": "Plochingen",
    "title": "Eine Wohnung als Kapitalanlage.",
    "type": "Wohnung",
    "kind": "2-Zimmer-Wohnung",
    "area": "50",
    "year": "1991",
    "rooms": "2",
    "note": "Auf der Quellseite zu verkaufen und als vermietet beschrieben. Nicht mit der verkauften 51-m²-Referenz in Plochingen verwechseln.",
    "status": "offer",
    "features": [
      "Terrasse",
      "Tiefgaragenstellplatz",
      "Laut Quelle vermietet",
      "In der Quelle als Kapitalanlage beschrieben"
    ],
    "sourceRow": "1236925600",
    "image": "plochingen",
    "expose": "166340253"
  },
  {
    "id": "referenz-plochingen",
    "city": "Plochingen",
    "title": "Wohnung mit Terrasse.",
    "type": "Wohnung",
    "kind": "2-Zimmer-Wohnung",
    "area": "51",
    "year": "1991",
    "rooms": "2",
    "status": "sold",
    "features": [
      "Terrasse",
      "Stellplatz"
    ],
    "sourceRow": "1107683856",
    "image": "referenz-plochingen",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "istrien",
    "city": "Istrien · Kroatien",
    "title": "Land zwischen Olivenbäumen.",
    "type": "Grundstück",
    "kind": "Grundstück mit Steinhaus",
    "land": "ca. 18.000",
    "note": "Informationsangebot ohne eindeutigen Verkaufsstatus. Bebaubarkeit, Entfernungen und Baumalter sind Originalangaben der Quellseite, keine unabhängig bestätigten Zusagen. Lage, Eigentums-, Nutzungs- und Baurecht sowie aktuellen Stand vor Ort prüfen.",
    "status": "information",
    "features": [
      "120 Olivenbäume, laut Quelle 5–10 Jahre alt",
      "Steinhaus mit ca. 80 m² Fläche",
      "Quellangabe zum Steinhaus: bebaubar",
      "Laut Quelle 3,5 km zum Meer und 3 km zur Stadt"
    ],
    "sourceRow": "1963576162",
    "image": "istrien"
  },
  {
    "id": "sarajevo",
    "city": "Raum Sarajevo · Bosnien und Herzegowina",
    "title": "Ein Haus mit weitem Grundstück.",
    "type": "Haus",
    "kind": "Haus auf zwei Ebenen",
    "area": "110",
    "land": "ca. 10.000",
    "note": "Informationsangebot ohne eindeutigen Verkaufsstatus. Baumalter und Fahrzeiten sind Originalangaben der Quellseite, keine unabhängig bestätigten Angaben. Genaue Lage, Rechtslage und aktuellen Stand bitte bestätigen lassen.",
    "status": "information",
    "features": [
      "Zweistöckig",
      "Über 50 Walnussbäume, laut Quelle 8 Jahre alt",
      "Laut Quelle 1,5 Stunden zur Küste",
      "Laut Quelle 30 Minuten zum Skigebiet und 20 Minuten nach Sarajevo"
    ],
    "sourceRow": "1488694642",
    "image": "sarajevo"
  },
  {
    "id": "referenz-eislingen",
    "city": "Eislingen",
    "title": "Einfamilienhaus in Eislingen.",
    "type": "Haus",
    "kind": "Einfamilienhaus",
    "area": "156",
    "land": "288",
    "status": "sold",
    "features": [
      "Doppelgarage",
      "Sauna",
      "Solar laut historischem Inserat"
    ],
    "sourceRow": "1652934967",
    "image": "referenz-eislingen",
    "expose": "158137015",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-uhingen",
    "city": "Uhingen",
    "title": "Wohnen im Erdgeschoss.",
    "type": "Wohnung",
    "kind": "2-Zimmer-Erdgeschosswohnung",
    "area": "50",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "2",
    "note": "Verkauft laut Quelle. Die Flächenangabe steht dort als „50 qm €“ ohne nähere Einordnung. Barrierefreiheit und Ausstattung sind Angaben des historischen Inserats.",
    "status": "sold",
    "features": [
      "Barrierefrei laut historischem Inserat",
      "Tiefgaragenstellplatz",
      "Terrasse",
      "Einbauküche"
    ],
    "sourceRow": "1074637887",
    "image": "referenz-uhingen",
    "expose": "158477048"
  },
  {
    "id": "referenz-eislingen-garten",
    "city": "Eislingen",
    "title": "Eigenes Haus. Eigener Garten.",
    "type": "Haus",
    "kind": "Einfamilienhaus",
    "area": "115",
    "land": "340",
    "status": "sold",
    "features": [
      "Einzelgarage",
      "Garten"
    ],
    "sourceRow": "1821346797",
    "image": "referenz-eislingen-garten",
    "expose": "158165783",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-waldenbuch-wohnung",
    "city": "Waldenbuch",
    "title": "Wohnen mit Balkon.",
    "type": "Wohnung",
    "kind": "1,5-Zimmer-Wohnung",
    "rooms": "1,5",
    "status": "sold",
    "features": [
      "Balkon",
      "Küche",
      "Tiefgaragenstellplatz"
    ],
    "sourceRow": "1600318677",
    "image": "referenz-waldenbuch-wohnung",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-eislingen-74",
    "city": "Eislingen",
    "title": "Drei Zimmer in Eislingen.",
    "type": "Wohnung",
    "kind": "3-Zimmer-Wohnung",
    "area": "ca. 74",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "3",
    "status": "sold",
    "features": [
      "Außenstellplatz"
    ],
    "sourceRow": "1041976400",
    "image": "referenz-eislingen-74",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-ditzingen",
    "city": "Ditzingen",
    "title": "Wohnung mit Balkon und Garage.",
    "type": "Wohnung",
    "kind": "2,5-Zimmer-Wohnung",
    "rooms": "2,5",
    "status": "sold",
    "features": [
      "Balkon",
      "Küche",
      "Garage"
    ],
    "sourceRow": "1073398324",
    "image": "referenz-ditzingen",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-waldenbuch-haus",
    "city": "Waldenbuch",
    "title": "Ein Haus mit Veränderungspotenzial.",
    "type": "Haus",
    "kind": "Ein- / Zweifamilienhaus",
    "status": "sold",
    "features": [
      "Laut historischem Inserat renovierungsbedürftig oder Abriss"
    ],
    "sourceRow": "1047145304",
    "image": "referenz-waldenbuch-haus",
    "expose": "144454899",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-goeppingen-nordstadt-74",
    "city": "Göppingen-Nordstadt",
    "title": "Vier Zimmer. Zwei Balkone.",
    "type": "Wohnung",
    "kind": "4-Zimmer-Wohnung",
    "area": "ca. 74",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "4",
    "status": "sold",
    "features": [
      "Zwei Balkone",
      "Renoviert laut historischem Inserat",
      "Einbauküche",
      "Bei Inserierung bezugsfrei"
    ],
    "sourceRow": "1330675682",
    "image": "referenz-goeppingen-nordstadt-74",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-ebersbach",
    "city": "Ebersbach",
    "title": "Wohnung mit Einzelgarage.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Wohnung",
    "area": "ca. 87",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "3,5",
    "status": "sold",
    "features": [
      "Einzelgarage",
      "Bei Inserierung bezugsfrei"
    ],
    "sourceRow": "1893814691",
    "image": "referenz-ebersbach",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-leinfelden-echterdingen",
    "city": "Leinfelden-Echterdingen",
    "title": "Drei Zimmer mit Balkon.",
    "type": "Wohnung",
    "kind": "3-Zimmer-Wohnung",
    "area": "ca. 68",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "3",
    "status": "sold",
    "features": [
      "Außenstellplatz",
      "Einbauküche",
      "Balkon"
    ],
    "sourceRow": "1843971558",
    "image": "referenz-leinfelden-echterdingen",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-wangen-oberwaelden",
    "city": "Wangen-Oberwälden",
    "title": "Ein Bungalow mit Grundstück.",
    "type": "Haus",
    "kind": "Bungalow",
    "area": "ca. 100",
    "areaLabel": "Fläche laut Quelle",
    "land": "589",
    "rooms": "3,5",
    "note": "Verkauft laut Quelle. Die Erweiterbarkeit ist eine unbestätigte Angabe des historischen Inserats. Separater Quelleneintrag gegenüber dem 95-m²-Bungalow in Wangen; nicht zusammengeführt.",
    "status": "sold",
    "features": [
      "Im historischen Inserat als erweiterbar beschrieben"
    ],
    "sourceRow": "1924244566",
    "image": "referenz-wangen-oberwaelden"
  },
  {
    "id": "referenz-gingen",
    "city": "Gingen an der Fils",
    "title": "Wohnung mit zwei Stellplätzen.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Wohnung",
    "area": "77",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "3,5",
    "status": "sold",
    "features": [
      "Zwei Stellplätze"
    ],
    "sourceRow": "1326889703",
    "image": "referenz-gingen",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-ludwigsburg",
    "city": "Ludwigsburg-Stadtmitte",
    "title": "Loftambiente in der Stadtmitte.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Wohnung",
    "area": "85",
    "areaLabel": "Fläche laut Quelle",
    "year": "1992",
    "rooms": "3,5",
    "note": "Verkauft laut Quelle. Das Inserat nennt zunächst einen TG-Stellplatz und bei den Eckdaten zwei TG-Stellplätze; die Abweichung ist nicht geklärt.",
    "status": "sold",
    "features": [
      "Loftambiente laut historischem Inserat",
      "Aufzug",
      "Zwei Tiefgaragenstellplätze"
    ],
    "sourceRow": "1291541169",
    "image": "referenz-ludwigsburg"
  },
  {
    "id": "referenz-goeppingen-nordstadt-garten",
    "city": "Göppingen-Nordstadt",
    "title": "Erdgeschoss mit Garten.",
    "type": "Wohnung",
    "kind": "4,5-Zimmer-Erdgeschosswohnung",
    "area": "91",
    "rooms": "4,5",
    "status": "sold",
    "features": [
      "Balkon",
      "Garten",
      "Stellplatz",
      "Einbauküche",
      "Hobbyraum",
      "Fußbodenheizung"
    ],
    "sourceRow": "1141031938",
    "image": "referenz-goeppingen-nordstadt-garten",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-eislingen-penthouse-123",
    "city": "Eislingen",
    "title": "Penthouse mit Balkon.",
    "type": "Wohnung",
    "kind": "4,5-Zimmer-Penthousewohnung",
    "area": "123",
    "year": "1972",
    "rooms": "4,5",
    "status": "sold",
    "features": [
      "Balkon",
      "Bei Inserierung bezugsfrei"
    ],
    "sourceRow": "1053840471",
    "image": "referenz-eislingen-penthouse-123",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-faurndau-wohnung",
    "city": "Göppingen-Faurndau",
    "title": "Zwei Zimmer in Faurndau.",
    "type": "Wohnung",
    "kind": "2-Zimmer-Wohnung",
    "area": "55",
    "areaLabel": "Fläche laut Quelle",
    "year": "1967",
    "rooms": "2",
    "status": "sold",
    "features": [
      "Einbauküche",
      "Stellplatz",
      "Renoviert laut historischem Inserat",
      "Historische Bezugsangabe: ab 01.06.2021 bezugsfrei"
    ],
    "sourceRow": "1477060526",
    "image": "referenz-faurndau-wohnung",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-plattenhardt-penthouse",
    "city": "Filderstadt-Plattenhardt",
    "title": "Penthouse mit Gartennutzung.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Penthousewohnung",
    "area": "140",
    "year": "1991",
    "rooms": "3,5",
    "note": "Verkauft laut Quelle. Kaltmiete und Mietstatus stammen aus dem historischen Inserat. Das gleiche Quellbild wird dort auch der 79-m²-Wohnung in Plattenhardt zugeordnet.",
    "status": "sold",
    "features": [
      "Balkon",
      "Stellplatz",
      "Gartennutzung",
      "Historische Mietangabe: vermietet für 950 € Kaltmiete"
    ],
    "sourceRow": "1498127006",
    "image": "referenz-plattenhardt-penthouse"
  },
  {
    "id": "referenz-wangen-zweifamilienhaus",
    "city": "Wangen",
    "title": "Zwei Wohnungen in Wangen.",
    "type": "Haus",
    "kind": "Zweifamilienhaus",
    "area": "136",
    "land": "ca. 500",
    "year": "1936",
    "status": "sold",
    "features": [
      "Renoviert laut historischem Inserat",
      "Bei Inserierung bezugsfrei"
    ],
    "sourceRow": "1674750184",
    "image": "referenz-wangen-zweifamilienhaus",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-gartenwohnung-88",
    "city": "Ort in der Quelle nicht genannt",
    "title": "Wohnung mit eigenem Garten.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Wohnung",
    "area": "88",
    "areaLabel": "Fläche laut Quelle",
    "year": "1992",
    "rooms": "3,5",
    "note": "Verkauft laut Quelle. Der Quelleneintrag nennt keinen Ort; eine Ortszuordnung wurde nicht ergänzt.",
    "status": "sold",
    "features": [
      "Ca. 40 m² Garten",
      "Tiefgaragenstellplatz laut historischem Inserat inklusive"
    ],
    "sourceRow": "1953026017",
    "image": "referenz-gartenwohnung-88"
  },
  {
    "id": "referenz-goeppingen-75",
    "city": "Göppingen",
    "title": "Wohnung mit Balkon und Stellplatz.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Wohnung",
    "area": "75",
    "areaLabel": "Fläche laut Quelle",
    "year": "1995",
    "rooms": "3,5",
    "status": "sold",
    "features": [
      "Balkon",
      "Stellplatz"
    ],
    "sourceRow": "1323306606",
    "image": "referenz-goeppingen-75",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-goeppingen-103",
    "city": "Göppingen",
    "title": "Vier Zimmer und ein halbes.",
    "type": "Wohnung",
    "kind": "4,5-Zimmer-Wohnung",
    "area": "103",
    "areaLabel": "Fläche laut Quelle",
    "year": "1998",
    "rooms": "4,5",
    "status": "sold",
    "features": [
      "Zwei Balkone",
      "Stellplatz"
    ],
    "sourceRow": "1971343620",
    "image": "referenz-goeppingen-103",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-eislingen-101",
    "city": "Eislingen",
    "title": "Vier Zimmer mit zwei Balkonen.",
    "type": "Wohnung",
    "kind": "4-Zimmer-Wohnung",
    "area": "101",
    "year": "1972",
    "rooms": "4",
    "status": "sold",
    "features": [
      "Tiefgaragenstellplatz",
      "Zwei Balkone"
    ],
    "sourceRow": "1682627020",
    "image": "referenz-eislingen-101",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-plattenhardt-erdgeschoss",
    "city": "Filderstadt-Plattenhardt",
    "title": "Erdgeschoss mit Gartennutzung.",
    "type": "Wohnung",
    "kind": "3,5-Zimmer-Erdgeschosswohnung",
    "area": "160",
    "year": "1991",
    "rooms": "3,5",
    "status": "sold",
    "features": [
      "Balkon",
      "Garage",
      "Gartennutzung",
      "Bei Inserierung zeitnah bezugsfrei"
    ],
    "sourceRow": "1591988186",
    "image": "referenz-plattenhardt-erdgeschoss",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-eislingen-penthouse-44",
    "city": "Eislingen",
    "title": "Penthouse mit Aussicht.",
    "type": "Wohnung",
    "kind": "1,5-Zimmer-Penthousewohnung",
    "area": "44",
    "year": "1972",
    "rooms": "1,5",
    "status": "sold",
    "features": [
      "Renoviert und gepflegt laut historischem Inserat",
      "Aussicht laut historischem Inserat",
      "Tiefgaragenstellplatz"
    ],
    "sourceRow": "1770445873",
    "image": "referenz-eislingen-penthouse-44",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-plattenhardt-appartement",
    "city": "Filderstadt-Plattenhardt",
    "title": "Appartement mit Gartennutzung.",
    "type": "Wohnung",
    "kind": "1-Zimmer-Appartement",
    "area": "36",
    "year": "1991",
    "rooms": "1",
    "status": "sold",
    "features": [
      "Stellplatz",
      "Gartennutzung",
      "Bei Inserierung vermietet"
    ],
    "sourceRow": "1481795156",
    "image": "referenz-plattenhardt-appartement",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-tamm",
    "city": "Tamm",
    "title": "Appartement mit Aufzug und Balkon.",
    "type": "Wohnung",
    "kind": "Appartement",
    "area": "28",
    "areaLabel": "Fläche laut Quelle",
    "year": "1992",
    "note": "Verkauft laut Quelle. Widersprüchliche Zimmerzahl: Im Titel steht „1 Zimmer App.“, bei den Eckdaten „1,5 Zimmer“. Daher wird keine eindeutige Zimmerzahl gesetzt.",
    "status": "sold",
    "features": [
      "Aufzug",
      "Balkon",
      "Zimmerzahl in der Quelle: Titel 1 Zimmer, Eckdaten 1,5 Zimmer"
    ],
    "sourceRow": "1842596248",
    "image": "referenz-tamm"
  },
  {
    "id": "referenz-plattenhardt-79",
    "city": "Filderstadt-Plattenhardt",
    "title": "Drei Zimmer mit Gartennutzung.",
    "type": "Wohnung",
    "kind": "3-Zimmer-Wohnung",
    "area": "79",
    "year": "1991",
    "rooms": "3",
    "note": "Verkauft laut Quelle. Das gleiche Quellbild wird dort auch der 140-m²-Penthousewohnung in Plattenhardt zugeordnet; beide Quelleneinträge bleiben getrennt.",
    "status": "sold",
    "features": [
      "Stellplatz",
      "Gartennutzung"
    ],
    "sourceRow": "1690104026",
    "image": "referenz-plattenhardt-79"
  },
  {
    "id": "referenz-metzingen",
    "city": "Metzingen",
    "title": "Zwei Zimmer für später.",
    "type": "Wohnung",
    "kind": "2-Zimmer-Wohnung · betreutes Wohnen",
    "area": "52",
    "areaLabel": "Fläche laut Quelle",
    "year": "1996",
    "rooms": "2",
    "status": "sold",
    "features": [
      "In der Quelle als seniorengerecht beschrieben",
      "Betreutes Wohnen laut historischem Inserat",
      "Historische Mietangabe: 440 € Kaltmiete"
    ],
    "sourceRow": "1712897407",
    "image": "referenz-metzingen",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-duernau",
    "city": "Dürnau",
    "title": "Zwei Familien in Dürnau.",
    "type": "Haus",
    "kind": "Zweifamilienhaus",
    "area": "ca. 165",
    "land": "483",
    "status": "sold",
    "features": [],
    "sourceRow": "1086425521",
    "image": "referenz-duernau",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-goeppingen-appartement",
    "city": "Göppingen",
    "title": "Appartement mit Balkon und Aufzug.",
    "type": "Wohnung",
    "kind": "1,5-Zimmer-Wohnung",
    "area": "33",
    "areaLabel": "Fläche laut Quelle",
    "year": "1972",
    "rooms": "1,5",
    "status": "sold",
    "features": [
      "Küche laut historischem Inserat inklusive",
      "Tiefgarage laut historischem Inserat inklusive",
      "Balkon",
      "Aufzug",
      "Bei Inserierung sofort bezugsfrei"
    ],
    "sourceRow": "1205736916",
    "image": "referenz-goeppingen-appartement",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-wangen-bungalow-95",
    "city": "Wangen bei Göppingen",
    "title": "Bungalow mit großem Garten.",
    "type": "Haus",
    "kind": "Einfamilienhaus · Bungalow",
    "area": "ca. 95",
    "land": "589",
    "note": "Verkauft laut Quelle. Separater Quelleneintrag gegenüber dem 100-m²-Bungalow in Wangen-Oberwälden; nicht zusammengeführt.",
    "status": "sold",
    "features": [
      "Großes Gartengrundstück laut historischem Inserat"
    ],
    "sourceRow": "1386546194",
    "image": "referenz-wangen-bungalow-95"
  },
  {
    "id": "referenz-zell",
    "city": "Zell u. A. (laut Quelle)",
    "title": "Wohnen auf zwei Ebenen.",
    "type": "Wohnung",
    "kind": "Maisonettewohnung",
    "area": "56",
    "areaLabel": "Fläche laut Quelle",
    "status": "sold",
    "features": [
      "In der Quelle für Kapitalanlage oder Eigennutzung beschrieben"
    ],
    "sourceRow": "1332314411",
    "image": "referenz-zell",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-wangen-grundstueck",
    "city": "Wangen",
    "title": "Einfamilienhaus mit weitem Grundstück.",
    "type": "Haus",
    "kind": "Einfamilienhaus",
    "land": "ca. 1.300",
    "status": "sold",
    "features": [],
    "sourceRow": "1850588193",
    "image": "referenz-wangen-grundstueck",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-eislingen-erdgeschoss-77",
    "city": "Eislingen",
    "title": "Drei Zimmer im Erdgeschoss.",
    "type": "Wohnung",
    "kind": "3-Zimmer-Erdgeschosswohnung",
    "area": "77",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "3",
    "imageRole": "Grundriss aus dem zugehörigen Quelleneintrag",
    "status": "sold",
    "features": [
      "Balkon",
      "Tiefgaragenstellplatz",
      "Quellabbildung ist ein Grundriss"
    ],
    "sourceRow": "1707007673",
    "image": "referenz-eislingen-erdgeschoss-77",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-eislingen-erdgeschoss-garten",
    "city": "Eislingen",
    "title": "Erdgeschoss mit Garten und Küche.",
    "type": "Wohnung",
    "kind": "4-Zimmer-Erdgeschosswohnung",
    "area": "92",
    "year": "1998",
    "rooms": "4",
    "status": "sold",
    "features": [
      "60 m² Garten",
      "Tiefgaragenstellplatz laut historischem Inserat inklusive",
      "Küche laut historischem Inserat inklusive",
      "In der Quelle als hochwertig beschrieben"
    ],
    "sourceRow": "1808654679",
    "image": "referenz-eislingen-erdgeschoss-garten",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-muellheim",
    "city": "Müllheim",
    "title": "Mehrfamilienhaus mit Grundstück.",
    "type": "Haus",
    "kind": "Mehrfamilienhaus",
    "area": "180",
    "land": "1.275",
    "note": "Verkauft laut Quelle. Die Bebaubarkeit ist eine Angabe des historischen Inserats und wurde nicht unabhängig bestätigt. Ortsname laut Quelle: Müllheim.",
    "status": "sold",
    "features": [
      "Grundstück im historischen Inserat als bebaubar bezeichnet"
    ],
    "sourceRow": "1664756962",
    "image": "referenz-muellheim"
  },
  {
    "id": "referenz-ottenbach",
    "city": "Ottenbach",
    "title": "Drei Familien auf drei Etagen.",
    "type": "Haus",
    "kind": "Dreifamilienhaus",
    "area": "330",
    "land": "444",
    "status": "sold",
    "features": [
      "Wohnfläche auf drei Etagen verteilt"
    ],
    "sourceRow": "1695483978",
    "image": "referenz-ottenbach",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-murrhardt",
    "city": "Murrhardt",
    "title": "Zwei Zimmer als Kapitalanlage.",
    "type": "Wohnung",
    "kind": "2-Zimmer-Wohnung",
    "area": "ca. 49",
    "areaLabel": "Fläche laut Quelle",
    "rooms": "2",
    "status": "sold",
    "features": [
      "Balkon",
      "Stellplatz",
      "Historische Quellangabe: Oktober 2017",
      "In der Quelle als Kapitalanlage beschrieben"
    ],
    "sourceRow": "1774260965",
    "image": "referenz-murrhardt",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  },
  {
    "id": "referenz-goeppingen-zweifamilienhaus",
    "city": "Göppingen",
    "title": "Zwei Familien unter einem Dach.",
    "type": "Haus",
    "kind": "Zweifamilienhaus",
    "area": "120",
    "land": "490",
    "status": "sold",
    "features": [],
    "sourceRow": "1105700857",
    "image": "referenz-goeppingen-zweifamilienhaus",
    "note": "Auf der Quellseite ausdrücklich als verkauft gekennzeichnet. Referenz, kein verfügbares Angebot. Ausstattung, Zustand und Mietangaben stammen aus dem historischen Inserat."
  }
];
export const services = [
  { path:'/immobilien', number:'01', title:'Immobilien', line:'Räume für neue Kapitel.', description:'Eine Immobilie finden oder das eigene Objekt verkaufen. Wir begleiten Sie bei Ihrem nächsten Schritt.', link:'Immobilien entdecken' },
  { path:'/mietverwaltung', number:'02', title:'Mietverwaltung', line:'Eigentum, das Freiraum lässt.', description:'Wir unterstützen Kapitalanleger und vertreten ihre Angelegenheiten als Vermieter. Besprechen wir, welche Aufgaben Sie abgeben möchten.', link:'Mietverwaltung kennenlernen' },
  { path:'/finanzierung', number:'03', title:'Finanzierung', line:'Ein Fundament für Ihre Pläne.', description:'Baufinanzierung durch Kooperationen, auch mit regionalen Banken. Dazu Privatkredite und mögliche Zinsersparnisse durch Umschuldung.', link:'Über Finanzierung sprechen' },
  { path:'/vorsorge', number:'04', title:'Vorsorge', line:'Heute an morgen denken.', description:'Versorgungslücken bei Krankheit, Berufsunfähigkeit, Pflege und im Todesfall besprechen. Rentenlücken mit passender Altersvorsorge angehen.', link:'Vorsorge verstehen' }
];
