---
title: Windows C 盘扩容失败：恢复分区阻挡处理
description: "解释恢复分区导致 C 盘无法扩容的原因，并给出使用 Diskpart 删除分区的步骤。"
pubDate: 2026-01-23
---

## Recovery partition

As figure shows, we found there is a recovery partition. This is because every time we upgrade Windows to the next version, the upgrader rechecks the system to reserve the partition or recover the space on the partition. If there is not enough space, it will additionally create a recovery partition. This leads to multiple recovery partitions in your hard drive, and if you want to avoid this problem, you can enlarge the size of the system reserved partition or recovery partition before upgrading and updating your system[^1] [^2].

![Example Image](/img/diskpart/diskpart-1.png "disk manager")

## How to solve this problem

We just need delete the recovery partition correctly[^3].

```powershell
$ diskpart
$ rescan
$ list disk
$ select disk [idx you want to delete]
$ list partition
$ select partition [idx you want to delete]
$ delete partition override
```



[^1]: https://www.disktool.cn/content-center/multiple-recovery-partitions-windows-10-666.html
[^2]: https://answers.microsoft.com/zh-hans/windows/forum/all/%e5%9c%a8windows%e7%a3%81%e7%9b%98%e7%ae%a1/c2a504b3-3098-49de-8ed4-24803fd22633
[^3]: https://answers.microsoft.com/zh-hans/windows/forum/all/%e5%a6%82%e4%bd%95%e5%88%a0%e9%99%a4%e5%a4%9a/502834dc-62a6-49fa-a744-4f5f0ac9350f
