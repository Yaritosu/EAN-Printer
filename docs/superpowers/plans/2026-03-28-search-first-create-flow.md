# Search-First Create Flow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace article search dropdown selection with an inline search result flow, reset the manual article form after save, and generate realistic Elvent CSV/XLSX import fixtures.

**Architecture:** Keep the existing local article catalog and label form, but shift the create tab to a search-first selection component that reuses article filtering logic. Article maintenance stays in the dedicated `Artikel` tab. External Elvent data is fetched once to create import fixtures in project files, not at runtime in the app.

**Tech Stack:** Next.js, React, TypeScript, Vitest, localStorage, xlsx

---

## File Structure

- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/ui/components/article-manager.tsx`
- Modify: `src/application/articles/filter-articles.ts`
- Modify: `tests/articles/filter-articles.test.ts`
- Create: `tests/ui/article-manager-reset.test.tsx`
- Create: `tests/ui/label-editor-search-results.test.tsx`
- Create: `scripts/elvent-export.mjs`
- Create: `data/elvent-products.csv`
- Create: `data/elvent-products.xlsx`
- Modify: `package.json` if a script is helpful

## Chunk 1: Search-first create flow

### Task 1: Search result behavior

- [ ] Write a failing test for filtering and selecting from inline article search results
- [ ] Run the focused test and verify it fails for the expected reason
- [ ] Implement the minimal create-tab UI changes to remove the select and show clickable results
- [ ] Re-run the focused test and verify it passes

## Chunk 2: Manual article creation flow

### Task 2: Reset after save

- [ ] Write a failing test for clearing the article draft after a successful save interaction
- [ ] Run the focused test and verify it fails for the expected reason
- [ ] Implement the minimal article-form reset and keep saved articles available in the local list
- [ ] Re-run the focused test and verify it passes

## Chunk 3: Import fixtures

### Task 3: Elvent export files

- [ ] Fetch the current Elvent product payload from the published API
- [ ] Normalize products into import-friendly rows with `name`, `sku`, and `ean`
- [ ] Write CSV and XLSX fixture files into `data/`
- [ ] Spot-check the exported files for realistic diversity and valid formatting

## Chunk 4: Verification

### Task 4: Full verification

- [ ] Run `npx.cmd vitest run`
- [ ] Run `npm.cmd run build`
- [ ] Restart the local dev server if needed and verify `http://localhost:3000`
