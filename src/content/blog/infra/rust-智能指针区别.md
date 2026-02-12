---
title: "Rust 智能指针区别"
description: "只支持复制类型的 get/set，无法返回引用。"
pubDate: "2025-06-29"
updatedDate: "2025-06-30"
category: "infra"
tags: ["infra"]
sourcePath: "src/content/blog/ChatGPT-Rust 智能指针区别.md"
sourceVault: "chat-export"
---
## 背景与适用场景

本文整理 Rust 智能指针区别 的关键实践路径，适用于基础设施建设、部署与运维场景。

## 核心结论

- 类似 C++ 的，但更安全。
- 只支持复制类型的 get/set，无法返回引用。
- Rust 的智能指针可以说是它内存安全和零成本抽象的灵魂组件之一
- 它们实现“内部可变性”，绕过 Rust 的编译期借用检查
- 1\. —— 最纯粹的“堆指针”

## 详细说明

### rust的智能指针都有什么区别

Rust 的智能指针可以说是它内存安全和零成本抽象的灵魂组件之一

它们实现“内部可变性”，绕过 Rust 的编译期借用检查

### 实现思路 2

我们可以用 Rust 从零手写一个简单的 双向链表（Doubly Linked List），然后实现 和 指针的获取

和 分别返回指向头尾节点的 Rc 引用

### 实现思路 3

要我演示 unsafe + Box 的双向链表实现，也可以，不过真的 � � �

❌ 原因：递归结构导致“无限大小” —— Rust 无法推断大小

## 操作步骤与命令示例

### 示例 1

```rust
let b = Box::new(5);
```

### 示例 2

```rust
use std::rc::Rc;
let a = Rc::new(String::from("hello"));
let b = Rc::clone(&a);
```

### 示例 3

```rust
use std::sync::Arc;
let a = Arc::new(String::from("hello"));
// 可用于线程间传递
```

### 示例 4

```rust
use std::cell::RefCell;
let data = RefCell::new(vec![1, 2, 3]);
data.borrow_mut().push(4);
```

### 执行顺序建议

1. 明确目标环境、依赖条件与网络连通性。
2. 分阶段实施配置或部署，逐步验证。
3. 记录最终状态与回滚策略，便于复用。

## 常见问题与排查

- **问题：** rust的智能指针都有什么区别  **排查：** Rust 的智能指针可以说是它内存安全和零成本抽象的灵魂组件之一；它们实现“内部可变性”，绕过 Rust 的编译期借用检查
- **问题：** 为什么Rc还要嵌套一个RefCell  **排查：** 在 Rust 中有两条铁律（编译时就检查）；我们用 包裹，就能绕过编译期的限制，在 运行时 进行 borrow 检查
- **问题：** Rc提供不可变引用，那Box呢  **排查：** � 先对比一下 Rc 和 Box 的所有权模型；所以你可以直接改 Box 中的值

## 关键问答摘录

> **Q:** rust的智能指针都有什么区别
>
> **A:** Rust 的智能指针可以说是它内存安全和零成本抽象的灵魂组件之一；它们实现“内部可变性”，绕过 Rust 的编译期借用检查

> **Q:** 为什么Rc还要嵌套一个RefCell
>
> **A:** 在 Rust 中有两条铁律（编译时就检查）；我们用 包裹，就能绕过编译期的限制，在 运行时 进行 borrow 检查

## 总结

类似 C++ 的，但更安全。

- 原始对话来源：https://chatgpt.com/c/68622413-4cfc-8001-bd17-f738a06f264f
