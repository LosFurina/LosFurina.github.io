---
title: "WireGuard Windows Linux macOS 安装"
description: "获取公钥： 窗口上方会自动生成该设备的 Public Key，请将其记录下来并填回 Linux 服务器配置中的 部分。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "network"
tags: ["network"]
sourcePath: "src/content/blog/Gemini-WireGuard Windows Linux macOS 安装.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“wiregard怎么安装，我要连通windows，linux，macos”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. wiregard怎么安装，我要连通windows，linux，macos

搭建 WireGuard 就像是建立一个专属的虚拟“隧道”。它的核心逻辑是：**每一台设备（节点）都有自己的私钥（Secret Key）和公钥（Public Key）**。你只需要把 A 的公钥填到 B 里，把 B 的公钥填到 A 里，隧道就打通了。

这里以一套典型的方案为例：将 **Linux** 作为服务端（中转站），**Windows** 和 **macOS** 作为客户端。

1\. 在 Linux 上安装与配置 (服务端)

大多数现代 Linux 内核已集成 WireGuard。以 Ubuntu/Debian 为例：

*   **安装：** `sudo apt update && sudo apt install wireguard`
*   **生成密钥对：**
```
    wg genkey | tee privatekey | wg pubkey > publickey
```
*   **创建配置文件：** `sudo nano /etc/wireguard/wg0.conf`

**写入以下配置：**

```
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

2\. 在 Windows 和 macOS 上安装 (客户端)

这两者的操作逻辑几乎完全一致：

1.  **下载：** 访问 
[WireGuard 官网](https://www.wireguard.com/install/)
下载对应安装包。
2.  **生成配置：** 打开软件，点击“新建隧道” -\> “新建空白隧道”。
3.  **获取公钥：** 窗口上方会自动生成该设备的 **Public Key**，请将其记录下来并填回 Linux 服务器配置中的 `[Peer]` 部分。
4.  **编辑客户端配置：**

**Windows (10.0.0.2):**

```
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

**macOS (10.0.0.3):** 配置同上，只需将 `Address` 改为 `10.0.0.3/24`。

3\. 启动与连通

1.  **服务器端启动：**
```
    sudo wg-quick up wg0
    # 设置开机自启
    sudo systemctl enable wg-quick@wg0
```
2.  **客户端启动：** 在 Windows/macOS 客户端点击“连接”或“激活”。
3.  **防火墙开放端口：** 确保你的 Linux 服务器防火墙（如 ufw 或云服务商的安全组）已开放 **UDP 51820** 端口。

进阶小贴士

*   **Windows 连通性：** 连接后，试着在命令行 `ping 10.0.0.1`。如果通了，说明隧道建立成功。
*   **互联互通：** 因为我们在 Linux 开启了 `PostUp` 的转发规则，Windows (10.0.0.2) 现在也可以直接访问 macOS (10.0.0.3)。

如果你觉得手动改配置文件太麻烦，**需要我为你推荐一些带图形化管理界面的 WireGuard 辅助工具（如 Subspace 或 wg-easy）吗。**

### 主题 2. linux互联呢

既然你已经有了 Linux 服务器作为中转，让另一台 Linux 客户端接入其实和 Windows/macOS 的逻辑是一样的。WireGuard 在 Linux 上既可以是服务端，也可以是客户端——这正是它的强大之处。

以下是 **Linux 客户端** 的快速接入步骤：

### 1\. 安装 WireGuard

在你的 Linux 客户端机器上安装工具包：

*   **Ubuntu/Debian:** `sudo apt install wireguard`
*   **CentOS/RHEL:** `sudo dnf install wireguard-tools`
*   **Arch:** `sudo pacman -S wireguard-tools`

### 2\. 生成客户端密钥

在客户端机器上运行：

```
wg genkey | tee client_privatekey | wg pubkey > client_publickey
```

记下生成的这两个密钥。

### 3\. 创建客户端配置文件

创建文件 `/etc/wireguard/wg0.conf`：

```
[Interface]
PrivateKey = <客户端刚才生成的私钥>
Address = 10.0.0.4/24  # 给这台 Linux 分配一个新的 IP
DNS = 1.1.1.1

[Peer]
PublicKey = <Linux 服务端的公钥>
Endpoint = <服务端公网IP>:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25
```

