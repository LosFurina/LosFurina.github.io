---
title: "Arch Linux 从零安装（UEFI + iwctl）"
description: "一份面向新手的 Arch Linux 安装实操笔记，覆盖 UEFI 启动、分区思路、iwctl 连接 Wi-Fi 与常见故障排查。"
pubDate: "2026-02-06"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Arch Linux From Scratch.md"
sourceVault: "obsidian/note"
slug: "infra/在-iwctl-交互模式下执行"
---
Arch Linux 以其高度的可定制性和“Keep It Simple, Stupid” (KISS) 原则著称，是深入理解 Linux 系统工作原理的绝佳途径。

以下将基于 **UEFI 模式**（现代电脑主流模式）的从零开始安装指南。这不仅仅是复制粘贴命令，更是构建系统的过程。

* * *
## 1. 准备与启动

在这一步，我们需要把 Arch Linux 的安装镜像写入 U 盘，并让电脑从这个 U 盘启动进入到安装环境。

#### **1\. 下载镜像**

*   去 [Arch Linux 官网下载页面](https://archlinux.org/download/)找到 **合适** 的区域，随便选一个链接（如清华源、阿里源），下载 `.iso` 结尾的文件（例如 `archlinux-202x.xx.xx-x86_64.iso`）。

#### **2\. 制作启动 U 盘**

*   准备一个 **4GB 以上** 的空 U 盘（数据会被清空，请备份）。
*   **如果你在 Windows 下**：
    *   下载软件 **Rufus**。
    *   打开 Rufus，设备选你的 U 盘。
    *   “引导类型选择” 点击“选择”，找到刚才下载的 ISO 文件。
    *   **分区类型**选 **GPT**，**目标系统**选 **UEFI**（这很重要）。
    *   点击“开始”，如果弹出模式选择，选 **DD 模式** 或 **ISO 模式** 均可（推荐默认 ISO 模式，如果启动失败再试 DD）。
* 如果你现在的环境是 **Linux** 或者 **macOS**，或者你单纯喜欢用命令行，`dd` 是最快也最直接的方法。但请务必小心：`dd` 也有个外号叫 **"Disk Destroyer" (硬盘毁灭者)**。因为如果你写错了目标盘符（比如把 U 盘写成了你的系统盘），数据瞬间就没了。
* 请按照以下步骤小心操作：
	*  **1\. 确认 U 盘的设备名 (最关键的一步)**
		* 先插入 U 盘，打开终端：
			* **Linux 用户**：输入 `lsblk`，你会看到类似 `sda`, `sdb`, `nvme0n1` 的设备。通过**容量**来判断哪个是你的 U 盘（比如 16G、32G 的那个）。
			* 记下设备名，例如 `/dev/sdb` (**注意：是 `/dev/sdb`，不是 `/dev/sdb1`**，我们要写入整个设备，而不是某个分区)。
		*   **macOS 用户**：输入 `diskutil list`
		    *   找到你的 U 盘（通常是 `/dev/disk2` 之类，标记为 external）。
	* **2\. 执行 dd 命令**
		* 假设：
			* 你的 ISO 文件路径是：`~/Downloads/archlinux.iso`
			*   你的 U 盘设备名是：`/dev/sdb` (**请务必替换成你实际查到的！**)
		* 命令格式如下：
```bash
sudo dd if=~/Downloads/archlinux.iso of=/dev/sdb bs=4M status=progress && sync
```
> **参数解释：**
> - `if=` (Input File)：输入文件，也就是你的 ISO 镜像路径。
> - `of=` (Output File)：输出文件，也就是你的 U 盘设备路径。
> - `bs=4M`：块大小设为 4MB，能加快写入速度。
> - `status=progress`：显示进度条（不然你会以为卡死了）。
> - `&& sync`：写入完成后强制同步缓存，确保数据完全写入 U 盘后再结束。

>为什么用 GPT： **GPT 是新标准，MBR 是旧标准**。
>在你的 Arch Linux 安装过程中，我们选择 **GPT** 是因为它更现代、更稳定，且完美支持 UEFI 启动模式。
>以下是它们的核心区别对比：
>核心区别速查表

| 特性         | GPT (GUID Partition Table)            | MBR (Master Boot Record)                  |
| ---------- | ------------------------------------- | ----------------------------------------- |
| **年代**     | **现代标准** (90年代末推出，现在主流)               | **老旧标准** (1983年推出，DOS时代产物)                |
| **支持硬盘大小** | **无限** (理论上到 18EB，目前随便买多大都行)          | **最大 2TB** (超过 2TB 的硬盘如果不转 GPT，多出的空间无法识别) |
| **分区数量**   | **几乎无限** (Windows 限制 128 个，Linux 下更多) | **最多 4 个主分区** (想分更多得用“扩展分区”这种麻烦的逻辑)       |
| **启动模式**   | **UEFI** (现代电脑标配，启动更快、界面更现代)          | **Legacy BIOS** (老式蓝底白字 BIOS，启动慢)         |
| **安全性**    | **高** (分区表有备份，头部存一份，尾部存一份，损坏了能救)      | **低** (分区表只有一份在硬盘开头，坏了整个盘分区全丢)            |

>为什么你的安装教程选 GPT？
>	**因为你用的是 UEFI 启动**：我在教程开头让你检查 `/sys/firmware/efi/efivars`，就是为了确认你是 UEFI 模式。UEFI 模式强制要求启动盘（系统盘）必须是 **GPT** 格式。
>	**未来兼容性**：Windows 11 等新系统已经强制要求 GPT + UEFI。
>	**方便管理**：GPT 没有“主分区”、“扩展分区”、“逻辑分区”这种烧脑的概念，所有分区地位平等，想分几个分几个。
>	**除非你在给 10 年前的老古董电脑装系统，否则无脑选 GPT。**

>在 Rufus 界面上：
>	**文件系统 (File System)** 请选择 **FAT32** (或者默认的 Large FAT32)
>	为什么？
>		因为你之前设置了 **UEFI** 启动模式。绝大多数主板的 UEFI 固件**只能**读取 FAT32 格式的启动盘。如果你选了 NTFS，电脑可能根本识别不到这个 U 盘，导致无法启动。

>**还有一个重要弹窗：**
>当你点底部的 **“开始 (START)”** 按钮后，Rufus 可能会弹出一个对话框，让你选择写入模式：
>**推荐选择：以 DD 镜像模式写入 (Write in DD Image mode)**
> 	 Arch Linux 官方镜像结构特殊，DD 模式是“原样克隆”，最稳，绝对能启动。
> 	 选了 DD 模式后，前面的“文件系统”选项其实就被忽略了，Rufus 会完全按照镜像原本的格式复刻进去。
> 	 **备选：以 ISO 镜像模式写入 (Write in ISO Image mode)**
> 	 如果 DD 模式失败了，再试这个。
> 	 **总结：界面上选 FAT32 -\> 点击开始 -\> 弹窗里选 DD 模式 -\> 确定。**

写完后拔插一下 U 盘，如果电脑能识别，就插入要装系统的电脑准备启动。

#### **3\. 等待结束**

当命令跑完，出现新的命令提示符时，说明刻录完成。此时拔掉 U 盘，插入你要安装 Arch 的那台电脑，准备启动。

#### **4\. BIOS 设置 (关键)**

*   重启电脑，狂按启动热键（通常是 F2, F12, Del 或 Esc，视主板品牌而定）进入 BIOS/UEFI 设置。
*   **必须做的两件事**：
    1.  找到 **Secure Boot (安全启动)**，设置为 **Disabled (关闭)**。
    2.  找到 **Boot Mode (启动模式)**，确保是 **UEFI** (不要选 Legacy 或 CSM)。
*   保存设置并重启。

#### **4\. 从 U 盘启动**

*   再次重启，进入 **Boot Menu (启动菜单)**，选择你的 U 盘启动（通常名字前带有 `UEFI: Kingston...` 之类的前缀）。
*   屏幕会出现一个黑色背景的菜单（Arch Linux Install Medium）。
*   直接按 **Enter** 选择第一项 `Arch Linux install medium (x86_64, UEFI)`。

* * *
#### **5. 等待确认**

等待屏幕上一堆代码跑完，直到画面停止不动。

确认你是否看到了类似下面的提示符：**

```
root@archiso ~ #
```

（光标在闪烁，可以输入字）

* * *
## 2. 环境检查与网络连接

Arch Linux 采用“在线安装”模式，**网络连接**是后续下载系统文件的基础。

### 1. 验证启动模式 (关键)

必须确认当前环境为 **UEFI 模式**。

**操作命令：**

Bash

```
ls /sys/firmware/efi/efivars
```

**结果判断：**

- ✅ **成功 (合格)**：屏幕输出大量文件名。 -> **继续下一步**。
    
- ❌ **失败 (不合格)**：提示 `No such file or directory`。
    
    - **原因**：当前为 Legacy (BIOS) 启动。
        
    - **动作**：**立即停止**。重启进入 BIOS，关闭 CSM/Legacy，强制开启 UEFI 模式。

### 2. 配置网络

#### 情况 A：有线连接 (推荐)

通常插入网线即可自动连接。

#### 情况 B：无线连接 (WiFi)

使用 `iwctl` 工具进行交互式配置。

**标准步骤：**

1. 进入交互模式：
    ```bash
    iwctl
    ```
2. 查看设备名 (记下你的网卡名，例如 `wlan0`)：
    ```
    [iwd]# device list
    ```
3. 扫描网络：
    ```
    [iwd]# station wlan0 scan
    ```
4. 列出 WiFi 列表：
    ```
    [iwd]# station wlan0 get-networks
    ```
5. 连接 WiFi (按提示输入密码)：
    ```
    [iwd]# station wlan0 connect <你的WiFi名称>
    ```
6. 退出工具：
    ```
    [iwd]# exit
    ```
#### 🛠️ WiFi 故障排查 (可选)

如果在步骤 2 中发现设备状态为 `Powered: off` 或无法连接，请尝试以下方法。

**方法一：在 iwctl 内部开启电源**

Bash

```
# 在 iwctl 交互模式下执行
device wlan0 set-property Powered on
```

_执行后再次输入 `device list` 确认 Powered 变为 `on`。_

方法二：解除 RFKill 锁定 (如果方法一无效)

如果系统底层锁住了网卡，需退出 iwctl 回到终端执行：

Bash

```
# 1. 解锁所有无线设备
rfkill unblock wifi

# 2. 强制拉起网卡接口 (注意替换 wlan0 为实际设备名)
ip link set wlan0 up

# 3. 重新进入 iwctl 尝试连接
iwctl
```

### 3. 验证网络连通性

Ping Arch Linux 官网测试网络是否畅通。

Bash

```
ping -c 3 archlinux.org
```

- **成功标志**：看到 `64 bytes from ...` 的回显。

### 4. 更新系统时间

**目的**：确保系统时间准确，防止 HTTPS 证书验证失败导致无法下载软件包。

```bash
timedatectl set-ntp true
```

#### 🧩 命令详解

- **`timedatectl`**：Linux 系统中用于管理“时间”和“日期”的控制工具。
    
- **`set-ntp`**：设置 **N**etwork **T**ime **P**rotocol（网络时间协议）。
    
- **`true`**：设置为“开启”状态。
    

#### ⚠️ 为什么这一步是“致命级”关键？

不要以为“装好系统再改时间”也可以，在 Arch 安装过程中，时间错误会导致严重后果：

1. **HTTPS 证书验证失败（最常见错误）**
    
    - **现象**：`pacman` 下载软件全部报错，提示无法连接或证书错误。
        
    - **原因**：HTTPS 协议极其依赖时间准确性。如果你的电脑时间是错的（例如显示 2000 年），服务器的安全证书会被判定为“尚未生效”或“已过期”，连接会被强制拒绝。
        
2. **文件时间戳混乱**
    
    - **后果**：安装时写入的文件会带有错误的时间戳，这会导致日后系统更新、日志记录或软件编译时出现严重的逻辑冲突。
        

> **效果**：执行命令后，系统后台会自动寻找互联网时间服务器，将本机时间瞬间校准，分秒不差。

## 3. **磁盘分区**

这是最容易出错的一步，所以我们用最直观的工具 `cfdisk` 来做。

**⚠️ 警告：接下来的操作会清空目标磁盘的所有数据。请确保你没选错盘！**

### **1\. 确认目标磁盘**

输入命令：

```
lsblk
```

*   查看列表。通常你的系统盘（非 U 盘）名字是 `/dev/nvme0n1`（如果是 SSD）或者 `/dev/sda`（如果是机械硬盘或 SATA SSD）。
*   记住这个名字，比如我们假设是 `/dev/nvme0n1`。

### **2\. 进入分区工具**

输入命令（请把设备名替换成你自己的）：

```
cfdisk /dev/nvme0n1
```

*   **如果你看到 `Select label type` 的界面**：
    *   用键盘上下键选择 **gpt**，回车。
*   **如果你直接进去了**：
    *   也没事，看底下只要显示 `Label: gpt` 就行。

### **3\. 删除旧分区 (如果有)**

*   如果界面里已经有分区（比如以前的 Windows 分区），用上下键选中它们，按左右键选择底部的 `[ Delete ]`，回车。
*   重复此操作，直到整个列表只剩下一行：`Free space`（空闲空间）。

### **4\. 创建新分区 (严格按照顺序)**

你需要创建 3 个分区。请按步骤操作：

**第一分区：EFI 引导分区 (关键)**

1.  选中 `Free space`，选择 `[ New ]`，回车。
2.  **Partition size**: 输入 `512M`，回车。
3.  **Type**: 默认可能是 `Linux filesystem`，你需要按左右键选 `[ Type ]`，然后找到 **EFI System**，回车选中。
    *   _(这一步很重要，类型不对会导致无法启动)_

**第二分区：Swap 交换分区 (虚拟内存)**

1.  选中剩下的 `Free space`，选择 `[ New ]`，回车。
2.  **Partition size**: 输入 `16G` (如果你的内存是 16G 或 32G，给 16G 够用了；如果内存小，给 8G 也行)，回车。
3.  **Type**: 选中刚建好的这个分区，选 `[ Type ]`，找到 **Linux swap**，回车。

**第三分区：根分区 (所有剩余空间)**

1.  选中最后剩下的 `Free space`，选择 `[ New ]`，回车。
2.  **Partition size**: 默认会填满剩余空间，直接回车即可。
3.  **Type**: 默认就是 **Linux filesystem**，不用改。

### **5\. 写入并退出**

1.  检查一下你的列表，应该有 3 行：
    *   `EFI System` (512M)
    *   `Linux swap` (16G)
    *   `Linux filesystem` (剩余全部)
2.  按左右键选择底部的 `[ Write ]`，回车。
3.  **输入 `yes`** 并回车（它会问你是否确定写入）。
4.  选择 `[ Quit ]` 退出。

* * *

**做完后，输入 `lsblk` 确认一下现在的结构。** 你应该能看到 `/dev/nvme0n1` 下面分出了 `p1`, `p2`, `p3` (或者 `sda1`, `sda2`, `sda3`)。

## 4. **格式化与挂载**。

既然“房子”（分区）已经建好了，现在要开始“装修”（格式化）并把门打开（挂载），这样才能往里面搬家具（安装系统）。

请先再次输入 `lsblk`，确认你的分区编号。

*   **假设**你的结构是：
    *   `p1` (或 `sda1`): EFI 分区 (512M)
    *   `p2` (或 `sda2`): Swap 分区 (16G)
    *   `p3` (或 `sda3`): 根分区 (剩余空间)

* * *

### **1\. 格式化 (建立文件系统)**

请依次执行下面的命令（**注意把 `nvme0n1pX` 换成你实际的编号**）：

**A. 格式化 EFI 分区 (必须是 FAT32)**

```
mkfs.fat -F 32 /dev/nvme0n1p1
```

**B. 启用 Swap 分区**

```
mkswap /dev/nvme0n1p2
swapon /dev/nvme0n1p2
```

**C. 格式化根分区 (使用 ext4)**

```
mkfs.ext4 /dev/nvme0n1p3
```

_(这步可能需要几秒钟，等待它跑完)_

* * *

### **2\. 挂载分区 (顺序极重要)**

Linux 的挂载逻辑像搭积木，必须**先挂载根目录**，再挂载子目录。

**A. 挂载根分区** 把你的主分区挂载到 `/mnt` 目录（这是安装介质专门预留给我们要装的系统的位置）：

```
mount /dev/nvme0n1p3 /mnt
```

**B. 挂载 EFI 分区** 先在刚才挂载好的新盘里创建一个 `/boot` 文件夹，然后把 EFI 分区挂上去：

```
mkdir /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot
```

* * *

### **3\. 二次检查**

输入命令：

```
lsblk
```

请仔细看输出的 **MOUNTPOINTS** (挂载点) 这一列：

1.  你的根分区 (p3) 后面应该显示 `/mnt`。
2.  你的 EFI 分区 (p1) 后面应该显示 `/mnt/boot`。
3.  你的 Swap 分区 (p2) 后面应该显示 `[SWAP]`。

## 5. 安装核心系统 (Base System)

这一步是将 Arch Linux 的“灵魂”从互联网下载并注入到你的硬盘 (`/mnt`) 中。

### 1. 优化下载源 (镜像)

下载速度决定了安装体验。我们优先尝试自动优化，如果失败则手动干预。

#### ✅ 方案一：自动筛选 (首选)
使用 `reflector` 筛选最新的、按速率排序的 5 个镜像源。

```bash
reflector --latest 5 --sort rate --save /etc/pacman.d/mirrorlist
````

- **成功标志**：命令运行几秒钟后结束，无报错。 -> **直接跳到第 2 步**。
    
- **失败/报错**：如果网络不稳定或工具报错，请执行下面的 **方案二**。
    

#### ⚠️ 方案二：手动指定 (备选)

如果方案一失败，或者下载速度极慢（几十 KB/s），需手动修改镜像列表。

A. 简单粗暴法

直接运行下面的安装命令（第2步）。如果是运气好，默认源速度不错 (>1MB/s)，就不用折腾。如果不幸很慢，按 Ctrl+C 停止，执行 B。

**B. 手动编辑法 (Vim 操作)**

1. **打开列表**：`vim /etc/pacman.d/mirrorlist`
    
2. **搜索**：输入 `/United States` 或 `/China` 回车。
    
3. **置顶优质源**：
    
    - 找到目标行 (如 `kernel.org` 或 `ustc` 等)。
        
    - **剪切**：按两次 `d` (`dd`)。
        
    - **去顶部**：按 `g` `g`。
        
    - **粘贴**：按 `P` (大写)。
        
4. **保存**：输入 `:wq` 回车。
    
5. **刷新**：`pacman -Syy`

### 2. 执行安装 (Pacstrap)

这是安装过程的核心命令，将把系统安装到 `/mnt`。

Bash

```
pacstrap /mnt base linux linux-firmware base-devel vim networkmanager
```

**📦 软件包清单详解：**

- **`base`**：Arch 的基础文件系统结构。
    
- **`linux`**：系统内核 (Kernel)。
    
- **`linux-firmware`**：硬件驱动固件 (WiFi/显卡等)。
    
- **`base-devel`**：编译工具包 (含 sudo, gcc)，后续使用 AUR 必备。
    
- **`vim`**：文本编辑器 (如果不习惯 Vim 可改为 nano)。
    
- **`networkmanager`**：**关键组件**！负责管理网络连接，不装重启后会没网。
    
- 你**不需要**在 `pacstrap` 里单独安装 `iwd`（即 `iwctl` 所属的包）。
>**为什么不需要？**
>因为我们刚才安装了 **`networkmanager`**。
>在 Linux 世界里，管理 WiFi 主要有两种主流方案：
>- **方案 A (iwd)**：非常轻量，命令行就是 `iwctl`。
>- **方案 B (NetworkManager)**：功能最全、最强大，也是目前 Arch、Ubuntu、Fedora 等主流系统的标配。它的命令行工具叫 **`nmcli`** 或带有彩色界面的 **`nmtui`**。
>- 如果你安装了 `networkmanager`，它本身就具备连接 WiFi 的能力，不再需要 `iwctl` 了。
> **小贴士**：如果你执意想要 `iwctl` 的操作体验，也可以在 `pacstrap` 命令后面加上 `iwd`。但为了系统简洁，建议只留一个“管家”。我们重启后会用 `nmtui` 连网，它比 `iwctl` 更直观。

### 3. 生成 Fstab 文件

系统需要知道启动时如何挂载硬盘分区，我们需要生成这张“分区地图”。

**1. 生成命令：**

Bash

```
genfstab -U /mnt >> /mnt/etc/fstab
```

**2. 检查结果：**

Bash

```
cat /mnt/etc/fstab
```

- **检查点**：你应该看到包含 `UUID=xxxx` 的行，分别对应你的 ext4 (根分区) 和 vfat (EFI 分区)。

* * *

如果你已经运行完了 `genfstab` 并检查过文件内容了：

**请执行这一步：进入新系统 (Chroot)** 我们要从 U 盘的临时环境，“穿越”进你刚装好的硬盘系统里：

```
arch-chroot /mnt
```

**执行完后，你会发现提示符变样了（可能去掉了 `archiso` 字样）。**

## 6. **系统内部配置 (Chroot)**。

现在我们要从 U 盘的“临时系统”切换到你硬盘里刚装好的“真实系统”中进行配置。

### **1\. 进入新系统 (Chroot)**

输入以下命令：

```
arch-chroot /mnt
```

*   你会发现命令提示符变了，这代表你现在已经“身在”你的硬盘里了。

### **2\. 设置时区**

因为你在 **洛杉矶 (Los Angeles)**，我们直接设置为美西时间：

```
ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime
```

然后同步硬件时钟：

```
hwclock --systohc
```

### **3\. 设置语言 (Locale)**

我们需要生成英文编码，防止显示乱码。

1.  编辑配置文件：
    ```
    vim /etc/locale.gen
    ```
2.  **取消注释**：
    *   按 `/` 输入 `en_US.UTF` 回车搜索。
    *   找到 `#en_US.UTF-8 UTF-8`，按 `x` 删除前面的 `#` 号。
    *   _(可选)_ 如果需要中文支持，也可以顺便搜 `zh_CN.UTF` 把 `#zh_CN.UTF-8 UTF-8` 去掉。
3.  **保存退出**：输入 `:wq` 回车。
4.  **生成 Locale**：
    ```
    locale-gen
    ```
5.  **设置默认语言**（建议用英文，防止 TTY 界面乱码）：
    ```
    echo "LANG=en_US.UTF-8" > /etc/locale.conf
    ```

### **4\. 设置主机名 (Hostname)**

给你的电脑起个名字（比如叫 `archlinux`）：

```
echo "archlinux" > /etc/hostname
```

接着配置 hosts 文件：

```
vim /etc/hosts
```

按 `i` 进入编辑模式，输入以下内容（把 `archlinux` 换成你刚才起的名字）：

```
127.0.0.1   localhost
::1         localhost
127.0.1.1   archlinux.localdomain archlinux
```

为了让你看清楚结构，假设你给电脑起的名字是 **`my-pc`**，那么你的 `/etc/hosts` 这一行应该写成：

```
127.0.1.1   my-pc.localdomain  my-pc
```

简单解释一下：
*   第一个（带 `.localdomain` 的）：是你的**全限定域名 (FQDN)**，类似文件的“全路径”。
*   第二个：是你的**主机别名**，方便系统内部快速识别。

按 `Esc`，输入 `:wq` 保存退出。

### **5\. 设置 Root 密码 (重要)**

这是你的超级管理员密码，千万别忘了。

```
passwd
```

输入两次密码（输入时屏幕不会显示星号，是正常的）。

* * *

## 7. **创建用户与安装引导 (关键)**。

我们不能一直用 Root 裸奔，同时我们需要安装“钥匙”让电脑能启动。

### **1\. 创建普通用户**

假设你的用户名叫 `myuser`（请自行替换）：

```
useradd -m -G wheel -s /bin/bash myuser
```

*   `-m`: 创建家目录。
*   `-G wheel`: 把用户加入管理员组（wheel 组）。

**设置用户密码：**

```
passwd myuser
```

**赋予 Sudo 权限：** 我们需要编辑 sudo 配置文件：

```
EDITOR=vim visudo
```

*   向下滚动，找到这一行： `# %wheel ALL=(ALL:ALL) ALL`
*   **去掉前面的 `#` 号**（取消注释）。
*   `:wq` 保存退出。

* * *

### **2\. 安装引导程序 (GRUB)**

这是让 Arch 能启动的核心。

**A. 安装软件包** 你需要根据你的 CPU 厂商加装一个微码包（Microcode），这对系统稳定性很重要。

*   如果你是 **Intel** CPU：装 `intel-ucode`
*   如果你是 **AMD** CPU：装 `amd-ucode`

执行安装命令（假设你是 AMD，如果是 Intel 请自行替换）：

```
pacman -S grub efibootmgr amd-ucode
```

**B. 安装 GRUB 到 EFI 分区**

```
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
```

*   **检查输出**：如果不报错，显示 `Installation finished. No error reported.`，就是成功了。

**C. 生成配置文件**

```
grub-mkconfig -o /boot/grub/grub.cfg
```

*   **检查输出**：你应该能看到它找到了 `Linux image` 和 `initrd image`。

* * *

### **3\. 启用网络服务 (最后一步配置)**

如果不做这一步，重启后你会没网，也没法用 `nmtui`。

```
systemctl enable NetworkManager
```

_(注意大小写，N 和 M 是大写的)_

* * *

## 8. **收尾与重启**。

恭喜你，最艰难的部分已经结束了。现在我们要安全地退出安装环境，拔掉 U 盘，看看你的劳动成果。

### **1\. 退出 Chroot 环境**

你现在还在硬盘系统里，需要先退回到 U 盘环境。 输入：

```
exit
```

*   你的命令提示符应该会变回 `root@archiso ...` 这种样式。

### **2\. 卸载分区**

为了防止数据丢失，我们需要手动卸载挂载的硬盘。 输入：

```
umount -R /mnt
```

### **3\. 重启电脑**

输入：

```
reboot
```

**⚠️ 关键动作**： 当你屏幕变黑或者出现主板 Logo 的时候，**立刻拔掉 U 盘**！否则电脑可能又从 U 盘启动进安装界面了。

* * *

### **重启后会发生什么？**

1.  你会看到 **GRUB 启动菜单**（黑底白字，第一项是 `Arch Linux`）。
    *   _直接回车进入。_
2.  屏幕会滚动一堆代码，然后停在 `archlinux login:`。
3.  **登录**：
    *   输入你刚才创建的用户名（例如 `myuser`）。
    *   输入密码。

* * *

### **进入系统后的第一件事：连网**

因为你现在面对的是一个纯黑的命令行界面（TTY），你需要先连上网，才能安装图形界面。

还记得我们装了 `NetworkManager` 吗？它带有一个简易图形界面。

1.  输入命令：
    ```
    nmtui
    ```
2.  选择 **Activate a connection**（启用连接）。
3.  在列表里选中你的 WiFi，回车，输入密码。
4.  连接成功后按 `Esc` 退出。
5.  测试一下：`ping archlinux.org`。

* * *

**一旦你成功登录并连上了网，你就拥有了一个完美运行的 Arch Linux 基系统！**

接下来就是“装修”环节了（安装显卡驱动和桌面环境）。

## 9. 安装显卡驱动与桌面环境 (KDE Plasma)

我强烈推荐 **KDE Plasma**，因为它对游戏特性 (VRR/HDR) 支持更好，定制性极强，且拥有类似 Windows 的传统布局，上手极快。

### 第一步：安装显卡驱动 (⚠️ 核心步骤)

进桌面黑屏通常是因为这一步没做好。请根据你的硬件**三选一**：

#### 🟢 选项 A：NVIDIA 显卡 (N 卡)

适用于大多数游戏本和台式机。

Bash

```
pacman -S nvidia nvidia-utils nvidia-settings
```

#### 🔴 选项 B：AMD 显卡 (A 卡)

Bash

```
pacman -S mesa vulkan-radeon xf86-video-amdgpu
```

#### 🔵 选项 C：Intel 核显 (你的 Intel Ultra 5)

适用于轻薄本或仅使用核显的情况。

Bash

```
pacman -S mesa vulkan-intel intel-media-driver
```

- **`mesa`**: 基础 OpenGL 驱动。
    
- **`vulkan-intel`**: Vulkan 驱动 (运行 Steam 游戏必装)。
    
- **`intel-media-driver`**: **关键！** 视频硬件解码驱动。看 4K 视频时由显卡硬解，CPU 占用低，大幅提升笔记本续航。

### 第二步：安装 KDE Plasma 全家桶

安装桌面核心、终端、文件管理器和登录管理器。

Bash

```
pacman -S plasma-meta konsole dolphin sddm
```

- **`plasma-meta`**: KDE 核心组件。
    
- **`konsole`**: 终端 (必装)。
    
- **`dolphin`**: 文件管理器 (必装)。
    
- **`sddm`**: 登录管理器 (开机输密码的界面)。
    

> **提示**：安装过程中若询问 `pipewire` 等依赖选择，**全部直接回车**使用默认值即可。

### 第三步：启用并进入桌面

1. **设置 SDDM 开机自启**：
    
    Bash
    
    ```
    systemctl enable sddm
    ```
    
2. **立刻启动图形界面**：
    
    Bash
    
    ```
    systemctl start sddm
    ```
    

**效果**：屏幕闪烁后，你将看到图形化登录界面。输入密码登录，欢迎来到 Arch Linux！

📖 知识扩展：为什么要用 SDDM？

“启动器”在 Linux 中称为 **Display Manager (显示管理器)**。针对 KDE 用户，**SDDM** 是最佳选择。

|**显示管理器**|**最佳拍档**|**特点**|**评价**|
|---|---|---|---|
|**SDDM**|**KDE**|颜值高、支持动态壁纸、Wayland 支持好|**KDE 用户首选**，无缝融合，不引入多余依赖。|
|**GDM**|GNOME|动画丝滑|GNOME 专用。在 KDE 上用会引入大量 GNOME 依赖，导致系统臃肿。|
|**LightDM**|XFCE/MATE|极度轻量、速度快|老牌万金油。适合低配电脑，但高分屏缩放配置较繁琐。|
|**Ly**|i3/Hyprland|纯文本/黑客风|无图形界面 (TUI)，极客/平铺窗口管理器用户最爱。|

**结论**：对于 Intel Ultra 5 + KDE 的组合，**坚持使用 SDDM**。它对 Intel 核显的 Wayland 模式支持最稳，且开箱即用。

## 10. 安装后配置 (第一阶段：基础软件与中文环境)

刚进入桌面时系统是“光秃秃”的，我们需要“三件套”来让它变得可用：**浏览器**、**中文字体**、**输入法**。

_操作方法：在桌面按 `Ctrl + Alt + T` 或菜单搜索打开 `Konsole`。_

### 1. 安装浏览器 (Firefox)

Arch 默认不含浏览器。先装 Firefox 应急，Chrome 需后续通过 AUR 安装。

Bash

```
sudo pacman -S firefox
```

### 2. 修复中文乱码 (拒绝“豆腐块”) 🧊

这是一个非常经典的 Arch 现象：打开中文网页全是方块。

原因：你装了系统，但没装中文字体。Arch 默认只带基础英文字体。

我们安装 Google 开发的 **Noto CJK** (中日韩) 字体库，兼容性最好。

Bash

```
sudo pacman -S noto-fonts-cjk noto-fonts-emoji
```

- **`noto-fonts-cjk`**: 解决中文/日文/韩文显示为方块的问题。
    
- **`noto-fonts-emoji`**: (可选) 让系统支持显示 Emoji 表情。
    

> **生效方法**：安装后，关闭并重新打开 Firefox 即可见效。如果系统界面仍有乱码，注销并重新登录即可。

### 3. 安装中文输入法 (Fcitx5)

KDE 对 Fcitx5 框架支持最佳。

Bash

```
sudo pacman -S fcitx5-im fcitx5-chinese-addons
```

> **注意**：询问包选择时，**直接回车** (默认全选)，确保包含 Qt 和 GTK 模块，防止在某些软件里无法打字。

### 4. 启用输入法 (⚠️ 必做)

安装只是第一步，必须在系统设置里“激活”它，否则无法切换。

1. **打开设置**：菜单搜索 "System Settings" (系统设置)。
    
2. **定位路径**：左侧栏 `Input & Output` (输入输出) -> `Keyboard` (键盘)。
    
3. **修改配置**：点击 `Virtual Keyboard` (虚拟键盘) 选项卡。
    
4. **激活**：选中 **Fcitx 5**，点击右下角 `Apply` (应用)。
    
5. **重启生效**：**注销并重新登录** (或重启电脑)。
    

**✅ 验证清单：**

1. 打开 Firefox，访问中文网站 (如 B站)，确认不再显示方块乱码。
    
2. 按 `Ctrl + Space` (空格)，确认能切出拼音输入法并打字。

## 11. 配置第二阶段：解锁 AUR (Arch User Repository)

AUR 是什么？

Arch 官方仓库虽然丰富，但受限于版权或维护策略，不收录 Google Chrome, VSCode, Slack, Zoom 等专有软件。AUR 是由社区维护的“超级仓库”，几乎涵盖了 Linux 平台所有的软件。

我们需要安装 **`yay`**。它是最流行的 AUR 助手，能像 `pacman` 一样管理官方和 AUR 软件，自动完成“下载源码 -> 编译 -> 安装”的全过程。

### 1. 安装 `yay` (三步走)

请在 `Konsole` 中按顺序执行以下命令：

#### 第一步：安装 Git

确保你有拉取代码的工具。

Bash

```
sudo pacman -S git
```

#### 第二步：克隆源码

将 `yay` 的源代码下载到本地（通常放在当前目录即可，安装完可删除）。

Bash

```
git clone https://aur.archlinux.org/yay.git
```

#### 第三步：编译并安装

进入目录，让系统自动构建安装包。

Bash

```
cd yay
makepkg -si
```

- **`makepkg`**: 制作安装包的脚本。
    
- **`-s`**: 自动安装缺少的依赖 (Sync dependencies)。
    
- **`-i`**: 编译成功后自动安装 (Install)。
    

> **注意**：如果不报错，最后会询问是否安装，输入 `y` 回车即可。

### 2. 使用 `yay` 安装软件

从此以后，你可以用 `yay` 代替 `pacman`。它既能装官方软件，也能装 AUR 软件。

#### 实战：安装 Google Chrome

官方仓库只有开源的 Chromium，要用原版 Chrome 必须走 AUR。

Bash

```
yay -S google-chrome
```

#### 💡 `yay` 的常见交互提示

第一次使用时，新手容易被问懵，请参考以下“标准答案”：

1. **Packages to CleanBuild?** (是否清除构建缓存？)
    
    - 👉 **直接回车** (默认 None/All 均可，通常选 None)。
        
2. **Diffs to show?** (是否查看代码差异？)
    
    - 👉 **直接回车** (默认 None，除非你想审查代码)。
        
3. **Password**:
    
    - 👉 输入你的用户密码（安装软件需要 sudo 权限）。

### 3. 推荐给 CS 学生的软件清单 (可选)

既然装好了 `yay`，不妨把开发工具也装上：

- **VSCode (官方二进制版)**:
    
    - _注意：要装 `-bin` 结尾的版本，否则会从源码编译，非常慢。_
        
    
    Bash
    
    ```
    yay -S visual-studio-code-bin
    ```
    
- **JetBrains Toolbox (全家桶管理工具)**:
    
    Bash
    
    ```
    yay -S jetbrains-toolbox
    ```

**✅ 阶段性任务：**

1. 成功安装 `yay`。
    
2. 安装一个你熟悉的浏览器或编辑器，确认能在菜单中启动它。

## 12. 美化登录界面 (SDDM) 与 🚑 紧急救援指南

Arch 默认的 SDDM 界面非常简陋，但作为 KDE 用户，我们可以轻松将其替换为高颜值主题（如 Mac 风格或 Cyberpunk 风格）。

### 🎨 Part 1: 更换高颜值主题

#### 1. 打开设置

1. 按 `Win` 键打开菜单，搜索并打开 **"Login Screen (SDDM)"** (登录屏幕)。
    
2. 点击右下角的 **"Get New SDDM Themes..."** (获取新 SDDM 主题)。
    
3. **关键操作**：在弹窗右上角，将排序方式改为 **"Highest Rated"** (评分最高) 或 **"Most Downloaded"**，以确保下载到质量稳定的主题。
    

#### 2. 推荐主题

- **Sugar Candy**：最受欢迎的主题之一。类似 Win 10 风格，简洁大方，特色是**可以直接同步显示你的桌面壁纸**。
    
- **White Sur**：完美复刻 macOS Big Sur 风格（如果你之前设置了自然滚动，配合这个简直完美）。
    
- **Catppuccin**：极客圈很火的粉嫩/暗色调配色方案。
    

#### 3. 安装与应用

1. 点击 **Install** 下载你喜欢的主题。
    
2. 关闭下载窗口，在列表中**选中**该主题。
    
    - _技巧：对于 Sugar Candy 等主题，选中后点击下方的 `List` 图标或 `Configure` 按钮，可以自定义背景图片。_
        
3. 点击 **Apply** (应用)，输入密码。
    

#### 4. 预览效果

无需重启。点击菜单 -> **Leave** (离开) -> **Log Out** (注销)，即可立刻看到新界面。

### 🚑 Part 2: 紧急救援 (如果黑屏了怎么办？)

**⚠️ 必读：** 有时因为主题 Bug 或依赖缺失，更换主题后可能会导致 SDDM 卡死或黑屏。**别慌，系统没坏，只是“大门”卡住了，我们需要走“侧门”进去。**

#### 1. 进入 TTY (纯文本模式)

当图形界面卡死时，按住键盘组合键：

Ctrl + Alt + F3

(如果 F3 没反应，尝试 F4、F5 或 F6)

> **成功标志**：屏幕变黑，显示一行白字 `archlinux login:`。

#### 2. 登录系统

输入你的用户名和密码进行登录。只要能登录，说明系统内核完好。

#### 3. 恢复默认配置

我们需要修改配置文件，强制把主题改回最稳的默认值 (`breeze`)。

输入命令编辑配置：

Bash

```
sudo vim /etc/sddm.conf.d/kde_settings.conf
```

_(注：如果提示文件不存在，尝试编辑 `/etc/sddm.conf`)_

**操作步骤：**

1. 找到 `[Theme]` 区域。
    
2. 找到 `Current=xxxx` (xxxx 是导致黑屏的主题名)。
    
3. 将其修改为：
    
    Plaintext
    
    ```
    Current=breeze
    ```
    
4. **保存退出**：按 `Esc` -> 输入 `:wq` -> 回车。
    

#### 4. 重启图形界面

输入以下命令，让 SDDM 重新加载配置：

Bash

```
sudo systemctl restart sddm
```

**结果**：屏幕应自动跳回图形登录界面。

## 13. 进阶美化：打造 Mac 风格登录界面 (防黑屏版) 🍎

如果你想要 **Mac 风格 (Big Sur / Monterey)** 的登录体验，**强烈建议**不要使用系统设置里的“下载新主题”按钮。那个功能只下载皮肤但不下载依赖，极易导致黑屏。

既然已经安装了 `yay`，我们将用最安全、依赖管理最完善的方式来操作。

### 🛡️ 第一步：安装核心绘图依赖 (防黑屏补丁)

**这是最关键的一步！** 90% 的花哨主题黑屏都是因为缺了这些 Qt 绘图库。

Bash

```
sudo pacman -S qt5-graphicaleffects qt5-quickcontrols2 qt5-svg
```

### 🎨 第二步：安装 White Sur 主题

**White Sur** 是目前 Linux 上复刻 macOS 最完美的主题之一，支持模糊特效、居中头像和 Mac 风格用户列表。

使用 `yay` 安装（它会自动处理部分依赖）：

Bash

```
yay -S sddm-theme-whitesur-git
```

_(安装过程中若询问 provider，直接回车选默认即可)_

### ⚙️ 第三步：应用主题 (修改配置文件)

为了保险起见，我们直接修改配置文件来启用它，而不是去图形界面点点点。

1. **编辑配置**：
    
    Bash
    
    ```
    sudo vim /etc/sddm.conf.d/kde_settings.conf
    ```
    
    _(注：如果文件为空，直接写入即可；如果有内容，修改对应行)_
    
2. 修改内容：
    
    找到 [Theme] 区域，将 Current 修改为 whitesur：
    
    Ini, TOML
    
    ```
    [Theme]
    Current=whitesur
    ```
    
3. **保存退出**：按 `Esc` -> 输入 `:wq` -> 回车。

### 🧪 第四步：测试预览

无需重启，直接运行测试命令查看效果：

Bash

```
sddm-greeter --test-mode --theme /usr/share/sddm/themes/whitesur
```

- **现象**：桌面上会弹出一个窗口模拟登录界面。
    
- **判定**：如果看到了漂亮的 Mac 风格界面且没有报错/黑屏，说明配置成功！

* * *

## **14\. 开启神级特效 (果冻 + 妙控灯)**

Mac 的精髓在于动画。

1.  回到 **System Settings** -\> **Workspace Behavior** (工作区行为) -\> **Desktop Effects** (桌面特效)。
2.  搜索并勾选以下特效：
    *   **Wobbly Windows** (果冻窗口)：移动窗口时会像果冻一样抖动（Linux 必装装逼神器）。
    *   **Magic Lamp** (神灯/阿拉丁)：最小化窗口时像 Mac 一样被“吸”进 Dock 里。
3.  点击 **Apply**。

* * *

**现在的任务：** 试着拖动一下窗口，看看有没有果冻效果？最小化窗口，看看有没有神灯效果？

## 15. 终端美化 (Zplug 版)：Zplug + Powerlevel10k 🚀

既然追求性能且不喜欢臃肿的 Oh My Zsh，**Zplug** 是绝佳选择。它基于插件管理，启动速度极快。我们将配合 **Powerlevel10k (P10k)** 主题，打造即时响应的现代化终端。

### 第一步：安装核心字体 (Meslo Nerd Font)

P10k 主题依赖特定字体来显示图标（如 Git 分支、锁头）。直接通过 AUR 安装打好补丁的版本。

Bash

```
yay -S ttf-meslo-nerd-font-powerlevel10k
```

_(注：安装后无需手动配置，P10k 向导通常会自动识别。如果乱码，去 Konsole 设置里手动选 `MesloLGS NF`)_

### 第二步：安装 Zplug

使用 `yay` 安装，系统路径通常位于 `/usr/share/zplug`。

Bash

```
yay -S zplug
```

### 第三步：配置 `.zshrc` (写入插件列表)

我们需要告诉 Zsh 启动时加载 Zplug 和需要的插件。

1. **编辑配置文件**：
    
    Bash
    
    ```
    vim ~/.zshrc
    ```
    
2. **写入以下配置** (清空原内容或追加)：
    
    Bash
    
    ```
    # 1. 初始化 Zplug (Arch 包的默认路径)
    source /usr/share/zplug/init.zsh
    
    # 2. 定义插件
    # 语法高亮 (输对变绿，输错变红)
    zplug "zsh-users/zsh-syntax-highlighting", defer:2
    # 自动建议 (记录历史命令，按右键补全)
    zplug "zsh-users/zsh-autosuggestions", defer:2
    
    # 3. 加载主题 (Powerlevel10k)
    # depth:1 表示只克隆最近一次提交，下载飞快
    zplug "romkatv/powerlevel10k", as:theme, depth:1
    
    # 4. 自动安装插件 (检测未安装则询问)
    if ! zplug check --verbose; then
        printf "Install? [y/N]: "
        read -q && zplug install
    fi
    
    # 5. 加载插件
    zplug load
    
    # 6. 加载 P10k 的个性化配置 (由向导生成)
     ! -f ~/.p10k.zsh  || source ~/.p10k.zsh
    ```
    
3. **保存退出** (`:wq`)。

### 第四步：激活与配置 (见证奇迹) ✨

1. **重启 Zsh**：
    
    Bash
    
    ```
    exec zsh
    ```
    
2. **自动安装**：Zplug 会检测并询问是否安装插件，输入 `y` 确认。
    
3. 进入 P10k 配置向导：
    
    插件安装完毕后，P10k 会自动启动配置界面。
    
    - **检查图标**：看到钻石/锁头图标选 `Yes`。
        
    - **风格推荐**：`Rainbow` (彩虹风格) 或 `Lean` (极简风格)。
        
    - **Prompt Height**：`Two lines` (两行模式，路径和命令分行，更清晰)。
        
    - **Transient Prompt**：推荐 `Yes` (让滚屏历史更干净)。

### 💡 常见问题修正

**如果图标显示为方块/乱码：**

1. 右键 Konsole -> `Edit Current Profile` -> `Appearance` -> `Font`。
    
2. 手动选择 **MesloLGS NF**。
    
3. 点击 `OK`。
    

测试效果：

尝试输入 ls 或进入一个 git 仓库 (git status)，体验语法高亮和即时 Git 状态提示。

Linux and Windows 上的 AirDrop

* * *

### **第一步：确认 Zplug 已安装**

先确保你真的装了它（防止刚才漏了）：

```
yay -S zplug
```

### **第二步：修改 .zshrc 路径**

我们需要把配置文件里的引用路径改成 Arch 专属的路径。

1.  打开配置文件：
    ```
    vim ~/.zshrc
    ```
2.  **找到引用 Zplug 的那一行**。它通常长这样：
    ```
    source ~/.zplug/init.zsh  <-- 这是错的 (通用路径)
    ```
3.  **把它改成 Arch 的路径**：
    ```
    source /usr/share/zplug/init.zsh
    ```
4.  保存退出 (`Esc` -\> `:wq` -\> 回车)。

* * *

### **第三步：重新加载**

在终端输入：

```
exec zsh
```

这次应该就能看到 Zplug 开始自动安装插件了（Install? \[y/N\]）。

既然 `pacman`/`yay` 安装的路径找不到，或者安装过程出了问题，我们直接用最原始、也是最通用的**Git 手动安装法**。

这样做还有一个好处：**路径统一**。你在 Mac 或其他 Linux 上通常也是装在用户目录下，这样你的配置文件拿过去就能直接用，不用改路径。

请执行以下两步，马上解决：

### **第一步：手动克隆到家目录**

在终端输入：

```
git clone https://github.com/zplug/zplug ~/.zplug
```

### **第二步：修改配置文件**

因为我们把它装到了 `~/.zplug`，现在的路径就和你复制过来的配置（通常情况）一致了。

1.  打开配置文件：
    ```
    vim ~/.zshrc
    ```
2.  **修改引用路径**： 找到 `source ...` 那一行，改成：
    ```
    source ~/.zplug/init.zsh
    ```
    _(如果你刚才贴的是 `/usr/share/...`，改回 `~/.zplug/...`)_
3.  保存退出 (`:wq`)。

* * *

### **第三步：再次激活**

```
exec zsh
```

这次应该稳了。它会去你家目录下的 `.zplug` 文件夹加载，并且开始安装插件。

## 16. 安装常用软件与 Arch 软件包原则 (Steam & 微信避坑指南) 🎮

在开始疯狂安装之前，我们需要先纠正一个从 Windows/Ubuntu 转过来的习惯，这能救你的命。

### 🛑 核心原则：为什么不能直接下载官网的 .deb/.rpm？

**千万别去微信/WPS官网下载安装包，也不能直接装。** 这是 Arch 新手最容易炸系统的坑。

1. **格式不通**：
    
    - `.deb` 是给 Debian/Ubuntu 用的。
        
    - `.rpm` 是给 RedHat/Fedora 用的。
        
    - Arch 使用 `pacman` 包管理器，**原生不支持**这两种格式。
        
2. **依赖地狱**：
    
    - 如果你强行用工具转换安装，99% 会因为缺少特定的系统库而打不开，或者导致系统其他软件冲突。
        

#### AUR 到底在干什么？

你可能会问：“那 `yay` 是怎么装微信的？”。原理很简单：

1. yay 帮你去官方源把那个 .deb 下载下来。
    
    2. 自动解压、修改文件结构以适应 Arch。
    
    3. 自动补齐所有缺少的依赖库。
    
    4. 打包成 Arch 能认的格式并安装。
    

**结论：在 Arch 上，永远优先用 `yay` 找 AUR，不要去浏览器里下安装包。**

### 第一步：开启 Multilib (Steam 必做)

Steam 是 32 位软件，Arch 默认只开 64 位仓库。不打开这个，Steam 连装都装不上。

1. **编辑配置**：
    
    Bash
    
    ```
    sudo vim /etc/pacman.conf
    ```
    
2. **修改**：向下翻，找到 `[multilib]`，**去掉两行前面的 `#` 号**：
    
    Ini, TOML
    
    ```
    [multilib]
    Include = /etc/pacman.d/mirrorlist
    ```
    
3. **同步数据库** (修改完必须立刻执行)：
    
    Bash
    
    ```
    sudo pacman -Syu
    ```

### 第二步：正确安装 Steam (修复闪退版)

针对你的 **Intel Ultra 5** (集显)，如果只装 `steam` 本体，图标跳两下就会消失（因为缺 32 位显卡驱动）。

**请执行这条“完全体”命令：**

Bash

```
sudo pacman -S steam lib32-mesa lib32-vulkan-intel
```

- **`steam`**: 游戏平台本体。
    
- **`lib32-vulkan-intel`**: **防闪退的关键**。这是 Intel 核显运行 Steam 游戏必须的 32 位 Vulkan 驱动。

### 第三步：安装 Docker (DevOps 吃饭家伙)

1. **安装**：
    
    Bash
    
    ```
    sudo pacman -S docker docker-compose
    ```
    
2. **配置权限** (避免每次都输 sudo)：
    
    Bash
    
    ```
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
    ```
    
    _(注：执行完后需**注销并重新登录**才会生效)_

### 第四步：安装 AUR 必备 (微信/Spotify)

根据前面的原则，我们使用 `yay` 来安装经过社区优化的版本。

Bash

```
yay -S wechat-universal-bwe spotify typora-free
```

- **`wechat-universal-bwe`** (强推)：
    
    - 基于统信 UOS 适配版，功能最全（支持朋友圈、小程序），自带沙箱（防封号），稳定性最高。
        
    - _备选方案_：如果这个版本下载实在太慢或失败，可以尝试 `yay -S wechat-beta` (官方原生 Linux 4.0 测试版，较轻量但功能稍弱)。
        
- **`typora-free`**: Markdown 写作神器（免费旧版）。
    

🛠️ 微信高分屏太小怎么办？

Intel Ultra 笔记本通常屏幕分辨率较高。

- **解决**：打开微信 -> 左下角设置 -> 通用 -> **缩放比例** (拉到 150% 或 200%)。

### ✅ 清单核对

现在你的系统已经装备齐全：

1. **Steam**: 能正常启动，不再闪退。
    
2. **WeChat**: 能打字，能看朋友圈，界面大小合适。
    
3. **Docker**: 随时可以部署容器。
    
4. **Dev Environment**: Zsh + Yay + Git 蓄势待发。

## 17. 核心知识：软件去哪找？(Pacman vs AUR) 📦

在 Arch Linux 上装软件，不像 Windows 那样到处找 `.exe`，也不像 Ubuntu 那样经常要加 PPA。我们只有两个“大仓库”：**官方仓库** 和 **AUR**。

### 1. 第一梯队：官方仓库 (Official Repos)

**“正规军” / “超市货架”**

这是 Arch 的核心基石，90% 的常用软件都在这里。

- **特点**：
    
    - **全是二进制包 (Binaries)**：官方已经编译好了，下载解压即用，速度极快，稳定性最高。
        
    - **安全性高**：由 Arch 官方开发者维护和签名。
        
- **安装工具**：`pacman`
    
- **包含内容**：
    
    - **系统底座**：内核 (`linux`)、驱动 (`nvidia`, `mesa`)、桌面环境 (`plasma`, `gnome`)。
        
    - **开发工具**：`python`, `docker`, `git`, `vim`, `gcc`。
        
    - **通用软件**：`firefox`, `vlc`, `obs-studio`, `telegram`。
        
    - **游戏**：`steam` (位于 multilib 仓库)。
        

> **结论**：哪怕你这辈子都不碰 AUR，光靠官方仓库也能完成绝大部分开发和娱乐工作。

### 2. 第二梯队：AUR (Arch User Repository)

**“社区黑市” / “定制工坊”**

这就是你用 `yay` 访问的地方。它是**社区用户维护**的脚本库 (PKGBUILD)。

- **为什么要用它？**
    
    1. **版权/协议限制**：Arch 官方不能直接分发商业软件的二进制文件（如 **WeChat, Google Chrome, Spotify, Zoom**）。AUR 提供的脚本会帮你去官网下载安装包，然后自动打包成 Arch 格式。
        
    2. **太新或太小众**：GitHub 上刚出的开源小工具，或者特定的 Mac 主题、旧版软件。
        
- **都要编译很久吗？**
    
    - **不一定**。
        
    - **Repackaging (快)**：像 `google-chrome` 或 `wechat`，脚本只是把官方的 `.deb` 拆包再重组，几秒钟就好。
        
    - **Compiling (慢)**：带 `-git` 后缀的包（如 `wlroots-git`），会拉取源代码**从头编译**，这才是会让 CPU 满载且耗时的操作。

### 🧠 总结：Arch 用户的安装逻辑

当你想要装一个软件时，脑子里应该自动运行这个流程：

**第一步：先查官方仓库 (首选)**

- 想装 Python？ -> `sudo pacman -S python` (✅ 秒装)
    
- 想装 Docker？ -> `sudo pacman -S docker` (✅ 秒装)
    
- 想装 Firefox？ -> `sudo pacman -S firefox` (✅ 秒装)
    

**第二步：官方没有？再找 AUR (备选)**

- 想装 微信？(官方没收录) -> `yay -S wechat-universal-bwe`
    
- 想装 Chrome？(官方只有开源的 Chromium) -> `yay -S google-chrome`
    
- 想装 VSCode 闭源版？ -> `yay -S visual-studio-code-bin`
    

**记住这个优先级，你的系统会既稳定又强大。**

## 18. 终极输入法配置：Fcitx5 + 雾凇拼音 + 磨砂皮肤 🧊

在 Arch Linux + KDE 下，Fcitx5 是公认的“真神”，原生支持 Wayland，响应极快。我们将配合开源界最强的“雾凇拼音”词库，打造超越搜狗的输入体验。

### 第一步：安装核心组件 (官方仓库)

直接使用 Pacman 安装基础框架和兼容模块。

Bash

```
sudo pacman -S fcitx5-im fcitx5-chinese-addons fcitx5-pinyin-zhwiki
```

- **`fcitx5-im`**: 基础包组。
    
- **`fcitx5-chinese-addons`**: 自带的拼音引擎。
    
- **`fcitx5-pinyin-zhwiki`**: 维基百科词库 (支持最新专有名词)。

### 第二步：配置环境变量 (⚠️ 必做)

如果不配置，VSCode、微信或终端里无法调出输入法。

1. **编辑文件**：
    
    Bash
    
    ```
    sudo vim /etc/environment
    ```
    
2. **追加内容** (确保包含以下几行)：
    
    Ini, TOML
    
    ```
    GTK_IM_MODULE=fcitx
    QT_IM_MODULE=fcitx
    XMODIFIERS=@im=fcitx
    SDL_IM_MODULE=fcitx
    GLFW_IM_MODULE=ibus
    ```
    
3. **保存** (`:wq`) 并**注销重新登录**。

### 第三步：让 KDE 托管输入法

1. **系统设置** -> **Keyboard** (键盘) -> **Virtual Keyboard** (虚拟键盘)。
    
2. 选中 **Fcitx 5** 并点击 Apply。
    

_(注销回来后，右下角托盘应出现键盘图标)_

### 第四步：安装并激活“雾凇拼音” (Rime-Ice)

Fcitx5 自带拼音够用，但雾凇拼音体验更好。

**1. 安装 Rime 引擎和词库：**

Bash

```
yay -S fcitx5-rime rime-ice
```

2. 激活雾凇方案 (关键步骤)：

Rime 默认使用旧版“明月拼音”，需手动修改配置强制启用雾凇。

- **创建/编辑配置**：
    
    Bash
    
    ```
    mkdir -p ~/.local/share/fcitx5/rime/
    vim ~/.local/share/fcitx5/rime/default.custom.yaml
    ```
    
- **写入以下内容**：
    
    YAML
    
    ```
    patch:
      "schema_list/+":
        - schema: rime_ice  # 强制启用雾凇拼音
      "menu/page_size": 9   # 候选项显示9个
    ```
    

**3. 部署生效：**

- 右键托盘图标 -> **Restart** (重启 Fcitx5)。
    
- 在输入框按 `Ctrl+Space` 切换到 Rime (中州韵)。
    
- 按 `F4` 或 `Ctrl+~`，菜单中应显示并选中“雾凇拼音”。

### 第五步：换上高颜值磨砂皮肤 (FluentDark)

默认皮肤太土，我们换一个带**模糊特效 (Blur)** 和**阴影**的现代皮肤。

**1. 安装皮肤：**

Bash

```
yay -S fcitx5-skin-fluentdark-git
```

_(备选：如果想要纯粹的 Mac 风格，也可以装 `fcitx5-theme-whitesur-git`)_

**2. 应用皮肤：**

- 右键托盘图标 -> **Configure** (配置)。
    
- **Addons** (附加组件) -> **Classic User Interface** (经典用户界面) -> 点击右侧 **Configure**。
    
- **Theme** (主题) 选择：`FluentDark-git`。
    
- **建议勾选**：`Use input method language to display text` (字体渲染更漂亮)。

✅ 最终效果检查：

找个输入框按 Ctrl+Space，你应该能看到一个半透明、带模糊背景的精美悬浮窗，打字流畅，选词精准。

## 19. 硬件驱动补全：修复蓝牙与声音 (Intel Ultra 专用) 🔊

在 Arch Linux 上，刚装完系统没声音、没蓝牙是常态。因为 Arch 默认不预装非必要的固件和服务。你的 Intel Ultra 5 属于新架构，必须手动补全 **Firmware (固件)** 才能让硬件工作。

### Part 1: 修复蓝牙 (Bluetooth) 🦷

蓝牙只需要安装协议栈并启动后台服务即可。

**1. 安装蓝牙工具：**

Bash

```
sudo pacman -S bluez bluez-utils
```

**2. 启动服务并设为开机自启：**

Bash

```
sudo systemctl enable --now bluetooth
```

**3. 启用验证：**

- 现在去右下角托盘点击蓝牙图标，勾选 **Enable** (启用)，应该可以搜到设备了。
    
- 如果搜不到，输入 `rfkill list` 检查是否被硬件开关关闭。

### Part 2: 修复声音 (PipeWire + SOF 固件) 🎵

我们使用现代化的 **PipeWire** 音频架构（KDE 6 标配）。对于 Intel Ultra (Meteor Lake) 处理器，**`sof-firmware` 是必须安装的**，否则声卡无法被识别。

1. 安装全家桶 (含 Intel 固件)：

请复制整行命令：

Bash

```
sudo pacman -S pipewire pipewire-pulse pipewire-alsa wireplumber sof-firmware alsa-utils alsa-ucm-conf
```

- **`pipewire-pulse`**: 替代旧的 PulseAudio，兼容性极佳。
    
- **`sof-firmware`**: **关键！** Sound Open Firmware，没有它 Intel Ultra 的声卡就是摆设。
    
- **`wireplumber`**: 音频会话管理器。
    

> **注意**：安装过程中如果提示与 `pulseaudio` 冲突，**请输入 `y` (确认移除)**。

2. 激活音频服务：

无需 sudo，作为普通用户运行：

Bash

```
systemctl --user enable --now pipewire pipewire-pulse wireplumber
```

3. 解除硬件静音 (Alsamixer)：

有时底层驱动默认是静音状态。

- 输入 `alsamixer` 进入图形界面。
    
- 如果看到柱状图底部显示 **`MM`** (Mute)，按 **`M`** 键将其切换为 **`00`** (开启)。
    
- 按 `Esc` 退出。

### Part 3: 知识点纠正与重启

❓ 误区：我需要去官网下载声卡驱动吗？

不需要。 Linux 的声卡驱动包含在内核 (Kernel) 里。你缺的不是驱动，是固件 (Firmware)。刚才装的 sof-firmware 就是把“说明书”补给内核，告诉它怎么控制你的声卡。

✅ 最终操作：

虽然服务已启动，但加载固件通常需要重启电脑才能生效。

**重启后自测：**

1. **声音**：右下角喇叭图标应无红叉，拖动滑块有声音。
    
2. **设备**：点击喇叭旁边的设置图标，确认 **Output Device** 选中的是 `Speaker` (扬声器)。
    

🚑 还是没声音？

如果重启后依然无法识别声卡，请在终端输入以下命令查看底层硬件状态，根据输出结果排查：

Bash

```
aplay -l
```

_(如果列表为空，说明内核完全没认出声卡，可能需要检查 BIOS 设置或内核版本)_

## 20. 补全 Mac 体验拼图：日常必备工具与效率神器 🧩

作为 CS 研究生的主力机 (Daily Driver)，仅仅只有好看的皮囊是不够的。我们需要安装以下组件，填补系统在**数据安全**、**交互效率**和**办公**方面的空缺。

### 1. 你的“时光机器”：Timeshift (保命神器) ⏳

Arch 作为一个滚动更新发行版，偶尔的“滚挂”在所难免。**Timeshift 是必须要装的**，它能在系统挂掉时一键回滚。

- **安装**：
    
    Bash
    
    ```
    sudo pacman -S timeshift
    ```
    
- **关键配置**：
    
    - **Type**：选择 **RSYNC** (除非你专门配置了 BTRFS 文件系统)。
        
    - **Schedule**：设置为 **Daily** (每天)，保留最近 5 份快照。
        
    - **Action**：**现在立刻点击 Create 做一次快照**，以此为基准点。

### 2. 你的“Spotlight (聚焦搜索)”：KRunner vs Albert 🔍

Mac 用户离不开 `Cmd + Space`。KDE 自带的 KRunner 功能很强，但默认界面偏窄，如果你觉得它“太小气”，我们有更好的替代方案。

#### 方案 A：原生党 (KRunner)

如果你不想装第三方软件，可以调整 KRunner 位置。

- **位置**：`System Settings` -> `Search` -> `KRunner` -> **Center** (屏幕中央)。
    
- **大小**：受限于全局主题。去 `Plasma Style` 里应用 **WhiteSur** 主题会让它稍微宽一点。
    

#### 方案 B：Pro 也就是 CS 学生首选 (Albert) 🚀

如果你想要 Mac 上 **Alfred / Raycast** 那种“宽大、霸屏、可定制”的搜索框，**Albert** 是最佳选择 (C++/Qt 编写，速度极快)。

- **安装**：
    
    Bash
    
    ```
    yay -S albert
    ```
    
- **配置优势**：
    
    - **快捷键**：在设置里改为 `Meta+Space` (屏蔽 KRunner 的快捷键)。
        
    - **巨型窗口**：在 Theme 设置里，你可以手动拉大 **Window Width** (窗口宽度) 和字体大小，完美复刻 Spotlight 的视觉冲击力。
        
    - **插件**：记得开启 `Files` (文件)、`Terminal` (终端命令)、`Calculator` (计算器)。

### 3. 你的“触控板手势”：Touchpad Gestures 🖐️

没有丝滑的三指/四指手势就不叫 Mac 体验。

- **Wayland 用户 (KDE 6 默认)**：
    
    - **状态**：开箱即用。
        
    - **操作**：
        
        - **三指/四指左右滑**：切换虚拟桌面。
            
        - **四指上推**：呼出“调度中心” (Overview)。
            
    - **优化**：去 `System Settings` -> `Touchpad` 开启 **Natural Scrolling** (自然滚动) 并调快指针速度。
        
- **X11 用户**：需额外安装 `touchegg` (不推荐，建议坚持用 Wayland)。

### 4. 你的“Office 办公套件”：OnlyOffice 📝

LibreOffice 界面太复古。要在 Linux 上获得最接近 MS Office 的体验且兼容性最好（不乱码），OnlyOffice 是首选。

- **安装** (推荐二进制版，免编译)：
    
    Bash
    
    ```
    yay -S onlyoffice-bin
    ```
    
- **特点**：极佳的 `.docx/.pptx` 兼容性，Tab 风格界面，与 macOS 风格违和感低。

### 5. 你的“IINA 播放器”：Haruna 🎬

Linux 上最像 IINA 的播放器（基于 mpv 内核，极简界面，支持高分屏）。

- **安装**：
    
    Bash
    
    ```
    sudo pacman -S haruna
    ```
    
- **设置**：在文件关联里把它设为默认视频播放器。

### 💡 终极建议：关于键位映射 (Cmd vs Ctrl)

这是 Mac 转 Linux 最大的痛点：Mac 复制是 `Cmd+C` (大拇指)，Linux 是 `Ctrl+C` (小指)。

**⚠️ CS 学生建议：不要全局改键！**

- **理由**：在 Linux 终端里，**`Ctrl+C` 是强制中断信号 (SIGINT)**。如果你把 Win 键强行映射成 Ctrl，会导致你在终端想复制文本时，意外杀掉正在运行的程序，逻辑会非常混乱。
    
- **妥协方案**：
    
    1. **Konsole**：在设置里把“复制/粘贴”单独改成 `Ctrl+C / Ctrl+V`。
        
    2. **适应**：这是两个不同的操作系统，建议训练自己适应“小指 Ctrl”的习惯，或者只在 VSCode 等编辑器内部改键。
        

* * *
## 21. 效率神器：现代化终端工具链 & 截图配置 ⚡

作为 USC 的 CS 研究生，你的系统不能只是“长得像 Mac”，**用起来**也要有顶级开发者的效率。我们用 Rust 重写的现代工具替换 Linux 的老旧命令。

### Part 1: 安装现代命令行工具 (Rust 全家桶) 🦀

一次性安装所有替代品：

Bash

```
sudo pacman -S eza bat ripgrep fd zoxide fzf
```

- **`eza`** (ls 替代品): 支持图标、Git 状态显示。
    
- **`bat`** (cat 替代品): 带语法高亮、行号、Git 变动显示。
    
- **`ripgrep`** (rg): 极速文本搜索工具，VSCode 都在用。
    
- **`zoxide`** (cd 替代品): 智能路径跳转 (`z src` 直达目录)。
    
- **`fzf`**: 命令行模糊搜索神器。

### Part 2: 配置 `.zshrc` (让工具生效) 🛠️

安装完如果不配置别名，这些工具是不会自动生效的。

1. **编辑配置文件**：
    
    Bash
    
    ```
    vim ~/.zshrc
    ```
    
2. **跳到底部**：按 `G` (大写)，然后按 `o` (小写) 插入新行。
    
3. **粘贴配置代码**：
    
    Bash
    
    ```
    # ==============================================
    # Modern Tools Config (Arch Efficiency Pack)
    # ==============================================
    
    # --- 1. eza (ls 替代品) ---
    alias ls='eza --icons --group-directories-first'
    alias ll='eza --icons -l --git --group-directories-first'
    alias la='eza --icons -la --git --group-directories-first'
    alias tree='eza --icons --tree --level=2'
    
    # --- 2. bat (cat 替代品) ---
    alias cat='bat'
    alias catt='/usr/bin/cat' # 偶尔需要纯文本时用
    
    # --- 3. zoxide (cd 智能跳转) ---
    eval "$(zoxide init zsh)"
    alias cd='z'
    
    # --- 4. fzf (模糊搜索) ---
    [ -f /usr/share/fzf/key-bindings.zsh ] && source /usr/share/fzf/key-bindings.zsh
    [ -f /usr/share/fzf/completion.zsh ] && source /usr/share/fzf/completion.zsh
    
    # --- 5. Ripgrep (搜索优化) ---
    export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git/*"'
    ```
    
4. **生效**：保存退出 (`:wq`) 并运行 `source ~/.zshrc`。
    

**🚀 能力解锁：**

- 打 `ll`：显示带图标和 Git 状态的文件列表。
    
- 打 `cat 文件名`：代码高亮显示。
    
- 按 `Ctrl + R`：呼出超丝滑的历史命令搜索框。

### Part 3: 截图神器 Flameshot (替换 Spectacle) 📸

KDE 自带截图一般，Flameshot 才是王者（支持标注、马赛克、钉图）。

**1. 安装**：

Bash

```
sudo pacman -S flameshot
```

**2. 绑定快捷键 (必做，否则按 PrintScreen 没反应)**：

- **解绑旧的**：去 `System Settings` -> `Shortcuts`，搜索 `Spectacle`，把绑定 `Print` 键的项目设为 None。
    
- **绑定新的**：
    
    - 点击 `Add New` -> `Command`。
        
    - **Command**: 输入 `flameshot gui` (⚠️ 必须加 gui)。
        
    - **Shortcut**: 按下 `PrintScreen` (或者习惯 Mac 的话按 `Meta+Shift+4`)。

### Part 4: 清理战场 (系统大扫除) 🧹

安装这么多软件后，清理一下无用的依赖和缓存。

Bash

```
# 1. 删除孤儿包 (作为依赖安装但现在没人用的包)
sudo pacman -Rns $(pacman -Qdtq)

# 2. 清理 pacman 缓存 (需安装 pacman-contrib)
sudo pacman -S pacman-contrib
sudo paccache -r # 只保留最近 2 个版本
```

## 22. 效率与颜值：从终端到笔记的“Geek 化”武装 ⚡

### Part 1: 命令行“特种部队” (Rust 全家桶) 🦀

抛弃 `ls`, `cat`, `top` 吧，现代 Geek 都用这些：

- **`eza`** (ls 替代品): 支持图标、Git 状态显示。
    
- **`bat`** (cat 替代品): 带语法高亮、行号。
    
- **`ripgrep`** (rg): 极速文本搜索，VSCode 都在用。
    
- **`zoxide`** (cd 替代品): 智能跳转 (`z src` 直达目录)。
    
- **`tealdeer`** (tldr): 简化版 man 手册，只看常用例子（再也不怕记不住 `tar` 参数）。
    
- **`btop`** (top 替代品): 赛博朋克风的资源监控，支持鼠标操作，看着 CPU 核心跳动是理工男的浪漫。
    
- **`fastfetch`** (neofetch 替代品): 每次打开终端打印帅气的 Arch Logo 和硬件参数（Arch 用户的“社交礼仪”）。
    
- **`zellij`** (tmux 替代品): 开箱即用的终端复用神器，一边跑 Server 一边看 Log。
    

**一键安装命令：**

Bash

```
sudo pacman -S eza bat ripgrep fd zoxide fzf tealdeer btop fastfetch zellij
```

**初始化 tldr 数据库：**

Bash

```
tldr --update
```

### Part 2: 注入灵魂 (.zshrc 配置) 🛠️

工具装了不会自动生效，必须配置别名和自启动。

1. **编辑配置**：`vim ~/.zshrc`
    
2. **跳到底部** (`G` -> `o`)，**粘贴以下终极配置**：
    

Bash

```
# ==============================================
# Geek Efficiency Pack (CS Student Edition)
# ==============================================

# --- 1. eza (ls Pro Max) ---
alias ls='eza --icons --group-directories-first'
alias ll='eza --icons -l --git --group-directories-first'
alias la='eza --icons -la --git --group-directories-first'
alias tree='eza --icons --tree --level=2'

# --- 2. bat (cat Pro) ---
alias cat='bat'

# --- 3. zoxide (智能跳转) ---
eval "$(zoxide init zsh)"
alias cd='z'

# --- 4. fzf & ripgrep (搜索神器) ---
[ -f /usr/share/fzf/key-bindings.zsh ] && source /usr/share/fzf/key-bindings.zsh
[ -f /usr/share/fzf/completion.zsh ] && source /usr/share/fzf/completion.zsh
export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git/*"'

# --- 5. 启动问候 (Arch 身份证) ---
# 每次打开终端显示系统信息，不仅帅，还能确认环境
fastfetch
```

3. **生效**：`:wq` 保存退出，然后 `source ~/.zshrc`。

### Part 3: 桌面端的“降维打击”工具 🖥️

#### 1. 像黑客一样上网：Vimium C (浏览器插件)

你终端和 IDE 都是 Vim 模式，浏览器为什么要用鼠标？

- **安装**：去 Chrome/Edge 商店搜索 **Vimium C**。
    
- **神技**：
    
    - 按 `f`：所有链接出现快捷字母，按键直达。
        
    - 按 `j/k`：上下丝滑滚动。
        
    - 按 `x`：关闭标签。
        
    - **效果**：写代码查资料时，双手无需离开键盘主键区。
        

#### 2. 最强截图：Flameshot (火焰截图)

- **安装**：`sudo pacman -S flameshot`
    
- **绑定**：去系统设置快捷键，把 `PrintScreen` 绑给 `flameshot gui`。
    
- **优势**：支持画箭头、打马赛克、序号标记、钉在屏幕上（对比代码神器）。
    

#### 3. 第二大脑：Obsidian + Git

数据在他处是流浪，在本地才是家。

- **安装**：`sudo pacman -S obsidian`
    
- **Geek 用法**：配合 `Obsidian Git` 插件，将笔记 push 到 GitHub 私有库。这是真正的**纯文本、本地化、版本控制**知识管理。

### Part 4: 最后的“强迫症”大扫除 🧹

安装完这一大堆东西，清理一下战场，保持系统纯净。

Bash

```
# 1. 删除孤儿包
sudo pacman -Rns $(pacman -Qdtq)

# 2. 清理缓存 (保留最近2个版本)
sudo pacman -S pacman-contrib
sudo paccache -r
```

## 23. 进阶生存指南：正确的“找软件”姿势 (AUR 官网) 🕵️

你可能会好奇：yay 到底去哪里下载的软件？

yay 本质上是一个“接口”，它连接了 Arch 的两大数据库：官方仓库 和 AUR。

熟练使用以下两个网站，能帮你避开 90% 的坑。

### 1. AUR 官网 (社区最活跃的“集市”)

👉 **网址：[aur.archlinux.org](https://aur.archlinux.org/)**

这是你刚才装的 `wechat-universal-bwrap`、`fcitx5-skin-fluentdark-git` 的老家。它不仅仅是一个下载站，更是**排错中心**。

**Web 端的三大关键用途 (比命令行更强)：**

- **看置顶评论 (Pinned Comments) 🌟**：**最重要！** 如果软件装不上或报错，先去该页面看置顶评论。维护者通常会把最新的编译错误解决方案写在那里。
    
- **按热度排序 (Votes)**：搜关键词（如 "music"）并按 Votes 排序。高票通常意味着稳定、好用，帮你避开冷门的垃圾包。
    
- **检查存活 (Last Updated)**：如果一个包最后更新时间是 2018 年，直接放弃，不要浪费时间尝试。
    

### 2. Arch 官方包查询

👉 **网址：[archlinux.org/packages](https://archlinux.org/packages/)**

这是 `pacman` 的地盘（内核、Docker、Python 等核心组件）。这里主要用来查询官方包的具体文件列表或最新版本号。

### 💡 CS 研究生的“逛街”流程

不要盲目在终端乱试，建议养成标准化的**选型流程**：

Step 1: 橱窗购物 (Web)

打开 AUR 官网，输入关键词（例如 visual studio code）。

Step 2: 维度分析 (Check)

你会发现搜出来几十个结果。这时候要看：

- **Votes**: 票数最高的通常是最佳选择。
    
- **Suffix**: 比如 VSCode，你会发现有 `visual-studio-code-bin` (官方二进制，快) 和 `visual-studio-code-git` (源码编译，慢)。通常选 `-bin`。
    
- **Maintainer**: 确认有人维护，不是 Orphaned (孤儿包)。
    

Step 3: 终端下单 (Terminal)

确认好包名（比如 visual-studio-code-bin）后，再回到 Konsole 执行：

Bash

```
yay -S visual-studio-code-bin
```

至此，你的 Arch Linux 知识体系已经闭环。

你不仅拥有了一个配置完美的系统，还掌握了从底层维护到上层软件选型的全部逻辑。

**Good luck, EthanLee! 愿你的代码编译永不报错。** 🚀

## 24. ASUS 笔记本专用优化 (Lunar Lake 版) 💻

针对你的 **ASUS Vivobook S 14 (S5406SA)**，由于搭载了 Bleeding Edge 的 **Intel Lunar Lake** 平台，我们需要一套特定的“续命全家桶”来接管硬件控制。

### Part 1: 安装 ASUS 续命全家桶 🛠️

Arch 社区的神级项目 **Asus-Linux** 是必须安装的，否则无法控制风扇策略和电池阈值。

**1. 安装核心组件：**

Bash

```
yay -S asusctl rog-control-center
```

- **`asusctl`**: 核心守护进程，负责底层硬件交互。
    
- **`rog-control-center`**: 图形化控制面板（类似 Windows 奥创中心）。
    
- _(注：你是 Intel 核显，不需要安装 `supergfxctl`，省去了折腾显卡切换的麻烦)_
    

2. 启动服务 (关键修正)：

新版 asusd 通常是 static 类型的服务，不需要 enable，直接启动即可（它会由 Udev 规则或 Socket 自动激活）。

Bash

```
sudo systemctl start asusd
```

**验证状态：**

Bash

```
systemctl status asusd
```

- 如果显示 **`active (running)`** 且正确识别出 `Vivobook S 14`，说明服务已就绪。

### Part 2: 硬件控制指南 (新版 asusctl 用法) 🎮

新版 `asusctl` 采用了类似 git 的子命令结构。

#### 1. 性能模式 (Profile)

- **查看当前模式**：
    
    Bash
    
    ```
    asusctl profile -p
    ```
    
- **切换模式**：
    
    - 推荐使用快捷键 **`Fn + F`**，屏幕上应出现 OSD 提示。
        
    - 命令行切换：`asusctl profile -P Performance` (或 Balanced/Quiet)。
        

#### 2. 电池保养 (Battery Health) 🔋

防止长期插电导致电池鼓包。

- **查看阈值**：
    
    Bash
    
    ```
    asusctl charge-control -q
    ```
    
- **限制充电至 80%**：
    
    Bash
    
    ```
    asusctl charge-control -l 80
    ```
    
    _(也可在 ROG Control Center 图形界面中拖动滑块设置)_
    

#### 3. 键盘背光

你的 Vivobook 配备的是标准背光（非 RGB 矩阵）。

- **控制方式**：直接使用键盘上的 **`F7`** (或对应亮度图标) 调节，无需使用命令行。

### Part 3: 硬件状态确认 (Lunar Lake 特性) 🚀

根据 `lspci` 确认，你的机器配置极高，属于 **Linux 6.12+ 内核** 的重点优化对象。

1. **NPU (AI 加速器)**：
    
    - 搭载 **Intel NPU 4.0** (48 TOPS 算力)。
        
    - 未来可安装 `intel-npu-driver` 跑本地大模型。
        
2. **显卡 (Xe2 Battlemage)**：
    
    - **Intel Arc 140V** 是目前最强核显之一，无需折腾闭源驱动，Wayland 兼容性满分。
        
3. **电量监控**：
    
    - **图形界面**：KDE 右下角托盘图标。
        
    - **极客方式**：在终端输入 `btop`，右下角 Battery 区域会显示**实时充放电功率 (Watts)**。

## 25. 终极解锁：在 Lunar Lake 上实现红外人脸识别 (Howdy) 👁️

你已经拥有了 Mac 的外观和 Linux 的内核，现在我们补全最后一块拼图：红外人脸解锁。

由于 AUR 稳定版脚本过时且 Lunar Lake 平台太新，我们需要特殊的“Beta Git 版 + 预编译依赖”方案。

### Part 1: 正确的安装姿势 (避坑指南) 🛑

不要直接装 `howdy`，也不要装 `howdy-beta-git`（分支已死）。请严格按此顺序操作：

1. 先装最难搞的依赖 (python-dlib-git)

Dlib 编译极其耗时且易报错，我们优先处理它。

Bash

```
yay -S python-dlib-git
```

- **注意**：CleanBuild 选 `A`。编译可能需要 5-10 分钟，风扇狂转是正常的，**不要中断**。
    

**2. 再装主程序 (howdy-git)**

Bash

```
yay -S howdy-git
```

- **注意**：如果提示依赖，选择刚才装好的 `python-dlib-git`。

### Part 2: 硬件识别与配置 📷

Lunar Lake 有多个摄像头节点，我们需要找到红外 (IR) 的那一个。

**1. 寻找红外摄像头**：

Bash

```
v4l2-ctl --list-devices
```

- **经验法则**：通常是 `/dev/video2` (排在彩色摄像头之后)。
    

**2. 修改配置文件**：

Bash

```
sudo EDITOR=vim howdy config
```

- **`device_path`**: 改为 `/dev/video2` (若不确定可先填这个)。
    
- **`dark_threshold`**: 改为 **60** 或 **10** (根据实际测试调整)。如果提示 "Too dark"，就调低；如果识别不准，就调高。
    
- **`ignore_closed_lid`**: 改为 `true` (防止合盖误触)。
    

**3. 关键验证 (howdy test)**：

Bash

```
sudo howdy test
```

- **一定要做！** 观察弹出的窗口：
    
    - **黑白/紫色画面**：✅ 成功！这就是红外摄像头。
        
    - **彩色画面**：❌ 选错了，换 `video0` 或 `video1` 重试。
        
    - **全黑**：❌ 红外灯没亮，需安装 `linux-enable-ir-emitter` 修复。

### Part 3: 录入与应用 🔓

**1. 录入人脸**：

Bash

```
sudo howdy add
```

- 提示 "Scan Complete" 即为成功。建议在不同光线/戴眼镜状态下多录几次。
    

2. 启用全系统解锁 (Sudo + 登录 + 锁屏)：

编辑全局认证文件：

Bash

```
sudo vim /etc/pam.d/system-auth
```

**关键操作**：在文件**最顶部**（所有 `auth` 行之前）插入：

Bash

```
auth sufficient pam_howdy.so
```

### 🎉 最终效果

现在，当你执行 `sudo` 命令、开机登录 SDDM 或解锁屏幕时，摄像头红灯会自动亮起，瞬间解锁，无需手动输入密码。

当你打开 Timeshift 这种需要管理员权限的图形软件时，它会调用一个叫 **Polkit** 的组件来弹窗问密码。

1. KDE 的弹窗（Polkit Agent）非常“死板”，它只期待你输入文本。
    
2. 因为你在 `/etc/pam.d/system-auth` 全局开启了 Howdy，所以弹窗一出来，Howdy 就抢先激活了摄像头。
    
3. Howdy 试图告诉系统“正在扫描人脸...”，但 KDE 的弹窗**听不懂**这个信号，或者把它误判为“用户输入了一个空密码并按了回车”。
    
4. 于是，还没等你反应过来，它就判定“密码/验证错误”，直接关掉了。

### ✅ 解决方案 1：最快进 Timeshift 的方法 (绕过 Bug)

既然图形界面的弹窗有 Bug，那我们就用终端启动它。终端环境完美支持 Howdy。

打开终端，输入：

Bash

```
sudo timeshift-launcher
```

- **现象**：这时候你的红外灯会亮，面部识别成功后，Timeshift 的窗口就会直接弹出来。
    
- _注意：如果报错找不到命令，试着输入 `sudo timeshift-gtk`。_

### ✅ 解决方案 2：彻底修复 (治本)

如果你想保留“刷脸 sudo”和“刷脸登录”，但不想让它干扰 Timeshift 这种图形软件，最好的办法是：**不要在全局 (`system-auth`) 启用 Howdy，而是“按需启用”。**

图形界面的密码框 (Polkit) 对 Howdy 支持很差，我们把它关掉，只保留 Sudo 和 登录。

#### 第一步：撤销全局配置

我们先把你刚才在 `/etc/pam.d/system-auth` 里加的那行删掉。

Bash

```
sudo vim /etc/pam.d/system-auth
```

- **删除** (或注释掉) 你刚才加在最上面的 `auth sufficient pam_howdy.so`。
    
- 保存退出。
    

#### 第二步：只给 Sudo 加 (终端命令刷脸)

这个你之前可能改过，确认一下：

Bash

```
sudo vim /etc/pam.d/sudo
```

- 确保 `auth sufficient pam_howdy.so` 在最上面。
    

#### 第三步：只给 SDDM 加 (开机/锁屏刷脸)

这是 KDE 的登录管理器。

Bash

```
sudo vim /etc/pam.d/sddm
```

- 在最上面加上 `auth sufficient pam_howdy.so`。
    

#### 第四步：(可选) 给锁屏加

如果你用的是 KDE 的锁屏（唤醒时）：

Bash

```
sudo vim /etc/pam.d/kde
```

_(如果没有这个文件，可能是 `kscreenlocker`)_

- 同样加上那行配置。

## 26. 开会全家桶：视频通话与屏幕共享 (Zoom/腾讯会议) 📹

作为留学生，Zoom 是上课刚需，腾讯会议是国内联系刚需。鉴于你使用的是 **KDE Plasma 6 (Wayland)**，我们需要一套特定的工具链来保证开会不翻车。

### Part 1: 照镜子调试神器 (Kamoso) 🪞

开会前需要检查发型、确认摄像头没被遮挡。

- **Kamoso**: KDE 官方相机应用，轻量原生，启动极快。
    
- **⚠️ 避坑指南**：
    
    - 你的 Lunar Lake 有多个摄像头节点。
        
    - 打开 Kamoso 后，在设置里记得选 **`/dev/video0`** (彩色主摄)。
        
    - **不要选** `/dev/video2` (那是刚才配给 Howdy 的黑白红外摄像头)。
        

### Part 2: 必备会议软件 (AUR) 💻

- **Zoom**: USC 上课/组会必备。AUR 里的 `zoom` 是官方二进制包。
    
- **腾讯会议 (Wemeet)**: 推荐 `wemeet-bin`，界面与 Windows 无异，支持虚拟背景。
    
- **Teams (可选)**: 推荐 `teams-for-linux-bin`，比微软官方网页版封装得更好。
    

### Part 3: 解决屏幕共享黑屏 (关键补丁) 🛠️

KDE 6 默认使用 Wayland 协议，Zoom 和腾讯会议在共享屏幕时往往是一片漆黑。

- **解决方案**: 安装 **`xwaylandvideobridge`**。
    
- **原理**: 它在后台静默运行。当你点击“共享屏幕”时，它会欺骗会议软件，把 Wayland 的画面“桥接”过去。
    

### Part 4: 声音控制总台 (Pavucontrol) 🎚️

Linux 开会最怕麦克风选错设备（比如选到了笔记本自带麦，而不是 AirPods）。

- **Pavucontrol**: Linux 老鸟必装的音频总控台。
    
- **用法**: 开会时打开它，可以在 **"Playback"** 标签页单独拉大 Zoom 的音量，在 **"Recording"** 标签页强制把 Zoom 的输入源锁定为你的耳机。

### ✅ 一键安装清单

请直接复制执行，一次性搞定所有需求：

Bash

```
# 1. 官方仓库：相机 + 屏幕共享补丁 + 音频控制
sudo pacman -S kamoso xwaylandvideobridge pavucontrol

# 2. AUR 仓库：Zoom + 腾讯会议 (按需选择 Teams)
yay -S zoom wemeet-bin teams-for-linux-bin
```

**测试流程：**

1. 打开 **Kamoso**，确认能看到彩色的自己 (切换到 `/dev/video0`)。
    
2. 打开 **Zoom**，尝试发起一个会议，点击“共享屏幕”，确认能弹出窗口选择器且画面正常。
    
3. 打开 **Pavucontrol**，熟悉一下如何切换输入/输出设备。

## 27. 安装 Paru

**绝对行，而且是“无缝衔接”的。**

你完全不需要担心“兼容性”问题，因为 **`yay` 和 `paru` 根本不持有你的软件包数据。**

### 为什么可以随意切换？

你可以把 `pacman` 想象成**数据库 (Database)**，而 `yay` 和 `paru` 只是两个不同品牌的**客户端 (Client)**。

1. **单一数据源 (Single Source of Truth)**：
    
    - 你用 `yay` 安装的所有软件（无论是 Chrome 还是 VSCode），最终都记录在 `/var/lib/pacman/local/` 这个系统级数据库里。
        
    - `paru` 启动时，它读的也是这个数据库。
        
    - **结论**：`paru` 一上来就知道你之前用 `yay` 装了什么，也能毫无障碍地更新、卸载它们。
        
2. **不需要“迁移”**：
    
    - 你不需要运行什么 `import` 命令。
        
    - 你在 `yay` 里装的软件，在 `paru` 里直接就能管理。
        

### 现场验证

你可以马上做一个实验来让自己放心：

1. 安装 `paru` (如果你还没装)：
    
    Bash
    
    ```
    yay -S paru
    ```
    
2. 用 `paru` 查看你之前用 `yay` 装的软件（比如 `howdy`）：
    
    Bash
    
    ```
    paru -Qs howdy
    ```
    
    _你会发现它不仅能搜到，而且会显示 `[installed]`，这证明它完全“认识”你的旧资产。_
    
3. 用 `paru` 更新系统（这将同时更新官方包和 `yay` 装的 AUR 包）：
    
    Bash
    
    ```
    paru
    ```
    
    _(相当于 `yay` 或 `pacman -Syu`)_
    

### 唯一的区别：配置文件

只有一样东西是它们**不共享**的：**配置文件**。

- 如果你之前在 `yay` 的配置里设置了“不显示 diff”或者“自定义构建目录”，这些设置**不会**自动同步到 `paru`。
    
- 你需要去 `~/.config/paru/paru.conf` 里重新设一遍（如果你有特殊需求的话）。
    

## 28. 安装 nvim 与配置

这一壶必须给你倒满！🍺

你作为 CS 研究生，如果还在用 VS Code 写简单的 Python 脚本，或者用 nano 改服务器配置，那确实差点意思。**Neovim (nvim)** 是 Vim 的现代重构版，它不仅是个编辑器，更是**“基于键盘的个性化 IDE”**。

### 为什么 Neovim 是“神”？(Why Nvim?)

1. **快，极致的快**：VS Code 是基于 Electron (浏览器内核) 的，内存占用几百 MB 起步。Neovim 是 C 和 Lua 写的，启动只需几十毫秒，内存占用忽略不计。
    
2. **LSP (语言服务协议) 原生支持**：这是它能变成 IDE 的核心。代码补全、跳转定义、重构、错误提示，效果和 VS Code 一模一样（因为大家用的都是同一套 Language Servers），但 Neovim 更加轻量。
    
3. **Lua 插件生态**：现在的 Neovim 插件（如 Telescope, Treesitter）极其强大，界面甚至比 GUI 软件还漂亮。
    
4. **唯快不破 (Vim Motion)**：一旦你的肌肉记忆记住了 `ciw` (修改单词)、`dt"` (删除直到引号)，你的编码速度会跟上你的思维速度。

### 第一步：备料 (安装基础环境)

在 Arch 上，我们要装的不仅是 `neovim` 本体，还有让它变强所需的“佐料”（字体、搜索工具、剪贴板工具）。

打开终端，直接用 `paru` 梭哈：

Bash

```
# 1. neovim: 本体
# 2. ttf-jetbrains-mono-nerd: 必装！否则你的界面会全是乱码方块（图标显示不出来）
# 3. ripgrep (rg): 世界上最快的 grep，Neovim 用它来秒搜代码
# 4. fd: 比 find 快 10 倍的文件查找工具
# 5. wl-clipboard: 让 Neovim 能复制粘贴到系统剪贴板 (因为你是 KDE Wayland 环境)
# 6. lazygit: 可以在 nvim 里直接调用的 git 图形界面（可选，但强烈推荐）

paru -S neovim ttf-jetbrains-mono-nerd ripgrep fd wl-clipboard lazygit
```

_注意：安装完字体后，记得去你的 **Konsole** 或 **iTerm2** (如果用了 Mac) 设置里，把字体改成 **JetBrainsMono Nerd Font**。这一步不做，后面全是乱码。_

### 第二步：上主菜 (配置方案)

Neovim 的默认界面是一片黑，啥也没有。配置它是一门玄学，从零写 init.lua 需要几个月。

对于你，我直接推荐“预制菜”界的天花板 —— LazyVim。

它是一套现成的配置框架，开箱即用，集成了文件树、代码补全、模糊搜索、语法高亮，而且颜值极高。

**1. 备份旧配置 (如果有)**

Bash

```
mv ~/.config/nvim{,.bak}
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
```

**2. 克隆 LazyVim 模板**

Bash

```
git clone https://github.com/LazyVim/starter ~/.config/nvim
```

**3. 移除 git 关联 (这样你可以把配置变成你自己的)**

Bash

```
rm -rf ~/.config/nvim/.git
```

### 第三步：开吃！(首次启动与使用)

在终端输入：

Bash

```
nvim
```

**见证奇迹的时刻**：

1. 你会看到一个蓝色的界面，下方会疯狂滚动代码 —— 这是它在自动通过 `lazy.nvim` 下载几百个插件。
    
2. **不要动**，等它全部跑完，变成 "Everything up to date"。
    
3. **退出**：按 `:qa` 回车，然后重新进入 `nvim`。
    

现在，你拥有了一个满血版的编辑器。

### 第四步：CS 研究生必备操作指南

LazyVim 的键位设计非常符合直觉（大部分基于 `<Space>` 空格键，我们称为 Leader Key）。

#### 1. 怎么写代码？(配置环境)

LazyVim 默认只有基础配置。你需要装 **Python** 或 **C++** 的支持。

- 输入 `:Mason` (回车)。
    
- 这是插件管理器界面。用箭头移动，按 `i` 安装你需要的：
    
    - **LSP (语言服务器)**: `pyright` (Python), `clangd` (C++), `lua_language_server`.
        
    - **Formatter (格式化)**: `black` (Python), `shfmt` (Shell).
        
- 装完后，打开一个 `.py` 文件，你应该能看到语法高亮和智能提示了。
    

#### 2. 核心快捷键 (肌肉记忆)

- **找文件**：`<Space> f f` (Find Files) - 呼出 Telescope，模糊搜索文件名。
    
- **搜代码**：`<Space> s g` (Search Grep) - 全局搜索代码内容。
    
- **文件树**：`<Space> e` (Explorer) - 打开左侧的文件浏览树 (Neo-tree)。
    
- **浮动终端**：`<Space> f t` (Float Terminal) - 在编辑器里弹出一个悬浮终端，用完按 `Esc` `q` 关闭。
    
- **Keymaps 查询**：`<Space> s k` - 忘了快捷键？按这个查所有键位。
    

#### 3. 怎么在 yazi 里用 nvim？

既然你刚才设置了 `export EDITOR='nvim'`，现在去 `yazi` 里选中一个文件按 `e`，它就会以这套酷炫的界面打开文件。

### 第五步：进阶调优 (为了你的论文和项目)

你的 `RevieU` 项目和学术论文可能需要 Markdown 预览或 LaTeX 支持。

打开 `~/.config/nvim/lua/plugins/example.lua` (或者新建文件)，你可以添加插件。

启用 LazyVim 自带的强大模块：

LazyVim 有个 lazyvim.json 配置文件，或者你可以在 lua/config/lazy.lua 里开启 Extras。

建议开启：

- `lazyvim.plugins.extras.lang.python` (更强的 Python 支持)
    
- `lazyvim.plugins.extras.lang.markdown` (实时预览 Markdown)
    
- `lazyvim.plugins.extras.coding.copilot` (如果你买了 GitHub Copilot，这个必须开！)

### 总结

你现在的终端环境是：

- **Shell**: Zsh + Oh My Zsh (Arch 标配)
    
- **包管理**: Paru (Rust 极客风)
    
- **文件管理**: Yazi (Rust 极速流)
    
- **编辑器**: Neovim + LazyVim (IDE 级体验)
    

**现在，随便打开一个 Python 脚本，按下 `<Space> e` 呼出侧边栏，再 `<Space> f f` 搜个文件，感受一下这种指尖跳舞的快感吧！** 🧊
