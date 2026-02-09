---
title: Mount OneDriver on Linux
description: "Mount OneDriver on Linux Install rclone Official website: RCLONE 1.1."
pubDate: 2026-01-23
---

## Mount OneDriver on Linux

## 1. Install rclone

- Official website: [RCLONE](https://rclone.org/)

### 1.1. Install via Script:

- You can get more details at: https://rclone.org/downloads/

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```
![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANaZ37CfI5b2OZrFSg0OwemfeqHOXgAAqfCMRvEEPFX0-YQ8gMAAWe3AQADAgADeAADNgQ)

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANbZ37C14ndXZgfCRfhE9mhSa2cOoAAAqnCMRvEEPFXNAHbEiLubSsBAAMCAAN5AAM2BA)

### 1.2. Install by hand

You can just download `rclone` from official website and use it directly.

## 2. Config rclone

```bash
 $ rclone config
```

```bash
e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> n
name> remote
Type of storage to configure.
Enter a string value. Press Enter for the default ("").
Choose a number from below, or type in your own value
[snip]
XX / Microsoft OneDrive
   \ "onedrive"
[snip]
Storage> onedrive
Microsoft App Client Id
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_id>
Microsoft App Client Secret
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_secret>
Edit advanced config? (y/n)
y) Yes
n) No
y/n> n
Remote config
Use web browser to automatically authenticate rclone with remote?
 * Say Y if the machine running rclone has a web browser you can use
 * Say N if running rclone on a (remote) machine without web browser access
If not sure try Y. If Y failed, try N.
y) Yes
n) No
y/n> y
If your browser doesn't open automatically go to the following link: http://127.0.0.1:53682/auth
Log in and authorize rclone for access
Waiting for code...
Got code
Choose a number from below, or type in an existing value
 1 / OneDrive Personal or Business
   \ "onedrive"
 2 / Sharepoint site
   \ "sharepoint"
 3 / Type in driveID
   \ "driveid"
 4 / Type in SiteID
   \ "siteid"
 5 / Search a Sharepoint site
   \ "search"
Your choice> 1
Found 1 drives, please select the one you want to use:
0: OneDrive (business) id=b!Eqwertyuiopasdfghjklzxcvbnm-7mnbvcxzlkjhgfdsapoiuytrewqk
Chose drive to use:> 0
Found drive 'root' of type 'business', URL: https://org-my.sharepoint.com/personal/you/Documents
Is that okay?
y) Yes
n) No
y/n> y
Configuration complete.
Options:
- type: onedrive
- token: {"access_token":"youraccesstoken","token_type":"Bearer","refresh_token":"yourrefreshtoken","expiry":"2018-08-26T22:39:52.486512262+08:00"}
- drive_id: b!Eqwertyuiopasdfghjklzxcvbnm-7mnbvcxzlkjhgfdsapoiuytrewqk
- drive_type: business
Keep this "remote" remote?
y) Yes this is OK
e) Edit this remote
d) Delete this remote
y/e/d> y
```

- But if you are installing rclone with OneDriver on ==headless linux server==, you should select `n` when:

```bash
Remote config
Use web browser to automatically authenticate rclone with remote?
 * Say Y if the machine running rclone has a web browser you can use
 * Say N if running rclone on a (remote) machine without web browser access
