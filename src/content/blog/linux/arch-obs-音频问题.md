---
title: "Arch OBS 音频问题"
description: "Desktop Audio / Mic Audio 随便，不是重点。"
pubDate: "2026-02-09"
updatedDate: "2026-02-09"
category: "linux"
tags: ["linux"]
sourcePath: "src/content/blog/ChatGPT-Arch OBS 音频问题.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文基于实际问题整理：我现在视频的声音是不对的，断断续续还有颤音,我是在archlinx，obsstudio。

## 核心结论

- Desktop Audio / Mic Audio 随便，不是重点
- HSP / HFP 模式
- 或在 里把 profile 固定
- OBS Sample Rate = 48kHz
- 显示 = 48000Hz

## 详细说明

### 实现思路 1

而是 Arch 太自由，默认配置不替你兜底

或一步到位给你一套 “Arch + OBS 录视频黄金配置”

### 实现思路 2

不是你操作菜，是 PipeWire 这玩意儿真能一行配置把音频系统送走

1️⃣ 删掉那段配置（或直接整个文件）

### 实现思路 3

“我需要一个 48k 的 master clock”

而且 问题不在采样率了，在 蓝牙输出 + USB 单声道输入 + PipeWire 自动切换 这一坨组合拳

## 操作步骤与命令示例

### 示例 1

```bash
pactl info | grep "Sample Specification"
```

### 示例 2

```bash
Sample Specification: s16le 2ch 44100Hz
```

### 示例 3

```bash
mkdir -p ~/.config/pipewire
nano ~/.config/pipewire/pipewire.conf
```

### 示例 4

```ini
context.properties = {
    default.clock.rate = 48000
    default.clock.allowed-rates = [ 48000 ]
}
```

### 执行顺序建议

1. 确认当前系统版本、服务状态与关键配置文件。
2. 按最小变更原则执行命令或修改配置。
3. 通过日志、状态命令和实际行为完成验证。

## 常见问题与排查

- **问题：** kde有没有自带录音  **排查：** ✅ KDE 自带录音软件： Audio Recorder（KRecorder）；这是 KDE 官方出的，不是第三方野路子，用来做 排错录音 非常合适

## 关键问答摘录

> **Q:** kde有没有自带录音
>
> **A:** ✅ KDE 自带录音软件： Audio Recorder（KRecorder）；这是 KDE 官方出的，不是第三方野路子，用来做 排错录音 非常合适

## 总结

Desktop Audio / Mic Audio 随便，不是重点。

- 原始对话来源：https://chatgpt.com/c/698a5b0f-d0fc-8327-ba87-a6c05a7c39d4
