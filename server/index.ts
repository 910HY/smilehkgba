// Express 服務器（適用於 Replit 工作流）
import express from "express";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 設置路徑
const hkClinicsPath = path.join(__dirname, "../attached_assets/clinic_list_hkcss_cleaned.json");
const ngoClinicsPath = path.join(__dirname, "../attached_assets/ngo_clinics_cleaned.json");
const szClinicsPath = path.join(__dirname, "../attached_assets/shenzhen_dental_clinics_20250407.json");

// API處理函數
function getHKClinics(_req: express.Request, res: express.Response) {
  try {
    const data = fs.readFileSync(hkClinicsPath, "utf8");
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error("Error reading HK clinics file:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

function getNGOClinics(_req: express.Request, res: express.Response) {
  try {
    const data = fs.readFileSync(ngoClinicsPath, "utf8");
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error("Error reading NGO clinics file:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

function getSZClinics(_req: express.Request, res: express.Response) {
  try {
    const data = fs.readFileSync(szClinicsPath, "utf8");
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error("Error reading SZ clinics file:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

function getAllClinics(_req: express.Request, res: express.Response) {
  try {
    const hkData = fs.readFileSync(hkClinicsPath, "utf8");
    const ngoData = fs.readFileSync(ngoClinicsPath, "utf8");
    const szData = fs.readFileSync(szClinicsPath, "utf8");
    
    const hkClinics = JSON.parse(hkData);
    const ngoClinics = JSON.parse(ngoData);
    const szClinics = JSON.parse(szData);
    
    const allClinics = [...hkClinics, ...ngoClinics, ...szClinics];
    res.json(allClinics);
  } catch (error) {
    console.error("Error reading clinic data files:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

// 設置Express服務器
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS設置
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 日誌中間件
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith('/api')) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      console.log(logLine);
    }
  });
  
  next();
});

// 註冊API路由
app.get("/api/hk-clinics", getHKClinics);
app.get("/api/ngo-clinics", getNGOClinics);
app.get("/api/sz-clinics", getSZClinics);
app.get("/api/clinics", getAllClinics);

// 靜態文件服務
app.use(express.static(path.join(__dirname, '../client/dist')));

// 所有其他請求轉發到前端
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 錯誤處理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// 啟動服務器
const PORT = parseInt(process.env.PORT || '5000');
const server = createServer(app);
console.log(`嘗試在端口 ${PORT} 上啟動服務器...`);
server.listen(PORT, () => {
  console.log(`服務器運行於: http://localhost:${PORT}`);
  console.log('API 端點:');
  console.log(`- http://localhost:${PORT}/api/clinics`);
  console.log(`- http://localhost:${PORT}/api/hk-clinics`);
  console.log(`- http://localhost:${PORT}/api/ngo-clinics`);
  console.log(`- http://localhost:${PORT}/api/sz-clinics`);
});