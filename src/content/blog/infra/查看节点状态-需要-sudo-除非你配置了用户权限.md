---
title: "K3s 安装与 Traefik 禁用（面向 APISIX）"
description: "安装 K3s 时禁用 Traefik，避免端口冲突并为 APISIX 网关预留环境。"
pubDate: "2025-12-31"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/k8s/Install ks3.md"
sourceVault: "obsidian/note"
slug: "infra/查看节点状态-需要-sudo-除非你配置了用户权限"
---
### 第二阶段：安装 K3s (针对 APISIX 优化的安装)

普通的 K3s 安装很简单，但**既然你要用 APISIX**，我们就不能用默认安装命令。

为什么？

K3s 默认自带一个叫 Traefik 的网关。如果你不禁用它，它会抢占 80 端口。你想用 APISIX 接管皇位，就需要把 Traefik 踢掉。

#### 1. 执行安装命令 (禁用 Traefik)

在你的服务器上执行这条命令：

Bash

```
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -
```

- `curl ...`: 下载安装脚本。
    
- `--disable traefik`: **关键参数**。告诉 K3s：“我不想要你自带的 Traefik 网关，我自己有安排（我要装 APISIX）”。
    

#### 2. 验证安装

安装通常只需要几十秒。完成后，检查节点状态：

Bash

```
# 查看节点状态 (需要 sudo，除非你配置了用户权限)
sudo k3s kubectl get nodes
```

如果看到 `STATUS` 是 **Ready**，恭喜你！你已经拥有了一个标准的 Kubernetes 集群。

#### 3. 配置 kubectl 便利性 (可选)

为了不用每次都输 `sudo k3s kubectl ...`，你可以把配置文件复制出来并设置别名：

Bash

```
# 1. 创建 .kube 目录
mkdir -p ~/.kube

# 2. 复制配置文件
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config

# 3. 修改文件权限归属当前用户
sudo chown $(id -u):$(id -g) ~/.kube/config

# 4. 设置 alias (写入 .bashrc 或 .zshrc)
echo "alias k='kubectl'" >> ~/.bashrc
source ~/.bashrc
```

现在你可以直接输入 `kubectl get nodes` 或者简写 `k get nodes` 了。

### 第三阶段：理解现在的状态

现在的服务器状态是：

1. **地基打好了**：K3s 正在运行。
    
2. **大门没装**：因为我们要用的 APISIX 还没装，而自带的 Traefik 被我们禁用了。
    
3. **房子是空的**：你的前端和后端应用还没部署进去。
    

此时如果你访问服务器的 IP，应该是什么都打不开的（Connection Refused），因为 80 端口现在没人监听。

### 第四步：准备 Docker 镜像

既然要上 K8s，你的前端和后端必须是 **Docker 镜像**。

1. **后端**：你之前已经有 Docker 部署了，说明你有镜像（或者 Dockerfile）。你需要把这个镜像推送到一个仓库（Docker Hub 或阿里云镜像仓库），或者直接在 K3s 节点上构建（K3s 可以直接使用本地导入的镜像，但推荐用仓库）。
    
2. **前端**：正如之前讨论的，你需要写一个 `Dockerfile` 把前端打包。
    

**前端 Dockerfile 示例 (放在你的 React/Vue 项目根目录):**

Dockerfile

```
# Step 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

# Step 2: Serve
FROM nginx:alpine
# 将构建好的文件放入 Nginx 镜像
COPY --from=builder /app/dist /usr/share/nginx/html
# 暴露容器内部端口
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 你的下一步

现在的当务之急是把 **APISIX** 装进这个 K3s 集群，让 80 端口重新工作起来。

**Would you like me to:** 指导你使用 **Helm** (K8s 的包管理器) 在 K3s 中安装 **Apache APISIX** 和 **APISIX Dashboard**？这是最标准的安装方式。

是的，下一步就是安装 **APISIX**。

既然我们已经用 K3s 打好了地基（并且清空了端口），现在要往上面盖“大门”了。

在 Kubernetes (K3s) 中安装软件，最标准的方式是使用 **Helm**（相当于 K8s 的应用商店/包管理器）。

请按照以下步骤操作，这将会在你的 K3s 集群中部署 APISIX、Etcd（它的数据库）以及 Dashboard。

### 第一步：安装 Helm 工具

如果你的服务器上还没有 `helm` 命令，先运行这行脚本安装它：

Bash

```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### 第二步：添加 APISIX 仓库

