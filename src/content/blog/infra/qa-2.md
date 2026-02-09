---
title: "Clash 规则配置 FAQ"
description: "整理 Clash 分流规则的配置思路，重点解决开发场景中的端口与路由问题。"
pubDate: "2025-11-22"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/从0开始搭建你的服务/4. 配置 Clash 代理规则.md"
sourceVault: "obsidian/note"
slug: "infra/qa-2"
---
学会自己配置 Clash 代理规则，我们就可以实现在大陆体验到真实世界下的网络环境。

## QA
## 1. 为什么我们要自己配置规则？

- 分流，有一些机场的 Providers 会默认关闭 22 端口的流量代理，那么我们想通过 ssh 连接端口在 22 的服务器就变得不现实；此外更重要的是，我们经常要使用 GitHub 的 ssh 连接

## 1. 安装 Clash

[CLICK](https://github.com/clash-verge-rev/clash-verge-rev)

## 2. 查询 Clash 内核的配置文件

- https://github.com/clash-verge-rev/clash-verge-rev/wiki
- https://www.clashverge.dev/
- https://www.clashverge.dev/guide/config.html
- https://wiki.metacubex.one/config/
