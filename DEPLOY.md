# SmileHK-GBA 部署指南

## 部署到 Vercel

1. 將項目推送到 GitHub: https://github.com/910HY/smilehkgba.git
2. 登錄 Vercel 並選擇導入該項目
3. 配置：
   - 建構命令：`sh vercel-build.sh`
   - 輸出目錄：`dist`

## API 端點

- `/api/clinics` - 所有診所資料
- `/api/hk-clinics` - 香港診所資料
- `/api/ngo-clinics` - NGO診所資料
- `/api/sz-clinics` - 深圳診所資料