告诉 Helm 去哪里下载 APISIX：

Bash

```
helm repo add apisix https://charts.apiseven.com
helm repo update
```

### 第三步：准备配置文件 (`values.yaml`) —— **关键**

为了适配你的 **单机 K3s** 环境，我们需要调整一些默认配置。特别是要开启 `LoadBalancer` 模式，这样 K3s 就会自动把 APISIX 绑定到宿主机的 80 和 443 端口（这正是我们卸载 Nginx 的目的）。

请在服务器上新建一个文件 `apisix-values.yaml`，并将以下内容复制进去：

YAML

```
# apisix-values.yaml

# 1. 开启网关的 LoadBalancer 模式
# 在 K3s 中，这会让 APISIX 直接监听宿主机的 80/443 端口
gateway:
  type: LoadBalancer
  http:
    enabled: true
    servicePort: 80
  tls:
    enabled: true
    servicePort: 443

# 2. 优化资源占用
# 你是单机部署，etcd（数据库）不需要跑 3 个副本，1 个就够了，省内存
etcd:
  replicaCount: 1

# 3. 开启控制台 (Dashboard)
# 这样你就能通过网页界面配置路由了
dashboard:
  enabled: true

# 4. 开启 Ingress Controller
# 这让 APISIX 能看懂 K8s 的 yaml 配置，实现“自动化配置”
ingress-controller:
  enabled: true
  config:
    apisix:
      serviceNamespace: ingress-apisix
```

### 第四步：执行安装

我们把所有组件都安装到一个专门的命名空间 `ingress-apisix` 中。

Bash

```
# 1. 创建命名空间
kubectl create ns ingress-apisix

# 2. 开始安装 (这一步可能需要 1-2 分钟拉取镜像)
helm install apisix apisix/apisix \
  -f apisix-values.yaml \
  -n ingress-apisix
```

### 第五步：验证安装结果

等待几分钟后，查看 Pod 和 Service 的状态：

Bash

```
kubectl get pods,svc -n ingress-apisix
```

**你应该看到类似这样的结果：**

1. **Pods**: 应该有 `apisix-etcd-0` (数据库), `apisix-gateway-...` (网关), `apisix-dashboard-...` (控制台) 都在 `Running` 状态。
    
2. **Service**: 找到 `service/apisix-gateway` 这一行。
    
    - **关键点**：看它的 `EXTERNAL-IP`。在 K3s 里，它应该显示为你服务器的 **内网 IP** 或者具体的 IP 地址。这意味着它已经成功占领了 80 和 443 端口。

### 第六步：访问测试

此时，APISIX 已经接管了你服务器的 80 端口。

1. 测试网关：
    
    在浏览器直接访问你的 域名 或 服务器IP。
    
    你应该会看到一个 404 Not Found。
    
    - **注意**：这个 404 是 APISIX 返回的（通常是 `{"error_msg":"404 Route Not Found"}`），这说明 **APISIX 已经活着并且在工作了**！它只是还没配置路由，不知道把请求转发给谁。
        
2. 访问 Dashboard (控制台)：
    
    默认情况下，Dashboard 为了安全，不会直接暴露到公网。你需要用 K8s 的端口转发功能来临时访问它。
    
    在你的本地电脑（如果你配置了本地 kubectl）或者服务器上执行：
    
    Bash
    
    ```
    # 把服务器 Dashboard 的 9000 端口映射到当前机器的 9000
    kubectl port-forward -n ingress-apisix svc/apisix-dashboard 9000:9000 --address 0.0.0.0
    ```
    
    然后访问 `http://服务器IP:9000`。
    
    - **默认账号**: `admin`
        
    - **默认密码**: `admin`

### 你的下一步

现在“大门” (APISIX) 已经立起来了，它是空的，不通向任何房间。

接下来的任务是：**把你的前端 (Nginx Docker) 和后端 (FastAPI) 部署进 K8s，并告诉 APISIX 怎么走。**

**Would you like me to:** 教你写第一个 Kubernetes **Deployment** 和 **Service** 文件，先把你的 **前端镜像** 跑起来并配置域名访问？

这是一个非常经典的 **“找不到门”** 的错误。

原因分析：

