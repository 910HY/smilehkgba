import { Clinic } from "../types/clinic";

// 為診所數據增加缺失的字段
function enhanceClinicData(clinic: Clinic): Clinic {
  // 如果已經有這些字段，不需要處理
  if (clinic.region_en && clinic.region_code && clinic.slug && clinic.url) {
    return clinic;
  }
  
  let region_en = '';
  let region_code = '';
  
  // 深圳區域映射
  if (clinic.city === '深圳' || clinic.city === '深圳市') {
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
      case '南山区':
        region_en = 'Nanshan';
        region_code = 'nanshan';
        break;
      case '寶安區':
        region_en = 'Baoan';
        region_code = 'baoan';
        break;
      case '龍華區':
      case '龙华区':
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
  }
  // 港島區
  else if (['中西區', '灣仔區', '東區', '南區'].includes(clinic.region)) {
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
  else if (clinic.city === '香港') {
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
  // NGO診所
  else if (clinic.type === 'NGO社企') {
    region_en = 'NGO';
    region_code = 'ngo';
  }
  // 其他未知
  else {
    region_en = clinic.region_en || 'Other';
    region_code = clinic.region_code || 'other';
  }
  
  // 創建唯一的slug
  const nameSlug = clinic.name
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
    .replace(/\s+/g, '-');
  const slug = clinic.slug || `${region_code}-${nameSlug}`;
  
  // 創建URL
  const url = clinic.url || `/clinic/${slug}`;
  
  return {
    ...clinic,
    region_en: clinic.region_en || region_en,
    region_code: clinic.region_code || region_code,
    slug: clinic.slug || slug,
    url: clinic.url || url
  };
}

// 從API獲取所有診所資料
export async function fetchClinicData(): Promise<Clinic[]> {
  try {
    // 根據環境確定BASE URL
    const baseUrl = import.meta.env.DEV 
      ? '' 
      : (import.meta.env.VITE_API_URL || '');
    
    // 添加時間戳和隨機數，強制瀏覽器不使用緩存
    const cacheBreaker = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // 直接從合併的API端點獲取資料
    const response = await fetch(`${baseUrl}/api/clinics?${cacheBreaker}`, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      // 強制重新獲取，即使已經有緩存的內容
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`API 回應錯誤: ${response.status}`);
    }
    
    const clinics = await response.json();
    console.log("成功從API加載診所數據:", clinics.length);
    
    // 處理每個診所數據，確保有必要的字段
    const enhancedClinics = clinics.map(enhanceClinicData);
    
    // 檢查是否有深圳診所數據
    const szClinics = enhancedClinics.filter((c: Clinic) => 
      c.isGreaterBayArea || c.city === '深圳' || c.city === '深圳市'
    );
    console.log("其中深圳診所數量:", szClinics.length);
    
    // 如果沒有深圳診所或數量太少，直接從sz-clinics端點獲取
    if (szClinics.length < 20) {
      console.log("深圳診所數量不足，嘗試直接獲取深圳診所數據...");
      return fetchClinicDataFallback();
    }
    
    return enhancedClinics;
  } catch (error) {
    console.error("獲取診所資料時發生錯誤:", error);
    
    // 嘗試從分開的端點獲取
    return fetchClinicDataFallback();
  }
}

// 備用方法，獨立獲取各個資料來源並合併
export const fetchClinicDataFallback = async (): Promise<Clinic[]> => {
  try {
    // 根據環境確定BASE URL
    const baseUrl = import.meta.env.DEV 
      ? '' 
      : (import.meta.env.VITE_API_URL || '');
    
    // 添加時間戳和隨機數，強制瀏覽器不使用緩存
    const cacheBreaker = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // 構建API請求參數
    const fetchOptions = {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store' as RequestCache
    };
    
    // 優先獨立獲取深圳診所數據
    console.log("直接從專門API獲取深圳診所數據...");
    const szClinicsResp = await fetch(`${baseUrl}/api/sz-clinics?${cacheBreaker}`, fetchOptions);
    const szClinics = szClinicsResp.ok ? await szClinicsResp.json() : [];
    
    // 如果深圳診所數據不足，嘗試直接請求文件
    if (szClinics.length < 20) {
      console.log("API返回深圳診所數據不足，嘗試直接請求JSON文件...");
      try {
        // 嘗試直接從靜態文件獲取
        const directJsonResp = await fetch(`${baseUrl}/attached_assets/fixed_sz_clinics.json?${cacheBreaker}`, fetchOptions);
        if (directJsonResp.ok) {
          const directClinics = await directJsonResp.json();
          if (Array.isArray(directClinics) && directClinics.length > 15) {
            console.log(`成功從靜態文件獲取 ${directClinics.length} 間深圳診所`);
            
            // 標記這些診所為大灣區
            const markedDirectClinics = directClinics.map(clinic => ({
              ...clinic,
              isGreaterBayArea: true,
              city: clinic.city || '深圳',
              country: clinic.country || '中國'
            }));
            
            // 獲取香港和NGO診所
            const [hkClinicsResp, ngoClinicsResp] = await Promise.all([
              fetch(`${baseUrl}/api/hk-clinics?${cacheBreaker}`, fetchOptions),
              fetch(`${baseUrl}/api/ngo-clinics?${cacheBreaker}`, fetchOptions)
            ]);
            
            const hkClinics = hkClinicsResp.ok ? await hkClinicsResp.json() : [];
            const ngoClinics = ngoClinicsResp.ok ? await ngoClinicsResp.json() : [];
            
            // 合併所有診所數據
            const allClinics = [...hkClinics, ...ngoClinics, ...markedDirectClinics];
            const enhancedClinics = allClinics.map(enhanceClinicData);
            
            console.log("總共獲取到診所:", enhancedClinics.length, "其中深圳診所:", markedDirectClinics.length);
            return enhancedClinics;
          }
        }
      } catch (directError) {
        console.error("直接獲取JSON失敗:", directError);
      }
    }
    
    // 正常流程：獲取所有診所數據
    const [hkClinicsResp, ngoClinicsResp] = await Promise.all([
      fetch(`${baseUrl}/api/hk-clinics?${cacheBreaker}`, fetchOptions),
      fetch(`${baseUrl}/api/ngo-clinics?${cacheBreaker}`, fetchOptions)
    ]);

    const hkClinics = hkClinicsResp.ok ? await hkClinicsResp.json() : [];
    const ngoClinics = ngoClinicsResp.ok ? await ngoClinicsResp.json() : [];

    console.log("備用方法獲取資料:", {
      hk: hkClinics.length,
      ngo: ngoClinics.length,
      sz: szClinics.length
    });

    // 合併所有診所數據並確保每個診所都有必要的字段
    const allClinics = [...hkClinics, ...ngoClinics, ...szClinics];
    const enhancedClinics = allClinics.map(enhanceClinicData);
    return enhancedClinics;
  } catch (error) {
    console.error("備用資料獲取方法失敗:", error);
    return [];
  }
};
