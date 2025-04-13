#!/bin/bash
# 這個腳本替代了 Vercel 的默認構建命令
# 在 Vercel 後台設置構建命令為: bash vercel-build.sh

echo "開始 Next.js 構建流程"
npm run build
echo "Next.js 構建完成"