K3s 的配置文件默认放在 /etc/rancher/k3s/k3s.yaml，而 helm 和 kubectl 默认去 ~/.kube/config 找配置文件。如果找不到，它们就会默认尝试连接 localhost:8080（这是标准 K8s 的默认行为），结果当然是连不上，因为 K3s 监听的是 6443 端口。

你需要把钥匙交给 Helm。请执行以下步骤修复：

### 方法一：临时生效（当前终端窗口）

直接告诉环境变量配置文件的位置：

Bash

```
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

执行完这句后，先运行一句命令测试一下：

Bash

```
kubectl get nodes
```

如果能看到节点状态，说明连通了，然后再执行你的 Helm 安装命令。

### 方法二：永久生效（推荐）

把配置文件复制到标准位置，这样以后新开窗口或者用 Helm 都不用每次敲 export 了。

Bash

```
# 1. 创建默认目录
mkdir -p ~/.kube

# 2. 复制 K3s 的配置文件过去
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config

# 3. (如果你是 root 用户，这一步可以跳过；如果是普通用户，需要改权限)
# chown $(id -u):$(id -g) ~/.kube/config
```

### 验证并重试

**第一步：验证连接**

Bash

```
kubectl get nodes
```

_必须看到 `Ready` 状态的节点，才能继续。_

**第二步：重新执行 Helm 安装**

Bash

```
helm install apisix apisix/apisix \
  -f apisix-values.yaml \
  -n ingress-apisix
```

这次应该就能成功了！

这就对了！现在你的环境很干净，而且 Helm 仓库也配置正确了。

但是，出现了一个新的问题：你的配置没有生效。

看日志，apisix-gateway 依然是 NodePort（且没有 External IP），而且 apisix-dashboard 依然没有出现。

原因分析：

Apache 官方的 Helm Chart (apisix/apisix) 和我们之前用的配置结构不一样。

1. 它不叫 `gateway`，而叫 `service`。
    
2. 它**不包含** Dashboard。官方现在推荐把 Dashboard 作为一个独立服务安装，而不是捆绑在一起。
    

我们需要分两步走：

1. **修正 APISIX 网关的配置**（让它变成 LoadBalancer）。
    
2. **单独安装 Dashboard**。
    

请严格执行以下步骤，这次一定能行。

### 第一步：修正 config.yaml (针对官方 Chart)

我们需要修改 `config.yaml`，把 `gateway` 改成 `service`，并去掉无效的 Dashboard 配置。

请复制下面的代码覆盖原文件：

Bash

```
cat <<EOF > config.yaml
# 1. 网关服务配置 (注意这里变成了 service)
service:
  type: LoadBalancer
  externalTrafficPolicy: Cluster
  http:
    enabled: true
    port: 80           # 对外暴露的 HTTP 端口
    containerPort: 9080
  tls:
    enabled: true
    servicePort: 443   # 对外暴露的 HTTPS 端口
    containerPort: 9443

# 2. Etcd 配置 (单机省资源)
etcd:
  replicaCount: 1

# 3. Ingress Controller (对接 K8s)
ingress-controller:
  enabled: true
  config:
    apisix:
      serviceNamespace: ingress-apisix
EOF
```

### 第二步：更新 APISIX 网关

用修正后的配置更新现有的安装：

Bash

```
helm upgrade apisix apisix/apisix \
  -f config.yaml \
  -n ingress-apisix \
  --wait
```

验证：

执行 kubectl get svc -n ingress-apisix。

现在 apisix-gateway 的 TYPE 应该变成 LoadBalancer 了，EXTERNAL-IP 应该显示你的内网 IP。

### 第三步：单独安装 Dashboard

官方把 Dashboard 拆分成了独立的 Chart，我们需要单独装它。

Bash

```
helm install apisix-dashboard apisix/apisix-dashboard \
  -n ingress-apisix \
  --set service.type=ClusterIP
```

验证：

再次执行 kubectl get svc -n ingress-apisix。

现在你应该能看到 apisix-dashboard 出现在列表里了！

### 第四步：最终联调

如果上面两步都成功了，你的 K3s 集群里应该是一片繁荣景象。

1. **访问网关**：浏览器打开 `http://你的服务器IP`。看到 `404 Not Found` (APISIX 返回的) 即为成功。
    
