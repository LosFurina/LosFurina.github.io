---
title: "有没有能做pdf ocr的工具"
description: "PaddleOCR (推荐)：由百度开发，目前对 中文 识别效果最好的开源库之一。支持多语言、多方向文字识别，且模型轻量，运行速度快。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/Gemini-有没有能做pdf ocr的工具.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“有没有能做pdf ocr的工具”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. 有没有能做pdf ocr的工具

做 PDF OCR（光学字符识别）的工具非常多，根据你的身份（开发者、普通用户还是企业级需求）和具体的使用场景，可以分为以下几大类：

1\. 面向开发者的开源工具 (高自定义、免费)

如果你想通过代码批量处理，或者集成到自己的项目中：

*   **PaddleOCR (推荐)**：由百度开发，目前对**中文**识别效果最好的开源库之一。支持多语言、多方向文字识别，且模型轻量，运行速度快。
*   **Tesseract OCR**：由 Google 维护的老牌 OCR 引擎。虽然对复杂排版的处理稍弱，但支持语言极其丰富，是很多工具的底层内核。
*   **OCRmyPDF**：这是一个专门为 PDF 设计的命令行工具。它能在扫描版 PDF 上增加一个“文字层”，让文件变得可搜索、可复制，同时保留原始图像。
*   **EasyOCR**：基于 PyTorch，易用性极高，几行 Python 代码就能搞定，适合快速开发。

2\. 桌面级综合软件 (精准、功能全面)

适合处理大量文档、复杂表格或需要精细校对的场景：

*   **ABBYY FineReader PDF**：OCR 界的“天花板”。识别准确率极高，尤其擅长处理多栏排版、复杂表格和手写体，支持导出为多种格式。
*   **Adobe Acrobat Pro**：PDF 的行业标准。它的 OCR 功能集成在编辑流程中，识别后可以直接原地修改 PDF 里的文字，字体还能自动匹配。
*   **PDFelement (万兴 PDF)**：性价比相对较高的选择，界面现代，OCR 插件识别率不错，适合个人或小团队。

3\. 轻量化与在线工具 (方便、快捷)

如果你只是偶尔用一下，不想安装庞大的软件：

*   **PDFgear**：**完全免费**且功能强大的桌面 PDF 工具，内置了非常不错的 OCR 功能，是目前市面上少有的“良心”全能软件。
*   **在线平台 (如 iLovePDF, Smallpdf)**：打开网页即可上传处理，适合单份小文件的临时需求。但要注意隐私，敏感文档建议使用本地工具。
*   **白描 (网页版/App)**：国内口碑极好的 OCR 工具，对中文优化非常好，支持拍照转 PDF/Word。

### 选购建议表

| 需求场景 | 推荐工具 | 理由  |
| --- | --- | --- |
| **追求最高准确率/企业办公** | ABBYY FineReader | 几乎无差错，表格还原度高 |
| **日常办公/编辑 PDF 内容** | Adobe Acrobat Pro | 编辑与识别一体化 |
| **开发者/批量自动化** | PaddleOCR / OCRmyPDF | 免费开源，可高度定制 |
| **完全免费/轻量使用** | PDFgear | 无广告，功能齐全 |
| **中文识别/手机端** | 白描  | 针对中文排版有深度优化 |

你是准备处理大量的学术论文、发票账单，还是只是想偶尔把一张图片里的文字抠出来。

### 主题 2. ocrmypdf怎么在arch上安装，我去pacman没搜到

在 Arch Linux 上，`ocrmypdf` 确实不在官方仓库（Extra）中，因为它依赖大量的 Python 包和复杂的 C 库，维护成本较高。

你可以在 **AUR (Arch User Repository)** 中找到它。既然你平时习惯使用 `pacman`，建议安装一个 AUR Helper（如 `yay` 或 `paru`）来简化这个过程。

1\. 使用 AUR 安装 (推荐)

如果你已经安装了 `yay`，直接运行：

```
yay -S ocrmypdf
```

如果是 `paru`：

```
paru -S ocrmypdf
```

**注意：** 安装过程中会编译和下载较多依赖（如 `tesseract`, `unpaper`, `ghostscript` 等），可能需要几分钟时间。

2\. 如果你没有 AUR Helper (手动安装)

如果你不想安装 `yay`，可以手动克隆并编译：

```
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/ocrmypdf.git
cd ocrmypdf
makepkg -si
```

