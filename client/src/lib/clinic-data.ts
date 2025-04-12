import { Clinic } from '../types/clinic';

/**
 * 從 API 獲取診所數據
 */
export async function fetchClinicData(): Promise<Clinic[]> {
  console.log('嘗試從 API 獲取診所數據...');
  
  try {
    const res = await fetch('/api/clinics');
    
    if (!res.ok) {
      throw new Error('無法載入診所資料');
    }
    
    const data = await res.json();
    console.log('成功從API加載診所數據:', data.length);
    
    // 可選：在這裡添加數據處理邏輯
    const szClinics = data.filter((c: Clinic) => 
      c.isGreaterBayArea || c.country === '中國'
    );
    console.log('其中深圳診所數量:', szClinics.length);
    
    return data;
  } catch (error) {
    console.error('獲取診所數據時出錯:', error);
    throw error;
  }
}

/**
 * 替代方案：如果 API 請求失敗，使用此函數
 */
export const fetchClinicDataFallback = async (): Promise<Clinic[]> => {
  console.warn('使用診所數據的備用方案');
  
  // 這裡可以放置一些基本的診所數據，或者從本地存儲加載
  // 或者返回空數組
  return [];
};