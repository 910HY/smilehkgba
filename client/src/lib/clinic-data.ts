import type { Clinic } from "../types/clinic";

/**
 * 從 API 獲取診所數據
 */
export async function fetchClinicData(): Promise<Clinic[]> {
  try {
    const response = await fetch(`/api/clinics?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    if (!response.ok) throw new Error(`API 錯誤: ${response.status}`);
    
    const data = await response.json();
    
    // 將數據轉換為 Clinic 類型
    const enhancedClinics = data.map((c: Clinic) => {
      return {
        ...c,
        // 確保 isGreaterBayArea 字段存在
        isGreaterBayArea: c.isGreaterBayArea || c.country === '中國' || false
      };
    });
    
    // 過濾用於不同目的的診所
    const szClinics = enhancedClinics.filter((c: Clinic) => 
      c.isGreaterBayArea || c.country === '中國' || c.country === '澳門'
    );
    
    const hkClinics = enhancedClinics.filter((c: Clinic) => 
      !c.isGreaterBayArea && c.country !== '中國' && c.country !== '澳門'
    );
    
    console.log(`已載入 ${enhancedClinics.length} 間診所 (香港: ${hkClinics.length}, 大灣區: ${szClinics.length})`);
    
    return enhancedClinics;
  } catch (error) {
    console.error("獲取診所數據時出錯:", error);
    return [];
  }
}

/**
 * 替代方案：如果 API 請求失敗，使用此函數
 */
export const fetchClinicDataFallback = async (): Promise<Clinic[]> => {
  try {
    console.warn("使用備用方法獲取診所數據...");
    const response = await fetch(
      `/api/clinics.json?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );
    
    if (!response.ok) {
      console.error(`備用 API 錯誤: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("備用方法獲取診所數據時出錯:", error);
    return [];
  }
};