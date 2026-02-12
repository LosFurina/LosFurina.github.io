---
title: "K3s 双节点集群部署指南"
description: "网络连通性：两台机器之间需要互通。如果是跨云厂商，建议使用 Tailscale 或 WireGuard 建立虚拟内网，或者确保防火墙开放了..."
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-K3s 双节点集群部署指南.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文基于实际问题整理：我准备在两台vps上部署k3s，然后作为两个界点串联起来。

## 核心结论

- 网络连通性：两台机器之间需要互通。如果是跨云厂商，建议使用 Tailscale 或 WireGuard 建立虚拟内网，或者确保防火墙开放了...
- (API Server)
- (Kubelet Metrics)
- (Flannel VXLAN)
- 系统环境：虽然你喜欢 Arch，但如果 VPS 运行的是其他发行版，k3s 也能完美支持。

## 详细说明

### 实现思路 1

在开始之前，确保两台 VPS 满足以下条件

如果是跨云厂商，建议使用 Tailscale 或 WireGuard 建立虚拟内网，或者确保防火墙开放了以下端口

### 实现思路 2

如果这台旧服务器性能较弱，我们应该通过 Taints（污点） 限制它运行任务，或者直接将新性能好的 VPS 设为新的 Server

如果你不想重装，只是想让旧服务器只负责“发号施令”，不占用内存跑具体的业务程序（如你的 RevieU 后端），你可以给它打上“污点”

### server和agent有什么区别

建议： 如果你决定用性能强的新机器当 Server，那它既是管理节点也是主力运行节点

建议： 如果你让旧机器当 Server，一定要用 （污点）把它的业务承载能力关掉，否则它可能会因为内存不足把整个集群带崩

## 操作步骤与命令示例

### 示例 1

```bash
curl -sfL https://get.k3s.io | sh -
```

### 示例 2

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

### 示例 3

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<SERVER_IP>:6443 K3S_TOKEN=<NODE_TOKEN> sh -
```

### 示例 4

```bash
# 这里的 <node-name> 通常是你的主机名
    kubectl taint nodes <node-name> node-role.kubernetes.io/control-plane:NoSchedule
```

### 执行顺序建议

1. 明确目标环境、依赖条件与网络连通性。
2. 分阶段实施配置或部署，逐步验证。
3. 记录最终状态与回滚策略，便于复用。

## 常见问题与排查

- **问题：** server和agent有什么区别  **排查：** 建议： 如果你决定用性能强的新机器当 Server，那它既是管理节点也是主力运行节点；建议： 如果你让旧机器当 Server，一定要用 （污点）把它的业务承载能力关掉，否...
- **问题：** Alias tip: kgp -A  **排查：** 这意味着你的 Server 节点已经完全按照预期配置好了，所有的内网指令和证书都已经绑定到了私有网络；直接粘贴下面的命令（记得替换 Token）

## 关键问答摘录

> **Q:** server和agent有什么区别
>
> **A:** 建议： 如果你决定用性能强的新机器当 Server，那它既是管理节点也是主力运行节点；建议： 如果你让旧机器当 Server，一定要用 （污点）把它的业务承载能力关掉，否...

> **Q:** Alias tip: kgp -A
>
> **A:** 这意味着你的 Server 节点已经完全按照预期配置好了，所有的内网指令和证书都已经绑定到了私有网络；直接粘贴下面的命令（记得替换 Token）

## 总结

网络连通性：两台机器之间需要互通。如果是跨云厂商，建议使用 Tailscale 或 WireGuard 建立虚拟内网，或者确保防火墙开放了..。

- 原始对话来源：https://gemini.google.com/app/456de9417aec5a93
