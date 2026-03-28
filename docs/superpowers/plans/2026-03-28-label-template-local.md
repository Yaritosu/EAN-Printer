# Local Label Templates Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add named browser-local label templates that store only layout settings and integrate them into the existing label editor.

**Architecture:** Introduce a small template domain model and a localStorage-backed repository behind an application-facing interface. The UI uses this repository through focused hooks and components so future persistence can switch to API or database storage without reshaping the editor.

**Tech Stack:** Next.js, React, TypeScript, Vitest, localStorage

---

## File Structure

- Create: `src/domain/templates/entities/label-template.ts`
- Create: `src/application/templates/template-repository.ts`
- Create: `src/application/templates/list-templates.ts`
- Create: `src/application/templates/save-template.ts`
- Create: `src/application/templates/delete-template.ts`
- Create: `src/infrastructure/storage/local-storage-template-repository.ts`
- Create: `src/ui/components/template-manager.tsx`
- Create: `tests/templates/label-template.test.ts`
- Create: `tests/templates/local-storage-template-repository.test.ts`
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `docs/superpowers/specs/2026-03-28-label-template-local-design.md`

## Chunk 1: Domain and Repository

### Task 1: Template domain rules

**Files:**
- Create: `tests/templates/label-template.test.ts`
- Create: `src/domain/templates/entities/label-template.ts`

- [ ] **Step 1: Write failing tests for required name, normalized uniqueness helper, and layout-only template creation**
- [ ] **Step 2: Run `npx vitest run tests/templates/label-template.test.ts` and confirm failure**
- [ ] **Step 3: Implement minimal template entity**
- [ ] **Step 4: Re-run the test and confirm pass**

### Task 2: localStorage repository

**Files:**
- Create: `tests/templates/local-storage-template-repository.test.ts`
- Create: `src/application/templates/template-repository.ts`
- Create: `src/application/templates/list-templates.ts`
- Create: `src/application/templates/save-template.ts`
- Create: `src/application/templates/delete-template.ts`
- Create: `src/infrastructure/storage/local-storage-template-repository.ts`

- [ ] **Step 1: Write failing tests for list, save, duplicate-name rejection, update, and delete**
- [ ] **Step 2: Run `npx vitest run tests/templates/local-storage-template-repository.test.ts` and confirm failure**
- [ ] **Step 3: Implement minimal repository and use cases**
- [ ] **Step 4: Re-run the test and confirm pass**

## Chunk 2: UI Integration

### Task 3: Add template manager UI

**Files:**
- Create: `src/ui/components/template-manager.tsx`
- Modify: `src/ui/components/label-editor.tsx`

- [ ] **Step 1: Add a small UI for create, load, update, delete, and reset**
- [ ] **Step 2: Ensure only layout values are applied when loading a template**
- [ ] **Step 3: Add explanatory text that templates do not store product content**
- [ ] **Step 4: Keep the existing preview and PDF flow intact**

## Chunk 3: Verification

### Task 4: Verify feature

**Files:**
- Modify: `docs/superpowers/specs/2026-03-28-label-template-local-design.md`
- Modify: `docs/superpowers/plans/2026-03-28-label-template-local.md`

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: all tests pass

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: successful production build

- [ ] **Step 3: Note any environment-specific caveats in the final report**

Plan complete and saved to `docs/superpowers/plans/2026-03-28-label-template-local.md`. Ready to execute?
