import fs from 'fs';
import path from 'path';
import { Article } from '../../client/src/types/article';

const articlesDir = path.join(process.cwd(), 'content/articles');

/**
 * 獲取單篇文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: '缺少文章slug參數' });
    }
    
    // 讀取articles目錄中的所有文件
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
    
    // 尋找匹配的文章
    let foundArticle: Article | null = null;
    
    for (const file of files) {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const article = JSON.parse(fileContent) as Article;
      
      if (article.slug === slug) {
        foundArticle = article;
        break;
      }
    }
    
    if (foundArticle) {
      res.status(200).json(foundArticle);
    } else {
      res.status(404).json({ error: '找不到指定的文章' });
    }
  } catch (error) {
    console.error(`讀取文章 ${req.params.slug} 時出錯:`, error);
    res.status(500).json({ error: '無法獲取文章' });
  }
}