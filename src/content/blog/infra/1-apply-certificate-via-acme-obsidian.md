---
title: "通过 ACME 申请 SSL 证书（含 3X-UI 流程）"
description: "记录 ACME 自动签发证书的基础流程，以及在 3X-UI 中集成申请与校验的步骤。"
pubDate: "2025-01-14"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Get SSL certificate.md"
sourceVault: "obsidian/note"
slug: "infra/1-apply-certificate-via-acme-obsidian"
---
## 1. Apply certificate via ACME
## 2. Apply certificate via ACME integrated by 3X-UI
### 2.1. Install 3X-UI

		- Run bash script:
		  ```bash
		  bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
		  ```
### 2.2. Select `SSL Certificate Management`
		- ```bash
		  $ x-ui
		  $ 18
		  ```
		  `[Image omitted: image.png | source: ../assets/image_1736179090222_0.png]`
### 2.3. Select `Get SSL`, input your domain, and wait for finish
		- `[Image omitted: image.png | source: ../assets/image_1736179276349_0.png]`
### 2.4. Check your certificate
		- `[Image omitted: image.png | source: ../assets/image_1736179338262_0.png]`
