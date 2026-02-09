---
title: "Deploy FRP Server on Linux"
description: "记录 FRP 服务端部署流程，包括安装、配置、systemd 托管与基础连通性验证。"
pubDate: "2025-11-21"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/How to penetrate NAT via FRP.md"
sourceVault: "obsidian/note"
slug: "infra/1-deploy-frp-server"
---
## 1. Deploy FRP Server

## 1.1. Install FRP

Official Repository：[FRP](https://github.com/fatedier/frp)

Download the latest program for your operating system and architecture from the [Release](https://github.com/fatedier/frp/releases) page. Here, we take linux amd64 as example:
```bash
wget
https://github.com/fatedier/frp/releases/download/v0.62.1/frp_0.62.1_linux_amd64.tar.gz
```

Then we can see:

```sh
root@cc:~/download# ls
frp_0.62.1_linux_amd64.tar.gz
```

Using `tar` to extract: more indormation about tar

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

In order to use it conveniently:

```bash
root@cc:~/download# mv ./frp_0.62.1_linux_amd64 ./frp
root@cc:~/download# ls
frp  frp_0.62.1_linux_amd64.tar.gz
```

At here, I <span style="color: red;">Recommand you register</span> `frp` to any `bin` directory.

Where:

**If yo are root user(or with `sudo`) and would like install app for all users:**

```bash
root@cc:~/download# cd frp/
root@cc:~/download/frp# mv frpc frps /usr/local/bin/
root@cc:~/download/frp# source ~/.bashrc
root@cc:~/download/frp# which frps
/usr/local/bin/frps
```

**If you are a user without `sudo`**

```bash
# Create this folder if it's doesn't exist.
mkdir -p ~/.local/bin
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

==Notice==: it's not absolute, installing to `$HOME/bin/` is also ok, but before that you need know what you are doning.
==Notice==: I take `.bashrc` as example, if your shell is different with me, you have to change it.

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

Now, you've installed `frp` successfully.

## 1.2. Set config file for `frps`

Set config file at `~/.config/frp` for convenient management:

```bash
root@cc:~/download/frp# mkdir -p $HOME/.config/frp
root@cc:~/download/frp# cp frps.toml frpc.toml ~/.config/frp/
```

Edit `frps.toml`:
```vim
bindPort = 7000 
# set to your port, default port is 7000
```

## 1.3. Run `frps` at background (Debian/Ubuntu)

==NOTE==: You need `sudo` authority.

More information: [Run at background]()

We use [systemd](https://wiki.ubuntu.com/systemd) to manage our services app.

Now, we need prepare a service file `frps.service` for systemd:

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

You can use vim or other method write this service file to: `/etc/systemd/system/`

I offer a general method:

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

Now, you can strat your `frps` service via:

```bash
# set auto start when booting
sudo systemctl enable frps.service
# start service
sudo systemctl start frps.service
```

## 1.4. Run `frps` at background (MacOS)

==NOTE==: You have no need for `sudo` authority, that is totally different from `linux`

The only difference is MacOS doesn't manage service through `systemd`
Why MacOS no systemd
More information: [click]()

But we can use `launchd`:

**First, prepare `.plist` file for launchd:**

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

**Note:**
1. **Label name must be unique from all existing services.** Therefore, I recommend you name your service after: `[username whoes create this service].[service name].plist`. For example: `wayne.frps.plist`. You absolutely can name your service as you like.
2. **Remember to set a log output path.** Different from `Debian/Ubuntu`, macOS doesn't support `systemd`. Set a log path for easier management. I recommend `/private/tmp/log` or `/tmp/log` because temporary files are cleaned after restart. If logs are important for auditing, store them outside `tmp`.

**Second, echo your prepared `.plist` file to `~/Library/LaunchAgents`**

==Note==: MacOS's default shell is `zsh`

I also offer the smae method:

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

**Third, run your service:**

```bash
launchctl load ~/Library/LaunchAgents/com.example.myservice.plist
```

If you'd like stop your service:

```bash
launchctl unload ~/Library/LaunchAgents/com.example.myservice.plist
```

## 1.5. Check your service

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

**Check log:**

I recommend to use `journalctl` to check log output:

```
journalctl -u frps.service -f
```

```bash
root@cc:~/.config/frp# journalctl -u frps.service -f
May 23 14:25:23 cc.liweijun.online frps[152022]: 2025-05-23 14:25:23.774 [I] [proxy/proxy.go:204] [adda54ea2d549aaa] [file] get a user connection [[::1]:47108]
May 23 14:25:27 cc.liweijun.online frps[152022]: 2025-05-23 14:25:27.894 [I] [proxy/proxy.go:204] [adda54ea2d549aaa] [file] get a user connection [127.0.0.1:59564]
```

**Check port occupation status:**

```bash
lsof -i:7000
```

### MacOS

**Check status:**

```bash
~ » launchctl list | grep "frp"
PID     Status  Label
84150   0       wayne.frpc.service
```

where, PID is a flag for whether the process running successfully, when pid='-' and Status='1' means fail to run.

**Check log:**

Still remember I notice you to set a log output path?

```bash
~ tail -n 4 /tmp/log/[name].log
2025/05/23 11:49:21 /api/renew: 401 103.156.242.226 <nil>
2025/05/23 12:00:20 Caught signal terminated: shutting down.
2025/05/23 12:00:20 accept tcp [::]:8090: use of closed network connection
2025/05/23 12:00:33 Listening on [::]:8090
```

where, `-n` means number of line you need to print.

## 2. Deploy FRP Client

## 2.1. Install FRP

Same as above when installing FRP server.

## 2.2. Set config file for frpc

Your config file is at `~/.config/frp/frpc.toml`, we already set it.

```text
serverAddr = "[your server's public ip or domain]"
serverPort = 7000
# if you change the default server port, remember also change it here

proxies
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 2222

proxies
name = "wordpress"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8080
remotePort = 8080

proxies
name = "file"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8090
remotePort = 8090

proxies
name = "navidrome"
type = "tcp"
localIP = "127.0.0.1"
localPort = 4533
remotePort = 4533
```

==Note==: Avoid reflecting your local **22** port to remote 22 port:
- First, your remote 22 port must have been occupied by sshd.
- Second, for your data safety, 22 port should be hidden.

## 2.3. Run frpc at background

**Register your `.plist`(MacOS) or `.service`(Linux) at corresponding location.**

### Linux:

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

## 2.4. Check your service

Same as above.

[click]()
