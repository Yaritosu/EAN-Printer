# Preview-PDF Layout Parity Design

**Goal:** Make the live HTML preview use the same layout metrics as the PDF renderer so the on-screen label matches the printed/PDF result much more closely.

## Scope

- introduce shared layout metrics
- move text and barcode placement rules into one shared builder
- let PDF and preview consume the same computed positions
- keep the existing render spec as the business-facing input

## Core Rule

Preview and PDF must not each invent their own spacing and placement logic. They may render through different technologies, but they must read the same computed layout model.

## Shared Layout Model

The new layout metrics should contain:

- label width and height
- content box dimensions
- barcode box position and size
- text rows with exact y positions
- text alignment and font size
- reserved area for human-readable EAN

## Expected Outcome

- article name, SKU, and barcode block align much closer between preview and PDF
- removing one-off CSS stacking behavior from the preview
- future ZPL can later consume the same placement model
