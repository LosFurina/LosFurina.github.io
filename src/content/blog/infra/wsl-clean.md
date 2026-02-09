---
title: "WSL 磁盘清理指南"
description: "按风险分级整理 WSL 空间清理方法，覆盖 apt、缓存、日志与镜像瘦身。"
pubDate: "2025-11-05"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/WSl clean.md"
sourceVault: "obsidian/note"
slug: "infra/wsl-clean"
---
这个问题问得太好了——**WSL 真的是“吃盘怪兽”之一**，特别是你装了多个发行版、Docker、conda 或编译过模型，空间会悄悄被吃光。下面我给你一份 **「从轻到重」的清理指南**，按风险程度和收益分层操作。

## 🧹 一、轻量级清理（安全、建议首先做）

### ✅ 1. 清理 Linux 系统里的临时文件和包缓存

打开你的 WSL（Ubuntu 为例）：

```bash
sudo apt clean
sudo apt autoclean
sudo apt autoremove -y
```

- `clean`：清空 `/var/cache/apt/archives/`
    
- `autoremove`：移除不再依赖的旧内核、无用包
    
- 成本低、收益中等，基本不会出错。

### ✅ 2. 清空 Linux 日志和临时目录

```bash
sudo journalctl --vacuum-time=3d
sudo rm -rf /tmp/*
sudo rm -rf ~/.cache/*
```

说明：

- `journalctl` 会清理系统日志，保留最近 3 天；
    
- `~/.cache` 通常能释放上百 MB。

### ✅ 3. 清理 pip、conda、npm 等缓存

如果你在 WSL 里用 Python、Node、conda 等：

```bash
pip cache purge
conda clean --all -y
npm cache clean --force
```

这一波能帮你腾出几百 MB ~ 数 GB。

## 💾 二、中级清理（会显著降体积）

### ✅ 1. 压缩 WSL 虚拟磁盘

Windows 下的 WSL 数据实际上都存在 `.vhdx` 文件中。

步骤：

1. 退出所有 WSL 会话：
    
    ```powershell
    wsl --shutdown
    ```
    
2. 查找发行版存储路径：
    
    ```powershell
    wsl --list --verbose
    ```
    
    输出类似：
    
    ```
    Ubuntu-22.04    Running    2
    docker-desktop-data    Stopped    2
    ```
    
    然后看路径（通常在 `%LOCALAPPDATA%\Packages\CanonicalGroupLimited...`）。
    
3. 在 PowerShell 执行压缩命令：
    
    ```powershell
    Optimize-VHD -Path "C:\Users\<用户名>\AppData\Local\Packages\<WSL发行版>\LocalState\ext4.vhdx" -Mode Full
    ```
    
    💡 要求：以 **管理员身份** 打开 PowerShell。
    

> ⚠️ 注意：
> 
> - 压缩前必须 `wsl --shutdown`
>     
> - 不会影响数据，只是回收未使用的磁盘空间
>     
> - 第一次压缩可能释放出几 GB！
>     

### ✅ 2. 清理 Docker 在 WSL 下的镜像 / 容器

如果你用 Docker Desktop，里面的镜像也在 `docker-desktop-data` 里，特别占。

执行：

```bash
docker system prune -a --volumes
```

> 会删除：
> 
> - 所有停止的容器
>     
> - 所有未使用的镜像、卷、网络  
>     一般能释放 10GB+ 😅
>     

## ☠️ 三、重度清理（风险较高，慎用）

### ✅ 1. 删除不用的发行版

查看：

```powershell
wsl --list --verbose
```

删除：

```powershell
wsl --unregister <发行版名>
```

例如：

```powershell
wsl --unregister Ubuntu-18.04
```

会完全移除该 WSL，包括文件系统和 vhdx 文件。

### ✅ 2. 移动 / 迁移 WSL 存储位置

如果 C 盘快满了，你可以把整个 WSL 转移到其他盘：

```powershell
wsl --export Ubuntu-22.04 D:\ubuntu.tar
wsl --unregister Ubuntu-22.04
wsl --import Ubuntu-22.04 D:\WSL\Ubuntu D:\ubuntu.tar --version 2
```

这会把发行版完整迁移到 D 盘，并释放 C 盘空间。

## 🧠 小结速览

|操作|释放空间|风险|推荐|
|---|---|---|---|
|`apt clean` / `autoremove`|0.5–2GB|极低|✅✅✅|
|删除缓存 (`pip`, `conda`, etc.)|1–5GB|低|✅✅|
|`Optimize-VHD` 压缩虚拟盘|5–10GB|中|✅✅|
|`docker system prune`|5–20GB|中|✅|
|删除发行版|全部|高|⚠️|
|导出+迁移|视情况而定|高|⚠️|

要不要我帮你写一个自动清理脚本（PowerShell + Bash 结合版）？  
执行一次能同时：

- 清理 Linux 缓存
    
- 压缩 WSL 虚拟盘
    
- 清空 pip/conda/docker 缓存  
    适合你这种经常用 WSL 做研究的情况。
