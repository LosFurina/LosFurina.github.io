---
title: Penetrate NAT with FRP
description: "从下载到配置，记录 FRP 服务端与客户端的内网穿透部署流程。"
pubDate: 2026-01-23
---
## Deploy FRP Server

## Install FRP

  Official Repository: [FRP](https://github.com/fatedier/frp)

  Download the latest release for your operating system and architecture from the [Release](https://github.com/fatedier/frp/releases) page. Here, we use Linux amd64 as an example:
  ```bash
  wget https://github.com/fatedier/frp/releases/download/v0.62.1/frp_0.62.1_linux_amd64.tar.gz
  ```

  After downloading, you should see:
  ```sh
  root@cc:~/download# ls
  frp_0.62.1_linux_amd64.tar.gz
  ```

  Extract the archive using `tar`:
  ```bash
  root@cc:~/download# tar -zxvf ./frp_0.62.1_linux_amd64.tar.gz 
  frp_0.62.1_linux_amd64/
  frp_0.62.1_linux_amd64/LICENSE
  frp_0.62.1_linux_amd64/frps.toml
  frp_0.62.1_linux_amd64/frpc
  frp_0.62.1_linux_amd64/frps
  frp_0.62.1_linux_amd64/frpc.toml
root@cc:~/download# ls
frp_0.62.1_linux_amd64  frp_0.62.1_linux_amd64.tar.gz
```

For convenience, rename the extracted folder:
```bash
root@cc:~/download# mv ./frp_0.62.1_linux_amd64 ./frp
root@cc:~/download# ls
frp  frp_0.62.1_linux_amd64.tar.gz
```

At this point, I <span style="color: red;">recommend registering</span> `frp` in a `bin` directory.

**If you are root (or have `sudo`) and want to install for all users:**
```bash
root@cc:~/download# cd frp/
root@cc:~/download/frp# mv frpc frps /usr/local/bin/
root@cc:~/download/frp# source ~/.bashrc
root@cc:~/download/frp# which frps
/usr/local/bin/frps
```

**If you do not have `sudo`:**
```bash
# Create this folder if it doesn't exist.
mkdir -p ~/.local/bin
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

> **Note:** You can also use `$HOME/bin/`, but make sure you understand what you are doing.  
> If your shell is not bash, adjust accordingly.

```bash
firstsnow@cc:~/Download/frp$ ls
frpc  frpc.toml  frps  frps.toml  LICENSE
firstsnow@cc:~/Download/frp$ cp frpc frps $HOME/.local/bin/
firstsnow@cc:~/Download/frp$ ls ~/.local/bin/
frpc  frps
firstsnow@cc:~/Download/frp$ source ~/.bashrc 
firstsnow@cc:~/Download/frp$ which frps
/home/firstsnow/.local/bin/frps
```

Now, `frp` is installed successfully.

## Configure `frps`

For easier management, place your config files in `~/.config/frp`:
```bash
root@cc:~/download/frp# mkdir -p $HOME/.config/frp
root@cc:~/download/frp# cp frps.toml frpc.toml ~/.config/frp/
```

Edit `frps.toml` as needed:
```vim
bindPort = 7000 
# Set to your desired port. Default is 7000.
```

## Run `frps` in the Background (Debian/Ubuntu)

More information: [Run in the Background](/2025/05/22/Run-in-background/)

> **Note:** `sudo` privileges are required.

We use [systemd](https://wiki.ubuntu.com/systemd) to manage services.

Create a `frps.service` file for systemd:
```text
[Unit]
Description=Frps Service
After=network.target
Wants=network.target

[Service]
Type=simple
WorkingDirectory=$HOME/.config/frp
ExecStart=frps -c $HOME/.config/frp/frps.toml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Save this file to `/etc/systemd/system/`.  
A convenient method:
```bash
sudo bash -c 'cat > /etc/systemd/system/frps.service << EOF
[Unit]
Description=Frps Service
After=network.target
Wants=network.target
[Service]
Type=simple
WorkingDirectory=$HOME/.config/frp
ExecStart=frps -c $HOME/.config/frp/frps.toml
Restart=on-failure
RestartSec=5s
[Install]
WantedBy=multi-user.target
EOF'
```

Enable and start the service:
```bash
# Enable auto-start on boot
sudo systemctl enable frps.service
# Start the service
sudo systemctl start frps.service
```

## Run `frps` in the Background (MacOS)

> **Note:** `sudo` is not required on MacOS, unlike Linux.

MacOS uses `launchd` instead of `systemd`. See [Why MacOS no systemd](/2025/05/23/MacOS-no-systemd/) for details.

**Prepare a `.plist` file for launchd:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>wayne.frps.service</string>
    <key>ProgramArguments</key>
    <array>
        <string>frps</string>
        <string>-c</string>
        <string>$HOME/.config/frp/frps.toml</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/log/frps.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/log/frps.err</string>
</dict>
</plist>
```

> **Notes:**
> 1. **Label names must be unique.** I recommend using `[username].[service name].plist`, e.g., `wayne.frps.plist`.
> 2. **Set log output paths.** MacOS does not use `systemd`, so specify log files for easier management. Using `/tmp/log` is recommended for temporary logs.

**Save the `.plist` file to `~/Library/LaunchAgents`:**
```bash
zsh -c 'cat > ~/Library/LaunchAgents/[service name].plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>wayne.frps.service</string>
    <key>ProgramArguments</key>
    <array>
        <string>frps</string>
        <string>-c</string>
        <string>$HOME/.config/frp/frps.toml</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/log/frps.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/log/frps.err</string>
</dict>
</plist>
EOF'
```

**Start your service:**
```bash
launchctl load ~/Library/LaunchAgents/com.example.myservice.plist
```

To stop the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.example.myservice.plist
```

## Check Your Service

### Linux

**Check status:**
```bash
systemctl status frps
```

```
root@cc:~/.config/frp# systemctl status frps
● frps.service - Frps Service
     Loaded: loaded (/etc/systemd/system/frps.service; disabled; preset: enabled)
     Active: active (running) since Sun 2025-05-18 21:52:56 CST; 4 days ago
   Main PID: 152022 (frps)
      Tasks: 4 (limit: 495)
     Memory: 13.3M
        CPU: 2min 4.976s
     CGroup: /system.slice/frps.service
             └─152022 /root/workspace/frp/frp/frps -c /root/workspace/frp/frp/frps.toml
```

**Check logs:**
Use `journalctl`:
```
journalctl -u frps.service -f
```

```bash
root@cc:~/.config/frp# journalctl -u frps.service -f
May 23 14:25:23 cc.liweijun.online frps[152022]: 2025-05-23 14:25:23.774 [I] [proxy/proxy.go:204] [adda54ea2d549aaa] [file] get a user connection [[::1]:47108]
May 23 14:25:27 cc.liweijun.online frps[152022]: 2025-05-23 14:25:27.894 [I] [proxy/proxy.go:204] [adda54ea2d549aaa] [file] get a user connection [127.0.0.1:59564]
```

**Check port usage:**
```bash
lsof -i:7000
```

### MacOS

**Check status:**
```bash
launchctl list | grep "frp"
PID     Status  Label
84150   0       wayne.frpc.service
```
If PID is `-` and Status is `1`, the process failed to start.

**Check logs:**
```bash
tail -n 4 /tmp/log/[name].log
2025/05/23 11:49:21 /api/renew: 401 103.156.242.226 <nil>
2025/05/23 12:00:20 Caught signal terminated: shutting down.
2025/05/23 12:00:20 accept tcp [::]:8090: use of closed network connection
2025/05/23 12:00:33 Listening on [::]:8090
```
Where `-n` specifies the number of lines to print.

## Deploy FRP Client

## Install FRP

Follow the same steps as for the server.

## Configure `frpc`

Your config file is at `~/.config/frp/frpc.toml` (already set up):

```text
serverAddr = "[your server's public IP or domain]"
serverPort = 7000
# If you changed the default server port, update it here as well

[[proxies]]
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 2222

[[proxies]]
name = "wordpress"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8080
remotePort = 8080

[[proxies]]
name = "file"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8090
remotePort = 8090

[[proxies]]
name = "navidrome"
type = "tcp"
localIP = "127.0.0.1"
localPort = 4533
remotePort = 4533
```

> **Note:** Avoid mapping your local port 22 to remote port 22:
> - The remote port 22 is usually occupied by sshd.
> - For security, port 22 should be hidden.

## Run `frpc` in the Background

Register your `.plist` (MacOS) or `.service` (Linux) in the appropriate location.

### Linux

```text
[Unit]
Description=Frps Service
After=network.target
Wants=network.target

[Service]
Type=simple
WorkingDirectory=$HOME/.config/frp
ExecStart=frpc -c $HOME/.config/frp/frpc.toml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

### MacOS

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>wayne.frps.service</string>
    <key>ProgramArguments</key>
    <array>
        <string>frpc</string>
        <string>-c</string>
        <string>$HOME/.config/frp/frpc.toml</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/log/frps.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/log/frps.err</string>
</dict>
</plist>
```

## Check Your Service

Same as above.  
[See section 1.5](#Check-Your-Service)
