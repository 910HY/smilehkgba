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
mkdir -p dist/assets

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

# 複製靜態資源
echo "===== 複製靜態資源 ====="
cp attached_assets/LOGO_UPDATED.png dist/assets/
cp attached_assets/favicon.ico dist/
cp attached_assets/og-image.png dist/assets/

# 確保前端構建可以訪問資源
echo "===== 為前端準備資源 ====="
mkdir -p client/public/assets
cp attached_assets/LOGO_UPDATED.png client/public/assets/
cp attached_assets/LOGO_UPDATED.png client/public/
cp attached_assets/LOGO_UPDATED.png client/src/assets/

# 確保客戶端構建資源是正確的
echo "===== 修改客戶端 vite.config.ts ====="
sed -i 's/@assets": path.resolve(__dirname, "..\/attached_assets"),/@assets": path.resolve(__dirname, "..\/client\/public\/assets"),/g' client/vite.config.ts

# 檢查最終目錄結構
echo "===== 最終目錄結構 ====="
find dist -type f
find client/public -type f 

echo "===== 構建完成 ====="
