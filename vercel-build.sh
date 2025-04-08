#!/bin/bash
set -ex

# 顯示診斷信息
echo "===== 開始 Vercel 構建流程 ====="
echo "Node 版本: $(node --version)"
echo "NPM 版本: $(npm --version)"
echo "當前工作目錄: $(pwd)"
echo "目錄中的文件:"
ls -la

# 創建輸出目錄
echo "===== 創建 dist 目錄 ====="
mkdir -p dist
mkdir -p dist/api
mkdir -p dist/api/data

# 顯示 attached_assets 中的文件
echo "===== attached_assets 目錄中的文件 ====="
ls -la attached_assets/

# 複製數據文件
echo "===== 複製數據文件 ====="
cp attached_assets/clinic_list_hkcss_cleaned.json dist/api/data/
cp attached_assets/ngo_clinics_cleaned.json dist/api/data/
cp attached_assets/shenzhen_dental_clinics_20250407.json dist/api/data/

# 複製 API 文件
echo "===== 複製 API 文件 ====="
cp api/*.ts dist/api/

# 檢查最終目錄結構
echo "===== 最終目錄結構 ====="
find dist -type f

echo "===== 構建完成 ====="