2. 访问 Dashboard：
    
    依然需要端口转发（因为我们设的是 ClusterIP 保护它）：
    
    Bash
    
    ```
    kubectl port-forward -n ingress-apisix svc/apisix-dashboard 9000:9000 --address 0.0.0.0
    ```
    
    浏览器访问 `http://服务器IP:9000` (账号密码 admin/admin)。
    

一旦确认这两点，我们的 **“K3s + APISIX 基础设施”** 就算彻底竣工了！下一步就可以部署你的前端代码了。

**是的，我强烈建议你先卸载它**，然后改用 Helm 安装。

原因有两个：

1. **管理一致性**：根据你之前提供的 APISIX `values.yaml`，你通过 Helm 管理基础设施。将 `cert-manager` 也纳入 Helm 管理，后续升级（比如从 v1.13 到 v1.15）会比手动 Apply YAML 文件方便得多。
    
2. **避免冲突**：如果你现在的集群里已经有了通过 YAML 安装的 cert-manager，再运行 `helm install` 可能会报错，或者造成资源归属混乱（Helm 认为资源不属于它，无法管理）。
    

### 1. 怎么卸载（清理环境）

直接使用 `delete` 命令，指向你刚才安装的那个 URL：

Bash

```
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

_注意：这会删除 cert-manager 的所有组件，包括 CRD（自定义资源定义）。如果你之前已经创建了 Issuer 或 Certificate，它们也会被清理掉。鉴于你是刚安装，这里应该是干净的。_

### 2. 改用 Helm 安装（推荐做法）

卸载完成后，请按照标准流程用 Helm 安装。

**步骤 A：添加仓库**

Bash

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

步骤 B：安装 Cert-Manager

注意：这里有一个非常重要的参数 --set installCRDs=true，千万别漏了。

Bash

```
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.0 \
  --set installCRDs=true
```

### 3. 验证安装

安装完成后，检查一下 Pod 是否都运行起来了：

Bash

```
kubectl get pods -n cert-manager
```

你应该能看到三个组件：

- `cert-manager`
    
- `cert-manager-cainjector`
    
- `cert-manager-webhook`
    

如果状态都是 `Running`，你就可以继续按照之前的步骤去创建 `ClusterIssuer` 和配置 `Ingress` 了。

**Would you like to proceed with creating the `ClusterIssuer` YAML now?**

你的配置非常适合配合 **Cert-Manager** 使用。

**分析你的配置：**

1. **`service: LoadBalancer`**: 你已经分配了一个外部 IP。
    
2. **`http.port: 80`**: HTTP 端口已开放，这对于 ACME 的 `HTTP-01` 校验至关重要（Let's Encrypt 必须能访问你的 80 端口）。
    
3. **`ingress-controller: enabled`**: 你使用的是 K8s Ingress 模式，这是 Cert-Manager 最擅长的场景。
    

基于你的这份 `values.yaml` 配置，以下是**一步步落地 ACME 自动证书**的最佳实践流程：

### 第一步：安装 Cert-Manager

如果还没有安装，直接用 Helm 安装最稳妥：

Bash

```
helm repo add jetstack https://charts.jetstack.io
helm repo update

# 安装 cert-manager，并安装 CRD
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

### 第二步：创建 ClusterIssuer (关键步骤)

我们需要告诉 cert-manager 如何去申请证书。请创建一个 YAML 文件（如 `issuer.yaml`）并应用它。

**注意**：这里最关键的是 `class: apisix`，它告诉 cert-manager：“请去修改 APISIX 的路由来完成验证，而不是 Nginx”。

YAML

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    # 你的邮箱，用于接收证书过期提醒
    email: your-email@example.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          # 重点：必须匹配 APISIX Ingress Controller 默认的 class 名
          class: apisix
