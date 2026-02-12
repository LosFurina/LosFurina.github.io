---
title: "WireGuard Windows Linux macOS 安装"
description: "获取公钥： 窗口上方会自动生成该设备的 Public Key，请将其记录下来并填回 Linux 服务器配置中的 部分。"
pubDate: "2026-02-12"
updatedDate: "2026-02-12"
category: "network"
tags: ["network"]
sourcePath: "src/content/blog/Gemini-WireGuard Windows Linux macOS 安装.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文基于实际问题整理：wiregard怎么安装，我要连通windows，linux，macos。

## 核心结论

- 获取公钥： 窗口上方会自动生成该设备的 Public Key，请将其记录下来并填回 Linux 服务器配置中的 部分。
- 客户端启动： 在 Windows/macOS 客户端点击“连接”或“激活”。
- 防火墙开放端口： 确保你的 Linux 服务器防火墙（如 ufw 或云服务商的安全组）已开放 UDP 51820 端口。
- Windows 连通性： 连接后，试着在命令行。如果通了，说明隧道建立成功。
- 互联互通： 因为我们在 Linux 开启了 的转发规则，Windows (10.0.0.2) 现在也可以直接访问 macOS (10.0....

## 详细说明

### 实现思路 1

你只需要把 A 的公钥填到 B 里，把 B 的公钥填到 A 里，隧道就打通了

1\. 在 Linux 上安装与配置 (服务端)

### 实现思路 2

WireGuard 在 Linux 上既可以是服务端，也可以是客户端——这正是它的强大之处

以下是 Linux 客户端 的快速接入步骤

### 实现思路 3

在 WireGuard 的世界里，没有绝对的“服务端”和“客户端”，只有 Peer（对等节点）

既然你已经准备好了，我们直接进入 Linux 互联 的实战阶段

## 操作步骤与命令示例

### 示例 1

```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

### 示例 2

```bash
[Interface]
PrivateKey = <这里填你刚才生成的 Linux 私钥>
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
# 预留给 Windows 的配置
[Peer]
PublicKey = <稍后填入 Windows 的公钥>
AllowedIPs = 10.0.0.2/32
# 预留给 macOS 的配置
[Peer]
PublicKey = <稍后填入 macOS 的公钥>
AllowedIPs = 10.0.0.3/32
```

### 示例 3

```bash
[Interface]
PrivateKey = <自动生成的私钥>
Address = 10.0.0.2/24
DNS = 1.1.1.1
[Peer]
PublicKey = <填入 Linux 服务器的公钥>
Endpoint = <服务器公网IP>:51820
AllowedIPs = 10.0.0.0/24  # 只代理隧道内流量
# 如果想全量代理，改为 0.0.0.0/0
PersistentKeepalive = 25
```

### 示例 4

```bash
sudo wg-quick up wg0
    # 设置开机自启
    sudo systemctl enable wg-quick@wg0
```

### 执行顺序建议

1. 检查网络拓扑、地址分配和路由路径。
2. 逐层验证 DNS、端口与协议握手状态。
3. 根据日志和抓包结果修正配置。

## 常见问题与排查

- **问题：** allow ip只要大于24就行  **排查：** 在 WireGuard 中， 的核心规则是： 你允许这个 Peer（对等节点）使用哪些 IP 地址；2\. 什么时候可以用 甚至更小
- **问题：** pacman可以安装wg吗  **排查：** 可以， Arch Linux 安装 WireGuard 非常简单；由于你之前提到了 和，如果你其中一台机器跑的是 Arch Linux，直接使用 即可

## 关键问答摘录

> **Q:** allow ip只要大于24就行
>
> **A:** 在 WireGuard 中， 的核心规则是： 你允许这个 Peer（对等节点）使用哪些 IP 地址；2\. 什么时候可以用 甚至更小

> **Q:** pacman可以安装wg吗
>
> **A:** 可以， Arch Linux 安装 WireGuard 非常简单；由于你之前提到了 和，如果你其中一台机器跑的是 Arch Linux，直接使用 即可

## 总结

获取公钥： 窗口上方会自动生成该设备的 Public Key，请将其记录下来并填回 Linux 服务器配置中的 部分。

- 原始对话来源：https://gemini.google.com/app/fbb862d8e809170b
