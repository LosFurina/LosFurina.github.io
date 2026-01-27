---
title: Deploy 3X-UI and Network Proxy against Network Sanction
description: "Auto-generated description for Deploy 3X-UI and Network Proxy against Network Sanction"
pubDate: 2026-01-23
---

# Introduction

**3X-UI can help us deploy network proxy easily, especially for those who live in district with restricted network sanction.**


# Install 3X-UI

Official project location: {% btn 'https://github.com/MHSanaei/3x-ui', 3x-ui %}

## 1. Install with official script

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANiZ4DYkyGWLMbUdm-DRA3ab9X-No8AAuTFMRvxdglUgf_oa3-4ywMBAAMCAAN4AAM2BA)


**Until this show up**

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANjZ4DY2ekztb9MvMoDAijTgQRBsBkAAuXFMRvxdglU-CTqSTD6Iq8BAAMCAAN5AAM2BA)


# Config 3x-ui

**Before that, you need a domian for yourself.**

**You can register a domin at:** {% btn "https://www.godaddy.com/" GoDaddy %}

## 1. Add a DNS record to your remote server. 

**I take Cloudflare as an example.**

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANkZ4DdghZkbRJJb_CVfE-m_pZ1lugAAuvFMRvxdglUpfFMUsfCNyoBAAMCAAN5AAM2BA)

- You best check it whether work.

```bash
root@s27953:~# ping claw.liweijun.online
PING claw.liweijun.online (47.79.84.144) 56(84) bytes of data.
64 bytes from 47.79.84.144: icmp_seq=1 ttl=64 time=1.62 ms
64 bytes from 47.79.84.144: icmp_seq=2 ttl=64 time=1.60 ms
64 bytes from 47.79.84.144: icmp_seq=3 ttl=64 time=1.57 ms
```

## 2. Get SSL Credential

