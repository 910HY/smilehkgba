import path from 'path';
import fs from 'fs';

export default function handler(req: any, res: any) {
  // 只允許GET請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    let filePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_enhanced.json');
    
    console.log('正在讀取深圳診所數據文件:', filePath);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const szClinics = JSON.parse(data);
      console.log(`返回 ${szClinics.length} 筆深圳診所資料（從資料庫）`);
      res.status(200).json(szClinics);
    } else {
      console.log('找不到深圳診所資料文件，使用原始數據');
      // 從attached_assets讀取原始數據並進行處理
      const originalFilePath = path.join(process.cwd(), 'attached_assets', 'shenzhen_dental_clinics_20250407.json');
      if (fs.existsSync(originalFilePath)) {
        const data = fs.readFileSync(originalFilePath, 'utf8');
        const clinics = JSON.parse(data);
        
        // 處理數據添加必要欄位
        const processedClinics = clinics.map((clinic: any) => {
          // 創建缺失的字段
          let region = clinic.region || clinic.district || '';
          let region_en = '';
          let region_code = '';
          
          // 根據地區添加英文名和代碼
          switch (region) {
            case '福田區':
              region_en = 'Futian';
              region_code = 'futian';
              break;
            case '羅湖區':
              region_en = 'Luohu';
              region_code = 'luohu';
              break;
            case '南山區':
            case '南山区':
              region_en = 'Nanshan';
              region_code = 'nanshan';
              break;
            case '寶安區':
              region_en = 'Baoan';
              region_code = 'baoan';
              break;
            case '龍華區':
            case '龙华区':
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
          
          // 標準化數據
          return {
            ...clinic,
            region: region,
            region_en,
            region_code,
            slug,
            url,
            hours: clinic.hours || clinic.opening_hours || '',
            type: clinic.type || '私家診所',
            city: clinic.city || '深圳',
            country: clinic.country || '中國',
            isGreaterBayArea: true,
            photo: clinic.photo || '無照片'
          };
        });
        
        console.log(`返回 ${processedClinics.length} 筆深圳診所資料（從原始數據）`);
        res.status(200).json(processedClinics);
      } else {
        console.error('找不到任何深圳診所資料文件');
        res.status(500).json({ error: '找不到任何深圳診所資料' });
      }
    }
  } catch (error) {
    console.error('Error fetching Shenzhen clinics:', error);
    res.status(500).json({ error: 'Failed to fetch Shenzhen clinics data' });
  }
}