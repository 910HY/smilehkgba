import { Article, ArticleList } from '../types/article';
import { apiRequest } from './queryClient';

/**
 * 從服務器獲取所有文章
 */
export async function getAllArticles(): Promise<ArticleList> {
  try {
    // 使用GET請求獲取文章列表
    console.log('正在獲取文章列表...');
    const response = await apiRequest('GET', '/api/articles');
    const data = await response.json();
    console.log('獲取到文章數據:', data?.length || 0, '篇');
    return data as ArticleList;
  } catch (error) {
    console.error('獲取文章列表失敗:', error);
    return [];
  }
}

/**
 * 根據 slug 獲取單篇文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!slug) return null;
  
  try {
    // 使用GET請求獲取單篇文章
    const response = await apiRequest('GET', `/api/articles/${slug}`);
    const data = await response.json();
    return data as Article;
  } catch (error) {
    console.error(`獲取文章 ${slug} 失敗:`, error);
    return null;
  }
}

/**
 * 獲取最新的文章（用於首頁展示）
 */
export async function getLatestArticles(limit: number = 3): Promise<ArticleList> {
  try {
    console.log(`正在直接從API獲取最新${limit}篇文章...`);
    
    // 為避免緩存問題，我們直接獲取所有文章，然後在客戶端進行篩選
    const response = await apiRequest('GET', '/api/articles');
    const data = await response.json();
    console.log('原始API數據:', data.length || 0, '篇文章');
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('API返回的數據不是有效數組或長度為0');
      return [];
    }
    
    // 確保每篇文章都有publishedAt字段，否則可能會排序失敗
    const validArticles = data.filter(article => article && article.publishedAt);
    
    // 按發佈日期排序，獲取最新的幾篇
    const latestArticles = validArticles
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
    
    console.log(`篩選後獲取到${latestArticles.length}篇最新文章`);
    if (latestArticles.length > 0) {
      console.log('第一篇文章標題:', latestArticles[0]?.title);
      console.log('文章詳情:', JSON.stringify(latestArticles[0], null, 2));
    }
    
    return latestArticles;
  } catch (error) {
    console.error('獲取最新文章失敗:', error);
    throw error; // 拋出錯誤讓React Query處理
  }
}

/**
 * 根據標籤過濾文章
 */
export async function getArticlesByTag(tag: string): Promise<ArticleList> {
  if (!tag) return [];
  
  try {
    const allArticles = await getAllArticles();
    return allArticles.filter(article => article.tags.includes(tag));
  } catch (error) {
    console.error(`獲取標籤 ${tag} 的文章失敗:`, error);
    return [];
  }
}