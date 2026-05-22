---
title: "SHA 长度扩展攻击：原理、实现与防御"
description: "深入剖析 SHA-256 长度扩展攻击的原理，从 Merkle-Damgard 结构的设计缺陷出发，完整实现一个浏览器端的攻击演示，并探讨 HMAC 等防御方案。"
pubDate: 2026-05-21
category: "security"
tags: ["security", "cryptography", "sha256", "hash"]
---

## 什么是长度扩展攻击

长度扩展攻击（Length Extension Attack）是一种针对 Merkle-Damgard 结构哈希函数的经典密码学攻击。它允许攻击者在不知道密钥的情况下，仅凭一个已知的哈希值 `H(secret || message)`，就能构造出 `H(secret || message || padding || extension)` 的合法哈希值。

受影响的哈希函数包括：MD5、SHA-1、SHA-256、SHA-512 等所有基于 Merkle-Damgard 结构的哈希算法。

## 攻击场景

假设一个 Web 服务使用如下方式进行请求签名验证：

```python
SECRET = b"my_super_secret_key"   # 攻击者不知道

def verify(data, token):
    expected = sha256(SECRET + data).hexdigest()
    return expected == token

# 客户端请求：
# data  = b"user=guest&action=read"
# token = "8e3f...c7a2"

if verify(request.data, request.token):
    execute(request.data)   # 危险！
```

攻击者只需要：
1. 窃听到一对合法的 `(data, token)`
2. 知道或猜测 SECRET 的**长度**（不需要知道 SECRET 本身）

就能构造出包含恶意内容的新请求 `data'` 和对应的合法 `token'`，例如追加 `&action=DELETE_ALL`。

## SHA-256 的内部结构

要理解攻击为什么成立，需要先理解 SHA-256 的工作方式。

### Merkle-Damgard 结构

SHA-256 把消息切成 512-bit（64 字节）的块，像流水线一样依次"压缩"：

```
IV → f(IV, M₁) → H₁ → f(H₁, M₂) → H₂ → ... → Hₙ = 最终哈希
```

每一步压缩函数 `f` 的输入是**上一步的 256-bit 状态**加**当前 512-bit 消息块**。最终输出的哈希值就是最后一次压缩的状态，**没有任何额外后处理**。

### SHA-256 初始向量

SHA-256 的内部状态由 8 个 32-bit 整数组成（合计 256 bit），初始值来自前 8 个素数的平方根小数部分：

```
H₀ = 6a09e667    H₁ = bb67ae85    H₂ = 3c6ef372    H₃ = a54ff53a
H₄ = 510e527f    H₅ = 9b05688c    H₆ = 1f83d9ab    H₇ = 5be0cd19
```

### 填充规则

SHA-256 在处理消息前需要做填充，使消息长度成为 512 bit 的整数倍：

1. 追加一个 `0x80` 字节（即一个 1 比特后面跟 7 个 0 比特）
2. 追加若干 `0x00`，使总长度模 512 等于 448
3. 追加 64 位大端序的**原始消息比特长度**

这个规则是完全公开的，任何人都可以根据消息长度推算出填充内容。

## 漏洞的本质

三个关键事实：

1. **哈希 = 内部状态**：SHA-256 输出的 256 bit 就是最后一次压缩后的 8 个寄存器值，直接拼接，没有任何混淆
2. **填充规则公开**：给定消息长度，任何人都能算出填充内容
3. **压缩可以"接力"**：只要有中间状态 + 后续消息块，就能从任意位置继续计算

因此，拿到 `H = SHA256(SECRET || data)` 就等于拿到了处理完这段消息后的内部状态。攻击者可以把这个哈希值拆成 8 个 32-bit 整数，当作"伪 IV"继续计算任意追加内容。

## 攻击步骤

### Step 1：获取合法 token

攻击者窃听到：
- `data = "user=alice&action=read"`（22 字节）
- `token = SHA256(SECRET || data)` 的值

### Step 2：还原内部状态

把 64 个 hex 字符的 token 切成 8 段，每段 8 个 hex 字符 = 一个 32-bit 整数：

```javascript
function parseHashToState(hexHash) {
    const H = new Uint32Array(8);
    for (let i = 0; i < 8; i++) {
        H[i] = parseInt(hexHash.substr(i * 8, 8), 16) >>> 0;
    }
    return H;
}
```

### Step 3：构造 glue padding

假设攻击者猜测 SECRET 长度为 12 字节，则 `SECRET || data` 共 34 字节（272 bit）。模拟 SHA-256 的填充逻辑：

```javascript
function computePadding(messageLenBytes) {
    const zeros = (56 - (messageLenBytes + 1) % 64 + 64) % 64;
    const out = new Uint8Array(1 + zeros + 8);
    out[0] = 0x80;
    let bl = BigInt(messageLenBytes) * 8n;
    for (let i = 7; i >= 0; i--) {
        out[1 + zeros + i] = Number(bl & 0xffn);
        bl >>= 8n;
    }
    return out;
}
```

34 字节的消息需要 30 字节填充（1 + 21 + 8），正好凑满 64 字节。

