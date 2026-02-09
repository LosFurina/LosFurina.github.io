---
title: "File Browser 安装指南"
description: "记录 File Browser 的安装方式与基础运行方法，适合作为自托管文件管理入口。"
pubDate: "2025-05-25"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/SelfHosting/Filebrowser.md"
sourceVault: "obsidian/note"
slug: "infra/installation"
---
## Installation

File Browser is a single binary and can be used as a standalone executable. Although, some might prefer to use it with [Docker](https://www.docker.com/) or [Caddy](https://caddyserver.com/), which is a fantastic web server that enables HTTPS by default. Its installation is quite straightforward independently on which system you want to use.

## Brew

> Note: You can install brew both on Linux or MacOS

How to install brew

```bash
brew tap filebrowser/tap
brew install filebrowser
filebrowser -r /path/to/your/files
```

> Note: Before running, you best config it first.

For now, your filebrowser has been running ok!

## Configuration

As far as I know, filebrowser is very different, but we also can config it by official [CLI](https://filebrowser.org/cli)

1. `filebrowser config set address 0.0.0.0`
2. `filebrowser config set port 8090`
3. `filebrowser config set root [your directory path]`

Then, you can run:
```
filebrowser config export [output path]
```
Next time, you can load this config file for your seeting.

## Start

## Directly run

```
filebrowser -c [your config file path] -d [database path]
```

> Set your database path when you first run, and next time you can load the same .db file to recover your site.

## Run in backfround

How to run in background

**Below is an example for MacOS:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>wayne.filebrowser.service</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/filebrowser</string>
        <string>-c</string>
        <string>/Users/wayne/.filebrowser.yaml</string>
        <string>-d</string>
        <string>/Users/wayne/filebrowser.db</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
        <string>/tmp/log/filebrowser.log</string>
    <key>StandardErrorPath</key>
        <string>/tmp/log/filebrowser.err</string>
</dict>
</plist>
```

**Below is an example for Ubuntu:**

```text
[Unit]
Description=Filebrowser Service
After=network.target

[Service]
ExecStart=/opt/homebrew/bin/filebrowser -c /home/wayne/.filebrowser.yaml -d /home/wayne/filebrowser.db
Restart=always
User=wayne
WorkingDirectory=/home/wayne
StandardOutput=append:/tmp/log/filebrowser.log
StandardError=append:/tmp/log/filebrowser.err

[Install]
WantedBy=multi-user.target
```
