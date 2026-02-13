---
title: "操作ShareLaTeX Docker容器"
description: "./sharelatex data:/var/lib/sharelatex。"
pubDate: "2025-10-28"
updatedDate: "2026-02-13"
category: "docker"
tags: ["docker"]
sourcePath: "src/content/blog/ChatGPT-操作ShareLaTeX Docker容器.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“sharelatex的docker容器把每一个latex文档存那里了，我...”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. sharelatex的docker容器把每一个latex文档存那里了，我...

哦，你想操作 ShareLaTeX（现在叫 Overleaf Community Edition）的 Docker 容器里的文档数据。其实这些文档在容器里是有固定挂载位置的，但也可能取决于你当初是怎么启动的 Docker 镜像的。大体流程我给你梳理一下：

### 1\. 找到容器的名字

```bash
docker ps
```

你会看到类似：

```
CONTAINER ID   IMAGE                NAMES
abc123         sharelatex/sharelatex  sharelatex
```

这里 `sharelatex` 就是你容器的名字。

### 2\. 进入容器

```bash
docker exec -it sharelatex bash
```

现在你就在容器内部了。

### 3\. 文档存放路径

在默认 ShareLaTeX Docker 镜像里，用户项目数据通常在：

```
/var/lib/sharelatex
```

或者具体：

```
/var/lib/sharelatex/data
```

里面会有 `projects` 或者 `files` 文件夹，每个文档对应一个文件夹，里面就是 `.tex`、图片和编译后的 `.pdf`。

你可以用：

```bash
ls /var/lib/sharelatex/data
```

看看所有项目。

### 4\. 直接在宿主机访问

如果你在启动 Docker 时有做 volume 映射，比如：

```yaml
volumes:
  - ./sharelatex_data:/var/lib/sharelatex
```

那么你在宿主机上就能直接看到 `./sharelatex_data` 文件夹，操作更方便。

### 5\. 小心操作

*   **不要直接改数据库**（MongoDB），否则 ShareLaTeX 可能认不到文件。
*   **只改 `.tex` 文件或资源文件夹** 安全。
*   最好先 **备份整个 `data` 文件夹**，万一操作失误可以恢复。

你希望我直接写吗。

### 主题 2. root@052116d45eab:/var/lib ls

啊哈，你已经进入容器了。从你列出的目录来看，这个镜像里存文档的地方是：

```
/var/lib/overleaf
```

`overleaf` 目录一般就是 ShareLaTeX/Overleaf CE 的项目数据目录。你可以进去看看：

```bash
cd /var/lib/overleaf
ls
```

通常会看到类似：

*   `projects` 或 `data` 文件夹，每个子文件夹对应一个文档项目。
*   每个项目里会有 `.tex` 文件、图片、`.bib` 文件，甚至编译输出的 PDF。

如果你想**手动编辑某个项目**，就直接进入对应的文件夹：

```bash
cd projects/<project_id>
ls
```

> Tip：项目 ID 一般是数字或者随机字符串，里面就是你平常在 Overleaf/ShareLaTeX 里看到的文件结构。

### 主题 3. root@052116d45eab:/var/lib/overleaf/...

完美，你现在就在 `/var/lib/overleaf/data` 里。从目录结构来看，这个 Overleaf 容器里存文档的方式有点明确了：

*   `cache/` → 临时缓存，一般不动。
*   `compiles/` → 编译过程生成的中间文件，也不建议直接改。
*   `history/` → 文档历史版本，用来回滚。
*   `output/` → 最终 PDF 或编译输出。
*   `template_files/` → 模板文件，如果你有模板项目就在这里。
*   `user_files/` → **核心**，大部分用户上传的 `.tex`、图片、`.bib` 文件都在这里。

所以，如果你想手动修改 LaTeX 文档，`user_files/` 里就是重点。你可以这样操作：

```bash
cd /var/lib/overleaf/data/user_files
ls
```

这里每个用户或每个项目可能都有单独子目录，里面就是你平时在 ShareLaTeX 界面里看到的文件。

 **小贴士**：

1.  直接改 `user_files/` 里的文件，Overleaf 会在下一次编译时读取最新内容。
2.  **别改权限**，文件是 `www-data` 用户拥有，容器里 Web 服务运行时也用这个用户。改了权限可能导致编译失败。
3.  如果你想宿主机直接操作，最好在 `docker run` 或 `docker-compose` 时把 `/var/lib/overleaf/data/user_files` 映射出来，例如：

```yaml
volumes:
  - ./overleaf_data:/var/lib/overleaf/data/user_files
```

这样宿主机就能直接操作文件，容器内部也能同步。

你希望我帮你写吗。