### 4\. 在“服务端”添加该客户端

回到你的 **中转服务器**，将这个新 Linux 客户端的公钥添加进去：

```
# 直接通过命令行添加，无需重启
sudo wg set wg0 peer <客户端的公钥> allowed-ips 10.0.0.4/32
```

_注：为了持久化，建议也手动把这段 `[Peer]` 信息写进服务端的 `/etc/wireguard/wg0.conf` 里。_

### 5\. 启动连接

在客户端机器上运行：

```
# 启动
sudo wg-quick up wg0

# 检查状态
sudo wg show
```

### 常见问题与调试

*   **路由冲突：** 确保你设置的 `Address` (如 10.0.0.x) 不会和你本地局域网的网段冲突。
*   **内网穿透：** 如果你的 Linux 客户端在公司或家里内网，`PersistentKeepalive = 25` 非常重要，它能防止防火墙因为长时间没流量而关闭 UDP 隧道。
*   **多台 Linux 互联：** 如果你想让两台 Linux 不经过中转服务器直接对连（点对点），前提是其中一台必须有公网 IP 或者你做了端口映射。

**你是想让这些 Linux 机器仅仅互相通信，还是希望其中一台作为出口，让其他机器通过它实现“科学”上网。**

### 主题 3. wg

既然你已经准备好了，我们直接进入 **Linux 互联** 的实战阶段。在 WireGuard 的世界里，没有绝对的“服务端”和“客户端”，只有 **Peer（对等节点）**。

如果你想让两台 Linux 机器互联，最关键的是要理解它们如何交换公钥。

### 主题 4. wg怎么重启一下

在 WireGuard (wg) 中，最标准的重启方式是使用 `wg-quick` 工具。它会自动处理接口的关闭、配置加载和重新启动。

根据你的操作习惯，有以下几种常用方法：

### 1\. 使用 `wg-quick` (最推荐)

这是最直接的方法，适用于你手动管理的配置文件（如 `/etc/wireguard/wg0.conf`）。

```
# 关闭接口
sudo wg-quick down wg0

# 启动接口
sudo wg-quick up wg0
```

_注：`wg0` 是你的配置文件名。如果你的文件名是 `my_vpn.conf`，则命令改为 `wg-quick down my_vpn`。_

### 2\. 使用 `systemctl` (推荐用于服务器)

如果你已经将 WireGuard 设置为开机自启的服务，建议使用 systemd 来管理，这样更规范：

```
# 一键重启
sudo systemctl restart wg-quick@wg0

# 查看状态（确认是否重启成功）
sudo systemctl status wg-quick@wg0
```

### 3\. 热更新配置 (不中断连接)

如果你修改了配置文件，但**不想让已经连接的用户掉线**，可以使用 `strip` 命令同步配置：

```
sudo wg syncconf wg0 <(wg-quick strip wg0)
```

> **提示：** 这个操作只会更新修改的部分（比如新增了一个 Peer），而不会像 `down/up` 那样重置整个网络接口。

### 4\. 检查是否重启成功

重启后，你可以通过以下命令确认隧道是否正常工作：

*   **查看运行状态：** `sudo wg show` （如果看到流量 `transfer` 在变，说明通了）
*   **查看网卡信息：** `ip a show wg0`
*   **测试连通性：** `ping 10.0.0.1` (根据你设置的内部 IP 测试)

**你是遇到了连接不上的问题，还是刚才修改了配置文件需要生效。** 如果是连接不上，我可以帮你看看报错日志。

### 主题 5. root@cc:~ wg show

从你的 `wg show` 输出和 `ping` 结果来看，隧道虽然配置了，但**数据包是有去无回（100% loss）**。

最明显的疑点在于：`transfer` 显示 **1.30 KiB sent, 0 B received**。这意味着你的这台 Linux 发出了握手请求，但对方（142.171.114.231）完全没有回应。

请按以下顺序排查，通常能解决 90% 的连通性问题：

### 1\. 检查公网端口是否开放 (UDP!)

