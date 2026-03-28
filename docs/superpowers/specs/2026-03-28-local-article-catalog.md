# Local Article Catalog Design

**Goal:** Add a browser-local article catalog that supports manual article creation, CSV/XLSX import, and article selection during label creation.

## Scope

- local browser-persistent article catalog
- manual article creation and editing
- CSV/XLSX import into local catalog
- article selection in label creation flow
- keep label layout/template concerns separated from article master data

## Domain Rules

- `articleId` is the internal primary identifier
- `name` is required
- `sku` is optional but unique when present
- `ean` is optional but must be valid when present
- leading zeros in `ean` must be preserved
- articles may exist without EAN, but labels that need EAN stay blocked until one exists

## UX Recommendation

Use three tabs:
- `Etikett erstellen`
- `Artikel`
- `Layout konfigurieren`

The `Artikel` tab contains both manual maintenance and import. This keeps the app focused and avoids turning the create flow into a mini master-data backend.
