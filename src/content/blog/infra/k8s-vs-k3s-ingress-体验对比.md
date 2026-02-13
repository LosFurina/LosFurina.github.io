---
title: "k8s vs k3s: Ingress 体验对比"
description: "原生 k8s： 如果你不在云平台上，这个 Service 会永远卡在 状态，因为 k8s 不知道如何去向你的路由器或公网申请一个 IP。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-k8s vs k3s_ Ingress 体验对比.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“k8s的实际体验和k3s有区别吗，我之前部署过k8s，但是ingress...”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. k8s的实际体验和k3s有区别吗，我之前部署过k8s，但是ingress...

这绝不是你的错觉。你之所以觉得 **k3s** “更流畅”，是因为它在设计上专门针对**裸机（Bare Metal）**和**边缘计算**场景优化了网络层。

而原生的 **k8s**（通常指 Kubernetes Upstream）是为云厂商（AWS/GCP/Azure）设计的，它默认假设底层有一个强大的云平台来提供负载均衡（LoadBalancer）支持。

### 1\. 核心区别：为什么 k3s 的 Ingress “插口即用”。

在原生 k8s 中，部署了 Ingress Controller 后，你通常需要创建一个 `Service` 类型为 `LoadBalancer` 的服务。

*   **原生 k8s：** 如果你不在云平台上，这个 Service 会永远卡在 `<pending>` 状态，因为 k8s 不知道如何去向你的路由器或公网申请一个 IP。
*   **k3s：** 它自带了一个名为 **ServiceLB**（原名 Klipper）的组件。当你创建一个 `LoadBalancer` Service 时，ServiceLB 会自动在你的节点上启动一个轻量级的代理（DaemonSet），通过监听主机的 80/443 端口将流量转发到集群内部。

### 2\. 深度对比：网络与外部访问

| 特性  | 原生 k8s (Standard) | k3s (Lightweight) |
| --- | --- | --- |
| **Ingress 控制器** | 默认**不包含**。你需要手动安装 Nginx 或 Traefik。 | 默认**内置 Traefik**，安装完即刻可用。 |
| **负载均衡器** | 默认**无实现**。在本地或 VPS 部署需要手动配置 MetalLB。 | 默认**内置 ServiceLB**，自动映射主机端口。 |
| **外部 IP 绑定** | 极其麻烦，需要手动处理 ARP 或外部 BGP 路由。 | 自动检测主机网卡 IP（包括公网 IP），直接生效。 |
| **存储接口** | 默认支持多种云盘，本地存储需配置 Local Path Provisioner。 | 默认**内置 Local Path Provisioner**。 |

### 3\. 你之前遇到的“Ingress 连不上公网”是怎么回事。

在裸机环境（比如你自己的 VPS 或服务器）部署原生 k8s 时，通常会遇到以下坑点：

1.  **没有 LoadBalancer 实现：** Ingress Controller 无法获得 `EXTERNAL-IP`。你可能得强行用 `hostNetwork: true` 或者 `NodePort` 才能访问。
2.  **CNI 兼容性：** 原生 k8s 常用 Calico 或 Antrea，配置复杂；而 k3s 默认使用 Flannel 并预设好了 VXLAN 模式，几乎不需要调整。
3.  **端口冲突：** 如果你是在 Arch Linux 上手动撸的 k8s，可能由于防火墙（iptables/nftables）或端口占用的微小差异导致流量进不去。

### 总结与建议

你目前的 **RevieU 项目** 既然是做架构和基建，**k3s** 确实是更好的选择，因为它：

*   **省资源：** 把所有控制平面组件打包在一个 100MB 以内的二进制文件里，非常适合你的 VPS 阵列。
*   **GitOps 友好：** 与你计划使用的 **ArgoCD** 配合非常完美，因为你不需要去折腾底层的负载均衡网络。

