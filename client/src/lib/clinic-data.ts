import { Clinic } from "../types/clinic";

// 從API獲取所有診所資料
export async function fetchClinicData(): Promise<Clinic[]> {
  try {
    // 在開發環境中使用相對路徑
    const devBaseUrl = import.meta.env.DEV ? '' : '';
    // 直接從合併的API端點獲取資料
    const response = await fetch(`${devBaseUrl}/api/clinics`);
    
    if (!response.ok) {
      throw new Error(`API 回應錯誤: ${response.status}`);
    }
    
    const clinics = await response.json();
    console.log("成功從API加載診所數據:", clinics.length);
    return clinics;
  } catch (error) {
    console.error("獲取診所資料時發生錯誤:", error);
    
    // 嘗試從分開的端點獲取
    return fetchClinicDataFallback();
  }
}

// 備用方法，獨立獲取各個資料來源並合併
export const fetchClinicDataFallback = async (): Promise<Clinic[]> => {
  try {
    // 在開發環境中使用相對路徑
    const devBaseUrl = import.meta.env.DEV ? '' : '';
    
    const [hkClinicsResp, ngoClinicsResp, szClinicsResp] = await Promise.all([
      fetch(`${devBaseUrl}/api/hk-clinics`),
      fetch(`${devBaseUrl}/api/ngo-clinics`),
      fetch(`${devBaseUrl}/api/sz-clinics`)
    ]);

    const hkClinics = hkClinicsResp.ok ? await hkClinicsResp.json() : [];
    const ngoClinics = ngoClinicsResp.ok ? await ngoClinicsResp.json() : [];
    const szClinics = szClinicsResp.ok ? await szClinicsResp.json() : [];

    console.log("備用方法獲取資料:", {
      hk: hkClinics.length,
      ngo: ngoClinics.length,
      sz: szClinics.length
    });

    // 合併所有診所數據
    return [...hkClinics, ...ngoClinics, ...szClinics];
  } catch (error) {
    console.error("備用資料獲取方法失敗:", error);
    return [];
  }
};
