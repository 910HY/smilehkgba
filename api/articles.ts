import fs from 'fs';
import path from 'path';
import { Article } from '../client/src/types/article';

const articlesDir = path.join(process.cwd(), 'content/articles');

/**
 * 獲取所有文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    // 讀取articles目錄
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
    
    // 讀取每個文章文件並解析JSON
    const articles = files.map(file => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as Article;
    });
    
    // 根據發佈日期排序（最新的在前）
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    res.status(200).json(sortedArticles);
  } catch (error) {
    console.error('讀取文章列表時出錯:', error);
    res.status(500).json({ error: '無法獲取文章列表' });
  }
}