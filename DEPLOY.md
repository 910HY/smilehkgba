# SmileHK-GBA 部署指南 (更新版本)

## 部署到 Vercel

### 簡化流程 (建議方式)
1. 將項目推送到 GitHub: https://github.com/910HY/smilehkgba.git
2. 登錄 Vercel 儀表板: https://vercel.com/dashboard
3. 點擊 "New Project" 或 "Import Project"
4. 選擇從 GitHub 導入，找到並選擇 `smilehkgba` 存儲庫
5. 配置項目設置:
   - 構建命令: `bash vercel-build.sh`
   - 輸出目錄: `dist`
6. 點擊 "Deploy" 按鈕

### 設置詳情 (重要變更)
- **構建命令**: `bash vercel-build.sh`
- **輸出目錄**: `dist` (不是 client/dist，而是根目錄下的 dist)
- **Node.js 版本**: 建議使用 18.x 或以上版本

## 更新後的文件說明

- `vercel.json` - 簡化的 Vercel 部署配置
- `vercel-build.sh` - 僅處理 API 數據文件，不涉及前端構建

## 簡化的構建過程

1. 構建時，`vercel-build.sh` 腳本:
   - 創建 `dist/api` 和 `dist/api/data` 目錄
   - 複製 API 文件和數據文件到這些目錄
   - 不進行前端構建

2. 前端部分需要單獨設置:
   - 在 Vercel 配置的 "Build Command" 中添加前端構建命令
   - 例如: `bash vercel-build.sh && cd client && npm install && npm run build && cp -r dist/* ../dist/`

## API 端點

- `/api/clinics` - 所有診所資料
- `/api/hk-clinics` - 香港診所資料
- `/api/ngo-clinics` - NGO診所資料
- `/api/sz-clinics` - 深圳診所資料

## 常見問題排查

### "No Output Directory named 'dist' found" 錯誤
- 確保 vercel.json 中的 `outputDirectory` 設置為 `dist`
- 確保構建命令正確創建了 `dist` 目錄
- 在構建命令中添加 `find dist -type f` 以列出構建結果，幫助診斷

### API 請求返回 404
- 確認 API 文件已正確部署到 `dist/api` 目錄
- 確認數據文件已正確複製到 `dist/api/data` 目錄
- 檢查 Vercel 部署日誌，確認構建過程完整執行

### 其他排查步驟
1. 啟用 Vercel 的詳細構建日誌
2. 在構建腳本中添加更多 echo 命令來輸出診斷信息
3. 檢查 GitHub 存儲庫中的文件是否完整且正確