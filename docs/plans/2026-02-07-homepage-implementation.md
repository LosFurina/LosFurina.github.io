# Homepage Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current decorative homepage with a projects-first, reading-friendly layout (Hero → Featured Projects → Tech Timeline → Latest Posts → CTA).

**Architecture:** Split the homepage into small Astro components fed by a single data module (`src/data/home.ts`) and a minimal `index.astro` that wires them together. Keep layout styles lightweight and scoped to each component, with shared layout spacing in the page.

**Tech Stack:** Astro, TypeScript, CSS (scoped component styles), existing global theme variables.

---

## Manual Verification Checklist (no automated tests)
- Hero is static (no typewriter), bilingual headline present, chips visible, 3 CTAs shown.
- Featured Projects is the first section after Hero, 4–6 compact cards.
- Tech Timeline shows 6–8 entries in a vertical list.
- Latest Posts is a 3-item list (title + date + one sentence), no heavy cards.
- Page uses lighter borders/shadows and increased spacing.
- Mobile: CTAs stack, cards/timeline/list become single column.

---

### Task 1: Add homepage data module

**Files:**
- Create: `src/data/home.ts`

**Step 1: Write the failing test**
- Open `/` and confirm there is no new hero copy/keywords/timeline data (expected to fail checklist).

**Step 2: Run test to verify it fails**
- Run `npm run dev` and load `/`. Expect to see the old typewriter hero and old sections.

**Step 3: Write minimal implementation**
```ts
export const hero = {
	greeting: "Hi, I'm",
	name: "Wayne Li",
	headline: "专注可靠系统与自动化的基础设施工程师",
	subtitle: "DevOps · Cloud · Automation · Linux · IaC",
	keywords: ["DevOps", "Cloud", "Automation", "Linux", "IaC"],
	ctas: [
		{ label: "View Resume", href: "/resume", variant: "primary" },
		{ label: "Projects", href: "/projects", variant: "secondary" },
		{ label: "Contact", href: "/contact", variant: "secondary" },
	],
};

export const featuredProjects = [
	{
		title: "Personal Blog & Portfolio",
		description: "Astro 构建的个人网站，包含博客、项目和简历",
		tags: ["Astro", "TypeScript", "CSS"],
		linkLabel: "GitHub",
		linkHref: "https://github.com/LosFurina/LosFurina.github.io",
	},
	{
		title: "Kubernetes Cluster Setup",
		description: "kubeadm 搭建生产级集群，包含监控与日志",
		tags: ["Kubernetes", "Docker", "Prometheus"],
		linkLabel: "GitHub",
		linkHref: "https://github.com/LosFurina",
	},
	{
		title: "CI/CD Pipeline Template",
		description: "GitHub Actions 模板，覆盖多语言项目",
		tags: ["CI/CD", "GitHub Actions", "Docker"],
		linkLabel: "GitHub",
		linkHref: "https://github.com/LosFurina",
	},
	{
		title: "Infra Automation Scripts",
		description: "常用运维自动化脚本与实践合集",
		tags: ["Automation", "Linux", "Shell"],
		linkLabel: "GitHub",
		linkHref: "https://github.com/LosFurina",
	},
];

export const techTimeline = [
	{
		period: "2018",
		tech: "Linux 基础",
		detail: "系统管理、Shell 脚本与日常运维",
	},
	{
		period: "2019",
		tech: "网络与服务",
		detail: "TCP/IP、DNS、Nginx 与基础服务部署",
	},
	{
		period: "2020",
		tech: "Docker & 容器化",
		detail: "镜像管理、服务编排、容器最佳实践",
	},
	{
		period: "2021",
		tech: "Kubernetes",
		detail: "集群搭建、工作负载与可观测性",
	},
	{
		period: "2022",
		tech: "IaC",
		detail: "Terraform / Ansible 自动化配置",
	},
	{
		period: "2023",
		tech: "CI/CD",
		detail: "流水线设计、质量门禁与发布流程",
	},
	{
		period: "2024+",
		tech: "平台工程",
		detail: "内平台与开发者体验优化",
	},
];

export const homeCta = {
	title: "一起做点有价值的东西",
	description: "欢迎聊聊基础设施、自动化或合作。",
	button: {
		label: "Contact",
		href: "/contact",
	},
};
```

**Step 4: Run test to verify it passes**
- Reload `/`; no visual change yet, but data file should exist with expected exports.

**Step 5: Commit**
```bash
git add src/data/home.ts
git commit -m "feat: add homepage data module"
```

---

### Task 2: Create Hero section component

**Files:**
- Create: `src/components/home/HeroSection.astro`

**Step 1: Write the failing test**
- Confirm hero still uses the old typewriter UI on `/`.

