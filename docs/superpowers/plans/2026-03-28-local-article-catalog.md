# Local Article Catalog Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local browser-persistent article catalog with manual maintenance, CSV/XLSX import, and article selection for label creation.

**Architecture:** Introduce a dedicated article domain model and localStorage-backed repository, then wire article selection into the create flow and article management into its own tab. Import parses CSV/XLSX client-side into normalized article drafts before saving them to the local repository.

**Tech Stack:** Next.js, React, TypeScript, Vitest, localStorage, xlsx

---

## File Structure

- Create: `src/domain/articles/entities/article.ts`
- Create: `src/application/articles/article-repository.ts`
- Create: `src/application/articles/save-article.ts`
- Create: `src/application/articles/delete-article.ts`
- Create: `src/application/articles/list-articles.ts`
- Create: `src/application/articles/import-article-rows.ts`
- Create: `src/infrastructure/storage/local-storage-article-repository.ts`
- Create: `src/ui/components/article-manager.tsx`
- Create: `tests/articles/article.test.ts`
- Create: `tests/articles/local-storage-article-repository.test.ts`
- Create: `tests/articles/import-article-rows.test.ts`
- Modify: `package.json`
- Modify: `src/ui/components/label-editor.tsx`

## Chunk 1: Domain and persistence

### Task 1: Article domain model

- [ ] Write failing tests for required name, valid optional EAN, and trimmed optional SKU
- [ ] Run article tests and confirm failure
- [ ] Implement minimal article entity
- [ ] Re-run tests and confirm pass

### Task 2: Local article repository

- [ ] Write failing tests for save, update, delete, and unique SKU enforcement
- [ ] Run repository tests and confirm failure
- [ ] Implement localStorage repository and use cases
- [ ] Re-run tests and confirm pass

## Chunk 2: Import

### Task 3: Import normalization

- [ ] Write failing tests for CSV/XLSX row normalization into article drafts
- [ ] Run import tests and confirm failure
- [ ] Implement minimal import row normalization
- [ ] Re-run tests and confirm pass

## Chunk 3: UI integration

### Task 4: Create flow and article tab

- [ ] Add article selection dropdown in create tab
- [ ] Add article maintenance tab for manual creation/editing
- [ ] Add CSV/XLSX upload and import preview in article tab
- [ ] Keep layout/template flow isolated in layout tab

## Chunk 4: Verification

### Task 5: Verify end-to-end

- [ ] Run `npx vitest run`
- [ ] Run `npm run build`
- [ ] Verify create/article/layout flow locally
