---
title: "/etc/systemd/system"
description: "systemd unit 文件放置在 /etc/systemd/system 的原因与管理方式说明。"
pubDate: "2025-02-18"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Run the command in the background.md"
sourceVault: "obsidian/note"
slug: "infra/etc-systemd-system-obsidian"
---
- Sometimes, you really need those server-wide program to run in background, because you need to avoid some accidents to interrupt our service program.
- There are some methods I will introduce here:
	- `tmux`: #BasicLinuxCommand

		- `tmux new -s [tty-name]`: start a new tty window with your set name

		- `tmux attach -t [tty-name]`: attach a existing tmux tty with name

		- `crtl + b` and then `d`: exit tmux tty but keep it in background

			- Note:but this command or we call it shortcut sometimes don't work, if I find the reason, I will update here.

	- `nohup`: #BasicLinuxCommand

		- `nohup ./my_script.sh &`

		- `nohup ./my_script.sh > output.log 2>&1 &`

	- <span style="color:red">systemctl</span> #BasicLinuxCommand 

	  I recommend you use `systemctl`, but that is not absolute, different methods have different using scenario. Because we can easily control services via simple commands, and all the journal will be set at journalctl. ==But if you don't have root authority==, you should give up this method.
		- Make sure your basic service command is workable.

		  ```bash
		  ./bin/x64/factorio --start-server ./saves/SA_Multi.zip
		  ```
		- Register this command to `systemctl`

			  ```bash
			  # /etc/systemd/system
			  # This folder contains all the services that can be managed by systemctl
			  cd /etc/systemd/system
			  ls
			  ```
			  `[Image omitted: image.png | source: ../assets/image_1731487541419_0.png]`
			- Make our own service unit:

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
			- Reload systemctl daemon:

			  ```bash
			  systemctl daemon-reload
			  ```
		- Start our service:

		  ```bash
		  systemctl start factorio
		  # If you would like set your service startup automatically when OS boot.
		  # $ systemctl enable factorio
		  systemctl status factorio
		  ```
		  `[Image omitted: image.png | source: ../assets/image_1731488017641_0.png]`
		- Review our journal: `journalctl` #BasicLinuxCommand 

		  ```bash
		  journalctl -u factorio.service -f
		  # -u: unit name
		  # -f follow
		  ```
		  `[Image omitted: image.png | source: ../assets/image_1731488142366_0.png]`
