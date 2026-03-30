# Preview Polish Design

## Ziel
Der Bereich `Etikett drucken` soll im ersten Blick klarer und hochwertiger wirken. Die Live-Vorschau soll die PDF-Ausgabe besser spiegeln, ohne dekorative Restflächen oder eine irreführende gestrichelte Linie durch Textbereiche.

## Scope
- Header- und Tab-Benennungen aktualisieren
- Hilfetext unter `Artikel suchen` entfernen
- Live-Vorschau optisch bereinigen
- Label mittig und etwas größer in der Vorschau platzieren
- Gestrichelte Linie nur noch um den Barcode-/EAN-Bereich anzeigen

## Nicht im Scope
- Neue Drucklogik
- Änderung des PDF-Renderers
- Änderung am Datenmodell
- Weitere Artikel- oder Importfunktionen

## UX-Regeln
- Produktname, SKU und Barcode bleiben Teil derselben Vorschau
- Das eigentliche Etikett hat eckige Außenkanten
- Der Vorschau-Hintergrund innerhalb der Karte bleibt weiß
- Die Vorschau soll ruhiger wirken als zuvor
- `Elvent Tools` ist die Produktmarke der Oberfläche
- `Label Manager` ist der Haupttitel
- Der primäre Arbeitsreiter heißt `Etikett drucken`

## Technische Leitlinie
- Vorschau und PDF bleiben weiter über dieselbe Render-Spezifikation gekoppelt
- Für die gestrichelte Linie wird eine separate Preview-Box verwendet, damit der Text nicht mehr optisch angeschnitten wird
