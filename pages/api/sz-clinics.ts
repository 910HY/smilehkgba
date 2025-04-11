import { rootDir, handleApiResponse, handleApiError, readJsonFile } from './_utils';
import path from 'path';
import fs from 'fs';

export default function handler(req: any, res: any) {
  try {
    console.log('API 請求: /api/sz-clinics');
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // 版本號 - 每次部署時改變此數字，確保前端獲取新數據
    const VERSION = "20250411-001";
    console.log(`數據版本: ${VERSION}`);
    
    // 嘗試讀取深圳診所數據文件（使用增強版深圳診所數據）
    // 嘗試在多個位置查找診所數據文件，優先使用public/api/data目錄中的文件（Vercel部署時使用）
    
    // Vercel 環境下使用的路徑特別處理
    const isVercel = process.env.VERCEL === '1';
    const vercelDataPath = isVercel ? path.join(process.cwd(), '.vercel', 'output', 'static', 'api', 'data') : '';
    
    // 嘗試所有可能的文件路徑，優先級順序從高到低
    const possiblePaths = [
      // Vercel 環境特定路徑
      isVercel ? path.join(vercelDataPath, 'enhanced_sz_clinics.json') : null,
      // 公共API目錄路徑
      path.join(rootDir, 'public', 'api', 'data', 'enhanced_sz_clinics.json'),
      // attached_assets 目錄下的各種可能檔案
      path.join(rootDir, 'attached_assets', 'enhanced_sz_clinics.json'),
      path.join(rootDir, 'attached_assets', 'fixed_sz_clinics.json'),
      path.join(rootDir, 'attached_assets', 'shenzhen_dental_clinics_fixed.json'),
      path.join(rootDir, 'attached_assets', 'shenzhen_dental_clinics_valid.json'),
      path.join(rootDir, 'attached_assets', 'fixed_dental_clinics.json'),
      path.join(rootDir, 'attached_assets', '2025-shenzhen-dental-value.json')
    ].filter(Boolean); // 移除null值
    
    // 找到第一個存在的文件
    let szFilePath: string | null = null;
    for (const filePath of possiblePaths) {
      if (filePath && fs.existsSync(filePath)) {
        szFilePath = filePath;
        break;
      }
    }
    
    if (!szFilePath) {
      throw new Error('找不到任何可用的深圳診所數據文件');
    }
    
    console.log('使用深圳診所數據文件:', szFilePath);
    
    // 讀取原始數據
    const szRawData = readJsonFile(szFilePath);
    
    // 處理深圳診所數據，添加缺失的字段
    const data = szRawData.map((clinic: any) => {
      if (!clinic.region_en) {
        // 根據region添加region_en和region_code
        let region = clinic.region || clinic.district || '';
        let region_en = '';
        let region_code = '';
        
        // 處理簡繁體差異
        switch (region) {
          case '福田區':
          case '福田区':
            region_en = 'Futian';
            region_code = 'futian';
            break;
          case '羅湖區':
          case '罗湖区':
            region_en = 'Luohu';
            region_code = 'luohu';
            break;
          case '南山區':
          case '南山区':
            region_en = 'Nanshan';
            region_code = 'nanshan';
            break;
          case '寶安區':
          case '宝安区':
            region_en = 'Baoan';
            region_code = 'baoan';
            break;
          case '龍華區':
          case '龙华区':
            region_en = 'Longhua';
            region_code = 'longhua';
            break;
          case '龍崗區':
          case '龙岗区':
            region_en = 'Longgang';
            region_code = 'longgang';
            break;
          case '光明區':
          case '光明区':
            region_en = 'Guangming';
            region_code = 'guangming';
            break;
          case '坪山區':
          case '坪山区':
            region_en = 'Pingshan';
            region_code = 'pingshan';
            break;
          case '鹽田區':
          case '盐田区':
            region_en = 'Yantian';
            region_code = 'yantian';
            break;
          case '大鵬新區':
          case '大鹏新区':
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
        
        // 標準化類型和時間
        const hours = clinic.hours || clinic.opening_hours || '';
        const type = clinic.type === '私營' ? '私家診所' : (clinic.type || '私家診所');
        
        return {
          ...clinic,
          region: region,
          region_en,
          region_code,
          slug,
          url,
          hours,
          type,
          city: clinic.city || '深圳',
          country: clinic.country || '中國',
          isGreaterBayArea: true,
          photo: clinic.photo || '無照片',
          // 根據評價結果添加評分和連鎖信息
          rating: parseFloat(clinic.rating) || undefined,
          isChain: clinic.isChain === true || clinic.isChain === 'true' || clinic.name.includes('連鎖') || clinic.name.includes('连锁') || false
        };
      }
      return {
        ...clinic,
        rating: parseFloat(clinic.rating) || undefined,
        isChain: clinic.isChain === true || clinic.isChain === 'true' || clinic.name.includes('連鎖') || clinic.name.includes('连锁') || false
      };
    });
    
    console.log(`返回 ${data.length} 筆深圳診所資料`);
    return handleApiResponse(res, data);
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch SZ clinic data');
  }
}