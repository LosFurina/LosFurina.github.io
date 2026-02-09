---
title: "阿里云 ECS 购买与初始化配置"
description: "以阿里云 ECS 为例，记录实例选型、系统配置与 SSH 首次登录准备。"
pubDate: "2025-01-06"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/Purchase Cloud Computer.md"
sourceVault: "obsidian/note"
slug: "infra/1-ali-cloud-obsidian"
---
## 1. AliCloud（示例流程）

以下以阿里云 ECS 为例，给出一套可复用的购买配置思路：

1. 进入控制台并点击 `Purchase Immediately`。  
   `[Image omitted: image.png | source: ../assets/image_1731401599940_0.png]`
2. 计费方式选择抢占式（Preemptible Instance）以降低成本。  
   `[Image omitted: image.png | source: ../assets/image_1731402387897_0.png]`
3. 规格建议按业务选型；示例中使用 `4 vCPU + 8 GB RAM`。  
   `[Image omitted: image.png | source: ../assets/image_1731402758277_0.png]`
4. 系统镜像使用 Ubuntu 22.04 LTS，兼顾生态与稳定性。  
   `[Image omitted: image.png | source: ../assets/image_1731402791094_0.png]`
5. 存储建议至少 40 GB（用于服务、日志与备份缓冲）。  
   `[Image omitted: image.png | source: ../assets/image_1731402963923_0.png]`
6. 带宽按场景决定；实时服务（如游戏服）应优先保证上行质量。  
   `[Image omitted: image.png | source: ../assets/image_1731403963554_0.png]`
7. 配置 SSH 登录凭据（密码或密钥对），并完成订单创建。  
   `[Image omitted: image.png | source: ../assets/image_1731404295370_0.png]`

## 2. CloudCone
