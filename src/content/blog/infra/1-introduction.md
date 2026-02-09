---
title: "自建远程 Git 仓库：背景与目标"
description: "介绍从托管平台过渡到自建远程 Git 仓库的动机、适用场景与准备工作。"
pubDate: "2025-09-22"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/SelfHosting/How to establish a Remote Git Repository for yourself？.md"
sourceVault: "obsidian/note"
slug: "infra/1-introduction"
---
## 1. Introduction

本篇记录如何在自己的服务器上建立一个私有 Git 远程仓库，用于同步代码、笔记和个人项目。  
核心目标是降低对第三方托管平台的依赖，并保持数据可控。

## 2. Install Git

推荐在 Linux / WSL 环境操作：

### Ubuntu / Debian

```bash
sudo apt update && sudo apt install git
```

### CentOS / RHEL

```bash
sudo yum install git
```

安装后验证：

```bash
git --version
```

## 3. Create a Bare Repository on Remote Server

```bash
mkdir -p ~/repos/my_example.git
cd ~/repos/my_example.git
git init --bare
```

`my_example.git` 就是远程仓库地址。

## 4. Configure Local Repository

### Add remote

```bash
cd /path/to/your/local/project
git remote add origin user@your-server-ip:~/repos/my_example.git
```

### First commit and push

```bash
git add -A
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## 5. Verify by Clone

```bash
git clone user@your-server-ip:~/repos/my_example.git
```

## 6. Daily Sync

```bash
git pull origin main
git push origin main
```

建议避免把大体积二进制文件（如视频、安装包）直接放进 Git 仓库。

- [^1]: Github: https://en.wikipedia.org/wiki/GitHub
- [^2]: Git: https://en.wikipedia.org/wiki/Git
