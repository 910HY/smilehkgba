// 用於地理編碼的簡單工具，使用 Nominatim OpenStreetMap API (免費且不需要 API 密鑰)

interface GeocodeResult {
  lat: number;
  lng: number;
  success: boolean;
  error?: string;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * 使用 OpenStreetMap Nominatim 地理編碼服務將地址轉換為經緯度
 * https://nominatim.org/release-docs/develop/api/Search/
 */
export async function geocodeAddress(address: string, country?: string): Promise<GeocodeResult> {
  try {
    // 構建查詢參數
    const query = new URLSearchParams({
      q: address,
      format: 'json',
      addressdetails: '1',
      limit: '1'
    });

    // 如果提供了國家，則添加國家過濾器
    if (country) {
      query.append('countrycodes', getCountryCode(country));
    }

    // 發送請求到 Nominatim API
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
      headers: {
        'User-Agent': 'SmileHK-DentalApp'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding request failed with status: ${response.status}`);
    }

    const data = await response.json() as NominatimResponse[];
    
    // 檢查是否有結果
    if (data.length === 0) {
      return {
        lat: 0,
        lng: 0,
        success: false,
        error: '未找到地址的地理位置'
      };
    }

    // 返回第一個結果
    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      success: true
    };
  } catch (error) {
    console.error('地理編碼錯誤:', error);
    return {
      lat: 0,
      lng: 0,
      success: false,
      error: error instanceof Error ? error.message : '未知錯誤'
    };
  }
}

/**
 * 將國家名稱轉換為 ISO 國家代碼
 */
function getCountryCode(country: string): string {
  const countryMap: Record<string, string> = {
    '中國': 'cn',
    '香港': 'hk',
    '台灣': 'tw',
    '澳門': 'mo'
  };

  return countryMap[country] || '';
}

/**
 * 為香港地區提供默認經緯度（如果地理編碼失敗）
 */
export function getDefaultHongKongLocation(region: string): {lat: number, lng: number} {
  // 香港各區的大致中心點
  const regionMap: Record<string, {lat: number, lng: number}> = {
    '中西區': {lat: 22.2858, lng: 114.1540},
    '灣仔區': {lat: 22.2756, lng: 114.1729},
    '東區': {lat: 22.2839, lng: 114.2232},
    '南區': {lat: 22.2474, lng: 114.1555},
    '油尖旺區': {lat: 22.3194, lng: 114.1694},
    '深水埗區': {lat: 22.3300, lng: 114.1633},
    '九龍城區': {lat: 22.3316, lng: 114.1874},
    '黃大仙區': {lat: 22.3422, lng: 114.1953},
    '觀塘區': {lat: 22.3162, lng: 114.2265},
    '葵青區': {lat: 22.3567, lng: 114.1329},
    '荃灣區': {lat: 22.3698, lng: 114.1177},
    '屯門區': {lat: 22.3896, lng: 113.9665},
    '元朗區': {lat: 22.4431, lng: 114.0229},
    '北區': {lat: 22.4942, lng: 114.1388},
    '大埔區': {lat: 22.4515, lng: 114.1693},
    '沙田區': {lat: 22.3823, lng: 114.1890},
    '西貢區': {lat: 22.3810, lng: 114.2709},
    '離島區': {lat: 22.2817, lng: 113.9440}
  };

  // 返回指定區域的位置，或香港中心點作為默認值
  return regionMap[region] || {lat: 22.3193, lng: 114.1694}; // 香港中心
}

/**
 * 為大灣區提供默認經緯度（如果地理編碼失敗）
 */
export function getDefaultGBALocation(region: string): {lat: number, lng: number} {
  // 大灣區各區的大致中心點
  const regionMap: Record<string, {lat: number, lng: number}> = {
    '深圳': {lat: 22.5429, lng: 114.0596},
    '廣州': {lat: 23.1291, lng: 113.2644},
    '珠海': {lat: 22.2710, lng: 113.5767},
    '佛山': {lat: 23.0218, lng: 113.1219},
    '東莞': {lat: 23.0430, lng: 113.7633},
    '澳門': {lat: 22.1987, lng: 113.5439},
    '福田區': {lat: 22.5410, lng: 114.0530},
    '羅湖區': {lat: 22.5554, lng: 114.1371}
  };

  // 返回指定區域的位置，或深圳中心點作為默認值
  return regionMap[region] || {lat: 22.5429, lng: 114.0596}; // 深圳中心
}