import path from 'path';
import fs from 'fs';

// 使用接口而不是導入，避免路徑問題
interface Clinic {
  name: string;
  address: string;
  region: string;
  count: string | number;
  type: string;
  phone: string | number;
  hours: string;
  photo: string;
  city: string;
  country: string;
  isGreaterBayArea: boolean;
  sourceLink?: string;
  
  // 新增欄位
  region_en?: string;  // 地區英文名（例：南山區 → Nanshan）
  region_code?: string; // URL 友善格式（例：nanshan）
  slug?: string;       // 診所唯一網址識別碼
  url?: string;        // 該診所的獨立網址
  
  location?: {
    lat: number;
    lng: number;
  };
  prices?: {
    洗牙?: string;
    補牙?: string;
    拔牙?: string;
    植牙?: string;
    矯正?: string;
  };
}

export default function handler(req: any, res: any) {
  // 只允許GET請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // 嘗試多個可能的路徑以適應不同環境
    let hkFilePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
    let ngoFilePath = path.join(process.cwd(), 'api', 'data', 'ngo_clinics_cleaned.json');
    let szFilePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_enhanced.json');
    
    // 如果主要路徑不存在，嘗試備用路徑
    if (!fs.existsSync(hkFilePath)) {
      hkFilePath = path.join(process.cwd(), 'attached_assets', 'clinic_list_hkcss_cleaned.json');
    }
    if (!fs.existsSync(ngoFilePath)) {
      ngoFilePath = path.join(process.cwd(), 'attached_assets', 'ngo_clinics_cleaned.json');
    }
    
    // 嘗試多個可能的路徑以適應不同環境
    if (!fs.existsSync(szFilePath)) {
      console.log('找不到enhanced版深圳數據，嘗試updated版');
      szFilePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_updated.json');
    }
    if (!fs.existsSync(szFilePath)) {
      console.log('找不到enhanced和updated版深圳數據，嘗試原始數據');
      szFilePath = path.join(process.cwd(), 'attached_assets', 'shenzhen_dental_clinics_20250407.json');
    }
    
    console.log('正在讀取診所數據文件:', { hkFilePath, ngoFilePath, szFilePath });
    
    const hkData = JSON.parse(fs.readFileSync(hkFilePath, 'utf8'));
    const ngoData = JSON.parse(fs.readFileSync(ngoFilePath, 'utf8'));
    
    // 獲取深圳診所數據，如果文件存在
    let szData: Clinic[] = [];
    try {
      if (fs.existsSync(szFilePath)) {
        const szRawData = JSON.parse(fs.readFileSync(szFilePath, 'utf8'));
        
        // 處理深圳診所數據，添加缺失的字段
        szData = szRawData.map((clinic: Clinic) => {
          if (!clinic.region_en) {
            // 根據region添加region_en和region_code
            let region_en = '';
            let region_code = '';
            switch (clinic.region) {
              case '福田區':
                region_en = 'Futian';
                region_code = 'futian';
                break;
              case '羅湖區':
                region_en = 'Luohu';
                region_code = 'luohu';
                break;
              case '南山區':
                region_en = 'Nanshan';
                region_code = 'nanshan';
                break;
              case '寶安區':
                region_en = 'Baoan';
                region_code = 'baoan';
                break;
              case '龍華區':
                region_en = 'Longhua';
                region_code = 'longhua';
                break;
              case '龍崗區':
                region_en = 'Longgang';
                region_code = 'longgang';
                break;
              case '光明區':
                region_en = 'Guangming';
                region_code = 'guangming';
                break;
              case '坪山區':
                region_en = 'Pingshan';
                region_code = 'pingshan';
                break;
              case '鹽田區':
                region_en = 'Yantian';
                region_code = 'yantian';
                break;
              case '大鵬新區':
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
            
            return {
              ...clinic,
              region_en,
              region_code,
              slug,
              url
            };
          }
          return clinic;
        });
      }
    } catch (szError) {
      console.error('無法讀取深圳診所數據:', szError);
    }
    
    // 處理香港診所數據，添加缺失的字段
    const processedHkData = hkData.map((clinic: Clinic) => {
      if (!clinic.region_en) {
        let region_en = '';
        let region_code = '';
        
        // 港島區
        if (['中西區', '灣仔區', '東區', '南區'].includes(clinic.region)) {
          if (clinic.region === '中西區') {
            region_en = 'Central & Western';
            region_code = 'central-western';
          } else if (clinic.region === '灣仔區') {
            region_en = 'Wan Chai';
            region_code = 'wan-chai';
          } else if (clinic.region === '東區') {
            region_en = 'Eastern';
            region_code = 'eastern';
          } else if (clinic.region === '南區') {
            region_en = 'Southern';
            region_code = 'southern';
          }
        } 
        // 九龍區
        else if (['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'].includes(clinic.region)) {
          if (clinic.region === '油尖旺區') {
            region_en = 'Yau Tsim Mong';
            region_code = 'yau-tsim-mong';
          } else if (clinic.region === '深水埗區') {
            region_en = 'Sham Shui Po';
            region_code = 'sham-shui-po';
          } else if (clinic.region === '九龍城區') {
            region_en = 'Kowloon City';
            region_code = 'kowloon-city';
          } else if (clinic.region === '黃大仙區') {
            region_en = 'Wong Tai Sin';
            region_code = 'wong-tai-sin';
          } else if (clinic.region === '觀塘區') {
            region_en = 'Kwun Tong';
            region_code = 'kwun-tong';
          }
        } 
        // 新界區
        else {
          if (clinic.region.includes('西貢')) {
            region_en = 'Sai Kung';
            region_code = 'sai-kung';
          } else if (clinic.region.includes('沙田')) {
            region_en = 'Sha Tin';
            region_code = 'sha-tin';
          } else if (clinic.region.includes('大埔')) {
            region_en = 'Tai Po';
            region_code = 'tai-po';
          } else if (clinic.region.includes('北區')) {
            region_en = 'North';
            region_code = 'north';
          } else if (clinic.region.includes('元朗')) {
            region_en = 'Yuen Long';
            region_code = 'yuen-long';
          } else if (clinic.region.includes('屯門')) {
            region_en = 'Tuen Mun';
            region_code = 'tuen-mun';
          } else if (clinic.region.includes('荃灣')) {
            region_en = 'Tsuen Wan';
            region_code = 'tsuen-wan';
          } else if (clinic.region.includes('葵青')) {
            region_en = 'Kwai Tsing';
            region_code = 'kwai-tsing';
          } else if (clinic.region.includes('離島')) {
            region_en = 'Islands';
            region_code = 'islands';
          } else {
            region_en = 'Hong Kong';
            region_code = 'hong-kong';
          }
        }
        
        // 創建唯一的slug
        const nameSlug = clinic.name
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
          .replace(/\s+/g, '-');
        const slug = `${region_code}-${nameSlug}`;
        
        // 創建URL
        const url = `/clinic/${slug}`;
        
        return {
          ...clinic,
          region_en,
          region_code,
          slug,
          url
        };
      }
      return clinic;
    });
    
    // 處理NGO診所數據
    const processedNgoData = ngoData.map((clinic: Clinic) => {
      if (!clinic.region_en) {
        // 由於NGO診所數據較少，可以為所有NGO診所設置一個通用的region_en
        const region_en = 'NGO';
        const region_code = 'ngo';
        
        // 創建唯一的slug
        const nameSlug = clinic.name
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
          .replace(/\s+/g, '-');
        const slug = `${region_code}-${nameSlug}`;
        
        // 創建URL
        const url = `/clinic/${slug}`;
        
        return {
          ...clinic,
          region_en,
          region_code,
          slug,
          url
        };
      }
      return clinic;
    });
    
    // 合併所有診所資料
    const allClinics: Clinic[] = [...processedHkData, ...processedNgoData, ...szData];
    
    console.log(`返回 ${allClinics.length} 筆診所資料`);
    res.status(200).json(allClinics);
  } catch (error) {
    console.error('Error fetching all clinics:', error);
    res.status(500).json({ error: 'Failed to fetch clinic data' });
  }
}