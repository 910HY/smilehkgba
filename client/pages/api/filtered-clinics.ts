import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 獲取項目根目錄
const rootDir = process.env.VERCEL ? process.cwd() : path.resolve(__dirname, '../../../');

// 工具函數：獲取文件路徑
function getFilePath(...pathSegments: string[]): string {
  return path.join(rootDir, ...pathSegments);
}

// 工具函數：處理 API 錯誤
function handleApiError(res: NextApiResponse, error: any, message: string) {
  console.error(`API Error - ${message}:`, error);
  res.status(500).json({ error: message, details: error.message });
}

interface FilteredClinic {
  name: string;
  region: string;
  address: string;
  rating: number;
  is_chain: boolean;
  services: string[];
  priceInfo: string;
  sourceLink: string;
  
  // 以下欄位將在處理過程中添加
  region_en?: string;
  region_code?: string;
  slug?: string;
  url?: string;
  city?: string;
  country?: string;
  isGreaterBayArea?: boolean;
}

/**
 * 獲取優質診所數據的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/filtered-clinics');
    const filePath = getFilePath('attached_assets', 'shenzhen_dental_clinics_filtered.json');
    
    if (!fs.existsSync(filePath)) {
      console.log('找不到優質診所數據文件，嘗試備用檔案');
      // 嘗試使用備用文件
      const backupFilePath = getFilePath('attached_assets', '2025-shenzhen-dental-value.json');
      if (!fs.existsSync(backupFilePath)) {
        return res.status(404).json({ error: '找不到優質診所數據文件' });
      }
      console.log('使用備用數據文件:', backupFilePath);
      const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
      return res.status(200).json(backupData);
    }
    
    const filteredClinicsRaw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`讀取到 ${filteredClinicsRaw.length} 條優質診所記錄`);
    
    // 處理診所數據，添加必要欄位
    const processedClinics = filteredClinicsRaw.map((clinic: FilteredClinic) => {
      // 根據region添加region_en和region_code
      let region = clinic.region || '';
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
        default:
          region_en = 'Shenzhen';
          region_code = 'shenzhen';
      }
      
      // 創建唯一的slug（如果沒有）
      if (!clinic.slug) {
        const nameSlug = clinic.name
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
          .replace(/\s+/g, '-');
        clinic.slug = `${region_code}-${nameSlug}`;
      }
      
      // 創建URL（如果沒有）
      if (!clinic.url) {
        clinic.url = `/clinic/${clinic.slug}`;
      }
      
      // 設置城市和國家（如果沒有）
      if (!clinic.city) {
        clinic.city = '深圳';
      }
      
      if (!clinic.country) {
        clinic.country = '中國';
      }
      
      // 確保isGreaterBayArea標記存在
      if (clinic.isGreaterBayArea === undefined) {
        clinic.isGreaterBayArea = true;
      }
      
      // 確保region_en和region_code存在
      clinic.region_en = region_en || clinic.region_en;
      clinic.region_code = region_code || clinic.region_code;
      
      return clinic;
    });
    
    console.log(`返回 ${processedClinics.length} 筆優質診所資料`);
    res.status(200).json(processedClinics);
  } catch (error) {
    handleApiError(res, error, '無法獲取優質診所數據');
  }
}