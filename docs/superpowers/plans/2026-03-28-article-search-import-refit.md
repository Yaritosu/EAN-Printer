# Article Search and Import UX Refit Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the `Artikel` tab into a search-first article maintenance flow with clearer new/edit states and a richer import preview.

**Architecture:** Keep the existing local article repository and import normalization intact, but reshape the `Artikel` UI around search results and explicit edit context. Extend import preview data in the application layer so the component can show both valid sample rows and row-level errors without inventing new persistence behavior.

**Tech Stack:** Next.js, React, TypeScript, Vitest, localStorage, xlsx

---

## File Structure

- Modify: `src/ui/components/article-manager.tsx`
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/application/articles/import-article-rows.ts`
- Create: `tests/ui/article-manager-search.test.tsx`
- Modify: `tests/articles/import-article-rows.test.ts`
- Modify: `tests/ui/article-manager-reset.test.tsx`

## Chunk 1: Search-first article maintenance

### Task 1: Search and edit context

**Files:**
- Modify: `src/ui/components/article-manager.tsx`
- Modify: `src/ui/components/label-editor.tsx`
- Test: `tests/ui/article-manager-search.test.tsx`

- [ ] **Step 1: Write the failing test**

Create a test that renders the article tab, searches for a saved article, selects it from the inline result list, and verifies the edit form loads that article.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd vitest run tests/ui/article-manager-search.test.tsx`
Expected: FAIL because the article tab still uses a select instead of a search result flow.

- [ ] **Step 3: Write minimal implementation**

Replace the article select with a search field and result list, surface a visible `Neuer Artikel` / `Artikel bearbeiten` mode, and keep delete/reset behavior aligned with selected edit state.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx.cmd vitest run tests/ui/article-manager-search.test.tsx tests/ui/article-manager-reset.test.tsx`
Expected: PASS

## Chunk 2: Import preview improvements

### Task 2: Enrich preview data

**Files:**
- Modify: `src/application/articles/import-article-rows.ts`
- Modify: `src/ui/components/article-manager.tsx`
- Test: `tests/articles/import-article-rows.test.ts`

- [ ] **Step 1: Write the failing test**

Extend the import-row test so it expects both normalized valid sample rows and row-level errors suitable for preview.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd vitest run tests/articles/import-article-rows.test.ts`
Expected: FAIL because the current preview data only carries counts and messages.

- [ ] **Step 3: Write minimal implementation**

Return richer preview metadata from import normalization and show a compact preview section with sample valid rows plus error lines in the article manager.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx.cmd vitest run tests/articles/import-article-rows.test.ts`
Expected: PASS

## Chunk 3: Full verification

### Task 3: Verify the refit end-to-end

**Files:**
- Modify: `src/ui/components/article-manager.tsx`
- Modify: `src/ui/components/label-editor.tsx`
- Test: `tests/ui/article-manager-search.test.tsx`
- Test: `tests/ui/article-manager-reset.test.tsx`
- Test: `tests/articles/import-article-rows.test.ts`

- [ ] **Step 1: Run the full test suite**

Run: `npx.cmd vitest run`
Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm.cmd run build`
Expected: PASS

- [ ] **Step 3: Verify the local app**

Run: `(Invoke-WebRequest -UseBasicParsing 'http://localhost:3000').StatusCode`
Expected: `200`
