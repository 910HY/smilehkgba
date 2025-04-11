# 牙GoGo - 牙科資訊平台

## 關於項目
牙GoGo 是一個為香港及大灣區用戶提供牙科診所資訊的全面平台。專注於提供「至關心你啲牙既牙科資訊平台」的服務理念，無多餘功能，專注於搜尋體驗。

網站採用React開發，具有簡潔直觀的用戶界面。主要功能是搜索牙醫診所，並以卡片形式展示結果。診所資訊包括地址、電話、營業時間等，同時支援內嵌地圖查看功能，提供便捷的位置查詢體驗。

## 主要功能
- 按區域和細分地區搜尋診所
- 按診所類型（私家/NGO社企）篩選
- 關鍵字搜尋（名稱/地址/電話）
- 內嵌地圖查看（使用Leaflet.js）
- 支援大灣區（深圳）10個行政區的診所資訊
- 多語言支援（繁體中文/簡體中文）

## 技術架構
- 前端：React + TypeScript + Vite
- UI框架：TailwindCSS + Shadcn UI
- 地圖功能：Leaflet.js
- 數據管理：TanStack Query
- 狀態管理：React Hooks
- 後端：Vercel Serverless Functions
- 部署：Vercel

## 開發指南
1. 安裝依賴：
```
npm install
```

2. 啟動開發伺服器：
```
npm run dev
```

3. 構建項目：
```
npm run build
```

## 數據來源
- 香港診所資料來自公開資料集
- 深圳診所資料經過人工處理和驗證
- NGO社企診所資料經獨立調查收集

## 作者
- GitHub: [910HY](https://github.com/910HY)
- 儲存庫名: [smilehkgba](https://github.com/910HY/smilehkgba)

## 許可證
MIT License