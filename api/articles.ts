import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from './_utils';
import path from 'path';
import fs from 'fs';

// 用於文章類型的接口
interface Article {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  sources: Array<{title: string, url: string}>;
  publishedAt: string;
}

// 輸出當前運行目錄，用於調試
console.log('當前工作目錄:', process.cwd());
console.log('rootDir:', rootDir);

/**
 * 獲取所有文章的API端點
 */
export default function handler(req: any, res: any) {
  console.log('文章數據版本: 20250412-002');
  try {
    console.log('API 請求: /api/articles');
    const articlesDir = path.join(rootDir, 'content', 'articles');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(articlesDir)) {
      return handleApiResponse(res, []);
    }
    
    // 確保 articlesDir 是正確的路徑
    console.log("找到文章目錄:", articlesDir);
    
    // 讀取articles目錄
    const allFiles = fs.readdirSync(articlesDir);
    console.log(`目錄中所有文件: ${allFiles.join(', ')}`);
    
    const files = allFiles.filter(file => file.endsWith('.json'));
    console.log(`找到 ${files.length} 篇文章`);
    console.log(`文章文件列表: ${files.join(', ')}`);
    
    // 讀取每個文章文件並解析JSON
    const articles: Article[] = [];
    for (const file of files) {
      try {
        const filePath = path.join(articlesDir, file);
        console.log(`嘗試讀取文件: ${filePath}`);
        
        // 嘗試直接讀取文件內容並輸出前100個字符用於檢查
        const fileContent = fs.readFileSync(filePath, 'utf8');
        console.log(`文件 ${file} 內容開頭: ${fileContent.substring(0, 100)}...`);
        
        // 嘗試解析JSON
        try {
          const article = JSON.parse(fileContent) as Article;
          if (article && article.title && article.slug) {
            articles.push(article);
            console.log(`成功解析文章: ${article.title}`);
          } else {
            console.error(`文件 ${file} 解析後缺少必要字段`);
          }
        } catch (parseErr) {
          console.error(`解析文件 ${file} 的JSON時出錯: ${parseErr}`);
        }
      } catch (err) {
        console.error(`讀取文章文件 ${file} 時出錯:`, err);
      }
    }
    
    console.log(`成功解析 ${articles.length} 篇文章，包括: ${articles.map(a => a.slug).join(', ')}`);
    
    // 添加版本信息
    console.log('文章數據版本: 20250412-002');

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
      // 安全地處理日期
      let dateA, dateB;
      try {
        dateA = new Date(a.publishedAt).getTime();
      } catch (e) {
        dateA = 0;
      }
      
      try {
        dateB = new Date(b.publishedAt).getTime();
      } catch (e) {
        dateB = 0;
      }
      
      // 處理日期無效的情況
      if (isNaN(dateA)) dateA = 0;
      if (isNaN(dateB)) dateB = 0;
      
      // 如果日期相同，則按標題排序
      if (dateA === dateB) {
        return a.title.localeCompare(b.title);
      }
      
      return dateB - dateA;
    });
    
    return handleApiResponse(res, sortedArticles);
  } catch (error: any) {
    console.error('處理文章列表時發生重大錯誤:', error);
    return handleApiError(res, error, '無法獲取文章列表');
  }
}