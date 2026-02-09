---
title: OpenVPN Server Setup Guide
description: "Step-by-step OpenVPN server setup notes, including certificate generation and client configuration."
pubDate: 2026-01-23
---

## OpenVPN Server

## Install OpenVPN Server

### Windows

#### 1. Download setup program

[OpenVPN Client Download for Windows](https://openvpn.net/client/)

#### 2. Install OpenVPN

Remember click `Customize` instead of `Install Now`

Click `OpenVPN` -> `OpenVPN Service` -> `Entire feature will be installed on local hard drive`;

Click`OpenSSL Utilities` -> `EasyRSA 3 Certificate Management Scripts` -> `Entire feature will be installed on local hard drive`

#### 3. Config Server

Enter default setup directory, and then enter the `Easy-RSA 3 Shell`
```bash
cd 'C:\Program Files\OpenVPN\easy-rsa'
.\EasyRSA-Start.bat
```

Initialize public key instruments directory:
```bash
./easyrsa init-pki
```

Build `CA(Criteria Agent)` certificate, generated `ca.crt` will be saved at  `C：\Program Files\OpenVPN\easy-rsa\pki`, and the `ca.key` will be saved at `C：\Program Files\OpenVPN\easy-rsa\pki\private`.
```bash
./easyrsa build-ca nopass
```

Generate Server  `crt` and `key`, `server.crt` will be saved at `C：\Program Files\OpenVPN\easy-rsa\pki\issued` and the `server.key` will be saved at `C：\Program Files\OpenVPN\easy-rsa\pki\private`.
```bash
./easyrsa build-client-full client nopass
```

Generate `Diffie-Hellman` key
```bash
./easyrsa gen-dh
```

Build `server.ovpn` config file:
Sample config files locate at `C：\Program Files\OpenVPN\sample-config`, you should copy `server.ovpn` to `C：\Program Files\OpenVPN\config`

```bash
port 1194
dh dh.pem
duplicate-cn
;tls-auth ta.key 0
```

Copy`ca.crt`，`dh.pem`，`server.crt` and `server.key` to directory `C：\Program Files\OpenVPN\config`.

#### 4. Start and Connect

Right click OpenVPN icon, select `connect`.

## OpenVPN Client Sample Config

```text
##############################################
# Sample client-side OpenVPN 2.6 config file #
# for connecting to multi-client server.     #
#                                            #
# This configuration can be used by multiple #
# clients, however each client should have   #
# its own cert and key files.                #
#                                            #
# On Windows, you might want to rename this  #
# file so it has a .ovpn extension           #
##############################################

# Specify that we are a client and that we
# will be pulling certain config file directives
# from the server.
client

# Use the same setting as you are using on
# the server.
# On most systems, the VPN will not function
# unless you partially or fully disable
# the firewall for the TUN/TAP interface.
;dev tap
dev tun

# Windows needs the TAP-Win32 adapter name
# from the Network Connections panel
# if you have more than one.  On XP SP2,
# you may need to disable the firewall
# for the TAP adapter.
;dev-node MyTap

# Are we connecting to a TCP or
# UDP server?  Use the same setting as
# on the server.
;proto tcp
proto udp

# The hostname/IP and port of the server.
# You can have multiple remote entries
# to load balance between the servers.
remote 58.18.73.71 1194
;remote my-server-2 1194

# Choose a random host from the remote
# list for load-balancing.  Otherwise
# try hosts in the order specified.
;remote-random

# Keep trying indefinitely to resolve the
# host name of the OpenVPN server.  Very useful
# on machines which are not permanently connected
# to the internet such as laptops.
resolv-retry infinite

# Most clients don't need to bind to
# a specific local port number.
nobind

# Downgrade privileges after initialization (non-Windows only)
;user openvpn
;group openvpn

# Try to preserve some state across restarts.
persist-key
persist-tun

# If you are connecting through an
# HTTP proxy to reach the actual OpenVPN
# server, put the proxy server/IP and
# port number here.  See the man page
# if your proxy server requires
# authentication.
;http-proxy-retry # retry on connection failures
;http-proxy [proxy server] [proxy port #]

# Wireless networks often produce a lot
# of duplicate packets.  Set this flag
# to silence duplicate packet warnings.
;mute-replay-warnings

# SSL/TLS parms.
# See the server config file for more
# description.  It's best to use
# a separate .crt/.key file pair
# for each client.  A single ca
# file can be used for all clients.
;ca ca.crt
;cert client.crt
;key client.key

<ca>
-----BEGIN CERTIFICATE-----
MIIDYzCCAkugAwIBAgIUa4wZbvlq9Fe2MIsMQ2T48vDEmmAwDQYJKoZIhvcNAQEL
BQAwHjEcMBoGA1UEAwwTcm9nLmxpd2VpanVuLm9ubGluZTAeFw0yNTAzMjYwNzEy
NTBaFw0zNTAzMjQwNzEyNTBaMB4xHDAaBgNVBAMME3JvZy5saXdlaWp1bi5vbmxp
bmUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCeRGMGnx2rcXlOSt7B
3JvwgM9phhjkoPRdH8uppljdkUcNgx204JwyaSs5mDNbAQGSsG
9W7DAgMBAAGjgZgwgZUwDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQUwSjWYwGB5ac3
jOl7dgcKJnqzyzEwWQYDVR0jBFIwUIAUwSjWYwGB5ac3jOl7dgcKJnqzyzGhIqQg
MB4xHDAaBgNVBAMME3JvZy5saXdlaWp1bi5vbmxpbmWCFGuMGW75avRXtjCLDENk
+PLwxJpgMAsGA1UdDwQEAwIBBjANBgkqhkiG9w0BAQsFAAOCAQEADs46S0j66Yqn
jJ6stxgP/P86/yZukTrzpqMpktZ5QwzZwKs/9ZG9PCRsIypP5PtBYHBoEZG2IzNf
RHIpdO8mMx4Lg7775XuvuX7oR22t98X5gbcdBBqO0K2NPPVKkfcYmaBpafjfHpZS
nL3ddRWRv1iFklQ85gl5sea/ebWIYLK+ClLybxW9h+rI/A7s9dKlgQZubPLpycKe
LDh+FLMSbEWOOA9ZVo0yt2cqP+UZZlJKtsEXaJCqcBhGtoQ2rNGtK0JdvcZbbXdF
FOpR4NsHmfSaHVtKzPs+yLGziM8XUi1uQEiu/B6tryK+7Q0qRx+RsYxe8tzMpdmA
28mCSB2teg==
-----END CERTIFICATE-----
</ca>
<cert>
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            2a:ac:00:f1:73:c9:2f:9b:fa:26:16:71:ac:4c:31:42
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=rog.liweijun.online
        Validity
            Not Before: Mar 26 07:15:58 2025 GMT
            Not After : Jun 29 07:15:58 2027 GMT
        Subject: CN=hjt
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:e0:7e:6e:91:06:7b:b0:e2:3d:c2:ea:25:3d:83:
                    fa:b4:35:cd:d0:92:aa:c6:99:31:94:b2:44:9c:f0:
                    be:30:61:20:09:75:89:26:a4:6f:0d:cc:c7:d7:15:
                    7c:af:76:e5:16:52:ab:3e:d0:a8:f1:91:33:fe:c2:
                    b6:1f:70:4d:13:47:b2:81:cc:6e:d0:c1:4e:d0:3c:
                    29:26:8d:92:3f:c0:5b:2c:d1:3f:84:23:28:22:52:
                    bd:b1:d8:2f:d3:f4:19:95:7a:61:64:dd:65:14:f7:
                    55:48:df:04:51:2c:9:d4:5b:9f:a3:
                    d6:7c:8e:0b:38:92:aa:a0:a9:dc:01:3b:76:33:26:
                    c8:de:56:2c:c5:46:a6:0f:b7:76:13:f1:25:b2:e8:
                    86:77:30:b9:a8:07:1f:6b:5c:ba:49:84:c0:63:db:
                    97:03:1f:da:bc:0f:80:40:c2:34:eb:f2:98:4b:fb:
                    e8:4d:2f:1c:6c:98:f2:87:df:f6:e2:91:6f:31:30:
                    ae:f9:a9:d2:ea:c2:d2:37:ac:68:f8:a7:d3:d3:8f:
                    1c:b6:ff:11:df:5a:2b:6d:80:d1:57:d7:af:10:d5:
                    63:c9
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: 
                CA:FALSE
            X509v3 Subject Key Identifier: 
                B3:15:25:1B:22:4B:CA:26:64:3C:8B:70:70:43:FA:3A:63:76:DD:DB
            X509v3 Authority Key Identifier: 
                keyid:C1:28:D6:63:01:81:E5:A7:37:8C:E9:7B:76:07:0A:26:7A:B3:CB:31
                DirName:/CN=rog.liweijun.online
                serial:6B:8C:19:6E:F9:6A:F4:57:B6:30:8B:0C:43:64:F8:F2:F0:C4:9A:60
            X509v3 Extended Key Usage: 
                TLS Web Client Authentication
            X509v3 Key Usage: 
                Digital Signature
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        50:f1:34:c3:37:b5:6c:5c:90:0f:cd:e5:fc:e1:27:78:e3:63:
        73:53:a5:e9:5e:2d:89:08:28:16:82:d9:88:7f:18:2e:f6:f2:
        cf:d4:a9:e2:7f:ca:22:88:b1:c4:34:8f:8a:c5:45:8e:fa:65:
        53:c8:47:66:e1:a4:9b:d5:d:a5:25:86:a1:c4:
        88:35:b1:13:0d:7e:95:10:47:15:ff:e9:06:a0:5d:d5:35:0e:
        1b:95:80:85:cf:97:f3:cb:1e:a6:67:fa:9d:42:b6:ef:5b:b5:
        c9:86:f2:50:01:bb:67:6b:02:5d:bd:4d:cd:53:83:cd:7d:58:
        6e:32:59:cb:33:3b:76:f2:a1:25:9f:30:c6:fd:92:c7:b0:92:
        9a:63:a1:92:a5:4e:6e:e9:f5:2f:59:d0:e1:df:54:8d:7e:f9:
        bc:5d:af:dd:e8:dc:67:ce:f7:72:2f:8c:85:e1:c2:00:03:53:
        22:41:cc:71:bd:33:5a:f1:f3:31:a5:5e:c0:36:8e:2d:1d:b0:
        8b:61:56:8b
-----BEGIN CERTIFICATE-----
MIIDYTCCAkmgAwIBAgIQKqwA8XPJL5v6JhZxrEwxQjANBgkqhkiG9w0BAQsFADAe
MRwwGgYDVQQDDBNyb2cubGl3ZWlqdW4ub25saW5lMB4XDTI1MDMyNjA3MTU1OFoX
DTI3MDYyOTA3MTU1OFowDjEMMAoGA1UEAwwDaGp0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEA4H5ukQZ7sOI9wuolPYP6tDXN0JKqxpkxlLJEnPC+MGEg
CXWJJqRvDczH1xV8r3blFlKncATt2MybI3lYsxUamD7d2E/El
suiGdzC5qAcfa1y6SYTAY9uXAx/avA+AQMI06/KYS/voTS8cbJjyh9/24pFvMTCu
+anS6sLSN6xo+KfT048ctv8R31orbYDRV9evENVjyQIDAQABo4GqMIGnMAkGA1Ud
EwQCMAAwHQYDVR0OBBYEFLMVJRsiS8omZDyLcHBD+jpjdt3bMFkGA1UdIwRSMFCA
FMEo1mMBgeWnN4zpe3YHCiZ6s8sxoSKkIDAeMRwwGgYDVQQDDBNyb2cubGl3ZWlq
dW4ub25saW5lghRrjBlu+Wr0V7YwiwxDZPjy8MSaYDATBgNVHSUEDDAKBggrBgEF
BQcDAjALBgNVHQ8EBAMCB4AwDQYJKoZIhvcNAQELBQADggEBAFDxNMM3tWxckA/N
5fzhJ3jjY3NTpeleLYkIKBaC2Yh/GC728s/UqeJ/yiKIscQ0j4rFRY76ZVPIR2bh
pJvVxtLUjlspy2LgE1UG04ifUvj516hpHej8Bja+dY0+M4/3+xoIvz6vaqBkYUeM
3qJ9rd7+h6sJgnw4tw2lJYahxIg1sRMNfpUQRxX/6QagXdU1DhuVgIXPl/PLHqZn
+p1Ctu9btcmG8lABu2drAl29Tc1Tg819WG4yWcszO3byoSWfMMb9ksewkppjoZKl
Tm7p9S9Z0OHfVI1++bxdr93o3GfO93IvjIXhwgADUyJBzHG9M1rx8zGlXsA2ji0d
sIthVos=
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgfm6RBnuw4j3C
6iU9g/q0Nc3QkqrGmTGUskSc8L4wYSAJdYkmpG8NzMfXFXyvduUWUqs+0KjxkTP+
wrYfcE0TR7KBzG7QwU7QPCkmjZI/wFss0T+EIygiUr2x2C/T9BmVemFk3WUU91VI
3wRRLDY1pW+ytRflzryvDwQ3Xp3NmIGtFcF94BOtAGQTTA55JQGZ1Fufo9Z8jgs4
kqqgqdwBO3YzJsjeVizFRqYPt3YT8SWy6IZ3MLmoBx9rXLpJhMBj25cDH9q8D4BA
wjTr8phL++hNLxxsmPKH3/bikW8xMK75qdLqwtI3rGj4p9PTjxy2/xHfWittgNFX
168Q1WPJAgMBAAECggEAH1u50RtBOueXbfssAYhGhFbBraFXJo+um9E9AVklj/d5
NKkM4+9zLc/NmG9Bb/chL/mTPx6BguDgDPWg4ApdUdShjD0Eu7dM7YyByQdchvg1
JDEEeM46ZHT/V3DV2XsO+dDS+vZsEL4t1RSF81rEJcE6tZFTScATnjZwRdW7IEUq
2McSD2C8mFhwz0IRfQ5MMHv4vV7t9Q0E4ZpePo2VjYg5jLj/w9GwkB+7II5A21ju
aFRrYFGMQonjPjLBuUDuzgh4b5XJgQhJFBngd/JjAxObWJ8fUZ4kEAFwGqy6f42I
SszhF0PcvN0jbApm8BSshEDRcgkwV2bXvcF07bBMswKBgQDzTE9AqyLLqglkwB+B
GmI/inh3U5nqS8uL1poME5qpiMTYBgd93sPSrRmQ4CU+fYzjCUMjfj1rcKTFDOf3
yKg5SCT/hnuTWFvalwdKvE5MjfiV0nhYgr8noqF8I0rZdm3MPs3C+IRmaxsSQVAN
gFHbTlvkGRa7CJt4DhwKrQ1cZwKBgQDsNs2cV3M35twQNbeK1f4wgu5nqgW4Amxl
qoD6XD0DiwYg+y0teRebBNvE7xpELr9gD1fnz4X2a3MjQ0K/ZiaseDnJnIr39i9i
7d3atnZPQLcX6mBptScqPGi3dGffJGVZX576JNxV/pl356gBUQbna982ebic/qq7
Ppj9Nu8gTwKBgAOxneZqcr3K2Beqfw/zuZgjXw7YuxZ+jhmSaYZTad63D94DwWtc
zXZOYHv9mzMmrtPnmRhZ207dR/Mh7geqCTvNZ5pljUzAY6ye7GJrF3k8EpEbv+4A
Fizg4DjFRGam0KXwMimKol/3slKFoVSDJTsCJo0BAIJYcBvTgwN6eyBzAoGBAOvT
JuFAOWqFFA0m4/A7BoQ+I2/hQcZcvQWe/Rd2gP+Ji3vf6FGuxE9iwVpScAHEPhHU
H6nx+Ed1LMT2wKu/ezrS6LaMj/1QjiyRV92kLmefL2wz9T9zuP8kwlLtZ0pS1tAs
c9Y+eK9t+J/J6mQuFdtzSazkRtiOM7uumiSq9H9nAoGBAIcKJTIBpubDNsa/bIgg
6INFTB2Bnj0aqeVEP3QDh/DKyqMfMYwmXvEBOkhXGsIlV74L342ZpXkQTkwPRs0r
6VFO8PsopabnYyTWqEtlzrog1M1zlG0lLB9HC/zn1CDqXO4/hxEi/CF47mqMyA7C
7PcgTTYmlum50C+V5fw/izRP
-----END PRIVATE KEY-----
</key>

# Verify server certificate by checking that the
# certificate has the correct key usage set.
# This is an important precaution to protect against
# a potential attack discussed here:
#  http://openvpn.net/howto.html#mitm
#
# To use this feature, you will need to generate
# your server certificates with the keyUsage set to
#   digitalSignature, keyEncipherment
# and the extendedKeyUsage to
#   serverAuth
# EasyRSA can do this for you.
remote-cert-tls server

# Allow to connect to really old OpenVPN versions
# without AEAD support (OpenVPN 2.3.x or older)
# This adds AES-256-CBC as fallback cipher and
# keeps the modern ciphers as well.
;data-ciphers AES-256-GCM:AES-128-GCM:?CHACHA20-POLY1305:AES-256-CBC

# If a tls-auth key is used on the server
# then every client must also have the key.
;tls-auth ta.key 1

# Set log file verbosity.
verb 3

# Silence repeating messages
;mute 20

```

## Reference

> https://www.moralok.com/2023/06/07/how-to-setup-OpenVPN-server-on-windows-10/
> https://www.moralok.com/2023/06/07/how-to-setup-OpenVPN-connect-client-on-iOS-and-macOS/