这是最常见的坑。WireGuard 使用的是 **UDP** 协议，而不是 TCP。

*   **服务端防火墙：** 如果 `142.171.114.231` 是你的服务端，确保它的防火墙（或云控制台安全组）开放了 **UDP 51820**。
*   **测试端口：** 在客户端（当前的 Linux）执行：
```
    nc -zvu 142.171.114.231 51820
```
如果显示 `succeeded`，说明端口通了；如果是 `timed out`，说明被挡在了门外。

### 2\. 检查公钥是否配对

WireGuard 是严格的“公钥交换”。

*   **当前客户端：** 你的 Public Key 是 `5AKyGR...`。
*   **服务端 (142.171.114.231)：** 请去服务端运行 `wg show`，确认其 `[Peer]` 配置里的公钥**完全等同于**上面的 `5AKyGR...`。
*   **反向确认：** 确认你本地配置里的 `peer: pEpkd4...` 确实是服务端真实的 Public Key。
> **注意：** 哪怕少一个字符，WireGuard 都会静默丢包，没有任何错误提示。

### 3\. AllowedIPs 范围

你现在的配置是： `allowed ips: 10.10.0.0/24`

*   如果你要 ping 的目标地址是 `10.10.0.1`，那么这个范围是对的。
*   但请确认**服务端**那边给这个客户端分配的 `AllowedIPs` 是不是 `10.10.0.x/32`（即你本机的内网 IP）。

### 4\. 路由冲突 (MTU 问题)

如果你使用的是 VPS（比如 CloudCone 或其他云服务商），有时默认的 MTU 过大会导致包发不出去。尝试在 `wg0.conf` 的 `[Interface]` 部分加入：

```
MTU = 1380
```

然后重启 `wg-quick down wg0 && wg-quick up wg0` 试试。

### 5\. 检查服务端状态

去 **142.171.114.231** 这台机器上运行 `wg show`，看看：

1.  它有没有收到来自你这台机器公网 IP 的请求。
2.  它的 `endpoint` 是否显示了你目前的公网 IP。

**你可以登录到服务端 (142.171.114.231) 执行一下 `wg show` 吗。把结果发给我，我一眼就能看出哪边没对上。**

### 排查场景 1. wg show root@racknerd-7829f7f 11:16:...

- 场景：wg show root@racknerd-7829f7f 11:16:...
- 处理要点：
发现问题了。原因非常典型，是 **IP 地址段不匹配** 导致的“握手成功但无法通信”。

观察这两台机器的状态：

1.  **服务端 (RackNerd):** 它的 `allowed ips` 是 **`10.0.0.3/32`**。
2.  **客户端 (CC):** 你刚才 ping 的目标是 **`10.10.0.1`**。

### 为什么不通。

在 WireGuard 中，`AllowedIPs` 既是路由表也是白名单。

*   **服务端认为：** 客户端的内网 IP 应该是 `10.0.0.3`。
*   **客户端认为：** 自己属于 `10.10.0.x` 网段。 由于服务端只允许 `10.0.0.3` 的流量进入，当你从客户端发送 `10.10.0.x` 的包时，服务端会直接丢弃（因为它不在白名单里）。

### 解决方案：统一网段

你需要决定用哪个网段，建议统一使用 `10.10.0.x`。

#### 第一步：修改服务端 (RackNerd) 的配置

修改 `/etc/wireguard/wg0.conf`，将该 Peer 的配置改为：

```
[Peer]
PublicKey = 5AKyGRiJ+3/cYCh0FDs0Aj4w6ipRloHNZgagZmFH3Gc=
AllowedIPs = 10.10.0.2/32  # 假设给客户端分配 .2
```

然后热更新服务端配置：

```
sudo wg syncconf wg0 <(wg-quick strip wg0)
```

#### 第二步：修改客户端 (CC) 的配置

修改其 `/etc/wireguard/wg0.conf`：

```
[Interface]
PrivateKey = <客户端私钥>
Address = 10.10.0.2/24  # 确保这里的网段和服务端分配的一致
# ... 其他保持不变
```

然后重启客户端：

```
sudo wg-quick down wg0 && sudo wg-quick up wg0
```

