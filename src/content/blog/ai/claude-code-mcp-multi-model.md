---
title: "多模型协同开发：为 Claude Code 配置 Gemini 与 Codex MCP 助手"
description: "通过 MCP 协议将 Google Gemini 和 OpenAI Codex 接入 Claude Code，构建以 Claude 为主控的多模型协同开发环境。"
pubDate: "2026-02-14"
category: "ai"
tags: ["ai"]
---

## 背景：AI 辅助开发的新阶段

Claude Code 是 Anthropic 推出的命令行工具，它不是一个简单的聊天框——而是一个能直接读写文件、运行命令、搜索代码的开发 Agent。

但即便强如 Claude，在面对超大规模代码分析、跨领域头脑风暴或特定场景的代码生成时，也难免有其盲区。一个自然的想法是：**能不能让 Claude 同时调用 Google Gemini 和 OpenAI Codex，各取所长？**

答案是可以的，靠的就是 **MCP（Model Context Protocol）**。

## MCP 是什么：AI 世界的"标准插头"

MCP 是 Anthropic 推出的一项开放标准协议。它的核心理念是将"工具"和"数据源"与 AI 模型解耦：

- **Claude Code 充当 MCP Client（客户端）**：在对话中决定何时调用外部能力，并把结果合并回上下文
- **MCP Server 提供工具能力**：对外暴露一组可调用的工具（tools），可能还包括可读取的资源（resources）或提示模板（prompts）
- **传输方式通常是 stdio**：MCP Server 以本地进程形式运行，Claude Code 通过标准输入输出与其交换结构化消息（也支持 HTTP/SSE 等其他传输方式，本文示例均为 stdio）

从工程角度看，MCP 的价值在于：

1. **解耦**：Claude Code 不需要"原生支持"每个模型或工具，只要支持 MCP 协议，就能接入各种 Server
2. **可编排**：你可以同时接入多个 Server，让 Claude 做路由和仲裁，形成稳定的工作流

需要注意的一个局限性：不同模型之间并没有"共享内存"。协同靠的是 Claude Code 作为中转，将模型 A 的输出传递给模型 B。如果多轮协同导致上下文过长，仍需注意 Claude 自身的上下文窗口限制。

## 为什么需要多模型协作

多模型不是为了"堆模型"，而是为了**把正确的任务交给正确的模型**：

| 角色 | 模型 | 核心能力 |
| :--- | :--- | :--- |
| 主控 / 架构师 | Claude | 逻辑推理、任务分解、代码重构、最终验收 |
| 外脑 / 研究员 | Gemini | 超长上下文分析、全局理解、头脑风暴、交叉验证 |
| 执行器 / 施工队 | Codex | 精准代码生成、批量改动、代码审查、自动化执行 |

具体来说，多模型协作解决三个问题：

**弥补知识盲区**：每个模型的训练语料和权重侧重各不相同。Claude 擅长推理，Gemini 拥有超长上下文窗口（1M~2M tokens，视具体模型版本而定）适合全局扫描，Codex 在代码模式识别上有独特优势。

**交叉验证**：在关键架构决策或安全审计中，通过 Claude 驱动 Gemini 进行"二审"，能有效降低 AI 幻觉（Hallucination）带来的风险。

**分层处理**：简单的样板代码或文档生成可以交给副手完成，让 Claude 专注于最核心的逻辑判断。

## 整体架构

```text
                   (你)
                    |
                    v
        Claude Code (主控 Orchestrator)
           |                    |
           | MCP 调用            | MCP 调用
           v                    v
  gemini-mcp-tool         codex-mcp-server
   (Gemini MCP Server)    (Codex MCP Server)
           |                    |
           v                    v
     Google Gemini         OpenAI Codex CLI
```

关键原则：

- **只让 Claude 直接和你对话**，统一口径、格式和验收标准
- **Gemini 和 Codex 不直接决策**，它们只是被 Claude 召唤来完成子任务
- **Claude 负责最终交付**：融合多方输出，去重、纠错、补充边界条件

## 安装与配置

### 前提条件

- Node.js v16.0.0 或更高版本
- Claude Code CLI 已安装并可用

### 配置 Gemini MCP Server

