import path from 'path';
import fs from 'fs';

export default function handler(req: any, res: any) {
  // 只允許GET請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // 嘗試多個可能的路徑以適應不同環境
    let filePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'data', 'clinic_list_hkcss_cleaned.json');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'attached_assets', 'clinic_list_hkcss_cleaned.json');
    }
    
    console.log('正在讀取香港診所數據文件:', filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    
    // 解析數據並添加缺失的字段
    const hkData = JSON.parse(data);
    
    // 處理香港診所數據，添加缺失的字段
    const processedData = hkData.map((clinic: any) => {
      if (!clinic.region_en) {
        let region_en = '';
        let region_code = '';
        
        // 港島區
        if (['中西區', '灣仔區', '東區', '南區'].includes(clinic.region)) {
          if (clinic.region === '中西區') {
            region_en = 'Central & Western';
            region_code = 'central-western';
          } else if (clinic.region === '灣仔區') {
            region_en = 'Wan Chai';
            region_code = 'wan-chai';
          } else if (clinic.region === '東區') {
            region_en = 'Eastern';
            region_code = 'eastern';
          } else if (clinic.region === '南區') {
            region_en = 'Southern';
            region_code = 'southern';
          }
        } 
        // 九龍區
        else if (['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'].includes(clinic.region)) {
          if (clinic.region === '油尖旺區') {
            region_en = 'Yau Tsim Mong';
            region_code = 'yau-tsim-mong';
          } else if (clinic.region === '深水埗區') {
            region_en = 'Sham Shui Po';
            region_code = 'sham-shui-po';
          } else if (clinic.region === '九龍城區') {
            region_en = 'Kowloon City';
            region_code = 'kowloon-city';
          } else if (clinic.region === '黃大仙區') {
            region_en = 'Wong Tai Sin';
            region_code = 'wong-tai-sin';
          } else if (clinic.region === '觀塘區') {
            region_en = 'Kwun Tong';
            region_code = 'kwun-tong';
          }
        } 
        // 新界區
        else {
          if (clinic.region.includes('西貢')) {
            region_en = 'Sai Kung';
            region_code = 'sai-kung';
          } else if (clinic.region.includes('沙田')) {
            region_en = 'Sha Tin';
            region_code = 'sha-tin';
          } else if (clinic.region.includes('大埔')) {
            region_en = 'Tai Po';
            region_code = 'tai-po';
          } else if (clinic.region.includes('北區')) {
            region_en = 'North';
            region_code = 'north';
          } else if (clinic.region.includes('元朗')) {
            region_en = 'Yuen Long';
            region_code = 'yuen-long';
          } else if (clinic.region.includes('屯門')) {
            region_en = 'Tuen Mun';
            region_code = 'tuen-mun';
          } else if (clinic.region.includes('荃灣')) {
            region_en = 'Tsuen Wan';
            region_code = 'tsuen-wan';
          } else if (clinic.region.includes('葵青')) {
            region_en = 'Kwai Tsing';
            region_code = 'kwai-tsing';
          } else if (clinic.region.includes('離島')) {
            region_en = 'Islands';
            region_code = 'islands';
          } else {
            region_en = 'Hong Kong';
            region_code = 'hong-kong';
          }
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
    
    console.log(`返回 ${processedData.length} 筆香港診所資料`);
    res.status(200).json(processedData);
  } catch (error) {
    console.error('Error fetching HK clinics:', error);
    res.status(500).json({ error: 'Failed to fetch HK clinics data' });
  }
}