### 第三步：再次测试

现在在客户端（CC）上执行：

```
ping 10.10.0.1
```

**一点提示：** 你刚才服务端的 `wg show` 显示 `latest handshake: 41 seconds ago`，这说明**物理链路（UDP 端口和密钥）已经是通的了**。只要把内部的 `Address` 和 `AllowedIPs` 调成一致，立刻就能连上网。

### 主题 6. 这样还不对吗

握手（Handshake）成功了，说明你的**密钥、IP、端口全是对的**。现在的问题卡在 **“路由逻辑”** 上，也就是我刚才提到的 **AllowedIPs 不匹配**。

在 WireGuard 中，`AllowedIPs` 是一个“双向检查”：

1.  **发送时：** 它决定哪些目标 IP 走这个隧道。
2.  **接收时：** 它决定哪些源 IP 允许进入。

###  为什么现在不通。

你看你的两条 `wg show` 数据：

*   **服务端 (RackNerd):** `allowed ips: 10.0.0.3/32`
    *   **它在想：** “我只接收来自 `10.0.0.3` 的包，也只把发往 `10.0.0.3` 的包丢进隧道。”
*   **客户端 (CC):** 发出的 Ping 包源 IP 是 **`10.10.0.x`**（由它的 `Interface` 决定）。
    *   **结果：** 服务端收到包后发现源 IP 是 `10.10.0.x`，不是它期待的 `10.0.0.3`，于是**直接丢弃**。

这就是为什么你看到 `transfer` 有几百字节的变动（握手包过了），但业务数据（Ping）死活不通。

###  修正方案：保持两端网段绝对一致

请确保你的配置文件长这样（假设我们统一用 `10.10.0.x`）：

#### 1\. 服务端 (RackNerd)

编辑 `/etc/wireguard/wg0.conf`:

```
[Interface]
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = <服务端私钥>

[Peer]
PublicKey = 5AKyGRiJ+3/cYCh0FDs0Aj4w6ipRloHNZgagZmFH3Gc=
# 必须改成 10.10 段！
AllowedIPs = 10.10.0.2/32  
```

#### 2\. 客户端 (CC)

编辑 `/etc/wireguard/wg0.conf`:

```
[Interface]
# 必须和上面服务端分配给你的对上！
Address = 10.10.0.2/24  
PrivateKey = <客户端私钥>

[Peer]
PublicKey = pEpkd4HxVDp7b59UMrHoKiHqwdtIDeoNUXELdj1tAjY=
Endpoint = 142.171.114.231:51820
AllowedIPs = 10.10.0.0/24
```

### 3\. 重启生效

两边都修改完后，分别执行重启：

```
sudo wg-quick down wg0 && sudo wg-quick up wg0
```

再试试 `ping 10.10.0.1`，这次大概率就通了。

**顺便问下：** 你的这两台机器，一台是 CloudCone (CC) 另一台是 RackNerd 吗。你是打算用这两台 VPS 互做备份，还是单纯为了组内网。

### 主题 7. 为什么这里一个是32位掩码，一个是24位掩码

这是一个非常棒的问题，触及了 WireGuard 逻辑的核心：**`Interface`（接口）和 `Peer`（对等节点）定义的维度完全不同。**

简单来说：**24位掩码定义的是“地盘”，32位掩码定义的是“门牌号”。**

### 1\. `Interface` 里的 `/24`：定义本地网段

在 `[Interface]` 部分，`Address = 10.10.0.1/24` 的作用是**给你的虚拟网卡（wg0）设置 IP 和掩码**。

*   这告诉操作系统：“我这块网卡属于 `10.10.0.0` 到 `10.10.0.255` 这个大家庭。”
*   它会自动在你的系统路由表中添加一条规则：凡是发往 `10.10.0.x` 的包，都往 `wg0` 接口扔。

### 2\. `Peer` 里的 `/32`：定义唯一的身份验证

在 `[Peer]` 部分，`AllowedIPs = 10.10.0.2/32` 的作用完全不同，它是 WireGuard 特有的 **“加密路由表 (Cryptokey Routing)”**。

