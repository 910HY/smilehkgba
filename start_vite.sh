#!/bin/bash

# 啟動前端和API服務器
echo "啟動前端開發服務器和API服務器..."

# 啟動API服務器（在背景運行）
node --experimental-modules server.js &
API_PID=$!

# 啟動前端
cd client
npx vite --config vite.config.ts

# 當Vite終止時，也終止API服務器
kill $API_PID
