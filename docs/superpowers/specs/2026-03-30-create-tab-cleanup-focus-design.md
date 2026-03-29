# Create Tab Cleanup and Search Focus Design

**Goal:** Simplify the `Etikett erstellen` tab visually, remove low-value status text, start with empty label fields, and make the article search field the consistent working focus after common actions.

## Scope

- remove the descriptive subtitle under `EAN-Label MVP`
- remove the green validation success banner from the create tab
- remove the `Aktives Layout` info box
- start `EAN`, `Artikelname`, and `SKU` fields empty
- rename visible labels and messages to cleaner German text with umlauts
- change field order to `EAN`, `Artikelname`, `SKU (optional)`
- move `PDF erzeugen` under the live preview area
- remove the print-path helper text under the button
- improve select padding so the dropdown arrow spacing feels balanced
- make the article search input the default focus target after common interactions

## Focus Rules

The search field on the create tab becomes the primary operator input.
It should regain focus after:
- loading the page when the create tab is active
- selecting and clearing text elsewhere if focus naturally returns to the app
- generating a PDF
- finishing manual edits in label fields like EAN, Artikelname, or SKU
- other create-tab interactions where no modal or file picker takes over

## Constraints

- do not change article repository or import behavior in this step
- do not add new persistence
- keep PDF generation behavior the same apart from button placement and focus return
- error messages that are visible to the user should be German

## Recommendation

Treat this as a focused create-tab usability cleanup. The goal is not new functionality but a faster operator workflow with less visual noise and a predictable cursor position centered on article search.
