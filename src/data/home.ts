import { projectEntries } from "./projects";

export const hero = {
	greeting: "Hi, I'm",
	name: "Wayne Li",
	headline: "专注可靠系统与自动化的基础设施工程师",
	subtitle: "DevOps · Cloud · Automation · Linux · IaC",
	keywords: ["DevOps", "Cloud", "Automation", "Linux", "IaC"],
	avatarUrl: "https://github.com/LosFurina.png?size=200",
	ctas: [
		{ label: "View Resume", href: "/resume", variant: "primary" },
		{ label: "Projects", href: "/projects", variant: "secondary" },
		{ label: "Contact", href: "/contact", variant: "secondary" },
	],
};

export const featuredProjects = projectEntries
	.filter((project) => project.homeFeatured)
	.map((project) => ({
		title: project.title,
		description: project.description,
		tags: project.tags,
		linkLabel: "GitHub",
		linkHref: project.github,
	}));

export const nowStatus = {
	title: "Now / 当前状态",
	status: "正在积极寻找 DevOps / Infrastructure Intern 机会",
	highlights: [
		"持续维护 RevieU 的 GitOps 基础设施与 CI/CD 流程",
		"整理技术博客内容，沉淀实战经验（Linux / Docker / Infra）",
		"优化 AI Infra 工具链与实验环境自动化效率",
	],
};

export const techTimeline = [
	{
		period: "2020",
		tech: "编程基础",
		detail: "C/C++（本科基础课程），Java 面向对象基础",
	},
	{
		period: "2021",
		tech: "二进制安全",
		detail: "CTF Pwn / Reverse / Misc（两年持续训练，具备实战分析能力）",
	},
	{
		period: "2022",
		tech: "Linux 与系统实践",
		detail: "Kali / Ubuntu / Arch / Unix 发行版实践与运维",
	},
	{
		period: "2023",
		tech: "网络与安全协议",
		detail:
			"Vmess / Vless / Hysteria / Trojan；SSH / GPG / WireGuard；公私钥体系、Diffie-Hellman、TLS 证书与凭据管理",
	},
	{
		period: "2024",
		tech: "科研与 AI",
		detail: "Python + ML/DL（两年实验室研究，成熟项目与论文产出）",
	},
	{
		period: "2025",
		tech: "云原生与 DevOps",
		detail: "Docker / Compose；CI（GitHub Actions）+ CD（ArgoCD）；k3s 实践",
	},
	{
		period: "2026",
		tech: "工程化与平台进阶",
		detail:
			"Go（同态加密实名投票系统，软著/论文）；Rust（所有权模型）；AI Infra 工具链（Claude Code / Codex / vibe coding）",
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
