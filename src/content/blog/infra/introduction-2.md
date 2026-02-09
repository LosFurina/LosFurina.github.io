---
title: "SSHFS 挂载指南"
description: "介绍如何通过 SSHFS 将本地磁盘挂载到远程 Linux 服务器。"
pubDate: "2025-05-26"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/sshfs.md"
sourceVault: "obsidian/note"
slug: "infra/introduction-2"
---
## Introduction

将本地硬盘挂载到远程 Linux 服务器上，通常可以通过 SSHFS（SSH 文件系统）来完成。SSHFS 是一个用于通过 SSH 协议挂载远程目录的工具。以下是一个简单的步骤指南：

### 1. 在远程服务器上安装 SSHFS

首先，确保远程服务器上已经安装了 SSHFS。可以通过以下命令安装：

```bash
# 在 Debian/Ubuntu 系统上
sudo apt update
sudo apt install sshfs

# 在 CentOS/RHEL 系统上
sudo yum install sshfs
```

### 2. 在本地计算机上安装 SSHFS

如果你在本地计算机上使用 Linux，也需要安装 SSHFS。可以使用以下命令：

```bash
# 在 Debian/Ubuntu 系统上
sudo apt update
sudo apt install sshfs

# 在 CentOS/RHEL 系统上
sudo yum install sshfs
```

### 3. 创建挂载点

在你的本地计算机上创建一个用于挂载远程目录的挂载点。例如：

```bash
mkdir ~/remote_mount
```

### 4. 使用 SSHFS 挂载远程目录

使用 SSHFS 挂载远程服务器上的目录。例如，假设远程服务器的 IP 地址是 `192.168.1.100`，登录用户是 `username`，并且你希望挂载 `/path/to/remote/dir` 目录：

```bash
sshfs username@192.168.1.100:/path/to/remote/dir ~/remote_mount
```

你可能会被要求输入远程用户的密码。

### 5. 验证挂载

你可以通过列出挂载点来验证是否成功挂载：

```bash
ls ~/remote_mount
```

### 6. 卸载远程目录

要卸载已经挂载的目录，可以使用以下命令：

```bash
fusermount -u ~/remote_mount
```

或者在某些系统上使用：

```bash
umount ~/remote_mount
```

### 注意事项

- 确保 SSH 远程连接正常，且防火墙配置允许 SSH 访问。
- 根据你的网络速度和远程服务器的性能，SSHFS 的速度可能会受到影响。在一些场合，你可能需要调整 SSHFS 的参数以改进性能。
- 安全性考虑，使用 SSH 密钥认证可以提高安全性，而不依赖于密码。

希望这些步骤对你有帮助！如果你有任何问题，请随时问我。