```bash
root@s27953:~# x-ui
The OS release is: ubuntu

╔────────────────────────────────────────────────╗
│   3X-UI Panel Management Script                │
│   0. Exit Script                               │
│────────────────────────────────────────────────│
│   1. Install                                   │
│   2. Update                                    │
│   3. Update Menu                               │
│   4. Legacy Version                            │
│   5. Uninstall                                 │
│────────────────────────────────────────────────│
│   6. Reset Username & Password & Secret Token  │
│   7. Reset Web Base Path                       │
│   8. Reset Settings                            │
│   9. Change Port                               │
│  10. View Current Settings                     │
│────────────────────────────────────────────────│
│  11. Start                                     │
│  12. Stop                                      │
│  13. Restart                                   │
│  14. Check Status                              │
│  15. Logs Management                           │
│────────────────────────────────────────────────│
│  16. Enable Autostart                          │
│  17. Disable Autostart                         │
│────────────────────────────────────────────────│
│  18. SSL Certificate Management                │
│  19. Cloudflare SSL Certificate                │
│  20. IP Limit Management                       │
│  21. Firewall Management                       │
│  22. SSH Port Forwarding Management            │
│────────────────────────────────────────────────│
│  23. Enable BBR                                │
│  24. Update Geo Files                          │
│  25. Speedtest by Ookla                        │
╚────────────────────────────────────────────────╝

Panel state: Running
Start automatically: Yes
xray state: Running

Please enter your selection [0-25]: 18
        1. Get SSL
        2. Revoke
        3. Force Renew
        4. Show Existing Domains
        5. Set Cert paths for the panel
        0. Back to Main Menu
Choose an option: 1
[INF] install socat succeed... 
Please enter your domain name: claw.liweijun.online
[DEG] Your domain is: claw.liweijun.online, checking it... 
[INF] Your domain is ready for issuing certificates now... 
Please choose which port to use (default is 80): 
[ERR] Your input  is invalid, will use default port 80. 
[INF] Will use port: 80 to issue certificates. Please make sure this port is open. 
[Fri Jan 10 08:49:41 UTC 2025] Changed default CA to: https://acme-v02.api.letsencrypt.org/directory
[Fri Jan 10 08:49:41 UTC 2025] Using CA: https://acme-v02.api.letsencrypt.org/directory
[Fri Jan 10 08:49:41 UTC 2025] Standalone mode.
[Fri Jan 10 08:49:42 UTC 2025] Account key creation OK.
[Fri Jan 10 08:49:42 UTC 2025] Registering account: https://acme-v02.api.letsencrypt.org/directory
[Fri Jan 10 08:49:43 UTC 2025] Registered
[Fri Jan 10 08:49:43 UTC 2025] ACCOUNT_THUMBPRINT='yAhgWhzCXucSzZ7j6U8ZmiyvkEE'
[Fri Jan 10 08:49:43 UTC 2025] Creating domain key
[Fri Jan 10 08:49:43 UTC 2025] The domain key is here: /root/.acme.sh/claw.liweijun.online_ecc/claw.liweijun.online.key
[Fri Jan 10 08:49:43 UTC 2025] Single domain='claw.liweijun.online'
[Fri Jan 10 08:49:45 UTC 2025] Getting webroot for domain='claw.liweijun.online'
[Fri Jan 10 08:49:45 UTC 2025] Verifying: claw.liweijun.online
[Fri Jan 10 08:49:45 UTC 2025] Standalone mode server
[Fri Jan 10 08:49:47 UTC 2025] Pending. The CA is processing your order, please wait. (1/30)
[Fri Jan 10 08:49:51 UTC 2025] Success
[Fri Jan 10 08:49:51 UTC 2025] Verification finished, beginning signing.
[Fri Jan 10 08:49:51 UTC 2025] Let's finalize the order.
[Fri Jan 10 08:49:51 UTC 2025] Le_OrderFinalize='https://acme-v02.api.letsencrypt.org/acme/finalize/2161801365/342840476145'
[Fri Jan 10 08:49:52 UTC 2025] Downloading cert.
[Fri Jan 10 08:49:52 UTC 2025] Le_LinkCert='https://acme-v02.api.letsencrypt.org/acme/cert/035e0d95342e8d11ebb4475d14f2d2bef2f0'
[Fri Jan 10 08:49:52 UTC 2025] Cert success.
-----BEGIN CERTIFICATE-----
MIIDiTCCAxCgAwIBAgISA14NlTQujRHrtEddFPLSvvLwMAoGCCqGSM49BAMDMDIx
-----END CERTIFICATE-----
[Fri Jan 10 08:49:52 UTC 2025] Your cert is in: /root/.acme.sh/claw.liweijun.online_ecc/claw.liweijun.online.cer
[Fri Jan 10 08:49:52 UTC 2025] Your cert key is in: /root/.acme.sh/claw.liweijun.online_ecc/claw.liweijun.online.key
[Fri Jan 10 08:49:52 UTC 2025] The intermediate CA cert is in: /root/.acme.sh/claw.liweijun.online_ecc/ca.cer
[Fri Jan 10 08:49:52 UTC 2025] And the full-chain cert is in: /root/.acme.sh/claw.liweijun.online_ecc/fullchain.cer
[ERR] Issuing certificate succeeded, installing certificates... 
[Fri Jan 10 08:49:53 UTC 2025] The domain 'claw.liweijun.online' seems to already have an ECC cert, let's use it.
[Fri Jan 10 08:49:53 UTC 2025] Installing key to: /root/cert/claw.liweijun.online/privkey.pem
[Fri Jan 10 08:49:53 UTC 2025] Installing full chain to: /root/cert/claw.liweijun.online/fullchain.pem
[INF] Installing certificate succeeded, enabling auto renew... 
[Fri Jan 10 08:49:53 UTC 2025] Already up to date!
[Fri Jan 10 08:49:53 UTC 2025] Upgrade successful!
[INF] Auto renew succeeded, certificate details: 
total 16K
drwxr-xr-x 2 root root 4.0K Jan 10 08:49 .
drwxr-xr-x 3 root root 4.0K Jan 10 08:49 ..
-rw-r--r-- 1 root root 2.8K Jan 10 08:49 fullchain.pem
-rw------- 1 root root  227 Jan 10 08:49 privkey.pem
Would you like to set this certificate for the panel? (y/n): y
set certificate public key success
set certificate private key success
[INF] Panel paths set for domain: claw.liweijun.online 
[INF]   - Certificate File: /root/cert/claw.liweijun.online/fullchain.pem 
[INF]   - Private Key File: /root/cert/claw.liweijun.online/privkey.pem 
Access URL: https://claw.liweijun.online:2179/xxxxxxxxxx/
[INF] x-ui and xray Restarted successfully 
```


