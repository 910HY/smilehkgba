// 靜態文件服務器 - 簡單版，無需Vite
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000; // 使用環境變數或預設為 5000

async function startStaticServer() {
  // 創建 Express 應用程序
  const app = express();

  console.log('📦 啟動靜態文件服務器...');

  // 靜態文件服務
  app.use(express.static(path.join(__dirname, 'client/dist')));

  // API 路由處理
  // 所有診所資料
  app.get('/api/clinics', (req, res) => {
    try {
      console.log('API 請求: /api/clinics');
      // 讀取所有診所資料
      const hkFilePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
      const ngoFilePath = path.join(process.cwd(), 'api', 'data', 'ngo_clinics_cleaned.json');
      
      // 嘗試讀取增強版的深圳診所數據文件，如果不存在則使用原始文件
      let szFilePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_enhanced.json');
      if (!fs.existsSync(szFilePath)) {
        console.log('找不到enhanced版深圳數據，嘗試updated版');
        szFilePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_updated.json');
      }
      if (!fs.existsSync(szFilePath)) {
        console.log('找不到enhanced和updated版深圳數據，使用原始數據');
        szFilePath = path.join(process.cwd(), 'attached_assets', 'shenzhen_dental_clinics_20250407.json');
      }
      
      console.log('使用深圳診所數據文件:', szFilePath);
      
      const hkData = JSON.parse(fs.readFileSync(hkFilePath, 'utf8'));
      const ngoData = JSON.parse(fs.readFileSync(ngoFilePath, 'utf8'));
      const szRawData = JSON.parse(fs.readFileSync(szFilePath, 'utf8'));
      
      // 處理深圳診所數據，添加缺失的字段
      const szData = szRawData.map((clinic) => {
        if (!clinic.region_en) {
          // 根據region添加region_en和region_code
          let region = clinic.region || clinic.district || '';
          let region_en = '';
          let region_code = '';
          
          // 處理簡繁體差異
          switch (region) {
            case '福田區':
            case '福田区':
              region_en = 'Futian';
              region_code = 'futian';
              break;
            case '羅湖區':
            case '罗湖区':
              region_en = 'Luohu';
              region_code = 'luohu';
              break;
            case '南山區':
            case '南山区':
              region_en = 'Nanshan';
              region_code = 'nanshan';
              break;
            case '寶安區':
            case '宝安区':
              region_en = 'Baoan';
              region_code = 'baoan';
              break;
            case '龍華區':
            case '龙华区':
              region_en = 'Longhua';
              region_code = 'longhua';
              break;
            case '龍崗區':
            case '龙岗区':
              region_en = 'Longgang';
              region_code = 'longgang';
              break;
            case '光明區':
            case '光明区':
              region_en = 'Guangming';
              region_code = 'guangming';
              break;
            case '坪山區':
            case '坪山区':
              region_en = 'Pingshan';
              region_code = 'pingshan';
              break;
            case '鹽田區':
            case '盐田区':
              region_en = 'Yantian';
              region_code = 'yantian';
              break;
            case '大鵬新區':
            case '大鹏新区':
              region_en = 'Dapeng';
              region_code = 'dapeng';
              break;
            default:
              region_en = 'Shenzhen';
              region_code = 'shenzhen';
          }
          
          // 創建唯一的slug
          const nameSlug = clinic.name
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
            .replace(/\s+/g, '-');
          const slug = `${region_code}-${nameSlug}`;
          
          // 創建URL
          const url = `/clinic/${slug}`;
          
          // 標準化類型和時間
          const hours = clinic.hours || clinic.opening_hours || '';
          const type = clinic.type === '私營' ? '私家診所' : (clinic.type || '私家診所');
          
          return {
            ...clinic,
            region: region,
            region_en,
            region_code,
            slug,
            url,
            hours,
            type,
            city: clinic.city || '深圳',
            country: clinic.country || '中國',
            isGreaterBayArea: true,
            photo: clinic.photo || '無照片'
          };
        }
        return clinic;
      });
      
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
      
      // 嘗試讀取增強版的深圳診所數據文件，如果不存在則使用原始文件
      let filePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_enhanced.json');
      if (!fs.existsSync(filePath)) {
        console.log('找不到enhanced版深圳數據，嘗試updated版');
        filePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_updated.json');
      }
      if (!fs.existsSync(filePath)) {
        console.log('找不到enhanced和updated版深圳數據，使用原始數據');
        filePath = path.join(process.cwd(), 'attached_assets', 'shenzhen_dental_clinics_20250407.json');
      }
      
      console.log('使用深圳診所數據文件:', filePath);
      
      const szRawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // 處理深圳診所數據，添加缺失的字段
      const data = szRawData.map((clinic) => {
        if (!clinic.region_en) {
          // 根據region添加region_en和region_code
          let region = clinic.region || clinic.district || '';
          let region_en = '';
          let region_code = '';
          
          // 處理簡繁體差異
          switch (region) {
            case '福田區':
            case '福田区':
              region_en = 'Futian';
              region_code = 'futian';
              break;
            case '羅湖區':
            case '罗湖区':
              region_en = 'Luohu';
              region_code = 'luohu';
              break;
            case '南山區':
            case '南山区':
              region_en = 'Nanshan';
              region_code = 'nanshan';
              break;
            case '寶安區':
            case '宝安区':
              region_en = 'Baoan';
              region_code = 'baoan';
              break;
            case '龍華區':
            case '龙华区':
              region_en = 'Longhua';
              region_code = 'longhua';
              break;
            case '龍崗區':
            case '龙岗区':
              region_en = 'Longgang';
              region_code = 'longgang';
              break;
            case '光明區':
            case '光明区':
              region_en = 'Guangming';
              region_code = 'guangming';
              break;
            case '坪山區':
            case '坪山区':
              region_en = 'Pingshan';
              region_code = 'pingshan';
              break;
            case '鹽田區':
            case '盐田区':
              region_en = 'Yantian';
              region_code = 'yantian';
              break;
            case '大鵬新區':
            case '大鹏新区':
              region_en = 'Dapeng';
              region_code = 'dapeng';
              break;
            default:
              region_en = 'Shenzhen';
              region_code = 'shenzhen';
          }
          
          // 創建唯一的slug
          const nameSlug = clinic.name
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
            .replace(/\s+/g, '-');
          const slug = `${region_code}-${nameSlug}`;
          
          // 創建URL
          const url = `/clinic/${slug}`;
          
          // 標準化類型和時間
          const hours = clinic.hours || clinic.opening_hours || '';
          const type = clinic.type === '私營' ? '私家診所' : (clinic.type || '私家診所');
          
          return {
            ...clinic,
            region: region,
            region_en,
            region_code,
            slug,
            url,
            hours,
            type,
            city: clinic.city || '深圳',
            country: clinic.country || '中國',
            isGreaterBayArea: true,
            photo: clinic.photo || '無照片'
          };
        }
        return clinic;
      });
      
      console.log(`返回 ${data.length} 筆深圳診所資料`);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching SZ clinics:', error);
      res.status(500).json({ error: 'Failed to fetch SZ clinic data' });
    }
  });

  // 處理 SPA 路由 - 所有非 API 路由返回 index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return;
    }
    
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });

  // 啟動 Express 服務器
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`靜態服務器運行於 http://localhost:${PORT}`);
  });
}

startStaticServer().catch((err) => {
  console.error('啟動服務器時出錯:', err);
  process.exit(1);
});