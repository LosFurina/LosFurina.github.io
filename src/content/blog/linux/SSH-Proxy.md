---
title: SSH over SOCKS5 Proxy
description: "Connect to remote servers through a SOCKS5 proxy using SSH ProxyCommand on Linux or terminal clients on Windows."
pubDate: 2026-01-23
---

## Introduction

As we all know, sometimes, it's hard for us to connect our remote server directly or the connection is not stable, we have to conduct some method to access our remote server.

## Method

### Using some 3rd party application

[FinalShell](https://www.hostbuf.com/): We can set proxy directly

### Windows

It's not friendly to Windows

Note: on Windows, an easy option is using PuTTY/FinalShell and configuring the SOCKS5 proxy in the client settings.

### Linux

We can use `nc` and `ssh` itself to proxy ssh trafic.
```bash
ssh -o "ProxyCommand=nc -x socks_proxy_host:socks_proxy_port %h %p" user@remote_host
```

```bash
(base) firstsnow@DESKTOP-7DDCJ5H:~/.ssh$ ssh -o "ProxyCommand=nc -x 192.161.0.101:7897 %h %p" root@xyz.xxxxx.online
The authenticity of host 'xyz.xxxxx.online (<no hostip for proxy command>)' can't be established.
RSA key fingerprint is SHA256:As8XEpRKA0TtNH5poEgpTI5LqZmId0WZnQowWqJMcME.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'cc2.liweijun.online' (RSA) to the list of known hosts.
root@cc2.liweijun.online's password:
Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-46-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage


 * Super-optimized for small spaces - read how we shrank the memory
   footprint of MicroK8s to make it the smallest full K8s around.

   https://ubuntu.com/blog/microk8s-memory-optimisation

261 updates can be applied immediately.
174 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

New release '24.04.1 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


Last login: Mon Jan  6 22:20:31 2025 from 66.103.216.183
root@cc2:~# whoami
root
```

NOTE: If you can't access your server through `proxy`, that could because your proxy service banned traffic through port 22. The best way is to find and change a proxy server merchant who allow traffic through port 22.
