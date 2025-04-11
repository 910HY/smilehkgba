export interface Clinic {
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
  rating?: number;     // 大眾點評或其他平台評分
  isChain?: boolean;   // 是否為連鎖診所
  
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
