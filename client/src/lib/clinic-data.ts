import { Clinic } from "../types/clinic";

// 獲取API基礎URL（根據環境）
const getBaseUrl = () => {
  // 本地開發環境
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  
  // Vercel預覽或生產環境
  return window.location.origin;
};

// 從API獲取所有診所資料
export async function fetchClinicData(): Promise<Clinic[]> {
  const baseUrl = getBaseUrl();
  try {
    // 直接從合併的API端點獲取資料
    const response = await fetch(`${baseUrl}/api/clinics`);
    
    if (!response.ok) {
      throw new Error(`API 回應錯誤: ${response.status}`);
    }
    
    const clinics = await response.json();
    return clinics;
  } catch (error) {
    console.error("獲取診所資料時發生錯誤:", error);
    console.log("嘗試使用備用方法...");
    
    // 嘗試從分開的端點獲取
    return fetchClinicDataFallback();
  }
}

// 備用方法，獨立獲取各個資料來源並合併
export const fetchClinicDataFallback = async (): Promise<Clinic[]> => {
  const baseUrl = getBaseUrl();
  try {
    console.log("使用備用方法獲取資料，基礎URL:", baseUrl);
    
    const [hkClinicsResp, ngoClinicsResp, szClinicsResp] = await Promise.all([
      fetch(`${baseUrl}/api/hk-clinics`),
      fetch(`${baseUrl}/api/ngo-clinics`),
      fetch(`${baseUrl}/api/sz-clinics`)
    ]);

    const hkClinics = hkClinicsResp.ok ? await hkClinicsResp.json() : [];
    const ngoClinics = ngoClinicsResp.ok ? await ngoClinicsResp.json() : [];
    const szClinics = szClinicsResp.ok ? await szClinicsResp.json() : [];

    console.log(`獲取到資料: HK(${hkClinics.length}), NGO(${ngoClinics.length}), SZ(${szClinics.length})`);
    
    // 合併所有診所數據
    return [...hkClinics, ...ngoClinics, ...szClinics];
  } catch (error) {
    console.error("備用資料獲取方法失敗:", error);
    return [];
  }
};
