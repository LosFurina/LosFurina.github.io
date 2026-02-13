---
title: "GitHub 协作规范执行指南"
description: "Checklist：在 PR 模板里加上 Checkbox。"
pubDate: "2026-02-12"
updatedDate: "2026-02-13"
category: "git"
tags: ["git"]
sourcePath: "src/content/blog/Gemini-GitHub 协作规范执行指南.md"
sourceVault: "chat-export"
---

## 背景与目标

本文围绕“我反复给队友强调过，github issue在写的时候要写清楚需求，命名...”展开，整理可直接复用的步骤、原理说明与排查经验。

## 核心内容

### 主题 1. 我反复给队友强调过，github issue在写的时候要写清楚需求，命名...

这是一种非常典型的团队协作崩溃感，这种“无力感”通常不是因为技术问题，而是因为**协作共识的破裂**。你觉得自己像是在带幼儿园，而不是在和一个成年人团队合作。

既然“反复强调”这种口头/文字约束已经失效了（三次以上就证明此路不通），那么继续生气只会消耗你自己。现在需要从**“说教模式”**切换到**“机制约束模式”**。

与其想放弃，不如在放弃前试一下把“坏人”的角色交给机器和规则。以下是几个递进的解决策略：

### 1\. 降低门槛：用模板代替记忆 (Templates)

队友可能不是故意想捣乱，而是懒或者是真的记不住规范。

*   **Issue/PR 模板**：不要指望他们从头写。在 `.github/ISSUE_TEMPLATE` 和 `.github/PULL_REQUEST_TEMPLATE` 里把格式写死。
    *   **强制填空**：在模板里写清楚 `### 需求描述`、`### 关联 Issue`、`### 测试截图`。他们只需要填空，如果不填，提交上来一眼就能看出是空的。
    *   **Checklist**：在 PR 模板里加上 Checkbox：
        *   \[ \] Assignee 已指定
        *   \[ \] Project 已关联
        *   \[ \] Reviewer 已指定

### 2\. 强制约束：把规范变成“硬墙” (Hard Constraints)

既然靠自觉不行，就靠工具拦截。作为项目的 Owner 或 Admin，你可以设置关卡：

*   **Branch Protection Rules (分支保护规则)**：
    *   在 GitHub Settings 里设置 `main` 或 `develop` 分支。
    *   勾选 **"Require a pull request before merging"**。
    *   勾选 **"Require approvals"** (至少 1 人)。
    *   **关键点**：如果他们随便提一个 PR 没人 Review，代码根本合不进去。你不需要催他们改，你只需要**不 Merge**。
*   **Commit Linting (自动化拦截)**：
    *   引入 `husky` + `commitlint`。
    *   如果他们的 commit message 是 "fix bug" 这种只有两个单词的废话，Git 会在他们本地直接报错，**禁止 push**。让他们必须按照 `feat: xxx` 或 `fix: xxx` 的格式写，否则代码都提交不上去。

### 3\. 执行策略：拒绝 Review (Stop Enabling)

这是心理博弈的一环。你现在的愤怒是因为你还在帮他们“兜底”。

*   **停止无效擦屁股**：看到不规范的 Issue 或 PR，**不要帮他们补全，也不要进行代码 Review**。
*   **冷处理**：直接在 PR 下面留一条评论（甚至可以用 Saved Replies）：
> "这个 PR 缺少详细描述/关联 Issue，且未指定 Reviewer，我不清楚具体改动意图，无法 Review。请按规范补充完整后再 Ping 我。"
*   然后直接 Close 或者放置不管。**不要生气，要冷淡地执行规则。** 当他们的代码因为流程问题合不进去，影响到他们自己的进度时，他们自然会来找你问为什么。

### 4\. 重新审视团队预期

如果上了上述手段，队友依然摆烂，那说明这不仅是规范问题，是**态度问题**。

*   如果这是**工作**：向上级反映协作阻力，表明这增加了维护成本和 Bug 风险。
*   如果这是**学生/开源项目**：你需要接受这个团队可能只有你一个人在“输出”的事实。把核心代码权限收紧，把他们边缘化，或者寻找新的队友。不要为了不值得的人消耗自己的技术热情。

**总结建议：** 不要再“强调”了，由于你是负责任的那一方，你的反复强调在他们听来只是噪音。**把规则写进代码里，把拦截交给 CI/CD 和 GitHub Setting。**

**Would you like me to generate a strict `pull_request_template.md` or a `commitlint` configuration file for you to drop directly into your project?**

### 主题 2. 我唯一能做的就是拒绝review，但是队友是纯不懂，不和就不和

既然你已经设置了模板但他们依然“瞎写”，而且你担心不 Merge 会显得自己“不合群”，那么现在的问题早已不是技术流程问题，而是**心理博弈**和**责任边界**的问题。

针对“队友纯不懂”且“不想因为严格要求而被孤立”的矛盾心态，你需要调整策略。

### 1\. 破除心理魔咒：“不合群” vs “背锅侠”

你感到“不合群”，是因为你把**“维持代码质量”**的责任全揽在了自己身上，而队友把这当成**“你在找茬”**。

但你要明白一个残酷的事实：**如果你妥协了，Merge 了垃圾代码，最后出 Bug 修不好的时候，那个“背锅”和“擦屁股”的人一定是你。** 因为你是唯一懂的人。

*   **现状**：做一个“合群”的滥好人 = 累死自己 + 项目烂尾。
*   **目标**：做一个“有原则”的合作者 = 保护自己的时间 + 倒逼他们成长（或直接放弃他们）。

### 2\. 具体执行策略：把自己变成“莫得感情的机器人”

既然“反复强调”会让关系紧张，那就停止说教。用 GitHub 的**“Request Changes”**功能代替口头沟通。不要带情绪，像是一个冷冰冰的 Linter。

**策略 A：复制粘贴流（减少你的情绪消耗）** 准备一段标准话术，每次遇到瞎写的 PR，直接点 `Files changed` -\> `Review changes` -\> `Request changes`，然后粘贴这段话：

>  **Review Rejected**
> 
> 能够理解大家想尽快合并代码，但为了保证项目后续不崩盘，请务必补充以下信息：
> 
> 1.  **具体改动了什么**（不要只写 fix bug，请写明修复了哪个逻辑）。
> 2.  **关联 Issue**（我们需要追踪进度）。
> 3.  **自测截图/证据**（证明代码是跑得通的）。
>     
> 
> **请补全后再次 Ping 我 Review。在此之前我无法通过 Merge，因为这会引入风险。**

**为什么这样做。**

*   **你不是在拒绝他们，你是在拒绝风险。**
*   这把球踢回给了他们。如果他们不动，PR 就挂着。
*   **不要催**。既然你已经接受了“不合就不合”，那就让他们急。等到 Deadline 临近，他们自然会为了能 Merge 而不得不照做。

### 3\. 针对“纯不懂”队友的降维打击

既然队友“纯不懂”，他们可能真的不知道什么叫“规范”。为了不让你显得“只知道卡人却不教人”，你可以做最后一次努力（为了让自己问心无愧，也是为了堵住别人的嘴）：

**给一个满分范例（Golden Sample）** 在群里发最后一次公告（或者置顶）：

> “大家，因为最近代码冲突和 Bug 有点多，为了我们项目能按时搞完，以后 PR 必须按规范来。我写了一个**标准范例**（发一个链接），以后照着这个格式填空的我就 Merge，没填的我就打回了，不然改 Bug 太累了，大家理解一下。”

从此之后，你的所有拒绝理由只有一句话：“请参考群里的标准范例补充信息。”

### 4\. 终极防御：隔离你的核心代码

如果以上都做了，他们还是烂泥扶不上墙，而你又必须和他们在一个项目里（比如学校作业）：

*   **模块化隔离**：将你的核心代码封装成独立的模块或类。
*   **接口对接**：让他们去写外围的、UI 的、或者数据填充的代码。
*   **不要让他们碰核心逻辑**：如果他们非要改你的代码，严格卡死；如果他们改他们自己的垃圾代码，只要不报错，**睁一只眼闭一只眼 Merge 进去**，只要不炸掉你的模块就行。

**总结** 既然已经做好了“不想管”的准备，那就把**“不 Merge”**作为你的底线。你现在的坚持，是在保护这个项目（以及你自己的简历/成绩）。

**你需要我帮你写那段“高情商但有原则”的群公告文案，或者那个“满分 PR 范例”吗。这样你可以直接丢群里，不用自己再费脑子组织语言。**

### 主题 3. 给我找一个模范仓库，就是各种流程都很规范的那种，我给他们发出去学一下

这一招很好，把“我的要求”变成“业界的标准”。这样你就不是在刁难他们，而是在帮他们**对齐大厂规范**。

既然你的队友“纯不懂”，找那种几万个文件的超大项目（比如 Linux 内核或 Kubernetes）可能会把他们吓晕。你需要的是**“既规范又易读”**的现代化项目。

这里有两个不同维度的“模范仓库”，你可以直接甩链接给他们：

### 1\. 极简清晰流：FastAPI (Python)

