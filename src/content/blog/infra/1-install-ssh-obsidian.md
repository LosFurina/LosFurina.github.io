---
title: "SSH 安装与基础配置（Ubuntu/Debian）"
description: "覆盖 OpenSSH 安装、服务检查、密钥登录与远程连接验证流程。"
pubDate: "2025-11-21"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Install and Config SSH Connection.md"
sourceVault: "obsidian/note"
slug: "infra/1-install-ssh-obsidian"
---
## 1. Install SSH

Most Linux distributions already include OpenSSH. If not, install it:

```bash
sudo apt install openssh-server
```

Check service status:

```bash
sudo systemctl status ssh
```

Restart if needed:

```bash
sudo systemctl restart ssh
```

## 2. Configure SSH

Before anything else, ensure security groups / firewall allow TCP port `22`.

You can authenticate with:

- Password login
- SSH key login (recommended)

After generating a key pair, files are usually:

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

- Private key: keep secret.
- Public key: upload to server.

Append public keys to `~/.ssh/authorized_keys` on the server (one key per line):

```text
ssh-ed25519 AAAAC3... user1@example.com
ssh-ed25519 AAAAC3... user2@example.com
```

## 3. Connect to Remote Server

```bash
ssh user@your-server-ip
```

`[Image omitted: image.png | source: ../assets/image_1731426731226_0.png]`