**Step 2: Run test to verify it fails**
- `npm run dev` → `/` shows old hero.

**Step 3: Write minimal implementation**
```astro
---
interface Props {
	hero: {
		greeting: string;
		name: string;
		headline: string;
		subtitle: string;
		keywords: string[];
		ctas: Array<{ label: string; href: string; variant: "primary" | "secondary" }>;
	};
}

const { hero } = Astro.props;
---

<section class="home-section home-hero">
	<div class="home-container">
		<p class="hero-greeting">{hero.greeting}</p>
		<h1 class="hero-name">{hero.name}</h1>
		<p class="hero-headline">{hero.headline}</p>
		<p class="hero-subtitle">{hero.subtitle}</p>

		<ul class="hero-chips">
			{hero.keywords.map((keyword) => (
				<li>{keyword}</li>
			))}
		</ul>

		<div class="hero-cta">
			{hero.ctas.map((cta) => (
				<a
					href={cta.href}
					class={`cta-btn ${cta.variant}`}
				>
					{cta.label}
				</a>
			))}
		</div>
	</div>
</section>

<style>
	.home-hero {
		padding-top: 4.5rem;
		padding-bottom: 3rem;
	}

	.hero-greeting {
		color: rgb(var(--gray));
		margin: 0 0 0.25rem;
		font-size: 1rem;
	}

	.hero-name {
		font-size: clamp(2.4rem, 5vw, 3.4rem);
		margin: 0 0 0.5rem;
	}

	.hero-headline {
		font-size: 1.15rem;
		margin: 0 0 0.35rem;
		color: rgb(var(--gray-dark));
	}

	.hero-subtitle {
		font-size: 1rem;
		color: rgb(var(--gray));
		margin: 0 0 1.25rem;
	}

	.hero-chips {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.hero-chips li {
		border: 1px solid var(--border-soft);
		border-radius: 999px;
		padding: 0.25rem 0.75rem;
		font-size: 0.85rem;
		color: rgb(var(--ink));
		background: rgba(var(--accent-rgb), 0.05);
	}

	.hero-cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.cta-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55rem 1.2rem;
		border-radius: 999px;
		font-weight: 600;
		text-decoration: none;
		border: 1px solid transparent;
		transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.cta-btn.primary {
		background: var(--accent);
		color: #fff;
	}

	.cta-btn.primary:hover {
		background: var(--accent-dark);
	}

	.cta-btn.secondary {
		background: transparent;
		border-color: var(--border-soft);
		color: rgb(var(--ink));
	}

	.cta-btn.secondary:hover {
		background: rgba(var(--accent-rgb), 0.08);
		border-color: rgba(var(--accent-rgb), 0.35);
		color: var(--accent-dark);
	}

	@media (max-width: 720px) {
		.hero-cta {
			flex-direction: column;
		}

		.cta-btn {
			width: 100%;
		}
	}
</style>
```

**Step 4: Run test to verify it passes**
- Reload `/` and confirm the hero is static with chips + 3 CTAs (after index wiring).

**Step 5: Commit**
```bash
git add src/components/home/HeroSection.astro
git commit -m "feat: add homepage hero section"
```

---

### Task 3: Create Featured Projects component

**Files:**
- Create: `src/components/home/FeaturedProjects.astro`

**Step 1: Write the failing test**
- Confirm the old featured projects section is still present on `/`.

**Step 2: Run test to verify it fails**
- `npm run dev` → old cards still appear.

**Step 3: Write minimal implementation**
```astro
---
interface Project {
	title: string;
	description: string;
	tags: string[];
	linkLabel: string;
	linkHref: string;
}

interface Props {
	projects: Project[];
}

const { projects } = Astro.props;
---

<section class="home-section">
	<div class="home-container">
		<div class="home-section__header">
			<h2 class="home-section__title">精选项目 / Featured Projects</h2>
			<p class="home-section__subtitle">
				我近期更有代表性的 DevOps 与基础设施项目
			</p>
		</div>

		<div class="projects-grid">
			{projects.map((project) => (
				<article class="project-card">
					<h3>{project.title}</h3>
					<p>{project.description}</p>
					<div class="project-tags">
						{project.tags.map((tag) => (
							<span>{tag}</span>
						))}
					</div>
					<a class="project-link" href={project.linkHref} target="_blank" rel="noopener">
						{project.linkLabel} →
					</a>
				</article>
			))}
		</div>
	</div>
</section>

<style>
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.25rem;
	}

	.project-card {
		border: 1px solid var(--border-soft);
		border-radius: 14px;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.6);
		transition: transform 0.2s ease, border-color 0.2s ease;
	}

	:global([data-theme="dark"]) .project-card {
		background: rgba(35, 30, 27, 0.65);
	}

	.project-card:hover {
		transform: translateY(-2px);
		border-color: rgba(var(--accent-rgb), 0.35);
	}

	.project-card h3 {
		margin: 0 0 0.4rem;
		font-size: 1.1rem;
	}

	.project-card p {
		margin: 0 0 0.75rem;
		color: rgb(var(--gray));
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
	}

	.project-tags span {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: rgba(var(--accent-rgb), 0.08);
		color: var(--accent-dark);
		border: 1px solid rgba(var(--accent-rgb), 0.2);
	}

	.project-link {
		text-decoration: none;
		font-weight: 600;
		color: var(--accent);
	}

	.project-link:hover {
		color: var(--accent-dark);
	}
</style>
```

