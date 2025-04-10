import fs from 'fs';
import path from 'path';
import { Article } from '../client/src/types/article';

const promotionsDir = path.join(process.cwd(), 'content/promotions');

/**
 * 獲取所有優惠文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    // 確認目錄存在
    if (!fs.existsSync(promotionsDir)) {
      fs.mkdirSync(promotionsDir, { recursive: true });
    }
    
    // 讀取promotions目錄
    const files = fs.readdirSync(promotionsDir).filter(file => file.endsWith('.json'));
    
    console.log(`找到 ${files.length} 篇優惠文章`);
    
    // 讀取每個優惠文章文件並解析JSON
    const promotions = files.map(file => {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as Article;
    });
    
    // 根據發佈日期排序（最新的在前）
    const sortedPromotions = promotions.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    res.status(200).json(sortedPromotions);
  } catch (error) {
    console.error('讀取優惠文章列表時出錯:', error);
    res.status(500).json({ 
      error: '無法獲取優惠文章列表', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}