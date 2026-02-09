---
title: "SSH-Keygen 参数详解"
description: "SSH-Keygen 参数详解 是一个用于生成、管理和转换 SSH 密钥的工具。下面对其主要参数和常见用法进行全面介绍。"
pubDate: "2025-11-21"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/从0开始搭建你的服务/SSH 公私钥.md"
sourceVault: "obsidian/note"
slug: "infra/ssh-keygen-参数详解"
---
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
ssh-keygen -t ed25519 -C "your_email@example.com"
  ```

## SSH-Keygen 参数详解

`ssh-keygen` 是一个用于生成、管理和转换 SSH 密钥的工具。下面对其主要参数和常见用法进行全面介绍。

## 常用参数

### 1. `-t type`

指定生成密钥的类型：

- **rsa**：生成 RSA 密钥（默认 2048 位）。
    
- **dsa**：生成 DSA 密钥（已不推荐使用）。
    
- **ecdsa**：生成 ECDSA 密钥，安全性和性能更高。
    
- **ed25519**：最推荐的现代加密算法，安全、快速。
    
- **rsa1**：SSH 协议 1 的 RSA 密钥（已弃用，不建议使用）。
    

### 2. `-b bits`

指定密钥长度：

- RSA 默认 2048 位，可提升至 3072 或 4096 以提高安全性。
    
- Ed25519 不支持设定位数。
    

### 3. `-C comment`

为密钥添加注释，如邮箱或描述信息，便于区分密钥来源。

### 4. `-f filename`

指定输出文件路径和名字，默认位于 `~/.ssh/id_<type>`（例如 `id_rsa`）。

### 5. `-N passphrase`

为私钥设置密码短语。建议设置以提升安全性，留空表示无密码。

## 其他重要参数

### 1. `-q`

静默模式，不输出多余信息。

### 2. `-e`

将 OpenSSH 格式密钥转换为 RFC 4716 格式。

### 3. `-m key_format`

指定密钥格式：

- **PEM**：传统格式。
    
- **RFC4716**：标准化公钥格式。
    

### 4. `-p`

修改已有私钥的密码短语：

```bash
ssh-keygen -p -f ~/.ssh/id_rsa
```

### 5. `-y`

从私钥提取公钥。

### 6. `-l`

显示密钥指纹（公钥哈希）：

```bash
ssh-keygen -l -f ~/.ssh/id_rsa.pub
```

### 7. `-B`

以 Base64 形式展示指纹。

### 8. `-r hostname`

将公钥转换为 SSHFP 格式，用于 DNS 记录。

### 9. `-R hostname`

从 `known_hosts` 中删除对应主机条目。

### 10. `-K`（macOS）

将密钥密码短语存入 Keychain。

## 高级参数

### 1. `-o`

使用新版 OpenSSH 私钥格式（更安全，默认开启）。

### 2. `-O option`

为密钥设置附加选项，多用于 CA 签名：

- `no-agent-forwarding`
    
- `no-pty`
    
- `source-address=<ip>`
    

### 3. `-A`

自动生成所有支持的密钥类型。

### 4. `-L`

显示私钥文件中的公钥部分。

### 5. `-a rounds`

指定密钥派生函数（KDF）的迭代次数。  
数值越大，抗暴力破解能力越强，但生成速度更慢。

### 6. `-x` 和 `-X`

在 RFC 4716 和 PEM 格式之间转换。

### 7. `-M memory`

指定 Ed25519 密钥生成时使用的内存。

### 8. `-z serial_number`

为密钥设定序列号（常用于证书）。

### 9. `-g`

使用 FIPS 模式生成密钥（部分系统支持）。

## 常见用法示例

### 生成 RSA 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "user@example.com" -f ~/.ssh/id_rsa
```

### 修改私钥密码

```bash
ssh-keygen -p -f ~/.ssh/id_rsa
```

### 查看公钥指纹

```bash
ssh-keygen -l -f ~/.ssh/id_rsa.pub
```

### 从私钥生成公钥

```bash
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub
```

### 推荐：生成 Ed25519 密钥

```bash
ssh-keygen -t ed25519 -C "user@example.com" -f ~/.ssh/id_ed25519
```

## 将公钥复制到远程服务器

### 1. 创建 `~/.ssh/authorized_keys`

如果文件不存在，可手动创建：

```bash
mkdir -p ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 2. 将本地 `.pub` 内容写入远程 `authorized_keys`

可直接复制，也可使用：

```bash
ssh-copy-id user@hostname
```
