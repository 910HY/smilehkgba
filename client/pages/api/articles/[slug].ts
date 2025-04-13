import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from '../_utils';
import path from 'path';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 獲取單篇文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;
    console.log(`API 請求: /api/articles/${slug}`);
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ error: '缺少文章slug參數或格式錯誤' });
    }
    
    // 在不同位置查找文章目錄
    const possibleArticlesPaths = [
      // content/articles (主要位置)
      path.join(rootDir, 'content', 'articles'),
      // Vercel部署可能的位置
      path.join(process.cwd(), 'public', 'content', 'articles'),
      // attached_assets下的content/articles
      path.join(rootDir, 'attached_assets', 'content', 'articles'),
      // 直接在attached_assets下查找
      path.join(rootDir, 'attached_assets'),
    ];
    
    // 尋找匹配的文章
    let foundArticle = null;
    
    // 遍歷所有可能的目錄
    for (const articlesDir of possibleArticlesPaths) {
      // 如果目錄存在
      if (fs.existsSync(articlesDir)) {
        console.log(`檢查目錄: ${articlesDir}`);
        
        // 讀取目錄中的所有文件
        const files = fs.readdirSync(articlesDir)
          .filter(file => file.endsWith('.json') && !file.includes('clinic'));
        
        // 查找匹配的文章
        for (const file of files) {
          const filePath = path.join(articlesDir, file);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const article = JSON.parse(fileContent);
            
            if (article.slug === slug) {
              foundArticle = article;
              console.log(`找到匹配的文章: ${file}`);
              break;
            }
          } catch (e) {
            console.error(`解析文件失敗: ${file}`, e);
          }
        }
        
        // 如果找到了文章，退出循環
        if (foundArticle) {
          break;
        }
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