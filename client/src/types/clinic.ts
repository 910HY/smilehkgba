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
  
  // 優質診所相關
  isFiltered?: boolean;     // 是否為篩選後的優質診所
  isHighRated?: boolean;    // 是否為高評分診所（評分 > 4.5）
  highlight?: boolean;      // 是否需要高亮顯示
  rating?: number;          // 診所評分（如有）
  is_chain?: boolean;       // 是否為連鎖診所
  services?: string[];      // 提供的服務列表
  priceInfo?: string;       // 價格信息字符串
  
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
    美白?: string;
  };
}
