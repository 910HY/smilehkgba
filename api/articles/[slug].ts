import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from '../_utils';
import path from 'path';
import fs from 'fs';

/**
 * 獲取單篇文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    const { slug } = req.query;
    console.log(`API 請求: /api/articles/${slug}`);
    
    if (!slug) {
      return res.status(400).json({ error: '缺少文章slug參數' });
    }
    
    const articlesDir = path.join(rootDir, 'content', 'articles');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(articlesDir)) {
      return res.status(404).json({ error: '文章目錄不存在' });
    }
    
    // 讀取articles目錄中的所有文件
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
    
    // 尋找匹配的文章
    let foundArticle = null;
    
    for (const file of files) {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const article = JSON.parse(fileContent);
      
      if (article.slug === slug) {
        foundArticle = article;
        break;
      }
    }
    
    if (foundArticle) {
      return handleApiResponse(res, foundArticle);
    } else {
      return res.status(404).json({ error: '找不到指定的文章' });
    }
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取文章');
  }
}