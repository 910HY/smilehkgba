#!/bin/bash

echo "===== 開始 Vercel 構建流程 ====="
echo "Node 版本: $(node --version)"
echo "NPM 版本: $(npm --version)"
echo "當前工作目錄: $(pwd)"
echo "目錄中的文件:"
ls -la

# 創建必要的目錄
echo "===== 創建 dist 目錄 ====="
mkdir -p dist
mkdir -p dist/api
mkdir -p dist/api/data
mkdir -p dist/assets
mkdir -p dist/client/public/assets

# 複製 API 處理程序
echo "===== 複製 API 處理程序 ====="
cp -r api/*.ts dist/api/
ls -la dist/api/

# 複製 API 數據文件
echo "===== 複製 API 數據文件 ====="
cp -r api/data/*.json dist/api/data/
ls -la dist/api/data/

# 複製靜態資源 - 多個可能位置
echo "===== 複製靜態資源 ====="
cp -r attached_assets/LOGO_UPDATED.png dist/assets/ || true
cp -r attached_assets/LOGO_UPDATED.png dist/ || true
cp -r public/assets/* dist/assets/ || true
cp -r public/* dist/ || true
cp -r client/public/assets/* dist/assets/ || true
cp -r client/public/* dist/ || true
cp -r client/dist/* dist/ || true
cp -r attached_assets/LOGO_UPDATED.png dist/client/public/assets/ || true
cp -r attached_assets/LOGO_UPDATED.png dist/client/public/ || true

echo "===== dist 目錄結構 ====="
find dist -type f | sort

echo "===== 完成 Vercel 構建流程 ====="
