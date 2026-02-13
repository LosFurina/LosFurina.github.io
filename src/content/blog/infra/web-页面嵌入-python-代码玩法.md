---
title: "Web 页面嵌入 Python 代码玩法"
description: "玩法： 在 HTML 中引入 PyScript 的 JS 文件，然后使用 或 标签直接写 Python。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-Web 页面嵌入 Python 代码玩法.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“有没有在web页面中嵌入python代码的玩法”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. 有没有在web页面中嵌入python代码的玩法

在 Web 页面中“嵌入” Python 代码，现在的玩法主要分为 **前端直接运行 (WebAssembly)** 和 **全栈 Python 框架 (无 JS 开发)** 两大类。

随着 WebAssembly (WASM) 的成熟，Python 已经不再局限于后端，可以直接跑在浏览器里了。

以下是目前主流的几种玩法：

### 1\. 浏览器原生运行 (基于 WebAssembly)

这是最符合你“在 Web 页面嵌入 Python”字面意思的玩法。Python 解释器被编译成 WebAssembly，直接在用户的浏览器中运行，无需后端服务器支持。

#### **A. PyScript (目前最火)**

Anaconda 推出的项目，旨在让 Python 像 JavaScript 一样在 HTML 中运行。

*   **玩法：** 在 HTML 中引入 PyScript 的 JS 文件，然后使用 `<py-script>` 或 `<script type="py">` 标签直接写 Python。
*   **特点：**
    *   可以直接导入 `numpy`, `pandas`, `matplotlib` 等库。
    *   DOM 操作：可以用 Python 操作 HTML 元素（替代 `document.getElementById`）。
    *   **缺点：** 首次加载较慢（需要下载 Python 运行时环境）。

**代码示例：**

```
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

#### **B. Pyodide**

PyScript 的底层引擎。如果你觉得 PyScript 封装太重，想自己控制 Python 的加载和交互逻辑，可以直接用 Pyodide。

*   **玩法：** 这是一个编译成 WASM 的 CPython 发行版。你可以在 JS 中调用 `pyodide.runPython("...")`。
*   **场景：** 在网页中做一个 Python 在线编辑器、数据科学演示 demo。

### 2\. Python 转译为 JavaScript (Transpilers)

这种方式不是运行 Python 解释器，而是把 Python 语法“翻译”成 JavaScript 代码执行。

#### **Brython (Browser Python)**

*   **玩法：** 引入 `brython.js`，在 `<script type="text/python">` 中写代码。
*   **特点：**
    *   启动速度比 PyScript 快（因为不需要加载几 MB 的 WASM 环境）。
    *   **缺点：** 不支持 C 扩展库（如 numpy, pandas 没法用），只能用纯 Python 逻辑操作 DOM。

### 3\. 全栈 Python 框架 (Write Python, Get Web App)

这种玩法不是在现有的 HTML 里插代码，而是**只写 Python**，框架自动帮你生成前端（React/Vue）和后端。适合不想写 CSS/JS 的开发者。

#### **A. Reflex (原 Pynecone)**

*   **核心：** 它可以编译成 Next.js/React 应用。你用 Python 写 UI 组件和状态逻辑。
*   **适合：** 构建复杂的 SaaS 应用或内部工具，且你需要 React 的性能但只想写 Python。

#### **B. Streamlit / Gradio**

*   **核心：** 面向数据科学。几行 Python 代码就能生成交互式的 Web 界面。
*   **适合：** 快速展示 AI 模型、数据可视化图表。不支持复杂的自定义前端交互。

#### **C. Flet**

*   **核心：** 基于 Flutter。用 Python 写 UI，可以打包成 Web、桌面应用和移动端 App。

### 总结与选型建议

| 需求场景 | 推荐方案 | 核心技术 | 优点  | 缺点  |
| --- | --- | --- | --- | --- |
| **我想在 HTML 里直接写 Python** | **PyScript** | WebAssembly | 原生感强，支持科学计算库 | 加载慢，不适合生产环境的大型应用 |
| **我想用 Python 操作 DOM 且轻量** | **Brython** | Transpiler | 启动快，语法兼容好 | 不支持 Numpy/Pandas |
| **我是后端，想用 Python 写全栈 Web** | **Reflex** | React 封装 | 开发效率极高，不仅是 Demo | 学习框架特有的 Python DSL 成本 |
| **我只想快速展示数据/模型** | **Streamlit** | 后端渲染 | 极速上手 | 界面定制能力差 |

**你想尝试哪种方向。** 如果是为了个人项目（比如那个 RevieU 项目的后台监控面板），**Reflex** 或者 **Streamlit** 会非常高效；如果是为了在博客里展示可交互的代码，**PyScript** 是最好玩的。

我可以为你提供一个具体的 **PyScript 结合 Matplotlib 画图** 的 Demo 代码，你想看看吗。

### 主题 2. 有没有rust往web里面写的

**有。而且 Rust 实际上是目前 WebAssembly (WASM) 领域最强、最成熟的语言。**

不像 Python 在浏览器里还需要下载一个解释器（PyScript），Rust 是直接编译成二进制的 `.wasm` 文件，**体积极其小，运行速度接近原生**，且不需要垃圾回收（GC）。

现在 Rust 写 Web 前端（替代 JavaScript/TypeScript）主要有“三巨头”框架：

### 1\. Leptos (目前最火 )

这是目前 Rust 社区最推崇的框架。

*   **风格：** 类似 **SolidJS**。它使用细粒度的响应式系统（Signals），没有 Virtual DOM（虚拟 DOM），直接操作真实 DOM，性能极高。
*   **特点：** 全栈支持（SSR）、性能吊打 React/Vue、类型极其安全。
*   **适合：** 追求极致性能，或者喜欢现代响应式编程范式的人。

**代码长这样 (Leptos):**

```
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