**Step 4: Run test to verify it passes**
- Reload `/` and confirm compact project cards appear (after index wiring).

**Step 5: Commit**
```bash
git add src/components/home/FeaturedProjects.astro
git commit -m "feat: add featured projects section"
```

---

### Task 4: Create Tech Timeline component

**Files:**
- Create: `src/components/home/TechTimeline.astro`

**Step 1: Write the failing test**
- Confirm there is no tech timeline section on `/`.

**Step 2: Run test to verify it fails**
- `npm run dev` → timeline not present.

**Step 3: Write minimal implementation**
```astro
---
interface TimelineItem {
	period: string;
	tech: string;
	detail: string;
}

interface Props {
	items: TimelineItem[];
}

const { items } = Astro.props;
---

<section class="home-section">
	<div class="home-container">
		<div class="home-section__header">
			<h2 class="home-section__title">技术路径 / Tech Timeline</h2>
			<p class="home-section__subtitle">核心技术路径与积累</p>
		</div>

		<ul class="timeline">
			{items.map((item) => (
				<li class="timeline-item">
					<div class="timeline-meta">{item.period}</div>
					<h3>{item.tech}</h3>
					<p>{item.detail}</p>
				</li>
			))}
		</ul>
	</div>
</section>

<style>
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0 0 0 1.5rem;
		display: grid;
		gap: 1.25rem;
		border-left: 1px solid var(--border-soft);
	}

	.timeline-item {
		position: relative;
		padding-left: 0.25rem;
	}

	.timeline-item::before {
		content: "";
		position: absolute;
		left: -1.55rem;
		top: 0.35rem;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
	}

	.timeline-meta {
		font-size: 0.85rem;
		color: rgb(var(--gray));
		margin-bottom: 0.25rem;
	}

	.timeline-item h3 {
		margin: 0 0 0.25rem;
		font-size: 1.05rem;
	}

	.timeline-item p {
		margin: 0;
		color: rgb(var(--gray));
		font-size: 0.95rem;
	}
</style>
```

**Step 4: Run test to verify it passes**
- Reload `/` and confirm the timeline appears with 6–8 entries (after index wiring).

**Step 5: Commit**
```bash
git add src/components/home/TechTimeline.astro
git commit -m "feat: add tech timeline section"
```

---

### Task 5: Create Latest Posts component

**Files:**
- Create: `src/components/home/LatestPosts.astro`

**Step 1: Write the failing test**
- Confirm latest posts are still shown as old cards on `/`.

**Step 2: Run test to verify it fails**
- `npm run dev` → old cards appear.

**Step 3: Write minimal implementation**
```astro
---
import type { CollectionEntry } from "astro:content";
import FormattedDate from "../FormattedDate.astro";

interface Props {
	posts: CollectionEntry<"blog">[];
}

const { posts } = Astro.props;
---

<section class="home-section">
	<div class="home-container">
		<div class="home-section__header">
			<h2 class="home-section__title">最新文章 / Latest Posts</h2>
			<p class="home-section__subtitle">最近的写作与思考</p>
		</div>

		<ul class="post-list">
			{posts.map((post) => (
				<li class="post-item">
					<div class="post-date">
						<FormattedDate date={post.data.pubDate} />
					</div>
					<div class="post-main">
						<a class="post-title" href={`/blog/${post.id}/`}>
							{post.data.title}
						</a>
						<p class="post-desc">{post.data.description}</p>
					</div>
				</li>
			))}
		</ul>
	</div>
</section>

<style>
	.post-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1.25rem;
	}

	.post-item {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 1.25rem;
		align-items: start;
	}

	.post-date {
		font-size: 0.85rem;
		color: rgb(var(--gray));
	}

	.post-title {
		font-weight: 600;
		text-decoration: none;
		color: rgb(var(--gray-dark));
	}

	.post-title:hover {
		color: var(--accent);
	}

	.post-desc {
		margin: 0.35rem 0 0;
		color: rgb(var(--gray));
		font-size: 0.95rem;
	}

	@media (max-width: 720px) {
		.post-item {
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}
	}
</style>
```

