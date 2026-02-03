# Header Ceramic Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Astro header into a warm, minimal "ceramic" style with linear icons, subtle gradient texture, and calm interactions.

**Architecture:** Keep all changes scoped to `Header.astro` and `HeaderLink.astro`, using header-local CSS variables for warm neutrals and accent. Use named icon slots for inline SVG icons and a header background composed of layered gradients + a soft texture overlay.

**Tech Stack:** Astro components, scoped CSS, existing Atkinson font + optional remote serif import for header title.

### Task 1: Update HeaderLink to a minimal, text-forward pill with icon slot

**Files:**
- Modify: `src/components/HeaderLink.astro`

**Step 1: Write the failing test**
No automated UI tests exist in this repo. Skip test creation and use manual verification plus build validation.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes (baseline validation; no failures expected)

**Step 3: Write minimal implementation**
Update `HeaderLink.astro` to use a named `icon` slot and remove the current glassmorphism styling. Use a calm pill shape, subtle warm hover wash, and a tiny active indicator.

```astro
---
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"a"> {}

const { href, class: className, ...props } = Astro.props;
const pathname = Astro.url.pathname.replace(import.meta.env.BASE_URL, "");
const subpath = pathname.match(/[^\/]+/g);
const isActive = href === pathname || href === "/" + (subpath?.[0] || "");
const hasIcon = Astro.slots.has("icon");
---

<a href={href} class:list={[className, { active: isActive }]} {...props}>
  {hasIcon && (
    <span class="nav-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
  )}
  <span class="nav-text"><slot /></span>
</a>

<style>
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--header-text, rgb(var(--gray-dark)));
    border-radius: 999px;
    transition: color 0.2s ease, background 0.2s ease;
    position: relative;
  }

  a:hover {
    background: var(--header-hover, rgba(179, 106, 74, 0.08));
    color: var(--header-text-strong, rgb(var(--gray-dark)));
  }

  a:focus-visible {
    outline: 2px solid var(--header-accent, #b36a4a);
    outline-offset: 2px;
  }

  a.active {
    color: var(--header-accent, #b36a4a);
  }

  a.active::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -6px;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 999px;
    background: var(--header-accent, #b36a4a);
  }

  .nav-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
  }

  .nav-icon :global(svg) {
    width: 16px;
    height: 16px;
    stroke: currentColor;
  }
</style>
```

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes successfully

**Step 5: Commit**
```bash
git add src/components/HeaderLink.astro
git commit -m "refactor: simplify header link styling"
```

### Task 2: Redesign Header structure, palette, and background texture

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation and use manual verification plus build validation.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes

**Step 3: Write minimal implementation**
Restructure the header into left/center/right groups, add header-local CSS variables for warm neutrals and accent, and replace the header background with layered gradients + subtle texture overlay. Reduce glassmorphism, tune scroll state, and update mobile menu to a soft card surface.

```astro
<header>
  <nav>
    <div class="nav-left">
      <h2><a href="/">{SITE_TITLE}</a></h2>
    </div>

    <button class="hamburger" id="hamburgerBtn" aria-label="Toggle menu">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <div class="internal-links" id="mobileMenu">
      <HeaderLink href="/">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke-width="1.6">
          <path d="M3 11.5L12 4l9 7.5" />
          <path d="M6.5 10.5V20h11V10.5" />
        </svg>
        Home
      </HeaderLink>
      <!-- repeat for Blog/Projects/etc using line icons -->
    </div>

    <div class="nav-right">
      <div class="social-links">...</div>
      <ThemeToggle />
    </div>
  </nav>
</header>
```

```css
header {
  --header-bg: linear-gradient(180deg, rgba(251, 248, 244, 0.9), rgba(245, 240, 234, 0.85));
  --header-border: rgba(210, 191, 175, 0.55);
  --header-text: rgba(64, 54, 47, 0.9);
  --header-text-strong: rgba(48, 40, 34, 1);
  --header-accent: #b36a4a;
  --header-hover: rgba(179, 106, 74, 0.08);

  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  backdrop-filter: blur(10px) saturate(120%);
}

header::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    radial-gradient(rgba(120, 100, 90, 0.06) 1px, transparent 1px);
  background-size: 3px 3px, 6px 6px;
  opacity: 0.35;
  pointer-events: none;
}

header.scrolled {
  background: linear-gradient(180deg, rgba(251, 248, 244, 0.98), rgba(245, 240, 234, 0.95));
  border-bottom-color: rgba(200, 180, 165, 0.8);
}
```

Update the nav styles to remove the old glass pill styles and align spacing:
- Use `nav` with `max-width: 1180-1200px`, `height: 58px`.
- `.internal-links` gap `0.35-0.5rem`.
- `.social-links` icons size 16-18px.
- `.hamburger` aligned right; only visible <=720px.
- Mobile menu: warm card background, bigger radius, softer shadow, slower easing.

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes successfully

**Step 5: Commit**
```bash
git add src/components/Header.astro
git commit -m "style: redesign header to warm minimal ceramic"
```

### Task 3: Optional serif for site title (if desired)

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Write the failing test**
No automated UI tests exist. Skip test creation and use manual verification.

**Step 2: Run test to verify it fails**
Run: `npm run build`
Expected: build completes

**Step 3: Write minimal implementation**
Add a single font import for a warm serif and apply it only to `header h2 a`.

```css
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap");

header h2 a {
  font-family: "Fraunces", "Atkinson", serif;
  letter-spacing: 0.02em;
}
```

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: build completes successfully

**Step 5: Commit**
```bash
git add src/styles/global.css
git commit -m "style: add serif display font for header title"
```

## Manual Verification Checklist
- Desktop: header feels warm and minimal; links have subtle hover and tiny active dot.
- Mobile <= 720px: hamburger appears, menu slides down with soft card styling.
- Dark theme: text contrast remains readable; accent color is subdued.
- Keyboard: focus-visible ring is visible on nav items.

