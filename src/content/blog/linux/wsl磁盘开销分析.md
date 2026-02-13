---
title: "WSL磁盘开销分析"
description: "WSL1：基本上就是一个兼容层，体积很小，安装完大概几十 MB。"
pubDate: "2025-09-13"
updatedDate: "2026-02-13"
category: "linux"
tags: ["linux"]
sourcePath: "src/content/blog/ChatGPT-WSL磁盘开销分析.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“wsl的正常磁盘开销是多少”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. wsl的正常磁盘开销是多少

你问的 **“WSL 的正常磁盘开销”**，其实分几个层面来理解：

### 1\. **WSL 本体的开销**

*   **WSL1**：基本上就是一个兼容层，体积很小，安装完大概几十 MB。
*   **WSL2**：用了 Hyper-V 虚拟化，会创建一个 **虚拟硬盘文件 (ext4.vhdx)**，存放 Linux 系统和文件。刚安装完一个发行版（比如 Ubuntu 20.04），**基础占用大概 1.5GB~3GB 左右**。

### 2\. **虚拟磁盘 (ext4.vhdx) 的特性**

*   这个文件是 **动态扩容**的（sparse file），实际占用取决于你在 Linux 里存了多少东西。
*   当你删除文件时，Windows 并不会自动缩小 vhdx 的大小，需要手动执行：
```powershell
    wsl --shutdown
    Optimize-VHD -Path "C:\Users\<你>\AppData\Local\Packages\<发行版ID>\LocalState\ext4.vhdx" -Mode Full
```
这样才能真正收缩。

### 3\. **系统运行时的开销**

*   **内存**：WSL2 会动态占用内存，默认上限接近物理内存总量（可在 `.wslconfig` 里限制，比如 4GB）。
*   **CPU**：基本是你 Linux 程序用多少就分配多少，不会长期吃掉核心。
*   **磁盘性能**：
    *   WSL2 的 **ext4.vhdx 在 Windows 磁盘上**，所以文件 IO 性能略低于原生，但基本能跑开发任务。
    *   如果你直接在 `/mnt/c/...` 下读写 Windows 磁盘，速度会比在 Linux 自己的根目录慢（有跨层开销）。

### 4\. **正常情况总结**

*   **磁盘初始开销**：1.5GB ~ 3GB（干净的 Ubuntu/Debian 发行版）。
*   **随着使用增长**：几 GB 到几十 GB 不等（取决于你装的包和数据）。
*   **额外隐藏开销**：日志、缓存、pip/npm 包、docker 镜像等，很容易把 vhdx 涨到 20GB+。

换句话说，如果你刚装一个 WSL2 发行版，看到磁盘用了 **2GB 左右**，这是完全正常的；如果你跑开发环境（比如装 Docker、CUDA、编译器），涨到 **10~30GB** 也算正常。

### 主题 2. 我发现在wsl下，占用了400g

### 1\. **查看磁盘占用**

在 WSL 里运行：

```bash
df -h
```

*   看 `/`（根目录）挂载的磁盘空间用了多少。
*   如果 vhdx 占用非常大，可以确认确实是 Linux 里面的数据撑起来的。

然后用：

```bash
du -h --max-depth=1 / | sort -hr | head -20
```

*   找出哪些文件夹占用空间最多（一般是 `/home`, `/var`, `/usr`）。

### 2\. **常见大户**

*   **日志文件**：`/var/log` 有时候 log 被无限增长。
*   **缓存文件**：
    *   `apt`：`/var/cache/apt/archives`
    *   `pip`：`~/.cache/pip`
    *   `npm`：`~/.npm`
*   **Docker 容器/镜像**：如果你用 Docker Desktop + WSL2，镜像和卷可能占几十甚至上百 GB，路径一般在 `/var/lib/docker`。
*   **临时文件/下载**：忘记删除的 tar、iso、数据集等。

### 3\. **回收空间**

1.  清理 apt 缓存：

```bash
sudo apt clean
```

2.  清理 pip 缓存：

```bash
pip cache purge
```

3.  清理 npm 缓存：

```bash
npm cache clean --force
```

4.  清理日志：

```bash
sudo journalctl --vacuum-size=100M
```

5.  如果 Docker 很大：

```bash
docker system prune -a
```

### 4\. **缩小 vhdx**

WSL2 占用会动态增加，但删除文件后 **vhdx 不会自动缩小**，需要手动：

```powershell
wsl --shutdown
Optimize-VHD -Path "C:\Users\<你>\AppData\Local\Packages\<发行版ID>\LocalState\ext4.vhdx" -Mode Full
```

