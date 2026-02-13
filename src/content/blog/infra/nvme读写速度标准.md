---
title: "NVMe读写速度标准"
description: "QLC（四层单元）容量大但速度掉得厉害；。"
pubDate: "2025-10-07"
updatedDate: "2026-02-13"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/ChatGPT-NVMe读写速度标准.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“nvme正常读写速度是多少”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. nvme正常读写速度是多少

###  一、接口版本决定“天花板”

| 接口 | 理论带宽（单向） | 实际常见读速 | 实际常见写速 | 代表型号 |
| --- | --- | --- | --- | --- |
| **PCIe 3.0 x4 NVMe** | ~3.94 GB/s | 2500–3500 MB/s | 1500–3200 MB/s | Samsung 970 EVO Plus, WD SN750 |
| **PCIe 4.0 x4 NVMe** | ~7.88 GB/s | 5000–7400 MB/s | 4000–6500 MB/s | Samsung 980 PRO, WD SN850 |
| **PCIe 5.0 x4 NVMe** | ~15.75 GB/s | 9000–14000 MB/s | 8500–12000 MB/s | Crucial T700, Corsair MP700 |

> 比喻一下：PCIe 3.0 像四车道高速，PCIe 4.0 是八车道，PCIe 5.0 直接上了双层立交。车（数据）跑得多快，取决于你这条路修到什么档次。

### ️ 二、影响性能的实际因素

1.  **闪存类型**：
    *   TLC（三层单元）速度较快；
    *   QLC（四层单元）容量大但速度掉得厉害；
    *   SLC 缓存区满了后，QLC 盘速度可能暴跌到 300MB/s。
2.  **温度限制（Thermal Throttling）**：
    *   太热（>70°C）时，控制器会自动降速；
    *   没装散热片的 NVMe 特别容易中招。
3.  **主板插槽带宽**：
    *   某些主板的第二个 M.2 插槽只有 PCIe 3.0 x2（减半速）；
    *   有的笔电甚至共享通道，会被显卡或无线网卡占用。
4.  **系统环境**：
    *   Windows 复制大文件 ≠ 实际持续写入；
    *   用专业工具（如 CrystalDiskMark、AS SSD Benchmark）测试才更准确。

###  三、参考判断标准

*   你的 NVMe 如果是 **PCIe 3.0**，读写在 **3000/2500 MB/s 左右**算正常；
*   如果是 **PCIe 4.0**，那就要在 **7000/5000 MB/s 左右**才算健康；
*   若你买的是 **PCIe 5.0** 新盘，低于 **9000 MB/s** 反而说明主板或 BIOS 没开通带宽。

###  四、实用建议

*   用 **CrystalDiskInfo** 查看接口协商速率（是否真的是 x4、Gen4、Gen5）。
*   用 **CrystalDiskMark** 跑一遍，看顺序读写和随机读写；
*   如果写入速度掉得太厉害，可以试试：
    *   开启 NVMe 驱动（厂商驱动或微软 NVMe 驱动）；
    *   保持至少 20% 空间空闲；
    *   检查散热。

### 主题 2. 有什么软件可以测试读写速度

好问题 ，测试 NVMe 读写速度的软件其实很多，但不同软件关注的维度、测试逻辑和展示方式都不一样。下面我给你分层推荐几类工具——从“普通用户可视化”到“专业级分析”，都有：

一、主流用户常用的速度测试工具（最推荐）

这些是图形化、简单、结果一目了然的工具

### **1️⃣ CrystalDiskMark（⭐最常用）**

*    **适用系统**：Windows
*    **功能**：顺序读写 + 随机读写速度测试（Q1T1、Q32T1等模式）
*    **特点**：
    *   显示 **读/写 MB/s**、IOPS、响应时间；
    *   可选择测试文件大小（1GiB–64GiB）；
    *   结果对比网络上几乎所有 SSD 评测。
