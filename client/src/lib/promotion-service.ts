import { Article } from '../types/article';

type ArticleList = Article[];

/**
 * 從服務器獲取所有優惠文章
 */
export async function getAllPromotions(): Promise<ArticleList> {
  console.log('API請求: GET /api/promotions');
  const response = await fetch('/api/promotions');
  console.log('API回應: /api/promotions, 狀態:', response.status);
  
  if (!response.ok) {
    throw new Error(`獲取優惠文章列表失敗: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('原始優惠API數據:', data.length, '篇優惠文章');
  return data;
}

/**
 * 根據 slug 獲取單篇優惠文章
 */
export async function getPromotionBySlug(slug: string): Promise<Article | null> {
  console.log(`API請求: GET /api/promotions/${slug}`);
  const response = await fetch(`/api/promotions/${slug}`);
  console.log(`API回應: /api/promotions/${slug}, 狀態:`, response.status);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`獲取優惠文章失敗: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * 獲取最新的優惠文章（用於首頁展示）
 */
export async function getLatestPromotions(limit: number = 3): Promise<ArticleList> {
  console.log('正在直接從API獲取最新' + limit + '篇優惠文章...');
  try {
    const allPromotions = await getAllPromotions();
    
    // 按發布日期排序，最新的在前面
    const sortedPromotions = allPromotions.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    // 只返回指定數量的文章
    const limitedPromotions = sortedPromotions.slice(0, limit);
    console.log('篩選後獲取到' + limitedPromotions.length + '篇最新優惠文章');
    
    if (limitedPromotions.length > 0) {
      console.log('第一篇優惠文章標題:', JSON.stringify(limitedPromotions[0].title));
    }
    
    return limitedPromotions;
  } catch (error) {
    console.error('獲取最新優惠文章失敗:', error);
    return [];
  }
}

/**
 * 根據標籤過濾優惠文章
 */
export async function getPromotionsByTag(tag: string): Promise<ArticleList> {
  try {
    const allPromotions = await getAllPromotions();
    
    // 過濾出包含特定標籤的文章
    return allPromotions.filter(article => 
      article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    console.error(`獲取標籤 "${tag}" 的優惠文章失敗:`, error);
    return [];
  }
}