> **避坑指南：** \> 既然你已经在使用 k3s + ArgoCD，如果你未来想做更复杂的跨节点负载（比如防止单节点挂掉导致公网访问中断），可以考虑在 k3s 中禁用 `servicelb`，改用 **MetalLB**，配合你的公网 IP 漂移技术。

你想看看如何针对你的 RevieU 项目，在 k3s 上配置更高级的 Ingress 规则（比如自动 HTTPS 证书）吗。

### 主题 2. metalb可以映射主机吗

简单直接的回答是：**可以，但这正是 MetalLB 和 k3s 自带的 ServiceLB 最大的区别所在。**

MetalLB 的核心作用是**在没有云厂商支持的环境下，为 Kubernetes 集群模拟出一个“云负载均衡器”的体验**。

### 1\. MetalLB 是如何“映射”主机的。

MetalLB 并不像传统的 `iptables` 转发那样简单地做端口映射，它主要通过以下两种模式工作：

#### **二层模式 (Layer 2 Mode) —— 最常用的“映射”方式**

在这种模式下，MetalLB 会让集群中的某一个节点（Leader）通过 **ARP 协议**（IPv4）告诉局域网内的网关：“现在这个 VIP（虚拟 IP）就在我这儿。”

*   **效果：** 外部流量访问这个 VIP 时，流量会直接打到对应的节点上。
*   **局限：** 这本质上是**单点接收流量**。虽然 MetalLB 会在节点故障时转移 VIP，但在某一时刻，只有一个节点的网卡在处理该 VIP 的流量。

#### **BGP 模式**

如果你有自己的路由器（比如中高端的交换机或软路由），MetalLB 可以和路由器建立 BGP 邻居关系。

*   **效果：** 真正的**等价多路径负载均衡 (ECMP)**。流量会被均匀地分布到所有参与映射的主机上网卡上。

### 2\. MetalLB vs. k3s ServiceLB (Klipper)

既然你之前觉得 k3s 顺手，那是因为 k3s 默认用的是 **ServiceLB**，它和 MetalLB 的“映射”逻辑完全不同：

| 特性  | k3s ServiceLB (内置) | MetalLB (额外安装) |
| --- | --- | --- |
| **工作原理** | 在每个节点起一个 Proxy 容器，直接占用主机的 80/443 端口。 | 通过 ARP 或 BGP 宣告一个独立的 IP。 |
| **IP 使用** | **使用主机已有的 IP**（即你 VPS 的公网 IP）。 | **需要额外的独立 IP**（通常在同一网段内）。 |
| **端口冲突** | 如果主机 80 端口被 nginx 占了，它就启动失败。 | 不冲突，因为它使用全新的 VIP。 |
| **适用场景** | 只有 1 个公网 IP 的单机或小型集群。 | 拥有多个连续公网 IP 或私有网络环境。 |

### 3\. 在你的 RevieU 项目中该选哪个。

考虑到你是在 **Arch Linux** 和 **Mac Mini** 上跑 k3s，且身处 USC 校园网或一般的 VPS 环境：

1.  **如果你只有一个公网 IP：** 继续用 k3s 自带的 **ServiceLB**。它能直接把 Service 映射到你主机的 IP 上，最省心。
2.  **如果你想模拟真实的“云环境”：** 你需要禁用 k3s 自带的 `servicelb` 和 `traefik`，然后手动安装 **MetalLB**。
    *   **注意：** MetalLB 要求你有一段**未被分配**的 IP 地址。在普通的 VPS 上，除非你额外买了浮动 IP（Floating IP），否则 MetalLB 很难玩转，因为它没法凭空变出 IP。

### 避坑提醒

如果你想在 **Mac Mini (ARM)** 和 **PC (x86)** 混合的集群里用 MetalLB，务必确保你的网络环境支持 **二层广播**。校园网（如 USC Guest/Secure）通常会拦截 ARP 欺骗，这会导致 MetalLB 的 L2 模式失效。

**你想看看如何在 k3s 配置文件中禁用自带的 ServiceLB，以便给 MetalLB 腾出位置吗。**