*   **作为过滤器：** 当服务端收到一个包，公钥校验通过后，它会看包里的源 IP。如果包的源 IP 是 `10.10.0.2`，而你的配置里写的是 `/32`（精确匹配），它才允许这个包通过。
*   **作为分发器：** 当服务端想往隧道里发包时，它会查：哪个 Peer 拥有 `10.10.0.2` 这个 IP。查到对应的公钥后，就把包加密发给那个 Peer。

> **比喻：**
> 
> *   **`/24`** 像是一条街道的名字（10.10.0 大街），只要你住在这条街，你发信件（数据包）就知道该走哪条路。
> *   **`/32`** 像是具体的门牌号（10.10.0.2 号）。WireGuard 必须精确知道哪个公钥对应哪个门牌号，否则它不知道该把包加密给谁。
>     

### 3\. 如果反过来会怎样。

*   **如果 Peer 处也写 `/24`：** 如果你在服务端的 Peer 配置里写 `AllowedIPs = 10.10.0.0/24`，那就出大问题了。如果此时你有两个客户端接入，服务端就分不清哪个 IP 对应哪个客户端了，会导致数据包冲突。
*   **如果 Interface 处写 `/32`：** 你的系统路由表会认为这条街只有你一个人，当你尝试 ping 隧道里的其他队友（比如 `10.10.0.2`）时，系统可能根本找不到路径，因为它不觉得 `10.10.0.2` 在你的网段里。

### 总结

*   **`Address` 用 `/24`**：是为了让你的 Linux 系统知道这一片 IP 都归 WireGuard 管。
*   **`AllowedIPs` 用 `/32`**：是为了让 WireGuard 知道这个特定的公钥（Peer）**仅代表**这一个特定的 IP。

**现在你把两端的网段改统一了吗。改完重启后再 ping 一下试试，握手已经有了，成功的曙光就在眼前。**

### 主题 8. allow ip只要大于24就行

简单直观的结论是：**不完全是。它不是“大小”的问题，而是“范围”的问题。**

在 WireGuard 中，`AllowedIPs` 的核心规则是：**你允许这个 Peer（对等节点）使用哪些 IP 地址。**

### 1\. 为什么通常用 `/32`。

如果你只是想连接 **一台** 电脑，必须用 `/32`。

*   `10.10.0.2/32` 表示：这个公钥 **只能且仅能** 代表 `10.10.0.2` 这一个 IP。
*   这是最安全的做法，防止某个客户端冒充别人的 IP 发包。

### 2\. 什么时候可以用 `/24` 甚至更小。

只有当你希望通过这个隧道 **访问一个网段** 时，才会调小掩码（比如 `/24`）。

**场景举例：** 假设你的 Linux 客户端（CC）不仅是一台机器，它还是一个局域网的网关，它身后还有一堆设备（192.168.1.x）。

*   如果你想在 RackNerd 服务端直接访问 CC 身后的所有设备。
*   那么在 RackNerd 的 `[Peer]` 配置里，你需要写： `AllowedIPs = 10.10.0.2/32, 192.168.1.0/24`
*   这样，发往 192.168.1.x 的包也会被丢进这个隧道。

### 3\. 一个极端的例子：`/0`

在 Windows/macOS 客户端上，你经常会看到： `AllowedIPs = 0.0.0.0/0`

*   **含义：** 掩码是 0，表示匹配所有 IP。
*   **作用：** 这就是“全局代理”。所有的上网流量（发往任何地方的包）都会被塞进 WireGuard 隧道，发给服务器。

### ️ 注意：不要在服务端的多个 Peer 里重叠范围

这是新手最容易犯的错。如果你有两个客户端：

*   Peer A: `AllowedIPs = 10.10.0.0/24`
*   Peer B: `AllowedIPs = 10.10.0.0/24`

**WireGuard 会直接报错或失效。** 因为当它收到一个发往 `10.10.0.5` 的包时，它不知道该用 A 的公钥加密还是 B 的公钥加密。

### 总结建议

对于你目前连接 CC 和 RackNerd 的需求：

*   **服务端的 `[Peer]`：** 必须用 **`/32`**（指定那台机器的唯一内网 IP）。
*   **客户端的 `[Peer]`：** 建议用 **`/24`**（让客户端知道所有 `10.10.0.x` 的包都往服务器发，这样它才能找到其他队友）。

