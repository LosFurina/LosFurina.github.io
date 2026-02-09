---
title: Self-host a Remote Git Repository
description: "Build a private Git remote on your own server for code, notes, and personal projects."
pubDate: 2026-01-23
---

## Introduction

As we all know, [Github](https://github.com) is the most famous code repository hosting and management platform, which based on [Git](https://git-scm.com/). In the most cases, you might be never consider about the difference from git and github, but we have to know, Git and Github is not the same thing. In this page, we will not introduce more details about git and github.

But sometimes, maybe you don't want to push your code to github because you wouldn't like publish your creativity or work. You absolutely can use the private repository in github, but there will be much limitation.

Besides, if you'd like manage your own blog, such as hexo, logseq or your own notes. If you choose to push and pull your repository to or from github, the bandwidth is a problem for you to consider. You might need a private server for yourself to manage your code, notes and documents.

So, in this page, I will record how to establish a private git remote server for yourself. To be honest, it is very easy.

## Install Git

### First and foremost, we need to install git.

Note: I recommend Linux or [WSL](https://learn.microsoft.com/en-us/windows/wsl/about) for this workflow because shell tooling and SSH behavior are more consistent.

## 2.2. Now we begin to install: (Please notice, tutorial operation will be all processed on Linux or WSL)

## Ubuntu/Debian

```bash
sudo apt update && sudo apt install git
```

## CentOS/RHEL

```bash
sudo yum install git
```

## Windows

Although I don't recommend, but it is necessary.

You can download  [Git](https://git-scm.com/)[2].

It's up to your arch when downloading x86_32 or x86_64.

Then just install it following the install program.

Note: if Git is unavailable in PowerShell, verify your `PATH` includes the Git install directory.

## 2.3. After we finished install, we can test it with:

```bash
git --version
```

If you get the result below, Git is installed correctly.

```bash
root@iZuf67g19l8trb51jx8bibZ:~# git --version
git version 2.34.1
```

## 3. Install and Config SSH Connection

Before we start login our remote serve, we need to know, except login with your ssh password that you have just set it above, you also can login through a Key Pair - [SSH key](https://www.ssh.com/academy/ssh-keys).

## 4. Create a Bare Repository in your Remote Server

Create a Bare Repository, which means, what you have created is a git repository but it doesn't contain any workplace.

```bash
mkdir -p ~/repos/my_example.git
cd ~/repos/my_examplr.git
git init --bare
```

mkdir -p 

Now, my_example.git is a remote repository.


## 5. Configure Local Repository

## 5.1. Add Remote Repository

```bash
cd /path/to/your/local/project
git remote add origin user@your-server-ip:~/repos/my_project
```


## 5.2. First Commit

```bash
git add -A
git commit -m "Initial commit"
```


## 5.3. Try to push

```bash
git remote
git branch -a
git branch -m main
git push aliyun main
```

Notice: I change default remote name from origin to aliyun.

Note: remote aliases are optional; use a readable name (for example, `origin` or `aliyun`) and keep it consistent.


Explain: change local branch to main

check your remote repository whether correct

Now, let's check remote repository:


## 6. Clone Remote Repository(Verify)

This section is very simple, just as follows:

```
git clone root@ali.liweijun.top:/root/repos/blog.logseq
```


## 7. Manage and Sync

Tips: Try not change non-text file since git is not suitable for management binary file.

```bash
git pull aliyun main
```

## 8. Add and Manage More Remote Repository Address

## Add first remote repository

```bash
git remote add origin https://github.com/your_username/repo.git
```

## Add another remote repository

```bash
git remote set-url --add --push origin https://gitlab.com/your_username/repo.git
```
