#!/bin/bash
# TY Music 推送到 GitHub
# 使用方法：在终端中执行 bash push-to-github.sh

echo "=== 1. 添加所有文件 ==="
git add .

echo "=== 2. 提交 ==="
git commit -m "TY Music - 免费在线音乐播放器 v1.0"

echo "=== 3. 设置远程仓库 ==="
git remote remove origin 2>/dev/null
git remote add origin https://1981016893fty-pixel:GITHUB_TOKEN_ENV@github.com/1981016893fty-pixel/ty-music.git

echo "=== 4. 推送到 GitHub ==="
git push -u origin main

echo "=== 完成！==="
echo "仓库地址: https://github.com/1981016893fty-pixel/ty-music"
