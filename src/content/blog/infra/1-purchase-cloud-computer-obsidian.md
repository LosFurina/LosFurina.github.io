---
title: "云服务器购买与 SSH 连接实操（Factorio 场景）"
description: "从购买云服务器到 SSH 登录，再到下载 Factorio Headless Server 的完整流程。"
pubDate: "2025-01-07"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/SelfHosting/How to Establish Factorio Linux Server from scratch.md"
sourceVault: "obsidian/note"
slug: "infra/1-purchase-cloud-computer-obsidian"
---
## 1. Purchase Cloud Computer
## 2. Connect to your Cloud Computer
### 2.1. Login via Ali Cloud

		- `[Image omitted: image.png | source: ../assets/image_1731405399637_0.png]`
		- `[Image omitted: image.png | source: ../assets/image_1731405136586_0.png]`
		- First, we find ==Dashboard== in main menu of aliyun and click it.
		- `[Image omitted: image.png | source: ../assets/image_1731405234536_0.png]`
		- Find your ESC control console.
		- `[Image omitted: image.png | source: ../assets/image_1731405283370_0.png]`
		- This is our ESC established just before.
### 2.2. Login via SSH

		- There are some methods for you to select, if you are a beginner, I recommend you use ==Finalshell==, this a free app on windows. And our tutorial will continue with finalshell.

			- Login in via some other shell tool: [Finalshell](https://www.hostbuf.com/)

			- Login in via VS Code: [Visual Studio Code](https://code.visualstudio.com/)

			- Login in via powershell: A powerful powershell

		- Before we start login our remote serve, we need to know, except login with your ssh password that you have just set it above, you also can login through a Key Pair - [SSH key](https://www.ssh.com/academy/ssh-keys).

		- Click here for more details about install and config ssh Install and Config SSH Connection .

## 3. Download Factorio Headless Server
	- Out of the impact of ==GFW== in China, it will be difficult for you to download some external website resource.
	- Note:I will introduce some methods to go through the block of government. Methods of Proxy

	- **Now, let's start.**
		- Go to official [Factorio website](https://www.factorio.com/) and find button of download Headless Server. `[Image omitted: image.png | source: ../assets/image_1731479732262_0.png]` `[Image omitted: image.png | source: ../assets/image_1731479767983_0.png]`

		- Then, we'll find it at out `Download` folder.

		  `[Image omitted: image.png | source: ../assets/image_1731479868571_0.png]`
		- We absolute can download it directly.

			- Copy the download url:

			  `[Image omitted: image.png | source: ../assets/image_1731479962018_0.png]`
			- Then, we use `wget` #BasicLinuxCommand download it directly on our server.

			  ```bash
			  wget https://www.factorio.com/get-download/2.0.15/headless/linux64
			  ```
		- Note:If you Download it at your windows platform, then you should upload it to your server. How to upload a file to Remote Server

		- No matter how you download, we should put it more ==normatively==.

			- I strongly recommend you settle that `.xz` file at `~/Download`.

		- Extract .xz file with `tar` #BasicLinuxCommand.

			- Please remember that now we are operating inder ==root== user.

			  ```bash
			  sudo tar -xJf ./factorio.tar.xz -C /opt/
			  ```
			- Make sure operation consistent, we extract `.xz` file to `/opt/`.

			  `[Image omitted: image.png | source: ../assets/image_1731481211773_0.png]`
			- Then we'll find it at `/opt/factorio`

			  `[Image omitted: image.png | source: ../assets/image_1731481291594_0.png]`
## 4. Configure Factorio Server
	- Clone Factorio Updater: [Github Link](https://github.com/narc0tiq/factorio-updater)

	  ```bash
	  git clone https://github.com/narc0tiq/factorio-updater.git
	  ```
	  `[Image omitted: image.png | source: ../assets/image_1731481660812_0.png]`
	- Note:Update game:

	  Before we update it, you must have python installed: How to install python 
	  ```bash
	  python3 ./factorio-updater/update_factorio.py -xDa ./factorio/bin/x64/factorio
	  ```
	  `[Image omitted: image.png | source: ../assets/image_1731481783079_0.png]`
	- Initial game:

	  ```bash
	  ./bin/x64/factorio --create ./saves/my-save.zip       # This creates a new save, as if by clicking the New Game button in the GUI
	  ```
	  `[Image omitted: image.png | source: ../assets/image_1731481984326_0.png]`
	  Then we will find our game directory has been changed - there are some added file:
	  `[Image omitted: image.png | source: ../assets/image_1731482029861_0.png]`
	- Upload our local saves to `RemoteServer:/opt/factorio/saves/xxx.zip`.

	  `scp` #BasicLinuxCommand
	  ```bash
	  scp ./SA_Multi.zip root@47.116.182.195:/opt/factorio/saves
	  ```
	  `[Image omitted: image.png | source: ../assets/image_1731482341680_0.png]`
	  `[Image omitted: image.png | source: ../assets/image_1731482498326_0.png]`
	   
	  If your saves file are at Windows, you can find them at: `~/AppData/Roaming/Factorio/saves`
	- Upload our mods file to Remote Server:

	  This time, we directly drag all file to `/opt/factorio/mods/` with finalshell.  
	  
	  `[Image omitted: fac.gif | source: ../assets/fac_1731483270671_0.gif]`
	- Configure some server setting:

		- If you want publish your game to Factorio Host Hall, which means everyone can see your server from Multiplayer-FindPublishGame. You need set `/opt/factorio/data/server-settings.json`

		  
		  `[Image omitted: image.png | source: ../assets/image_1731483672196_0.png]`
		  You MUST input your Username and Password, you can search it at [Official Factorio Profile](https://www.factorio.com/profile)
		  `[Image omitted: fac2.gif | source: ../assets/fac2_1731483809477_0.gif]`
## 5. Start Your Server
	- **Start your server**

		- Using a simple command:

		  ```bash
		  ./factorio/bin/x64/factorio --start-server ./saves/SA_Multi.zip
		  # You can also publish your game with:
		  ./factorio/bin/x64/factorio --start-server ./saves/SA_Multi.zip --server-settings ./data/server-settings.json
		  ```
		- Run the command in the background

	- **Open your port**

	  
	  
		- **In this section, we need know which port should be opened.** We can find it at [Official Factorio Multiplayer Wiki](https://wiki.factorio.com/Multiplayer)

		  
		  `[Image omitted: image.png | source: ../assets/image_1731484036277_0.png]`
		  It is not hard to find.
		- **And we also can find it after we start our server.**

		  `[Image omitted: image.png | source: ../assets/image_1731484243000_0.png]`
		- **We also can use `netstat` to find it**: #BasicLinuxCommand 

		  ```bash
		  sudo netstat -tulnp | grep $(pgrep -o factorio)
		  ```
		  `[Image omitted: image.png | source: ../assets/image_1731484484456_0.png]`
		- **Then, we need find who is controlling your port**, in AliCloud, we can change it through control plate ==Security Group==:

		  `[Image omitted: image.png | source: ../assets/image_1731484569550_0.png]`
		  `[Image omitted: image.png | source: ../assets/image_1731484838462_0.png]`
		  Remember open both ==TCP== and ==UDP==, in fact, factorio just uses UDP.
		- **We can test whether the ports are work**: `nc` #BasicLinuxCommand 

		  ```bash
		  nc -zvu 47.116.182.195 34197
		  ```
		  `[Image omitted: image.png | source: ../assets/image_1731485120681_0.png]`
		- **Now, the setup is complete.**
