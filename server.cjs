// 本地開發服務器 (CommonJS 版本)
const express = require("express");
const fs = require("fs");
const path = require("path");
const { createServer } = require("http");

// 設置路徑
const hkClinicsPath = path.join(__dirname, "attached_assets/clinic_list_hkcss_cleaned.json");
const ngoClinicsPath = path.join(__dirname, "attached_assets/ngo_clinics_cleaned.json");
const szClinicsPath = path.join(__dirname, "attached_assets/shenzhen_dental_clinics_20250407.json");

// API處理函數
function getHKClinics(_req, res) {
  try {
    const data = fs.readFileSync(hkClinicsPath, "utf8");
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error("Error reading HK clinics file:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

function getNGOClinics(_req, res) {
  try {
    const data = fs.readFileSync(ngoClinicsPath, "utf8");
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error("Error reading NGO clinics file:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

function getSZClinics(_req, res) {
  try {
    const data = fs.readFileSync(szClinicsPath, "utf8");
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error("Error reading SZ clinics file:", error);
    res.status(500).json({ error: "Failed to read clinic data" });
  }
}

function getAllClinics(_req, res) {
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
app.use((req, res, next) => {
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
app.use(express.static(path.join(__dirname, 'client/dist')));

// 所有其他請求轉發到前端
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// 錯誤處理
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// 啟動服務器
const PORT = process.env.PORT || 5000;
const server = createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`本地開發服務器運行於: http://localhost:${PORT}`);
});