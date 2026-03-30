# Import/API and Stellplatz-Label Design

## Goal

Den bisherigen Reiter `Artikel` in einen fachlich saubereren Reiter `Import/API` überführen, den lokalen Artikelpflegebereich entfernen, die Shopify-Anbindung vorbereiten und zusätzlich einen eigenständigen Reiter `Stellplatz-Label` für Lagerplatzetiketten ergänzen.

## Scope

Im Scope:
- Umbenennung des Tabs `Artikel` zu `Import/API`
- Entfernen des Bereichs `Artikel suchen und pflegen`
- Beibehalten und sprachliche Bereinigung des CSV-/Excel-Imports
- Neuer Bereich `Shopify-Verbindung` mit lokaler Speicherung der Konfiguration
- Neuer Reiter `Stellplatz-Label`
- Vorschau- und PDF-Fluss für Stellplatzlabels

Nicht im Scope:
- echter Shopify-API-Verbindungstest
- Abruf von Shopify-Produkten
- Persistente Stellplatz-Datenbank
- Mehrfachdruck / Druckhistorie

## Product Decision

### Import/API

Der neue Reiter `Import/API` bündelt zwei Themen:

1. `Shopify-Verbindung`
   - Erfassung einer vorbereitenden Konfiguration
   - Lokale Speicherung im Browser
   - Sichtbarer Status, dass die Verbindung vorbereitet, aber noch nicht getestet ist

2. `CSV / Excel Import`
   - Bestehender Import bleibt erhalten
   - Texte werden sprachlich bereinigt
   - Der Import bleibt vorerst unabhängig von Shopify

### Stellplatz-Label

Der neue Reiter dient dem Druck von Lagerplatz- bzw. Stellplatzlabels.

Die Eingabe erfolgt strukturiert über:
- Regal
- Block
- Ebene
- Fach
- Pfeilrichtung

Aus diesen Segmenten wird ein Stellplatzcode als String gebildet, z. B. `01-02-01-04`.

Die Pfeilrichtung ist:
- `ohne Pfeil`
- `Pfeil oben`
- `Pfeil unten`

Der Barcode-Inhalt ist im MVP der erzeugte Stellplatzcode als `Code 128`.

## Domain Model

### ShopifyConfig

- `shopDomain: string`
- `adminApiToken: string`
- `apiVersion: string`
- `status: "not_configured" | "configured"`
- `updatedAt: string`

Die Konfiguration ist rein vorbereitend. Ein Status `configured` bedeutet nur, dass genug Daten für einen späteren Test gespeichert wurden.

### LocationLabelContent

- `aisle: string`
- `block: string`
- `level: string`
- `bin: string`
- `locationCode: string`
- `arrow: "none" | "up" | "down"`

### LocationLabelDocument

- `content: LocationLabelContent`
- `layout: LabelLayout`

Für den MVP nutzen Produktlabels und Stellplatzlabels dieselbe Layoutbasis, aber getrennte Inhaltstypen.

## UX Flow

### Import/API

1. Benutzer öffnet `Import/API`
2. Bereich `Shopify-Verbindung` zeigt Felder für:
   - Shop-Domain
   - Admin API Token
   - API-Version
3. Benutzer kann speichern
4. UI zeigt: Verbindung vorbereitet, aber noch nicht getestet
5. Darunter bleibt der bekannte CSV-/Excel-Import

### Stellplatz-Label

1. Benutzer öffnet `Stellplatz-Label`
2. Gibt Regal, Block, Ebene und Fach ein
3. Wählt Pfeilrichtung
4. Vorschau aktualisiert sich live
5. PDF wird erzeugt

## Validation Rules

### Shopify

- Shop-Domain Pflichtfeld
- Token Pflichtfeld für gespeicherte Verbindung
- API-Version Pflichtfeld
- Status `configured` nur bei vollständigen Pflichtfeldern

### Stellplatz

- Alle vier Segmente Pflichtfelder
- Segmente werden als String behandelt
- Führende Nullen bleiben erhalten
- Der zusammengesetzte Code darf nicht leer sein
- Pfeil muss einer erlaubten Option entsprechen

## Architecture

### New Units

- `src/domain/shopify/entities/shopify-config.ts`
- `src/application/shopify/save-shopify-config.ts`
- `src/application/shopify/load-shopify-config.ts`
- `src/infrastructure/storage/local-storage-shopify-config-repository.ts`
- `src/ui/components/import-api-panel.tsx`
- `src/domain/location-label/...`
- `src/application/use-cases/build-location-label-preview.ts`
- `src/ui/components/location-label-editor.tsx`

### Integration Strategy

- `LabelEditor` bleibt die übergeordnete Tab-Steuerung
- Der bisherige `ArticleManager` wird aus dem Tab entfernt
- CSV-/Excel-Import wird in einen neuen `ImportApiPanel` verschoben oder dort integriert
- `LocationLabelEditor` kapselt den neuen Stellplatz-Label-Flow

## Error Handling

- Sichtbare Fehlermeldungen bleiben auf Deutsch
- Shopify-Konfiguration zeigt nur Validierungs- und Speicherfehler
- Keine irreführenden Aussagen über erfolgreiche Verbindung ohne echten API-Test
- Stellplatzlabel blockiert PDF-Erzeugung bei unvollständigen Segmenten

## Testing

Abzusichern sind mindestens:
- Tab-Namen und Reihenfolge
- Entfernen des Artikelpflegebereichs
- Sichtbarkeit des Shopify-Konfigurationsbereichs
- Lokales Speichern/Laden der Shopify-Konfiguration
- Stellplatzcode-Bildung
- Pfeiloptionen in Vorschau und PDF-Preview-Flow
- Deutsche UI-Texte ohne kaputte Umlaute
