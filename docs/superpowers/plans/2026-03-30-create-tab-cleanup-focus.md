# Create Tab Cleanup and Search Focus Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the create tab UI, remove unnecessary informational blocks, switch visible messaging to cleaner German, and make the article search field the consistent working focus.

**Architecture:** Keep the current create flow and domain logic intact, but simplify the rendered UI and move operator focus management into the create-tab component. Visible validation and default field states are adjusted without changing storage or PDF semantics.

**Tech Stack:** Next.js, React, TypeScript, react-hook-form, Vitest

---

## File Structure

- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/ui/components/validation-summary.tsx`
- Modify: `src/domain/label/value-objects/ean13.ts`
- Modify: `tests/ui/label-editor-search-results.test.tsx`
- Create: `tests/ui/create-tab-cleanup.test.tsx`
- Modify: `tests/domain/ean13.test.ts`

## Chunk 1: UI cleanup and default state

### Task 1: Remove noise and empty the form

**Files:**
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/ui/components/validation-summary.tsx`
- Test: `tests/ui/create-tab-cleanup.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that verifies the create tab starts without subtitle text, without the green success banner, without the active-layout box, and with empty `EAN`, `Artikelname`, and `SKU (optional)` fields in the new order.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd vitest run tests/ui/create-tab-cleanup.test.tsx`
Expected: FAIL because the current UI still renders the removed informational blocks and prefilled field values.

- [ ] **Step 3: Write minimal implementation**

Remove the subtitle and low-value create-tab info boxes, suppress the success banner, update labels/order, and start the label fields empty.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx.cmd vitest run tests/ui/create-tab-cleanup.test.tsx`
Expected: PASS

## Chunk 2: German copy and focus handling

### Task 2: Search-focus workflow

**Files:**
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/domain/label/value-objects/ean13.ts`
- Test: `tests/ui/label-editor-search-results.test.tsx`
- Test: `tests/domain/ean13.test.ts`

- [ ] **Step 1: Write the failing test**

Extend UI tests to verify the create-tab search field receives focus on load and regains focus after selection, manual field edits, and PDF generation triggers. Update domain tests to expect German EAN validation messages.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd vitest run tests/ui/label-editor-search-results.test.tsx tests/domain/ean13.test.ts`
Expected: FAIL because focus is not yet managed centrally and validation text is still partly English.

- [ ] **Step 3: Write minimal implementation**

Add a ref-based focus strategy for the article search field, move the PDF button under the live preview, remove the print-path helper text, rename visible labels to German with umlauts, and translate user-visible validation messages.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx.cmd vitest run tests/ui/label-editor-search-results.test.tsx tests/domain/ean13.test.ts tests/ui/create-tab-cleanup.test.tsx`
Expected: PASS

## Chunk 3: Final verification and publish

### Task 3: Verify and publish

**Files:**
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/ui/components/validation-summary.tsx`
- Modify: `src/domain/label/value-objects/ean13.ts`
- Test: `tests/ui/create-tab-cleanup.test.tsx`
- Test: `tests/ui/label-editor-search-results.test.tsx`
- Test: `tests/domain/ean13.test.ts`

- [ ] **Step 1: Run the full test suite**

Run: `npx.cmd vitest run`
Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm.cmd run build`
Expected: PASS

- [ ] **Step 3: Verify the local app**

Run: `(Invoke-WebRequest -UseBasicParsing 'http://localhost:3000').StatusCode`
Expected: `200`

- [ ] **Step 4: Commit and push**

Run:
- `git add .`
- `git commit -m "refactor: simplify create tab workflow"`
- `git push`