## 3. Visit your 3x-ui Dashboard 
1. Get your `3x-ui` dashboard url.

```bash
root@s27953:~# x-ui
The OS release is: ubuntu

╔────────────────────────────────────────────────╗
│   3X-UI Panel Management Script                │
│   0. Exit Script                               │
│────────────────────────────────────────────────│
│   1. Install                                   │
│   2. Update                                    │
│   3. Update Menu                               │
│   4. Legacy Version                            │
│   5. Uninstall                                 │
│────────────────────────────────────────────────│
│   6. Reset Username & Password & Secret Token  │
│   7. Reset Web Base Path                       │
│   8. Reset Settings                            │
│   9. Change Port                               │
│  10. View Current Settings                     │
│────────────────────────────────────────────────│
│  11. Start                                     │
│  12. Stop                                      │
│  13. Restart                                   │
│  14. Check Status                              │
│  15. Logs Management                           │
│────────────────────────────────────────────────│
│  16. Enable Autostart                          │
│  17. Disable Autostart                         │
│────────────────────────────────────────────────│
│  18. SSL Certificate Management                │
│  19. Cloudflare SSL Certificate                │
│  20. IP Limit Management                       │
│  21. Firewall Management                       │
│  22. SSH Port Forwarding Management            │
│────────────────────────────────────────────────│
│  23. Enable BBR                                │
│  24. Update Geo Files                          │
│  25. Speedtest by Ookla                        │
╚────────────────────────────────────────────────╝

Panel state: Running
Start automatically: Yes
xray state: Running

Please enter your selection [0-25]: 10
[INF] current panel settings as follows:
Warning: Panel is not secure with SSL
username: qtQLAi8lhvdjv
password: V44qlC3Kfjeiofj
port: 2179
webBasePath: /MRRnOxxxFG17i7M/ 
Access URL: https://domain/MRRnOB6xxx7M/
```

2. Visit your dashboard through browser

- ==NOTE:== Please check your server's `ufw`, if 443 port has been closed, you should reopen it.

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANlZ4DhSBVd56vTV-7fTkiLr3af2mQAAvTFMRvxdglU-zcTGTAHqPcBAAMCAAN3AAM2BA)

3. Add a Inbound

- Trojan

Set as blow:
|   |   |
|---|---|
|  ![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANmZ4DomE0_4NQywmVNz8srBue10UwAAgjGMRvxdglU566G_Hx8qeMBAAMCAAN4AAM2BA) |  ![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANnZ4DoooTnqVu-ppikpmhMhD3WI1YAAgnGMRvxdglUim77zhK01QkBAAMCAAN5AAM2BA) |

- Vless

Set as below:
|   |   |
|---|---|
| ![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANoZ4DqyuApC5RR3Drsf23g-uI7C44AAh_GMRvxdglUIJEMQHICeSwBAAMCAAN4AAM2BA)  | ![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANpZ4Dqz09eOhzTOx1rldpTrEqBvtQAAiDGMRvxdglUBKrBKN8R5MABAAMCAAN4AAM2BA)  |


4. Add your proxy node to v2rayN or other tools you are using.

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANqZ4DrPEVKA17I8MlMpb5Ck6dI1zcAAiLGMRvxdglUQVi88Ze-28UBAAMCAAN4AAM2BA)

5. Test your node delay.

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANrZ4Dra6N35jP--SCzahg_HY5xoDQAAiTGMRvxdglUlzwZcAnhnKQBAAMCAAN5AAM2BA)

# Acknowledgement

> https://www.youtube.com/watch?v=7GHh91AYAmM
> https://github.com/MHSanaei/3x-ui
