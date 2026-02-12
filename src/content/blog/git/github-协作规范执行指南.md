---
title: "GitHub 协作规范执行指南"
description: "Checklist：在 PR 模板里加上 Checkbox。"
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "git"
tags: ["git"]
sourcePath: "src/content/blog/Gemini-GitHub 协作规范执行指南.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文整理 GitHub 协作规范执行指南 的协作语义和实操流程，适用于团队开发与代码管理。

## 核心结论

- Checklist：在 PR 模板里加上 Checkbox
- \[ \] Assignee 已指定
- \[ \] Project 已关联
- \[ \] Reviewer 已指定
- Branch Protection Rules (分支保护规则)

## 详细说明

### 实现思路 1

作为项目的 Owner 或 Admin，你可以设置关卡

你不需要催他们改，你只需要 不 Merge

### 实现思路 2

关联 Issue （我们需要追踪进度）

在此之前我无法通过 Merge，因为这会引入风险

### 实现思路 3

Checklist：底下的 "Checklist" 全部勾选，证明自己检查过

Bot 自动检查：你看下面有一堆 Bot 在跑，如果不按规范写，Bot 直接标红，都没人理你

## 操作步骤与命令示例

### 示例 1

```bash
name: Close Issue on Merge to Dev
on:
  pull_request:
    types: [closed]
    branches:
      - dev  # 监听合并到 dev 的动作
jobs:
  close-issue:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            // 这是一个简单的逻辑：去读取 PR body 里的 issue 编号并关闭它
            // 实际上这一步比较复杂，需要正则匹配 Body 里的 "close #xxx"
            // 建议直接用现成的 Action 市场插件，比如 "keyword-issue-closer"
```

### 示例 2

```bash
# 列出 main 和 dev 之间所有差异 commit 的 body 信息，并过滤出含 close/fix 的行
git log main..dev --pretty=format:"%b" | grep -iE "close|fix|resolve"
```

### 示例 3

```bash
name: Release Drafter
on:
  push:
    branches:
      - main  # 当代码进 main 时触发
jobs:
  update_release_draft:
    runs-on: ubuntu-latest
    steps:
      - uses: release-drafter/release-drafter@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 示例 4

```bash
<type>(<scope>): <subject> (Closes #<issue-id>)
```

### 执行顺序建议

1. 确认仓库分支状态与目标基线。
2. 按流程执行提交、同步与合并操作。
3. 在合并后完成构建与关键用例验证。

## 常见问题与排查

- **问题：** Preview Image  **排查：** 使用 （修正）命令，它允许你重新编辑最后一次提交的信息，而不用产生新的 Commit；因为你之前已经 Push 过那个“残次品”了，现在需要用修正后的版本覆盖它
- **问题：** 可以 assign 给一个team吗  **排查：** 如果没有权限，GitHub 会忽略这行配置；建议： 先去确认一下你的仓库是不是在 Organization 下
- **问题：** github可以改注册邮箱吗  **排查：** GitHub 会向该邮箱发送一封验证邮件，你需要登录邮箱点击链接进行验证；在 GitHub 上，“邮箱”其实有两个不同的概念，建议你根据需求一起修改

## 关键问答摘录

> **Q:** Preview Image
>
> **A:** 使用 （修正）命令，它允许你重新编辑最后一次提交的信息，而不用产生新的 Commit；因为你之前已经 Push 过那个“残次品”了，现在需要用修正后的版本覆盖它

> **Q:** 可以 assign 给一个team吗
>
> **A:** 如果没有权限，GitHub 会忽略这行配置；建议： 先去确认一下你的仓库是不是在 Organization 下

## 总结

Checklist：在 PR 模板里加上 Checkbox。

- 原始对话来源：https://gemini.google.com/app/ae62ca6ff70ffec4
