import { Article } from '../types/article';

type ArticleList = Article[];

/**
 * 從服務器獲取所有文章
 */
export async function getAllArticles(): Promise<ArticleList> {
  console.log('API請求: GET /api/articles');
  const response = await fetch('/api/articles');
  console.log('API回應: /api/articles, 狀態:', response.status);
  
  if (!response.ok) {
    throw new Error(`獲取文章列表失敗: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('原始API數據:', data.length, '篇文章');
  return data;
}

/**
 * 根據 slug 獲取單篇文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  console.log(`API請求: GET /api/articles/${slug}`);
  const response = await fetch(`/api/articles/${slug}`);
  console.log(`API回應: /api/articles/${slug}, 狀態:`, response.status);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`獲取文章失敗: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * 獲取最新的文章（用於首頁展示）
 */
export async function getLatestArticles(limit: number = 3): Promise<ArticleList> {
  console.log('正在直接從API獲取最新' + limit + '篇文章...');
  try {
    const allArticles = await getAllArticles();
    
    // 按發布日期排序，最新的在前面
    const sortedArticles = allArticles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    // 只返回指定數量的文章
    const limitedArticles = sortedArticles.slice(0, limit);
    console.log('篩選後獲取到' + limitedArticles.length + '篇最新文章');
    
    if (limitedArticles.length > 0) {
      console.log('第一篇文章標題:', JSON.stringify(limitedArticles[0].title));
      console.log('文章詳情:', JSON.stringify(limitedArticles[0]));
    }
    
    return limitedArticles;
  } catch (error) {
    console.error('獲取最新文章失敗:', error);
    return [];
  }
}

/**
 * 根據標籤過濾文章
 */
export async function getArticlesByTag(tag: string): Promise<ArticleList> {
  try {
    const allArticles = await getAllArticles();
    
    // 過濾出包含特定標籤的文章
    return allArticles.filter(article => 
      article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    console.error(`獲取標籤 "${tag}" 的文章失敗:`, error);
    return [];
  }
}