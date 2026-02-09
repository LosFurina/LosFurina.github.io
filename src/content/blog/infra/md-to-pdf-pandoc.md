---
title: "Pandoc：Markdown 转 PDF"
description: "记录 Pandoc 安装方式与 Markdown 转 PDF 的常用命令参数。"
pubDate: "2025-11-04"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Md to PDF Pandoc.md"
sourceVault: "obsidian/note"
slug: "infra/md-to-pdf-pandoc"
---
https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/prince

winget install --id=JohnMacFarlane.Pandoc -e

解释：

- `--id` 指的是 Pandoc 的唯一包名（来自官方作者 John MacFarlane）
    
- `-e` 表示精确匹配，防止装错类似包名的工具
    

执行后 winget 会自动：

1. 下载 Pandoc 官方最新稳定版
    
2. 添加环境变量 PATH
    
3. 无需管理员权限（但如果提示权限问题，右键“以管理员身份运行 PowerShell”）
