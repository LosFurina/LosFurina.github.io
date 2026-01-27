---
title: How to use Filebrowser
description: "Auto-generated description for How to use Filebrowser"
pubDate: 2026-01-23
---

# Installation

Filebrowser is a single binary that can be used as a standalone executable. Alternatively, you can use it with [Docker](https://www.docker.com/) or [Caddy](https://caddyserver.com/), a fantastic web server that enables HTTPS by default. Its installation is straightforward regardless of the system you use.

## Using Brew

> **Note:** Brew is available for both Linux and macOS.

How to install Brew

```bash
brew tap filebrowser/tap
brew install filebrowser
filebrowser -r /path/to/your/files
```

> **Tip:** Configure Filebrowser before running it for the first time.

Once configured, your Filebrowser instance should be running successfully!

# Configuration

Filebrowser offers flexible configuration options, including an official [CLI](https://filebrowser.org/cli).

1. Set the address:
   ```bash
   filebrowser config set address 0.0.0.0
   ```
2. Set the port:
   ```bash
   filebrowser config set port 8090
   ```
3. Set the root directory:
   ```bash
   filebrowser config set root [your directory path]
   ```

Export the configuration for future use:
```bash
filebrowser config export [output path]
```

Next time, you can load this configuration file to restore your settings.

# Starting Filebrowser

## Direct Execution

Run Filebrowser directly with the following command:
```bash
filebrowser -c [your config file path] -d [database path]
```

> **Note:** Specify the database path during the first run. You can reuse the same `.db` file later to recover your site.

## Running in the Background

[How to run in the background](/2025/05/22/Run-in-background/)

### Example for macOS

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

### Example for Ubuntu

```service
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
