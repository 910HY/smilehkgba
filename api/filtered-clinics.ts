import { rootDir, handleApiResponse, handleApiError, readJsonFile } from './_utils';
import path from 'path';

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

export default function handler(req: any, res: any) {
  try {
    console.log('API 請求: /api/filtered-clinics');
    
    // 讀取優質深圳診所資料
    const filteredClinicsPath = path.join(rootDir, 'attached_assets', 'shenzhen_clinics_filtered.json');
    console.log('使用優質深圳診所數據文件:', filteredClinicsPath);
    
    const filteredClinicsRaw = readJsonFile(filteredClinicsPath);
    
    // 處理診所數據，添加標準化欄位
    const processedClinics = filteredClinicsRaw.map((clinic: FilteredClinic) => {
      // 根據region添加region_en和region_code
      let region = clinic.region || '';
      let region_en = '';
      let region_code = '';
      
      // 處理區域對應
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
      
      // 使用服務列表和價格信息生成 hours 字段內容
      const servicesStr = clinic.services.join('、');
      const hours = `提供服務: ${servicesStr} | ${clinic.priceInfo}`;
      
      // 標準化類型
      const type = clinic.is_chain ? '連鎖品牌診所' : '私家診所';
      
      // 創建電話號碼（如果不存在）
      const phone = '請致電查詢';
      
      // 處理價格信息
      const priceMatches = clinic.priceInfo.match(/¥(\d+)/);
      const basePrice = priceMatches ? priceMatches[1] : null;
      
      // 根據服務類型構建價格對象
      const prices: Record<string, string> = {};
      
      clinic.services.forEach(service => {
        if (service === '洗牙' && clinic.priceInfo.includes('洗牙')) {
          const washMatch = clinic.priceInfo.match(/洗牙\s*¥(\d+)/);
          prices['洗牙'] = washMatch ? `¥${washMatch[1]}` : `¥${basePrice || '?'}`;
        } else if (service === '矯正' && clinic.priceInfo.includes('矯正')) {
          const orthoMatch = clinic.priceInfo.match(/矯正\s*¥(\d+)/);
          prices['矯正'] = orthoMatch ? `¥${orthoMatch[1]}` : '請致電查詢';
        } else if (service === '美白' && clinic.priceInfo.includes('美白')) {
          const whiteningMatch = clinic.priceInfo.match(/美白\s*¥(\d+)/);
          prices['美白'] = whiteningMatch ? `¥${whiteningMatch[1]}` : '請致電查詢';
        } else if (service === '補牙' && clinic.priceInfo.includes('補牙')) {
          const fillingMatch = clinic.priceInfo.match(/補牙\s*¥(\d+)/);
          prices['補牙'] = fillingMatch ? `¥${fillingMatch[1]}` : '請致電查詢';
        } else if (service === '種牙' && clinic.priceInfo.includes('種牙')) {
          const implantMatch = clinic.priceInfo.match(/種牙\s*¥(\d+)/);
          prices['植牙'] = implantMatch ? `¥${implantMatch[1]}` : '請致電查詢';
        }
      });
      
      return {
        ...clinic,
        region_en,
        region_code,
        slug,
        url,
        hours,
        type,
        phone,
        prices,
        city: '深圳',
        country: '中國',
        isGreaterBayArea: true,
        photo: '無照片', // 默認值
        count: clinic.rating // 使用評分作為count值
      };
    });
    
    console.log(`返回 ${processedClinics.length} 筆優質深圳診所資料`);
    return handleApiResponse(res, processedClinics);
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch filtered clinic data');
  }
}