**Step 4: Run test to verify it passes**
- Reload `/` and confirm list layout with title/date/description (after index wiring).

**Step 5: Commit**
```bash
git add src/components/home/LatestPosts.astro
git commit -m "feat: add latest posts section"
```

---

### Task 6: Create simple CTA strip component

**Files:**
- Create: `src/components/home/HomeCTA.astro`

**Step 1: Write the failing test**
- Confirm there is no simple CTA strip at the bottom of `/`.

**Step 2: Run test to verify it fails**
- `npm run dev` → CTA strip not present.

**Step 3: Write minimal implementation**
```astro
---
interface Props {
	title: string;
	description: string;
	button: {
		label: string;
		href: string;
	};
}

const { title, description, button } = Astro.props;
---

<section class="home-section">
	<div class="home-container">
		<div class="home-cta">
			<div>
				<h2>{title}</h2>
				<p>{description}</p>
			</div>
			<a class="cta-btn primary" href={button.href}>{button.label}</a>
		</div>
	</div>
</section>

<style>
	.home-cta {
		border: 1px solid var(--border-soft);
		border-radius: 16px;
		padding: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		background: rgba(255, 255, 255, 0.6);
	}

	:global([data-theme="dark"]) .home-cta {
		background: rgba(35, 30, 27, 0.65);
	}

	.home-cta h2 {
		margin: 0 0 0.35rem;
		font-size: 1.2rem;
	}

	.home-cta p {
		margin: 0;
		color: rgb(var(--gray));
	}

	@media (max-width: 720px) {
		.home-cta {
			flex-direction: column;
			align-items: flex-start;
		}
		.home-cta .cta-btn {
			width: 100%;
		}
	}
</style>
```

**Step 4: Run test to verify it passes**
- Reload `/` and confirm a minimal CTA strip at the bottom (after index wiring).

**Step 5: Commit**
```bash
git add src/components/home/HomeCTA.astro
git commit -m "feat: add homepage CTA strip"
```

---

### Task 7: Rewrite homepage to use new components

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Write the failing test**
- Confirm `/` still uses the old sections and the typewriter script exists.

**Step 2: Run test to verify it fails**
- `npm run dev` → old layout still present.

**Step 3: Write minimal implementation**
```astro
---
import { getCollection } from "astro:content";
import BaseHead from "../components/BaseHead.astro";
import Footer from "../components/Footer.astro";
import Header from "../components/Header.astro";
import HeroSection from "../components/home/HeroSection.astro";
import FeaturedProjects from "../components/home/FeaturedProjects.astro";
import TechTimeline from "../components/home/TechTimeline.astro";
import LatestPosts from "../components/home/LatestPosts.astro";
import HomeCTA from "../components/home/HomeCTA.astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { hero, featuredProjects, techTimeline, homeCta } from "../data/home";

const latestPosts = (await getCollection("blog"))
	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	.slice(0, 3);
---

<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={SITE_TITLE} description={SITE_DESCRIPTION} />
		<style>
			:global(.home-section) {
				padding: 3.5rem 0;
			}

			:global(.home-container) {
				max-width: 1100px;
				margin: 0 auto;
				padding: 0 2rem;
			}

			:global(.home-section__header) {
				margin-bottom: 1.75rem;
			}

			:global(.home-section__title) {
				margin: 0 0 0.4rem;
				font-size: 1.8rem;
			}

			:global(.home-section__subtitle) {
				margin: 0;
				color: rgb(var(--gray));
				font-size: 1rem;
			}

			@media (max-width: 720px) {
				:global(.home-container) {
					padding: 0 1.25rem;
				}

				:global(.home-section) {
					padding: 2.5rem 0;
				}
			}
		</style>
	</head>
	<body>
		<Header />
		<HeroSection hero={hero} />
		<FeaturedProjects projects={featuredProjects} />
		<TechTimeline items={techTimeline} />
		<LatestPosts posts={latestPosts} />
		<HomeCTA {...homeCta} />
		<Footer />
	</body>
</html>
```

**Step 4: Run test to verify it passes**
- Reload `/` and confirm the new layout matches the checklist.

**Step 5: Commit**
```bash
git add src/pages/index.astro
git commit -m "feat: rebuild homepage layout"
```

---

### Task 8: Final verification

**Files:**
- (No code changes)

**Step 1: Run the manual checklist**
- Verify all items in the checklist above on desktop and mobile widths.

**Step 2: Optional build check**
- If dependencies are available: `npm run build`

**Step 3: Commit summary**
- If any final tweaks are required, commit with a short message.

---

## Notes
- The user requested “skip test”; only manual verification is required.
- If `npm install` fails due to `sharp`, proceed without build and note verification limits.
