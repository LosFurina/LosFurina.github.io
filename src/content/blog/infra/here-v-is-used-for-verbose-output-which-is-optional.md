---
title: "Here, `v` Is Used For Verbose Output Which Is Optional."
description: "tar 常用参数与归档压缩命令速查，覆盖打包、解包与查看内容。"
pubDate: "2025-05-25"
updatedDate: "2026-02-09"
draft: true
category: "infra"
tags: ["infra"]
sourcePath: "ComputerScience/LinuxCommand/tar.md"
sourceVault: "obsidian/note"
slug: "infra/here-v-is-used-for-verbose-output-which-is-optional"
---
### Summary of Common `tar` Commands

The `tar` command is a powerful utility used for archiving and compressing files and directories in Unix-like operating systems. The most commonly used options are:

- `c`: Create a new archive.
- `x`: Extract files from an archive.
- `t`: List the contents of an archive.
- `v`: Verbosely show the file's details (verbose mode).
- `f`: Use the following archive file (followed by the filename).
- `z`: Filter the archive through `gzip` (typically used with `.tar.gz` or `.tgz` files).
- `j`: Filter the archive through `bzip2` (typically used with `.tar.bz2` files).
- `J`: Filter the archive through `xz` (typically used with `.tar.xz` files).
- `r`: Append files to the end of an archive.
- `u`: Update files in the archive (add files if they are newer than the existing archive files).
- `d`: Compare contents of the archive against files on the filesystem.
- `--delete`: Delete files from an archive.

#### Common Commands with Examples

##### Creating a Tar Archive

To create a new tar archive named `archive.tar` containing files `file1` and `file2` and a directory `directory1`:

```sh
tar -cf archive.tar file1 file2 directory1
```

##### Creating a Tar Archive with Gzip Compression

To create a new compressed tar archive named `archive.tar.gz` with gzip compression:

```sh
tar -czvf archive.tar.gz file1 file2 directory1
# Here, `v` is used for verbose output which is optional.
```

##### Creating a Tar Archive with Bzip2 Compression

To create a new compressed tar archive named `archive.tar.bz2` with bzip2 compression:

```sh
tar -cjvf archive.tar.bz2 file1 file2 directory1
# Again, `v` is used for verbose output.
```

##### Creating a Tar Archive with XZ Compression

To create a new compressed tar archive named `archive.tar.xz` with xz compression:

```sh
tar -cJvf archive.tar.xz file1 file2 directory1
# `v` is used for verbose output.
```

##### Extracting Files from a Tar Archive

To extract the contents of `archive.tar` into the current directory:

```sh
tar -xf archive.tar
```

##### Extracting Files from a Gzip Compressed Tar Archive

To extract the contents of `archive.tar.gz` into the current directory:

```sh
tar -xzvf archive.tar.gz
# `v` is used for verbose output.
```

##### Extracting Files from a Bzip2 Compressed Tar Archive

To extract the contents of `archive.tar.bz2` into the current directory:

```sh
tar -xjvf archive.tar.bz2
# `v` is used for verbose output.
```

##### Extracting Files from an XZ Compressed Tar Archive

To extract the contents of `archive.tar.xz` into the current directory:

```sh
tar -xJvf archive.tar.xz
# `v` is used for verbose output.
```

##### Listing the Contents of a Tar Archive

To list the contents of `archive.tar`:

```sh
tar -tf archive.tar
```

##### Verbosely Listing the Contents of a Tar Archive

To display a detailed list of the contents of `archive.tar`:

```sh
tar -tvf archive.tar
```

##### Appending Files to an Existing Tar Archive

To append `new_file` to an existing tar archive named `archive.tar`:

```sh
tar -rf archive.tar new_file
```

##### Updating Existing Files in a Tar Archive

To update `archive.tar` by adding `updated_file` if it is newer than the one already in the archive:

```sh
tar -uf archive.tar updated_file
```

##### Deleting a File from a Tar Archive

To remove `file_to_remove` from the tar archive named `archive.tar`:

```sh
tar --delete -f archive.tar file_to_remove
```

##### Extracting a Tar Archive to a Specific Directory

To extract the contents of `archive.tar` to a specified directory such as `/path/to/directory`:

```sh
tar -xvf archive.tar -C /path/to/directory
# `v` is used for verbose output.
```

This summary covers the most common operations used with the `tar` command. The `tar` command has many options and additional functionality for more specific needs, such as handling sparse files, using custom compression programs, and controlling file attributes and permissions.
