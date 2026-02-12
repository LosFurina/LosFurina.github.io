---
title: "k8s vs k3s: Ingress 体验对比"
description: "原生 k8s： 如果你不在云平台上，这个 Service 会永远卡在 状态，因为 k8s 不知道如何去向你的路由器或公网申请一个 IP。"
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-k8s vs k3s_ Ingress 体验对比.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文基于实际问题整理：k8s的实际体验和k3s有区别吗，我之前部署过k8s，但是ingress似乎连不上公网ip，但是k3s很流畅，是我的错觉吗。

## 核心结论

- 原生 k8s： 如果你不在云平台上，这个 Service 会永远卡在 状态，因为 k8s 不知道如何去向你的路由器或公网申请一个 IP。
- 没有 LoadBalancer 实现： Ingress Controller 无法获得。你可能得强行用 或者 才能访问。
- CNI 兼容性： 原生 k8s 常用 Calico 或 Antrea，配置复杂；而 k3s 默认使用 Flannel 并预设好了 VXLA...
- 端口冲突： 如果你是在 Arch Linux 上手动撸的 k8s，可能由于防火墙（iptables/nftables）或端口占用的微小差异...
- 省资源： 把所有控制平面组件打包在一个 100MB 以内的二进制文件里，非常适合你的 VPS 阵列。

## 详细说明

### 实现思路 1

在原生 k8s 中，部署了 Ingress Controller 后，你通常需要创建一个 类型为 的服务

2\. 深度对比：网络与外部访问

### metalb可以映射主机吗

通过 ARP 或 BGP 宣告一个独立的 IP

简单直接的回答是： 可以，但这正是 MetalLB 和 k3s 自带的 ServiceLB 最大的区别所在

### 实现思路 3

你可以根据你 RevieU 项目的规模和硬件条件，看看这些方案是如何落地的

当你创建一个 的 Service 时，MetalLB 会“抢占”其中一个 IP 并在局域网内通过 ARP 协议宣告自己

## 操作步骤与命令示例

### 示例 1

```bash
git shortlog -sn
```

### 示例 2

```bash
git log --author="姓名" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```

### 执行顺序建议

1. 明确目标环境、依赖条件与网络连通性。
2. 分阶段实施配置或部署，逐步验证。
3. 记录最终状态与回滚策略，便于复用。

## 常见问题与排查

- **问题：** metalb可以映射主机吗  **排查：** 通过 ARP 或 BGP 宣告一个独立的 IP；简单直接的回答是： 可以，但这正是 MetalLB 和 k3s 自带的 ServiceLB 最大的区别所在

## 关键问答摘录

> **Q:** metalb可以映射主机吗
>
> **A:** 通过 ARP 或 BGP 宣告一个独立的 IP；简单直接的回答是： 可以，但这正是 MetalLB 和 k3s 自带的 ServiceLB 最大的区别所在

## 总结

原生 k8s： 如果你不在云平台上，这个 Service 会永远卡在 状态，因为 k8s 不知道如何去向你的路由器或公网申请一个 IP。

- 原始对话来源：https://gemini.google.com/app/b34544ec975c4617
