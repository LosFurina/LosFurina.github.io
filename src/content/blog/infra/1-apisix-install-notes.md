---
title: "APISIX 安装学习笔记"
description: "在 TencentOS Server 4.4（RHEL 9 容器环境）中通过 RPM 包管理（dnf）安装 APISIX 与 etcd 的完整流程，包含故障排查与调试实战记录。"
pubDate: "2026-05-18"
updatedDate: "2026-05-18"
category: "infra"
tags: ["infra", "apisix", "etcd", "nginx"]
slug: "infra/1-apisix-install-notes"
---

# APISIX 安装学习笔记

> 环境：TencentOS Server 4.4（基于 RHEL 9），容器环境（无 systemd）
> 方式：RPM 包管理（dnf）
> 参考官方文档：https://apisix.apache.org/docs/apisix/installation-guide/

---

## 一、环境确认

### 1.1 确认系统发行版

```bash
cat /etc/os-release
```

输出关键信息：
- `NAME="TencentOS Server"`、`VERSION="4.4"`
- `ID_LIKE="rhel centos"` → 属于 **RHEL 系列**

### 1.2 确认包管理器

```bash
which yum dnf    # 输出 /usr/bin/yum 和 /usr/bin/dnf
rpm --version   # RPM version 4.18.2
```

**结论：**
- `dnf` 可用 ✅（TencentOS 4.x 基于 RHEL 9，主流工具是 dnf）
- `yum` 不可用 ❌（shebang 指向 python3.12，但 dnf 模块装在 python3.11 下）
- **全程使用 `dnf`，不用 `yum`**

> ⚠️ 教训：`yum` 在 Python 版本切换后容易坏，直接用 `dnf` 更可靠。

---

## 二、第一步：安装 etcd

APISIX **强依赖 etcd** 来存储和同步配置，必须先启动 etcd。

### 2.1 下载 etcd

```bash
ETCD_VERSION='3.5.4'
wget https://github.com/etcd-io/etcd/releases/download/v${ETCD_VERSION}/etcd-v${ETCD_VERSION}-linux-amd64.tar.gz
```

> 说明：`wget` 也可用 `curl -LO` 替代。

### 2.2 解压并安装

```bash
tar -xvf etcd-v3.5.4-linux-amd64.tar.gz
cp -a etcd-v3.5.4-linux-amd64/etcd /usr/bin/
cp -a etcd-v3.5.4-linux-amd64/etcdctl /usr/bin/
```

验证：
```bash
etcd --version    # etcd Version: 3.5.4
```

### 2.3 启动 etcd

```bash
# 容器环境（无 systemd）用 nohup 后台启动
nohup etcd > /tmp/etcd.log 2>&1 &

# 验证健康状态
etcdctl endpoint health
# 输出：127.0.0.1:2379 is healthy: successfully committed proposal: took = 4.960293ms
```

> ⚠️ **为什么不用 systemd？**
> 容器里 PID 1 不是 systemd（可用 `cat /proc/1/comm` 查看），systemd 必须作为 PID 1 运行，所以无法使用。
> 生产环境 K8s 用探针代替 systemd 管理进程。

---

## 三、第二步：添加 APISIX RPM 仓库

### 3.1 下载 repo 文件

```bash
curl -fsSL https://repos.apiseven.com/packages/redhat/apache-apisix.repo \
  -o /etc/yum.repos.d/apache-apisix.repo
```

> 注意：官方文档用的是 `repos.api7.ai`，但容器内 DNS 解析该域名失败，改用 `repos.apiseven.com` 成功。

### 3.2 修复 $releasever 变量

默认 repo 文件中：
```ini
baseurl=https://repos.apiseven.com/packages/redhat/$releasever/$basearch
```

TencentOS 上 `$releasever` 解析为 `4`，但 APISIX 仓库路径需要 RHEL 大版本号（`8` 或 `9`）。

TencentOS 4.x 基于 RHEL 9，修改 `/etc/yum.repos.d/apache-apisix.repo`：

```ini
# 修改前
baseurl=https://repos.apiseven.com/packages/redhat/$releasever/$basearch

# 修改后
baseurl=https://repos.apiseven.com/packages/redhat/9/$basearch
```

### 3.3 导入 GPG 密钥

```bash
rpm --import https://repos.apiseven.com/KEYS
```

> 如果不提前导入，dnf 安装时会卡在交互式确认，而 `-y` 参数无法自动通过 GPG 确认。

---

## 四、第三步：安装 APISIX

```bash
dnf clean all      # 清理缓存
dnf makecache     # 重新生成缓存
dnf install -y apisix
```

### 安装结果

