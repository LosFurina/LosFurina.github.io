---
title: Install and Config SSH Connection
description: "Linux 环境安装 OpenSSH 服务并启用远程访问的最小步骤清单。"
pubDate: 2026-01-23
---

## 1. Install SSH

It is very easy, I strongly recommend you install it on Linux or [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)(Windows Subsystem for Linux), I will record how to install WSL at: How to install WSL . And I will give you my reasons Why Stop Coding on Windows.

Almost all Released Versions of Linux have already installed SSH, but if you find there is no SSH for you computer, just install it from apt.

```bash
sudo apt install openssh-server
```

Check status of ssh:

```bash
sudo systemctl status ssh
```

If you see the result below, SSH is running correctly.

```yaml
● ssh.service - OpenBSD Secure Shell server
   Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2024-11-12 10:21:34 UTC; 1min 32s ago
```

you can restart ssh make sure it work.

```bash
sudo systemctl restart ssh
```

## 2. Config SSH

Note: most cloud providers enable firewall rules by default. If port `22` is closed, SSH will fail; allow inbound SSH first.

There are two methods to verify your identification:

Note: password authentication works, but key-based login is more secure and recommended.

SSH-key:How to set SSH key pair

Note: SSH key login is based on asymmetric cryptography (private key on client, public key on server).

After we generate a SSH key pair, we will find key pair file at:

```text
~/.ssh/id_{encrypt_method}
~/.ssh/id_{encrypt_method}.pub
```

`id_{encrypt_method}` is your private key, please remember never leak this file to anyone.

`id_{encrypt_method}.pub` is your public key, you should upload it to your Cloud Server.

Note: you can upload files with `scp` or `rsync` after SSH is configured.

Besides, we can copy the content of `id_{encrypt_method}.pub` to `~/.ssh/authorized_keys` directly, to speak of, this file can contain many public keys, every key just occupies one line.
For example:

```yaml
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICUcN+UpNbVOI9pHj796/Sd4+iHbAdBOQvSPq example@proton.me
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICUcN+UpNbVOI9pHj796/Sd4+iHbAdBOQvSPq example@proton.me
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICUcN+UpNbVOI9pHj796/Sd4+iHbAdBOQvSPq example@proton.me
```

## 3. Connect Remote Server

Note: after key setup, you can connect without password and automate remote commands safely.

Now, let's test our connection:

```bash
ssh user@your-server-ip
```

Now, we have finished SSH Connection.

If there are any other question, I will add at here.
