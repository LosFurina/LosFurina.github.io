---
title: "NVMe读写速度标准"
description: "QLC（四层单元）容量大但速度掉得厉害；。"
pubDate: "2025-10-07"
updatedDate: "2025-10-07"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/ChatGPT-NVMe读写速度标准.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文整理 NVMe读写速度标准 的关键实践路径，适用于基础设施建设、部署与运维场景。

## 核心结论

- TLC（三层单元）速度较快；
- QLC（四层单元）容量大但速度掉得厉害；
- SLC 缓存区满了后，QLC 盘速度可能暴跌到 300MB/s。
- 温度限制（Thermal Throttling）
- 太热（ 70°C）时，控制器会自动降速；

## 详细说明

### 实现思路 1

这个问题问得很到点上，因为“NVMe 正常读写速度”其实取决于不少因素——接口版本、闪存类型、控制器、通道数、主板支持情况、甚至散热都有影响

比喻一下：PCIe 3.0 像四车道高速，PCIe 4.0 是八车道，PCIe 5.0 直接上了双层立交

### 实现思路 2

结果对比网络上几乎所有 SSD 评测

评分体系（Score）方便横向对比

### CrystalDiskMark

检查插槽是否是 PCIe 4.0 x4

越大越真实 建议改为 4GiB 或更大

## 操作步骤与命令示例

### 示例 1

```bash
fio --name=nvme_test --filename=/mnt/nvme/testfile --size=4G --rw=randread --bs=4k --numjobs=4 --time_based --runtime=60s --group_reporting
```

### 示例 2

```bash
sudo hdparm -tT /dev/nvme0n1
```

### 示例 3

```bash
dd if=/dev/zero of=testfile bs=1G count=1 oflag=direct
```

### 示例 4

```bash
Seq Q8T1 Read: 7100 MB/s
Seq Q8T1 Write: 5300 MB/s
RND4K Q1T1 Read: 80 MB/s
RND4K Q1T1 Write: 220 MB/s
```

### 执行顺序建议

1. 明确目标环境、依赖条件与网络连通性。
2. 分阶段实施配置或部署，逐步验证。
3. 记录最终状态与回滚策略，便于复用。

## 常见问题与排查

- **问题：** CrystalDiskMark  **排查：** 检查插槽是否是 PCIe 4.0 x4；越大越真实 建议改为 4GiB 或更大

## 关键问答摘录

> **Q:** CrystalDiskMark
>
> **A:** 检查插槽是否是 PCIe 4.0 x4；越大越真实 建议改为 4GiB 或更大

## 总结

TLC（三层单元）速度较快；。

- 原始对话来源：https://chatgpt.com/c/68e59698-3744-832a-9353-5a0cc3d431db
