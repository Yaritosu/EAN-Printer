# EAN Label MVP Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a small web-based label printing MVP with manual input, live preview, PDF output, and a Windows-friendly print path.

**Architecture:** A single TypeScript web app separates business content, layout configuration, and rendering. Domain code validates EAN and layout constraints, application code builds a neutral render spec, and infrastructure renderers map the spec to preview and PDF.

**Tech Stack:** Next.js, React, TypeScript, Zod, React Hook Form, bwip-js, pdf-lib, Vitest, Testing Library

---

## File Structure

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/api/pdf/route.ts`
- Create: `src/domain/label/value-objects/ean13.ts`
- Create: `src/domain/label/value-objects/barcode-value.ts`
- Create: `src/domain/label/entities/label-content.ts`
- Create: `src/domain/label/entities/label-layout.ts`
- Create: `src/domain/label/entities/label-document.ts`
- Create: `src/domain/label/services/build-render-spec.ts`
- Create: `src/application/use-cases/build-preview.ts`
- Create: `src/application/use-cases/generate-pdf.ts`
- Create: `src/infrastructure/renderers/pdf/pdf-renderer.ts`
- Create: `src/ui/components/label-editor.tsx`
- Create: `src/ui/components/label-preview.tsx`
- Create: `src/ui/components/validation-summary.tsx`
- Create: `src/ui/defaults/default-layout.ts`
- Create: `src/lib/units.ts`
- Create: `tests/domain/ean13.test.ts`
- Create: `tests/domain/label-layout.test.ts`
- Create: `tests/domain/build-render-spec.test.ts`

## Chunk 1: Project Skeleton and Domain Tests

### Task 1: Scaffold project metadata

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Write the failing domain tests**
- [ ] **Step 2: Run tests to verify they fail because source files do not exist**
- [ ] **Step 3: Add project configuration and test runner setup**
- [ ] **Step 4: Run tests again and confirm they still fail for missing implementation**

### Task 2: Implement EAN value object with TDD

**Files:**
- Create: `tests/domain/ean13.test.ts`
- Create: `src/domain/label/value-objects/ean13.ts`

- [ ] **Step 1: Write failing tests for valid EAN, invalid length, non-digit content, and bad check digit**
- [ ] **Step 2: Run `npx vitest tests/domain/ean13.test.ts` and confirm expected failures**
- [ ] **Step 3: Implement minimal EAN validation**
- [ ] **Step 4: Re-run the test and confirm pass**

### Task 3: Implement layout validation with TDD

**Files:**
- Create: `tests/domain/label-layout.test.ts`
- Create: `src/domain/label/entities/label-layout.ts`
- Create: `src/lib/units.ts`

- [ ] **Step 1: Write failing tests for valid layout and invalid printable area**
- [ ] **Step 2: Run the test and verify failure**
- [ ] **Step 3: Implement minimal layout entity and validation**
- [ ] **Step 4: Re-run the test and confirm pass**

## Chunk 2: Render Spec and Preview Model

### Task 4: Build render spec with TDD

**Files:**
- Create: `tests/domain/build-render-spec.test.ts`
- Create: `src/domain/label/entities/label-content.ts`
- Create: `src/domain/label/entities/label-document.ts`
- Create: `src/domain/label/value-objects/barcode-value.ts`
- Create: `src/domain/label/services/build-render-spec.ts`

- [ ] **Step 1: Write failing tests that assert the render spec contains article name, optional SKU handling, and CODE128 barcode format**
- [ ] **Step 2: Run the test and verify failure**
- [ ] **Step 3: Implement the minimal render spec builder**
- [ ] **Step 4: Re-run the test and confirm pass**

### Task 5: Build preview UI

**Files:**
- Create: `src/ui/defaults/default-layout.ts`
- Create: `src/ui/components/label-editor.tsx`
- Create: `src/ui/components/label-preview.tsx`
- Create: `src/ui/components/validation-summary.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Build the page shell and form state**
- [ ] **Step 2: Connect live validation and render spec generation**
- [ ] **Step 3: Render a scaled label preview from the render spec**
- [ ] **Step 4: Add disable/enable rules for export actions**

## Chunk 3: PDF Generation and Printing Path

### Task 6: Add PDF generation use case

**Files:**
- Create: `src/application/use-cases/build-preview.ts`
- Create: `src/application/use-cases/generate-pdf.ts`
- Create: `src/infrastructure/renderers/pdf/pdf-renderer.ts`
- Create: `src/app/api/pdf/route.ts`

- [ ] **Step 1: Write or extend tests for render-spec-to-PDF assumptions where practical**
- [ ] **Step 2: Implement the PDF use case and renderer**
- [ ] **Step 3: Add the route that returns a PDF response**
- [ ] **Step 4: Connect the UI export flow**

### Task 7: Polish Windows-friendly print flow

**Files:**
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add open/download PDF action**
- [ ] **Step 2: Add print guidance text for local Windows printing**
- [ ] **Step 3: Validate the route and browser flow manually**

## Chunk 4: Verification

### Task 8: Verify the MVP

**Files:**
- Modify: `docs/superpowers/specs/2026-03-28-ean-label-mvp-design.md`
- Modify: `docs/superpowers/plans/2026-03-28-ean-label-mvp.md`

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: all domain tests pass

- [ ] **Step 2: Run application build**

Run: `npx next build`
Expected: successful production build

- [ ] **Step 3: Record any deviations or blocked environment issues in the final report**

Plan complete and saved to `docs/superpowers/plans/2026-03-28-ean-label-mvp.md`. Ready to execute.
