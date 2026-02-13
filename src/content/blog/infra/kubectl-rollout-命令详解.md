---
title: "kubectl rollout 命令详解"
description: "场景： 在 CI/CD 流水线中，确保新版本完全启动后再进行下一步。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-kubectl rollout 命令详解.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“kubectl rollout是干什么的”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. kubectl rollout是干什么的

简单来说，`kubectl rollout` 是 Kubernetes 中用于**管理资源更新过程**的命令。

当你修改了 Deployment、StatefulSet 或 DaemonSet 的配置（比如更新了镜像版本）时，Kubernetes 不会瞬间完成替换，而是通过一个“滚动”的过程逐步替换旧的 Pod。`kubectl rollout` 就是你控制、观察和撤销这个过程的遥控器。

### 核心功能与常用操作

#### 1\. 查看更新状态 (`status`)

当你执行了更新指令后，可以用它来观察新版本是否已经成功部署。

*   **指令：** `kubectl rollout status deployment/my-app`
*   **场景：** 在 CI/CD 流水线中，确保新版本完全启动后再进行下一步。

#### 2\. 查看历史版本 (`history`)

Kubernetes 会记录你对资源进行的历次修改。

*   **指令：** `kubectl rollout history deployment/my-app`
*   **提示：** 如果你在更新时使用了 `--record` 参数（虽然该参数已过时，但逻辑一致），你能看到更详细的变化说明。

#### 3\. 版本回滚 (`undo`)

这是该命令最强大的地方。如果新版本上线后发现 Bug，可以一键回到上一个版本或指定版本。

*   **回到上一版：** `kubectl rollout undo deployment/my-app`
*   **回到特定版：** `kubectl rollout undo deployment/my-app --to-revision=2`

#### 4\. 暂停与恢复 (`pause` / `resume`)

如果你想在更新过程中做一些复杂的配置调整，或者想手动控制滚动进度，可以先暂停。

*   **暂停：** `kubectl rollout pause deployment/my-app`
*   **恢复：** `kubectl rollout resume deployment/my-app`

#### 5\. 重启资源 (`restart`)

有时候你没有修改任何配置，但想让所有 Pod 重新启动（例如为了重新读取 ConfigMap 或 Secret 的变更）。

*   **指令：** `kubectl rollout restart deployment/my-app`

### 滚动更新的工作原理

为了保证服务不中断，Kubernetes 默认采用 **RollingUpdate** 策略。它会启动一部分新 Pod，等它们准备就绪后再杀掉一部分旧 Pod。

| 特性  | 描述  |
| --- | --- |
| **无缝衔接** | 通过控制 `maxSurge`（允许超出期望值的 Pod 数）确保流量不中断。 |
| **安全自愈** | 如果新 Pod 启动失败，滚动会停止，防止故障扩大。 |
| **版本追溯** | 结合 `ReplicaSets` 保留旧版本的配置快照，实现快速回滚。 |

### 避坑指南

*   **仅限特定资源：** 该命令主要针对 `Deployments`, `StatefulSets`, 和 `DaemonSets`。普通的 Pod 或 Job 是没有 "rollout" 概念的。
*   **触发机制：** 只有修改了 Pod 模板（`.spec.template`）时才会触发滚动更新。如果你只是修改了副本数量（replicas），是不产生新修订版本的。

**你想看看如何结合具体业务场景（比如设置回滚限制数量）来优化你的 Deployment 配置吗。**

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
