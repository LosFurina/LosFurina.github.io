---
title: Execute Remote Commands via SSH Without Interactive Login
description: "Run one-off commands on remote servers through SSH directly from local terminal scripts."
pubDate: 2026-01-23
---

Use SSH to run remote commands directly without opening an interactive shell session.

## Basic Usage

```bash
ssh user@remote-host "uptime"
```

## Practical Examples

```bash
ssh root@server "systemctl status docker --no-pager"
ssh dev@host "cd /srv/app && git pull && docker compose up -d"
```

## Notes

- Quote the remote command to avoid local shell expansion.
- Prefer SSH keys for automation and CI jobs.
