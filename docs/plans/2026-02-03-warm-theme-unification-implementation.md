# Warm Theme Unification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify the site's visual language into a light warm palette with a pill-based UI system and replace remaining blue accents.

**Architecture:** Centralize warm palette tokens and common UI utilities in `src/styles/global.css`, then update header controls and page/component styles to use these tokens and pill classes. Keep changes CSS-focused with minimal markup edits.

**Tech Stack:** Astro components, scoped CSS, global CSS tokens.

### Task 1: Define warm theme tokens and pill/card utilities

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation; use manual verification and build check.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes (baseline may fail; note failure if present)

**Step 3: Write minimal implementation**
Add warm tokens and utility classes near `:root` and global styles. Example:

```css
:root {
  --paper: #f8f3ee;
  --paper-2: #f2ece4;
  --ink: 48, 40, 34;
  --ink-muted: 86, 75, 66;
  --accent: #b36a4a;
  --accent-dark: #8f4f36;
  --accent-rgb: 179, 106, 74;
  --border-soft: rgba(190, 170, 155, 0.45);
  --shadow-soft: 0 10px 24px rgba(38, 30, 25, 0.08);
}

[data-theme="dark"] {
  --paper: #1f1a18;
  --paper-2: #2a2421;
  --ink: 234, 225, 216;
  --ink-muted: 196, 182, 170;
  --accent: #d6a07f;
  --accent-dark: #b57c5e;
  --accent-rgb: 214, 160, 127;
  --border-soft: rgba(120, 100, 90, 0.4);
  --shadow-soft: 0 14px 28px rgba(0, 0, 0, 0.4);
}

body {
  background: linear-gradient(180deg, var(--paper), var(--paper-2)) no-repeat;
  background-color: var(--paper);
  color: rgb(var(--ink));
}

a { color: var(--accent); }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: rgba(var(--accent-rgb), 0.08);
  color: var(--accent);
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.pill--solid {
  background: var(--accent);
  color: #fff;
}

.pill--outline {
  background: transparent;
  border-color: var(--border-soft);
  color: rgb(var(--ink));
}

.card-soft {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-soft);
  border-radius: 16px;
}

[data-theme="dark"] .card-soft {
  background: rgba(35, 30, 27, 0.7);
}
```

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes (if baseline fails, note unchanged failure)

**Step 5: Commit**
```bash
git add src/styles/global.css
git commit -m "style: add warm theme tokens and pill utilities"
```

### Task 2: Align header "More" button with pill styling

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation; use manual verification.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes (baseline may fail)

**Step 3: Write minimal implementation**
Apply `pill` class to the More button and align padding/radius with nav links. Remove conflicting styles on `.dropdown-trigger` if needed so it inherits pill styling.

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes (or baseline failure unchanged)

**Step 5: Commit**
```bash
git add src/components/Header.astro
git commit -m "style: align header dropdown trigger with pills"
```

### Task 3: Replace page/component accent usage with warm tokens and pill classes

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/resume.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/uses.astro`
- Modify: `src/pages/guestbook.astro`
- Modify: `src/pages/bookmarks.astro`
- Modify: `src/pages/now.astro`
- Modify: `src/pages/keys.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/components/BlogCard.astro`
- Modify: `src/components/TagSidebar.astro`
- Modify: `src/components/PersonalProfile.astro`
- Modify: `src/components/ShareButtons.astro`
- Modify: `src/components/RelatedPosts.astro`
- Modify: `src/components/BlogSearch.astro`
- Modify: `src/components/TableOfContents.astro`
- Modify: `src/components/Footer.astro`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation; use manual verification.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes (baseline may fail)

**Step 3: Write minimal implementation**
Update class names to use `pill`/`pill--solid`/`pill--outline` where appropriate, replace blue gradient backgrounds with the warm tokens, and swap any `rgba(var(--accent-rgb, 68, 115, 238), ...)` with `rgba(var(--accent-rgb), ...)`. Ensure borders and highlights use `--border-soft` and `--accent`.

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes (or baseline failure unchanged)

**Step 5: Commit**
```bash
git add src/pages src/components
git commit -m "style: unify pages with warm theme and pill system"
```

## Manual Verification Checklist
- No remaining blue accents; all links/buttons use warm accent.
- Header dropdown trigger matches other nav items.
- Pills look consistent on buttons/tags.
- Cards and sidebars use soft warm surfaces.
- Light/dark modes remain readable.
