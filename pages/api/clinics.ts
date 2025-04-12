import { rootDir, handleApiResponse, handleApiError, readJsonFile } from './_utils';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

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
  district?: string;   // 額外的地區信息字段
  opening_hours?: string; // 營業時間的替代字段
  
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/clinics');
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // 讀取所有診所資料
    const hkFilePath = path.join(rootDir, 'attached_assets', 'clinic_list_hkcss_cleaned.json');
    const ngoFilePath = path.join(rootDir, 'attached_assets', 'ngo_clinics_cleaned.json');
    
    // 嘗試讀取深圳診所數據文件
    const szFilePath = path.join(rootDir, 'attached_assets', 'shenzhen_dental_clinics_working.json');
    
    console.log('使用深圳診所數據文件:', szFilePath);
    console.log('檢查文件是否存在:', require('fs').existsSync(szFilePath));
    
    const hkData = readJsonFile(hkFilePath);
    const ngoData = readJsonFile(ngoFilePath);
    const szRawData = readJsonFile(szFilePath);
    
    // 處理深圳診所數據，添加缺失的字段
    const szData = szRawData.map((clinic: any) => {
      // 添加評分和連鎖診所標籤數據（如果沒有）
      if (!clinic.rating) {
        // 根據内容設置合理默認值
        const clinicName = clinic.name || '';
        
        // 為連鎖診所設置評分和連鎖標籤
        if (
          clinicName.includes('益康') || 
          clinicName.includes('維港') || 
          clinicName.includes('仁樺') || 
          clinicName.includes('拜博') || 
          clinicName.includes('愛康健') || 
          clinicName.includes('麥芽')
        ) {
          clinic.rating = 4.5; // 為連鎖品牌設置默認評分
          clinic.is_chain = true; // 標記為連鎖診所
          clinic.isChain = true; // 兼容舊屬性
        } else if (clinicName.includes('自有光')) {
          clinic.rating = 4.7; // 根據文章中提到的評分
          clinic.is_chain = true;
          clinic.isChain = true; // 兼容舊屬性
        } else {
          // 為其他診所設置評分
          clinic.rating = 4.0; // 默認評分
          clinic.is_chain = false;
          clinic.isChain = false; // 兼容舊屬性
        }
      }
      
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
        
        // 設置評分和連鎖診所標籤（如果還沒有設置）
        let rating = clinic.rating;
        let is_chain = clinic.is_chain || clinic.isChain;
        
        // 根據診所名稱設置合理值
        const clinicName = clinic.name || '';
        if (!rating || !is_chain) {
          if (
            clinicName.includes('益康') || 
            clinicName.includes('維港') || 
            clinicName.includes('仁樺') || 
            clinicName.includes('拜博') || 
            clinicName.includes('愛康健') || 
            clinicName.includes('麥芽')
          ) {
            rating = rating || 4.5; // 為連鎖品牌設置評分
            is_chain = true; // 標記為連鎖診所
          } else if (clinicName.includes('自有光')) {
            rating = rating || 4.7; // 根據文章中提到的評分
            is_chain = true;
          } else if (clinicName.includes('鵬程')) {
            rating = rating || 4.5; // 根據文章中提到的評分
            is_chain = true;
          } else {
            // 其他診所默認評分
            rating = rating || 4.0;
            is_chain = is_chain || false;
          }
        }
        
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
          photo: clinic.photo || '無照片',
          rating: rating,
          is_chain: is_chain,
          isChain: is_chain // 兼容舊的屬性名
        };
      }
      
      // 確保即使有 region_en 的診所也有評分和連鎖標籤
      if (!clinic.rating || (!clinic.is_chain && !clinic.isChain)) {
        const clinicName = clinic.name || '';
        let rating = clinic.rating;
        let is_chain = clinic.is_chain || clinic.isChain;
        
        if (
          clinicName.includes('益康') || 
          clinicName.includes('維港') || 
          clinicName.includes('仁樺') || 
          clinicName.includes('拜博') || 
          clinicName.includes('愛康健') || 
          clinicName.includes('麥芽')
        ) {
          rating = rating || 4.5;
          is_chain = true;
        } else if (clinicName.includes('自有光')) {
          rating = rating || 4.7;
          is_chain = true;
        } else if (clinicName.includes('鵬程')) {
          rating = rating || 4.5;
          is_chain = true;
        } else {
          rating = rating || 4.0;
          is_chain = is_chain || false;
        }
        
        return {
          ...clinic,
          rating: rating,
          is_chain: is_chain,
          isChain: is_chain // 兼容舊的屬性名
        };
      }
      
      return clinic;
    });
    
    // 合併所有診所資料
    const allClinics = [...hkData, ...ngoData, ...szData];
    console.log(`返回 ${allClinics.length} 筆診所資料`);
    
    return handleApiResponse(res, allClinics);
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch clinic data');
  }
}