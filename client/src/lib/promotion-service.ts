import type { Article, ArticleList } from "../types/article";

/**
 * 從服務器獲取所有優惠文章
 */
export async function getAllPromotions(): Promise<ArticleList> {
  try {
    const response = await fetch(`/api/promotions?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    const data = await response.json();
    console.log("原始優惠API數據:", data.length, "篇優惠文章");
    return data;
  } catch (error) {
    console.error("獲取優惠文章時出錯:", error);
    return [];
  }
}

/**
 * 根據 slug 獲取單篇優惠文章
 */
export async function getPromotionBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`/api/promotions/${slug}?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`獲取優惠文章 ${slug} 時出錯:`, error);
    return null;
  }
}

/**
 * 獲取最新的優惠文章（用於首頁展示）
 */
export async function getLatestPromotions(limit: number = 3): Promise<ArticleList> {
  try {
    console.log("正在直接從API獲取最新" + limit + "篇優惠文章...");
    console.log("API請求: GET /api/promotions");
    
    const response = await fetch(`/api/promotions?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    
    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    
    console.log("API回應: /api/promotions, 狀態:", response.status);
    
    const data = await response.json();
    console.log("原始優惠API數據:", data.length, "篇優惠文章");
    
    // 按發布日期排序並取最新的 limit 篇
    const sortedPromotions = [...data].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }).slice(0, limit);
    
    console.log("篩選後獲取到" + sortedPromotions.length + "篇最新優惠文章");
    
    if (sortedPromotions.length > 0) {
      console.log("第一篇優惠文章標題:", sortedPromotions[0].title);
    }
    
    return sortedPromotions;
  } catch (error) {
    console.error("獲取最新優惠文章時出錯:", error);
    return [];
  }
}

/**
 * 根據標籤過濾優惠文章
 */
export async function getPromotionsByTag(tag: string): Promise<ArticleList> {
  try {
    const allPromotions = await getAllPromotions();
    return allPromotions.filter(promotion => promotion.tags.includes(tag));
  } catch (error) {
    console.error(`根據標籤 ${tag} 過濾優惠文章時出錯:`, error);
    return [];
  }
}