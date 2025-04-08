# SmileHK-GBA 部署指南

## 部署到 Vercel

1. 將項目推送到 GitHub: https://github.com/910HY/smilehkgba.git
2. 登錄 Vercel 並選擇導入該項目
3. Vercel 將自動識別配置文件 (`vercel.json`) 並使用正確的設置進行部署
4. 不需要手動配置構建命令和輸出目錄，Vercel會自動使用配置中的設置

## 文件說明

- `vercel.json` - Vercel 部署配置
- `build.sh` - 用於 Vercel 的構建腳本
- `vercel-build.sh` - 處理 API 數據文件的輔助腳本

## API 端點

- `/api/clinics` - 所有診所資料
- `/api/hk-clinics` - 香港診所資料
- `/api/ngo-clinics` - NGO診所資料
- `/api/sz-clinics` - 深圳診所資料

## 常見問題

如果構建失敗，請檢查：
1. 確保 `build.sh` 和 `vercel-build.sh` 具有執行權限 (`chmod +x *.sh`)
2. 確保數據文件存在於 `attached_assets` 目錄中
3. 檢查 Vercel 的構建日誌中是否有 API 數據文件複製的相關錯誤
