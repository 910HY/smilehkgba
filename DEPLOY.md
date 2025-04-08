# SmileHK-GBA 部署指南

## 部署到 Vercel

### 簡化流程 (建議方式)
1. 將項目推送到 GitHub: https://github.com/910HY/smilehkgba.git
2. 登錄 Vercel 儀表板: https://vercel.com/dashboard
3. 點擊 "New Project" 或 "Import Project"
4. 選擇從 GitHub 導入，找到並選擇 `smilehkgba` 存儲庫
5. 配置項目設置:
   - 構建命令: 使用 vercel.json 中指定的命令
   - 輸出目錄: `dist`
6. 點擊 "Deploy" 按鈕
