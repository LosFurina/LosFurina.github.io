---
title: "Linux 与 Windows 的 AirDrop 替代方案"
description: "对比 Snapdrop 等局域网传输方案，快速实现跨平台文件互传。"
pubDate: "2026-01-17"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Linux and Windows 上的 AirDrop.md"
sourceVault: "obsidian/note"
slug: "infra/linux-and-windows-上的-airdrop"
---
### **方案 A：Snapdrop (强烈推荐，像 AirDrop 一样)**

如果你的两台电脑在**同一个 WiFi/局域网**下，这是最快的方法，不用登录，也不用手敲长代码。

1.  **两台电脑都打开浏览器**：
    *   Arch 电脑（Firefox）：打开 
        [snapdrop.net](https://snapdrop.net)
    *   另一台电脑：也打开 
        [snapdrop.net](https://snapdrop.net)
2.  **传输**：
    *   你应该能在这个网页上看到对方的设备名字（随机生成的，比如 "Purple Ostrich"）。
    *   在**另一台电脑**上，把你的 Zsh 配置代码复制好。
    *   在 Snapdrop 网页上右键点击 Arch 设备的图标 -\> 选择 **Send Message** (或者直接复制进去发过去)。
    *   _(或者直接把 `.zshrc` 文件拖进去发送)_
3.  **接收**：
    *   Arch 电脑上会弹出一个框，直接 Copy 或者 Download。
    *   然后在终端里 `vim ~/.zshrc` 粘贴进去。

* * *

### **方案 B：Termbin (极客最爱，URL 极短)**

如果你想体验纯命令行的快感，或者 Snapdrop 连不上。

**1\. 在有配置的那台电脑上（发送端）：**

*   **如果是 Mac/Linux**：打开终端，运行：
    ```
    cat 你的配置文件路径 | nc termbin.com 9999
    ```
    *   _它会返回一个极短的网址，例如 `https://termbin.com/abcd`_
*   **如果是 Windows**：直接打开浏览器访问 [termbin.com](https://termbin.com)
     是没用的。你可以用下面的**方案 C**。

**2\. 在 Arch 电脑上（接收端）：**

*   在 Konsole 里输入：
    ```
    curl https://termbin.com/xxxx > ~/.zshrc
    ```
    _(把 xxxx 换成刚才生成的那个短码)_

* * *

### **方案 C：Ubuntu Pastebin (传统稳妥)**

如果你不在同一局域网，或者不想用命令行。

1.  **发送端**：
    *   打开 
        [paste.ubuntu.com](https://paste.ubuntu.com/)
    *   把配置粘贴进去，**Poster** 随便填，**Syntax** 选 Zsh (或者 Plain Text)。
    *   点击 **Paste!**。
    *   **复制地址栏的 URL**。
2.  **接收端 (Arch)**：
    *   打开 Firefox，输入那个 URL。
    *   复制网页里的内容。
    *   终端里 `vim ~/.zshrc`，按 `i` 进入编辑模式，`Ctrl+Shift+V` 粘贴，`:wq` 保存。