### 主题 3. 不谈大型云厂商，其他企业自己部署k8s，然后架服务器的话，怎么办

对于不依赖 AWS/GCP 等大厂、选择**私有部署（On-Premise）**或**自建机房**的企业来说，解决“流量如何进入集群”主要有三种主流方案。

你可以根据你 RevieU 项目的规模和硬件条件，看看这些方案是如何落地的：

### 1\. 软件模拟云环境：MetalLB 或 kube-vip (最推荐)

这是大多数中小型企业自建集群的选择。因为原生 k8s 不带负载均衡器，企业会安装这些“插件”来补齐功能。

*   **实现方式：** \* **MetalLB：** 它会在你的私有网络里找一段空闲的 IP 地址池。当你创建一个 `Type: LoadBalancer` 的 Service 时，MetalLB 会“抢占”其中一个 IP 并在局域网内通过 ARP 协议宣告自己。
    *   **kube-vip：** 除了提供 LoadBalancer 外，它最强的地方在于能为 k8s 的 **控制平面 (Control Plane)** 提供一个高可用的虚拟 IP (VIP)，防止 Master 节点宕机导致整个集群失联。
*   **企业痛点：** 这种方案需要你对局域网有控制权（能分配 IP），在像你的 USC 校园网这种严管环境下可能无法直接运行，但在公司内网或自己的 VPS 阵列里非常香。

### 2\. 硬核物理设备：硬件负载均衡器 (F5 / Citrix / A10)

大型企业（尤其是金融、运营商）通常不会让 k8s 直接暴露在公网，而是前面顶一个物理盒子。

*   **实现方式：**
    1.  物理负载均衡器挂在公网，拥有公网 IP。
    2.  k8s 内部通过 **NodePort** 暴露服务（比如把端口固定在 30080）。
    3.  硬件设备配置上游（Upstream），直接把流量打到所有 Worker 节点的 30080 端口。
*   **优点：** 极其稳定，抗 DDoS 能力强，且自带硬件级的 SSL 加速。
*   **缺点：** **贵**。一个盒子的价格可能顶你一年的 VPS 租金。

### 3\. “穷人”的高性能方案：外部 Nginx / HAProxy 反向代理

这也是很多深度学习实验室或小团队最常用的方式。

*   **实现方式：**
    *   专门找一台（或一对 HA）性能强的服务器做 **Gateway**。
    *   在这台机器上装原生的 Nginx，手动配置 `proxy_pass` 到 k8s 集群节点的 NodePort。
    *   **自动化改进：** 企业会写一个简单的 Python 脚本或使用开源工具，监听 k8s API，当有新服务上线时，自动修改外部 Nginx 配置并 reload。
*   **适用场景：** 只有少量公网 IP，且不想让 k8s 复杂的网络逻辑直接暴露在最外层的情况。

### 为什么你觉得 k3s 顺手。

因为 k3s 把**方案 1**（通过 ServiceLB 插件）给**内置并自动化**了。

*   **原生 k8s：** 像一块乐高，需要自己买地基（LoadBalancer）、买窗户（Ingress Controller）。
*   **k3s：** 像是一套“精装修公寓”，地基（ServiceLB）和窗户（Traefik）都已经给你装好了。

### 给 RevieU 项目的建议

既然你现在是 **Arch + Mac Mini** 的混合架构，我建议你走 **方案 1 的变体**：

1.  继续使用 **k3s**。
2.  如果你觉得自带的 Traefik 不好用，可以禁用它，换成 **Cloudflare Tunnel (cloudflared)**。
    *   **优势：** 你不需要公网 IP，也不需要配置 Ingress。Cloudflare 会在你的 Mac Mini 里起一个隧道，直接把流量从 CF 边缘节点引流到你的 k3s Service。这对你这种在学校或家里部署的环境来说是“神技”。

**你需要我帮你写一个在 k3s 中部署 Cloudflare Tunnel 的配置文件模板吗。**

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
