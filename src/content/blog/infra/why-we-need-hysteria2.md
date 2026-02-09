---
title: "Why We Need Hysteria2"
description: "解释在受限网络环境中选择 Hysteria2 的动机，并对比 TCP 代理在速度与稳定性上的取舍。"
pubDate: "2025-02-23"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Hysteria2 Installation.md"
sourceVault: "obsidian/note"
slug: "infra/why-we-need-hysteria2"
---
## Why we need Hysteria2?
	- Generally speaking, the internet that what we are using almost transfers our traffic through ==TCP== proxy. As we all know, tcp is a stable proxy, but there are also much disadvantages, including slow transfer speed.
## 1. Purchase Cloud Computer
## 2. Install Hysteria2 server
## 2.1. Official Method
		- I don't recommend this method.
## 2.2. H-UI Panel
		- ### 2.2.1. Install H-UI on remote server through auto script
			- Official project address: [H-UI](https://github.com/jonssonyan/h-ui)
			- ```bash
			  bash <(curl -fsSL https://raw.githubusercontent.com/jonssonyan/h-ui/main/install.sh)
			  ```
			- **NOTE: If you forgot your h-ui web dashboard login username and password, you need to re-run this bash script, and select `reset admin username and password` **
		- ### 2.2.2. Get SSL certificate
		- ### 2.2.3. Login your  h-ui web dashboard

			- Visit `http://your_ip:h-ui_web_dashboard_panel` through your browser. **Default port is: 8081**
			  `[Image omitted: image.png | source: ../assets/image_1736179677493_0.png]`
		- ### 2.2.4. Config your H-UI server
			- 1. Click `Hysteria2 Manage`, you can change default 443 to another port, because I have another server deployed on 443 port.
			  `[Image omitted: image.png | source: ../assets/image_1736179754903_0.png]`
			- 2. Click `TLS` and input your `Certificate` path
			  `[Image omitted: image.png | source: ../assets/image_1736179941857_0.png]`
			- 3. Set bandwidth corresponding to your real network situation, you can test your network speed first, and set up and download bandwidth ==just little bigger that it== (This is very important, otherwise, hysteria will not work well).
			  `[Image omitted: image.png | source: ../assets/image_1736180178673_0.png]` 
			  `[Image omitted: image.png | source: ../assets/image_1736180071501_0.png]`
			- 4. Set your masquerade, if you have your own website, you can direct use it, otherwise, you should set it to a public website.
			  `[Image omitted: image.png | source: ../assets/image_1736180382134_0.png]`
			- 5. Remember start your `Hysteria2`
			  `[Image omitted: image.png | source: ../assets/image_1736180518595_0.png]`
			- 6. Copy your node url and paste it to `V2ray`, `Mihomo` or any other which support `Hysteria2`
			  `[Image omitted: image.png | source: ../assets/image_1736180840972_0.png]`

			- 7. Test your origin server Port whether work
				- ```bash
				  nc -v -u your_url your_port
				  ```
				- `[Image omitted: image.png | source: ../assets/image_1736180676111_0.png]`
