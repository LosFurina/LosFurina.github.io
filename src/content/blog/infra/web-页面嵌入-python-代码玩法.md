---
title: "Web 页面嵌入 Python 代码玩法"
description: "玩法： 在 HTML 中引入 PyScript 的 JS 文件，然后使用 或 标签直接写 Python。"
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-Web 页面嵌入 Python 代码玩法.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文基于实际问题整理：有没有在web页面中嵌入python代码的玩法。

## 核心结论

- 玩法： 在 HTML 中引入 PyScript 的 JS 文件，然后使用 或 标签直接写 Python。
- DOM 操作：可以用 Python 操作 HTML 元素（替代 ）。
- 缺点： 首次加载较慢（需要下载 Python 运行时环境）。
- 玩法： 这是一个编译成 WASM 的 CPython 发行版。你可以在 JS 中调用。
- 场景： 在网页中做一个 Python 在线编辑器、数据科学演示 demo。

## 详细说明

### 实现思路 1

随着 WebAssembly (WASM) 的成熟，Python 已经不再局限于后端，可以直接跑在浏览器里了

玩法： 在 HTML 中引入 PyScript 的 JS 文件，然后使用 或 标签直接写 Python

### 有没有rust往web里面写的

使用组件化开发，有 Virtual DOM

你写的一个组件，可以编译成 Web 页面、 桌面应用 (Tauri)、甚至 终端 UI (TUI) 和 移动端应用

## 操作步骤与命令示例

### 示例 1

```bash
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://pyscript.net/releases/2024.1.1/core.css">
    <script type="module" src="https://pyscript.net/releases/2024.1.1/core.js"></script>
</head>
<body>
    <h1>Hello from PyScript!</h1>
    <div id="output"></div>
    <script type="py">
        from pyscript import display
        import datetime
        now = datetime.datetime.now()
        display(f"Current time: {now}", target="output")
    </script>
</body>
</html>
```

### 示例 2

```bash
use leptos::*;
#[component]
pub fn SimpleCounter() -> impl IntoView {
    // 创建一个 Signal（响应式信号）
    let (value, set_value) = create_signal(0);
    view! {
        <div>
            <button on:click=move |_| set_value.update(|n| *n += 1)>
                "点击 +1"
            </button>
            <p>"当前数值: " {value}</p>
        </div>
    }
}
```

### 示例 3

```bash
use yew::prelude::*;
#[function_component(App)]
fn app() -> Html {
    let counter = use_state(|| 0);
    let onclick = {
        let counter = counter.clone();
        move |_| counter.set(*counter + 1)
    };
    html! {
        <div>
            <button {onclick}>{ "+1" }</button>
            <p>{ *counter }</p>
        </div>
    }
}
```

### 执行顺序建议

1. 明确目标环境、依赖条件与网络连通性。
2. 分阶段实施配置或部署，逐步验证。
3. 记录最终状态与回滚策略，便于复用。

## 常见问题与排查

- **问题：** 有没有rust往web里面写的  **排查：** 使用组件化开发，有 Virtual DOM；你写的一个组件，可以编译成 Web 页面、 桌面应用 (Tauri)、甚至 终端 UI (TUI) 和 移动端应用

## 关键问答摘录

> **Q:** 有没有rust往web里面写的
>
> **A:** 使用组件化开发，有 Virtual DOM；你写的一个组件，可以编译成 Web 页面、 桌面应用 (Tauri)、甚至 终端 UI (TUI) 和 移动端应用

## 总结

玩法： 在 HTML 中引入 PyScript 的 JS 文件，然后使用 或 标签直接写 Python。

- 原始对话来源：https://gemini.google.com/app/84634ffcf50bf112
