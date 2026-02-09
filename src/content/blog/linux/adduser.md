---
title: User Management in Linux and macOS
description: "A command-oriented guide to creating users and managing account defaults on Linux and macOS."
pubDate: 2026-01-23
---

# Linux 与 MacOS 用户管理命令详解

# Introduction

在 Linux 系统中，使用 `useradd` 命令可以添加新用户。以下是一些常用的 `useradd` 命令的用法和示例。

## 基本语法

```bash
useradd [选项] 用户名
```

## 常用选项

- `-m`：创建用户的主目录（通常在 `/home/username`）。
- `-s`：指定用户的默认 shell（例如 `/bin/bash`）。
- `-G`：将用户添加到一个或多个附加组（用逗号分隔）。
- `-d`：指定用户的主目录。
- `-e`：设置用户的过期日期。
- `-r`：创建一个系统用户（通常没有主目录）。

## 示例

### 创建一个基本用户  
创建一个名为 `newuser` 的普通用户：

```bash
sudo useradd newuser
```

### 创建一个用户并指定主目录  
创建名为 `newuser` 的用户并创建 `/home/newuser` 作为主目录：

```bash
sudo useradd -m newuser
```

### 创建一个用户并指定默认 shell  
创建名为 `newuser` 的用户，主目录为 `/home/newuser`，默认 shell 为 `/bin/bash`：

```bash
sudo useradd -m -s /bin/bash newuser
```

### 创建用户并将其添加到附加组中  
创建名为 `newuser` 的用户，并将其添加到 `sudo` 和 `docker` 组中：

```bash
sudo useradd -m -G sudo,docker newuser
```

### 创建用户并指定过期日期  
创建名为 `newuser` 的用户，且在 2024 年 12 月 31 日过期：

```bash
sudo useradd -m -e 2024-12-31 newuser
```

## 设置用户密码

使用 `passwd` 命令设置用户的密码：

```bash
sudo passwd newuser
```

## 其他相关命令

- **查看用户信息**：`id newuser` 可以查看新用户的 UID 和 GID 以及所在的组。
- **删除用户**：使用 `userdel` 命令可以删除用户：

  ```bash
  sudo userdel newuser
  ```

- **删除用户及其主目录**：

  ```bash
  sudo userdel -r newuser
  ```

## 注意事项

- 使用 `useradd` 命令时通常需要 `sudo` 权限。
- 用户名应符合特定的规则，通常不允许使用空格等特殊字符。

---

# 更改用户默认 shell

要使用 root 用户给 `firstsnow` 用户分配默认 shell 为 `bash`，可以按照以下步骤进行操作：

## 步骤

### 1. 以 root 用户身份登录  
如果你已经是 root 用户，可以直接输入命令；如果不是，可以使用 `sudo` 切换到 root 用户：

```bash
sudo -i
```

或者使用 `su` 命令切换到 root 用户（需要 root 密码）：

```bash
su -
```

### 2. 查看已安装的 shell  
确保 `bash` 在系统中安装并且列在 `/etc/shells` 中：

```bash
cat /etc/shells
```

确保输出包含 `/bin/bash` 或 `/usr/bin/bash`。

### 3. 更改用户默认 shell  
使用以下命令将 `firstsnow` 用户的默认 shell 更改为 `bash`：

```bash
chsh -s /bin/bash firstsnow
```

或者：

```bash
chsh -s /usr/bin/bash firstsnow
```

### 4. 验证更改  
验证 `firstsnow` 用户的默认 shell 是否已更改：

```bash
grep firstsnow /etc/passwd
```

输出示例：

```
firstsnow:x:1001:1001::/home/firstsnow:/bin/bash
```

## 注意事项

- 用户在下次登录时会使用新的默认 shell。
- 如果在执行 `chsh` 时遇到权限问题，请确保以 root 身份执行命令。

---

# 在 MacOS 中创建新用户

在 MacOS 中，创建新用户的操作与 Linux 略有不同，通常通过图形界面完成，但也可以使用命令行工具。

## 使用图形界面创建用户

1. 打开 **系统设置** > **用户与群组**。
2. 点击左下角的锁图标并输入管理员密码。
3. 点击 **+** 按钮添加新用户。
4. 填写用户名、账户类型（管理员或标准用户）等信息。
5. 点击 **创建用户**。

## 使用命令行创建用户

### 创建用户

使用 `sysadminctl` 命令创建新用户：

```bash
sudo sysadminctl -addUser newuser -fullName "New User" -password "password"
```

### 设置用户主目录

默认情况下，MacOS 会自动为用户创建主目录。如果需要手动指定主目录路径，可以使用以下命令：

```bash
sudo createhomedir -c -u newuser
```

### 更改用户默认 shell

使用 `chsh` 命令更改用户的默认 shell：

```bash
sudo chsh -s /bin/bash newuser
```

### 删除用户

使用以下命令删除用户及其主目录：

```bash
sudo sysadminctl -deleteUser newuser -secure
```

---

# Linux 与 MacOS 用户管理对比表

| 功能                  | Linux 命令示例                          | MacOS 命令示例                              |
|-----------------------|-----------------------------------------|--------------------------------------------|
| 创建用户              | `sudo useradd newuser`                 | `sudo sysadminctl -addUser newuser -password "password"` |
| 创建用户主目录        | `sudo useradd -m newuser`              | 自动创建或使用 `sudo createhomedir -c -u newuser` |
| 指定默认 shell        | `sudo useradd -m -s /bin/bash newuser` | `sudo chsh -s /bin/bash newuser`           |
| 添加到附加组          | `sudo useradd -m -G sudo,docker newuser` | 不支持直接通过命令行添加多个组             |
| 删除用户              | `sudo userdel newuser`                 | `sudo sysadminctl -deleteUser newuser`     |
| 删除用户及主目录      | `sudo userdel -r newuser`              | `sudo sysadminctl -deleteUser newuser -secure` |
