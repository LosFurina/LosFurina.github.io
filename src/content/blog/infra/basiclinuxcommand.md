---
title: "Linux 基础命令笔记"
description: "收录常见 Linux 基础命令与参数说明，适合日常查询与复习。"
pubDate: "2025-09-22"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/LinuxCommand/BasicLinuxCommand.md"
sourceVault: "obsidian/note"
slug: "infra/basiclinuxcommand"
---
- `mkdir` #BasicLinuxCommand 
	- **递归创建多级目录**
	- 如果你需要一次性创建一系列嵌套的目录，例如：
	- ```bash

	  mkdir -p /home/user/projects/my_project/src
	  ```
	- 在没有 `-p` 参数的情况下，`mkdir` 会报错，因为父目录 `/home/user/projects/my_project` 如果不存在，不能直接创建 `src`。加上 `-p` 参数后，`mkdir` 会自动先创建缺失的父目录，再创建目标目录。以上命令会按顺序创建：
	- `/home`
	- `/home/user`
	- `/home/user/projects`
	- `/home/user/projects/my_project`
	- `/home/user/projects/my_project/src`
