---
title: Write Git commit
description: "Auto-generated description for Write Git commit"
pubDate: 2026-01-23
---

# 如何优雅地写 Git Commit

写出优雅的 Git Commit 是一个持续改进的过程，不仅为了自己，更是为了团队协作和项目可维护性。

核心原则：**清晰、简洁、一致、可追踪**

## 1. Commit 结构的艺术 (必学！)

标准的 Git Commit 结构包含两个主要部分：标题行（Summary Line）和主体（Body）。


### 标题行 (Summary Line): 简洁明了的概括

*   **必填，且是最重要的部分。**
*   **不超过 50 个字符：** 便于快速浏览。
*   **使用祈使句（Imperative Mood）：** 动词开头，像给代码下达命令。例如：`Add feature X`，`Fix bug Y`。
*   **开头大写。**
*   **不要在末尾加句号。**
*   **简洁有力：** 准确概括本次提交的主要目的。

**示例：**
*   `Fix: Correct typo in documentation`
*   `Feat: Implement user authentication`
*   `Refactor: Improve performance of data processing`

### 主体 (Body): 详细解释提交的内容

*   **可选，但强烈推荐用于复杂或重要的提交。**
*   **在一行空行后开始：** 分隔标题行与主体。
*   **解释“为什么”（Why）：** 说明解决了什么问题，引入了什么新功能，这样做的原因等。
*   **提供上下文：** 引用相关的 Issue 或需求（例如：`Closes #123`）。
*   **详细说明：** 如果必要，描述技术细节、设计决策、潜在副作用等。
*   **换行：** 每行控制在 72 字符左右。
*   **使用列表或段落：** 组织思路。

**示例：**
```
Fix: Correct typo in documentation

This commit corrects a typo in the installation instructions
regarding the required version of Node.js. The previous version
was incorrect and could lead to installation errors.

Relates to #789
```

## 2. 内容选择的智慧：Commit 什么？

*   **一次提交只做一件事 (Single Concern)：** 保持每个提交的粒度小且集中。
*   **避免“大杂烩”提交：** 将不相关的改动拆分为多个提交。
*   **不要提交无效的文件：** 使用 `.gitignore`。

## 3. 内容书写的技巧：如何写得更好？

*   **使用一致的格式和语言：** 遵循团队规范。
*   **使用工具辅助填写：** 利用 GUI 工具或命令行工具。
*   **审视你的改动：** 在提交前检查改动，确保 Commit 信息准确。
*   **避免使用模糊的词语：** 具体说明进行了哪些改动。
*   **引用相关的 Issue 或 Pull Request：** 方便追踪。
*   **如果修复 Bug，说明现象和原因。**
*   **如果引入新功能，说明用途和实现方式。**

## 4. 遵循约定式提交 (Conventional Commits)（可选但推荐）

一种轻量级约定，为提交消息提供规范，便于自动化工具处理。

**格式：**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

*   **`<type>` (必填):** 提交类型（`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` 等）。
*   **`[optional scope]`:** 影响范围（如模块）。
*   **`<description>` (必填):** 标题行，使用祈使句。
*   **`[optional body]`:** 主体，详细说明。
*   **`[optional footer(s)]:** 页脚，关联 Issue 或表明 Breaking Changes (`BREAKING CHANGE:`)。

**示例：**
```
feat(parser): Add support for arrays

This commit adds support for parsing arrays in the configuration file.
Previously, only basic key-value pairs were supported.