**适用场景**：适合你的队友看。因为这个项目的作者（Tiangolo）不仅代码写得好，而且有“文档洁癖”，他的 Issue 和 PR 管理非常人性化且规范，非常适合初学者模仿。

*   **仓库地址**: `tiangolo/fastapi`
*   **给队友看这个 PR 范例**：
[Pull Request #10069](https://www.google.com/search?q=https://github.com/tiangolo/fastapi/pull/10069)
(或者随便点开一个 Merged 的 PR)
    *   **看点**：
        1.  **标题清晰**：`Fix typo in docs...` 一眼知道干嘛的。
        2.  **描述完整**：不是空的。写了为什么要改。
        3.  **Checklist**：底下的 "Checklist" 全部勾选，证明自己检查过。

### 2\. 权威铁血流：VS Code (Microsoft)

**适用场景**：用来压阵。微软买了 GitHub，VS Code 是微软的亲儿子，这就是**“官方标准答案”**。如果队友质疑为什么要这么麻烦，就告诉他们“微软就是这么干的”。

*   **仓库地址**: `microsoft/vscode`
*   **给队友看这个 PR 范例**：
[Pull Request #203123](https://www.google.com/search?q=https://github.com/microsoft/vscode/pull/203123)
(示例)
    *   **看点**：
        1.  **关联 Issue**：描述里清楚地写着 `Fixes #12345`，点击就能跳转到 Issue。
        2.  **Bot 自动检查**：你看下面有一堆 Bot 在跑，如果不按规范写，Bot 直接标红，都没人理你。
        3.  **Review 流程**：你可以让他们看看 Files changed 里，Reviewer 是怎么针对每一行代码提意见的。

### 3\. 专门教小白流：First Contributions

**适用场景**：如果他们是真的**完全不懂** Git 流程，让他们花 5 分钟在这个仓库里操作一遍。这是 GitHub 上最火的“新手村”项目。

*   **仓库地址**: `firstcontributions/first-contributions`
*   **作用**：这个仓库就是专门让人练习“Fork -\> Clone -\> Branch -\> Commit -\> Push -\> Submit PR”这套标准动作的。

### 建议的话术（Copy 给队友）

发到群里的时候，不要带情绪，要带一种“发现新大陆”或者“为了大家好”的语气：

> “兄弟们，为了避免后面代码合并不了或者出 Bug 找不到锅，我们还是得统一一下协作标准。
> 
> 我找了两个业界最标准的开源项目（FastAPI 和 VS Code），我们也不用搞那么复杂，但至少得向人家靠拢一下：
> 
> 1.  **PR 怎么写**：看看人家这个格式（
>     [附上 FastAPI PR 链接](https://www.google.com/search?q=https://github.com/tiangolo/fastapi/pull/10069)
>     ），标题说人话，描述里把改动点写出来，别再只写两个单词了。
> 2.  **关联 Issue**：所有的改动最好都有个 Issue 对应，方便追踪。
>     
> 
> 我们毕竟是团队开发，甚至以后找工作面试，这种**规范的协作记录**也是很加分的。以后我就按这个标准来 Merge 了哈，太随意的我就先打回让大家补全一下信息，大家都方便。”

**下一步：** 如果他们看了还是不改，那你就可以理直气壮地在 PR 里评论：“**请参考群里发的 FastAPI 那个范例，补全 Issue 关联和描述。**” 然后关掉页面，去喝杯咖啡。

### 主题 4. 我想知道我们的仓库是main和dev双protect，那么我们临时fea...

这是一个非常经典且容易踩坑的 GitHub 机制问题。

简单直接的回答是：**很大概率不会触发，千万不要依赖这个流程。**

只有在一种非常特定的操作组合下（Squash Merge + 这里的文本被完整保留进 Commit Message）才有可能生效，但在多人协作中这非常不稳定。

这里有两个核心机制在起作用，导致你的想法落空：

### 1\. 只有“默认分支”才拥有“生杀大权”

GitHub 的 `Closes/Fixes #ID` 关键词自动化，默认情况下**只监听“默认分支”（Default Branch）**的变化。

*   通常默认分支是 `main`。
*   当代码合并到 `dev` 时，因为 `dev` 不是默认分支，GitHub **只会**在 Issue 里显示一条引用记录（例如 "referenced this issue..."），但**不会关闭** Issue。

### 2\. PR Description ≠ Commit Message (最关键的坑)

这是很多团队混淆的地方：

*   **PR 的 Description（描述）**：是 GitHub 网页上的元数据。
*   **Commit Message（提交信息）**：是写进 Git 历史里的数据。

当你把 `feat` 合并到 `dev` 时：

*   **如果你用 Create a merge commit（普通合并）**：Git 会生成一个类似 `Merge pull request #5 from feat-xxx` 的新 Commit。你原来写在 PR 描述里的 `close #123` **直接丢了**，它没有进入 `dev` 分支的 Git 历史，只是留在了那个已经 Closed 的 PR 网页上。
*   **如果你用 Squash and merge（压缩合并）**：GitHub 默认会把 PR 的标题和描述复制到新的 Commit Message 里。只有这种情况下，`close #123` 才会变成 `dev` 分支上某行代码的一部分。

**结论**：等到 `dev` 再次合并到 `main` 时，GitHub 扫描的是进入 `main` 的**Commit Message**。

*   如果之前是普通合并，`main` 根本看不到 `close #123` 这几个字。
*   即使之前是 Squash，等到 `dev` -\> `main` 这一步，如果你又做了一次 Squash，历史再次被压缩，这行字可能又丢了。

### 正确的解决姿势

为了不让你的 Issue 变成“僵尸”（代码都上线了 Issue 还开着），你有两个选择：

#### 方案 A：在 Release PR 里写（最推荐，最规范）

不要在 `feat` -\> `dev` 的时候尝试关闭 Issue。

*   `feat` -\> `dev`：仅引用。写 `Ref #123` 或者 `Related to #123`。
*   **`dev` -\> `main`**：当你要发版时，通常会提一个“Release v1.0”之类的总 PR。**在这个总 PR 的 Description 里，列出所有要关闭的 Issue。**
> Closes #101, Closes #102, Fixes #105

#### 方案 B：使用 GitHub Actions 暴力接管（适合小白团队）

既然你的队友可能记不住在 `dev -> main` 时去写那些 ID，你可以写一个 Action：**只要代码合入 `dev`，就视为完成**（如果你定义进入 Dev 就算做完了的话）。

在 `.github/workflows/close-issue.yml` 里：

```
name: Close Issue on Merge to Dev

on:
  pull_request:
    types: [closed]
    branches:
      - dev  # 监听合并到 dev 的动作

jobs:
  close-issue:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            // 这是一个简单的逻辑：去读取 PR body 里的 issue 编号并关闭它
            // 实际上这一步比较复杂，需要正则匹配 Body 里的 "close #xxx"
            // 建议直接用现成的 Action 市场插件，比如 "keyword-issue-closer"
```

### 建议

鉴于你的团队现状（队友各种不规范），**方案 A** 比较难执行，因为他们提 `dev -> main` PR 的时候肯定懒得去翻之前改了哪些 Issue。

**最现实的妥协**： 利用 GitHub 的 **"Linked Issues"** 侧边栏功能。 教队友在提 `feat -> dev` 的 PR 时，不要手写 `close #123`，而是点击 PR 页面右侧边栏的 **Development** 选项，手动选一下关联的 Issue。

虽然这不会在进 `dev` 时关闭，但当这个 PR 最终随着 `dev` 滚进 `main` 的时候，GitHub 只要检测到**代码关联**，是有很大几率能自动识别并关闭的（取决于具体的 Merge 路径，但比手写文本靠谱一点）。

**如果不放心，还是得你亲自做那个 `dev -> main` 的守门员，手动在 Release PR 里把 Issue 编号填上去。**

### 主题 5. 也就是我在dev-main时，要手动去找哪些issue需要被close

如果你什么都不做，完全靠人肉去记，那确实是的——**这简直是噩梦**。

试想一下：`dev` 分支积累了 20 个 PR，包含 50 个 commit，对应了 15 个 Issue。等到要发版合并到 `main` 的时候，你要一个个去翻之前的记录，找出一串神秘代码 `Close #12, #15, #18...` 填进去。**这根本不是人干的事。**

这里有三个解决办法，从“纯手工”到“全自动”，推荐直接上**方案三**。

### 方案一：Git 命令行“作弊”流（半自动）

不要去翻 GitHub 网页，直接问 Git。 在你要把 `dev` 合并到 `main` 之前，在终端敲一行命令：

```
# 列出 main 和 dev 之间所有差异 commit 的 body 信息，并过滤出含 close/fix 的行
git log main..dev --pretty=format:"%b" | grep -iE "close|fix|resolve"
```

这会直接吐出一堆 `Closes #123`，你把这些复制粘贴到 `dev -> main` 的 PR 描述里就行了。

*   **缺点**：如果队友连 Commit Message 里的 `Closes` 都不写（只写在 PR 描述里），这招就废了。

### 方案二：改变合并策略（不推荐，会导致主分支乱）

如果你的 `dev -> main` 使用的是 **"Create a merge commit"**（保留历史），而不是 Squash，那么：

*   只要队友在 `feat -> dev` 的 Commit Message 里写过 `Closes #123`。
*   这些 Commit 会原封不动地流向 `main`。
*   GitHub 扫描到 `main` 分支出现了含 `Closes` 的 commit，就会自动关闭 Issue。

**致命缺点**：你的 `main` 分支会变得非常脏，充斥着队友那些 "fix typo", "update" 的垃圾 commit。通常大项目不许这么干。

### 方案三：引入 Release Drafter（全自动・强烈推荐）

这是 DevOps 的标准解法。既然你不想管人，就让 **GitHub Actions** 帮你管。

**原理**： 安装一个叫 **Release Drafter** 的 Action。它会自动监听所有合并到 `dev`（或者你指定的默认分支）的 PR。哪怕 Issue 还没关，它会把这些 PR 的标题、作者、以及关联的 Issue 号码都记在一个“草稿清单”里。

**怎么做。**

1.  在仓库里添加文件 `.github/workflows/release-drafter.yml`。
2.  当你把 `dev` 合并到 `main` 时，这个 Action 会自动生成一个 Release Note 草稿，里面长这样：

> **What's Changed**
> 
> *   Feat: User login logic by @teammate in #5 (Closes #10)
> *   Fix: Database connection by @teammate in #6 (Closes #12)
>     

**你只需要做一件事**： 把 `dev` 合并到 `main` 后，打开 Releases 页面，点击那个自动生成的 Draft，点一下 **Publish**。 **所有列在里面的 Issue 就会瞬间全部自动关闭。**

#### 只需要这几行配置：

```
name: Release Drafter

on:
  push:
    branches:
      - main  # 当代码进 main 时触发

jobs:
  update_release_draft:
    runs-on: ubuntu-latest
    steps:
      - uses: release-drafter/release-drafter@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 总结

你现在的痛点是**信息断层**：队友在 `feat` 写的信息，在 `dev` 汇总时丢了。

*   **最快止痛药**：用 `git log` 命令查出来，手动复制。
*   **根治药方**：配置 **Release Drafter**。它不仅帮你收集 Issue ID，连发版日志（Changelog）都帮你写好了。对于你这种不想管杂事的人来说，这是神器。

**要不要我给你一个配置好的 `release-drafter.yml` 模板。你可以直接丢进仓库，马上生效。**

### 主题 6. 也就说，我需要把 close ref关键词写入 commit messa...

是的，这是**底层逻辑**。

GitHub 的自动关闭机制（Autolinked references）本质上是一个**文本扫描器**。

当代码合并到默认分支（`main`）的那一瞬间，GitHub 会扫描**新进入的 Commit Message**。只要在这些 Message 里扫到了 `Closes #123`，它就会执行关闭操作。

### 但你千万不要逼队友在命令行里写。

如果你的队友连 Issue 描述都懒得写，你如果要求他们在终端敲命令时写： `git commit -m "fix: login bug (Closes #123)"` **他们绝对会经常忘，或者写错格式。**

### 最佳实践：用“Squash Merge”把 PR 描述“变”成 Commit Message

你只需要让队友在 **PR 界面（网页上）** 填好，然后通过你的**合并操作**，把它转换进 Commit Message 里。

#### 具体操作流程（闭环）：

1.  **队友的操作（门槛最低）**： 队友只负责在 PR 的 **Description（描述框）** 里写：
> fix: 修复登录问题 Closes #10
2.  **你的操作（关键一步）**： 当你在 GitHub 网页上把 `feat` 合并进 `dev` 时，**不要点绿色的 "Merge pull request"**。 你要点击旁边的小箭头，选择 **"Squash and merge"**（扁平化合并）。
    *   **发生了什么。** GitHub 会把队友那堆杂乱的 commits 压缩成**一个 commit**。 同时，它会自动把队友在 **PR Description** 里写的 `Closes #10` 复制到这个**新 Commit 的 Message** 里。
3.  **最终生效（dev -\> main）**： 现在 `dev` 分支里就有了一个包含 `Closes #10` 文字的 Commit。 当你把 `dev` 合并进 `main` 时（这次可以用普通 Merge），这个 Commit 就会带着这行字进入 `main`，Issue #10 应声关闭。

### 结论

**不需要**队友在 `git commit` 时写。 **只需要**队友在 PR 网页填空 + 你使用 **Squash Merge**。

这样做的好处是：**只要 PR 模板里有了（你已经设了），且你合并时用了 Squash，该事项就成了。**

### 排查场景 1. 我看很多人都是这样写commit message

- 场景：我看很多人都是这样写commit message
- 处理要点：
你观察得很仔细，这种写法非常普遍，它是**“Conventional Commits（约定式提交）”**结合**“GitHub 引用机制”**的产物。

但是，这里有一个**巨大的陷阱**，也是你之前一直无法自动关闭 Issue 的核心原因：

### 1\. 只有 `#id` 是关不掉 Issue 的。

如果你队友写的是：

> `fix: fix login bug #123`

结果是：Issue #123 下面会多一条记录 "mentioned in commit..."（产生了**关联**），但是 Issue **依然是 Open 状态**。

如果要自动关闭，必须加动词（Keywords）：

> `fix: fix login bug (Closes #123)`

GitHub 只认以下关键词（不区分大小写）：

*   `close`, `closes`, `closed`
*   `fix`, `fixes`, `fixed`
*   `resolve`, `resolves`, `resolved`

### 2\. 业界标准写法解析

既然你想让团队学，那就直接教最标准的。这种格式叫 **Conventional Commits**。

#### 格式公式

```
<type>(<scope>): <subject> (Closes #<issue-id>)
```

*   **Type（必填）**：告诉别人这次改动是什么性质。
    *   `feat`: 新功能 (feature)
    *   `fix`: 修补 bug
    *   `docs`: 文档 (documentation)
    *   `style`: 格式 (不影响代码运行的变动)
    *   `refactor`: 重构 (即不是新增功能，也不是修改 bug 的代码变动)
    *   `chore`: 构建过程或辅助工具的变动
*   **Subject（必填）**：简短描述，不要超过 50 个字符，结尾不要加句号。
*   **Footer（选填）**：用于关闭 Issue。

#### 举几个例子

**例子 A：一行流（适合小修小补，你的队友会喜欢这个）**

```
fix: 修复用户头像不显示的问题 (Closes #45)
```

_优点：简单，一句命令搞定。_

**例子 B：标准流（正规大厂写法）**

```
feat: 增加微信支付接口

这里可以写详细的描述，比如为什么要加这个接口，
逻辑是什么。支持换行。

Closes #102
```

_优点：清晰，适合复杂的改动。_

### 3\. 如何在你那个“不想管”的团队落地。

鉴于你的队友比较懒且不规范，如果你要求他们每次都在命令行里敲这么标准，他们肯定会疯（或者乱写）。

**最“狡猾”的落地策略：利用 `commitlint` 做硬性拦截。**

你刚才说“不合就不合”，那就在项目里装个**保安**。

1.  **安装工具**（在项目根目录）：
```
    npm install --save-dev @commitlint/{config-conventional,cli} husky
```
_(假设是前端或 Node 项目，其他语言也有类似工具)_
2.  **配置规则**： 创建 `commitlint.config.js`：
```
    module.exports = {
      extends: ['@commitlint/config-conventional'],
      // 这里可以不用自定义，默认就是要求 fix: xxx 这种格式
    };
```
3.  **效果**： 队友如果在终端敲：`git commit -m "update code"` **报错。提交失败。** 终端会提示：
>  subject may not be empty  type may not be empty
队友必须敲：`git commit -m "chore: update code"` 才能过。

### 总结

你看到的 `<type>: subject #issue-id` 是对的，但为了能自动关 Issue，必须改良成： **`<type>: subject (Closes #issue-id)`**

建议你直接把这个格式贴在群公告里：“兄弟们，以后 Commit Message 必须按这个格式写，不然代码推不上去/Issue 关不掉，系统会自动拦截。”

### 排查场景 2. 我觉得安装这个插件不错

- 场景：我觉得安装这个插件不错
- 处理要点：
这是一个非常明智的决定。引入工具拦截，相当于雇了一个**24小时在线、铁面无私的保安**。你的队友再怎么跟你抱怨也没用，因为是代码仓库报错，不是你在找茬。

鉴于你的项目包含前端（React），你们肯定有 `package.json`。用 **Husky + Commitlint** 是业界的标准解法。

请按照下面 3 步操作，直接把这个机制部署下去：

### 第一步：安装“保安” (Husky & Commitlint)

在项目根目录下，运行这条命令安装必要的开发依赖：

```
npm install --save-dev @commitlint/{config-conventional,cli} husky
```

### 第二步：制定“法律” (配置文件)

在根目录创建一个 `commitlint.config.js` 文件，告诉工具我们要用标准规范：

```
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 这里可以自定义，比如强行要求 header 必须小写，或者 type 必须是那些词
    // 默认配置已经足够好用，不用改
  }
};
```

_(或者直接运行命令生成：`echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`)_

### 第三步：把保安安排到门口 (激活 Git Hooks)

Husky 现在（v9版本）配置非常简单。运行以下两条命令：

1.  **初始化 Husky**（这会创建 `.husky` 文件夹）：
```
    npx husky init
```
2.  **添加拦截规则**（告诉 Git 在 commit 发生前去检查 message）：
```
    echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### 效果演示（爽文时刻）

配置好之后，把这些文件 push 上去。以后任何队友 pull 下来代码（只要他们跑过 `npm install`），他们想瞎写的时候就会遭遇**降维打击**：

** 场景一：队友想偷懒** 输入：`git commit -m "fix bug"` 结果：**提交失败。** 终端直接爆红：

```
⧗   input: fix bug
   subject may not be empty [subject-empty]
   type may not be empty [type-empty]

husky - commit-msg hook exited with code 1 (error)
```

** 场景二：队友乱写格式** 输入：`git commit -m "Fixed: 登录问题"` (注意大写和冒号) 结果：**提交失败。**

```
   type must be lower-case [type-case]
   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]
```

** 场景三：乖乖按规矩来** 输入：`git commit -m "fix: 修复登录页面的 404 问题 (Closes #12)"` 结果：**提交成功。**

### ️ 最后一个关键动作

你把这些配置推送到 GitHub 后，**一定要在群里吼一声：**

> “大家 pull 一下最新代码，然后运行 `npm install` 更新一下依赖。 我加了个自动检查插件，以后 commit 格式不对会直接报错提交不上去，格式参考群公告。这是为了防止我们的代码库变乱，机器自动拦截的，谁也绕不过去哈。”

这样，你就彻底从“老妈子”变成了“系统管理员”，不用再费口舌了。

**需要我帮你解释一下怎么处理那些“非 Node.js”环境（比如如果你们后端是纯 Python 且不想装 node 环境）的情况吗。**

### 主题 7. Close或者其他关键词 issue-id

这是一个非常硬核的配置需求。

标准的 `@commitlint/config-conventional` 只能约束 `<type>: <subject>` 这个基本结构，**它默认并不会强制你必须在 Header 或者 Footer 里写 `#issue-id`**。

既然你的队友“屡教不改”，我们需要在 `commitlint.config.js` 里加一点**自定义规则（Plugin）**，像交警一样强制检查“有没有带证件（Issue ID）”。

以下是为你定制的**终极拦截配置**，直接覆盖你原来的文件即可：

###  升级版 commitlint.config.js

```
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 1. 定义自定义插件，用来写正则检查
  plugins: [
    {
      rules: {
        'header-match-issue-id': (parsed) => {
          const { header } = parsed;
          // 正则含义：必须以 (空格 + # + 数字 + ) 结尾
          // 例如：feat: add login (#123)
          const regex = /\s\(#\d+\)$/;
          
          if (regex.test(header)) {
            return [true];
          }
          return [false, 'Header 必须以 (#issue-id) 结尾！例如: feat: 修复登录问题 (#123)'];
        },
        'body-be-detailed': (parsed) => {
             const { body } = parsed;
             // 简单的字数检查，强制要求 Body 必须写，且不少于 10 个字符
             if (body && body.length >= 10) {
                 return [true];
             }
             return [false, 'Body 描述太短了！请详细说明改动内容 (至少10个字符)。'];
        }
      }
    }
  ],
  // 2. 激活规则
  rules: {
    // === 基础规则 (继承自 conventional) ===
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']],
    'type-case': [2, 'always', 'lower-case'], // type必须小写
    'scope-case': [2, 'always', 'lower-case'], // scope必须小写
    
    // === 你的定制规则 ===
    // 强制 Header 必须包含 (#issue-id)
    'header-match-issue-id': [2, 'always'], 
    
    // 强制 Body 不能为空，且不能太短 (防止"fix bug"这种废话)
    'body-be-detailed': [2, 'always'],
    'body-leading-blank': [2, 'always'], // header 和 body 之间必须空一行
    
    // === Footer 规则 ===
    // 如果你想强制 Footer 里必须写 "Closes #xxx"，开启下面这行：
    // 'references-empty': [2, 'never'], 
  }
};
```

###  这个配置能做到什么。

假设队友想提交： `git commit -m "fix: 修复bug"` (这是以前的摆烂写法)

**拦截结果：**

1.  **报错 1**：`Header 必须以 (#issue-id) 结尾。`
2.  **报错 2**：`Body 描述太短了。`

队友**必须**改成这样才能提交成功：

```
git commit -m "fix(auth): 修复登录页面的Token失效问题 (#102)

这里详细写了为什么Token会失效，因为后端的过期时间改了，
所以我把前端的刷新逻辑也同步更新了。

Closes #102"
```

###  给你的特别建议

1.  **关于冗余**：你要求的格式里，Header 写了 `(#id)`，Footer 又要写 `Closes #id`。
    *   **Header 里的 (#id)**：是为了在 `git log` 一眼看到关联，**但它不能自动关闭 Issue**。
    *   **Footer 里的 Closes #id**：是为了**自动关闭 Issue**。
    *   **结论**：虽然写两遍有点烦，但为了规范和追踪，这在严格的项目里是合理的。
2.  **如何推行**： 把这个配置文件推上去后，你的队友下次 `commit` 肯定会报错。 到时候你只需要淡淡地说一句：
> “系统升级了，现在的 Commit 必须带 Issue ID 并且写清楚 Body，不然过不了检查，按照报错提示改一下就行。”

### 主题 8. 这个啥意思

这行命令是 Git Hook 脚本的核心，它的作用可以翻译为： **“去用项目里安装好的那个 commitlint 工具，检查一下 Git 传过来的这个临时文件里的提交信息。”**

我们需要把它拆解成 5 个部分来看，每一部分都有它的深意：

### 1\. `npx`

*   **作用**：运行安装在 `node_modules` 里的可执行文件。
*   **为什么用它**：你把 commitlint 安装在项目本地（`devDependencies`）了，没有安装在全局。直接敲 `commitlint` 系统是不认识的，必须用 `npx` 去把它找出来运行。

### 2\. `--no` (最关键的一个参数)

*   **全称**：`--no-install`
*   **含义**：**只使用本地项目里安装的包，绝对不要去网上下载。**
*   **为什么要加**：
    *   如果你的队友手贱或者是新来的，没有运行 `npm install` 就直接想 commit 代码，本地是没有 `commitlint` 的。
    *   如果不加 `--no`，`npx` 会自作聪明地尝试去互联网上下载最新版的 commitlint 来运行。这会导致版本不一致，或者因为网络问题卡半天。
    *   加了 `--no`，如果本地没装，它会直接**报错退出**。这是一道安全阀，强迫队友必须先 `npm install`。

### 3\. `--`

*   **含义**：**参数分隔符**。
*   **作用**：告诉 `npx`：“我的话讲完了”。
*   **详解**：`--` 之后的所有内容（`commitlint --edit $1`），`npx` 都不再解析，而是原封不动地传给后面的命令。这是为了防止后面的参数（比如 `--edit`）被 `npx` 误认为是自己的参数。

### 4\. `commitlint`

*   **含义**：这就是你要调用的那个检查工具的主程序。

### 5\. `--edit $1`

*   **`$1` 是什么**：这是 Shell 脚本的变量，代表**“第一个参数”**。
    *   当你在 Git 中执行 commit 时，Git 会创建一个临时文件（通常叫 `.git/COMMIT_EDITMSG`），里面装着你刚写的 commit message。
    *   Git 调用 `commit-msg` 钩子时，会把这个**文件的路径**作为第一个参数传进来。所以 `$1` 就是那个文件的路径。
*   **`--edit` 是什么**：这是 `commitlint` 的参数。
    *   它告诉 commitlint：“不要傻等着我从键盘输入，**去读取 `$1` 这个路径下的文件内容**来进行检查。”

### 总结一下剧情

当队友输入 `git commit -m "fix bug"` 时：

1.  Git 创建临时文件，里面写着 "fix bug"。
2.  Git 触发 Husky 钩子，运行这就话。
3.  **npx**: "我要运行工具了。"
4.  **\--no**: "但我只在本地找，找不到我就报错。"
5.  **commitlint**: "我要开始检查了。"
6.  **\--edit \$1**: "我要检查的内容在 `$1` 这个文件里。"
7.  **结果**: 发现 "fix bug" 太短且格式不对 -\> **报错拦截**。

### 排查场景 3. 这把我也搞死了

- 场景：这把我也搞死了
- 处理要点：
不过往好处想：**这证明你的拦截机制（Husky + Commitlint）工作得非常完美。** 连作为 Admin 的你都绕不过去，你的队友就更别想绕过去了。

###  错误原因：缺个“空行”

报错信息 `body must have leading blank line` 的意思是：**标题（Header）和 正文（Body）之间，必须空一行。**

你刚才提交的信息，在机器眼里长这样（太挤了）：

```
feat(infra): add git commit message linter (#81)
add git commit message linter rules...  <-- 这里直接接上了，不行！
Close #81
```

###  正确姿势：要像写邮件一样

你需要给标题和正文之间留出呼吸空间。

#### 写法 A：如果你是用命令行 (`-m`)

你需要用多个 `-m` 参数，Git 会自动帮你加空行：

```
git commit -m "feat(infra): add git commit message linter (#81)" -m "add git commit message linter rules including header check, body check and reference check." -m "Close #81"
```

_(注意：这里用了三个 `-m`，分别是：标题、正文、Footer。这样中间会自动插入空行，完美符合规范)_

#### 写法 B：如果你是用编辑器 (Vim / Nano / VS Code)

当你输入 `git commit` 此时弹出的编辑器里，你必须这样写（注意第 2 行和第 4 行必须是空的）：

```
feat(infra): add git commit message linter (#81)

add git commit message linter rules including header check, body check and reference check.

Close #81
```

###  紧急救援：如果不想要这个规则

如果你觉得“还要敲回车”太反人类，或者你觉得你自己都受不了这个约束，更别提队友了。你可以把这个规则**降级**或者**关掉**。

修改 `commitlint.config.js`：

```
export default {
  // ... 其他配置
  rules: {
    // ... 其他规则
    
    // [0]=off, [1]=warning(黄色警告但不拦截), [2]=error(红色报错并拦截)
    
    // 方案一：改成警告 (推荐)，提醒你空一行，但允许你强制通过
    'body-leading-blank': [1, 'always'],
    
    // 方案二：彻底关掉 (如果你们懒得空行)
    'body-leading-blank': [0, 'always'],
  }
};
```

**我的建议**： 既然是“模范仓库”，**咬咬牙坚持一下。** 用 **写法 A**（多个 `-m`）是最舒服的，既不用打开编辑器，又能自动生成空行，显得非常专业。

快去试一下三个 `-m` 的大法，绝对能过。

### 主题 9. 项目里安装这个的多不多，我这算不算官僚主义

这绝对**不算**官僚主义，这叫**工程化（Engineering）**。

你现在做的事情，是在把“人的管理”转化为“机器的代码”。在现代开发流程中，这不仅不多余，反而是**最主流、最节省时间**的做法。

我来给你吃颗定心丸，顺便帮你理清“官僚”和“规范”的区别。

### 1\. 市场占有率：多得吓人

你担心的“是不是只有我这么变态”，数据会告诉你答案：

*   **Husky** 每周下载量：**1200万+** 次（NPM 数据）。
*   **Commitlint** 每周下载量：**500万+** 次。
*   **谁在用**：Vue CLI、NestJS、Next.js 社区模板、Angular（它是这套规范的鼻祖）、几乎所有的开源大厂项目（Google, Facebook, Airbnb）。

**结论**：你不是在搞官僚主义，你是在把你的草台班子团队强行拉到**一线大厂的及格线**。

### 2\. 什么是“官僚主义” vs “基建”。

你现在的自我怀疑是因为你被工具拦住了，觉得麻烦。但请对比一下：

*   **真正的官僚主义（Bureaucracy）**：
    *   你让队友每次提交前必须截图发给你看。
    *   你需要填一张 Excel 表格记录这次改了什么。
    *   你口头反复念叨“注意格式”，队友听烦了，你也说累了，最后还没效果。
    *   **特点**：靠人肉堆积，效率低，情绪消耗大。
*   **基建/工程化（Infrastructure）**：
    *   你配置好 `commitlint`。
    *   队友乱写 -\> 电脑报错 -\> 队友自己改 -\> 提交成功。
    *   **全程不需要你介入**。你不需要当“坏人”，是脚本在当“坏人”。
    *   **特点**：一次配置，自动拦截，对事不对人。

### 3\. 你现在的“痛苦”是必要的

你刚才被卡住（因为没空行），这种**“不爽感”**正是这套机制生效的证明。

*   如果连作为 Admin 的你都因为写得不规范被拦截了，说明这套规则是**铁面无私**的。
*   你的队友第一次也会痛，但痛两次之后，他们就会形成**肌肉记忆**。
*   一个月后，你会发现整个仓库的 Log 赏心悦目，找 Bug 一搜一个准，发版只需一键生成 Changelog。那时候你会感谢现在的自己。

### 4\. 你的身份转变

你之前觉得“不想管这个团队了”，是因为你处于 **Level 1**：

*   **Level 1 (保姆)**：天天跟在后面擦屁股，帮他们改格式，帮他们补测试。

你引入 Husky 后，你正在走向 **Level 2**：

*   **Level 2 (架构师/DevOps)**：制定规则，编写工具，让系统去管理质量。

### 总结

**千万不要撤回。** 你现在是在做正确的事（DevOps 左移，把问题拦截在最源头）。

如果队友抱怨“太麻烦了”，你就把锅甩给业界标准：

> “没办法，这是现在 GitHub 上主流项目的标准配置，我们早点习惯，以后去大厂面试或者是参与开源项目，这都是基本功，我这是在帮大家提前适应。”

这一波，你站得住脚。继续保持。

### 排查场景 4. 但是你看这个，我写的怎么都变成。。。了

- 场景：但是你看这个，我写的怎么都变成。。。了
- 处理要点：
看图诊断：这绝对是**“复制粘贴”的锅**。

这种情况通常发生在你试图“恢复”之前的命令时，不小心**复制了被截断的日志或预览文本**。

### ️‍️ 案发现场还原

请看你的截图细节：

1.  标题结尾是 `standardize c...`（c后面被截断了）。
2.  描述开头是 `...ooperate flow`（cooperate前面被截断了）。

**真相只有一个**： 你之前的某次操作失败了（比如被 Husky 拦截时），然后你为了省事，可能去复制了终端里的报错日志、或者 VS Code 的 Git 插件里的日志预览。 **那些日志预览通常会自动截断长文字，并用 `...` 省略。** 结果你把这堆带着省略号的“残次品”文字，直接粘进了 `git commit` 命令里。

于是，Git 忠实地把 `...` 当作了你的提交信息存进去了。GitHub 只是把 Git 里的内容读出来了而已。

### ️ 怎么修。（强迫症疗法）

既然我们是为了规范代码才加的 Linter，这个 Commit 本身肯定不能这么“脏”。不要在 GitHub 网页上改，要在源头改。

#### 第一步：在终端原地修补

使用 `amend`（修正）命令，它允许你重新编辑最后一次提交的信息，而不用产生新的 Commit。

```
git commit --amend
```

#### 第二步：在弹出的编辑器里修复文字

你会看到那段带 `...` 的烂文字。

*   把 `standardize c...` 补全为 `standardize cooperate flow`。
*   把下面那行 `...ooperate flow` 删掉或者修好。
*   确保格式符合你刚立的规矩：
```
    feat(infra): add git commit message linter and husky (#81)
    Add git commit message linter rules including header check, body check and reference check.
    Closes #81
```
*   保存并退出（如果是 Vim：按 `Esc` -\> 输入 `:wq` -\> 回车）。

#### 第三步：强推覆盖

因为你之前已经 Push 过那个“残次品”了，现在需要用修正后的版本覆盖它：

```
git push --force
```

#### 第四步：刷新 GitHub

回到你截图的这个页面，刷新一下。你会发现标题和描述都变正常了，没有省略号了。

**这次算是一个完美的“Git 事故现场恢复”教学。**

### 主题 10. 有没有办法强制队员pr的时候记得点reviewer，issue里强制设置...

这也是两个非常经典的管理痛点。和之前的代码规范一样，解决思路依然是：**与其靠人脑记，不如靠机器填，或者靠机器拦。**

针对你的两个需求，分别有“上策”（自动完成）和“下策”（强制拦截）：

### 需求一：强制指定 Reviewer (审阅人)

最完美的方案根本不需要队员去“点”那个按钮，而是让 GitHub **自动分配**。

####  上策：使用 `CODEOWNERS` 文件 (强烈推荐)

这是 GitHub 原生支持的功能。你只需要在仓库里放一个文件，GitHub 就会在队员提 PR 时**自动把 Reviewer 填上**。

1.  **创建文件**：在仓库根目录创建 `.github/CODEOWNERS`。
2.  **写入规则**：
```
    # 语法：<文件路径> <GitHub用户名>
    # 所有文件默认都由你 (@your-username) 负责审阅
    * @your-username
    # 前端代码自动分配给前端负责人
    src/    @frontend-lead
    # 文档自动分配给文档撰写人
    docs/   @doc-writer
```
3.  **效果**： 队员提 PR 的一瞬间，GitHub 会根据他修改的文件，自动把对应的 `@your-username` 加到 Reviewers 列表里。**队员想忘都忘不了，因为系统替他做了。**

#### ️ 配合分支保护

为了确保万无一失，去 Settings -\> Branches -\> Branch protection rules -\> main:

*   勾选 **Require a pull request before merging**
*   勾选 **Require review from Code Owners** (关键。这意味着如果不经过 `CODEOWNERS` 指定的人同意，代码合不进去)。

### 需求二：Issue 强制关联 Project

GitHub 目前没有原生设置能“如果不选 Project 就不让点 Create Issue 按钮”。但是，我们可以用 **GitHub Actions** 来做一个“事后监工”。

####  方案 A：自动归档 (适合懒人)

既然他们懒得选，你就设置让所有新 Issue **自动**进入某个 Project。

1.  打开你的 **GitHub Project** (Projects Beta/V2)。
2.  点击右上角的 **Workflows**。
3.  选择 **"Auto-add to project"**。
4.  设置规则：当 `Issue` 是 `opened` 状态时，自动添加到当前 Project。
5.  **效果**：队员只要提 Issue，不用操作，它就会自动出现在你的 Project 看板里（通常在 "No Status" 或 "Todo" 栏）。

####  方案 B：强制机器人拦截 (适合强迫症)

如果你必须要求他们**手动**分类（比如你有多个 Project），可以用 Action 检查。如果发现没填 Project，就自动把 Issue 关掉并留言羞辱（误）。

**Action 配置 (`.github/workflows/enforce-project.yml`):**

```
name: Enforce Project on Issue

on:
  issues:
    types: [opened, reopened]

jobs:
  check-project:
    runs-on: ubuntu-latest
    steps:
      - name: Check if linked to project
        uses: actions/github-script@v6
        with:
          script: |
            // 获取当前 Issue 的详情（包含 Project 信息）
            const issue = await github.graphql(`
              query($owner: String!, $repo: String!, $number: Int!) {
                repository(owner: $owner, name: $repo) {
                  issue(number: $number) {
                    projectItems(first: 1) {
                      nodes {
                        id
                      }
                    }
                  }
                }
              }
            `, {
              owner: context.repo.owner,
              repo: context.repo.repo,
              number: context.issue.number
            });

            const projects = issue.repository.issue.projectItems.nodes;

            // 如果没有关联 Project
            if (projects.length === 0) {
              // 1. 留评论
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: " **Issue 创建失败！**\n\n为了便于管理，请在右侧边栏 **Projects** 中选择所属项目，然后重新 Reopen 这个 Issue。"
              });

              // 2. 直接关闭 Issue
              await github.rest.issues.update({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                state: 'closed'
              });
            }
```

**效果：** 队员新建了一个 Issue 没选 Project -\> **系统秒关 Issue** -\> 并在下面留言：“选好 Project 再来重开。” -\> 队员只能乖乖去选，然后点 Reopen。

### 总结建议

1.  **Reviewer 问题**：直接用 **`CODEOWNERS`**。这是最优雅的解法，不仅解决了“忘记点”的问题，还解决了“不知道点谁”的问题。
2.  **Project 问题**：推荐用 **GitHub Project 自带的 Auto-add Workflows**。让机器帮你归档，比强迫队员去点那几个复杂的菜单要顺滑得多。除非你的项目分类特别复杂，否则不要轻易用 Action 自动关闭 Issue，那样太打击积极性了。

### 主题 11. \ 文档自动分配给文档撰写人

**答案是：必须可以。而且这通常是更推荐的做法。**

把 Reviewer 设置为 Team 而不是个人，可以有效避免“单点阻塞”（比如某个人请假了，PR 就没人看了），也能让团队成员分担 Review 压力。

### 1\. 语法格式

在 `.github/CODEOWNERS` 文件里，你需要使用 **`@组织名/团队名`** 的格式。

**示例：**

```
# 语法：<文件路径> <@Organization/Team-Name>

# 后端代码由 Backend 组负责
server/     @MyCompany/backend-devs

# 前端代码由 Frontend 组负责
client/     @MyCompany/frontend-devs

# 关键的基础设施代码，必须由架构组负责
infra/      @MyCompany/arch-team
```

### 2\. ️ 必须要满足的前置条件

这功能虽然好用，但有三个坑新手经常踩，请务必检查：

1.  **必须是 Organization（组织）账号**：
    *   这个功能依赖于 GitHub 的 "Teams" 功能。如果你的仓库是在**个人账号**下（比如 `wayne/my-repo`），你是没法创建 Team 的，只能一个个 @具体的用户名。
    *   如果是公司或学校项目，通常都是 Organization。
2.  **团队必须有“写”权限**：
    *   你指定的那个 Team（比如 `@MyCompany/backend-devs`），必须在仓库的 **Settings -\> Collaborators and teams** 里被添加进去，并且至少拥有 **Write** 权限。如果没有权限，GitHub 会忽略这行配置。
3.  **名称是 Slug 不是 Display Name**：
    *   如果你团队叫 "Backend Developers"，它的 **Slug**（用于代码引用的名字）通常是 `backend-developers`。
    *   **哪里看 Slug。** 去 GitHub 组织页面 -\> Teams -\> 点进你的组 -\> 浏览器的 URL最后一段就是。

### 3\. 进阶玩法：负载均衡 (Round Robin)

当你把 Reviewer 设置为 Team 后，默认情况下 GitHub 会**通知团队里的每一个人**。这可能会导致“旁观者效应”（大家都觉得别人会看，结果谁都没看）。

你可以开启**“自动分配 (Auto-assignment)”**，让算法帮你轮询分配。

**设置路径：**

1.  进入 Organization 页面 -\> Teams。
2.  点击对应的 Team (比如 `frontend-devs`)。
3.  点击上方的 **Settings** -\> 左侧 **Code review assignment**。
4.  勾选 **Enable auto-assignment**。

**这里有两个神级选项：**

*   **Count existing requests**：根据每个人手上积压的 PR 数量来分配，谁闲给谁。
*   **Routing algorithm**：可以选择 `Round robin`（轮叫调度）或者 `Load balance`（负载均衡）。

**设置后的效果：** 你在 `CODEOWNERS` 里写了 `@MyCompany/frontend-devs`。 队员提 PR 时，系统会自动从前端组里**挑出 1-2 个人**（数量可配）填进 Reviewer 栏，而不是把全组人都骚扰一遍。

**建议：** 先去确认一下你的仓库是不是在 Organization 下。如果是，直接建 Team 走起，这比指定单个人要灵活得多。

### 主题 12. github可以改注册邮箱吗

**GitHub 是支持修改注册邮箱（即主邮箱）的。** 你完全不需要重新注册账号。

修改过程分为“添加新邮箱”和“设为主邮箱”两步。以下是详细操作指南：

### 核心步骤

1.  **进入设置页面**：
    *   点击 GitHub 页面右上角的头像，选择 **Settings**（设置）。
2.  **找到邮箱设置**：
    *   在左侧边栏的 "Access"（访问）区域下，点击 **Emails**。
3.  **添加新邮箱**：
    *   在 "Add email address" 输入框中填入你的新邮箱，点击 **Add** 按钮。
    *   GitHub 会向该邮箱发送一封验证邮件，你需要登录邮箱点击链接进行验证。
4.  **设为主邮箱 (Primary)**：
    *   验证通过后，回到 Emails 设置页。
    *   在 **"Primary email address"** 下拉菜单中，选择你刚才添加的新邮箱，然后点击 **Save**。
    *   此时，你的登录账号、通知邮件都会变更为这个新邮箱。
5.  **删除旧邮箱**：
    *   如果你不再使用旧邮箱，可以在邮箱列表中找到旧邮箱，点击旁边的垃圾桶图标（Delete）将其移除。

### 需要注意的两个区别

在 GitHub 上，“邮箱”其实有两个不同的概念，建议你根据需求一起修改：

*   **账号主邮箱 (Primary Email)**：
    *   **用途**：用于登录 GitHub 网站、找回密码、接收系统通知（如 Issue、PR 提醒）。
    *   **修改影响**：修改后，你需要用新邮箱登录。
*   **Commit 邮箱 (Commit Email)**：
    *   **用途**：用于记录你的代码提交历史（即 git log 中显示的邮箱），这决定了 GitHub 上的“绿格子”（Contribution）是否能正确统计给你。
    *   **修改方法**：仅仅在网页上改了主邮箱是不够的，你还需要在本地电脑的终端里运行以下命令，更新 git 配置：
```
        git config --global user.email "你的新邮箱@example.com"
```
    *   _注意：这只影响未来的提交，以前的历史提交记录里依然会显示旧邮箱。_

### 特殊情况

如果你使用的是公司分配的 **Managed User** 账号（通常在企业版中），你可能无法自行修改邮箱，需要联系公司的管理员在身份验证系统（IdP）中修改。

... 
[GitHub 更改主邮箱教程](https://www.youtube.com/watch?v=x5-QTo5EQ8c)
... 这段视频演示了如何添加新邮箱、验证并将其设为主邮箱的完整流程，适合不想看文字步骤的用户。

### 排查场景 5. 把这一段写成不是我官僚主义的解释，我会放在频道里

- 场景：把这一段写成不是我官僚主义的解释，我会放在频道里
- 处理要点：
这篇文案的关键在于：**把“我对你们的要求”转化为“我们对项目的追求”**，同时通过**自嘲**（我也被拦截了）来拉近距离，最后用**职业前景**（大厂标准）来提供动力。

这里有三个版本，你可以根据你们团队平时的沟通氛围来选：

### 版本一：硬核理性风（适合理科男/技术宅团队，强调逻辑和效率）

**核心逻辑**：这不是官僚主义，这是为了防止我们以后花更多时间修烂摊子。

> ** 关于最近引入 Commit 检查工具的说明**
> 
> 兄弟们，最近加了 Husky 和 Commitlint 拦截，大家可能会觉得有点繁琐，甚至觉得这是在搞“官僚主义”。我想解释一下为什么要这么做：
> 
> **1\. 拒绝“人肉运维”，拥抱“工程化”** 真正的官僚主义是我天天跟在大家屁股后面念叨“注意格式”，还要填 Excel 表格记录改动，那样大家烦我也累。 我们现在的做法叫**工程化 (Engineering)**——把规范写死在代码里，由脚本充当“坏人”来拦截。**对事不对人**，全程不需要人工介入，这才是最节省大家时间的做法。
> 
> **2\. 向业界一线标准看齐** 我们用的这套规范（Angular/Conventional Commits），目前 Vue、React、NestJS 这些顶级开源项目都在用，Husky 每周下载量 1200w+。这真不是我无效尝试，而是把我们这个“草台班子”强行拉到**大厂的及格线**。
> 
> **3\. 阵痛是难免的（我也被卡了）** 实不相瞒，刚配好规则我自己提交的时候也被卡了好几次（因为没空行、没关联 Issue）。这种“不爽感”说明机制生效了。
> 
> 大家忍过前几次的阵痛，形成肌肉记忆就好了。在这个项目里养成的规范习惯，以后不管是面试还是去大厂工作，绝对是加分项。我们一起克服一下，为了后面维护不炸锅，谢了。

### 版本二：幽默自嘲风（适合关系比较铁/轻松的团队，降低抵触感）

**核心逻辑**：我也很痛苦，但为了不加班修 Bug，我们得忍。

> ** 【辟谣】我没有在搞官僚主义，我在搞基建。**
> 
> 大家最近 push 代码可能发现会有红色的报错拦截，是不是觉得我变态了。 听我狡辩一下：
> 
> **以前的模式（官僚主义）**： 我：兄弟你这 commit 没写清楚啊... 你：下次一定。 （最后 Bug 找不到了，大家一起通宵排查）
> 
> **现在的模式（自动化基建）**： 脚本：格式不对。拒收。 你：靠...改一下。（成功提交） （以后找 Bug 一搜一个准，发版一键生成日志）
> 
> **为什么要这么搞。** 我不想当保姆天天盯着大家改格式，所以请了个“冷面保安”（Husky）站在门口。这玩意儿确实铁面无私，**我自己刚才都被拦回来三次**，差点把键盘砸了。
> 
> 但为了我们项目不变成屎山，也为了大家以后出去面试能说“我有丰富的大型项目工程化经验”，我们就拿这个练练手。这是目前 GitHub 上最主流的配置，早适应早受益，求轻喷。‍️

### 版本三：短小精悍风（如果队友不爱看长文，发这个）

> ** 关于代码提交规范的几句心里话**
> 
> 1.  **这不是形式主义**：引入工具拦截是为了**把“人的管理”变成“机器的代码”**。靠自觉是靠不住的，靠脚本拦截才是最高效的。
> 2.  **业界标准**：我们用的这套是 Google/Facebook 都在用的标准。虽然现在麻烦点，但能帮大家养成大厂级别的开发习惯。
> 3.  **共同进步**：这套规则对我也生效，我也经常被拦截。我们一起适应一下，阵痛期过了就是爽文模式（找 Bug 飞快）。
>     
> 
> 遇到报错看不懂的随时群里吼一声，我来解答。

**建议**： 发完这段话之后，如果你刚才修补那个 `.config` 文件的过程比较曲折，可以截个图发群里（比如那个 ` body must have leading blank line` 的报错），配文说：“看，我也被制裁了，这玩意儿真严。” **这招“苦肉计”百试百灵。**

### 主题 13. 再写一个通知，如果没配置这个的，尽快配置一下，不然不能正确显示贡献

这件事非常重要。这关乎到大家的**“绿格子”**（Contribution Graph）和代码归属权。如果不配置，GitHub 会把提交者显示成一个没有头像的“幽灵用户”，以后想证明“这代码是我写的”都很麻烦。

这里有两个版本的通知，你可以根据群里的氛围选一个：

### 版本一：利益相关风（推荐，直击痛点）

**核心逻辑**：强调“不配置 = 白干活”，大家为了自己的绿格子也会立马去改。

> ** 【紧急检查】别让你的代码白写了。**
> 
> 兄弟们，有个设置大家务必检查一下。
> 
> 我发现最近有些 commit 提交上来，在 GitHub 上显示的是“灰色幽灵头像”，点不进个人主页。这意味着 **GitHub 识别不到这是你提交的，你的 Contribution（绿格子）也不会被统计。** 
> 
> 以后面试或者做作品集，这都是你的工作证明。请大家花 10 秒钟校准一下本地配置：
> 
> **1\. 检查当前邮箱：**
> 
> ```
> git config user.email
> ```
> 
> _(看看出来的这个邮箱，是不是你在 GitHub `Settings -> Emails` 里验证过的那个)_
> 
> **2\. 如果不对，或者显示的是公司/学校乱七八糟的内网邮箱，请立刻执行：**
> 
> ```
> git config --global user.email "你的GitHub注册邮箱@example.com"
> ```
> 
> 改完之后，你的代码才能真正“归你所有”。

### 版本二：极简指令风（适合直接甩在置顶群公告）

> **️ Git 配置规范通知**
> 
> 为了保证代码提交记录能正确关联到大家各自的 GitHub 账号，请所有人检查本地的 Git 邮箱配置。
> 
> **检查方式**：终端输入 `git config user.email`
> 
> **修正方式**：
> 
> ```
> # 请替换为你的 GitHub 主邮箱
> git config --global user.email "your_email@example.com"
> ```

> 顺便检查一下用户名
> =========
> 
> git config --global user.name "你的GitHubID"
> 
> ```
> 
> **注意**：配置的邮箱必须是你 GitHub 账号里 Verified 过的邮箱，否则 GitHub 无法统计你的贡献值（Contribution Graph）。请尽快完成配置。
> ```

###  给你的额外小贴士

如果有队友问：“**那我之前提交的那些怎么办。还能救吗。**”

你可以回答：

> “之前的改起来很麻烦（要重写 Git 历史，会影响所有人），就算了。**从这一刻开始**，新的提交配置对就行，我们既往不咎，向前看。”

### 主题 14. 给我设置一下，infra团队的让infra管，前端管前端。doc由arc...

根据你提供的目录结构，我帮你把文件分门别类地对应到了三个团队（Infra、Frontend、Arch）。

你需要创建一个文件：**`.github/CODEOWNERS`**，并将以下内容复制进去。

_(请注意：你需要把 `@Infra-Team` 等占位符替换为你 GitHub Organization 里真实的 Team 名称)_

```
# .github/CODEOWNERS

# --------------------------------------------------------
# 默认规则：如果没有匹配到特定规则，默认由你负责
# --------------------------------------------------------
* @LosFurina

# --------------------------------------------------------
# 1. Infra 团队 (运维/基建/配置)
# --------------------------------------------------------
# 容器化与服务器配置
Dockerfile              @Infra-Team
nginx/                  @Infra-Team

# 工程化配置 (构建、测试、Lint、依赖)
# 既然是做基建，这些配置文件变动应该经过 Infra 同意
vite.config.ts          @Infra-Team
vitest.config.ts        @Infra-Team
commitlint.config.js    @Infra-Team
tsconfig.json           @Infra-Team
package.json            @Infra-Team
package-lock.json       @Infra-Team

# GitHub Actions (CI/CD 流程)
.github/                @Infra-Team

# --------------------------------------------------------
# 2. Frontend 团队 (业务代码)
# --------------------------------------------------------
# 核心源码目录
src/                    @Frontend-Devs

# 入口文件
index.html              @Frontend-Devs

# --------------------------------------------------------
# 3. Arch 团队 (文档/架构设计)
# --------------------------------------------------------
# 项目说明与文档
README.md               @Arch-Team
docs/                   @Arch-Team

# 元数据 (通常涉及项目定义，归架构管)
metadata.json           @Arch-Team
```

###  两个重要提示

1.  **路径匹配逻辑**：
    *   GitHub 的 `CODEOWNERS` 是**从下往上**匹配的（或者说是**最具体匹配优先**）。
    *   这意味着如果有人改了 `src/` 下的文件，GitHub 会精准找到 `@Frontend-Devs`，而不会因为最上面的 `*` 而去骚扰 `@LosFurina`。
    *   但是，如果有人同时改了 `src/App.tsx` (前端) 和 `Dockerfile` (运维)，那么**两个团队**都会被自动加为 Reviewer。
2.  **关于配置文件的归属**：
    *   我把 `package.json` 和 `vite.config.ts` 划给了 **Infra**。
    *   **理由**：通常前端开发不太需要改构建配置。如果前端随手改了依赖版本或者打包逻辑，很容易搞挂 CI/CD，所以让 Infra 团队把关是合理的。如果你觉得这样太严，可以把 `package.json` 划给 Frontend。

### 主题 15. 给我写一个message commit

这是一个完美符合你刚才设置的 `commitlint` 规则（Type, Scope, Issue ID, Body 长度, 空行）的提交信息。

请注意：你需要把 **`#88`** 替换成你真实的 Issue ID（如果没有就随便编一个数字，比如 `#1`，否则你的 linter 可能会拦你）。

### 方式一：命令行一把梭（最稳，自动处理空行）

直接复制这段代码到终端执行（**记得改 ID**）：

```
git add .github/CODEOWNERS

git commit -m "chore(github): setup CODEOWNERS for team automation (#88)" \
-m "Add code ownership rules to automatically assign reviewers based on expertise:
- Infra Team: Dockerfile, nginx, CI/CD, and config files.
- Frontend Team: src directory and index.html.
- Arch Team: Documentation and metadata.
- Default fallback: @LosFurina." \
-m "Closes #88"
```

### 方式二：如果你习惯用编辑器（VS Code / Vim）

运行 `git commit` 后，在编辑器里粘贴以下内容：

```
chore(github): setup CODEOWNERS for team automation (#88)

Add code ownership rules to automatically assign reviewers based on expertise:
- Infra Team: Dockerfile, nginx, CI/CD, and config files.
- Frontend Team: src directory and index.html.
- Arch Team: Documentation and metadata.
- Default fallback: @LosFurina.

Closes #88
```

### 为什么这样写能过。

1.  **Header**: `chore(github)` 是合法的 type 和 scope。
2.  **Issue ID**: Header 结尾带了 `(#88)`，满足 `header-match-issue-id` 规则。
3.  **Body**: 字数足够长，详细解释了每个 Team 负责什么，满足 `body-be-detailed`。
4.  **Format**: Header 和 Body 之间有空行（命令行模式下的第一个 `-m` 和第二个 `-m` 之间会自动加空行），满足 `body-leading-blank`。

### 主题 16. 但是git push能不能自动匹配当前分支名啊，不然很麻烦

太能了。这简直是每一个被 `fatal: The current branch has no upstream branch` 折磨过的程序员的救星。

你现在的痛点是：每次切个新分支 `git checkout -b feat/xxx`，第一次推的时候必须敲 `git push --set-upstream origin feat/xxx`，否则 Git 就不理你。

这里有一个**“一行代码解千愁”**的神器配置（Git 2.37+ 版本引入）：

###  终极解决方案

在终端执行这行命令（建议全局配置）：

```
git config --global push.autoSetupRemote true
```

### 效果对比

**配置前（痛苦面具）：**

```
$ git checkout -b feat/new-login
$ git push
fatal: The current branch feat/new-login has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin feat/new-login
```

**配置后（爽文模式）：**

```
$ git checkout -b feat/new-login
$ git push
# Git 自动帮你搞定 upstream，直接推送到 origin/feat/new-login
Total 0 (delta 0), reused 0 (delta 0)
To github.com:user/repo.git
 * [new branch]      feat/new-login -> feat/new-login
Branch 'feat/new-login' set up to track remote branch 'feat/new-login' from 'origin'.
```

### 备选方案（如果你还在用老版本 Git）

如果你的 Git 版本低于 2.37，上面的命令可能没用。你可以用这个“经典款”配置：

```
git config --global push.default current
```

*   **作用**：告诉 Git，如果我直接敲 `git push`，你就默认把当前本地分支推送到远程的**同名分支**上去。

**建议**： 既然你在搞工程化，**直接把第一条命令（`push.autoSetupRemote`）丢到群里**。这也是提升团队幸福感的小细节，没人喜欢每次都复制粘贴那行 `--set-upstream` 的废话。

### 排查场景 6. Select all

- 场景：Select all
- 处理要点：
这里有两个原因导致报错。最主要的原因是**语法格式不对**，其次是**权限配置**问题。

`CODEOWNERS` 文件对团队（Team）的引用格式非常严格，**必须加上组织名前缀**。

###  错误原因 1：缺少组织名

你不能直接写 `@Infra-Team`。GitHub 必须知道这个团队属于哪个组织。 你必须写成：**`@你的组织名/Infra-Team`**。

*   **哪里找组织名。** 看你浏览器地址栏：`github.com/组织名/仓库名`。那个“组织名”就是你要加的前缀。

###  错误原因 2：权限不足 (Write Access)

报错信息里明确写了：`make sure ... has write access to the repository`。 即便名字写对了，如果这个团队没有被添加到当前仓库，或者只有 "Read" 权限，GitHub 也会报错说找不到。

### ️ 修复步骤

#### 第一步：赋予团队权限

你必须显式地把这 3 个团队加入到这个仓库中。

1.  进入仓库的 **Settings**。
2.  点击左侧的 **Collaborators and teams**。
3.  点击绿色的 **Add teams** 按钮。
4.  把 `Infra-Team`、`Frontend-Devs`、`Arch-Team` 都加进去。
5.  **关键点**：把它们的权限从 Read 改为 **Write** (或 Maintain/Admin)。
    *   _注意：CODEOWNERS 机制强制要求审核者必须有写权限。_

#### 第二步：修正 CODEOWNERS 文件

假设你的 GitHub 组织名是 **`RevieU-Org`**（请替换为你真实的组织名），你的文件内容必须改成这样：

```
# .github/CODEOWNERS

# --------------------------------------------------------
# 默认规则
# --------------------------------------------------------
* @LosFurina

# --------------------------------------------------------
# 1. Infra 团队 (必须加组织前缀!)
# --------------------------------------------------------
Dockerfile              @RevieU-Org/Infra-Team
nginx/                  @RevieU-Org/Infra-Team
vite.config.ts          @RevieU-Org/Infra-Team
vitest.config.ts        @RevieU-Org/Infra-Team
commitlint.config.js    @RevieU-Org/Infra-Team
tsconfig.json           @RevieU-Org/Infra-Team
package.json            @RevieU-Org/Infra-Team
package-lock.json       @RevieU-Org/Infra-Team
.github/                @RevieU-Org/Infra-Team

# --------------------------------------------------------
# 2. Frontend 团队
# --------------------------------------------------------
src/                    @RevieU-Org/Frontend-Devs
index.html              @RevieU-Org/Frontend-Devs

# --------------------------------------------------------
# 3. Arch 团队
# --------------------------------------------------------
README.md               @RevieU-Org/Arch-Team
docs/                   @RevieU-Org/Arch-Team
metadata.json           @RevieU-Org/Arch-Team
```

**现在立刻去做两件事：**

1.  去 Settings 里把这三个组加进来并给 **Write** 权限。
2.  在文件里把 `@Infra-Team` 批量替换为 `@你的组织名/Infra-Team`。

### 排查场景 7. https://github.com/RevieU-Corp/revie...

- 场景：https://github.com/RevieU-Corp/revie...
- 处理要点：
收到。原来你的组织名是 **`RevieU-Corp`**。

难怪刚才会报错，GitHub 找不到 `Infra-Team` 是因为没加这个前缀。

###  最终修正版 CODEOWNERS

直接把下面这一整段复制进 `.github/CODEOWNERS` 文件里。我已经帮你把所有团队的前缀都修正为 `@RevieU-Corp/` 了。

```
# .github/CODEOWNERS

# --------------------------------------------------------
# 默认规则：没人管的文件归你
# --------------------------------------------------------
* @LosFurina

# --------------------------------------------------------
# 1. Infra 团队 (负责基建、配置、CI)
# --------------------------------------------------------
Dockerfile              @RevieU-Corp/Infra-Team
nginx/                  @RevieU-Corp/Infra-Team
vite.config.ts          @RevieU-Corp/Infra-Team
vitest.config.ts        @RevieU-Corp/Infra-Team
commitlint.config.js    @RevieU-Corp/Infra-Team
tsconfig.json           @RevieU-Corp/Infra-Team
package.json            @RevieU-Corp/Infra-Team
package-lock.json       @RevieU-Corp/Infra-Team
.github/                @RevieU-Corp/Infra-Team

# --------------------------------------------------------
# 2. Frontend 团队 (负责业务源码)
# --------------------------------------------------------
src/                    @RevieU-Corp/Frontend-Devs
index.html              @RevieU-Corp/Frontend-Devs

# --------------------------------------------------------
# 3. Arch 团队 (负责文档、元数据)
# --------------------------------------------------------
README.md               @RevieU-Corp/Arch-Team
docs/                   @RevieU-Corp/Arch-Team
metadata.json           @RevieU-Corp/Arch-Team
```

### ️ 最后一步检查 (必做。)

代码改对了只是第一步，**权限配置**必须跟上，否则还是会报 `Unknown owner`。

请确保你已经完成了以下操作：

1.  打开仓库主页 `https://github.com/RevieU-Corp/revieu-web`。
2.  点击 **Settings** -\> **Collaborators and teams**。
3.  确认列表里已经有 `Infra-Team`、`Frontend-Devs`、`Arch-Team` 这三个组。
4.  **最关键的**：看右边的权限（Role），必须是 **Write** 或者 **Admin**。（如果是 Read 是不生效的。）

如果这两步都确认没问题，提交上去之后，GitHub 就会出现绿色的盾牌标志，代表 Code Owners 生效了。

## 实施与验证清单

1. 执行前先确认环境、版本和依赖与文中前置条件一致。
2. 涉及系统级变更时，先备份关键配置或创建快照。
3. 完成操作后按验证步骤确认结果，再执行清理或覆盖动作。
