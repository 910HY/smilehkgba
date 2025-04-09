import path from 'path';
import fs from 'fs';

export default function handler(req: any, res: any) {
  // 只允許GET請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // 嘗試多個可能的路徑以適應不同環境
    let filePath = path.join(process.cwd(), 'api', 'data', 'ngo_clinics_cleaned.json');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'data', 'ngo_clinics_cleaned.json');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'attached_assets', 'ngo_clinics_cleaned.json');
    }
    
    console.log('正在讀取NGO診所數據文件:', filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    
    // 解析數據並添加缺失的字段
    const ngoData = JSON.parse(data);
    
    // 處理NGO診所數據
    const processedData = ngoData.map((clinic: any) => {
      if (!clinic.region_en) {
        // 由於NGO診所數據較少，可以為所有NGO診所設置一個通用的region_en
        const region_en = 'NGO';
        const region_code = 'ngo';
        
        // 創建唯一的slug
        const nameSlug = clinic.name
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
          .replace(/\s+/g, '-');
        const slug = `${region_code}-${nameSlug}`;
        
        // 創建URL
        const url = `/clinic/${slug}`;
        
        return {
          ...clinic,
          region_en,
          region_code,
          slug,
          url
        };
      }
      return clinic;
    });
    
    console.log(`返回 ${processedData.length} 筆NGO診所資料`);
    res.status(200).json(processedData);
  } catch (error) {
    console.error('Error fetching NGO clinics:', error);
    res.status(500).json({ error: 'Failed to fetch NGO clinics data' });
  }
}