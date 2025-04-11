import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 獲取項目根目錄
const rootDir = process.env.VERCEL ? process.cwd() : path.resolve(__dirname, '../../../../');

// 工具函數：獲取文件路徑
function getFilePath(...pathSegments: string[]): string {
  return path.join(rootDir, ...pathSegments);
}

// 工具函數：確保目錄存在
function ensureDirectoryExists(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return false;
  }
  return true;
}

/**
 * 獲取單篇文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ error: '無效的文章識別碼' });
    }
    
    console.log(`API 請求: /api/articles/${slug}`);
    const articlesDir = getFilePath('content', 'articles');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(articlesDir)) {
      console.log('文章目錄不存在，已創建目錄');
      return res.status(404).json({ error: '找不到文章' });
    }
    
    // 尋找匹配的文章文件
    // 首先嘗試直接使用slug匹配文件名
    let filePath = path.join(articlesDir, `${slug}.json`);
    
    // 如果文件不存在，則嘗試遍歷所有文件，查找匹配slug的文章
    if (!fs.existsSync(filePath)) {
      console.log(`文件 ${filePath} 不存在，嘗試查找匹配的文章`);
      
      const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
      let matchingArticle = null;
      
      for (const file of files) {
        const articlePath = path.join(articlesDir, file);
        const content = fs.readFileSync(articlePath, 'utf8');
        try {
          const article = JSON.parse(content);
          if (article.slug === slug) {
            matchingArticle = article;
            break;
          }
        } catch (error) {
          console.error(`解析文件 ${file} 時出錯:`, error);
        }
      }
      
      if (matchingArticle) {
        return res.status(200).json(matchingArticle);
      }
      
      return res.status(404).json({ error: '找不到文章' });
    }
    
    // 讀取文章文件
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const article = JSON.parse(fileContent);
    
    res.status(200).json(article);
  } catch (error) {
    console.error('讀取文章時出錯:', error);
    res.status(500).json({ error: '無法獲取文章', details: (error as Error).message });
  }
}