### 排查场景 1. 这我怎么知道改哪个

- 场景：这我怎么知道改哪个
- 处理要点：
哦，这个情况就比较典型了：ShareLaTeX/Overleaf 容器里 `user_files/` 的文件名不是原始 `.tex` 文件名，而是经过 **内部 ID 重命名** 的，一般形式是：

```
<projectID>_<fileID>
```

比如你现在看到的：

```
684da479b14751b5d82a7a48_684da479b14751b5d82a7a4e
```

*   前半段是项目 ID
*   后半段是文件 ID

所以单纯看文件名，你无法直接对应到某个具体的 `.tex` 文件。

### 解决办法：

1.  **查看文件内容**  
用 `head` 或 `less` 打开文件看内容：
```bash
    head 684da479b14751b5d82a7a48_684da479b14751b5d82a7a4e
```
如果是 `.tex`，开头一般有 `\documentclass`。这样你就能确认是哪一个文档。
2.  **按修改时间排序**  
如果你最近修改了文档，可以：
```bash
    ls -lt
```
最新修改的文件排在前面，更容易找到目标。
3.  **通过容器内 Web 服务映射**  
Overleaf/ShareLaTeX 的数据库里记录了 projectID 和文件名的映射（MongoDB），但直接查看数据库比较麻烦。通常**最简单的方法就是打开项目的 PDF 或 `.tex`，看看内容，再对应文件 ID**。
4.  **建议操作方式**
    *   不想搞 ID 对照数据库的麻烦 → **容器里直接编辑**：
```bash
        vi <文件>
```
    *   或者把整个 `user_files` 映射到宿主机，编辑文件后容器自动读取：
```yaml
        volumes:
          - ./overleaf_data:/var/lib/overleaf/data/user_files
```

总结：

*   文件名是内部 ID，不是原始名字
*   要找目标文件，**看内容** 或 **按时间筛选**
*   最安全方式是 **备份 `user_files` 后再修改**

你想要我写吗。

### 排查场景 2. 我现在遇到问题是4m的图片没办法上传

- 场景：我现在遇到问题是4m的图片没办法上传
- 处理要点：
啊，这个就很好理解了——Overleaf/ShareLaTeX 的 Docker 容器里**上传限制默认比较保守**，通常单个文件不能超过 2~5 MB（具体取决于配置和版本）。你现在 4MB 的图片刚好有点边缘，上传就可能失败。

解决方法有几种：

### 1️⃣ 调整上传限制（推荐）

在 ShareLaTeX/Overleaf CE Docker 容器里，有个配置文件：

```
/etc/sharelatex/settings.coffee
```

或者：

```
/etc/overleaf/settings.coffee
```

找到或添加一行：

```coffee
maxFileSize: 10000000  # 单位 bytes，这里是 10 MB
```

然后重启容器：

```bash
docker restart <container_name>
```

> 注意：有的旧版本可能是 `config/settings.coffee`，或者在 `/var/lib/sharelatex` 里，你需要找一下。

### 2️⃣ 分割图片

如果调整上传限制比较麻烦，你可以在本地把图片压缩或分辨率降低：

```bash
convert large.png -resize 50% smaller.png
```

或者用 JPG、WebP 格式，通常比 PNG 小很多。

### 3️⃣ 手动复制到容器

既然你已经能进入容器，可以直接把图片放到项目文件夹里：

```bash
# 宿主机
docker cp ./big_image.png sharelatex:/var/lib/overleaf/data/user_files/<project_id>_<file_id>
```

然后在 `.tex` 里引用：

```tex
\includegraphics{big_image.png}
```

> 这样就绕过了上传界面大小限制。

### 4️⃣ 使用外部存储

如果图片真的很大（几十 MB），也可以：

*   放到 GitHub、私有服务器或者 CDN
*   `.tex` 里用 `\includegraphics{http://...}` 或 `\includegraphics{./local_path}`

我建议最简单粗暴的就是 **直接修改 `maxFileSize` 配置或者 docker cp 上传**，这样就能直接放大图片。

你想让我帮你写**直接修改容器上传限制的操作步骤**吗。

### 排查场景 3. 我发现不是文件大小的问题，2m的也无法上传

- 场景：我发现不是文件大小的问题，2m的也无法上传
- 处理要点：
啊，这就说明问题不在文件大小，而更可能是 **容器或 Overleaf 自身的上传/请求处理机制**出了问题。根据你的情况，有几个可能原因和解决办法：

### 1️⃣ 容器内 Nginx / Node 上传限制

Overleaf CE 的 Docker 镜像底层用 **Nginx + Node** 来处理上传。默认有几个限制：

