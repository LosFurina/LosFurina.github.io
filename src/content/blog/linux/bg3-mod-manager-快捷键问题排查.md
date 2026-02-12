---
title: "BG3 Mod Manager 快捷键问题排查"
description: "检查 DWrite.dll 重定向： 你需要在 Steam 的游戏启动选项中添加以下参数，强制 Wine 使用你下载的 DLL 而不是系统的。"
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "linux"
tags: ["linux"]
sourcePath: "src/content/blog/Gemini-BG3 Mod Manager 快捷键问题排查.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文基于实际问题整理：我在arch上玩bg3，安装了 mod config manager，但是进去之后发现通用的 ins 键不生效。

## 核心结论

- 检查 DWrite.dll 重定向： 你需要在 Steam 的游戏启动选项中添加以下参数，强制 Wine 使用你下载的 DLL 而不是系统的
- 检查控制台： 如果 Script Extender 正常运行，游戏启动时通常会弹出一个额外的控制台窗口（在 Linux 下可能隐藏在后台）。
- 测试 XWayland 兼容性： 尝试在启动项中加入，强制游戏以 XWayland 模式运行，看看按键是否生效。
- Fn 键检查： 在很多紧凑型键盘或笔记本上， 键需要配合 键使用。确保你的键盘映射在 Linux 下是正确的（可以通过 命令测试系统是否收...
- 定位到游戏的 Local AppData 路径（在 Steam Deck/Linux 上通常位于）

## 详细说明

### 实现思路 1

检查 DWrite.dll 重定向： 你需要在 Steam 的游戏启动选项中添加以下参数，强制 Wine 使用你下载的 DLL 而不是系统的

检查控制台： 如果 Script Extender 正常运行，游戏启动时通常会弹出一个额外的控制台窗口（在 Linux 下可能隐藏在后台）

### 实现思路 2

对于《博德之门 3》，最常见的注入失效通常源于文件权限、路径不匹配或 Wine 环境的配置问题

Proton 默认会优先使用自带的系统 DLL，而 Script Extender (BG3SE) 通常伪装成

### 实现思路 3

确认： 检查 的大小，通常应该在几百 KB 到几 MB 之间

解决： 确保你下载的是 Script Extender v20 或更高版本的 64位 (x64) 版本

## 操作步骤与命令示例

### 示例 1

```bash
WINEDLLOVERRIDES="DWrite=n,b" %command%
```

### 示例 2

```bash
{
        "CreateConsole": true,
        "EnableLogging": true
    }
```

### 示例 3

```bash
protontricks 1086940 c++_redist_2015
```

### 示例 4

```bash
WINEDLLOVERRIDES="dwrite=n" %command%
```

### 执行顺序建议

1. 确认当前系统版本、服务状态与关键配置文件。
2. 按最小变更原则执行命令或修改配置。
3. 通过日志、状态命令和实际行为完成验证。

## 常见问题与排查

- **问题：** 如何开始  **排查：** 先确认当前状态和目标，再按步骤执行并验证结果。

## 关键问答摘录

> **Q:** 这篇内容适合谁？
>
> **A:** 适合需要快速理解主题并执行实践步骤的读者。

## 总结

检查 DWrite.dll 重定向： 你需要在 Steam 的游戏启动选项中添加以下参数，强制 Wine 使用你下载的 DLL 而不是系统的。

- 原始对话来源：https://gemini.google.com/app/021e7c0950b068c0