3\. 另一种方案：使用 Docker (最省事)

考虑到你对 **DevOps 和容器化** 比较熟悉，其实用 Docker 跑 `ocrmypdf` 可能是最干净的选择，不会污染你的 Arch 系统环境，也避免了复杂的依赖编译：

```
# 拉取镜像
docker pull jbarlow83/ocrmypdf

# 运行 OCR 处理（将当前目录下的 input.pdf 处理为 output.pdf）
docker run --rm -v "$(pwd):/home/docker" jbarlow83/ocrmypdf input.pdf output.pdf
```

4\. 关键配置：中文支持

安装完 `ocrmypdf` 后，你还需要安装 **Tesseract 的中文语言包**，否则它无法识别中文：

```
sudo pacman -S tesseract-data-chi_sim tesseract-data-chi_tra
```

然后在执行命令时加上 `-l chi_sim` 参数：

```
ocrmypdf -l chi_sim input.pdf output.pdf
```

### 常用命令小结

*   **最基础：** `ocrmypdf input.pdf output.pdf` (默认识别英文)
*   **跳过已包含文字的项目：** `ocrmypdf --skip-text input.pdf output.pdf` (适合处理那种“图片+文字”混合的 PDF)
*   **自动旋转纠偏：** `ocrmypdf --rotate-pages --deskew input.pdf output.pdf`

你是打算把这个集成到你的 **RevieU 项目** 的自动化工作流中，还是单纯为了处理课业论文。

### 排查场景 1. ~/workspace/ocrmypdf-17.0.1 ❯ sudo p...

- 场景：~/workspace/ocrmypdf-17.0.1 ❯ sudo p...
- 处理要点：
这个 **404 错误**在 Arch Linux 上非常经典。原因很简单：Arch 是滚动更新的，镜像站已经把旧版本的包删掉了，而你本地的包数据库（Package Database）还停留在旧版本信息上，所以 `pacman` 去拉取时发现文件找不到了。

你只需要**同步一下数据库并升级系统**即可解决。

### 1\. 修复方法

运行以下命令同步并升级：

```
sudo pacman -Syu docker
```

*   `-S`：安装。
*   `-y`：下载最新的包数据库（解决 404 的关键）。
*   `-u`：升级已有的包。**注意：** 在 Arch 上不建议只用 `-Sy` 后跟安装命令，这会导致“部分升级”（Partial Upgrade），可能会引发依赖冲突，所以习惯性带上 `-u`。

### 2\. 如果依然速度慢或报错

如果你发现下载速度很慢，可能是当前的镜像站同步不及时。建议更新一下你的 `mirrorlist`。作为 Arch 用户，建议安装 `reflector` 来自动获取最快镜像：

```
sudo pacman -S reflector
sudo reflector --verbose --latest 10 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

运行完后再执行 `sudo pacman -Syu docker`。

### 3\. 安装后的关键一步

既然你正在安装 Docker，装完后别忘了启动服务，否则运行命令会报错：

```
sudo systemctl enable --now docker
```

_注：`--now` 相当于同时执行了 `start` 和 `enable`。_

### 4\. 权限小贴士

既然你是一个偏向 DevOps 的开发者，一定不想每次跑 docker 都敲 `sudo`。记得把你自己加入 docker 组：

```
sudo usermod -aG docker $USER
```

然后**注销重新登录**（或者输入 `newgrp docker` 立即生效）。

### 下一步建议

安装好 Docker 后，你可以直接运行 `ocrmypdf` 的容器版本了。需要我帮你写一个能直接处理你当前 `~/workspace/ocrmypdf-17.0.1` 目录下 PDF 的 alias 或者脚本吗。

### 排查场景 2. Wayne-5090 docker run --rm -v "\$ pw...

- 场景：Wayne-5090 docker run --rm -v "\$ pw...
- 处理要点：
看来你的 Docker 已经成功跑起来了，这很好。

这个报错的原因是 Docker 容器内部的 **工作目录权限** 或者 **路径映射** 问题。在容器里，虽然你挂载了 `$(pwd)` 到 `/home/docker`，但容器默认的工作目录可能并不是这里。

你可以通过以下两种方式修复：

### 方法 1：明确指定容器内路径（最稳妥）

直接告诉 `ocrmypdf` 文件在容器里的哪个位置：

```
docker run --rm -v "$(pwd):/home/docker" jbarlow83/ocrmypdf /home/docker/577.pdf /home/docker/output.pdf
```

### 方法 2：设置容器工作目录 (`-w`)

通过 `-w` 参数把容器的运行目录切换到挂载点，这样你就可以用相对路径了：

```
docker run --rm -v "$(pwd):/home/docker" -w /home/docker jbarlow83/ocrmypdf 577.pdf output.pdf
```

### 进阶优化：针对你的 Arch 环境

既然你用的是 **Wayne-5090** 这种顶级配置（RTX 5090 + Ryzen 9），我们可以利用多核性能加速 OCR：

1.  **开启多进程优化**：`ocrmypdf` 默认会尝试使用多核。
2.  **添加中文支持**：如果你处理的是中文文档，镜像内需要指定语言（该镜像通常内置了常用语言）：
```
    docker run --rm -v "$(pwd):/home/docker" -w /home/docker jbarlow83/ocrmypdf -l chi_sim+eng 577.pdf output.pdf
