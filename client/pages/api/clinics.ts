import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 獲取項目根目錄
const rootDir = process.env.VERCEL ? process.cwd() : path.resolve(__dirname, '../../../');

// 工具函數：獲取文件路徑
function getFilePath(...pathSegments: string[]): string {
  return path.join(rootDir, ...pathSegments);
}

// 工具函數：讀取JSON文件
function readJsonFile(filePath: string) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

// 工具函數：處理 API 響應
function handleApiResponse(res: NextApiResponse, data: any) {
  res.status(200).json(data);
}

// 工具函數：處理 API 錯誤
function handleApiError(res: NextApiResponse, error: any, message: string) {
  console.error(`API Error - ${message}:`, error);
  res.status(500).json({ error: message, details: error.message });
}

/**
 * 獲取所有診所數據的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/clinics');
    
    // 讀取所有診所資料
    const hkFilePath = getFilePath('api', 'data', 'clinic_list_hkcss_cleaned.json');
    const ngoFilePath = getFilePath('api', 'data', 'ngo_clinics_cleaned.json');
    
    // 嘗試讀取增強版的深圳診所數據文件，如果不存在則使用原始文件
    let szFilePath = getFilePath('api', 'data', 'shenzhen_dental_clinics_enhanced.json');
    if (!fs.existsSync(szFilePath)) {
      console.log('找不到enhanced版深圳數據，嘗試updated版');
      szFilePath = getFilePath('api', 'data', 'shenzhen_dental_clinics_updated.json');
    }
    if (!fs.existsSync(szFilePath)) {
      console.log('找不到enhanced和updated版深圳數據，使用原始數據');
      szFilePath = getFilePath('api', 'data', 'shenzhen_dental_clinics_20250407.json');
    }
    
    console.log('使用深圳診所數據文件:', szFilePath);
    
    const hkData = readJsonFile(hkFilePath);
    const ngoData = readJsonFile(ngoFilePath);
    const szRawData = readJsonFile(szFilePath);
    
    // 處理深圳診所數據，添加缺失的字段
    const szData = szRawData.map((clinic: any) => {
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
    
    handleApiResponse(res, allClinics);
  } catch (error) {
    handleApiError(res, error, 'Failed to fetch clinic data');
  }
}