Closes #456
```

## 5. 养成良好的习惯

*   **经常提交：** 小而频繁的提交更容易管理。
*   **提交前进行代码审查：** 发现问题并改进 Commit 信息。
*   **学习团队的现有 Commit 规范：** 保持一致性。
*   **使用 Git Hooks：** 自动化检查 Commit 信息格式。

## 关于 `git commit -m ""`

**不建议在 `git commit -m ""` 后面写太多内容。**

虽然技术上可行，但这不符合优雅 Git Commit 的最佳实践，原因如下：

1.  **违反标题行长度限制：** 导致标题过长。
2.  **无法分离标题和主体：** 强制将所有内容写在单行。
3.  **丢失详细的上下文：** 无法提供“为什么”的解释或引用 Issue。
4.  **不利于自动化工具处理：** 影响工具解析和显示。
5.  **降低可读性：** 在历史记录中难以快速浏览。

**正确的做法：**

*   **对于非常简单且一句话能清晰概括的提交，才使用 `git commit -m ""`，且保持简洁（不超过 50 字符）。**
*   **当需要详细说明时，请使用不带 `-m` 参数的 `git commit` 命令。** Git 会打开编辑器，让你按照标准的 Git Commit 结构（标题 + 空行 + 主体）来编写提交信息。

**使用不带 `-m` 参数的 `git commit` 示例：**

1.  在终端输入 `git commit` 并回车。
2.  Git 会打开你的默认编辑器。
3.  在编辑器中按照以下格式编写：

    ```
    # 第一行是标题行 (约 50 字符)
    Feat: Add user profile page

    # 空一行

    # 接下来是主体部分，可详细描述 (每行约 72 字符)
    This commit introduces a new user profile page with the following features:
    - Display user's name and avatar.
    - Allow users to edit their bio.
    - Links to user's past activity.

    The profile page is accessible at /profile/:userId.
    This addresses user request #789.
    ```
4.  保存并关闭编辑器。

**总结：** 优雅的 Git Commit 是通过遵循结构化的提交信息规范来实现的，而不是将所有内容塞进单行的 `-m` 参数中。这使得你的版本历史更清晰、更容易理解和维护。# 如何优雅地写 Git Commit

写好 Git Commit 是一个不断改进的过程。这不仅对自己有帮助，也对团队合作和项目维护很重要。

核心原则：**清晰、简洁、一致、可追踪**

## 1. Commit 结构的艺术 (必学！)

标准的 Git Commit 结构有两个主要部分：标题行和主体。

### 标题行: 简洁明了的概括

*   **必填，且是最重要的部分。**
*   **不超过 50 个字符：** 便于快速浏览。
*   **使用动词开头：** 像给代码下达命令。例如：`Add feature X`，`Fix bug Y`。
*   **开头大写。**
*   **不要在末尾加句号。**
*   **简洁有力：** 准确概括本次提交的主要目的。

**示例：**
*   `Fix: Correct typo in documentation`
*   `Feat: Implement user authentication`
*   `Refactor: Improve performance of data processing`

### 主体: 详细解释提交的内容

*   **可选，但强烈推荐用于复杂或重要的提交。**
*   **在一行空行后开始：** 分隔标题行与主体。
*   **解释“为什么”：** 说明解决了什么问题，引入了什么新功能等。
*   **提供上下文：** 引用相关的 Issue 或需求（例如：`Closes #123`）。
*   **详细说明：** 如果必要，描述技术细节、设计决策等。
*   **换行：** 每行控制在 72 字符左右。
*   **使用列表或段落：** 组织思路。

**示例：**
```
Fix: Correct typo in documentation

This commit corrects a typo in the installation instructions
regarding the required version of Node.js. The previous version
was incorrect and could lead to installation errors.

Relates to #789
```

## 2. 内容选择的智慧：Commit 什么？

*   **一次提交只做一件事：** 保持每个提交的内容简单。
*   **避免“大杂烩”提交：** 将不相关的改动分开。
*   **不要提交无效的文件：** 使用 `.gitignore`。

## 3. 内容书写的技巧：如何写得更好？

*   **使用一致的格式和语言：** 遵循团队规范。
*   **使用工具帮助填写：** 利用 GUI 工具或命令行工具。
*   **审视你的改动：** 在提交前检查改动，确保信息准确。
*   **避免模糊的词语：** 具体说明进行了哪些改动。
*   **引用相关的 Issue 或 Pull Request：** 方便追踪。
*   **如果修复 Bug，说明现象和原因。**
*   **如果引入新功能，说明用途和实现方式。**

## 4. 遵循约定式提交（可选但推荐）

这是一种简单的规则，帮助你写提交信息。

**格式：**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

*   **`<type>` (必填):** 提交类型（`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` 等）。
*   **`[optional scope]`:** 影响范围（如模块）。
*   **`<description>` (必填):** 标题行，使用动词开头。
*   **`[optional body]`:** 主体，详细说明。
*   **`[optional footer(s)]:** 页脚，关联 Issue 或表明重要变化。

**示例：**
```
feat(parser): Add support for arrays

This commit adds support for parsing arrays in the configuration file.
Previously, only basic key-value pairs were supported.

Closes #456
```

## 5. 养成良好的习惯

*   **经常提交：** 小而频繁的提交更容易管理。
*   **提交前进行代码审查：** 发现问题并改进信息。
*   **学习团队的现有规范：** 保持一致性。
*   **使用 Git Hooks：** 自动检查提交信息格式。

## 关于 `git commit -m ""`

**不建议在 `git commit -m ""` 后面写太多内容。**

虽然可以这样做，但这不符合好的 Git Commit 习惯，
