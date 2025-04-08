#!/bin/bash

# 首先運行vercel-build.sh來準備API數據文件
bash vercel-build.sh

# 然後直接使用vite進行構建
npx vite build
