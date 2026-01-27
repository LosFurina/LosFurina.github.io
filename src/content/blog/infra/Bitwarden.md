---
title: How to install Bitwarden
description: "Auto-generated description for How to install Bitwarden"
pubDate: 2026-01-23
---

# Introduction

An alternative server implementation of the Bitwarden Client API, written in Rust and compatible with official Bitwarden clients disclaimer, perfect for self-hosted deployment where running the official resource-heavy service might not be ideal. Click Here to visit the [official website](https://github.com/dani-garcia/vaultwarden)

# Install Vaultwarden

## Install Docker

Click [here](/2025/05/22/How-to-install-Docker-officially/?highlight=docker) for more details.

## Install Vaultwarden

**Docker compose:**

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    environment:
      DOMAIN: "https://vw.domain.tld"
    volumes:
      - ./vw-data/:/data/
    ports:
      - 8081:80
```

# Start the service

```bash
docker compose up -d
```

# Get ssl certificate

Click [here](/2025/05/22/Get-SSL-Certificates/) for more details.

# Set certificate to your nginx config

```config
server {
    listen 443 ssl;
    server_name vw.domain.tld;

    ssl_certificate /etc/letsencrypt/live/vw.domain.tld/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vw.domain.tld/privkey.pem;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

# Restart nginx

```bash
systemctl restart nginx
```
# Access Vaultwarden

Open your web browser and navigate to `https://vw.domain.tld`. You should see the Vaultwarden login page.

# References

> [Vaultwarden GitHub Repository](https://github.com/dani-garcia/vaultwarden)