```

### 推荐：写进 `.zshrc` 变成“原生命令”

既然你在 Arch 上经常用终端，可以给它起个别名。把下面这行加到你的 `~/.zshrc` 里：

```
alias ocr='docker run --rm -v "$(pwd):/home/docker" -w /home/docker jbarlow83/ocrmypdf'
```

然后执行 `source ~/.zshrc`。以后你只需要在 PDF 目录下输入： `ocr -l chi_sim 577.pdf output.pdf` 就可以了。

**顺便问下，你这 577.pdf 是 CSCI-577 (Software Engineering) 的课件吗。** 如果是的话，之后如果你要为 RevieU 做文档处理模块，我们可以直接把这套逻辑封装成微服务。

### 主题 3. 为什么给我输出pdf，直接输出文本格式呗

这是因为 `ocrmypdf` 的核心设计理念是**“可搜索的 PDF”**。它默认的操作是在你的原始图像层之上，“缝合”一层透明的、可搜索的文字层，从而生成一个新的 PDF 文件。

如果你只需要提取纯文本（`.txt`），你可以通过以下几种方式实现：

### 方法 1：使用 `sidecar` 参数（推荐）

`ocrmypdf` 提供了一个 `--sidecar` 参数，可以在生成 PDF 的同时，把识别出的文字导出一个纯文本文件。

```
docker run --rm -v "$(pwd):/home/docker" -w /home/docker jbarlow83/ocrmypdf --sidecar output.txt 577.pdf output.pdf
```

运行后，你会得到两个文件：

*   `output.pdf`：带文字层的 PDF。
*   `output.txt`：**你想要的纯文本内容。**

### 方法 2：使用更直接的文本提取工具

如果你完全不想要 PDF，只想快准狠地拿文本，其实有更轻量的工具。既然你已经装好了 Docker，可以试一下专为 OCR 设计的 `tesseract`：

```
# 这里直接调用 tesseract 引擎将 pdf 转为 txt
docker run --rm -v "$(pwd):/home/docker" -w /home/docker tesseractshadow/tesseract tesseract 577.pdf output -l chi_sim
```

_注：输出文件名不需要加 `.txt`，它会自动生成 `output.txt`。_

### 方法 3：对生成的 PDF 使用 `pdftotext`

如果你已经用 `ocrmypdf` 生成了带文字层的 PDF，你的 Arch 系统里可能已经自带了 `poppler` 包。直接在终端执行：

```
# 如果没装：sudo pacman -S poppler
pdftotext output.pdf output.txt
```

### 为什么默认输出 PDF 而不是文本。

1.  **排版保留**：PDF 可以利用坐标信息把文字放回原来的位置，方便你对照原图看有没有识别错。
2.  **多用途**：有了带文字层的 PDF，你可以直接在浏览器或阅读器里 `Ctrl + F` 搜索，也可以像复制粘贴网页文字一样操作。

**建议：** 如果你是在处理 **CSCI-577** 的作业或者需要把讲义内容喂给你的微服务做知识库，建议用 **方法 1**。这样你既有了一个方便搜索的课件存档，又有了一个可以给程序读取的 `.txt`。

你想让我帮你写个简单的 Python 脚本来批量把目录下的 PDF 全转成文本吗。针对你的 Arch 环境，用 `pathlib` 配合 Docker 调用会非常方便。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
