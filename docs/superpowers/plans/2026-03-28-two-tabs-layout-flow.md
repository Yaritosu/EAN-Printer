# Two Tabs Layout Flow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the label app into create/configure tabs and make saved layouts selectable directly in the create flow.

**Architecture:** Introduce layout option sources for built-in presets and saved templates, then let the editor maintain one active layout used by preview and PDF. The create tab uses the active layout operationally, while the configure tab owns persistence and editing.

**Tech Stack:** Next.js, React, TypeScript, Vitest

---

## File Structure

- Create: `src/ui/defaults/layout-presets.ts`
- Create: `tests/application/layout-presets.test.ts`
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/ui/components/template-manager.tsx`

## Chunk 1: Presets and selection logic

### Task 1: Add built-in layout presets

**Files:**
- Create: `src/ui/defaults/layout-presets.ts`
- Create: `tests/application/layout-presets.test.ts`

- [ ] **Step 1: Write failing tests for built-in presets including A6 Label and current standard label**
- [ ] **Step 2: Run `npx vitest run tests/application/layout-presets.test.ts` and confirm failure**
- [ ] **Step 3: Implement minimal preset source**
- [ ] **Step 4: Re-run the test and confirm pass**

## Chunk 2: UI split

### Task 2: Split editor into create/configure tabs

**Files:**
- Modify: `src/ui/components/label-editor.tsx`
- Modify: `src/ui/components/template-manager.tsx`

- [ ] **Step 1: Add tab state and two focused sections**
- [ ] **Step 2: Add layout dropdown in create tab with presets and saved templates**
- [ ] **Step 3: Make selection immediately apply active layout to preview and PDF**
- [ ] **Step 4: Keep template save/update/delete only in configure tab**

## Chunk 3: Verification

### Task 3: Verify behavior

- [ ] **Step 1: Run `npx vitest run`**
- [ ] **Step 2: Run `npm run build`**
- [ ] **Step 3: Verify local create/configure flow manually in dev app**
