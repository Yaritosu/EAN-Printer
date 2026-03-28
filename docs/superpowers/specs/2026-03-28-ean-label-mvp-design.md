# EAN Label MVP Design

**Goal:** Build a small, internally usable label printing MVP with manual input, configurable layout preview, PDF output, and a Windows-friendly printing path.

## 1. Goal Understanding

The MVP is a web application for manually composing and printing product labels. The user enters:

- EAN
- SKU (optional)
- article name

The user can then configure key layout parameters such as label size, font sizes, barcode size, margins, and basic alignment. The application renders a live preview and generates a PDF suitable for local printing on Windows.

This is intentionally **not** a full article master data or print history system. It is a focused label composer with a clean architecture that can later grow toward stored templates, database integration, REST APIs, CSV import, print history, and ZPL output.

## 2. Confirmed MVP Scope

### Included

- Manual entry of `ean`, `sku?`, and `articleName`
- EAN handling as a string with preserved leading zeros
- EAN validation for print eligibility
- Configurable label width and height in millimeters
- Configurable font sizes for article name and SKU
- Configurable barcode size
- Configurable margins and simple alignment
- Live layout preview
- PDF generation
- Practical Windows printability via PDF/browser print flow

### Prepared but not implemented

- CSV import
- Excel import
- REST integration
- database persistence
- stored product master data
- reprint history
- ZPL / Zebra direct output
- multiple saved templates
- batch print
- user roles
- deep audit logging

## 3. Domain Rules

### Identity and content rules

- `EAN` is the primary barcode-relevant content in the MVP.
- `EAN` is stored and validated as a **string**, never as a number.
- Leading zeros must never be dropped.
- `SKU` is optional and is a separate business field from EAN.
- `articleName` is display content and is separate from barcode content.

### Barcode rules

- The default printed barcode format is `CODE128`.
- The barcode payload is still always the `EAN` string.
- Therefore `CODE128` is a rendering format, not a business identifier.
- The system must not treat `CODE128` as an arbitrary free-text barcode in the MVP.
- A label is only printable when the EAN passes the agreed validation rules.

### Output rules

- Preview, PDF generation, and future ZPL output must be separated from business input models.
- Layout definition must remain separate from label content.
- PDF is the first output medium.
- Direct printer communication is not required in V1; the supported path is PDF generation plus local printing.

## 4. Explicit Assumptions

1. The MVP will start without a database.
2. Input is manual only in V1.
3. Only one active working template model is needed in V1, but its parameters are user-configurable.
4. EAN validation in V1 targets 13-digit numeric EAN values.
5. Windows support in V1 means practical local use in a browser on Windows, with printing via PDF/browser print flow.
6. Native direct printer access is deferred to a later desktop or local print adapter phase.
7. Drag-and-drop template editing is out of scope; V1 uses parameterized layout controls only.

## 5. Architecture

The MVP uses a modular single-codebase web architecture with clear boundaries:

### Domain layer

Owns:

- label content
- label layout
- barcode value rules
- EAN validation
- layout validation
- render specification building

This layer has no dependency on React or PDF tooling.

### Application layer

Owns use cases:

- validate label input
- build preview render specification
- generate PDF render data

This layer orchestrates domain objects and output renderers.

### Infrastructure layer

Owns adapters and renderers:

- preview mapping
- PDF renderer
- future ZPL renderer

### UI layer

Owns:

- manual input form
- layout controls
- preview panel
- PDF actions

## 6. Data and Rendering Separation

### Label content

Business content:

- article name
- optional SKU
- EAN

### Layout configuration

Presentation parameters:

- width
- height
- margins
- font sizes
- barcode dimensions
- alignment
- human-readable barcode text visibility

### Render spec

A neutral render model that describes what should be drawn and where. The same logical render spec should support:

- browser preview
- PDF output
- future ZPL output

## 7. UX Concept

### Main layout

- left: product input
- right: layout settings
- center or bottom: live preview

### UX principles

- immediate validation feedback
- immediate preview refresh on change
- visible warning when content overflows
- no hidden conversions
- print and PDF actions available only for valid labels

## 8. Printing and Windows Usage

For V1 the supported printing path is:

1. user enters content and layout
2. application shows preview
3. application generates a PDF
4. user prints via browser or PDF viewer on Windows

This keeps the MVP practical while avoiding unstable browser-side direct printer integrations.

## 9. Main Risks

- preview and PDF drifting apart if they do not share the same render spec
- silently coercing EAN to numeric values
- layout controls allowing impossible printable areas
- overbuilding template management too early
- tying barcode rules to one renderer instead of domain constraints

## 10. Recommendation for Implementation

Build the MVP as a TypeScript web app with:

- React/Next.js UI
- strict domain types
- shared render-spec builder
- server-side PDF generation
- browser-based Windows printing path

The first implementation should focus on:

1. EAN validation
2. content/layout separation
3. preview fidelity
4. PDF generation
5. keeping the extension seam for future renderers
