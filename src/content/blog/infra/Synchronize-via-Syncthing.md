---
title: Synchronize Folder with Syncthing
description: "Syncthing 跨平台文件同步实战，覆盖设备配对、共享目录与权限策略。"
pubDate: 2026-01-23
---

## Introduction

`Syncthing` is a famous open-source app which can help us synchronize shared folders through different platforms including windows, MacOS and Linux. For more details, you can access [official website](https://syncthing.net/)

## Install

## Windows

It is very simple to install on windows, just download it from [github](https://github.com/Bill-Stewart/SyncthingWindowsSetup/releases)

After installed, there will be a desktop shortcut `Syncthing Configuration Page`

Click that shortcut, your browser will open a config page.

## Linux

For more details, you can access [official guidance](https://apt.syncthing.net/)

### 1. Provide release key

```bash
# Add the release PGP keys:
sudo mkdir -p /etc/apt/keyrings
sudo curl -L -o /etc/apt/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg
```

### 2. Add the "stable" channel to your APT sources

```bash
echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
```

### 3. Add the "candidate" channel to your APT sources

```bash
echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing candidate" | sudo tee /etc/apt/sources.list.d/syncthing.list
```

### 4. Install through `apt`

```bash
sudo apt-get update
sudo apt-get install syncthing
```

## Usage

## Windows

Double click `Syncthing Configuration Page`

Config as you like in browser

## Linux

Run it on background: Run the command in the background

### Run

It is very easy to start, just check `syncthing` with `which syncthing`

```bash
(base) root@cc2:~# which syncthing 
/usr/bin/syncthing
(base) root@cc2:~# 
```

Register it to `systemctl` or use other method to run it at background.

### Access config dashboard

I recommend Connect your Remote Service from SSH forwarding

And then, config as you like.

## Reference

> https://docs.syncthing.net/


