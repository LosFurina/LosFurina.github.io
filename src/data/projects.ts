export interface ProjectEntry {
	title: string;
	description: string;
	tags: string[];
	github: string;
	demo?: string;
	featured?: boolean;
	homeFeatured?: boolean;
}

export const projectEntries: ProjectEntry[] = [
	{
		title: "RevieU Web",
		description:
			"面向商家与用户的现代化点评平台前端，支持搜索、发帖、商家互动与多角色体验。",
		tags: ["TypeScript", "React", "Frontend"],
		github: "https://github.com/RevieU-Corp/revieu-web",
		featured: true,
		homeFeatured: true,
	},
	{
		title: "RevieU Backend",
		description:
			"RevieU 平台后端服务，包含核心 API、工程化脚本与安全规范（hooks/secrets/commit 约束）。",
		tags: ["Go", "Backend", "API"],
		github: "https://github.com/RevieU-Corp/revieu-backend",
		featured: true,
		homeFeatured: true,
	},
	{
		title: "RevieU Infra",
		description:
			"基于 K3s + ArgoCD + Kustomize 的 GitOps 基础设施仓库，覆盖多环境部署与密钥管理。",
		tags: ["K3s", "ArgoCD", "GitOps"],
		github: "https://github.com/RevieU-Corp/revieu-infra",
		featured: true,
		homeFeatured: true,
	},
	{
		title: "Rusty Image Hosting",
		description:
			"基于 Rust + Actix-Web + SQLite 的轻量图床/文件服务，支持上传、检索、删除与 Telegram 集成。",
		tags: ["Rust", "Actix-Web", "SQLite"],
		github: "https://github.com/LosFurina/rusty-img-hosting",
		featured: true,
		homeFeatured: true,
	},
	{
		title: "PGTN",
		description:
			"面向工业时序异常检测的双通道图 Transformer 框架，覆盖训练、测试与可视化流程。",
		tags: ["Python", "Transformer", "Anomaly Detection"],
		github: "https://github.com/LosFurina/PGTN",
		homeFeatured: true,
	},
	{
		title: "PhyGAD",
		description:
			"面向时序/工业数据的异常检测研究项目，包含训练、评估与实验配置流程。",
		tags: ["Python", "Deep Learning", "Anomaly Detection"],
		github: "https://github.com/LosFurina/PhyGAD",
	},
	{
		title: "Paillier Vote System (Remote)",
		description:
			"基于 Paillier 同态加密的远程投票系统服务端，支持多用户投票、加密计票与数据存储。",
		tags: ["Go", "Paillier", "Homomorphic Encryption"],
		github: "https://github.com/LosFurina/PaillierVoteSystemRemoteRouter",
		homeFeatured: true,
	},
	{
		title: "Paillier Vote System (Local)",
		description:
			"同态加密投票系统本地客户端实现，与远程投票服务端协同完成投票流程。",
		tags: ["Go", "Client", "Cryptography"],
		github: "https://github.com/LosFurina/PaillierVoteSystemLocalRouter",
	},
	{
		title: "One-Time Pad Service (Remote)",
		description:
			"基于 Go 的 One-Time Pad 服务端，提供注册登录与基础密钥服务能力。",
		tags: ["Go", "OTP", "Backend"],
		github: "https://github.com/LosFurina/OneTimePad_RemoteRouter",
	},
	{
		title: "One-Time Pad Service (Local)",
		description:
			"结合 OTP 与 RSA 的密码管理服务，提供网页端密码生成、存储与安全管理能力。",
		tags: ["Go", "OTP", "RSA"],
		github: "https://github.com/LosFurina/OneTimePad_LocalRouter",
		homeFeatured: true,
	},
	{
		title: "DiffieHellman",
		description:
			"Go 实现的 Diffie-Hellman 密钥交换算法示例，展示从参数生成到共享密钥计算流程。",
		tags: ["Go", "Cryptography", "Key Exchange"],
		github: "https://github.com/LosFurina/DiffieHellman",
		homeFeatured: true,
	},
	{
		title: "MAAIDD",
		description:
			"多智能体动力系统与图结构分析项目，提供文档与实验研究材料。",
		tags: ["Multi-Agent", "Graph", "Research"],
		github: "https://github.com/LosFurina/MAAIDD",
	},
	{
		title: "NewUserPredict",
		description:
			"针对用户行为数据的数据挖掘与预测实验项目，包含数据处理与分析流程。",
		tags: ["Python", "Data Mining", "Prediction"],
		github: "https://github.com/LosFurina/NewUserPredict",
	},
];