> **注意**：[gemini-mcp-tool](https://github.com/jamubc/gemini-mcp-tool) 是第三方社区维护的桥接项目，非 Google 官方出品。建议在使用前查看其源代码，确保不会上传敏感信息。

该工具桥接 Claude 和 Google Gemini，提供代码分析、头脑风暴等能力。

**第一步：配置认证**

Gemini MCP 底层使用 Gemini CLI，支持多种认证方式：

方式一：通过环境变量设置 API Key（访问 [Google AI Studio](https://aistudio.google.com/) 获取）：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export GEMINI_API_KEY="你的_GEMINI_API_KEY"
```

方式二：通过 OAuth 登录（如果已安装 Gemini CLI）：

```bash
gemini auth login
```

**第二步：注册 MCP Server**

```bash
claude mcp add gemini-cli -- npx -y gemini-mcp-tool
```

这条命令做了什么：
- `claude mcp add gemini-cli`：在 Claude Code 中注册名为 `gemini-cli` 的 MCP Server
- `-- npx -y gemini-mcp-tool`：指定启动方式，通过 npx 拉取并运行

**第三步：验证安装**

运行以下命令确认 `gemini-cli` 已注册：

```bash
claude mcp list
```

或者在 Claude Code 交互界面中输入 `/mcp`，确认 `gemini-cli` 显示为 active 状态。

### 配置 Codex MCP Server

> **注意**：[codex-mcp-server](https://github.com/tuannvm/codex-mcp-server) 是第三方社区维护的桥接项目，非 OpenAI 官方出品。请在使用前审查其源码。

该工具桥接 Claude 和 OpenAI Codex CLI，提供代码生成、审查和自动化能力。Codex CLI 底层实际调用的是 OpenAI 的最新模型（如 GPT-4o 系列），"Codex"在此泛指 OpenAI 的代码处理能力。

**第一步：安装 Codex CLI**

```bash
npm i -g @openai/codex
```

**第二步：登录并绑定 API Key**

```bash
codex login --api-key "你的_OPENAI_API_KEY"
```

**第三步：注册 MCP Server**

```bash
claude mcp add codex-cli -- npx -y codex-mcp-server
```

**第四步：验证安装**

通过 `claude mcp list` 或 `/mcp` 确认 `codex-cli` 显示为 active。

### 替代方案：通过 Claude Desktop 配置

如果你同时使用 Claude Desktop，可以在其配置文件中添加：

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-tool"]
    },
    "codex-cli": {
      "command": "npx",
      "args": ["-y", "codex-mcp-server"]
    }
  }
}
```

然后通过以下命令导入到 Claude Code：

```bash
claude mcp add-from-claude-desktop
```

## 实际使用场景

### 协同过程示例

配置完成后，在 Claude Code 中发起多模型协作的过程大致如下：

```
You: 帮我审查 src/auth/ 目录下的认证逻辑，检查是否有安全隐患。
     先让 Gemini 做全局分析，再让 Codex 做工程化扫描，你来汇总。

Claude: 好的，我来分步处理。

        [调用 gemini-cli] 正在让 Gemini 分析 src/auth/ 的整体架构...

        Gemini 反馈：
        - auth/middleware.js 中的 JWT 验证未检查 token 过期时间
        - auth/oauth.js 的 redirect_uri 未做白名单校验
        - 建议增加 rate limiting 防止暴力破解

        [调用 codex-cli] 正在让 Codex 对上述问题做工程化验证...

        Codex 反馈：
        - 确认 middleware.js:42 缺少 exp 字段检查
        - oauth.js:78 的 redirect_uri 直接拼接用户输入，存在开放重定向风险
        - 建议补丁已生成

        综合两方分析，以下是修复方案：
        1. [高危] middleware.js:42 - 添加 token 过期验证...
        2. [高危] oauth.js:78 - 增加 redirect_uri 白名单...
        3. [建议] 全局添加 rate limiting 中间件...
```

### 场景一：复杂需求落地——先方案，再施工

目标：给已有项目加新功能，方案要清晰，改动要可控。

> 你作为主控：先让 Gemini 给出 3 套方案（含风险和取舍），然后选一套最稳的；再让 Codex 按步骤实现，最后给我一份可 code review 的变更说明和验证清单。

Claude 的处理流程：
1. 理解你的需求，明确约束条件
2. 调用 Gemini：让 Gemini 给出多个实现方案、优缺点和边界条件
3. 选定方案后，调用 Codex：按步骤修改代码、补测试、跑检查
4. 汇总交付：把"为什么这么做""改了哪些""如何验证"整理成最终报告

### 场景二：安全审查——多视角降低误判

目标：怀疑某段代码有隐患，需要多角度验证。

- Claude 先让 Codex 做工程化扫描：定位可疑模块、潜在回归点
- 再让 Gemini 做逻辑复核：用另一套推理路径解释为什么可能有问题
- Claude 最后统一裁决：给出改动最小的修复方案

### 场景三：大规模重构——Gemini 分析，Codex 执行

目标：将 Express 项目迁移到 Fastify。

1. Claude 识别到任务规模需要全局分析
2. 调用 Gemini：扫描所有路由文件，总结核心逻辑和中间件使用
3. Gemini 返回详尽的依赖分析报告
4. Claude 制定重构计划，调用 Codex 逐步执行改动

### 场景四：文档与代码同步

代码改了但文档忘了更新，这是最常见的技术债。

分工方式：
- **Gemini**：生成面向用户的说明文档（更自然的语言和结构）
- **Codex**：同步更新 README、示例代码、类型定义
- **Claude**：对齐术语，检查"文档说的"和"代码做的"是否一致

## 优缺点对比

| 维度 | 只用 Claude | + Gemini MCP | + Codex MCP | 三者联合 |
| :--- | :--- | :--- | :--- | :--- |
| **核心价值** | 简单直接 | 多一个高质量视角 | 更强的工程执行力 | 外脑 + 执行器 + 编排 |
| **适合任务** | 中等复杂度 | 方案对比、长文档分析 | 批量改动、自动化补丁 | 复杂项目的稳定交付 |
| **接入成本** | 零 | 极低（npx 即用） | 中等（需安装全局 CLI） | 需要设计路由策略 |
| **主要风险** | 单模型幻觉 | 输出分歧需仲裁 | 可能过度修改 | 需明确边界与验收机制 |
| **响应速度** | 最快 | 较快 | 稳定 | 取决于调用链路 |

一句话总结：**Gemini 解决"想得更全"，Codex 解决"做得更快"，Claude 解决"把事情做对"。**

## 最佳实践

1. **分工明确**：在指令中显式说明谁做什么。例如"先让 Gemini 总结，再让 Codex 实现，你来验收"
2. **先定验收标准再调用**：把约束写进指令，如"不得改 public API"、"必须补测试"、"输出变更清单"
3. **给 Codex 设护栏**：默认先做只读分析（列风险、给补丁预览），确认后再动手改
4. **让 Gemini 做交叉检查**：专注于"反例、边界条件、替代方案"，提高增量价值
5. **管理 API 额度**：你同时消耗三个平台的 Token。不重要的任务可以告诉 Claude "不要调用外部工具"
6. **密钥安全**：API Key 只放在本地安全位置，不要写进代码仓库
7. **版本控制**：`npx -y` 会拉最新版本，追求稳定时显式指定版本号，如 `gemini-mcp-tool@1.2.3`
8. **失败可降级**：任何一个 MCP Server 不可用时，Claude 仍应给出"无工具模式"的备选路径
9. **审计 MCP Server 源码**：在生产环境中使用前，先查看 GitHub 仓库源码，确保工具不会非法收集或上传本地代码

## 常见问题排查

**Q: MCP Server 启动失败，提示找不到命令**

检查 `npx` 是否在 PATH 中。Claude Code 启动子进程时可能无法读取 `.zshrc` 中的自定义路径。解决方案：

```bash
# 查看 npx 的绝对路径
which npx

# 使用绝对路径注册（示例）
claude mcp add gemini-cli -- /usr/local/bin/npx -y gemini-mcp-tool
```

**Q: 环境变量（API Key）不生效**

MCP Server 以子进程方式启动，可能无法继承 shell 的环境变量。确保变量在系统级别生效：

```bash
# 确认变量已 export（不只是 alias）
source ~/.zshrc
env | grep GEMINI
```

也可以在 MCP 配置中直接指定环境变量（通过 Claude Desktop 配置文件的 `env` 字段）。

**Q: Windows 上 npx 启动 MCP Server 报错**

Windows 环境下运行本地 npx MCP Server 需要用 `cmd /c` 包装：

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "gemini-mcp-tool"]
}
```

**Q: 调用外部模型时响应很慢**

这通常是网络延迟导致的。多模型协同必然增加调用链路。对于时间敏感的任务，可以告诉 Claude 只使用本地能力，跳过外部调用。

## 结语

通过 MCP 协议将 Gemini 和 Codex 接入 Claude Code，你构建的不是"三个聊天机器人"，而是一个**以 Claude 为核心的微型 AI 研发团队**：

- Claude 是项目经理兼架构师，负责任务分解、决策和验收
- Gemini 是博闻强识的研究员，负责全局分析和方案论证
- Codex 是高效的施工队，负责把计划变成可合并的代码

这种架构代表了 AI 辅助开发的演进方向：从单一模型的"问答式"交互，走向多模型协同的"工程化"交付。MCP 作为标准协议，让这种协同变得即插即用。

下一步，你可以从一个小的重构任务或一个有明确验收标准的功能开始，体验这套多模型工作流带来的交付质量提升。