*   `<发行版ID>` 可以在 `C:\Users\<你>\AppData\Local\Packages\` 里找到对应发行版文件夹。
*   这个操作会把虚拟硬盘压缩到实际占用大小。

 **小结**：  
400GB 是 WSL2 的 vhdx 被某些东西撑起来的表现。先在 Linux 里用 `du` 找出大户，再清理缓存/日志/临时文件，最后再 Optimize-VHD 压缩。

### 主题 3. root@Wayne-5090:/mnt/e/workplace/git...

从你贴的 `df -h` 输出来看，问题就非常明显了：

### 1\. WSL 本体磁盘几乎没问题

*   `/` 挂在 `/dev/sdd`，大小 **1TB**，实际用 **26GB**，可用 **931GB**。
*   也就是说，WSL2 自己的 Linux 根文件系统根本没占多少空间。

### 2\. 真正吃掉 400GB 的是挂载的 Windows 分区

*   `/mnt/e` 挂在 **E: 驱动器**，大小 **932GB**，用掉 **926GB**，只剩 **5.8GB**。
*   `/mnt/c` 也用了 683GB，但看起来比例正常（C: 1.9T，总用 37%）。

️ 这意味着 WSL 没有“膨胀”到 400GB，而是你在 Linux 下操作或查看的文件，大部分其实在 **E: 驱动器**，Linux 只是挂载了它。WSL 里的 `du` 会统计挂载盘上的文件，尤其是 `/mnt/e/workplace/...` 里可能有大量数据。

### 3\. 排查思路

进入挂载的目录：

```bash
cd /mnt/e/workplace
du -h --max-depth=1 | sort -hr | head -20
```

*   会显示占用最大的几个文件夹。
*   很可能你工作目录或某些 git/data 目录就占掉几百 GB。

如果你只想看 WSL 自己的根文件系统占用，而排除挂载的 Windows 分区：

```bash
du -h --max-depth=1 / | grep -v '/mnt'
```

### 4\. 总结

*   **WSL 自己的 vhdx 根系统**：用掉 26GB → 正常。
*   **400GB 占用感**：是你挂载的 **E: 驱动器** 上的数据，不是 WSL 自身。
*   WSL 没有吃掉 400GB，你只是看到挂载盘的数据，Linux 下 `du` 会把挂载盘上的文件也算进去。

你希望我帮你写吗。

### 主题 4. C:\Users\wayne\AppData\Local\wsl这个文件...

啊，这下就清楚了，你看到的 **400GB** 其实就是 **WSL2 的虚拟硬盘文件（`.vhdx`）膨胀到很大**了，路径就是：

```
C:\Users\wayne\AppData\Local\Packages\<发行版ID>\LocalState\ext4.vhdx
```

在你的情况里可能直接在 `C:\Users\wayne\AppData\Local\wsl` 下。

### 为什么会变这么大

1.  **动态扩容的 vhdx**
    *   WSL2 的 vhdx 文件是动态增长的。你在 Linux 里写入大量文件（比如 git repo、数据集、Docker 镜像等），文件删掉后 **vhdx 并不会自动缩小**。
    *   所以哪怕你删掉文件，Windows 看到的 vhdx 文件依然很大。
2.  **Docker / 数据 /缓存**
    *   如果你在 WSL2 装了 Docker 或者在 Linux 下做了大数据处理，ext4.vhdx 很容易撑到几十甚至几百 GB。

### 怎么解决（缩小 vhdx）

1.  **先在 WSL 里清理垃圾**

```bash
sudo apt clean           # 清理 apt 缓存
pip cache purge          # 清理 pip 缓存
npm cache clean --force  # 清理 npm 缓存
sudo journalctl --vacuum-size=100M  # 清理日志
```

2.  **关闭 WSL**

```powershell
wsl --shutdown
```

3.  **压缩虚拟硬盘**  
在 Windows PowerShell（管理员）里运行：

```powershell
Optimize-VHD -Path "C:\Users\wayne\AppData\Local\wsl\<你的发行版ID>\ext4.vhdx" -Mode Full
```

*   这会把 vhdx 文件压缩到实际占用大小。
*   `<你的发行版ID>` 可以在 `C:\Users\wayne\AppData\Local\Packages` 里找到对应发行版文件夹名称。

 **小结**：

*   WSL2 本身不会占 400GB，实际上是 **vhdx 文件膨胀**导致的。
*   清理 Linux 里的缓存/临时文件，然后用 `Optimize-VHD` 压缩就能回收空间。

你希望我直接写吗。

### 主题 5. 有没有可能是wsl被分配了400G的空间

可以肯定地说：**WSL2 默认没有“预分配” 400GB 的空间**，它用的是 **动态扩容的虚拟硬盘（`.vhdx`）**，意思是：

### 1\. 动态扩容机制

*   WSL2 的虚拟硬盘文件初始非常小（几百 MB 到几 GB），随着你往 Linux 里写入文件，会慢慢增长。
*   **不会一次性预留 400GB**。只有你写入了大量数据，vhdx 才会膨胀到几百 GB。

### 2\. 配置限制

*   你可以通过 `%UserProfile%\.wslconfig` 或 `C:\Users\<你>\.wslconfig` 来设置 WSL 的内存、处理器和硬盘最大使用限制：

```ini
[wsl2]
memory=8GB   # 限制最大内存
processors=4 # 限制CPU
swap=0
```

*   **硬盘最大容量**默认是 vhdx 文件所在分区的剩余空间，不是静态分配。如果你没有手动配置，WSL2 也不会自动占 400GB。

### 3\. 结论

*   **400GB 占用** → 并不是 WSL2 预分配了这么多，而是 **你之前在 Linux 里写入过很多文件**，或者 Docker/缓存/临时数据撑大了 vhdx。
*   删除 Linux 里的大文件后，vhdx **不会自动缩小**，所以你看到的 400GB 就在那里。

你希望我帮你看吗。

### 主题 6. 怎么看我在wsl安装了多少

想要看你 **WSL2 里安装的软件、包和文件到底占用了多少空间**，可以从几个角度来查：

### 1\. **查看根文件系统的磁盘占用**

在 WSL 里运行：

```bash
du -h --max-depth=1 / | sort -hr
```

*   `du` 会统计每个一级目录大小，`-h` 是可读性（GB/MB），`--max-depth=1` 只看一级子目录。
*   这样你能看到 `/usr`、`/var`、`/home` 等哪个占用最多空间。

如果你只想看 **不包括挂载的 Windows 磁盘**，用：

```bash
du -h --max-depth=1 / | grep -v '/mnt'
```

### 2\. **查看 Linux 包管理器安装的软件**

*   **Ubuntu/Debian 系统**：

```bash
dpkg-query -Wf '${Installed-Size}\t${Package}\n' | sort -nr | head -20
```

*   输出按大小排序前 20 个安装的软件包。
*   `Installed-Size` 单位是 KB。
*   这样你能找到占用空间最大的程序。

### 3\. **查看缓存和临时文件**

很多时候 vhdx 膨胀是缓存撑起来的：

```bash
sudo du -sh /var/cache/apt/archives  # apt 缓存
du -sh ~/.cache                       # pip/npm 等缓存
sudo du -sh /var/log                   # 日志文件
```

*   清理缓存可以明显减少占用：

```bash
sudo apt clean
pip cache purge
npm cache clean --force
sudo journalctl --vacuum-size=100M
```

### 4\. **查看 Docker 镜像和卷**

如果你用 Docker Desktop + WSL2，Docker 镜像和卷通常占用大量空间：

```bash
docker system df
docker system prune -a   # 删除所有未使用的镜像、容器、卷
```

 **总结思路**：

1.  用 `du` 看根目录每个文件夹占用
2.  用包管理器查安装的软件包占用
3.  清理缓存、日志、Docker 等大文件

你希望我直接写吗。

### 主题 7. 我全都检查过了，除了mnt，其他文件夹加起来都不足100G

明白了，那现在情况就很清楚了：

### 关键点

*   **WSL 根文件系统 `/`**（排除 `/mnt`）总占用不到 100GB → Linux 系统本身并没撑到 400GB。
*   **你看到的 400GB 占用**，全部体现在 **`C:\Users\wayne\AppData\Local\wsl` 下的 `.vhdx` 文件**。
*   WSL2 的 `.vhdx` 文件 **只会动态增长，不会自动缩小**，即便你删掉了很多 Linux 文件或者缓存，vhdx 依然保持它膨胀后的大小。

换句话说：

> 你删除了 Linux 里的大部分数据，根文件系统实际只用 100GB，但 vhdx 之前膨胀到 400GB，现在还没压缩，所以 Windows 显示 400GB 占用。

### 解决方法

1.  **确保 WSL 已关机**：

```powershell
wsl --shutdown
```

2.  **压缩 vhdx 文件**（PowerShell，管理员权限）：

```powershell
Optimize-VHD -Path "C:\Users\wayne\AppData\Local\wsl\<发行版ID>\ext4.vhdx" -Mode Full
```

*   这个操作会把虚拟硬盘缩小到实际占用大小（在你情况里大概 100GB 左右）。
*   `<发行版ID>` 在 `C:\Users\wayne\AppData\Local\Packages\` 里找到对应发行版文件夹。

 **总结**：

*   WSL2 **不会主动占满 400GB**，也不会一次性分配这么多空间。
*   看到 400GB 是 **vhdx 文件膨胀后的大小**，即使你清理 Linux 系统数据，也需要手动压缩。

你想让我直接写吗。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
