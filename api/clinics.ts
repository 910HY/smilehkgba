import path from 'path';
import fs from 'fs';

// 使用接口而不是導入，避免路徑問題
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
  location?: {
    lat: number;
    lng: number;
  };
  prices?: {
    洗牙?: string;
    補牙?: string;
    拔牙?: string;
    植牙?: string;
  };
}

export default function handler(req: any, res: any) {
  // 只允許GET請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // 讀取所有診所資料
    const hkFilePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
    const ngoFilePath = path.join(process.cwd(), 'api', 'data', 'ngo_clinics_cleaned.json');
    const szFilePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_20250407.json');
    
    const hkData = JSON.parse(fs.readFileSync(hkFilePath, 'utf8'));
    const ngoData = JSON.parse(fs.readFileSync(ngoFilePath, 'utf8'));
    const szData = JSON.parse(fs.readFileSync(szFilePath, 'utf8'));
    
    // 合併所有診所資料
    const allClinics: Clinic[] = [...hkData, ...ngoData, ...szData];
    
    res.status(200).json(allClinics);
  } catch (error) {
    console.error('Error fetching all clinics:', error);
    res.status(500).json({ error: 'Failed to fetch clinic data' });
  }
}