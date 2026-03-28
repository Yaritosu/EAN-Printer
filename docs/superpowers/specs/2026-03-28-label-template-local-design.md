# Local Label Templates Design

**Goal:** Add user-managed local label templates so layout definitions can be saved, loaded, updated, and deleted in the browser without introducing backend persistence.

## 1. Goal Understanding

This extension adds named, browser-local templates to the existing label composer MVP. A template represents reusable label layout settings only. It must not store product-specific business content such as EAN, SKU, or article name.

The purpose is operational efficiency: users can prepare recurring label formats such as `100x37.5 Standard`, `A6 Regal`, or `Promo klein` and switch between them without re-entering layout values.

## 2. Scope

### Included

- create a named template from the current layout
- list saved templates
- load a template into the current form
- update an existing template from the current layout
- delete a template
- keep storage local to the current browser via `localStorage`

### Excluded

- backend persistence
- user sharing
- version history
- permissions
- template import/export
- migration to database persistence

## 3. Domain Rules

- A `LabelTemplate` stores only presentation data.
- A template must never store:
  - EAN
  - SKU
  - article name
  - generated PDF content
- Template names are required.
- Template names are compared case-insensitively for uniqueness.
- Template creation and update require a valid `LabelLayout`.
- The system default layout remains available as reset behavior, not as a persisted user template.

## 4. Domain Model

### LabelTemplate

- `id: string`
- `name: string`
- `layout: LabelLayoutProps`
- `createdAt: string`
- `updatedAt: string`

### Template repository port

Responsibilities:

- list templates
- save new template
- update existing template
- delete template
- find by id
- find by normalized name

### Local storage adapter

First adapter implementation using:

- storage key: `ean-printer.templates.v1`

## 5. UX Rules

- Template actions affect only layout fields.
- Product input fields remain untouched when loading a template.
- The UI must clearly communicate that templates store only format and display configuration.
- Save and update must reject empty names and duplicate names.
- Delete should require an intentional action.

## 6. Architecture

### Domain

- template entity / validation

### Application

- create template
- update template
- delete template
- list templates

### Infrastructure

- localStorage adapter

### UI

- template manager strip or panel above layout controls

## 7. Risks

- accidentally storing product fields together with layout fields
- name collisions if uniqueness is not normalized
- hydration issues when reading `localStorage` on first render
- overcoupling template persistence to React form internals

## 8. Recommendation

Keep the feature intentionally small:

- browser-local only
- one template type
- no categories
- no history
- no import/export

This provides immediate value while preserving a clean seam for future database or API-backed template persistence.