```

应用配置：

Bash

```
kubectl apply -f issuer.yaml
```

### 第三步：配置 Ingress 使用证书

现在，你只需要在业务的 Ingress 资源中加 **3行注解** 和 **tls 配置**。

假设你要部署一个服务 `my-service`，域名是 `api.example.com`：

YAML

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    # 1. 指定使用 APISIX 处理流量
    kubernetes.io/ingress.class: apisix
    # 2. 指定使用上面创建的 Issuer 签发证书
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    # 3. (可选) 如果你想强制 HTTP 跳转 HTTPS，加这行
    k8s.apisix.apache.org/http-to-https: "true"
spec:
  tls:
  - hosts:
    - api.example.com
    # 证书签发成功后，会自动存到这个 Secret 里，名字随便取
    secretName: api-example-com-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

### 它是如何工作的？（流程解析）

当你 Apply 上面的 Ingress 后，会自动发生以下过程：

1. **触发**：Cert-manager 发现 Ingress 带了 `cert-manager.io/cluster-issuer` 注解。
    
2. **验证**：Cert-manager 临时创建一个特殊的 Ingress（路由），路径是 `/.well-known/acme-challenge/...`。
    
3. **生效**：APISIX Ingress Controller 监听到这个临时 Ingress，自动在 APISIX 网关中生效该路由。
    
4. **访问**：Let's Encrypt 服务器访问 `http://api.example.com/.well-known/...`。
    
5. **通过**：你的 LoadBalancer (80端口) -> APISIX -> Cert-manager Pod。验证通过。
    
6. **下发**：证书被保存到 Secret `api-example-com-tls`。
    
7. **加载**：APISIX 监听到 Secret 变化，热加载 SSL 证书。Https 访问生效。
    

### 可能遇到的坑

1. **DNS 解析**：确保 `api.example.com` 已经正确解析到了你的 `LoadBalancer` 的 **External IP**。
    
2. **网络策略**：如果你的 K8s 开启了 NetworkPolicy，确保 Cert-manager 的 Pod 能够被 APISIX 访问。
    
3. **Ingress Class**：默认情况下 APISIX 的 class 名是 `apisix`。如果你在 `values.yaml` 中修改了 `ingress-controller.config.ingressClass`，请确保 `ClusterIssuer` 中的 `class` 字段与之对应。
    

**Would you like me to explain how to debug if the certificate remains in a "Pending" state?**

配置好 Issuer（或 ClusterIssuer）后，查看其状态非常重要，因为这决定了它是否能成功向 Let's Encrypt 注册账户并申请证书。

由于我们通常推荐使用 `ClusterIssuer`（全局生效），请按照以下步骤检查：

### 1. 查看列表概览

首先查看集群里有哪些 ClusterIssuer 以及它们的简要状态：

Bash

```
kubectl get clusterissuers
```

预期的成功输出：

你看到的 READY 一栏应该是 True。

Plaintext

```
NAME               READY   AGE
letsencrypt-prod   True    10m
```

### 2. 查看详细状态 (排错必用)

如果 `READY` 是 `False`，或者你想确认它是否成功连接到了 Let's Encrypt，必须使用 `describe` 命令：

Bash

```
# 假设你的名字是 letsencrypt-prod
kubectl describe clusterissuer letsencrypt-prod
```

**你需要关注输出底部的 `Status` 部分：**

#### 🟢 成功状态示例

你应该在 `Status` -> `Conditions` 里看到 `Type: Ready` 和 `Status: True`，并且 `Message` 会显示账户注册成功。

YAML

```
Status:
  Acme:
    Uri:  https://acme-v02.api.letsencrypt.org/acme/acct/12345678
  Conditions:
    - Last Transition Time:  2023-10-27T08:00:00Z
      Message:               The ACME account was registered with the ACME server
      Reason:                ACMEAccountRegistered
      Status:                True
      Type:                  Ready
```

#### 🔴 常见失败原因及排查

如果你看到的 `Status` 是 `False`，请检查 `Message` 里的报错信息：

1. **404 / Network Error**:
    
    - 你的 K8s 集群可能无法访问外网，导致连不上 `acme-v02.api.letsencrypt.org`。
        
    - 检查集群的 DNS 或防火墙设置。
        
2. **Private Key Error**:
    
    - 报错类似于 `error getting private key`。
        
    - 这通常是因为你引用的 `privateKeySecretRef` 有问题，或者 cert-manager 没有权限创建 Secret。通常等待几秒钟，cert-manager 会自动创建这个 Secret。

### 补充：如果你创建的是 Issuer (非全局)

如果你没有使用 `ClusterIssuer` 而是使用了 `Issuer`（即只在特定 namespace 生效），查看命令需要加上 `-n` 参数：

Bash

```
# 查看列表
kubectl get issuers -n <你的namespace>

# 查看详情
kubectl describe issuer <issuer名字> -n <你的namespace>
```

**只要 ClusterIssuer 的状态是 `Ready: True`，你就可以放心地去部署 Ingress 来自动申请证书了。**
