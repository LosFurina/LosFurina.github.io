---
title: "Let's Encrypt 泛域名证书"
description: "替换为你使用的 DNS 提供商插件。例如，如果你使用 Cloudflare，则是。Certbot 提供了许多不同的插件，具体取决于你使用的..."
pubDate: "2025-05-21"
updatedDate: "2026-02-13"
category: "security"
tags: ["security"]
sourcePath: "src/content/blog/ChatGPT-Let's Encrypt 泛域名证书.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“怎么使用letsencrypt申请泛域名证书”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. 怎么使用letsencrypt申请泛域名证书

要使用 Let's Encrypt 申请泛域名证书，你可以按照以下步骤操作：

### 1\. 安装 Certbot

Certbot 是 Let's Encrypt 推荐的工具，能够自动化申请和续期证书。首先，确保你已经安装了 Certbot。不同的操作系统安装方法有所不同，下面是一些常见的安装方法。

#### 在 Ubuntu 上安装 Certbot:

```bash
sudo apt update
sudo apt install certbot
```

#### 在 CentOS/RHEL 上安装 Certbot:

```bash
sudo yum install epel-release
sudo yum install certbot
```

### 2\. 使用 DNS-01 持有权验证方式

Let's Encrypt 目前不直接支持泛域名证书的 HTTP-01 持有权验证方式。因此，你必须使用 DNS-01 持有权验证方式来证明你对该域名的控制权。DNS-01 验证通过修改 DNS 记录来完成。

你需要为你的域名提供一个 `_acme-challenge` 的 DNS TXT 记录。

#### 申请泛域名证书的命令：

```bash
sudo certbot certonly --dns-<dns_provider> -d "*.example.com" -d "example.com"
```

*   `--dns-<dns_provider>`：替换为你使用的 DNS 提供商插件。例如，如果你使用 Cloudflare，则是 `--dns-cloudflare`。Certbot 提供了许多不同的插件，具体取决于你使用的 DNS 服务商。
*   `-d "*.example.com"`：指定你要申请的泛域名证书，这里是 `*.example.com`，代表所有 `example.com` 子域名。
*   `-d "example.com"`：还包括根域名 `example.com`。

### 3\. 配置 DNS 插件

Certbot 支持多种 DNS 插件，允许你自动修改 DNS 记录来进行验证。具体的配置方法会根据你使用的 DNS 提供商而不同。例如，对于 Cloudflare，你需要配置 API 密钥来自动创建 DNS 记录。

#### 以 Cloudflare 为例：

1.  获取 Cloudflare 的 API 密钥。
2.  创建一个配置文件，例如 `~/.cloudflare.cfg`，并写入以下内容：
```ini
    dns_cloudflare_email = YOUR_CLOUDFLARE_EMAIL
    dns_cloudflare_api_key = YOUR_CLOUDFLARE_API_KEY
```
3.  运行 Certbot 命令时，指定使用 Cloudflare 插件：
```bash
    sudo certbot certonly --dns-cloudflare -d "*.example.com" -d "example.com"
```

### 4\. 完成 DNS 验证

Certbot 会要求你创建一个 DNS TXT 记录，类似于以下内容：

```
_acme-challenge.example.com. 3600 IN TXT "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

根据 DNS 提供商的不同，你需要登录到你的 DNS 管理界面，添加该 TXT 记录，然后等待 DNS 传播生效。

### 5\. 完成证书申请

完成 DNS 记录验证后，Certbot 会验证 DNS 记录并为你生成证书。你可以在以下目录找到证书和密钥：

*   证书：`/etc/letsencrypt/live/example.com/fullchain.pem`
*   私钥：`/etc/letsencrypt/live/example.com/privkey.pem`

### 6\. 配置 Web 服务器

将证书和私钥配置到你的 Web 服务器（例如 Nginx 或 Apache）中，使其支持 HTTPS。

#### 以 Nginx 为例：

在 Nginx 配置文件中，你可以像这样配置 SSL：

```nginx
server {
    listen 443 ssl;
    server_name example.com *.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # 其他配置...
}
```

### 7\. 设置自动续期

Let's Encrypt 证书的有效期是 90 天，因此你需要设置自动续期。Certbot 默认会创建一个定时任务（cron job）来自动续期证书。你可以通过以下命令测试自动续期：

```bash
sudo certbot renew --dry-run
```

如果一切正常，你的证书将自动续期。

这些步骤可以帮助你使用 Let's Encrypt 获取和配置泛域名证书。记得根据你的具体 DNS 提供商来选择正确的插件，并配置相应的 API 密钥。

---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
