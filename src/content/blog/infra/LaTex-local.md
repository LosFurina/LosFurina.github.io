---
title: Compile LaTeX code at local environment
description: "Auto-generated description for Compile LaTeX code at local environment"
pubDate: 2026-01-23
---

# Introduction

When you are writing your paper or documents on LaTeX, you have to face an inevitable issue, that is compiling you LaTeX code to pdf. As for beginners of researchers, they may choose to use [Overleaf](https://www.overleaf.com/), it is very simple to use, but when your documents or paper are becoming more and more bigger, overleaf will charge to you. So why don't I compile it by myself?

In this section, I will record how to compile LaTeX code in local.

# 1. Prepare your LaTeX code.

## 1.1. Edit with your VScode(Strongly recommend by me)

Download and install extensions of LaTeX in VScode plugin store.

You can find it at [here]([https://github.com/James-Yu/LaTeX-Workshop](https://github.com/James-Yu/LaTeX-Workshop)

Edit your LaTeX code.

## 1.2 Download whole folder(project) from overleaf.

# 2. Prepare Compile Environment.

Before we start this section, we have to know, in order to compile LaTeX, we have to use `tex` compile tools, and there are some different distributions of tex[1]:

MiKTeX for Windows

TeX Live for Linux and other UNIX-like systems

MacTeX redistribution of TeX Live for macOS

teTeX for Linux and other UNIX-like systems; it is no longer actively maintained now

proTeXt is based on MiKTeX

In this section, I will introduce how to use `TeX live`, it can solve majority case.

## 2.1. Docker(Strongly recommend)

Why I recommend you use docker is out of some reasons:

Simple install

Simple remove

Simple use

To speak of, `texlive` is very storage-consuming, it is about 5.14 GB.

### 2.2.1. Download and install docker

If you have some problems about network, you need to set proxy for docker:

How to set network proxy for Docker

### 2.2.2. Pull TeX Live

If you are in China mainland, you should first master how to use TUN/proxy pattern to login your docker account. Besides, you also can use [Podman](https://podman.io/). I also recommend you to study how to use podman and what difference are there between these to container tools[2].

Just use:  
```bash
docker pull texlive/texlive
```

### 2.2.3. Compile your LaTeX code.

We have no need to start a container, just run it, after compiling, container will be deleted automatically.

pdflatex: First compile your code with pdflatex. 
```bash
docker run --rm -v ${PWD}:/workdir texlive/texlive pdflatex main.tex
```

bibtex: to tackle cites: 
```bash
docker run --rm -v ${PWD}:/workdir texlive/texlive bibtex main
```

pdflatex: again to merge cites:
```bash
docker run --rm -v ${PWD}:/workdir texlive/texlive pdflatex main.tex
```

### 2.2.4. Example Usage

You should place `.tex`, `.cls` if exists, and `.bib` if exists at the same directory. Just as follows.

Conduct command above:

Result:
There will be a `main.pdf` for you:

[^1]: https://www.overleaf.com/learn/latex/Choosing_a_LaTeX_Compiler

[^2]: https://betterstack.com/community/guides/scaling-docker/podman-vs-docker/#podman-vs-docker-comparison
