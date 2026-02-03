# Font & Header More Button Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update typography to Space Grotesk (display) + Work Sans (body) and align the header "More" button font sizing to match other nav items.

**Architecture:** Add global font imports and CSS variables in `src/styles/global.css`, then update body and headings to use these variables. Adjust header dropdown trigger font-size and padding to match nav links.

**Tech Stack:** Astro, global CSS, Google Fonts.

### Task 1: Add font imports and global font variables

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation; use manual verification.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes (baseline may fail; note failure if present)

**Step 3: Write minimal implementation**
Add the following at the very top of `global.css`, before `@font-face` rules:

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap");
```

Then add font variables in `:root`:

```css
  --font-display: "Space Grotesk", "Atkinson", system-ui, sans-serif;
  --font-sans: "Work Sans", "Atkinson", system-ui, sans-serif;
```

Apply fonts globally:

```css
body { font-family: var(--font-sans); }

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}
```

Optionally target header title if needed:

```css
header h2 a { font-family: var(--font-display); }
```

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes (or baseline failure unchanged)

**Step 5: Commit**
```bash
git add src/styles/global.css
git commit -m "style: update global typography to Space Grotesk and Work Sans"
```

### Task 2: Match header "More" button sizing to other nav buttons

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation; use manual verification.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes (baseline may fail)

**Step 3: Write minimal implementation**
Update `.dropdown-trigger` styles to match nav link sizing:
- Use `font-size: 0.9rem;`
- Ensure padding matches the nav link pill (`0.4rem 0.75rem`)

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes (or baseline failure unchanged)

**Step 5: Commit**
```bash
git add src/components/Header.astro
git commit -m "style: align dropdown trigger font sizing"
```

## Manual Verification Checklist
- Header "More" button font size visually matches other nav items.
- Body text uses Work Sans; headings use Space Grotesk.
- Light/dark modes remain readable and consistent.