### Step 4：拼装伪造请求

```
data' = data || glue_padding || extension
```

当服务端计算 `SHA256(SECRET || data')` 时，前 64 字节（SECRET + data + glue padding）恰好填满一个完整的 SHA-256 块，压缩后的状态正是攻击者已知的那个 token！

### Step 5：从中间状态继续计算

```javascript
function sha256FromState(fakeIV, prevTotalBytes, extension) {
    const totalLen = prevTotalBytes + extension.length;
    const finalPadding = computePadding(totalLen);
    const tail = concatBytes(extension, finalPadding);

    const H = new Uint32Array(fakeIV);
    for (let i = 0; i < tail.length; i += 64) {
        processBlock(H, tail.subarray(i, i + 64));
    }

    const out = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
        out[i * 4]     = (H[i] >>> 24) & 0xff;
        out[i * 4 + 1] = (H[i] >>> 16) & 0xff;
        out[i * 4 + 2] = (H[i] >>> 8) & 0xff;
        out[i * 4 + 3] = H[i] & 0xff;
    }
    return bytesToHex(out);
}
```

### Step 6：攻击成功

服务端收到 `(data', H')` 后计算 `SHA256(SECRET || data')`，结果与攻击者伪造的 `H'` 完全一致，验证通过。

## 密钥长度爆破

如果攻击者不知道密钥长度，只需从 1 到 N 逐个尝试。每个候选长度生成一个 token 发给服务端验证，能通过的就对应真实长度。整个过程仅需 N 次哈希计算，代价极低。

## 实现：纯 JavaScript 的 SHA-256 + 长度扩展攻击

我用纯 JavaScript 实现了一个完整的交互式演示，包含：

- **从零实现的 SHA-256**：包含消息扩展、64 轮压缩的完整实现
- **攻击全流程动画**：逐步展示每一步的字节变化
- **交互实验室**：可自由修改参数、亲手验证攻击
- **密钥长度爆破**：一键遍历所有可能的密钥长度

核心压缩函数实现：

```javascript
function processBlock(H, block) {
    const W = new Uint32Array(64);
    // 前 16 个字：从 block 读取（大端）
    for (let i = 0; i < 16; i++) {
        W[i] = ((block[i*4] << 24) | (block[i*4+1] << 16) |
                (block[i*4+2] << 8) | block[i*4+3]) >>> 0;
    }
    // 消息扩展：W₁₆..W₆₃
    for (let i = 16; i < 64; i++) {
        const s0 = rotr(W[i-15], 7) ^ rotr(W[i-15], 18) ^ (W[i-15] >>> 3);
        const s1 = rotr(W[i-2], 17) ^ rotr(W[i-2], 19)  ^ (W[i-2] >>> 10);
        W[i] = (W[i-16] + s0 + W[i-7] + s1) >>> 0;
    }

    let a = H[0], b = H[1], c = H[2], d = H[3];
    let e = H[4], f = H[5], g = H[6], h = H[7];

    for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;

        h = g; g = f; f = e;
        e = (d + temp1) >>> 0;
        d = c; c = b; b = a;
        a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;  H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;  H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;  H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;  H[7] = (H[7] + h) >>> 0;
}
```

## 防御方案

### 不要这样写

```
H(SECRET || data)  ← 受长度扩展攻击影响
```

### 也不够安全

```
H(data || SECRET)  ← 能挡住长度扩展，但存在碰撞攻击风险
```

### 推荐方案：HMAC

```
HMAC-SHA256(K, data) = H((K ⊕ opad) || H((K ⊕ ipad) || data))
```

HMAC 用双层哈希 + 内外密钥派生，外层哈希切断了"中间状态 = 输出"的链路，长度扩展攻击立刻失效。

### 现代方案

- **SHA-3 (Keccak)**：基于 Sponge 结构，天然免疫长度扩展攻击
- **BLAKE2 / BLAKE3**：设计了内置 MAC 模式
- **双重哈希**：`SHA256(SHA256(K || M))` 也能防御（比特币 PoW 就用了双 SHA-256）

## 实战建议

1. **消息认证**永远用 `HMAC`，不要自己拼 `H(K||M)`
2. **新项目**偏好 SHA-3、BLAKE2/3 等无长度扩展漏洞的哈希
3. **原则**：消息认证用专门的 MAC 算法，绝不要把哈希函数当 MAC 直接用

## 在线演示

我把这个项目做成了一个完整的交互式教学页面，所有计算在浏览器本地完成，包含：

- Merkle-Damgard 流水线动画
- SHA-256 填充规则的实时可视化
- 6 步攻击全流程动画演示
- 自由实验室：修改任意参数验证攻击
- 密钥长度暴力枚举演示

> 项目地址：[SHA Length Extension Attack Demo](https://losfurina.github.io/sha-length-extension/)

## 参考资料

- RFC 2104 - HMAC: Keyed-Hashing for Message Authentication
- FIPS 180-4 - Secure Hash Standard (SHS)
- Merkle, R.C. (1979) - Secrecy, Authentication, and Public Key Systems
