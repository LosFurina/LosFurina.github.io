---
title: "Arch 输入法窗口切换问题"
description: "解决 Arch 切换窗口后输入法自动回中文的问题，重点配置 Fcitx5 的共享状态与默认布局。"
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "linux"
tags: ["linux"]
sourcePath: "src/content/blog/Gemini-Arch 输入法窗口切换问题.md"
sourceVault: "chat-export"
---
## 背景与适用场景

在 Arch Linux 中使用 Fcitx5 时，常见现象是切换应用窗口后输入法状态自动回到中文。本文适用于希望默认保持英文、仅在需要时手动切中文的场景。

## 核心结论

- 在 Fcitx5 设置中将 `Share input state between applications` 设置为 `All`。
- 将输入法列表中的 `Keyboard - English` 放到最前，确保默认状态是英文。
- 取消 `Use system keyboard layout`，避免桌面环境覆盖输入法行为。
- 修改环境变量后重启 Fcitx5，再验证不同应用间的切窗行为。

## 详细说明

### 实现思路 1

在 `Fcitx5 Configuration` 的全局选项里，定位到“应用间共享输入状态”。

将策略调整为 `All`，可让输入法状态在窗口之间保持一致。

### 实现思路 2

在“输入法”列表中确认 `Keyboard - English` 在第一位，避免会话启动后直接进入中文输入。

如果系统级布局与 Fcitx5 冲突，优先以 Fcitx5 内部布局为准。

### 实现思路 3

确认会话内环境变量已指向 Fcitx5（GTK、Qt、XMODIFIERS）。

修改后重启 Fcitx5 或重新登录，再进行跨应用验证。

## 操作步骤与命令示例

### 示例 1

```bash
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

### 示例 2

```bash
fcitx5 -rd
```

### 执行顺序建议

1. 确认当前系统版本、服务状态与关键配置文件。
2. 按最小变更原则执行命令或修改配置。
3. 通过日志、状态命令和实际行为完成验证。

## 常见问题与排查

- **问题：** 切窗后又回到中文  **排查：** 先检查 `Share input state between applications` 是否为 `All`，再确认输入法列表首位是英文。
- **问题：** 某些应用不遵循切换状态  **排查：** 检查环境变量是否生效，并在应用重启后复测。

## 关键问答摘录

> **Q:** 最关键的设置项是什么？
>
> **A:** `Share input state between applications = All`，它决定了切窗后是否保持同一输入状态。

> **Q:** 如何保证默认英文输入？
>
> **A:** 把 `Keyboard - English` 放在输入法列表第一位，并关闭系统布局覆盖项。

## 总结

先统一 Fcitx5 的共享状态，再固定默认英文布局，通常即可解决 Arch 切窗后自动回中文的问题。

- 原始对话来源：https://gemini.google.com/app/64d4f7f398588a16