```
Installed:
  apisix-3.16.0-0.ubi9.6.x86_64
  cyrus-sasl-2.1.28-10.tl4
  cyrus-sasl-devel-2.1.28-10.tl4
  libyaml-devel-0.2.5-6.tl4
  openldap-devel-2.6.5-6.tl4
  pcre-8.45-9.tl4
```

共安装 6 个包，APISIX 主包 59MB。

---

## 五、第四步：初始化并启动 APISIX

### 5.1 初始化

```bash
apisix init
# 输出：/usr/local/openresty//luajit/bin/luajit /usr/local/apisix/apisix/cli/apisix.lua init
```

作用：生成配置文件，向 etcd 写入初始数据。

### 5.2 启动

```bash
apisix start
# 输出：trying to initialize the data of etcd
```

### 5.3 验证进程

```bash
ps aux | grep -E 'apisix|openresty|nginx' | grep -v grep
```

输出中可以看到：
- 1 个 master process
- N 个 worker process（数量由 `conf/config.yaml` 中 `worker_processes` 决定）

### 5.4 验证端口

| 端口 | 用途 |
|---|---|
| `9080` | Proxy 端口，接收客户端请求 |
| `9180` | Admin API 端口，管理路由配置 |

```bash
# Proxy 端口（尚未配置路由，返回 404 是正常的）
curl http://127.0.0.1:9080
# 输出：404（表示服务在运行，只是没有匹配路由）

# Admin API 端口
curl http://127.0.0.1:9180/apisix/admin/routes \
  -H 'X-API-KEY: <key>'
```

---

## 六、Admin API Key 获取

配置文件路径：`/usr/local/apisix/conf/config.yaml`

```bash
grep -E 'admin_key|key:' /usr/local/apisix/conf/config.yaml
```

输出示例：
```yaml
admin_key:
     key: ROgzmNLtSTwMpxdWPMJdsoxgMXrvMLUj
   admin_key_required: true
```

> ⚠️ 这是默认 Key，生产环境必须更换！

---

## 七、Admin API 简介

Admin API 是 APISIX 的管理控制接口，所有配置（路由、上游、插件）都通过它操作。

### 核心资源

| 资源 | 作用 | API 路径 |
|---|---|---|
| Route | 请求匹配规则（URL、方法、Header） | `/apisix/admin/routes` |
| Upstream | 后端服务地址（转发目标） | `/apisix/admin/upstreams` |
| Service | 可复用的路由模板 | `/apisix/admin/services` |
| Plugin | 限流、鉴权、CORS 等 | `/apisix/admin/plugins` |
| Consumer | API 消费者（用于鉴权） | `/apisix/admin/consumers` |

### 快速测试示例

```bash
# 1. 创建上游（后端服务）
curl http://127.0.0.1:9180/apisix/admin/upstreams/1 \
  -H 'X-API-KEY: ROgzmNLtSTwMpxdWPMJdsoxgMXrvMLUj' \
  -X PUT \
  -d '{"type":"roundrobin","nodes":{"httpbin.org:80":1}}'

# 2. 创建路由
curl http://127.0.0.1:9180/apisix/admin/routes/1 \
  -H 'X-API-KEY: ROgzmNLtSTwMpxdWPMJdsoxgMXrvMLUj' \
  -X PUT \
  -d '{"uri":"/get","upstream_id":"1"}'

# 3. 测试转发
curl http://127.0.0.1:9080/get
# 请求会被转发到 httpbin.org/get
```

---

## 八、关键知识点总结

### etcd 的作用
APISIX 用 etcd 存储**所有配置**（路由、上游、插件等）。etcd 是分布式 KV 存储，支持 watch 机制，配置变更可以实时推送到所有 APISIX 节点。

### APISIX 的架构
```
Client → APISIX (Nginx/OpenResty) → Backend Service
                  ↓
              etcd (配置存储)
```
- **数据平面**：Nginx 处理实际流量转发（高性能，基于 OpenResty）
- **控制平面**：Admin API 修改 etcd 中的配置

### 为什么 RPM 方式适合生产？
- 与系统包管理器集成，升级方便
- 可以用 `dnf history` 回滚
- 比 Docker 方式更"原生"，便于运维

---

## 九、故障排查记录