If not sure try Y. If Y failed, try N.
y) Yes
n) No
y/n> y
```
![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANcZ37EVLltQ777jgABkB2u1oINgNnmAAKrwjEbxBDxV1_lWNWmyaGGAQADAgADeAADNgQ)

- Now, we need a windows computer help us get config token.

- Before that, we need install {% btn 'https://rclone.org/install/#windows', rclone %}  on windows which can use browser.

```bash
(base) PS C:\Program Files\rclone-v1.68.2-windows-amd64> rclone authorize "onedrive"
```

- If you success, you will see this.

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANdZ37GEbYdcgT7HJHjar13w3QDyAwAAq7CMRvEEPFXVboHYnOYLYoBAAMCAAN4AAM2BA)

- Go back to your teriminal and copy your token

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANeZ37GU9APW40hMSd9nv7w0vWFsvoAAq_CMRvEEPFX03k4advszFUBAAMCAAN5AAM2BA)

- Paste your token and send

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANfZ37GqUB826f7Z7Hh38O8WrzTI5MAArLCMRvEEPFXr1qHUyg3YSIBAAMCAAN5AAM2BA)

- And then, follow the steps:

```bash
Option config_type.
Type of connection
Choose a number from below, or type in an existing value of type string.
Press Enter for the default (onedrive).
 1 / OneDrive Personal or Business
   \ (onedrive)
 2 / Root Sharepoint site
   \ (sharepoint)
   / Sharepoint site name or URL
 3 | E.g. mysite or https://contoso.sharepoint.com/sites/mysite
   \ (url)
 4 / Search for a Sharepoint site
   \ (search)
 5 / Type in driveID (advanced)
   \ (driveid)
 6 / Type in SiteID (advanced)
   \ (siteid)
   / Sharepoint server-relative path (advanced)
 7 | E.g. /teams/hr
   \ (path)
config_type> 1

Option config_driveid.
Select drive you want to use
Choose a number from below, or type in your own value of type string.
Press Enter for the default (94b3d7066fdb10b3).
 1 / Bundles_b896e2bb7ca3447691823a44c4ad6ad7 (personal)
   \ (94b3d7066fdb10b3)
 2 / AEEE102E-CFF8-4E2A-89C6-03841FF83500 (personal)
   \ (b!pALVwCCiEUqNVLynOJWVtiMGN3t1SRxMkEIHYRLVtsaQj5_SK3paRrsGeJjPpvSl)
 3 / ODCMetadataArchive (personal)
   \ (b!pALVwCCiEUqNVLynOJWVtiMGN3t1SRxMkEIHYRLVtsZzzB5vh4uASoakiF1vk10V)
 4 / OneDrive (personal)
   \ (94b3d7066fdb10b3)
config_driveid> 4

Drive OK?

Found drive "root" of type "personal"
URL: https://onedrive.live.com?cid=94b3d7066fdb10b3&id=01GSBVAON6Y2GOVW7725BZO354PWSELRRZ

y) Yes (default)
n) No
y/n> 

Configuration complete.
Options:
- type: onedrive
- token: {"access_token":"EwCIA8l6BAAUbDba3x2OMJElkF7gJ4z/VbCPEz0AAYzr4oaYb+yMnu8OTvRanPD3ToasCjOnPYJ+AHhQPLy6CDTE5qzgwMmMQ/nmh+xp+g6wP59aHaUAS4wTCZNA9d7fxwgsMsenARUbOZw8OfW0gYQA2i6CQHOcDu4Ca/8PsDBkDzeiI7hTJ6p/qegz6bv8vwKqS/MkZGvz/J2VbsF5HR+EdUSe5+9qK7kjOxHCUdISI0UvqO2tCNLJLmqFJKLHXjXEAuZ1uTo6eM22p5RCKTf5QZ3HXPcX2JNfgXcHvcLj+Fr6wSseEFtJ4TinbOWR9T71weM6oVZn9J5T9n4+kIfA0bsSxmOOL8uhTVOYZtnZuGmG98GXVqW0uyue9RMQZgAAEGohj9BRbICWcxBaiD/VB4dQAsSo6t++izhA1/cSbJ8y9E8ANYWv8FsGXKX8z1Gi8J1zPkjADBOzZnPYonj1APV3NPA5DSzhwExuGaLJVjVp0D2DEyH17O9nQeN2YdAC8MotgevQyBSmxK7KQpclxIoclxR5i0x3exDv+KgWzXlceNmvur074B8BMIkcrchSV89IQUGmY2BpPZ0HfsQcp5ra5dAtjjfIHV8Q/qMjrUpcHw1FUjMcVhK77jWen":"M.C549_SN1.0.U.-CiB2Q6Y0P2A748IEQCufqBUbByQ5MuCCehG3oXgXMykwr!SwoRRbAsTZu84cgP8FAcnTiy36uNBFJGeCxZT65xX!nomA4ePgIVpIQQLEUfjG01WsbLbFWOVUdfq1LyGuqtpl!R2DCcroJcS4X0QqZ0AO!ux9MgYdjt3Ann7foEX1IanadhTZJw6rclTUsNv4UDG!BfTDEL4ED9YfSflRXoYxwdlyYV8VyLcLt!6H!5L28U3EzuGStpnelVSPvWF9!jo5OT1XsHxYK*LLJrCWG!MKoKhMrrEx9G0m3RFkX0PtlmVGcW4fV5JxwktIQemW41Re81OnATtb9Ftk4a5TnsIdbz!nAPuW7nfHsOo9DSpA","expiry":"2025-01-09T03:37:56.2087052+08:00"}
- drive_id: 94b3d7066fdb10b3
- drive_type: personal
Keep this "onedriver" remote?
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d> 

