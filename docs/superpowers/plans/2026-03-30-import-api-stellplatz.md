# Import/API and Stellplatz-Label Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den Artikel-Tab in einen Import/API-Tab umbauen, Shopify-Konfiguration lokal speicherbar vorbereiten und einen neuen Stellplatz-Label-Reiter mit Vorschau und PDF-Fluss ergänzen.

**Architecture:** Die bestehende `LabelEditor`-Shell bleibt bestehen, bekommt aber neue Tab-Inhalte. Shopify-Konfiguration und Stellplatzlabel erhalten eigene kleine Domänen- und UI-Bausteine, damit Produktlabel, Integrationen und Lagerplatzlabels sauber getrennt bleiben.

**Tech Stack:** Next.js, React, TypeScript, react-hook-form, zod, Vitest, lokale Browser-Persistenz via localStorage.

---

## Chunk 1: Spec-aligned test coverage

### Task 1: Add failing UI tests for new tabs and Import/API content

**Files:**
- Modify: `tests/ui/create-tab-cleanup.test.tsx`
- Create: `tests/ui/import-api-tab.test.tsx`
- Create: `tests/ui/location-label-tab.test.tsx`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run the focused tests to verify they fail**
  Run: `npx.cmd vitest run tests/ui/import-api-tab.test.tsx tests/ui/location-label-tab.test.tsx`

### Task 2: Add failing domain/storage tests for Shopify config and location labels

**Files:**
- Create: `tests/shopify/local-storage-shopify-config-repository.test.ts`
- Create: `tests/location-label/location-label.test.ts`
- Create: `tests/location-label/build-location-label-preview.test.ts`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run the focused tests to verify they fail**
  Run: `npx.cmd vitest run tests/shopify/local-storage-shopify-config-repository.test.ts tests/location-label/location-label.test.ts tests/location-label/build-location-label-preview.test.ts`

## Chunk 2: Shopify configuration foundation

### Task 3: Add Shopify config domain and local storage adapter

**Files:**
- Create: `src/domain/shopify/entities/shopify-config.ts`
- Create: `src/application/shopify/load-shopify-config.ts`
- Create: `src/application/shopify/save-shopify-config.ts`
- Create: `src/application/shopify/shopify-config-repository.ts`
- Create: `src/infrastructure/storage/local-storage-shopify-config-repository.ts`

- [ ] **Step 1: Implement the minimal code to pass the repository tests**
- [ ] **Step 2: Run the focused Shopify tests**

### Task 4: Add Import/API panel UI

**Files:**
- Create: `src/ui/components/import-api-panel.tsx`
- Modify: `src/ui/components/label-editor.tsx`

- [ ] **Step 1: Implement the new tab content with Shopify fields and retained CSV/Excel import**
- [ ] **Step 2: Remove the old article maintenance area from the tab**
- [ ] **Step 3: Run the focused Import/API UI tests**

## Chunk 3: Stellplatz-Label flow

### Task 5: Add location-label domain and preview builder

**Files:**
- Create: `src/domain/location-label/entities/location-label.ts`
- Create: `src/application/use-cases/build-location-label-preview.ts`

- [ ] **Step 1: Implement location code composition and validation**
- [ ] **Step 2: Reuse the existing preview/render model where sensible**
- [ ] **Step 3: Run the focused location-label tests**

### Task 6: Add Stellplatz-Label editor UI

**Files:**
- Create: `src/ui/components/location-label-editor.tsx`
- Modify: `src/ui/components/label-editor.tsx`

- [ ] **Step 1: Add the new tab between Etikett drucken and Import/API**
- [ ] **Step 2: Implement fields for Regal, Block, Ebene, Fach, Pfeilrichtung**
- [ ] **Step 3: Show live preview and PDF action using the location-label preview**
- [ ] **Step 4: Run the focused Stellplatz-Label UI tests**

## Chunk 4: Polish, verification, and delivery

### Task 7: Text cleanup and integration pass

**Files:**
- Modify: any touched UI/test files with visible German text

- [ ] **Step 1: Ensure all visible texts use correct ÄÖÜ spelling**
- [ ] **Step 2: Remove no-longer-used article-maintenance code paths if orphaned**

### Task 8: Full verification

**Files:**
- Verify entire workspace

- [ ] **Step 1: Run the full test suite**
  Run: `npx.cmd vitest run`
- [ ] **Step 2: Run production build**
  Run: `npm.cmd run build`
- [ ] **Step 3: Restart/check local dev server if needed**
  Run: approved dev reset command, then `Invoke-WebRequest`

### Task 9: Commit and push

**Files:**
- Stage all modified files in this chunk

- [ ] **Step 1: `git add ...`**
- [ ] **Step 2: `git commit -m "feat: add import api and location label flows"`**
- [ ] **Step 3: `git push -u origin main`**
