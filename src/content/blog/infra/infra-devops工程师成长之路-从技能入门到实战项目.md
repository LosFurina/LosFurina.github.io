---
title: "Infra/DevOps 工程师成长路线：从基础到实战"
description: "梳理 Infra/DevOps 的技能地图、面试考点与项目实践方向。"
pubDate: "2025-08-26"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Infra-DevOps工程师成长之路：从技能入门到实战项目.md"
sourceVault: "obsidian/note"
slug: "infra/infra-devops工程师成长之路-从技能入门到实战项目"
---
#### **第一部分：理论基础与技能全景 (The Foundation)**

*   **A. 技术硬技能：成为Infra工程师的基石**
    1.  **操作系统与网络：** Linux命令行、TCP/IP协议栈 (HTTP, DNS)
    2.  **编程与脚本：** 至少精通一种脚本语言 (Python/Shell)，Go语言为加分项
    3.  **容器化技术：** Docker核心概念 (Dockerfile, Image, Container, Network)
    4.  **容器编排引擎：** Kubernetes (K8s) 的核心理念与组件（*当前学习重点*）
    5.  **基础设施即代码 (IaC)：** Terraform的核心思想与实践（*下一个学习重点*）
    6.  **云计算平台：** 至少熟悉一家主流云服务商 (如AWS, GCP, Azure) 的核心服务
    7.  **监控与日志：** 了解Prometheus, Grafana, ELK等工具的基本作用

*   **B. 核心软技能：从“会用”到“会解决问题”**
    1.  **故障排查能力 (Troubleshooting)：** 面对未知问题的分析与定位能力
    2.  **沟通与协作：** 清晰地表达技术方案，与开发团队高效合作
    3.  **快速学习能力：** 拥抱技术变革，持续学习新工具和新理念
    4.  **责任心与抗压性：** 保障线上服务稳定性的主人翁意识

#### **第二部分：实战能力考察与面试核心 (The Gauntlet)**

*   **A. 编码与自动化能力 (OA模拟)**
    *   **问题：** 日志文件分析，统计TOP N的IP地址
    *   **考察点：** Python/Shell脚本能力，标准库的使用 (如`collections.Counter`)，文件处理，逻辑思维

*   **B. Linux系统故障排查 (面试模拟)**
    *   **问题：** 服务器响应缓慢，如何定位原因？
    *   **考察点：**
        *   `top/htop`: 关注`%CPU`, `%MEM`，更要关注`load average`和`iowait (wa)`
        *   `netstat/ss`: 了解网络连接状态，排查DDoS思路，知道`ss`优于`netstat`
        *   `ps`: 静态查看进程快照，便于脚本处理

*   **C. 容器网络知识 (面试模拟)**
    *   **问题：** 两个Docker容器如何稳定通信？
    *   **考察点：** `docker network`的重要性，基于容器名的DNS服务发现，理解硬编码IP的弊端

*   **D. 系统设计与架构思维 (面试模拟)**
    *   **问题：** 照片分享应用的基础设施设计
    *   **考察点：**
        *   **存储：** 对象存储 (如AWS S3) vs. 本地存储
        *   **计算：** 异步任务处理 (消息队列) 来处理计算密集型任务
        *   **数据库：** SQL vs. NoSQL的选择，理解数据库只存元数据 (URL) 而非文件本身

#### **第三部分：职业定位与发展路径 (The Career Path)**

*   **A. 理解核心差异与融合：Infra vs. DevOps**
    *   **Infra：** 关注系统的静态组件（服务器、网络、存储），目标是**稳定、性能、安全**。
    *   **DevOps：** 关注应用的动态交付流程（CI/CD），目标是**速度、效率、自动化**。
    *   **现状：** 两者高度重叠，现代Infra工程师必须具备DevOps思维和工具链知识。

*   **B. 发现个人兴趣与价值定位：平台建造者**
    *   **核心认知：** 明确个人兴趣在于**部署、维护、自动化和优化**整个系统平台，而非编写单个应用功能。
    *   **角色定位：** 这正是平台工程师、SRE、高级DevOps工程师的核心价值——为应用开发者“造工厂、修高速公路”。

#### **第四部分：个人项目驱动的K8s进阶实战蓝图 (Your Blueprint)**

*   **A. 项目现状分析：一个完美的K8s学习沙盒**
    *   **现有服务：** Nginx, Blog, Drive, Vaultwarden, FRP等。
    *   **项目价值：** 真实、多样化、涵盖无状态与有状态应用，天然包含了路由、HTTPS、存储等K8s核心议题。

*   **B. 项目迁移的核心学习目标 (用K8s解决现有问题)**
    1.  **服务发现与路由：** 用`Ingress`替代Nginx反向代理。
    2.  **安全与自动化：** 用`cert-manager`实现全自动HTTPS证书管理。
    3.  **有状态应用管理：** 用`StatefulSet` + `PersistentVolume`管理Vaultwarden等需要持久化数据的服务。
    4.  **配置管理：** 用`ConfigMap`和`Secret`管理所有服务的配置和密钥。

*   **C. 项目扩展：融合AI应用，提升项目前沿性**
    1.  **新挑战：** 引入AI Chat Lab，带来外部API调用和潜在的高资源消耗场景。
    2.  **新技能点：**
        *   **密钥管理：** 实践用`Kubernetes Secret`安全管理OpenRouter API Key。
        *   **弹性伸缩：** 学习用`Horizontal Pod Autoscaler (HPA)`实现服务的自动扩缩容。

*   **D. 分阶段实施路线图 (Action Plan)**
    1.  **阶段一 (本地演练)：** Docker化所有服务 -> 安装本地K8s (k3d/Minikube) -> 部署简单无状态应用 -> 配置Ingress。
    2.  **阶段二 (攻克难点)：** 在本地实现HTTPS自动化 -> 学习并实践`StatefulSet`和`PVC` -> 将所有配置`ConfigMap/Secret`化。
    3.  **阶段三 (上线迁移)：** 搭建准生产K8s集群 -> 部署所有YAML文件 -> 配置云存储 -> 最终切换DNS解析。
