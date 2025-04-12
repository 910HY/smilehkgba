import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from './_utils';
import path from 'path';
import fs from 'fs';

/**
 * 獲取所有文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    console.log('API 請求: /api/articles');
    const articlesDir = path.join(rootDir, 'content', 'articles');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(articlesDir)) {
      return handleApiResponse(res, []);
    }
    
    // 讀取articles目錄
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
    console.log(`找到 ${files.length} 篇文章`);
    
    // 讀取每個文章文件並解析JSON
    const articles = files.map(file => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    });
    
    // 添加版本信息
    console.log('文章數據版本: 20250412-001');

    // 確保每篇文章都有發佈日期，如果沒有則設為當前日期
    const articlesWithDates = articles.map(article => {
      if (!article.publishedAt) {
        article.publishedAt = new Date().toISOString().split('T')[0];
        console.log(`文章 ${article.title} 缺少發佈日期，已設為當前日期`);
      }
      return article;
    });
    
    // 根據發佈日期排序（最新的在前）
    const sortedArticles = articlesWithDates.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      
      // 如果日期相同，則按標題排序
      if (dateA === dateB) {
        return a.title.localeCompare(b.title);
      }
      
      return dateB - dateA;
    });
    
    return handleApiResponse(res, sortedArticles);
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取文章列表');
  }
}