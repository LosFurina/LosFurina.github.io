---
title: Git Merge Workflow Best Practices
description: "A practical workflow for safer merges with review gates instead of pushing directly to main."
pubDate: 2026-01-23
---

# Introduction

## **Why We Should Not Push Directly to the `main` Branch?**

Pushing code directly to the `main` branch is **not recommended** due to the following reasons:

---

### ⚠️ **Risk of Bugs and Instability**
- The `main` branch is typically the stable branch, often used for **production** or shared across the team.
- Directly pushing **untested code** increases the risk of breaking the codebase.

### 🔎 **No Code Review**
- Direct pushes **bypass** the code review process, which is crucial for:
  - Catching errors
  - Improving code quality
  - Ensuring adherence to standards

### 🔀 **Merge Conflicts**
- When multiple developers push to the `main` branch, it increases the chance of **merge conflicts**.

### 🚫 **Lack of Testing**
- Direct pushes **skip automated tests** (if configured for pull requests).

### 🛠️ **Difficulty in Debugging**
- Without isolated feature branches, **tracking the source of issues** becomes more challenging.

### 📚 **No Documentation of Changes**
- **Pull Requests (PRs)** provide a space to **document and discuss** changes.

### 💥 **Risk of Breaking Deployments**
- If `main` is tied to **CI/CD pipelines**, direct pushes can introduce **unstable code** into production.

### 👥 **No Accountability**
- The **PR review process** ensures peer-reviewed changes, increasing **confidence** in the codebase.

---

# ✅ **Recommended Git Merge Workflow**

---

## 📦 **Step 1: Create a Development Branch**

- Use a **feature branch** to isolate your changes:
```bash
git checkout -b feature/branch-name
```
- **Naming convention:** Use meaningful names like:
  - `feature/add-login`
  - `bugfix/fix-typo`

---

## 🛠️ **Step 2: Work on the Feature**

- Make changes and commit frequently with **clear messages**:
```bash
git add .
git commit -m "Add login functionality"
```

---

## 📤 **Step 3: Push the Branch to Remote**

- Push the branch to **remote** for collaboration:
```bash
git push origin feature/branch-name
```

---

## 🔗 **Step 4: Open a Pull Request (PR)**

- Create a **PR** from the feature branch to the `main` branch in your Git hosting service.
- Add a **detailed description** of the changes, reasons, and context.
- Ensure **automated tests** pass before requesting a review.

---

## 🧐 **Step 5: Wait for Code Review**

- Team members will **review** your PR and suggest changes.
- Make requested changes and commit them:
```bash
git add .
git commit -m "Address PR comments"
git push origin feature/branch-name
```

---

## ✅ **Step 6: Merge the Pull Request**

- After approval and passing all tests, merge the PR into `main`.
- **Optional:** Use a **squash merge** or **rebase** for a cleaner commit history.

---

## 📥 **Step 7: Pull the Updated `main` Branch Locally**

- Update your local `main` branch:
```bash
git checkout main
git pull origin main
```

---

## 🗑️ **Step 8: Delete the Development Branch**

- Remove the branch from the remote repository:
```bash
git push origin --delete feature/branch-name
```
- Delete the branch locally:
```bash
git branch -d feature/branch-name
```

---

## 🧹 **Step 9: Prune Deleted Branches**

- Clean up references to deleted branches:
```bash
git fetch -p
```

---

# 🎯 **Conclusion**

By following this structured **Git merge workflow**, you:

- **Enhance code quality**
- **Promote collaboration**
- **Prevent breaking changes**
- **Maintain a clean commit history**

---

# 📖 **Reference:**

- [Git Merge Best Practices (YouTube)](https://www.youtube.com/watch?v=uj8hjLyEBmU&t=3s)
