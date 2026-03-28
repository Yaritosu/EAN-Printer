# Article Search and Import UX Refit Design

**Goal:** Upgrade the `Artikel` tab into a search-first maintenance workflow with clearer edit/new states and a more useful import preview.

## Scope

- replace the stored-article select with a search field and inline result list
- allow selecting an existing article for editing from search results
- keep a clear distinction between `Neuer Artikel` and `Artikel bearbeiten`
- keep manual article creation fast for repeated entry
- enrich import preview beyond counts with visible valid rows and visible row errors
- prepare optional error-file download without introducing server persistence

## Out of Scope

- no server database
- no REST sync
- no full column-mapping UI
- no article variants or multiple EANs per article yet
- no bulk-edit workflow for existing articles

## Domain Rules

- the local browser catalog remains the single source of truth for the MVP
- `articleId` stays the internal identifier
- `sku` remains optional but unique when set
- `ean` remains optional and string-based
- import may contain partial failures; valid rows and errors must be separated visibly
- importing data must not silently overwrite existing articles without going through the normal article save rules

## UX Recommendation

Split the `Artikel` tab into three clear blocks:

1. `Artikel suchen`
- one search field for name, SKU, and EAN
- result list directly below the field
- clicking a result loads it into the edit form
- no old-school select control

2. `Artikel bearbeiten / neu anlegen`
- explicit mode label: `Neuer Artikel` or `Artikel bearbeiten`
- same three core fields: name, SKU, EAN
- `Speichern`, `Neu beginnen`, `Loeschen`
- after saving a new article, return to a fresh form state
- after loading an existing article, keep edit context visible

3. `Import CSV / Excel`
- upload control
- import preview card with:
  - source file name
  - valid row count
  - error row count
  - sample of valid rows
  - sample of row-level errors
- optional download of a generated error CSV can be added locally later without changing the data model

## Risks and Constraints

- keeping everything in browser storage means imports are device-local only
- import preview must stay compact enough to avoid turning the tab into a spreadsheet clone
- article search and article create flows should feel similar to the create-label search flow, but must not duplicate code blindly inside one giant component

## Recommendation

Implement this as a focused UI refit, not a domain rewrite. Reuse the existing article repository and import normalization, but improve presentation and selection flow so article maintenance feels like part of the same product instead of a separate admin stub.
