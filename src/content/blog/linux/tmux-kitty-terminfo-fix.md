---
title: 'tmux 报错 "missing or unsuitable terminal: xterm-kitty" 解决方法'
description: "解决在远端服务器使用 tmux 时因 kitty 终端 terminfo 缺失导致的报错问题，并提供 tmux 常用命令备忘。"
pubDate: 2026-05-19
---

# CodeV Pod 中 tmux 报错 "missing or unsuitable terminal: xterm-kitty" 解决

## 问题现象

在 CodeV 开发 Pod 终端中执行 `tmux ls` 等 tmux 命令时报错：

```
missing or unsuitable terminal: xterm-kitty
```

## 原因

1. 本地使用 kitty 终端，SSH 连接时会将 `TERM=xterm-kitty` 传到远端 Pod
2. tmux 需要查找对应的 terminfo 描述文件来了解终端支持的能力（光标移动、颜色、按键序列等）
3. Pod 系统目录 `/usr/share/terminfo/x/` 下没有 `xterm-kitty` 文件
4. kitty SSH 连接时会自动把 terminfo 安装到 `~/.terminfo/x/xterm-kitty`，但 tmux 默认不搜索这个路径

## 解决方案

将 terminfo 文件复制到系统目录（一劳永逸，不依赖环境变量）：

```bash
cp /root/.terminfo/x/xterm-kitty /usr/share/terminfo/x/xterm-kitty
```

### 备选方案

如果 `~/.terminfo` 下没有该文件，可以：

1. 在本地 kitty 终端执行 `kitten ssh --copy-terminfo user@host` 生成
2. 或者直接绕开问题：`export TERM=xterm-256color`

## terminfo 是什么

`/usr/share/terminfo/` 下按首字母分目录存放的终端能力描述文件，告诉程序：

- 如何移动光标、清屏
- 支持多少种颜色
- 特殊键（Home/End/F1）发什么字符序列
- 如何设置粗体、下划线等样式

程序通过 `$TERM` 变量的值去查找对应文件。找不到就报错。

## tmux 常用命令备忘

```bash
# 创建后台会话并运行命令
tmux new -d -s <名字> '<命令>'

# 列出所有会话
tmux ls

# 进入会话查看输出
tmux attach -t <名字>

# 在会话内退出但不杀进程
Ctrl+B, D

# 杀掉会话
tmux kill-session -t <名字>
```

参数说明：
- `-d` (detached): 创建后不自动进入会话
- `-s <name>` (session): 指定会话名称
