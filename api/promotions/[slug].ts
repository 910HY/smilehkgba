import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from '../_utils';
import path from 'path';
import fs from 'fs';

/**
 * 獲取單篇優惠文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    const { slug } = req.query;
    console.log(`API 請求: /api/promotions/${slug}`);
    
    if (!slug) {
      return res.status(400).json({ error: '缺少優惠文章slug參數' });
    }
    
    const promotionsDir = path.join(rootDir, 'content', 'promotions');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(promotionsDir)) {
      return res.status(404).json({ error: '優惠文章目錄不存在' });
    }
    
    // 讀取promotions目錄中的所有文件
    const files = fs.readdirSync(promotionsDir).filter(file => file.endsWith('.json'));
    
    // 尋找匹配的優惠文章
    let foundPromotion = null;
    
    for (const file of files) {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const promotion = JSON.parse(fileContent);
      
      if (promotion.slug === slug) {
        foundPromotion = promotion;
        break;
      }
    }
    
    if (foundPromotion) {
      return handleApiResponse(res, foundPromotion);
    } else {
      return res.status(404).json({ error: '找不到指定的優惠文章' });
    }
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取優惠文章');
  }
}