// 使用 Vite 開發環境並模擬 Vercel API Routes
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';

// 獲得當前文件的目錄路徑
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

async function startDevServer() {
  console.log('📦 啟動本地開發環境服務器...');
  
  // 嘗試清理可能正在運行的進程
  try {
    execSync('pkill -f vite || true', { stdio: 'inherit' });
    console.log('已停止之前可能運行的Vite服務器');
  } catch (cleanupError) {
    // 忽略清理錯誤
  }

  // 創建 Express 應用程序
  const app = express();

  // 確保 content 目錄存在
  const contentDir = path.join(__dirname, 'content');
  const articlesDir = path.join(contentDir, 'articles');
  const promotionsDir = path.join(contentDir, 'promotions');

  // 建立內容目錄結構
  [contentDir, articlesDir, promotionsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`已創建 ${dir} 目錄`);
    }
  });

  // 處理API路由
  app.use('/api', async (req, res, next) => {
    const { method, path: urlPath, query, body } = req;
    
    console.log(`API 請求: ${method} ${urlPath}`);
    
    // 獲取API處理器路徑
    let handlerPath = path.join(__dirname, 'api', urlPath.replace(/^\//, ''));
    
    // 處理動態路由
    if (!fs.existsSync(`${handlerPath}.ts`) && !fs.existsSync(`${handlerPath}.js`)) {
      const segments = urlPath.split('/');
      if (segments.length > 2) {
        const dirPath = path.join(__dirname, 'api', segments[1]);
        const files = fs.readdirSync(dirPath);
        
        // 尋找形如 [param].ts 的文件
        const dynamicFile = files.find(file => file.startsWith('[') && file.endsWith('].ts'));
        
        if (dynamicFile) {
          handlerPath = path.join(dirPath, dynamicFile.replace(/\.ts$/, ''));
        }
      }
    }

    try {
      // 載入API處理器
      if (fs.existsSync(`${handlerPath}.ts`) || fs.existsSync(`${handlerPath}.js`)) {
        // 執行命令以轉換TS文件
        const tsxCommand = `npx tsx ${handlerPath}.ts`;
        const result = execSync(tsxCommand, {
          env: {
            ...process.env,
            REQ_METHOD: method,
            REQ_PATH: urlPath,
            REQ_QUERY: JSON.stringify(query),
            REQ_BODY: JSON.stringify(body || {})
          }
        });
        
        const handler = result.toString();
        res.send(handler);
      } else {
        console.error(`找不到API處理器: ${handlerPath}`);
        res.status(404).json({ error: 'API路由不存在' });
      }
    } catch (error) {
      console.error(`處理API請求時出錯:`, error);
      res.status(500).json({ error: '處理API請求時出錯', details: error.message });
    }
  });

  // 啟動 Vite 開發服務器
  try {
    const viteProcess = execSync('cd client && npx vite dev --port 3000', {
      stdio: 'inherit',
      detached: true
    });
    
    console.log('✅ Vite開發服務器啟動成功');
  } catch (error) {
    console.error('❌ Vite開發服務器啟動失敗:', error);
    process.exit(1);
  }

  // 處理 SPA 路由 - 代理到 Vite 開發服務器
  app.use('*', (req, res) => {
    res.redirect(`http://localhost:3000${req.originalUrl}`);
  });

  // 啟動 Express 服務器
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API服務器運行於 http://localhost:${PORT}`);
    console.log(`Vite前端服務器運行於 http://localhost:3000`);
  });
}

startDevServer().catch((err) => {
  console.error('啟動開發服務器時出錯:', err);
  process.exit(1);
});