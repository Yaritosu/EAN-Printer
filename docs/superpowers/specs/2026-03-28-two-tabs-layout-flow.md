# Two Tabs Layout Flow Design

**Goal:** Split the application into an operational label creation tab and a separate layout configuration tab, while making saved templates selectable directly during label creation.

## Scope

- add two tabs: `Etikett erstellen` and `Layout konfigurieren`
- creation tab gets a layout dropdown with built-in presets and saved templates
- selecting a layout immediately applies it to preview and PDF output
- configuration tab owns layout editing and template save/update/delete actions
- keep product fields separate from layout templates

## Explicit Assumption

- `A6 Label` is interpreted as `105 x 148 mm`

## UX Rules

- creation tab is optimized for daily use: select layout, enter EAN/SKU/article name, print
- configuration tab is optimized for format management: dimensions, fonts, barcode settings, save/update/delete
- templates affect only layout fields, never product fields
- active layout selection must be visible in the creation flow
