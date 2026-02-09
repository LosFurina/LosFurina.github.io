---
title: "Ubuntu/Debian 安装 Docker（官方仓库）"
description: "按 Docker 官方文档在 Ubuntu/Debian 配置仓库并安装 Docker Engine。"
pubDate: "2025-02-17"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Download and install docker.md"
sourceVault: "obsidian/note"
slug: "infra/ubuntu-debian-obsidian"
---
## Ubuntu/Debian
## Install following official tutorial
		- ### Uninstall unofficial packages
			- ```bash
			  for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
			  ```
		- ### Install using the `apt` repository
			- Before you install Docker Engine for the first time on a new host machine, you need to set up the Docker `apt` repository. Afterward, you can install and update Docker from the repository.
			- Set up Docker's apt repository

			  ```bash
			  # Add Docker's official GPG key:
			  sudo apt-get update
			  sudo apt-get install ca-certificates curl
			  sudo install -m 0755 -d /etc/apt/keyrings
			  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
			  sudo chmod a+r /etc/apt/keyrings/docker.asc
			  
			  # Add the repository to Apt sources:
			  echo \
			    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
			    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
			    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
			  sudo apt-get update
			  ```
			- Install the docker packages

			  ```bash
			  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
			  ```
			- Verify that the installation is successful by running the `hello-world` image:

			  ```bash
			  sudo docker run hello-world
			  ```
## ArchLinux
## Install through `pacman`
		- ```bash
		  sudo pacman -Syu
		  sudo pacman -S docker
		  ```
## Start `Docker`
		- ```bash
		  sudo systemctl start docker
		  sudo systemctl enable docker
		  ```
## Windows
## Download DockerDesktop
		- [Docker Download](https://www.docker.com/)
## Reference
- > https://docs.docker.com/engine/install/ubuntu/
