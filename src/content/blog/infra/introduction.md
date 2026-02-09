---
title: "OpenVPN 基础配置笔记"
description: "整理 OpenVPN 服务端与客户端的安装、证书签发与连接验证流程。"
pubDate: "2025-12-12"
updatedDate: "2026-02-09"
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/OpenVPN.md"
sourceVault: "obsidian/note"
slug: "infra/introduction"
---
## Introduction

**OpenVPN** is a [virtual private network](https://en.wikipedia.org/wiki/Virtual_private_network "Virtual private network") (VPN) system that implements techniques to create secure point-to-point or site-to-site connections in routed or bridged configurations and remote access facilities. It implements both [client and server](https://en.wikipedia.org/wiki/Client-server_architecture "Client-server architecture") applications.

## Usage

## 1. Server End

### 1.1. Windows

1. Download [OpenVPN GUI](https://openvpn.net/community-downloads/) corresponding your operate system and CPU architecture.
   `[Image omitted: OpenVPN GUI download page screenshot]`
2. Install `OpenVPN GUI`
	1. Click `Customized Install`
	   `[Image omitted: customized install option screenshot]`
	2. Make sure every components is entirely installed
	   `[Image omitted: OpenVPN component selection screenshot 1]`
	   `[Image omitted: OpenVPN component selection screenshot 2]`
3. Config OpenVPN server
	1. Open folder: `C:\Program Files\OpenVPN\easy-rsa` and copy `vars.example` to `vars`
	2. Open folder `C:\Program Files\OpenVPN\easy-rsa` through `Powershell` with system authority.
	   ```powershell
	PS C:\WINDOWS\system32> cd 'C:\Program Files\OpenVPN\easy-rsa\'
		```
	3. Start `easy-rsa`: `EasyRSA-Start.bat`
	   `[Image omitted: EasyRSA start window screenshot]`
	4. Init PKI directory: `./easyrsa init-pki`
	```powershell
		PS C:\Program Files\OpenVPN\easy-rsa> .\EasyRSA-Start.bat
		Easy-RSA starting..
		
		Welcome to the EasyRSA 3 Shell for Windows.
		Easy-RSA 3 is available under a GNU GPLv2 license.
		
		Invoke 'easyrsa' to call the program. Without commands, help is displayed.
		
		Using directory: C:/Program Files/OpenVPN/easy-rsa
		
		
		EasyRSA Shell
		# ./easyrsa init-pki
		Using Easy-RSA 'vars' configuration:
		* C:/Program Files/OpenVPN/easy-rsa/vars
		
		Notice
		------
		'init-pki' complete; you may now create a CA or requests.
		
		Your newly created PKI dir is:
		* C:/Program Files/OpenVPN/easy-rsa/pki
		
		Using Easy-RSA configuration:
		* C:/Program Files/OpenVPN/easy-rsa/vars
```
	5. Create CA certificate file: `./easyrsa build-ca nopass`
	   ```powershell
		EasyRSA Shell
		# ./easyrsa build-ca nopass
		Using Easy-RSA 'vars' configuration:
		* C:/Program Files/OpenVPN/easy-rsa/vars
		* 
		You are about to be asked to enter information that will be incorporated
		into your certificate request.
		What you are about to enter is what is called a Distinguished Name or a DN.
		There are quite a few fields but you can leave some blank
		For some fields there will be a default value,
		If you enter '.', the field will be left blank.
		-----
		Common Name (eg: your user, host, or server name) [Easy-RSA CA]:vmware
		
		Notice
		------
		CA creation complete. Your new CA certificate is at:
		* C:/Program Files/OpenVPN/easy-rsa/pki/ca.crt
		
		Create an OpenVPN TLS-AUTH|TLS-CRYPT-V1 key now: See 'help gen-tls'
		
		Build-ca completed successfully.
```
	6. Create server certificate and private key: `./easyrsa build-server-full SERVER nopass`
	   ```powershell
		EasyRSA Shell
		# ./easyrsa build-server-full vmware nopass
		Using Easy-RSA 'vars' configuration:
		* C:/Program Files/OpenVPN/easy-rsa/vars
		
		Notice
		------
		Private-Key and Public-Certificate-Request files created.
		Your files are:
		* req: C:/Program Files/OpenVPN/easy-rsa/pki/reqs/vmware.req
		* key: C:/Program Files/OpenVPN/easy-rsa/pki/private/vmware.key
		
		You are about to sign the following certificate:
		
		  Requested CN:     'vmware'
		  Requested type:   'server'
		  Valid for:        '825' days
		
		
		subject=
		    commonName                = vmware
		
		Type the word 'yes' to continue, or any other input to abort.
		  Confirm requested details: yes
		
		Using configuration from C:/Program Files/OpenVPN/easy-rsa/pki/c70d8473/temp.6.1
		Check that the request matches the signature
		Signature ok
		The Subject's Distinguished Name is as follows
		commonName            :ASN.1 12:'vmware'
		Certificate is to be certified until Jul  1 06:19:35 2027 GMT (825 days)
		
		Write out database with 1 new entries
		Database updated
		which: no bc in (C:/Program Files/OpenVPN/easy-rsa;C:/Program Files/OpenVPN/easy-rsa/bin;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\WINDOWS\System32\OpenSSH\;C:\Users\vmware\AppData\Local\Microsoft\WindowsApps;C:\Program Files\OpenVPN\bin\)
		
		Notice
		------
		Inline file created:
		* C:/Program Files/OpenVPN/easy-rsa/pki/inline/private/vmware.inline
		
		
		Notice
		------
		Certificate created at:
		* C:/Program Files/OpenVPN/easy-rsa/pki/issued/vmware.crt
```

### 1.2. Linux

https://openvpn.net/as-docs/ubuntu.html
https://www.digitalocean.com/community/tutorials/how-to-set-up-and-configure-an-openvpn-server-on-ubuntu-20-04#step-1-installing-openvpn-and-easy-rsa
## 2. Client End

### 2.1.
