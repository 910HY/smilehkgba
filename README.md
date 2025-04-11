# 牙GoGo 牙科資訊平台

牙GoGo是一個創新的、以用戶為中心的牙科資訊平台，服務香港和大灣區，旨在通過科技讓牙科健康資訊更加無障礙和具吸引力。

## 開發注意事項

### Vercel 部署

本項目使用 Vercel 進行部署，部署網址為：`yagogo.vercel.app`。

**重要提示：**
- 在將更改推送到 GitHub 或 Vercel 時，請確保移除以下臨時開發文件：
  - `/client/src/index.js` (本地開發環境臨時文件)
  
- 確保 `client/index.html` 中使用原始的入口點：
  ```html
  <script type="module" src="/src/main.tsx"></script>
  ```

- Vercel 部署時，應使用 client/ 作為 Root Directory
- 所有靜態文件應放在 client/public/ 目錄下

### 本地開發

啟動本地開發服務器：
```bash
npm run dev
```

如果出現模塊加載問題，可以嘗試：
```bash
cd client && npm run dev
```

## 功能特點

- 牙科診所搜尋功能
- 香港和大灣區地區覆蓋
- 互動式地圖整合
- 牙科健康文章
- 優惠信息

## 技術棧

- React with Vite 前端
- TypeScript 類型安全開發
- TailwindCSS + Shadcn UI 響應式設計
- Leaflet.js 互動式地圖
- Vercel 無伺服器部署