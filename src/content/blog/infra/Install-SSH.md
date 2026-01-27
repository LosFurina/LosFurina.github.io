---
title: Install and Config SSH Connection
description: "Auto-generated description for Install and Config SSH Connection"
pubDate: 2026-01-23
---

# 1. Install SSH

It is very easy, I strongly recommend you install it on Linux or [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)(Windows Subsystem for Linux), I will record how to install WSL at: How to install WSL . And I will give you my reasons Why Stop Coding on Windows.

Almost all Released Versions of Linux have already installed SSH, but if you find there is no SSH for you computer, just install it from apt.

```bash
sudo apt install openssh-server
```

Check status of ssh:

```bash
sudo systemctl status ssh
```

If you find result below, you are successful.

```yaml
● ssh.service - OpenBSD Secure Shell server
   Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2024-11-12 10:21:34 UTC; 1min 32s ago
```

you can restart ssh make sure it work.

```bash
sudo systemctl restart ssh
```

# 2. Config SSH

LATER To speak of, almost all Cloud Server Retails set Firewall to protect your safety, if port 22 is closed, you will never connect to your server, please make sure you open at lease port 22. I will introduce it: How to set Firewall.

There are two methods to verify your identification:

LATER Password: How to set SSH login password

SSH-key:How to set SSH key pair

LATER I will introduce Asymmetric Encryption at here.

After we generate a SSH key pair, we will find key pair file at:

```path
~/.ssh/id_{encrypt_method}
~/.ssh/id_{encrypt_method}.pub
```

`id_{encrypt_method}` is your private key, please remember never leak this file to anyone.

`id_{encrypt_method}.pub` is your public key, you should upload it to your Cloud Server.

LATER Here is How to upload a file to Remote Server.

Besides, we can copy the content of `id_{encrypt_method}.pub` to `~/.ssh/authorized_keys` directly, to speak of, this file can contain many public keys, every key just occupies one line.
For example:

```yaml
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICUcN+UpNbVOI9pHj796/Sd4+iHbAdBOQvSPq example@proton.me
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICUcN+UpNbVOI9pHj796/Sd4+iHbAdBOQvSPq example@proton.me
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICUcN+UpNbVOI9pHj796/Sd4+iHbAdBOQvSPq example@proton.me
```

# 3. Connect Remote Server

LATER Next, we can connect our server through SSH key without password. This is very useful, for example, we can Control Remote Server to Execute Command through SSH Connection without Login.

Now, let's test our connection:

```bash
ssh user@your-server-ip
```

Now, we have finished SSH Connection.

If there are any other question, I will add at here.

