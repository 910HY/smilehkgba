import path from 'path';
import fs from 'fs';

export default function handler(req: any, res: any) {
  // 只允許GET請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // 嘗試多個可能的路徑以適應不同環境
    let filePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_updated.json');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'data', 'shenzhen_dental_clinics_updated.json');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'attached_assets', 'shenzhen_dental_clinics_20250407.json');
    }
    
    console.log('正在讀取深圳診所數據文件:', filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    
    // 解析數據並添加缺失的字段
    const clinics = JSON.parse(data);
    
    // 為沒有region_en的診所添加該字段
    const processedClinics = clinics.map((clinic: any) => {
      if (!clinic.region_en) {
        // 根據region添加region_en和region_code
        let region_en = '';
        let region_code = '';
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
            region_en = 'Nanshan';
            region_code = 'nanshan';
            break;
          case '寶安區':
            region_en = 'Baoan';
            region_code = 'baoan';
            break;
          case '龍華區':
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
    
    console.log(`返回 ${processedClinics.length} 筆深圳診所資料`);
    res.status(200).json(processedClinics);
  } catch (error) {
    console.error('Error fetching Shenzhen clinics:', error);
    res.status(500).json({ error: 'Failed to fetch Shenzhen clinics data' });
  }
}