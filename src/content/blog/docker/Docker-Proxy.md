---
title: Configure Docker Daemon Proxy
description: "Set HTTP/HTTPS proxy in Docker daemon.json and restart Docker to fix restricted-network pull failures."
pubDate: 2026-01-23
---

Sometimes, you may encounter network problems, at this time, you need set proxy through `daemon` file of docker.

## Daemon Config

The config file of docker located at: `/etc/docker/daemon.json`

If the config file doesn't exit, you should create one.

And past the content below to the config file.

```json
{
  "proxies": {
    "http-proxy": "http://proxy.example.com:3128",
    "https-proxy": "https://proxy.example.com:3129",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}
```

## Restart Docker

```bash
sudo systemctl restart docker
```

## Reference

> https://docs.docker.com/engine/daemon/proxy/