### 2\. Yew (老牌经典 ️)

它是 Rust 前端框架的“老大哥”，生态最成熟。

*   **风格：** 非常像 **React**。使用组件化开发，有 Virtual DOM。
*   **特点：** 社区文档最全，坑最少，但也最“重”一些。它使用了类似 JSX 的宏（`html!`）。
*   **适合：** 从 React 转过来的开发者，或者求稳的项目。

**代码长这样 (Yew):**

```
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

### 3\. Dioxus (跨平台多面手 )

它的野心很大，不仅仅是 Web。

*   **风格：** 类似 React。
*   **特点：** **一套代码，到处运行**。你写的一个组件，可以编译成 Web 页面、**桌面应用** (Tauri)、甚至 **终端 UI** (TUI) 和 移动端应用。
*   **适合：** 你想写一个工具，既要有网页版，又要有桌面客户端版。

### 4\. 核心工具链 (幕后功臣)

要在浏览器跑 Rust，你离不开这两个工具：

1.  **wasm-bindgen:** 它是 Rust 和 JavaScript 之间的“翻译官”。它让你可以在 Rust 里调用 `window.alert`，或者在 JS 里调用 Rust 函数。
2.  **Trunk:** 类似于前端的 Webpack/Vite。你只需运行 `trunk serve`，它就会自动编译 Rust 为 WASM，打包 HTML，并开启热更新服务器。

### 总结：Rust vs Python 在 Web 端的区别

| 特性  | Python (PyScript) | Rust (Leptos/Yew/WASM) |
| --- | --- | --- |
| **原理** | 下载 WASM 版的解释器 -\> 跑源码 | 源码编译成 WASM 二进制 -\> 直接跑 |
| **体积** | 很大 (几 MB 起步) | 很小 (Hello World 约 100kb，压缩后更小) |
| **速度** | 慢 (解释执行) | **极快** (接近原生 C++) |
| **用途** | 数据展示、Demo、教学 | **生产级 Web 应用**、图像处理、游戏 |

**建议：** 如果你想体验“Rust 全栈开发”，强烈建议从 **Leptos** 入手。 你需要我演示一下**如何用 3 行命令把一个 Rust 写的网页跑起来**吗。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
