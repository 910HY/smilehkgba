import { Article, ArticleList } from '../types/article';
import { apiRequest } from './queryClient';

/**
 * 從服務器獲取所有優惠文章
 */
export async function getAllPromotions(): Promise<ArticleList> {
  try {
    // 使用GET請求獲取優惠文章列表
    console.log('正在獲取優惠文章列表...');
    const response = await apiRequest('GET', '/api/promotions');
    const data = await response.json();
    console.log('獲取到優惠文章數據:', data?.length || 0, '篇');
    return data as ArticleList;
  } catch (error) {
    console.error('獲取優惠文章列表失敗:', error);
    return [];
  }
}

/**
 * 根據 slug 獲取單篇優惠文章
 */
export async function getPromotionBySlug(slug: string): Promise<Article | null> {
  if (!slug) return null;
  
  try {
    // 使用GET請求獲取單篇優惠文章
    const response = await apiRequest('GET', `/api/promotions/${slug}`);
    const data = await response.json();
    return data as Article;
  } catch (error) {
    console.error(`獲取優惠文章 ${slug} 失敗:`, error);
    return null;
  }
}

/**
 * 獲取最新的優惠文章（用於首頁展示）
 */
export async function getLatestPromotions(limit: number = 3): Promise<ArticleList> {
  try {
    console.log(`正在直接從API獲取最新${limit}篇優惠文章...`);
    
    // 為避免緩存問題，我們直接獲取所有優惠文章，然後在客戶端進行篩選
    const response = await apiRequest('GET', '/api/promotions');
    const data = await response.json();
    console.log('原始優惠API數據:', data.length || 0, '篇優惠文章');
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('API返回的優惠數據不是有效數組或長度為0');
      return [];
    }
    
    // 確保每篇文章都有publishedAt字段，否則可能會排序失敗
    const validPromotions = data.filter(promotion => promotion && promotion.publishedAt);
    
    // 按發佈日期排序，獲取最新的幾篇
    const latestPromotions = validPromotions
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
    
    console.log(`篩選後獲取到${latestPromotions.length}篇最新優惠文章`);
    if (latestPromotions.length > 0) {
      console.log('第一篇優惠文章標題:', latestPromotions[0]?.title);
    }
    
    return latestPromotions;
  } catch (error) {
    console.error('獲取最新優惠文章失敗:', error);
    throw error; // 拋出錯誤讓React Query處理
  }
}

/**
 * 根據標籤過濾優惠文章
 */
export async function getPromotionsByTag(tag: string): Promise<ArticleList> {
  if (!tag) return [];
  
  try {
    const allPromotions = await getAllPromotions();
    return allPromotions.filter(promotion => promotion.tags.includes(tag));
  } catch (error) {
    console.error(`獲取標籤 ${tag} 的優惠文章失敗:`, error);
    return [];
  }
}