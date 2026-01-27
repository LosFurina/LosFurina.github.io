---
title: How to manage SSH key pair
description: "Auto-generated description for How to manage SSH key pair"
pubDate: 2026-01-23
---

# 1. Generate SSH key

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
ssh-keygen -t ed25519 -C "your_email@example.com"
```

ssh-keygen: 

# SSH-Keygen 参数详解
`ssh-keygen` 是一个生成、管理和转换 SSH 密钥的工具。以下是其主要参数的详细讲解：

---

## 常用参数

1. `-t type`  
 指定生成密钥的类型：
 - `rsa`：生成 RSA 密钥（默认 2048 位）。
 - `dsa`：生成 DSA 密钥（已不推荐使用）。
 - `ecdsa`：生成 ECDSA 密钥（推荐用于更高安全性和性能）。
 - `ed25519`：生成 Ed25519 密钥（最推荐，现代加密方法，性能好且安全）。
 - `rsa1`：生成 SSH 协议 1 的 RSA 密钥（极不推荐，已弃用）。

2. `-b bits`  
 指定密钥的位数：
 - RSA 密钥默认 2048 位，建议使用 3072 或 4096 位以提高安全性。
 - Ed25519 不支持自定义位数。

3. `-C comment`  
 添加注释到密钥中，用于区分不同的密钥：
 - 常用邮箱或描述性信息，例如 `user@example.com`。

4. `-f filename`  
 指定输出文件的路径和文件名：
 - 默认路径为 `~/.ssh/id_<type>`（如 `id_rsa`）。
5. `-N passphrase`  
 为密钥设置密码短语：
 - 建议设置以保护私钥安全，留空表示无密码。

---

## 其他重要参数

6. `-q`  
 静默模式，不输出多余信息。
7. `-e`  
 将 OpenSSH 格式的私钥或公钥转换为 RFC 4716 格式（适用于其他 SSH 工具）。
8. `-m key_format`  
 指定输出密钥的格式：
 - `PEM`：传统 PEM 格式（较老）。
 - `RFC4716`：标准化的 SSH 公钥格式。
9. `-p`  
 修改现有私钥的密码短语：
 ``bash
 ssh-keygen -p -f ~/.ssh/id_rsa
 ``
10. `-y`  
  从私钥生成公钥。
11. `-l`  
  显示公钥或私钥的指纹（指纹是公钥的哈希值）：
  ``bash
  ssh-keygen -l -f ~/.ssh/id_rsa.pub
  ``
12. `-B`  
  以 Base64 形式显示密钥指纹。
13. `-r hostname`  
  将公钥转换为 SSHFP 记录格式，用于 DNS 中的 SSH 主机验证。
14. `-R hostname`  
  从 `~/.ssh/known_hosts` 文件中删除指定主机的所有条目。
15. `-K`  
  在 macOS 上使用 Keychain 存储密钥密码短语。
---

## 高级参数

16. `-o`  
  使用新版的 OpenSSH 格式生成私钥（默认启用）。新版格式更安全，支持更好的加密。
17. `-O option`  
  设置密钥的附加选项（仅限 CA 签名相关操作）。  
  示例选项：
  - `no-agent-forwarding`：禁止代理转发。
  - `no-pty`：禁止 TTY 分配。
  - `source-address=<ip>`：限制可使用密钥的 IP 地址。
18. `-A`  
  自动生成一组所有支持的密钥类型。
19. `-L`  
  显示私钥文件中的公钥部分。
20. `-a rounds`  
  指定密钥派生函数（KDF）使用的迭代次数：
  - 默认值为 16，值越大，抗暴力破解能力越强，但生成速度会变慢。
21. `-x` 和 `-X`  
  在 RFC 4716 和 PEM 格式之间转换密钥。
22. `-M memory`  
  指定密钥生成所用的内存大小（仅适用于 Ed25519）。
23. `-z serial_number`  
  为密钥指定序列号（通常用于证书生成）。
24. `-g`  
  使用 FIPS 模式生成密钥（仅部分系统支持）。
---

## 常见用例示例

### 生成 RSA 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "user@example.com" -f ~/.ssh/id_rsa

```

### 修改私钥密码

```bash
ssh-keygen -p -f ~/.ssh/id_rsa

```

### 查看公钥的指纹

```bash
ssh-keygen -l -f ~/.ssh/id_rsa.pub

```

### 将私钥转换为公钥

```bash
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

```

### 生成 Ed25519 密钥（推荐）

```bash
ssh-keygen -t ed25519 -C "user@example.com" -f ~/.ssh/id_ed25519

```

---

## 2. Paste your public key to your remote server

### Create `~/.ssh/authorized_keys`

### Paste the content of your .pub to authorized_keys

## 3. 总结
`ssh-keygen` 参数非常丰富，可以满足不同的密钥管理需求。在生产环境中，建议使用现代加密算法（如 Ed25519），并为私钥设置密码短语以增加安全性。

