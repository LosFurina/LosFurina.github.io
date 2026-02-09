---
title: "自建代理服务 FAQ"
description: "总结为什么要自建代理、优势与局限，以及在开发与日常使用中的典型场景。"
pubDate: "2025-11-21"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/从0开始搭建你的服务/3. 自建代理服务.md"
sourceVault: "obsidian/note"
slug: "infra/qa"
---
很多时候我们都需要用到代理服务，不仅仅局限于科学上网，有时候可能要伪装 ip，有时要突破 ip 限制，等等一系列需求。

但主要用途还是科学上网居多。

## QA
## 1. 为什么自建代理？

A: 首先是**便宜**，在不追求专线和延迟的的情况下，自建会更便宜；其次是更**安全**，避免第三方机场搞小动作盗取信息；此外**可定制化程度更高**，有相当一部分机场 Provider 会上很多限制，例如 22 端口的流量封锁，这会导致一个很严重的问题，我们在使用 `ssh` 协议连接 `GitHub`时会被拒绝，在大陆做开发会有明显的感受，`git pull`时，如果机场拒绝代理  22  端口的流量，就会报错；当然，机场会限制流量，每个月可能专线机场就只有 200GB 流量，实在不舍得用来下载一些大文件，如果用自建代理，就可以随便挥霍了。

## 2. 自建有什么缺点？

A: 线路的延迟与网速与你购买的 VPS 有关，延迟大概率不会比专线机场更低；需要一定的动手能力。

## 1. 简介

**3X-UI can help us deploy network proxy easily, especially for those who live in district with restricted network sanction.**

3X-UI 可以帮助你轻松部署网络代理

## 2. Install 3X-UI

官方仓库：[CLICK](https://github.com/MHSanaei/3x-ui)

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

## 3. Config 3x-ui

**Before that, you need a domain of yourself.**
在此之前，你最好拥有一个域名

购买域名：购买域名

## 1. 添加一个 DNS 记录

## 2. 获取一个 SSL 证书

## 3. 访问你的 3X-UI 面板

## 4. 添加一个入口规则

## 5. 在 V2RayN 中添加节点

## 6. 转换为 Clash 配置
