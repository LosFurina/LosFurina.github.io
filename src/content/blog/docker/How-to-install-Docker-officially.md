---
title: Install Docker from Official Repositories
description: "Cross-platform installation notes for Docker on Ubuntu/Debian, Arch Linux, Windows, and macOS."
pubDate: 2026-01-23
---

## Ubuntu/Debian

## Install following official tutorial

### Uninstall unofficial packages

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

### Install using the `apt` repository

Before you install Docker Engine for the first time on a new host machine, you need to set up the Docker `apt` repository. Afterward, you can install and update Docker from the repository.

Set up Docker's apt repository
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

Install the docker packages
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify that the installation is successful by running the `hello-world` image:
```bash
sudo docker run hello-world
```

## Arch Linux

## Install through `pacman`

```bash
sudo pacman -Syu
sudo pacman -S docker
```

## Start `Docker`

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

## Windows

## Download DockerDesktop

[Docker Download](https://www.docker.com/)

## macOS
### Download Docker Desktop
[Docker Download](https://www.docker.com/)
### Install Docker Desktop for Mac
1. Download the Docker Desktop installer from the [Docker website](https://www.docker.com/products/docker-desktop).
2. Open the downloaded `.dmg` file and drag the Docker icon to your Applications folder.
3. Open Docker from your Applications folder.
4. Follow the on-screen instructions to complete the installation.
### Verify Docker Installation
To verify that Docker is installed correctly, open a terminal and run the following command:

```bash
docker --version
```
### Troubleshooting
If you encounter issues with Docker Desktop, you can check the logs or reset Docker to factory defaults from the Docker Desktop menu.
### Uninstall Docker
To uninstall Docker Desktop from Mac, follow these steps:
1. Open Docker Desktop.
2. Click on the Docker icon in the menu bar and select "Preferences."
3. Go to the "Troubleshoot" tab.
4. Click on "Uninstall" to remove Docker Desktop from your Mac.

# Reference

> https://docs.docker.com/engine/install/ubuntu/