Current remotes:

Name                 Type
====                 ====
onedriver            onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```

## 3. Mount OneDriver to your local folder

```bash
(base) root@cc2:~$ rclone mount onedriver: ./onedriver/ --vfs-cache-mode writes &
```
==NOTE:== **If you encountered the problem:**

```bash
2025/01/08 09:46:26 Fatal error: failed to mount FUSE fs: fusermount: exec: "fusermount": executable file not found in $PATH
```

- You should check your **PATH**

```bash
(base) root@cc2:~# which fusermount
/usr/bin/fusermount
(base) root@cc2:~# which fusermount3
/usr/bin/fusermount3
(base) root@cc2:~# 
```

- And then install them

```bash
sudo apt update
sudo apt install fuse
sudo apt install fuse3
```

==NOTE:== **If you suffered the problem:**

```bash
root@cc:/mnt# rclone mount OneDriver: /mnt/OneDriver --vfs-cache-mode writes &
[1] 662372
root@cc:/mnt# 2025/01/08 13:03:11 Fatal error: directory already mounted, use --allow-non-empty to mount anyway: /mnt/OneDriver
rclone mount OneDriver: /mnt/OneDriver --vfs-cache-mode writes --allow-non-empty &
[2] 662378
[1] Exit 1 rclone mount OneDriver: /mnt/OneDriver --vfs-cache-mode writes
root@cc:/mnt# 2025/01/08 13:03:31 mount helper error: fusermount: failed to access mountpoint /mnt/OneDriver: Transport endpoint is not connected
2025/01/08 13:03:31 Fatal error: failed to mount FUSE fs: fusermount: exit status 1
```

- You should:

```bash
fusermount -u /mnt/OneDriver
```

- If you success, yo will see this:

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANgZ37JW7mcFDPr87Nzv6jwzGbvQXAAArPCMRvEEPFX9cic1XooYBIBAAMCAAN5AAM2BA)

## 4. Usage of rclone

- If you see this, you have already suffeccfully installed rclone and mount onedriver,

![image.png](https://img.liweijun.top/api/cfile/AgACAgUAAxkDAANhZ37J-jF_y9H4OI-nTVvh3ZhD0WQAArTCMRvEEPFXXeQ5WslOpCUBAAMCAAN4AAM2BA)

- But if you met some problems like:
```bash 
OneDrive reading file ERROR: IO error: unauthenticated: Unauthenticated
```
- That might be caused OneDriver
- You should download a fix from {% btn 'https://beta.rclone.org/branch/fix-onedrive-auth/v1.66.0-beta.7749.4e7fddd10.fix-onedrive-auth/', fix-onedriver-auth %}
- Select a decent version of yourself and run it.

## Reference

> 1. https://rclone.org/
> 2. https://www.youtube.com/watch?v=pvGUxxsibVE
> 3. https://github.com/rclone/rclone/issues/6844
> 4. https://forum.rclone.org/t/onedrive-reading-file-error-io-error-unauthenticated-unauthenticated/44846
> 5. https://beta.rclone.org/branch/fix-onedrive-auth/v1.66.0-beta.7749.4e7fddd10.fix-onedrive-auth/
