# Blog Reading-First List Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the reading-first blog list layout (single-column list, minimal list items, right thumbnails, softened sidebars, and a title area with the new subtitle).

**Architecture:** Update `BlogListLayout` to render a title block, move search to the right sidebar, and switch the list to a single-column layout. Update `BlogCard` to a list-row design with a text stack and optional thumbnail column, and display 1–2 tags per item. Soften `PersonalProfile`, `TagSidebar`, and `BlogSearch` styles to reduce visual weight. Keep the warm theme but trim shadows and gradients for the blog list views.

**Tech Stack:** Astro components, Astro content collections, TypeScript props, CSS.

---

### Task 1: Add constants and tag helper

**Files:**
- Modify: `src/consts.ts`
- Create: `src/utils/blogTags.ts`

**Step 1: Add subtitle constant**
Add a constant so the subtitle is centralized.

```ts
export const BLOG_SUBTITLE = "What makes you different makes you powerful.";
```

**Step 2: Add tag helper**
Create a small helper to derive a primary tag from the post id.

```ts
export const getPrimaryTag = (id: string) =>
  id.includes("/") ? id.split("/")[0] : "untagged";
```

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS (warnings about vips modules are acceptable).

**Step 4: Commit**
```bash
git add src/consts.ts src/utils/blogTags.ts
git commit -m "feat: add blog subtitle and tag helper"
```

---

### Task 2: Pass subtitle and tags into list pages

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/tags/[tag].astro`

**Step 1: Use constants + helper**
Update imports and pass subtitle + tag info to `BlogCard`.

```astro
import { BLOG_SUBTITLE, SITE_DESCRIPTION, SITE_TITLE } from "../../consts";
import { getPrimaryTag } from "../../utils/blogTags";
```

```astro
const tag = getPrimaryTag(post.id);
const tags = [{ name: tag, href: `/tags/${tag}` }];
```

```astro
<BlogListLayout
  title="Blog"
  subtitle={BLOG_SUBTITLE}
  description={SITE_DESCRIPTION}
  ...
>
```

```astro
<BlogCard ... tags={tags} />
```

For the tag page, set `title` to `Tag: ${tag}` and reuse `BLOG_SUBTITLE`.

**Step 2: Verify build**
Run: `npm run build`
Expected: PASS.

**Step 3: Commit**
```bash
git add src/pages/blog/index.astro src/pages/tags/[tag].astro
git commit -m "feat: pass subtitle and tags into blog list"
```

---

### Task 3: Update BlogListLayout layout and title area

**Files:**
- Modify: `src/components/BlogListLayout.astro`

**Step 1: Add subtitle prop + title block**
Extend props and render a simple title block above the list.

```ts
interface Props {
  title?: string;
  subtitle?: string;
  ...
}
```

```astro
<header class="blog-title">
  <h1>{title}</h1>
  {subtitle && <p>{subtitle}</p>}
</header>
```

**Step 2: Move BlogSearch into right sidebar**
Render `<BlogSearch />` above `<TagSidebar />` in the right column.

**Step 3: Switch list to single-column**
Update `.posts-list` to `grid-template-columns: 1fr` and adjust spacing.

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/BlogListLayout.astro
git commit -m "feat: add blog title block and single-column list"
```

---

### Task 4: Redesign BlogCard into list-row layout

**Files:**
- Modify: `src/components/BlogCard.astro`

**Step 1: Add tags prop and list-row markup**
Switch to a row layout with text stack and thumbnail column.

```ts
interface Props {
  ...
  tags?: Array<{ name: string; href: string }>;
}
```

```astro
<article class="blog-list-item">
  <a href={href} class="list-link">
    <div class="list-text">
      <h3 class="list-title">{title}</h3>
      <p class="list-date"><FormattedDate date={pubDate} /></p>
      {tags?.length && (
        <div class="list-tags">
          {tags.slice(0, 2).map((tag) => (
            <a href={tag.href} class="list-tag">{tag.name}</a>
          ))}
        </div>
      )}
      {description && <p class="list-description">{description}</p>}
    </div>
    <div class="list-thumb" aria-hidden="true">
      {heroImage && (
        <Image src={heroImage} alt={title} width={160} height={120} />
      )}
    </div>
  </a>
</article>
```

**Step 2: Replace card styles**
Remove shadows/overlays and add minimal list styles:
- `display: flex; gap: ...` on `.list-link`
- large vertical spacing between items
- muted date + small pill tags
- `.list-thumb` keeps width even when empty

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS.

**Step 4: Commit**
```bash
git add src/components/BlogCard.astro
git commit -m "feat: redesign blog card into list rows"
```

---

### Task 5: Soften sidebars and search UI

**Files:**
- Modify: `src/components/PersonalProfile.astro`
- Modify: `src/components/TagSidebar.astro`
- Modify: `src/components/BlogSearch.astro`

**Step 1: Reduce visual weight**
- Replace heavy gradients/shadows with subtle borders.
- Reduce avatar size and padding.
- Lighten tag sidebar backgrounds and borders.
- Make search input simpler (lower blur/alpha, smaller font).

**Step 2: Verify build**
Run: `npm run build`
Expected: PASS.

**Step 3: Commit**
```bash
git add src/components/PersonalProfile.astro src/components/TagSidebar.astro src/components/BlogSearch.astro
git commit -m "style: soften sidebars and search"
```

---

### Task 6: Tune global spacing and list rhythm

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Adjust global tokens**
- Slightly increase text contrast for `--gray` / `--ink-muted`.
- Reduce heavy box shadows for list view (avoid strong shadows).

**Step 2: Verify build**
Run: `npm run build`
Expected: PASS.

**Step 3: Commit**
```bash
git add src/styles/global.css
git commit -m "style: refine global contrast for blog list"
```

---

### Task 7: Manual verification

**Files:**
- None

**Step 1: Run dev server**
Run: `npm run dev`
Expected: server starts on localhost.

**Step 2: Check pages**
- `/blog` list spacing, title block, right thumbnails.
- `/tags/<tag>` inherits same list layout.
- No-image posts keep alignment.
- Dark mode contrast remains readable.

**Step 3: Commit (if tweaks needed)**
```bash
git add -A
git commit -m "chore: polish blog list spacing"
```
