# SFEP Content and Role UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the SFEP page copy and Role UI so the project reads as an accurately designed and benchmarked Smart Factory backend without repeated content.

**Architecture:** Keep the static HTML structure and shared stylesheet. Modify only the SFEP-specific content and CSS selectors, preserving shared components used by other project pages.

**Tech Stack:** Static HTML, CSS, existing Node.js link checker, local browser visual verification.

## Global Constraints

- Preserve the existing visual system, card components, colors, and responsive behavior.
- Do not modify ARCANE or RPS content.
- Keep Role free of quantitative results.
- Keep quantitative results in Project Highlights and Improvements.
- Avoid fixed Role card heights that create empty space.

---

### Task 1: Add content assertions for the requested SFEP copy

**Files:**
- Modify: `scripts/check-links.mjs`
- Test: `scripts/check-links.mjs`

**Interfaces:**
- Consumes: `projects/sfep.html`
- Produces: validation failures when required copy is absent or removed copy remains

- [ ] **Step 1: Add SFEP copy assertions**

Add exact assertions for:

- Project Summary appearing before Manufacturing Problem
- `Storage / Alert 독립 처리`
- `로컬 Benchmark 최대 처리량`
- corrected Event-Driven Architecture summary
- corrected Consumer/Partition statement
- corrected Demo title and description
- absence of `Swing Event Bus`
- corrected Consumer Group reasons

- [ ] **Step 2: Run the checker and confirm failure**

Run: `npm run check`

Expected: FAIL because the current SFEP copy has not yet been updated.

### Task 2: Refine SFEP content structure and wording

**Files:**
- Modify: `projects/sfep.html`
- Test: `scripts/check-links.mjs`

**Interfaces:**
- Consumes: existing SFEP sections and shared components
- Produces: reordered Overview and corrected Role, Highlights, flows, Demo, Tech Stack, Benchmark, and Why Technology copy

- [ ] **Step 1: Reorder and shorten Overview**

Move Project Summary before Manufacturing Problem and replace it with the approved three-paragraph copy.

- [ ] **Step 2: Update Role copy**

Use the six approved role descriptions with no quantitative results.

- [ ] **Step 3: Correct technical wording**

Update Highlights, Event-Driven Architecture, Consumer Group, Rolling Window, Demo, Tech Stack, Benchmark Strategy, and Why Technology exactly as specified in the design document.

- [ ] **Step 4: Run content assertions**

Run: `npm run check`

Expected: PASS.

### Task 3: Improve the SFEP Role UI

**Files:**
- Modify: `assets/styles.css`
- Modify: `projects/sfep.html`
- Test: browser visual verification

**Interfaces:**
- Consumes: `.role-impact-list`, `.role-impact-body`, and SFEP page scope
- Produces: compact two-column Role cards on desktop and one-column cards on mobile

- [ ] **Step 1: Add SFEP-scoped Role card styling**

Use `.sfep-detail #role` selectors to:

- keep a two-column grid on desktop
- remove forced card height
- align content at the top
- reduce vertical padding
- replace the oversized title pill with a compact heading and blue accent line
- keep description immediately below the heading

- [ ] **Step 2: Preserve mobile layout**

At the existing mobile breakpoint, switch the Role list to one column and keep readable padding and wrapping.

- [ ] **Step 3: Update stylesheet cache key**

Change the SFEP stylesheet query string so the browser loads the new CSS.

### Task 4: Verify content and responsive layout

**Files:**
- Test: `projects/sfep.html`
- Test: `assets/styles.css`

**Interfaces:**
- Consumes: updated static page
- Produces: evidence that content checks and visual layout pass

- [ ] **Step 1: Run the full repository check**

Run: `npm run check`

Expected: `OK: checked 7 HTML files.`

- [ ] **Step 2: Verify removed phrases**

Run searches confirming that old Summary ordering, `Swing Event Bus`, the absolute isolation wording, and the inaccurate Consumer/Partition statement are absent.

- [ ] **Step 3: Inspect desktop layout**

Open the local SFEP page at a desktop viewport and confirm:

- Role cards form three balanced rows and two columns
- headings start near the top edge
- no large blank area appears above headings
- descriptions wrap without overflow

- [ ] **Step 4: Inspect mobile layout**

Open the local SFEP page at a mobile viewport and confirm:

- Role cards form one column
- card text does not overflow
- Overview block order remains clear
