---
title: Deploy H-UI and Hysteria2 Protocol Proxy against Network Sanction
description: "Auto-generated description for Deploy H-UI and Hysteria2 Protocol Proxy against Network Sanction"
pubDate: 2026-01-23
---

# Introduction

**Generally speaking, the internet that what we are using almost transfers our traffic through ==TCP== proxy. As we all know, tcp is a stable proxy, but there are also much disadvantages, including slow transfer speed.**

# Install H-UI

Official project location: {% btn 'https://github.com/jonssonyan/h-ui', H-UI %}

It's similar to installation about {% btn '/2025/01/10/Linux-3X-UI/', 3X-UI %}

**You can install with auto script:**

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/jonssonyan/h-ui/main/install.sh)
```

**After install finished, you will see this:**

```bash
---> Install H UI
Please enter the port of H UI (default: 8081): 
Please enter the Time zone of H UI (default: Asia/Shanghai): 
Created symlink /etc/systemd/system/multi-user.target.wants/h-ui.service → /etc/systemd/system/h-ui.service.
h-ui Panel Port: 8081
h-ui Login Username: xxx
h-ui Login Password: xxx
h-ui Connection Password: xxx.xxx
---> H UI install successful
```

**Now you can visit you h-ui panel through ==http==, please notice, http is not secure!!! We will set HTTPS at next step.**

# Config H-UI

## 1. [Get SSL Credential](/2025/01/10/Linux-3X-UI/)

```bash
root@s27953:~# cd ~
root@s27953:~# ls
cert
root@s27953:~# cd cert/
root@s27953:~/cert# ls
claw.liweijun.online
root@s27953:~/cert# cd claw.liweijun.online/
root@s27953:~/cert/claw.liweijun.online# ls
fullchain.pem  privkey.pem
```

- **We can get a credential using 3x-ui,  and remember the path of `.pem` file.**

## 2. Login you H-UI panel through browser

- **We have got our pwd and usr, if you forgot them, you should re-run that auto script, and follow the indication to reset password and username.**

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANsZ4DzYqH2K9pC0mGDe05zXkYgiz8AAlfGMRvxdglU1Tn5DAMSz3IBAAMCAAN3AAM2BA)

- **We can easily see that, so we should config SSL firstly, details are as follow:**

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANtZ4D1J2Av4fOoUI7ctiEIBjoU5M0AAnfGMRvxdglU104jIT6lXagBAAMCAAN3AAM2BA)

- **Besides, you may need change listen port, because your 443 port might has been occupied!**

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANuZ4D1jn6RxGmY6QkO59XpbWdvbe8AAnvGMRvxdglU-SqkxcnWkBcBAAMCAAN5AAM2BA)

- **Then, config HTTPS from Hysteria2 configuration.**

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANvZ4D2MhaywMAFKWRfIGKW3iGaVM0AAn3GMRvxdglURLdzgRuvsssBAAMCAAN3AAM2BA)

- **Now, save all your changes and restart panel**

## 3. Config Hysteria2

1. Config masquerade

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANwZ4D4_ikDD9JmAaIC58dfmAZnYcIAAn_GMRvxdglUD7q-VmacGtcBAAMCAAN3AAM2BA)

2. Config bandwidth

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANyZ4D9EYwtvBQLO2IAAbaHSp_7iTdyAAKGxjEb8XYJVHBOnh1zGp_OAQADAgADeQADNgQ)

- **Please notice: You should config bandwidth corresponding with your network situation.**

3. Start Hysteria2

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANzZ4D9NI-xaNGXh_IW1QX0cQ221CIAAofGMRvxdglUebFdznszGC4BAAMCAAN5AAM2BA)

## 4. Import Hysteria2 Node to V2rayN

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAAN0Z4D9bZh5v-AMtM8zzGdwYs3yp38AAonGMRvxdglUHnYr0FEt3IQBAAMCAAN3AAM2BA)

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAAN2Z4D-IL0iYcYhlfdHSA05lA1km1cAAovGMRvxdglUCcs9TyIAAb1TAQADAgADeQADNgQ)

- **Now, it can work!**

# Acknowledgement

> https://github.com/jonssonyan/h-ui/issues/71
> https://github.com/jonssonyan/h-ui
