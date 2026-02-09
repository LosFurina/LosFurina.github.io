---
title: "JupyterLab 登录认证配置"
description: "记录 JupyterLab 设置密码登录、修改配置文件与启动服务的最小步骤。"
pubDate: "2025-05-21"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Jupyter.md"
sourceVault: "obsidian/note"
slug: "infra/jupyter"
---
在 JupyterLab 中设置登录用户名和密码的步骤如下：

1. **生成配置文件**：
   首先，你需要生成一个 Jupyter 配置文件。如果你还没有配置文件，可以通过以下命令生成：

   ```bash
   jupyter notebook --generate-config
   ```

   这将在你的用户目录下生成一个 `jupyter_notebook_config.py` 文件，通常路径为 `~/.jupyter/jupyter_notebook_config.py`。

2. **设置密码**：
   使用以下命令在命令行中设置 Jupyter 的密码：

   ```bash
   jupyter notebook password
   ```

   输入你希望设置的密码，并再次确认该密码。这个命令会在配置文件中生成加密后的密码。

3. **编辑配置文件**：
   打开生成的 `jupyter_notebook_config.py` 文件，查找并确保以下行被取消注释（去掉前面的 `#`），并且按需修改：

   ```python
   c.NotebookApp.ip = '127.0.0.1'  # 允许连接的IP地址
   c.NotebookApp.open_browser = False  # 不自动打开浏览器
   c.NotebookApp.port = 8888  # 端口号
   c.NotebookApp.password = 'sha1:your_hashed_password_here'  # 使用生成的哈希密码
   c.NotebookApp.allow_origin = '*'  # 可以设置允许的源
   ```

   其中，`your_hashed_password_here` 是通过之前的 `jupyter notebook password` 命令生成的加密后的密码字符串。

4. **启动 JupyterLab**：
   现在你可以启动 JupyterLab 了，运行以下命令：

   ```bash
   jupyter lab
   ```

   当你在浏览器中访问页面时，它会要求你输入用户名和密码。

以上步骤可以帮助你在 JupyterLab 中配置基本的身份验证，确保未授权的用户无法访问你的环境。