*   **Nginx 配置限制**：  
`/etc/nginx/nginx.conf` 或 `/etc/nginx/conf.d/default.conf` 里可能有：
```nginx
    client_max_body_size 2M;
```
这限制了单次 HTTP POST 上传体积。即使你的文件只有 2MB，HTTP 请求头和 multipart 封装也会加点大小，可能超出限制。
*   **Node / Express 上传限制**：  
Overleaf 的 Node 服务也可能在 middleware 里限制：
```coffee
    bodyParser: { limit: '2mb' }
```

**解决方法**：

1.  修改 Nginx 配置：
```nginx
    client_max_body_size 20M;
```
2.  修改 Overleaf 配置（`settings.coffee` 或 `config/settings.coffee`）：
```coffee
    maxFileSize: 20000000  # 20 MB
```
3.  重启容器：
```bash
    docker restart <container_name>
```

### 2️⃣ 文件名或路径问题

有时候上传失败不是大小，是 **文件名或路径**：

*   文件名含中文或空格 → Node 默认可能报错
*   文件名过长 → 容器底层文件系统可能限制

建议先尝试改短英文名：

```bash
myimage.png
```

### 3️⃣ 权限问题

你刚才看到 `user_files/` 全部是 `www-data` 用户，如果容器外上传文件时权限不匹配，也可能导致保存失败。  
容器里直接 `docker cp` 或 `chown www-data:www-data` 可能更稳。

### 4️⃣ 直接绕过上传界面（最稳妥）

既然你可以进入容器，最简单的方法就是：

```bash
docker cp ./big_image.png sharelatex:/var/lib/overleaf/data/user_files/<project_id>_<file_id>
docker exec -it sharelatex chown www-data:www-data /var/lib/overleaf/data/user_files/<project_id>_<file_id>/big_image.png
```

然后在 LaTeX 文件里直接引用：

```tex
\includegraphics{big_image.png}
```

这样完全绕过网页上传限制。

你希望我写吗。

### 主题 4. 换个解决方案，我发现每个图的小标题现在并不剧中，整个latex文档是两栏...

明白了，你现在的问题是：

*   文档是 **两栏**
*   每个子图用 `subfigure`
*   **小标题（caption）不居中**，可能是因为你用了 `\hspace{-0.25\textwidth}` 强制偏移，导致 caption 也跟着偏了

这其实是一个很常见的排版问题。核心思路是：**不要用 `\hspace` 调整图像位置**，而用 `\centering` + `subfigure` 自带的对齐方式。然后用 `\captionsetup` 控制子图标题居中。

下面给你一个示例（适合两栏）：

```tex
\documentclass[twocolumn]{article}
\usepackage{graphicx}
\usepackage{subcaption}  % 使用 subcaption 包
\usepackage{xcolor}

\begin{document}

\begin{figure*}[ht] % figure* 跨两栏，如果只在一栏用 figure
    \centering
    % First row
    \begin{subfigure}[b]{0.45\columnwidth} % 每个子图宽度占一栏宽度的比例
        \centering
        \includegraphics[width=\textwidth]{pic/GDN-1.png}
        \caption{GDN on SWaT}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.45\columnwidth}
        \centering
        \includegraphics[width=\textwidth]{pic/iT-1.png}
        \caption{iTransformer on SWaT}
    \end{subfigure}

    \vspace{1em} % 调整两行之间间距

    \begin{subfigure}[b]{0.45\columnwidth}
        \centering
        \includegraphics[width=\textwidth]{pic/TranAD-1.png}
        \caption{TranAD on SWaT}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.45\columnwidth}
        \centering
        \includegraphics[width=\textwidth]{pic/PGTN-1.png}
        \caption{PGTN on SWaT}
    \end{subfigure}

    \caption{\color{green} Visualization of the time-series outputs of four models on the LIT101 variable from the SWaT dataset. Figure compares the anomaly detection performance of the GDN, iTransformer, TranAD, and our proposed model. In the figure, the red line represents the predicted sequence, the black line the true sequence, the green line the anomaly score, and the red dots indicate the dimensions contributing to the anomaly score.}
    \label{fig:4subfigs}
\end{figure*}

\end{document}
```

 **关键点**：

1.  **去掉 `\hspace{-0.25\textwidth}`**，让 `subfigure` 自己居中
2.  每个 `subfigure` 内部用 `\centering`，保证 caption 在子图下方居中
3.  用 `0.45\columnwidth` 控制两栏的子图宽度，加 `\hfill` 做间距
4.  如果希望跨两栏显示整个 figure，用 `figure*`；单栏则用 `figure`
5.  `\vspace{1em}` 调整上下两行的间距，可根据实际微调

你希望我帮你做吗。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
