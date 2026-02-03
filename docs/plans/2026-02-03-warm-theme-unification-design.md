# Warm Theme Unification Design (Light Warm + Pill System)

Date: 2026-02-03

## Goals
- Unify the site's visual language around a light warm, paper-like palette.
- Replace the existing blue accent with a muted warm accent across pages.
- Introduce a minimal pill-based button/tag system used consistently.
- Align the "More" header button styling with other nav items.

## Non-Goals
- No major layout restructuring beyond style consistency.
- No new component architecture or JS behavior changes.
- No content changes.

## Visual Direction
- Palette: light warm neutrals (paper/linen), muted terracotta accent.
- Contrast: gentle, readable, never high-saturation.
- Surfaces: soft card shadows, rounded corners (12-16px).
- Buttons/Tags: pill shape, subtle hover wash, thin outline variant.

## Architecture
- Centralize theme tokens in `src/styles/global.css`.
- Provide light utility classes for common UI elements:
  - `.pill`, `.pill--solid`, `.pill--outline`
  - `.card-soft`
- Existing components/pages should use tokens rather than hard-coded colors.

## Tokens (Examples)
- `--accent`, `--accent-dark`, `--accent-rgb`
- `--paper`, `--paper-2`, `--ink`, `--ink-muted`
- `--border-soft`, `--shadow-soft`

## Components/Pages to Align
- Header: "More" button to use same pill treatment as nav links.
- Buttons/CTAs: homepage, resume/contact pages, 404 buttons.
- Cards: blog/project cards, sidebars, tag components.
- Forms/inputs: keep functional styling but align border + focus colors.

## Behavior
- Hover: subtle warm wash (low opacity), no large transforms.
- Focus: clear outline using accent color (accessible).

## Accessibility
- Maintain readable contrast for body text and links.
- Use focus-visible outlines for keyboard navigation.

## Testing
- Visual check: light/dark modes, mobile/desktop.
- Ensure accent usage is consistent (no leftover blue).

## Open Questions
- None.
