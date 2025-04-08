// 整合 Vite 和 Express 的開發服務器
import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5000;

async function startServer() {
  // 創建 Express 應用程序
  const app = express();

  console.log('📦 啟動整合式開發服務器...');

  // API 路由處理
  // 所有診所資料
  app.get('/api/clinics', (req, res) => {
    try {
      console.log('API 請求: /api/clinics');
      // 讀取所有診所資料
      const hkFilePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
      const ngoFilePath = path.join(process.cwd(), 'api', 'data', 'ngo_clinics_cleaned.json');
      const szFilePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_20250407.json');
      
      const hkData = JSON.parse(fs.readFileSync(hkFilePath, 'utf8'));
      const ngoData = JSON.parse(fs.readFileSync(ngoFilePath, 'utf8'));
      const szData = JSON.parse(fs.readFileSync(szFilePath, 'utf8'));
      
      // 合併所有診所資料
      const allClinics = [...hkData, ...ngoData, ...szData];
      console.log(`返回 ${allClinics.length} 筆診所資料`);
      
      res.status(200).json(allClinics);
    } catch (error) {
      console.error('Error fetching all clinics:', error);
      res.status(500).json({ error: 'Failed to fetch clinic data' });
    }
  });

  // 香港診所資料
  app.get('/api/hk-clinics', (req, res) => {
    try {
      console.log('API 請求: /api/hk-clinics');
      const filePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`返回 ${data.length} 筆香港診所資料`);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching HK clinics:', error);
      res.status(500).json({ error: 'Failed to fetch HK clinic data' });
    }
  });

  // NGO診所資料
  app.get('/api/ngo-clinics', (req, res) => {
    try {
      console.log('API 請求: /api/ngo-clinics');
      const filePath = path.join(process.cwd(), 'api', 'data', 'ngo_clinics_cleaned.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`返回 ${data.length} 筆NGO診所資料`);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching NGO clinics:', error);
      res.status(500).json({ error: 'Failed to fetch NGO clinic data' });
    }
  });

  // 深圳診所資料
  app.get('/api/sz-clinics', (req, res) => {
    try {
      console.log('API 請求: /api/sz-clinics');
      const filePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_20250407.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`返回 ${data.length} 筆深圳診所資料`);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching SZ clinics:', error);
      res.status(500).json({ error: 'Failed to fetch SZ clinic data' });
    }
  });

  // 創建 Vite 開發服務器
  const vite = await createServer({
    root: path.resolve(__dirname, 'client'),
    server: {
      middlewareMode: true,
      hmr: { clientPort: 443 },
      watch: {
        usePolling: true,
        interval: 100
      },
      allowedHosts: 'all',  // 允許所有主機
      host: '0.0.0.0',      // 綁定到所有網絡接口
    },
    base: './',
    appType: 'spa',
    clearScreen: false,
    plugins: [
      react(),
      runtimeErrorOverlay(),
      themePlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
  });

  // 使用 Vite 的中間件處理前端請求
  app.use(vite.middlewares);

  // 處理 SPA 路由 - 所有非 API 路由返回 index.html
  app.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    
    try {
      // 讓 Vite 處理請求
      next();
    } catch (error) {
      console.error("Vite 處理請求時出錯:", error);
      res.status(500).send("內部服務器錯誤");
    }
  });

  // 啟動 Express 服務器
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`整合式開發服務器運行於 http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('啟動服務器時出錯:', err);
  process.exit(1);
});