# 牙GoGo 開發文檔

## 本地開發環境說明

在 Replit 環境中，我們創建了臨時解決方案來解決模塊加載問題。這些修改**僅限於本地開發環境**，不會影響 Vercel 部署。

### 臨時文件

1. `/client/src/index.js` - 簡易加載腳本，用於繞過模塊加載問題
   - 此文件在生產環境中不需要
   - Vercel 部署時不應包含此文件

### 修改的文件

1. `/client/index.html` - 臨時更改了腳本引用方式
   - 臨時改為: `<script src="/src/index.js"></script>`
   - 生產環境應為: `<script type="module" src="/src/main.tsx"></script>`

2. `/static-server.js` - 臨時調整靜態文件服務配置
   - 增加了對 JavaScript 文件的 Content-Type 處理
   - 擴展了靜態文件搜索範圍

## Vercel 部署說明

Vercel 部署使用標準的 Vite 構建過程，完全不受我們的臨時修改影響。在 Vercel 中：

1. 設置 Root Directory 為 `client/`
2. 構建命令自動使用 `vite build`
3. 輸出目錄為 `dist/`

## 重要提示

**推送到版本控制或部署前的檢查清單:**

- [ ] 刪除 `/client/src/index.js` 文件
- [ ] 恢復 `/client/index.html` 中的原始腳本引用
- [ ] 驗證所有靜態資源都放在 `client/public/` 目錄下

## API Routes

API 路由位於 `/api/*.ts` 中，這些文件在 Vercel 部署時會自動轉換為無伺服器函數。