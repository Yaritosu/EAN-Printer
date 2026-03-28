# Search-First Create Flow and Local Import Fixtures Design

**Goal:** Make article selection in the create flow search-first and autocomplete-like, streamline manual article creation for rapid repeated entry, and provide realistic CSV/XLSX import fixtures from Elvent.

## Scope

- replace article search + select combination with a single search field and inline result list
- selecting a search result immediately applies the article to the active label draft
- keep manual overrides for EAN, SKU, and article name after selection
- reset the manual article form after a successful save so the next article can be entered quickly
- keep newly saved articles immediately available in local search results
- generate CSV and XLSX import fixtures from the current Elvent product API payload

## Domain Rules

- article selection remains independent from layout selection
- search matches against article name, optional SKU, and optional EAN
- selected search result becomes the active source article for the label, but label fields remain editable afterward
- manual article creation writes into the same local article catalog used by search and import
- after a successful manual save, the draft form resets to empty values and edit mode ends
- import fixtures are test data only and do not become a hard-coded system catalog

## UX Recommendation

Use a single search entry in `Etikett erstellen` with these behaviors:
- typing immediately filters local articles
- matching articles appear in a compact result panel directly under the search field
- clicking a result selects it and applies its values into the label form
- the extra select dropdown is removed entirely
- the selected article remains visible as a compact context card

Use the `Artikel` tab as the maintenance workspace:
- saved article list remains available for editing
- manual create/edit form is clearly separated from import
- successful save returns the form to a fresh-entry state so repeated creation feels fast

## Risks and Constraints

- browser-local storage means the article catalog is device-local and not multi-user
- Elvent API data may contain missing or non-importable values, so fixture generation should normalize fields conservatively
- XLSX generation depends on the existing `xlsx` package and should stay outside the runtime product flow
