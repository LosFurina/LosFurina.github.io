---
title: "Markdown转PDF工具推荐"
description: "Pandoc 功能强大：如果你之后想把 Markdown 转为论文、技术报告、手册，甚至 PDF + LaTeX 混排，它几乎能搞定。你用..."
pubDate: "2025-10-30"
updatedDate: "2026-02-13"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/ChatGPT-Markdown转PDF工具推荐.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“markdown to pdf的工具都有什么”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. markdown to pdf的工具都有什么

好呀，想把 Markdown 转成 PDF，这里给你整理几个我觉得不错的工具（有线上／本地／命令行的各种类型），你可以按你的 workflow（比如你用 Windows + Arch Linux + 编程背景）选一个比较合适的。你看了之后我还可以帮你选 “最适合深度学习／科研笔记” 的那种。

###  值得考虑的工具列表

| 工具名 | 类型 | 优点 | 注意事项 |
| --- | --- | --- | --- |
| Pandoc | 命令行／多格式转换器 | “瑞士军刀”级别，能支持 Markdown → PDF 还支持很多格式。[Stack Overflow+2Wikipedia+2](https://stackoverflow.com/questions/17630486/how-to-convert-a-markdown-file-to-pdf?utm_source=chatgpt.com) | 要生成 PDF 通常还得安装 LaTeX 或者其他 PDF 引擎，配置稍微繁琐。 |
| md‑to‑pdf (由 “simonhaenisch/md-to-pdf” 实现) | 命令行（Node.js） | 专门做 Markdown → PDF，支持代码高亮、自定义 CSS、页面断裂等。[GitHub](https://github.com/simonhaenisch/md-to-pdf?utm_source=chatgpt.com) | 如果你比较熟 JS／Node 环境会比较顺手；如果只想快速用可能稍微“重”一点。 |
| md2pdf (Python 版) | 命令行／库（Python） | 适合你这种熟悉 Python 背景的人。可以当成库在代码里调用。[GitHub](https://github.com/jmaupetit/md2pdf?utm_source=chatgpt.com) | 可能功能没那么多“花哨”的页面布局／排版选项；样式可能需要自己调。 |
| GUI／编辑器插件：比如 Markdown PDF（VS Code 插件） | 图形化／编辑器内 | 在编辑器（你如果用 VSCode 的话）直接按一个命令就导出，方便快捷。[Visual Studio Marketplace+1](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf&utm_source=chatgpt.com) | 排版可能不如专门工具强；如果是做科研论文那种复杂结构可能略逊。 |
| 在线工具（Web版） | 无需安装 | 快速、零配置。例如：线上 Markdown → PDF 转换器。[Mark Down To PDF+2APITemplate.io+2](https://www.markdowntopdf.com/?utm_source=chatgpt.com) | 依赖网络，有隐私／数据安全风险。如果内容敏感（科研笔记／代码／数据）可能不太理想。 |

###  给你建议（结合你的背景）

你从事机器学习／深度学习研究，又熟悉 Python，还有用 ArchLinux 的背景，我比较推荐你用 **Pandoc + 自定义样式** 或 **md2pdf（Python 版本）**，原因如下：

*   Pandoc 功能强大：如果你之后想把 Markdown 转为论文、技术报告、手册，甚至 PDF + LaTeX 混排，它几乎能搞定。你用 Python／Rust 背景，再搞一点 LaTeX 少量学习也不算太难。
*   md2pdf Python版本：如果你主要是日常笔记、博客、代码文档、报告这种 Markdown 格式，那这个工具用 Python 调用会很顺。你可以把它嵌入你的研究笔记流程，比如：写好 Markdown → 运行脚本 → 自动输出 PDF，这样自动化感觉挺帅的。
*   如果只是偶尔要导出／快速分享：编辑器插件或者在线工具也够用，但考虑到你科研资料可能含代码块、数学公式、图表，我觉得本地工具稳定性＋可定制性更优。

### 主题 2. pandoc怎么用

一句话总结 Pandoc 是干嘛的

> Pandoc 是一个“通用文档转换器”，能把 Markdown、Word、LaTeX、HTML 等各种格式互转。  
> 对科研来说，它是把 Markdown 转成 PDF、LaTeX 或论文的神器。

一、安装（推荐 Arch + Windows）

###  Arch Linux

```bash
sudo pacman -S pandoc texlive-core
```

> `texlive-core` 是 PDF 渲染用的 LaTeX 引擎，不装它生成不了 PDF。

###  Windows

1.  安装 Pandoc  
去 [https://pandoc.org/installing.html](https://pandoc.org/installing.html) 下载 `.msi` 安装包。
2.  安装 LaTeX 引擎（推荐 TinyTeX）：
```powershell
    # 在 PowerShell 执行
    choco install tinytex
```
或者手动安装 [TinyTeX](https://yihui.org/tinytex/)，轻量又兼容性好。

二、最简单的 Markdown → PDF 命令

假设你有一个文件 `report.md`：

```markdown
# 实验报告

本次实验验证了 Transformer 的时间序列预测效果。

## 结果
- MSE: 0.024
- MAE: 0.009
```

运行：

```bash
pandoc report.md -o report.pdf
```

这就能生成一个 `report.pdf`。  
如果环境没问题，PDF 会自动包含标题、段落、列表。

三、让 PDF 更好看（加模板与样式）

Pandoc 支持自定义样式和模板，比如加页眉页脚、字体、封面。

### 例：加上页边距、字体等设置

```bash
pandoc report.md -o report.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V mainfont="Times New Roman" \
  -V sansfont="Arial" \
  -V fontsize=12pt
```

> `--pdf-engine=xelatex` 指定用 XeLaTeX，这样中文不会乱码。  
> 你可以改字体，比如 `"SimSun"` 或 `"Noto Sans CJK SC"` 来支持中文。

四、中文支持（很重要）

要正常显示中文，请务必指定 XeLaTeX 引擎：

```bash
pandoc notes.md -o notes.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="SimSun" \
  -V geometry:margin=1in
```

> `SimSun` 是宋体，也可以换成 `Microsoft YaHei`、`Noto Serif CJK SC` 等。

五、科研增强：公式、引用、图片都行

### 支持 LaTeX 公式

```markdown
公式测试：

$$
E = mc^2
$$
```

### 插入图片

```markdown
![实验结果](./figures/result.png)
```

### 加封面页信息

```bash
pandoc report.md -o report.pdf \
  --metadata title="PGTN 实验报告" \
  --metadata author="Weijun Li" \
  --metadata date="2025-10-30"
```

️ 六、复杂模板（适合论文）

如果你要写类似论文/科研报告：

```bash
pandoc main.md -o paper.pdf \
  --template eisvogel \
  --listings \
  --pdf-engine=xelatex
```

安装模板：

```bash
git clone https://github.com/Wandmalfarbe/pandoc-latex-template.git
cd pandoc-latex-template
cp eisvogel.latex ~/.pandoc/templates/
```

> `eisvogel` 模板是学术风格的 Pandoc 模板，带标题页、目录、页码、代码高亮等，非常推荐。

七、科研工作流自动化示例

如果你希望自动生成报告，可以写个简单 Python 脚本：

```python
import os
os.system("pandoc report.md -o report.pdf --pdf-engine=xelatex -V geometry:margin=1in")
```

或者放在 `Makefile` 里，一键导出所有实验报告。

总结建议（结合你背景）

| 需求 | 建议 |
| --- | --- |
| 快速导出 PDF | `pandoc file.md -o file.pdf` |
| 有中文 | 加 `--pdf-engine=xelatex -V CJKmainfont="SimSun"` |
| 想要论文风格 | 用 `--template eisvogel` |
| 想自动化 | 写 Python 或 Makefile 调用 Pandoc |

### 主题 3. 我已经安装过texlive，这里面有没有pandoc

**结论先说：**

> ️ **Pandoc 不包含在 TeX Live 里。**  
> 它是独立的软件，和 LaTeX 套件（比如 TeX Live、TinyTeX、MiKTeX）是“互补关系”，不是“捆绑关系”。

解释一下区别

*   **TeX Live** 是一个 **LaTeX 系统**，它提供的是编译 `.tex` → `.pdf` 的工具链，比如：
    *   `pdflatex`
    *   `xelatex`
    *   `lualatex`
    *   以及各种宏包（`amsmath`, `geometry`, `hyperref` 等）
*   **Pandoc** 则是一个 **文档格式转换器**，它能把：
```
    Markdown → LaTeX → PDF
    Markdown → HTML
    LaTeX → DOCX
```
等等各种互转。
当你让 Pandoc 输出 PDF 时，它其实是：
```
    你的Markdown.md  →  生成中间的 LaTeX 文件  →  调用 TeX Live 的 xelatex 引擎编译成 PDF
```

也就是说：

> TeX Live 是“渲染引擎”，Pandoc 是“指挥官”。  
> 有 TeX Live 还不够，还得装 Pandoc 来发号施令。

检查你有没有 Pandoc

在终端输入：

```bash
pandoc --version
```

*   如果返回版本号，比如：
```
    pandoc 3.1.1
```
就说明已经安装了。
*   如果提示：
```
    command not found: pandoc
```
那就需要单独安装。

安装方式

###  在 Arch Linux：

```bash
sudo pacman -S pandoc
```

###  在 Windows：

如果你已经装过 TeX Live，只需要额外安装 Pandoc：

*   官方安装包：[https://pandoc.org/installing.html](https://pandoc.org/installing.html)
*   或者用 Chocolatey：
```powershell
    choco install pandoc
```

验证安装是否可用

装好之后，试着运行：

```bash
echo "# Hello Pandoc" > test.md
pandoc test.md -o test.pdf
```

如果生成了 `test.pdf`，那就说明 Pandoc 已经能成功调用 TeX Live 的引擎。

### 主题 4. 我现在要在windows使用pandoc

完美，这一步你走得很对。Pandoc 在 Windows 下用得也很舒服，尤其是你已经装了 **TeX Live**。下面我帮你从 **安装 → 验证 → 中文支持 → 一键生成 PDF** 全流程梳理一遍（保证一步不坑）。

一、安装 Pandoc

###  方法一：官方安装包（最推荐）

1.  打开官网  
[https://pandoc.org/installing.html](https://pandoc.org/installing.html)
2.  下载 Windows `.msi` 安装包（通常是 **64-bit installer**）。
3.  一路下一步安装即可。  
安装后，`pandoc.exe` 会自动加入系统 PATH。

安装完后在 **PowerShell** 或 **cmd** 里输入：

```bash
pandoc --version
```

如果看到类似：

```
pandoc 3.2.1
Compiled with pandoc-types 1.23
```

说明安装成功 

二、确认 LaTeX（TeX Live）可用

Pandoc 生成 PDF 时会自动调用 TeX 引擎，比如 `xelatex`。  
你可以测试下：

```bash
xelatex --version
```

如果能显示版本号，就说明 Pandoc 能调用它。

三、最基础的测试命令

随便创建个 `test.md`：

```markdown
# Hello Pandoc

这是一个简单的测试文档。

- 支持中文
- 支持数学公式：$E=mc^2$
```

然后执行：

```bash
pandoc test.md -o test.pdf --pdf-engine=xelatex
```

>  注意：这里加上 `--pdf-engine=xelatex`，否则中文会乱码。

执行完后，你应该在当前目录看到一个 `test.pdf`。  
如果中文不显示，请看下一节。

🈶 四、中文支持配置

Windows 下最容易出现的坑就是“中文字体丢失”。  
解决方案很简单：告诉 Pandoc 使用系统字体。

比如：

```bash
pandoc test.md -o test.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="Microsoft YaHei" \
  -V mainfont="Times New Roman" \
  -V geometry:margin=1in
```

解释：

*   `CJKmainfont` → 中文字体（微软雅黑）
*   `mainfont` → 英文字体（Times）
*   `geometry` → 页边距

如果你喜欢宋体，可以改：

```bash
-V CJKmainfont="SimSun"
```

>  只要指定了 `--pdf-engine=xelatex` 并告诉 Pandoc 字体名，中文问题 100% 解决。

五、输出更精美（Eisvogel 模板推荐）

学术／科研报告风格模板非常好看：

### 安装模板：

```bash
mkdir -p "%APPDATA%\pandoc\templates"
cd %APPDATA%\pandoc\templates
git clone https://github.com/Wandmalfarbe/pandoc-latex-template.git
copy pandoc-latex-template\eisvogel.latex .
```

### 使用：

```bash
pandoc report.md -o report.pdf \
  --template eisvogel \
  --pdf-engine=xelatex \
  -V CJKmainfont="Microsoft YaHei" \
  --metadata title="PGTN 实验报告" \
  --metadata author="Weijun Li" \
  --metadata date="2025-10-30"
```

这个模板自带标题页、目录、代码高亮，非常适合科研输出。

️ 六、可选的进阶设置

如果你常要导出 PDF，可以写个批处理文件，比如 `md2pdf.bat`：

```bat
@echo off
pandoc %1 -o %~n1.pdf --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei" -V geometry:margin=1in
pause
```

这样只要右键 → “发送到 → md2pdf.bat”，  
就能直接把任意 Markdown 变成 PDF。

七、总结推荐

| 需求 | 命令示例 |
| --- | --- |
| 快速导出 PDF | `pandoc file.md -o file.pdf --pdf-engine=xelatex` |
| 含中文 | `-V CJKmainfont="Microsoft YaHei"` |
| 想生成论文风格 | `--template eisvogel` |
| 想自动化 | 写 `.bat` 或 Python 调用命令 |

### 排查场景 1. powershell自带的包管理能安装吗

- 场景：powershell自带的包管理能安装吗
- 处理要点：
非常好，这个问题问得很到位。

>  **结论：可以的。**  
> PowerShell 自带的包管理系统 **`winget`**（Windows Package Manager）  
> 就能直接安装 Pandoc，非常方便，而且比手动下载安装包更干净、可更新。

️ 一、确认你有 `winget`

在 PowerShell 里输入：

```bash
winget --version
```

如果能输出版本号（比如 `v1.8.1911`），说明有。  
如果提示 `command not found` 或 “未识别的命令”，就需要先更新 Windows 到 **21H2 或更高版本**（Windows 10/11 一般都自带）。

二、使用 winget 安装 Pandoc

直接执行：

```bash
winget install --id=JohnMacFarlane.Pandoc -e
```

解释：

*   `--id` 指的是 Pandoc 的唯一包名（来自官方作者 John MacFarlane）
*   `-e` 表示精确匹配，防止装错类似包名的工具

执行后 winget 会自动：

1.  下载 Pandoc 官方最新稳定版
2.  添加环境变量 PATH
3.  无需管理员权限（但如果提示权限问题，右键“以管理员身份运行 PowerShell”）

三、验证是否安装成功

```bash
pandoc --version
```

如果能看到输出类似：

```
pandoc 3.2.1
Compiled with pandoc-types 1.23
```

就说明安装完成 

四、可选安装：配合 LaTeX 引擎

你已经装过 TeX Live，所以不用再装。  
但如果有其他机器上也想配置，可以顺手用：

```bash
winget install --id=MiKTeX.MiKTeX -e
```

或者轻量版 TinyTeX。

五、更新命令

将来 Pandoc 出新版，只需：

```bash
winget upgrade JohnMacFarlane.Pandoc
```

小提示：顺手装这些工具更爽

如果你打算用 Pandoc 做科研报告，可以再安装这几个包（同样用 winget）：

```bash
winget install --id=Git.Git -e             # Git
winget install --id=Python.Python.3.12 -e  # Python
winget install --id=7zip.7zip -e           # 解压工具
```

*   Pandoc
*   TinyTeX（轻量 LaTeX 引擎）
*   字体支持（如 Noto CJK）
*   自动检测环境是否正常

这样你以后在任何新电脑上一键运行就配置好 Markdown → PDF 环境。

### 排查场景 2. markdown preview enhanced怎么设置这个

- 场景：markdown preview enhanced怎么设置这个
- 处理要点：
好问题，这个错误信息

```
Error: Output format needs to be specified.
```

通常出现在 **VS Code 插件「Markdown Preview Enhanced」(MPE)** 里用 Pandoc 导出时，  
说明它调用 Pandoc 时没指定输出格式（比如没写明要导出为 pdf/html/docx）。  
别担心，这个很好修，我们一步一步把它搞定 

一、问题来源

Markdown Preview Enhanced 支持多种导出方式：

*   直接内置引擎导出（不依赖 Pandoc）
*   通过 Pandoc 导出（支持更复杂格式）

当你点击 “Export (Pandoc)” 时，如果没告诉它输出格式，比如：

```json
"pdf", "html", "docx"
```

就会报：

> “Output format needs to be specified”

️ 二、解决方案（两种方式）

###  方法 1：手动在命令中指定格式

在你的 `.md` 文件里顶部添加一个 **YAML front matter**（元信息块）：

```markdown
---
title: "PGTN 实验报告"
author: "Weijun Li"
date: 2025-10-30
output: pdf
---
```

> `output: pdf` 就是告诉 Pandoc 输出格式为 PDF。

然后点击：

> `右键 → Markdown Preview Enhanced: Export (Pandoc)`

即可成功导出 PDF，不再报错。

###  方法 2：在 VS Code 设置里默认指定输出格式

1.  打开 VS Code → `Ctrl + ,`
2.  搜索 `markdown-preview-enhanced pandoc`
3.  找到这个配置项：
```
    Markdown-preview-enhanced: Pandoc Arguments
```
4.  填入如下内容：
```json
    [
      "--pdf-engine=xelatex",
      "-V",
      "CJKmainfont=Microsoft YaHei",
      "-V",
      "geometry:margin=1in"
    ]
```
5.  然后再去执行导出时，选择 “Export (Pandoc) → PDF”，就不会报错了。

🈶 三、推荐的配置文件（更智能）

你也可以在项目根目录创建 `.mpeconfig.json` 文件来保存默认设置：

```json
{
  "pandoc": {
    "pdfEngine": "xelatex",
    "outputFormat": "pdf",
    "args": [
      "-V", "CJKmainfont=Microsoft YaHei",
      "-V", "geometry:margin=1in"
    ]
  }
}
```

> 这样无论哪个 `.md` 文件导出，都能自动用 PDF 格式 + 中文支持。

四、测试是否生效

写一个简单的 Markdown 文件：

```markdown
---
title: "测试文档"
output: pdf
---

# 你好 Pandoc
这是一个测试。

- 支持中文 
- 支持数学公式：$E = mc^2$
```

右键 → **Markdown Preview Enhanced: Export (Pandoc)**  
看是否生成了 `测试文档.pdf`，如果有，恭喜你配置成功 

附：如果还提示“找不到 Pandoc”

那是因为 VS Code 找不到你的 Pandoc 安装路径。

*   解决：确认 `pandoc --version` 在 PowerShell 可用；
*   然后重启 VS Code；
*   若仍不行，可在 `settings.json` 手动加路径：

```json
"markdown-preview-enhanced.pandocPath": "C:\\Program Files\\Pandoc\\pandoc.exe"
```

*   自动输出 PDF
*   中文字体支持
*   页边距调整
*   自动封面（用 YAML）

这样你在 VS Code 里点一下就能导出正式报告。

### 主题 5. 是这个配置项吗

对 ，你找到的这个配置项完全正确：

```json
"markdown-preview-enhanced.pandocArguments": [ ]
```

它就是 Markdown Preview Enhanced（简称 MPE）在调用 Pandoc 时传递命令行参数的地方。  
你可以把原本在终端输入的 Pandoc 命令参数放进这里。

一、推荐的标准配置（中文 + PDF 输出）

在 VS Code 的 **settings.json**（用户或工作区设置）里加入：

```json
"markdown-preview-enhanced.pandocArguments": [
    "--pdf-engine=xelatex",
    "-V",
    "CJKmainfont=Microsoft YaHei",
    "-V",
    "geometry:margin=1in"
],
"markdown-preview-enhanced.pandocPath": "C:\\Program Files\\Pandoc\\pandoc.exe",
"markdown-preview-enhanced.pandocMarkdownFlavor": "markdown",
"markdown-preview-enhanced.pandocOptions": {
    "outputFormat": "pdf"
}
```

二、解释一下各个参数：

| 参数 | 作用 |
| --- | --- |
| `--pdf-engine=xelatex` | 指定 Pandoc 使用 XeLaTeX 引擎（支持中文） |
| `-V CJKmainfont=Microsoft YaHei` | 设置中文字体为微软雅黑 |
| `-V geometry:margin=1in` | 设置页边距为 1 英寸 |
| `pandocPath` | 明确指定 Pandoc 的安装路径（防止 VS Code 找不到） |
| `outputFormat` | 告诉 Pandoc 默认导出为 PDF |

三、测试方法：

1.  打开一个 Markdown 文件，比如：
```markdown
    ---
    title: "PGTN 实验报告"
    author: "Weijun Li"
    date: "2025-10-30"
    output: pdf
    ---
    # 简介
    本报告测试 Pandoc 与 Markdown Preview Enhanced 的配合。
    ## 结果
    - 预测准确率：99.2%
    - 均方误差：0.0081
```
2.  在 VS Code 中右键选择：
```
    Markdown Preview Enhanced: Export (Pandoc)
```
3.  如果出现 `report.pdf`，恭喜，配置成功 

️ 四、可选增强：使用 Eisvogel 模板（更像论文）

如果你想要导出的 PDF 更精美（带封面页、目录、页码、代码高亮），  
可以再在参数里加上模板配置：

```json
"markdown-preview-enhanced.pandocArguments": [
    "--pdf-engine=xelatex",
    "--template=eisvogel",
    "-V",
    "CJKmainfont=Microsoft YaHei",
    "-V",
    "geometry:margin=1in"
]
```

前提是你已下载 [Eisvogel 模板](https://github.com/Wandmalfarbe/pandoc-latex-template)。

小提示

*   修改完配置后，最好 **重启 VS Code**。
*   如果还报 `Output format needs to be specified`，可以在 Markdown 文件头部加：
```markdown
    ---
    output: pdf
    ---
```

### 主题 6. 就用pdflatex，而且我也不写中文

非常好，那就简单多了   
如果你只打算用 `pdflatex`（不涉及中文字体），可以直接在 VS Code 的 `settings.json`（或者通过命令面板输入 `Preferences: Open Settings (JSON)` 打开）里加上这段配置

```json
"markdown-preview-enhanced.pandocArguments": [
    "--pdf-engine=pdflatex",
    "--standalone"
],
"markdown-preview-enhanced.outputFileType": "pdf"
```

解释一下：

*   `"--pdf-engine=pdflatex"` 指定 Pandoc 用 `pdflatex` 渲染 PDF（最快也最稳）；
*   `"--standalone"` 让 Pandoc 生成完整的 LaTeX 文档（避免缺少文档头导致编译错误）；
*   `"markdown-preview-enhanced.outputFileType": "pdf"` 表示默认导出 PDF。

然后操作方式是：

1.  打开你的 `.md` 文件；
2.  按 `Ctrl + Shift + P`，输入 “Markdown Preview Enhanced: Export (pdf)”；
3.  它会自动调用 Pandoc → pdflatex → 生成 PDF。

**小贴士**：  
如果你装了 `TeX Live` 或 `MiKTeX`，就能直接用 `pdflatex`；  
可以在终端输入以下命令检查是否可用：

```bash
pdflatex --version
```

如果能看到版本信息，就说明一切OK

### 主题 7. md怎么分页

但在导出 PDF 时，你可以**用一些特殊语法或 CSS 指令来手动分页**，具体方式取决于你用的工具。  
既然你用的是 **Markdown Preview Enhanced + Pandoc + pdflatex**，那我就按这个环境给你几种方案

###  **方法一：Pandoc + LaTeX 原生命令分页**

在 Markdown 中直接插入：

```markdown
\newpage
```

这在使用 `pdflatex` 时是**最稳妥、最推荐**的方式。  
示例：

```markdown
# 第一章

这里是第一页的内容。

\newpage

# 第二章

这里是第二页的内容。
```

> ️ 注意：`\newpage` 必须在导出 PDF 时使用 LaTeX 引擎（如 `pdflatex`、`xelatex`、`lualatex`）才有效。

###  **方法二：使用 Pandoc 的分节分页（需要加参数）**

Pandoc 提供了一个 `--variable` 选项来控制分页方式，你可以通过 `settings.json` 加进去，比如：

```json
"markdown-preview-enhanced.pandocArguments": [
    "--pdf-engine=pdflatex",
    "--standalone",
    "-V", "geometry:margin=1in"
]
```

然后在 Markdown 文件中使用：

```markdown
<div style="page-break-after: always;"></div>
```

这行在 PDF 导出时也会插入分页。

###  **方法三：通过 CSS 控制分页（仅限 HTML 转 PDF）**

如果你将 Markdown 转为 HTML 后再打印成 PDF，可以用 CSS 控制分页：

```html
<div style="page-break-before: always;"></div>
```

或：

```html
<hr style="page-break-after: always;">
```

不过因为你现在是 `pdflatex` 渲染，所以这个方法对你不生效。

###  **结论：推荐写法**

既然你是用 `pdflatex`（纯 LaTeX 渲染），那最干净的分页命令就是：

```markdown
\newpage
```

它和 LaTeX 的 `\pagebreak` 效果差不多，但 `\newpage` 更直观也更常用。

### 主题 8. pandoc还能干什么

> **几乎可以在所有文档格式之间互相转换。**

下面我给你分层讲讲 Pandoc 到底能干什么，让你知道它不仅是“Markdown 转 PDF”，而是一个文档界的“全能变形机器”。

一、Pandoc 的核心使命：格式转换之王

Pandoc 最主要的用途是——**不同文档格式之间的相互转换**。  
它几乎支持所有主流的学术、写作和网页格式：

| 输入格式 | 输出格式 |
| --- | --- |
| Markdown (.md) | PDF, HTML, DOCX, LaTeX, Beamer, EPUB, ODT, RTF, JSON, TXT, Reveal.js slides... |
| LaTeX (.tex) | PDF, DOCX, HTML, Markdown |
| HTML (.html) | Markdown, PDF, DOCX |
| DOCX (.docx) | Markdown, PDF, HTML |
| Org-mode (.org) | Markdown, PDF, DOCX |
| Jupyter Notebook (.ipynb) | Markdown, PDF, DOCX |
| … | … |

举几个典型例子：

```bash
# Markdown 转 PDF
pandoc input.md -o output.pdf --pdf-engine=pdflatex

# Markdown 转 Word
pandoc input.md -o output.docx

# Word 转 Markdown
pandoc report.docx -o report.md

# LaTeX 转 HTML
pandoc paper.tex -o paper.html
```

️ 二、Pandoc 的隐藏杀手锏：学术论文神器

Pandoc 特别受到学术圈欢迎，因为它能帮你：

###  1. 自动生成参考文献（配合 `.bib` 文件）

只要在 Markdown 里写：

```markdown
根据文献 [@smith2020deep] 提到的结果...
```

然后命令行：

```bash
pandoc paper.md --citeproc --bibliography=refs.bib -o paper.pdf
```

它会自动格式化成 IEEE、APA、MLA 等引用样式。  
再加上 `--csl style.csl`，就能用 Zotero 的格式。

###  2. 直接生成 LaTeX/Beamer 幻灯片

只要改个命令：

```bash
pandoc slides.md -t beamer -o slides.pdf
```

你的 Markdown 文档瞬间变成高质量的 LaTeX 幻灯片。  
或者用：

```bash
pandoc slides.md -t revealjs -o slides.html
```

生成 **网页幻灯片**，动画、代码高亮全有。

###  3. 支持公式、代码高亮、引用、图表

*   数学公式用 `$...$` 或 `$$...$$`
*   代码块自动语法高亮
*   图片、表格、引用都支持 Markdown 语法

可以说：

> “你写 Markdown，它给你排版成学术论文。”

三、Pandoc 的高级玩法：模板 + 元数据

你可以写一个专属的模板（LaTeX 或 HTML），然后通过 YAML 头部控制输出。

示例：

```markdown
---
title: "My Research Report"
author: "Weijun Li"
date: "2025-10-30"
geometry: "margin=1in"
fontsize: 12pt
---

# Introduction

Hello world.
```

执行：

```bash
pandoc report.md -o report.pdf --pdf-engine=pdflatex
```

自动渲染出带封面、目录、页码的论文格式。

四、Pandoc 还能干这些事

| 功能 | 示例命令 | 说明 |
| --- | --- | --- |
|  批量转换 | `pandoc *.md -o combined.pdf` | 合并多个 Markdown 成一本 PDF |
|  电子书生成 | `pandoc book.md -o book.epub` | 输出 EPUB 或 Kindle 电子书 |
|  网页输出 | `pandoc post.md -o post.html --css style.css` | 自定义 CSS 样式 |
|  JSON AST 导出 | `pandoc file.md -t json` | 输出 Pandoc 的语法树，可供程序分析 |
|  与 Typst、LaTeX、Word 互通 | `pandoc thesis.md -o thesis.typ` | 转换到 Typst 模板 |
|  Lua 脚本扩展 | `pandoc --lua-filter=myfilter.lua` | 用 Lua 自定义转换逻辑 |

总结一句话：

> **Pandoc 就是“文档界的 FFMPEG”**  
> 你能想到的文档格式，它几乎都能读写、能转、能调样式、能批量自动化。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
