---
title: "Linux 命令入门：帮助文档与上手方法"
description: "介绍通过 man 等方式快速理解 Linux 命令参数，降低日常运维操作门槛。"
pubDate: "2025-11-21"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/从0开始搭建你的服务/1. 预备知识.md"
sourceVault: "obsidian/note"
slug: "infra/1-怎么使用linux命令"
---
## 1. 怎么使用Linux命令

众所周知，Linux的命令是有很多的，不可能有人能完全记住所有命令，那有什么推荐的办法使用命令来操作`Linux/Unix`系统呢？

## 1.1. `man`查看帮助文档

在Linux下内置了`man`命令来快速查看帮助文档，例如我要查看`ls`有什么可用参数：
```bash
man ls
```
我们就可以在终端看到相关帮助说明。

### 1.1.1. 对帮助文档的解释

以`ls`为例：
```bash
Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).
Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

Mandatory arguments to long options are mandatory for short options too.
  -a, --all                  do not ignore entries starting with .
  -A, --almost-all           do not list implied . and ..
      --author               with -l, print the author of each file
  -b, --escape               print C-style escapes for nongraphic characters
      --block-size=SIZE      with -l, scale sizes by SIZE when printing them;
                             e.g., '--block-size=M'; see SIZE format below

  -B, --ignore-backups       do not list implied entries ending with ~
  -c                         with -lt: sort by, and show, ctime (time of last
                             change of file status information);
                             with -l: show ctime and sort by name;
                             otherwise: sort by ctime, newest first

  -C                         list entries by columns
      --color[=WHEN]         color the output WHEN; more info below
  ···
  -l                         use a long listing format
```

上面是一部分帮助文档，在第一行我们可以看到：

```
Usage: ls [OPTION] ... [FILE] ...
```

其中`OPTION`是可选选项，具体指代下面列出的带有`-`或`--`的`key`，例如：

```bash
ls -a # 表示列出所有文件，包括隐藏文件，也就是 do not ignore entries starting with .
```

可以附带多个`OPTION`，例如：

```bash
la -a -l # 列出全部文件并使用`long listing`格式
```

`[FILE]`是将要被传入`ls`命令的参数，这里指将要被展示的文件或目录。

如果传入一个文件，但是不携带其他参数，例如：

```bash
ls text.txt
```

这个命令会直接打印`text.txt`，但这并不毫无意义，因为我们附带参数的`OPTION`，例如：

```bash
ls --author -l text.txt
```

如果传入的是目录，那么`ls`会展示该目录下所有项，这个‘项“包括文件或目录，但并不会递归展开子目录。

> 注意`OPTION`一定要写在`params`的前面。

## 1.2. `--help` or `-h`

绝大多数命令都会内置`--help`或`-h`参数，其目的就是展示该命令的使用：
```bash
ls --help
```
此时我们看到的内容应该与`man`命令查看的文档一致或略有区别。

## 1.3. AI

随着AI CLI的发展，上述两种方法已经显得很古老了，但是对于Linux操作，我认为掌握上述两种方法尤为重要，接下来才使用AI辅助。

### 1.3.1. VS Code Copilot

目前VS Code已经内置了Copilot来辅助开发，只需要在控制台按下`ctrl+k`即可召唤Copilot。

### 1.3.2. Gemini CLI

安装`Gemini CLI`即可 [click](https://geminicli.com/)