| 问题 | 原因 | 解决方法 |
|---|---|---|
| `yum update` 报 `ModuleNotFoundError: No module named 'dnf'` | `/usr/bin/yum` shebang 指向 python3（3.12），但 dnf 模块在 python3.11 下 | 全程用 `dnf` 代替 `yum` |
| `dnf install apisix` 报 `404` 下载 repodata | `$releasever` 解析为 `4`，路径错误 | 手动将 repo 文件中 `$releasever` 改为 `9` |
| GPG 密钥交互确认卡住 | `-y` 无法跳过 GPG 交互 | 先用 `rpm --import` 导入密钥 |
| 容器中无法使用 systemd | 容器 PID 1 不是 systemd | 用 `nohup` 或 `supervisord` 管理进程 |
| `502 Bad Gateway` 上游连不上 | 上游用域名但 nginx 连接时 Host 头不对 | 用 `proxy-rewrite` 插件设置 Host 头 |
| `httpbin.org` 作上游返回 502 | `httpbin.org` 用 Host 头路由，直接 IP 访问被拒 | 换用本机 HTTP 服务作上游 |
| `PATCH` 更新上游变成合并而非替换 | APISIX `PATCH` 是合并语义，旧节点会保留 | 先删后建，或用 `PUT` 全量替换 |
| 上游删不掉：`can not delete this upstream` | 上游被路由引用，需先删路由 | 删除顺序：先 `DELETE route`，再 `DELETE upstream` |
| Python HTTP 服务跑着跑着就 502 了 | Bash 命令结束后后台进程被杀，进程不持久 | 用 `nohup ... &` 让进程跨会话存活 |
| 路由创建后 Proxy 端口仍 404 | 上游节点健康但不返回对应 URI 的文件 | 在上游服务目录下创建对应文件（如 `/tmp/get`） |

---

## 十、调试实战记录（2026-05-18）

### 10.1 第一个问题：`httpbin.org` 作上游返回 502

**现象：**
```
curl http://127.0.0.1:9080/get
→ 502 Bad Gateway
```

**排查过程：**
1. 看 error.log：`upstream prematurely closed connection`
2. 确认容器能访问外网：`curl http://httpbin.org/get` → 200 ✅
3. 问题：`httpbin.org` 用 **Host 头**路由，APISIX 直接连 IP 时被拒

**解决方案：**
换用**本机 HTTP 服务**作上游，完全绕过外网域名问题。

---

### 10.2 第二个问题：PATCH 是合并不是替换

**现象：**
```bash
# 先创建 upstream，nodes = { "httpbin.org:80": 1 }
curl -X PATCH ... -d '{"nodes": {"127.0.0.1:8080": 1}}'

# 查看发现两个节点都在！
"nodes": {
  "httpbin.org:80": 1,      # 旧的没删掉
  "127.0.0.1:8080": 1     # 新的合并进来了
}
```

**原因：** APISIX `PATCH` 语义是合并，不是替换。

**正确做法：** 用 `PUT` 全量替换，或先 `DELETE` 再 `PUT`。

---

### 10.3 第三个问题：删上游报 `can not delete this upstream`

**现象：**
```bash
curl -X DELETE /apisix/admin/upstreams/1
→ {"error_msg":"can not delete this upstream, route [1] is still using it now"}
```

**原因：** 上游被路由引用，APISIX 保护机制防止误删。

**正确顺序：**
```
先 DELETE route  →  再 DELETE upstream
```

---

### 10.4 第四个问题：Python HTTP 服务老是挂掉

**现象：** 用 `python3 -m http.server 8080 &` 启动服务，过一会 curl 就 502 了。

**原因：** Bash 工具的特性——每次命令执行完，**后台进程会被杀掉**。`&` 启动的进程不持久。

**解决方案：**
```bash
# 用 nohup 让进程跨会话存活
nohup python3 -m http.server 8080 --directory /tmp > /tmp/python_http.log 2>&1 &
```

---

### 10.5 最终工作配置

```bash
# 上游：指向本机 8080
curl http://127.0.0.1:9180/apisix/admin/upstreams/1 \
  -X PUT \
  -d '{"type":"roundrobin","nodes":{"127.0.0.1:8080":1}}'

# 路由：匹配 /get，指向上游 1
curl http://127.0.0.1:9180/apisix/admin/routes/1 \
  -X PUT \
  -d '{"uri":"/get","upstream_id":"1"}'

# 在上游服务目录下创建对应文件
echo "Hello from APISIX!" > /tmp/get

# 测试：成功！
curl http://127.0.0.1:9080/get
→ Hello from APISIX!
```

---

### 10.6 核心概念：Upstream vs Route

| 概念 | 作用 | 类比 |
|---|---|---|
| **Upstream（上游）** | 定义「请求转发到哪里去」 | 通讯录（后端地址本） |
| **Route（路由）** | 定义「什么样的请求才转发」 | 前台接待（匹配规则） |

**为什么要分开？** 多个路由可以复用同一个上游，改上游时所有路由自动生效，不用每个路由都改一遍。

---

*记录时间：2026-05-18*