**你现在的配置里，两端的 `AllowedIPs` 修改成同一个网段（比如都是 10.10.0.x）了吗。如果改好了，Ping 一下 `10.10.0.1` 试试看。**

### 主题 9. pacman可以安装wg吗

可以，**Arch Linux** 安装 WireGuard 非常简单。

由于你之前提到了 `root@cc` 和 `racknerd`，如果你其中一台机器跑的是 Arch Linux，直接使用 `pacman` 即可：

```
sudo pacman -S wireguard-tools
```

### 几个关键点：

1.  **内核支持**： Arch Linux 的官方内核（`linux` 包）已经内置了 WireGuard 模块。如果你使用的是默认内核，安装完 `wireguard-tools` 就能直接用。
    *   如果你使用的是长期支持版内核，确保安装了 `linux-lts`。
    *   如果你是自己编译的极简内核，可能需要确认开启了 `CONFIG_WIREGUARD`。
2.  **验证安装**： 安装完成后，你可以运行以下命令确认工具是否可用：
```
    wg --version
```
3.  **配置路径**： 和 Debian/Ubuntu 一样，配置文件同样放在 `/etc/wireguard/` 目录下。
4.  **管理服务**： Arch 同样使用 systemd。如果你想让隧道开机自启：
```
    sudo systemctl enable wg-quick@wg0
```

### ️ 特别提醒（针对 VPS 用户）

如果你的 Arch Linux 是运行在 **OpenVZ** 虚拟化架构的 VPS 上（虽然 RackNerd 和 CC 绝大部分是 KVM，但还是提醒一下），由于无法直接加载内核模块，你可能还需要安装 `wireguard-go`（这是一个用户态实现版本）：

```
sudo pacman -S wireguard-go
```

_如果是 KVM 架构，则完全不需要这个，直接用内核版性能更好。_

**你现在是准备把其中一台机器重装成 Arch，还是在给现有的 Arch 节点加隧道。之前的 10.10.x.x 网段连通了吗。**

### 排查场景 2. wg-quick up wg0 03:32:42

- 场景：wg-quick up wg0 03:32:42
- 处理要点：
报错原因非常直接：你的配置文件里写了 `DNS = x.x.x.x`，所以 `wg-quick` 尝试调用 `resolvconf` 来修改系统的 DNS 设置，但你的 **Arch Linux 上没装这个工具**。

由于 `wg-quick` 发现 DNS 设置失败，为了保证配置的一致性，它执行了“回滚”操作（`ip link delete dev wg0`），导致网卡根本没启动，所以你 Ping 不通。

### 解决方案

#### 方法 A：安装依赖（推荐）

在 Arch 上，通常安装 `openresolv` 就能解决这个问题：

```
sudo pacman -S openresolv
```

安装后再运行 `sudo wg-quick up wg0` 即可。

#### 方法 B：注释掉 DNS

如果你不需要通过隧道解析 DNS（仅仅是两台机器互联，用 IP 通讯），直接把配置文件里的 DNS 行删掉或注释掉：

```
[Interface]
Address = 10.0.0.2/24
# DNS = 1.1.1.1  <-- 把这一行删了
PrivateKey = ...
```

### ️ 关键提醒：你的 IP 段又变了。

我注意到你这次的日志里显示： `[#] ip -4 address add 10.0.0.2/24 dev wg0`

**请务必检查：**

1.  **服务端 (RackNerd)** 的 `[Peer]` 里的 `AllowedIPs` 是否已经改成了 `10.0.0.2/32`。
2.  如果你还在 Ping `10.0.0.1`，请确保服务端自己的 `[Interface]` 里的 `Address` 确实是 `10.0.0.1/24`。

### 总结操作步骤

1.  执行 `sudo pacman -S openresolv`。
2.  再次执行 `sudo wg-quick up wg0`。
3.  如果看到接口没被 delete，再执行 `wg show` 确认状态。

**搞定 `resolvconf` 报错后，这次 `wg show` 的 transfer 是不是终于有 received 数据了。**

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
