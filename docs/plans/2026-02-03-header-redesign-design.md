# Header Redesign (Warm Minimal "Ceramic" Style)

Date: 2026-02-03

## Goals
- Redesign the site header to feel minimal, warm, and intentional.
- Replace emoji nav icons with thin linear SVG icons.
- Use a subtle warm gradient + light texture for the header background.
- Keep the header functional across desktop and mobile, with calm motion.

## Non-Goals
- No global typography overhaul beyond the header title and nav styling.
- No changes to content structure outside the header component.

## Visual Direction
- Style: warm minimal, quiet editorial.
- Palette: ivory to warm gray gradient with a muted terracotta accent.
- Texture: light noise overlay for a ceramic glaze feel (low opacity).
- Emphasis: restrained active state (hairline underline or tiny dot).

## Architecture
- Scope: `src/components/Header.astro` and `src/components/HeaderLink.astro`.
- Header remains a fixed bar with three zones:
  - Left: site title.
  - Center/left-center: internal nav.
  - Right: utilities (theme toggle + social).
- Background and separator are localized to the header element to avoid global impact.

## Components
- Header:
  - Background: soft gradient + subtle noise overlay via `header::before`.
  - Hairline separator that strengthens slightly on scroll.
  - Link styles: text-first, soft warm hover wash, active dot/underline.
- HeaderLink:
  - Accepts a linear SVG icon, size 14-16px, `currentColor`.
  - Spacing between icon and label 6-8px.
- Social icons:
  - Reduce size to 16-18px and keep subdued hover treatment.

## Data Flow
- No new data sources.
- Icons remain static (inline SVG or small component), colored by `currentColor`.

## Behavior
- Scroll state:
  - Slight increase in background opacity and divider contrast.
  - Optional 1-2px logo size reduction, but no height jump.
- Hover state:
  - Subtle warm wash + text darkening.
- Active state:
  - Thin underline or tiny dot in terracotta.
- Mobile menu:
  - Soft card surface with warm tint and larger radius.
  - Slide-down with slightly slower easing.

## Accessibility
- Ensure focus-visible outlines are clear on nav items.
- Keep sufficient contrast for text on warm background.
- Provide `prefers-reduced-motion` fallbacks for transitions.

## Error Handling
- No runtime logic changes; only style updates.
- Fallback if `backdrop-filter` unsupported: maintain solid gradient.

## Testing
- Desktop/phone widths at the 720px breakpoint.
- Light/dark themes.
- Keyboard navigation and focus visibility.
- 125% and 150% zoom for layout stability.

## Open Questions
- None.

## Implementation Notes
- Use CSS variables for warm neutrals and accent to keep style consistent.
- Keep all changes scoped to header components.
