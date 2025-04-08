#!/bin/bash

# 啟動Vite開發服務器（在背景運行）
echo "🚀 啟動前端開發服務器..."
cd client && npx vite --host 0.0.0.0 --port 3000 &
VITE_PID=$!

# 返回項目根目錄
cd ..

# 啟動API服務器
echo "🚀 啟動API服務器..."
node server.js

# 當程序終止時，關閉Vite服務器
trap "kill $VITE_PID" EXIT
