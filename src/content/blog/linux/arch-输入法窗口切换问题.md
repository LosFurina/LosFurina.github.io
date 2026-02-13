---
title: "Arch 输入法窗口切换问题"
description: "解决 Arch 切换窗口后输入法自动回中文的问题，重点配置 Fcitx5 的共享状态与默认布局。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "linux"
tags: ["linux"]
sourcePath: "src/content/blog/Gemini-Arch 输入法窗口切换问题.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“我在arch上，为什么每次一切窗口，输入自动就换中文了，我要保持英文，在...”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. 我在arch上，为什么每次一切窗口，输入自动就换中文了，我要保持英文，在...

这通常是因为你的输入法框架（大概率是 **fcitx5** 或 **ibus**）开启了“全局状态”或者“每个窗口独立状态”的设置，导致它在切换窗口时自动回退到了默认的中文输入状态。

作为一个 Arch 用户，这种“自作聪明”的行为确实很让人恼火。你可以按照以下步骤来锁定英文优先：

### 1\. 如果你使用的是 Fcitx5 (推荐)

Fcitx5 默认可能会记住每个窗口的状态。

*   **打开设置**：在终端输入 `fcitx5-configtool`。
*   **全局选项 (Global Options)**：
    *   找到 **"为每个程序使用单独的输入法" (Share input state between applications)**。
    *   将其设置为 **"所有程序共享" (All)**。这样你在一个窗口切了英文，全系统都会保持英文。
*   **输入法顺序**：确保你的“当前输入法”列表中，**键盘 - 英语 (Keyboard - English)** 排在最上面。Fcitx5 默认启动时会加载第一个。

### 2\. 如果你使用的是 IBus

IBus 的行为更怪异一些，通常需要强制重置：

*   **打开设置**：执行 `ibus-setup`。
*   **高级 (Advanced)**：
    *   取消勾选 **"使用系统键盘布局" (Use system keyboard layout)**。
    *   勾选 **"所有窗口共享同一输入法" (Share the same input method among all windows)**。

### 3\. 检查系统环境变量

有时候环境变量会导致输入法引擎强制初始化。检查你的 `~/.xprofile`、`~/.bashrc` 或 `/etc/environment`：

```
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

确保这些指向的是你正在使用的框架。

### 4\. 进阶：使用插件或脚本 (Vim 玩家必看)

如果你是因为在 Neovim 或写代码时频繁切换窗口感到痛苦：

*   **fcitx5-remote**：你可以安装这个小工具。
*   **Vim 插件**：比如 `fcitx.vim`，它能在你进入 Normal 模式时自动切回英文，进入 Insert 模式时恢复之前的状态。

**你是用的哪种桌面环境（KDE, GNOME 还是 i3/Sway 这种 TWM）。** 不同的 WM 对窗口焦点的处理逻辑不一样，如果你告诉我你的环境，我可以给你更具体的配置文件改法。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