*    **推荐理由**：几乎所有评测都用它，你的数据一对比就知道盘是不是拖后腿。
*    **下载**：[CrystalDiskMark 官网](https://crystalmark.info/en/software/crystaldiskmark/)

### **2️⃣ AS SSD Benchmark**

*    **适用系统**：Windows
*    **功能**：综合测试 NVMe/SATA 读写性能 + 访问延迟
*    **额外功能**：
    *   评分体系（Score）方便横向对比；
    *   提供“Copy Benchmark”测试真实文件操作。
*    **区别**：CrystalDiskMark 偏理论最大速度，AS SSD 更贴近真实使用。

### **3️⃣ ATTO Disk Benchmark**

*    **适用系统**：Windows
*   ️ **功能**：以不同数据块大小（从 512B 到 64MB）测试性能曲线。
*    **适合用途**：查看 SSD 在不同块大小下的速度变化，比如 4K 块和 1MB 块差异。
*    **实用场景**：分析控制器和缓存策略表现。

### **4️⃣ Blackmagic Disk Speed Test（Mac/Windows）**

*    **适合人群**：Mac 用户、视频剪辑党
*    **功能**：测试磁盘对视频编辑（ProRes、RAW）的读写是否达标。
*    **下载**：App Store 免费。

️ 二、进阶测试工具（给想深挖的玩家）

### **1️⃣ Iometer**

*    开源、老牌、专业；
*   可设置不同工作负载（随机读写比例、队列深度）；
*   常用于企业 SSD 测试；
*   缺点：界面丑、配置复杂。

### **2️⃣ Anvil’s Storage Utilities**

*   功能丰富，可测试延迟、IOPS、压缩性能；
*   对比多种负载下的表现；
*   对 NVMe 高性能盘的压力测试更准确。

三、命令行和系统内置方案

### **Linux 用户**：

*   `fio`：最强命令行测试工具，可定制 workload。
```bash
    fio --name=nvme_test --filename=/mnt/nvme/testfile --size=4G --rw=randread --bs=4k --numjobs=4 --time_based --runtime=60s --group_reporting
```
*   `hdparm`（SATA 盘）：
```bash
    sudo hdparm -tT /dev/nvme0n1
```
*   `dd`（简单但不准）：
```bash
    dd if=/dev/zero of=testfile bs=1G count=1 oflag=direct
```

四、建议的测试流程

1.  **先关掉后台程序**，避免干扰；
2.  **选 1GiB 或 4GiB 测试文件**（太小会高估速度）；
3.  **重复 2–3 次取平均值**；
4.  **结果判断**：
    *   顺序读写：主打接口极限；
    *   随机读写（4K Q1T1）：决定系统日常响应；
    *   若速度大幅低于标称值，检查：
        *   是否插在 PCIe x4 插槽；
        *   是否开启 NVMe 驱动；
        *   是否温度过高限速。

如果你告诉我你的系统（Windows / Linux / macOS）和测试目的（比如想测最高速度还是想看真实应用性能），我可以帮你选一个**最合适的工具 + 推荐参数组合**。

### 主题 3. CrystalDiskMark

非常好 ，**CrystalDiskMark** 是测试 NVMe、SSD、甚至机械硬盘速度最主流的软件之一，操作非常简单。下面我手把手带你完整过一遍：

一、下载安装

1.  打开官网：  
[https://crystalmark.info/en/software/crystaldiskmark/](https://crystalmark.info/en/software/crystaldiskmark/)
2.  下载最新版（选择 **Standard Edition ZIP 绿色版** 就行，不用安装）。
3.  解压后，双击运行 `DiskMark64.exe`（如果是 32 位系统就运行 `DiskMark32.exe`）。

️ 二、界面认识（五个关键选项）

打开界面后，你会看到一堆数字框和几个下拉菜单，，这里逐个解释

| 区域 | 说明 | 建议设置 |
| --- | --- | --- |
|  **① 测试次数（All、5）** | 默认是 5，表示每项测试跑 5 次取平均值 | 保持默认即可 |
|  **② 测试文件大小（1GiB）** | 用多大文件测试；越大越真实 | 建议改为 **4GiB** 或更大 |
|  **③ 测试磁盘（C: D: E: ...）** | 选择要测试的硬盘或分区 | 选你的 **NVMe SSD 所在盘符** |
|  **④ 测试项目按钮（All / Seq / RND）** | “All” 会跑所有测试 | 建议点 **All** 一次完成 |
|  **⑤ 测试结果区域** | 会显示读写速度、IOPS、延迟等数据 | 等待测试完成后看结果 |

三、测试步骤

1.  关闭其他程序（包括浏览器、下载、Steam等），保持系统空闲；
2.  启动 CrystalDiskMark；
3.  选择：
    *   测试文件大小：4GiB
    *   测试磁盘：你要测的 NVMe（比如 D: 或 E:）
4.  点击 **“All”** 按钮开始测试；
5.  等待 1–3 分钟，完成后会显示结果。

四、结果怎么看

测试完后你会看到四组指标（默认排列如下）

| 项目 | 含义 | 说明 |
| --- | --- | --- |
| **Seq Q8T1** | 顺序读写（大文件） | 测最大吞吐速度，最接近厂商宣传值 |
| **Seq Q1T1** | 单队列顺序读写 | 更贴近日常文件传输性能 |
| **RND4K Q32T16** | 随机 4K 多线程 | 测多任务场景（高并发读写） |
| **RND4K Q1T1** | 随机 4K 单线程 | 测系统响应速度，启动/打开软件相关 |

**举例解释：**  
如果你看到：

```
Seq Q8T1 Read: 7100 MB/s
Seq Q8T1 Write: 5300 MB/s
RND4K Q1T1 Read: 80 MB/s
RND4K Q1T1 Write: 220 MB/s
```

那就说明你这块盘是标准的 **PCIe 4.0 NVMe SSD**，表现完全正常。

️ 五、附加建议

*   测试过程中如果温度超过 **70°C**，速度可能会自动降；
*   如果结果明显比标称值低（比如 7000MB/s 的盘只跑出 3000MB/s）：
    1.  检查插槽是否是 **PCIe 4.0 x4**；
    2.  确保开启 **NVMe 驱动**；
    3.  试试换个 M.2 插槽；
    4.  或者 BIOS 里开启 **PCIe Gen4/Gen5 模式**。

---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
