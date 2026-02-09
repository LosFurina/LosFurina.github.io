---
title: "useradd 与 adduser 区别"
description: "对比 Linux 中 `useradd` 与 `adduser` 的定位、参数风格与实际使用场景。"
pubDate: "2025-05-23"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/LinuxCommand/useradd.md"
sourceVault: "obsidian/note"
slug: "infra/useradd"
---
是的，`useradd` 和 `adduser` 是两个不同的命令，虽然它们都用于添加新用户，但之间有一些差异，主要体现在它们的使用方式和交互性上。

### 1. `useradd`

- **底层命令**：`useradd` 是一个低级命令，直接与系统用户数据库进行交互。
- **命令行选项**：它通常需要更多的参数和选项来设置用户的属性（如主目录、默认 shell、用户组等）。
- **不交互**：使用 `useradd` 时，通常不会提示用户输入任何信息，例如密码等。这意味着你需要手动设置所有需要的选项。
- **示例**：

  ```bash
  sudo useradd -m -s /bin/bash newuser
  ```

### 2. `adduser`

- **高层脚本**：`adduser` 通常是 `useradd` 的一个前端脚本。它是一些 Linux 发行版的默认用户创建工具（例如 Debian 和 Ubuntu）。
- **交互性**：`adduser` 是一个交互式命令，创建用户时会提示用户输入更多信息，通常也会在创建成功后立即提示设置密码。
- **默认设置**：它会自动处理一些默认设置，例如创建主目录、设置用户组等，减少了用户的输入工作。
- **示例**：

  ```bash
  sudo adduser newuser
  ```

  在执行上面的命令后，用户将会被提示输入密码以及其他信息。

### 总结

- **使用方式**：`useradd` 主要适合脚本和自动化，而 `adduser` 更适合人类用户交互。
- **可用性**：并不是所有 Linux 发行版都提供 `adduser`。一些系统可能只提供 `useradd`，这通常取决于具体的发行版。

在大多数情况下，除非你需要脚本自动化用户创建，建议使用 `adduser` 进行用户管理，因为它更为友好和易于使用。如果你需要更详细的用户配置，可能需要结合使用两个命令。
