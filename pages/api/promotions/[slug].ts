import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from '../_utils';
import path from 'path';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 獲取單篇優惠文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;
    console.log(`API 請求: /api/promotions/${slug}`);
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ error: '缺少優惠文章slug參數或格式錯誤' });
    }
    
    // 在不同位置查找優惠文章目錄
    const possiblePromotionsPaths = [
      // public/promotions (優先位置) - 推薦的直接公開路徑
      path.join(rootDir, 'public', 'promotions'),
      // content/promotions (次要位置)
      path.join(rootDir, 'client', 'content', 'promotions'),
      // content/promotions (備用位置)
      path.join(rootDir, 'content', 'promotions'),
      // Vercel部署可能的位置
      path.join(process.cwd(), 'public', 'promotions'),
      // attached_assets下查找
      path.join(rootDir, 'attached_assets'),
    ];
    
    // 尋找匹配的優惠文章
    let foundPromotion = null;
    
    // 遍歷所有可能的目錄
    for (const promotionsDir of possiblePromotionsPaths) {
      // 如果目錄存在
      if (fs.existsSync(promotionsDir)) {
        console.log(`檢查目錄: ${promotionsDir}`);
        
        // 讀取目錄中的所有文件
        const files = fs.readdirSync(promotionsDir)
          .filter(file => file.endsWith('.json') && !file.includes('clinic'));
        
        // 查找匹配的優惠文章
        for (const file of files) {
          const filePath = path.join(promotionsDir, file);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const promotion = JSON.parse(fileContent);
            
            if (promotion.slug === slug) {
              foundPromotion = promotion;
              console.log(`找到匹配的優惠文章: ${file}`);
              break;
            }
          } catch (e) {
            console.error(`解析文件失敗: ${file}`, e);
          }
        }
        
        // 如果找到了優惠文章，退出循環
        if (foundPromotion) {
          break;
        }
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