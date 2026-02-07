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
