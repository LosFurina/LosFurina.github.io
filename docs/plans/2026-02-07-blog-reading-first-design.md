# Blog Reading-First Redesign (Design)

Date: 2026-02-07

## Summary
Redesign the blog index and tag list pages for a reading-first experience: single-column list, large whitespace, minimal decoration, and a subdued left/right sidebar. Replace card-based grids with a clean, directory-like list that emphasizes titles, dates, tags, and two-line summaries. Keep the warm paper theme but increase text contrast and reduce visual noise.

## Goals
- Make the blog list feel like a clean table of contents.
- Improve scan-ability for titles, dates, and tags.
- Keep sidebars for profile and tags, but visually de-emphasize them.
- Preserve warm paper theme while improving readability.
- Maintain alignment and rhythm even when posts have no hero image.

## Non-goals
- Change content model or frontmatter schema.
- Add complex sorting/filtering beyond existing search and tags.
- Introduce heavy visual decorations or card shadows.

## Information Architecture
- Header
- Title area: large title + one-line subtitle
- Main list: single-column list items
- Right sidebar: search (top) + tag list (below)
- Left sidebar: personal profile (narrowed and softened)
- Footer

## Visual Direction
- Reading-first, airy, minimal.
- Warm paper background remains; contrast is slightly increased.
- Remove card shadows and overlays; rely on whitespace for separation.

## Layout Specs
- Main column max width: ~760–820px.
- Sidebars: ~200–220px each, visually softened.
- List spacing: 28–36px between items, no separators.
- Desktop layout: single column list, right thumbnail.
- Mobile layout: single column list; sidebars stack; thumbnails shrink.

## Typography
- Title area: 2.2–2.6rem for title, 1.0–1.1rem for subtitle.
- List title: 1.35–1.5rem, weight 600–700.
- Date: ~0.85rem, muted color.
- Tags: 0.78–0.82rem, light outline pills.
- Description: 0.95–1.0rem, line-height ~1.65, clamp to 2 lines.

## List Item Structure
- Left column (text):
  - Title
  - Date
  - Tags (1–2)
  - Description (2 lines)
- Right column (thumbnail):
  - Show if heroImage exists.
  - If no heroImage, render empty placeholder space to keep alignment.

## Thumbnail Rules
- Desktop size: ~120–140px wide, ~90–100px high.
- Mobile size: ~72–96px wide, height scaled.
- Shape: rounded rectangle (12–14px radius).
- No overlay or gradients; subtle hover scale (1–2%).

## Sidebar Treatment
- Right sidebar: search on top, tags below; lighter borders, smaller type.
- Left sidebar: narrower, fewer visual accents, low-contrast outlines.
- Fixed positioning retained, but aligned to header and main content top.

## Interactions
- Hover: title color gently transitions to accent.
- No card lift or heavy shadows.
- Thumbnail: slight scale on hover only.

## Dark Mode
- Maintain warm dark palette, ensure text contrast meets readability.
- Pills and borders use low-contrast outlines; no heavy backgrounds.

## Components to Update
- `src/components/BlogListLayout.astro`
  - Add title area above list.
  - Move search into right sidebar.
  - Switch main list to single-column.
  - Update grid widths and spacing.
- `src/components/BlogCard.astro`
  - Replace card layout with list-row layout.
  - Remove shadow/background/overlay.
  - Render right thumbnail column; keep blank space if no image.
  - Add tags (1–2) near date.
- `src/styles/global.css`
  - Adjust spacing tokens and muted text colors.
  - Reduce heavy shadows; keep background warm.

## Data/Content Dependencies
- Existing content schema includes `title`, `description`, `pubDate`, `heroImage`.
- Tags are derived from folder names in `/src/content/blog/`.

## Testing/Verification
- Desktop: list alignment with/without heroImage.
- Mobile: sidebars stack and list stays readable.
- Dark mode: text contrast and muted colors remain legible.
- Tag pages (`/tags/[tag]`) share the same list layout.

## Open Questions
- Confirm the exact subtitle text for the blog title area.
- Confirm how many tags per list item (default 1–2).
