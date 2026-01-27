---
title: Run the command in the background
description: "Auto-generated description for Run the command in the background"
pubDate: 2026-01-23
---

# Introduction

Sometimes, you really need those server-wide program to run in background, because you need to avoid some accidents to interrupt our service program.

There are some methods I will introduce here:

## 1. tmux: 

1. `tmux new -s [tty-name]`: start a new tty window with your set name

2. `tmux attach -t [tty-name]`: attach a existing tmux tty with name

3. `crtl + b` and then `d`: exit tmux tty but keep it in background

LATER but this command or we call it shortcut sometimes don't work, if I find the reason, I will update here.

## 2. nohup: 

1. `nohup ./my_script.sh &`

2. `nohup ./my_script.sh > output.log 2>&1 &`

## 3. <span style="color:red">systemctl(Systemd)</span>

<span style="font-size: 150; font-weight: bold; color: yellow">TODO: MacOS: launchctl(launchd)</span>
 

I recommend you use `systemctl`, but that is not absolute, different methods have different using scenario. Because we can easily control services via simple commands, and all the journal will be set at journalctl. But if you don't have root authority, you should give up this method.

Make sure your basic service command is workable.
```bash
./bin/x64/factorio --start-server ./saves/SA_Multi.zip
```

Register this command to `systemctl`

```bash
# /etc/systemd/system
# This folder contains all the services that can be managed by systemctl
cd /etc/systemd/system
ls
```


Make our own service unit:
```bash
touch factorio.service
```
and put this example into this file:

```ini
[Unit]
Description=Factorio Server
After=network.target

[Service]
Type=simple
User=root
#WorkingDirectory=/opt/factorio/  # this is your program working directioy
ExecStart=/opt/factorio/bin/x64/factorio --start-server /opt/factorio/saves/SA_Multi.zip
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Reload systemctl daemon:
```bash
systemctl daemon-reload
```

Start our service:
```bash
systemctl start factorio
# If you would like set your service startup automatically when OS boot.
# $ systemctl enable factorio
systemctl status factorio
```

Review our journal: `journalctl`  
```bash
journalctl -u factorio.service -f
# -u: unit name
# -f follow
```


