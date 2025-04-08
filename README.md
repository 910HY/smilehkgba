# SmileHK - 香港及大灣區牙醫資訊平台

## 專案簡介
SmileHK 是一個集中展示香港及大灣區牙醫診所資訊的網站平台。用戶可以根據地區、子區域和診所類型進行搜索，快速找到合適的牙醫診所。

## 主要功能
- 按地區、子區域及診所類型搜尋牙醫診所
- 以卡片形式展示診所詳細資料，包括名稱、地址、電話及營業時間
- 內嵌地圖功能，直接在平台內查看診所位置
- 高德地圖集成（大灣區診所）及 Google 地圖集成（香港診所）
- 診所資料錯誤報告功能
- 響應式設計，支援移動設備及桌面版本

## 技術棧
- 前端：React + TypeScript + Vite
- UI 框架：Tailwind CSS + Shadcn/UI
- 地圖整合：Leaflet.js（內嵌地圖）、高德地圖 API（大灣區定位）
- 表單處理：Formspree
- 部署：Vercel Serverless Functions

## 區域覆蓋
- 香港（港島區、九龍區、新界區）
- 大灣區（深圳等）

## 部署說明

### Vercel部署
1. Fork或Clone本儲存庫到您的GitHub賬戶
2. 在Vercel上創建新項目，並連結到GitHub儲存庫
3. 配置構建設定：
   - 構建命令：`node build-vercel.js`
   - 輸出目錄：`client/dist`
4. 部署！

### 環境變數（可選）
- `VITE_API_URL`: API的基礎URL，用於生產環境（默認為空）
- `AMAP_API_KEY`: 高德地圖API金鑰（用於增強地圖功能）
- `AMAP_SECURITY_CODE`: 高德地圖安全碼（如有需要）

### 本地開發
1. 克隆儲存庫：`git clone <儲存庫URL>`
2. 安裝依賴：`npm install`
3. 啟動開發服務器：`npm run dev`
4. 瀏覽器訪問：`http://localhost:5000`

## 專案結構
```
/
├── api/                # Vercel Serverless API函數
│   ├── clinics.ts      # 所有診所API端點
│   ├── hk-clinics.ts   # 香港診所API端點
│   ├── sz-clinics.ts   # 深圳診所API端點
│   ├── ngo-clinics.ts  # NGO診所API端點
│   └── data/           # 診所數據JSON文件
├── client/             # 前端代碼
│   ├── src/            # 源代碼
│   │   ├── components/ # UI組件
│   │   ├── lib/        # 工具函數
│   │   ├── pages/      # 頁面
│   │   └── types/      # TypeScript類型
│   └── ...
└── ...
```

## 聯絡方式
若有任何問題或建議，請聯絡：smilehkgba@gmail.com
