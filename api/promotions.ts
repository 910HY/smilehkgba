import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from './_utils';
import path from 'path';
import fs from 'fs';

/**
 * 獲取所有優惠文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    console.log('API 請求: /api/promotions');
    const promotionsDir = path.join(rootDir, 'content', 'promotions');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(promotionsDir)) {
      return handleApiResponse(res, []);
    }
    
    // 讀取promotions目錄
    const files = fs.readdirSync(promotionsDir).filter(file => file.endsWith('.json'));
    console.log(`找到 ${files.length} 篇優惠文章`);
    
    // 讀取每個優惠文章文件並解析JSON
    const promotions = files.map(file => {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    });
    
    // 根據發佈日期排序（最新的在前）
    const sortedPromotions = promotions.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return handleApiResponse(res, sortedPromotions);
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取優惠文章列表');
  }
}