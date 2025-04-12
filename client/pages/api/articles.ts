import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from './_utils';
import path from 'path';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 獲取所有文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/articles');
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // 版本號 - 每次部署時改變此數字，確保前端獲取新數據
    const VERSION = "20250412-001";
    console.log(`文章數據版本: ${VERSION}`);
    
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
    
    // 找到存在的文章目錄
    let articlesDir = '';
    
    for (const dirPath of possibleArticlesPaths) {
      if (fs.existsSync(dirPath)) {
        articlesDir = dirPath;
        console.log(`找到文章目錄: ${dirPath}`);
        break;
      }
    }
    
    // 如果沒有找到任何文章目錄，返回空數組
    if (articlesDir === '') {
      console.log('找不到任何文章目錄');
      return handleApiResponse(res, []);
    }
    
    // 讀取articles目錄
    const files = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.json') && !file.includes('clinic'));
    console.log(`找到 ${files.length} 篇文章`);
    
    // 讀取每個文章文件並解析JSON
    const articles = files.map(file => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      try {
        const article = JSON.parse(fileContent);
        // 確保文章有所有必要的字段
        if (!article.title || !article.slug) {
          console.warn(`文章 ${file} 缺少必要字段`);
          return null;
        }
        return article;
      } catch (e) {
        console.error(`文件解析失敗: ${file}`, e);
        return null;
      }
    }).filter(article => article !== null) as any[]; // 移除解析失敗或缺少字段的文件
    
    // 根據發佈日期排序（最新的在前）
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.publishedAt || '2024-01-01').getTime() - new Date(a.publishedAt || '2024-01-01').getTime()
    );
    
    return handleApiResponse(res, sortedArticles);
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取文章列表');
  }
}