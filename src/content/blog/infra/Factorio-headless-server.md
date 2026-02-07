---
title: How to Establish Factorio Linux Server from scratch
description: "Auto-generated description for How to Establish Factorio Linux Server from scratch"
pubDate: 2026-01-23
---

## 1. Purchase a Cloud Computer

Before starting, purchase an **Elastic Compute Service (ECS)** instance from a provider like Alibaba Cloud. For a smooth Factorio experience, ensure you have at least 2GB of RAM (4GB+ is recommended for heavily modded games).

## 2. Connect to Your Server

### 2.1 Login via Alibaba Cloud Console

Log in to the Alibaba Cloud dashboard, navigate to the **ECS Control Console**, and locate your running instance. You can use the browser-based terminal, but for long-term management, a dedicated SSH client is better.

### 2.2 Login via SSH

For beginners on Windows, I recommend **FinalShell**—it is free and provides a convenient file manager alongside the terminal. Alternatively, you can use **VS Code** (with the Remote SSH extension) or **PowerShell**.

You can log in using the root password you set during the instance creation, or for better security, use an **SSH Key Pair**.

## 3. Download the Factorio Headless Server

If your server is located in mainland China, you may encounter slow speeds when downloading from external sites. You may need to use a proxy or download the file locally and upload it.

### Step 3.1: Direct Download

Navigate to the [Factorio Official Website](https://www.factorio.com/) to find the latest Headless Server URL. Use `wget` to download it directly to your server:

```bash
wget https://www.factorio.com/get-download/2.0.15/headless/linux64 -O factorio.tar.xz

```

### Step 3.2: Extract the Files

We will move the archive to `/opt/` and extract it. Using `/opt/` is standard practice for manual software installations.

```bash
sudo tar -xJf ./factorio.tar.xz -C /opt/
cd /opt/factorio

```

## 4. Configure the Factorio Server

### 4.1 Update the Game

To keep your server current, you can use a community-made updater. Ensure you have **Python 3** installed first.

```bash
git clone https://github.com/narc0tiq/factorio-updater.git
python3 ./factorio-updater/update_factorio.py -xDa ./bin/x64/factorio

```

### 4.2 Initialize a New Save

Create a fresh world to generate the necessary directory structure:

```bash
./bin/x64/factorio --create ./saves/my-save.zip

```

### 4.3 Upload Existing Saves and Mods

If you have a local save or mods, upload them to the server:

* **Saves:** Upload to `/opt/factorio/saves/` (Local Windows path: `%AppData%\Factorio\saves`)
* **Mods:** Upload to `/opt/factorio/mods/`

Using **FinalShell**, you can simply drag and drop these files into the respective folders.

### 4.4 Server Settings

To make your server public in the browse list, edit `/opt/factorio/data/server-settings.json`. You must enter your Factorio username and token (found on your [Factorio Profile](https://www.factorio.com/profile)).

## 5. Start and Secure Your Server

### 5.1 Launch the Server

To start the game using a specific save and your custom settings, run:

```bash
./bin/x64/factorio --start-server ./saves/SA_Multi.zip --server-settings ./data/server-settings.json

```

### 5.2 Configure the Firewall

By default, cloud providers block most ports. You must go to the **Security Group** settings in the Alibaba Cloud console and open the following:

* **SSH:** Port 22 (TCP) - To connect to your server.
* **Factorio:** Port 34197 (UDP) - This is the default game port.

### 5.3 Verify Connection

You can check if the server is listening correctly by running:

```bash
sudo netstat -tulnp | grep factorio

```

To test if the port is open from your local machine, use:

```bash
nc -zvu <Your-Server-IP> 34197

```

Now, you are ready to automate the factory!

---
