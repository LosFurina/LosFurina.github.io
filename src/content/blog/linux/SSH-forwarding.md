---
title: Connect your Remote Service from SSH forwarding
description: "Auto-generated description for Connect your Remote Service from SSH forwarding"
pubDate: 2026-01-23
---

# Introduction

Connect your private service from SSH is really meaningful, if you visit your Personal Document/Information/Private Key, this is a good method.

# 1. Start your remote service on your cloud computer


We can see that our opened service is a web service, to speak of, I have already deploy my service on https, if you have not deploy your ssl certification, the best way is accessing your service from ssh forwarding.


# 2. Install and Config SSH Connection



# 3. Connect SSH and Set SSH forwarding

We can easily get your external IP from your VPS server.

Now, we just use ssh -L command. 

```bash
ssh -L 7777:127.0.0.1:7777 root@gcp.liweijun.online
```

> The `-L` option in SSH stands for local port forwarding.
ssh -L [local_port]:[remote_address]:[remote_port] [user]@[ssh_server]

`local_port`: The port on your local machine where the forwarded connection will be available.

`remote_address`: The target address you want to reach from the remote server. This can be `localhost` or any address accessible from the remote server.

`remote_port`: The port number of the service you want to access on the remote address.

`user`@[ssh_server]: The username and address of the SSH server you are connecting to.

Why 127.0.0.1: After we connected cloud computer, the remote ip address for "ali.liweijun.online" is itself, so we can replace it with "localhost".

# 4. Try it


We now connect our server successfully.

Show our local port:

Connect it from browser:

```bash
127.0.0.1:7777
```


We success now.

