---
title: "Arch系统迁移教程"
description: "面向 Arch 根盘迁移场景，覆盖分区规划、rsync 搬迁、引导重装与启动验证。"
pubDate: "2026-02-10"
updatedDate: "2026-02-10"
category: "linux"
tags: ["linux"]
sourcePath: "src/content/blog/ChatGPT-Arch系统迁移教程.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文适用于将现有 Arch 系统从旧磁盘迁移到新磁盘，且希望保留现有环境而非重装系统的场景。

## 核心结论

- 新盘先完成分区与格式化，再进行系统文件迁移。
- 迁移建议使用 `rsync -aAXH`，并排除 `/proc`、`/sys`、`/dev` 等伪文件系统。
- 迁移后必须重建 `fstab` 并重装引导器（GRUB）。
- BIOS 启动项切换到新盘后，至少完成 1-2 次重启验证。
- 确认稳定后再格式化旧盘，避免提前清空导致回滚困难。

## 详细说明

### 实现思路 1

迁移前先明确源盘与目标盘设备名，确认目标盘可被完全清空。

所有关键操作建议在 Arch Live ISO 环境执行，避免“在线迁移当前根分区”带来的不一致风险。

### 实现思路 2

系统文件迁移完成后，第一优先级是修复引导链路。

通过 `genfstab` 生成新盘配置后，进入 `arch-chroot` 重装 GRUB 并生成 `grub.cfg`。

### 实现思路 3

如果 `rsync` 执行失败，优先检查 shell 参数展开问题（尤其是 `--exclude` 的写法）。

参数写法建议可读且可复现，避免临时拼接导致路径被 shell 误展开。

## 操作步骤与命令示例

### 示例 1

```bash
cfdisk /dev/nvme0n1
```

### 示例 2

```bash
mkfs.fat -F32 /dev/nvme0n1p1     # EFI
mkswap /dev/nvme0n1p2
mkfs.ext4 /dev/nvme0n1p3        # /
```

### 示例 3

```bash
mount /dev/nvme0n1p3 /mnt
mkdir -p /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot
swapon /dev/nvme0n1p2
```

### 示例 4

```bash
mkdir /oldroot
mount /dev/nvme1n1p3 /oldroot
mount /dev/nvme1n1p1 /oldroot/boot
```

### 执行顺序建议

1. 确认当前系统版本、服务状态与关键配置文件。
2. 按最小变更原则执行命令或修改配置。
3. 通过日志、状态命令和实际行为完成验证。

## 常见问题与排查

- **问题：** 迁移和 `cp` 有什么区别？  **排查：** `rsync` 可保留权限、ACL、扩展属性并支持断点重跑，更适合系统迁移。
- **问题：** `fstab` 最后的两个数字怎么填？  **排查：** 常见是根分区 `1 1`、其他分区 `0 2`、swap `0 0`，以实际文件系统策略为准。
- **问题：** swap 是不是占用内存？  **排查：** swap 位于磁盘，用于内存压力时的后备交换区，不等同于物理内存。

## 关键问答摘录

> **Q:** 最容易出错的环节是什么？
>
> **A:** 常见错误是 `rsync --exclude` 参数被 shell 展开、`fstab` UUID 写错、以及 GRUB 未正确安装到新盘 EFI。

> **Q:** 迁移完成后如何确认可用？
>
> **A:** 至少完成 1-2 次重启，确认系统从新盘启动、挂载点正确、日志无关键报错，再处理旧盘。

## 总结

Arch 迁移的关键不在“复制文件”，而在“正确接管启动链路并完成稳定性验证”。

- 原始对话来源：https://chatgpt.com/c/698bc981-0ef8-8329-ac2d-b3d4a101204e
