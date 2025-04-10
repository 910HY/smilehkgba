import fs from 'fs';
import path from 'path';
import { Article } from '../../client/src/types/article';

const promotionsDir = path.join(process.cwd(), 'content/promotions');

/**
 * 獲取單篇優惠文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: '缺少優惠文章slug參數' });
    }
    
    // 確認目錄存在
    if (!fs.existsSync(promotionsDir)) {
      fs.mkdirSync(promotionsDir, { recursive: true });
    }
    
    // 讀取promotions目錄中的所有文件
    const files = fs.readdirSync(promotionsDir).filter(file => file.endsWith('.json'));
    
    // 尋找匹配的優惠文章
    let foundPromotion: Article | null = null;
    
    for (const file of files) {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const promotion = JSON.parse(fileContent) as Article;
      
      if (promotion.slug === slug) {
        foundPromotion = promotion;
        break;
      }
    }
    
    if (foundPromotion) {
      res.status(200).json(foundPromotion);
    } else {
      res.status(404).json({ error: '找不到指定的優惠文章' });
    }
  } catch (error) {
    console.error(`讀取優惠文章 ${req.params.slug} 時出錯:`, error);
    res.status(500).json({ 
      error: '無法獲取優惠文章',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}