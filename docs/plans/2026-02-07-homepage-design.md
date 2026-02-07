# Homepage Optimization Design (2026-02-07)

## Context
The homepage should prioritize showcasing projects while keeping a reading-first, low-decoration aesthetic. The current page uses heavier decoration (typewriter, gradients, dense cards). We want a cleaner, more focused structure that highlights work quickly and reads well.

## Goals
- Projects-first layout that communicates "what I do" within 5 seconds.
- Simplify hero and reduce decoration while keeping a warm tone.
- Increase scannability with clearer hierarchy and consistent spacing.
- Keep content light and modular for easy future updates.

## Non-goals
- No major new features, data sources, or CMS changes.
- No heavy animation or complex interactive effects.
- No dark-theme redesign.

## Information Architecture (Recommended A)
1. Hero (static): one-line value prop + 3-5 keyword chips + 3 CTAs
2. Featured Projects (first content block): 4-6 compact cards
3. Tech Timeline: 6-8 core technologies by year/period
4. Latest Posts: 3-item text list (title + date + one sentence)
5. Light CTA strip (optional): contact or resume

## Content & Copy
- Language: bilingual mix (Chinese title + short English subtitle).
- Hero headline: concise, stable, no typewriter.
- Keywords: 3-5 short chips (e.g., DevOps, Cloud, Linux, Automation, IaC).
- CTAs: Resume, Projects, Contact (3 buttons).

## Visual Direction
- Reduce gradients and shadows; keep "paper" background.
- Use lighter borders and minimal elevation for cards.
- Larger vertical spacing between sections (64-80px).
- Clear typography hierarchy (large hero title, smaller subtitle, chips).
- Hover effects: subtle border/color shift, small lift only.

## Components & Data
- Extract homepage into small components:
  - HeroSection
  - FeaturedProjects
  - TechTimeline
  - LatestPosts
  - HomeCTA
- Move static data to `src/data/home.ts`:
  - featuredProjects
  - heroKeywords
  - techTimeline
  - homeCtas

## Tech Timeline Spec
- 6-8 entries.
- Format: `{ period, tech, note }`.
- Visual: vertical list or simple left border line, no heavy graphics.

## Latest Posts Spec
- Show 3 posts, sorted by date.
- Layout: simple list (no card background), one-sentence description.

## Responsive Notes
- Hero CTA stacks on mobile.
- Project cards collapse to 1 column.
- Timeline becomes single column with tighter spacing.

## Risks
- Too many projects can crowd the page; cap at 6.
- Timeline can feel long on mobile; keep entries short.
- Over-simplifying hero copy may reduce clarity; validate wording.

## Validation
- 5-second test: visitor can state role and where to click.
- Scroll flow: no visual "speed bumps" between sections.
- Mobile pass: no section taller than one screen without break.

## Next Step
If approved, start implementation with a git worktree and a short plan.
