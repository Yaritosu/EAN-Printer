# Preview PDF Layout Parity Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared layout metrics builder so the live preview and PDF renderer use the same placement rules.

**Architecture:** Keep the business render spec as input, then derive one shared geometry model that both the HTML preview and PDF renderer consume. This removes duplicated spacing logic and reduces drift between screen and PDF.

**Tech Stack:** Next.js, React, TypeScript, Vitest, pdf-lib

---

## File Structure

- Create: `src/domain/label/services/build-layout-metrics.ts`
- Create: `tests/domain/build-layout-metrics.test.ts`
- Modify: `src/infrastructure/renderers/pdf/pdf-renderer.ts`
- Modify: `src/ui/components/label-preview.tsx`

## Chunk 1: Shared Metrics

### Task 1: Build layout metrics with TDD

**Files:**
- Create: `tests/domain/build-layout-metrics.test.ts`
- Create: `src/domain/label/services/build-layout-metrics.ts`

- [ ] **Step 1: Write failing tests for text row placement, barcode placement, and reserved human-readable EAN space**
- [ ] **Step 2: Run `npx vitest run tests/domain/build-layout-metrics.test.ts` and confirm failure**
- [ ] **Step 3: Implement minimal shared metrics builder**
- [ ] **Step 4: Re-run the test and confirm pass**

## Chunk 2: Renderer Alignment

### Task 2: Use shared metrics in PDF and preview

**Files:**
- Modify: `src/infrastructure/renderers/pdf/pdf-renderer.ts`
- Modify: `src/ui/components/label-preview.tsx`

- [ ] **Step 1: Update PDF renderer to draw from shared metrics only**
- [ ] **Step 2: Update preview to render from the same metrics only**
- [ ] **Step 3: Keep the barcode source and text content unchanged**

## Chunk 3: Verification

### Task 3: Verify parity refactor

- [ ] **Step 1: Run `npx vitest run`**
- [ ] **Step 2: Run `npm run build`**
- [ ] **Step 3: Confirm the dev preview visually after refresh**
