---
title: Change Bind Port of Docker Container
description: "Auto-generated description for Change Bind Port of Docker Container"
pubDate: 2026-01-23
---

# 1. 老办法就是打包再启动
# 2. 修改配置文件
## 2.1. 先关闭已经启动的所有容器
```
docker stop [ID/Name]
```
## 2.2. 关闭docker服务
```
systemctl stop docker
systemctl stop docket.socket
```
## 2.3. 找到docker配置文件
```
cd /var/lib/docker/containors/your_containor_id
```
在找这个ID的时候要先在之前docker没关闭之前查看
```
docker ps -a
```
## 2.4. 修改hostconfig.json 和 config.v2.json
配置文件如下
- 这个是hostconfig.json
- 在这里要把映射的端口信息写入
```json
{
    "Binds":[
        "//home/kali/Desktop/docker/share/:/home/share/"
    ],
    "ContainerIDFile":"",
    "LogConfig":{
        "Type":"json-file",
        "Config":{

        }
    },
    "NetworkMode":"default",
    "PortBindings":{
        "10086/tcp":[{
            "HostIp":"",
            "HostPort":"10086"
            }],
        "80/tcp":[{
            "HostIp":"",
            "HostPort":"80"
            }],
        "443/tcp":[{
            "HostIp":"",
            "HostPort":"443"
            }]
    },
    "RestartPolicy":{
        "Name":"no",
        "MaximumRetryCount":0
    },
    "AutoRemove":false,
    "VolumeDriver":"",
    "VolumesFrom":null,
    "CapAdd":null,
    "CapDrop":null,
    "CgroupnsMode":"private",
    "Dns":[

    ],
    "DnsOptions":[

    ],
    "DnsSearch":[

    ],
    "ExtraHosts":null,
    "GroupAdd":null,
    "IpcMode":"private",
    "Cgroup":"",
    "Links":null,
    "OomScoreAdj":0,
    "PidMode":"",
    "Privileged":false,
    "PublishAllPorts":false,
    "ReadonlyRootfs":false,
    "SecurityOpt":null,
    "UTSMode":"",
    "UsernsMode":"",
    "ShmSize":67108864,
    "Runtime":"runc",
    "ConsoleSize":[
        0,
        0
    ],
    "Isolation":"",
    "CpuShares":0,
    "Memory":0,
    "NanoCpus":0,
    "CgroupParent":"",
    "BlkioWeight":0,
    "BlkioWeightDevice":[

    ],
    "BlkioDeviceReadBps":null,
    "BlkioDeviceWriteBps":null,
    "BlkioDeviceReadIOps":null,
    "BlkioDeviceWriteIOps":null,
    "CpuPeriod":0,
    "CpuQuota":0,
    "CpuRealtimePeriod":0,
    "CpuRealtimeRuntime":0,
    "CpusetCpus":"",
    "CpusetMems":"",
    "Devices":[

    ],
    "DeviceCgroupRules":null,
    "DeviceRequests":null,
    "KernelMemory":0,
    "KernelMemoryTCP":0,
    "MemoryReservation":0,
    "MemorySwap":0,
    "MemorySwappiness":null,
    "OomKillDisable":null,
    "PidsLimit":null,
    "Ulimits":null,
    "CpuCount":0,
    "CpuPercent":0,
    "IOMaximumIOps":0,
    "IOMaximumBandwidth":0,
    "MaskedPaths":[
        "/proc/asound",
        "/proc/acpi",
        "/proc/kcore",
        "/proc/keys",
        "/proc/latency_stats",
        "/proc/timer_list",
        "/proc/timer_stats",
        "/proc/sched_debug",
        "/proc/scsi",
        "/sys/firmware"
    ],
    "ReadonlyPaths":[
        "/proc/bus",
        "/proc/fs",
        "/proc/irq",
        "/proc/sys",
        "/proc/sysrq-trigger"
    ]
}
```
- 这里是config.v2.json
- 这里要把暴露的端口写入
```json
{
    "StreamConfig":{

    },
    "State":{
        "Running":false,
        "Paused":false,
        "Restarting":false,
        "OOMKilled":false,
        "RemovalInProgress":false,
        "Dead":false,
        "Pid":0,
        "ExitCode":137,
        "Error":"",
        "StartedAt":"2023-07-11T06:34:07.531152901Z",
        "FinishedAt":"2023-07-11T06:50:44.834512517Z",
        "Health":null
    },
    "ID":"532f96985e4536759554cc7c2b68642e3075ec0dca5aed1fffc19c749e8907a2",
    "Created":"2023-07-11T06:34:07.211250431Z",
    "Managed":false,
    "Path":"bash",
    "Args":[

    ],
    "Config":{
        "Hostname":"532f96985e45",
        "Domainname":"",
        "User":"",
        "AttachStdin":false,
        "AttachStdout":false,
        "AttachStderr":false,
        "ExposedPorts":{
            "80/tcp":{},
            "10086/tcp":{},
            "443/tcp":{}
        },
        "Tty":true,
        "OpenStdin":true,
        "StdinOnce":false,
        "Env":[
            "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "LANG=C.UTF-8"
        ],
        "Cmd":[
            "bash"
        ],
        "Image":"kalilinux/kali-last-release",
        "Volumes":null,
        "WorkingDir":"",
        "Entrypoint":null,
        "OnBuild":null,
        "Labels":{
            "io.buildah.version":"1.28.2",
            "org.opencontainers.image.authors":"Kali Developers \u003cdevel@kali.org\u003e",
            "org.opencontainers.image.created":"2023-07-09T04:26:43Z",
            "org.opencontainers.image.description":"Official Kali Linux container image for 2023.2",
            "org.opencontainers.image.revision":"b65b5a63",
            "org.opencontainers.image.source":"https://gitlab.com/kalilinux/build-scripts/kali-docker",
            "org.opencontainers.image.title":"Kali Linux (2023.2 branch)",
            "org.opencontainers.image.url":"https://www.kali.org/",
            "org.opencontainers.image.vendor":"OffSec",
            "org.opencontainers.image.version":"2023.2"
        }
    },
    "Image":"sha256:727e3f9a0dbc1449e9fcb04b902e717c85004383fbdff13fb4c3808ac3b8773d",
    "NetworkSettings":{
        "Bridge":"",
        "SandboxID":"71b8410fa517e48b860dd8c8d8c63cd39c18e7463174c4104e3ce16cbd9f3f67",
        "HairpinMode":false,
        "LinkLocalIPv6Address":"",
        "LinkLocalIPv6PrefixLen":0,
        "Networks":{
            "bridge":{
                "IPAMConfig":null,
                "Links":null,
                "Aliases":null,
                "NetworkID":"d2820cac2564714950b4a883d348b753d5fe01a4b2b699990d09df451ea6d929",
                "EndpointID":"",
                "Gateway":"",
                "IPAddress":"",
                "IPPrefixLen":0,
                "IPv6Gateway":"",
                "GlobalIPv6Address":"",
                "GlobalIPv6PrefixLen":0,
                "MacAddress":"",
                "DriverOpts":null,
                "IPAMOperational":false
            }
        },
        "Service":null,
        "Ports":null,
        "SandboxKey":"/var/run/docker/netns/71b8410fa517",
        "SecondaryIPAddresses":null,
        "SecondaryIPv6Addresses":null,
        "IsAnonymousEndpoint":false,
        "HasSwarmEndpoint":false
    },
    "LogPath":"/var/lib/docker/containers/532f96985e4536759554cc7c2b68642e3075ec0dca5aed1fffc19c749e8907a2/532f96985e4536759554cc7c2b68642e3075ec0dca5aed1fffc19c749e8907a2-json.log",
    "Name":"/x-ui",
    "Driver":"overlay2",
    "OS":"linux",
    "MountLabel":"",
    "ProcessLabel":"",
    "RestartCount":0,
    "HasBeenStartedBefore":true,
    "HasBeenManuallyStopped":true,
    "MountPoints":{
        "/home/share":{
            "Source":"/home/kali/Desktop/docker/share",
            "Destination":"/home/share",
            "RW":true,
            "Name":"",
            "Driver":"",
            "Type":"bind",
            "Propagation":"rprivate",
            "Spec":{
                "Type":"bind",
                "Source":"//home/kali/Desktop/docker/share/",
                "Target":"/home/share/"
            },
            "SkipMountpointCreation":false
        }
    },
    "SecretReferences":null,
    "ConfigReferences":null,
    "AppArmorProfile":"docker-default",
    "HostnamePath":"/var/lib/docker/containers/532f96985e4536759554cc7c2b68642e3075ec0dca5aed1fffc19c749e8907a2/hostname",
    "HostsPath":"/var/lib/docker/containers/532f96985e4536759554cc7c2b68642e3075ec0dca5aed1fffc19c749e8907a2/hosts",
    "ShmPath":"",
    "ResolvConfPath":"/var/lib/docker/containers/532f96985e4536759554cc7c2b68642e3075ec0dca5aed1fffc19c749e8907a2/resolv.conf",
    "SeccompProfile":"",
    "NoNewPrivileges":false,
    "LocalLogCacheMeta":{
        "HaveNotifyEnabled":false
    }
}
```
# 3. 重启docker服务
```bash
systemctl start docker
```
# 4. 查看容器端口映射
```bash
docker start [your_containor_id/name]
docker post [your_containor_id/name]
docker ps -a
```
在本机查看一下端口占用
```
lsof -i:22
lsof -i:80
lsof -i:443
lsof -i:10086
```
