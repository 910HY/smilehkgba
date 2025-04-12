import type { Article, ArticleList } from "../types/article";

/**
 * 從服務器獲取所有文章
 */
export async function getAllArticles(): Promise<ArticleList> {
  try {
    const response = await fetch(`/api/articles?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    const data = await response.json();
    console.log("獲取到文章數據:", data.length, "篇");
    return data;
  } catch (error) {
    console.error("獲取文章時出錯:", error);
    return [];
  }
}

/**
 * 根據 slug 獲取單篇文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`/api/articles/${slug}?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`獲取文章 ${slug} 時出錯:`, error);
    return null;
  }
}

/**
 * 獲取最新的文章（用於首頁展示）
 */
export async function getLatestArticles(limit: number = 3): Promise<ArticleList> {
  try {
    console.log("正在直接從API獲取最新" + limit + "篇文章...");
    console.log("API請求: GET /api/articles");
    
    const response = await fetch(`/api/articles?nocache=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    
    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    
    console.log("API回應: /api/articles, 狀態:", response.status);
    
    const data = await response.json();
    console.log("原始API數據:", data.length, "篇文章");
    
    // 按發布日期排序並取最新的 limit 篇
    const sortedArticles = [...data].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }).slice(0, limit);
    
    console.log("篩選後獲取到" + sortedArticles.length + "篇最新文章");
    
    if (sortedArticles.length > 0) {
      console.log("第一篇文章標題:", sortedArticles[0].title);
      console.log("文章詳情:", JSON.stringify(sortedArticles[0]));
    }
    
    return sortedArticles;
  } catch (error) {
    console.error("獲取最新文章時出錯:", error);
    return [];
  }
}

/**
 * 根據標籤過濾文章
 */
export async function getArticlesByTag(tag: string): Promise<ArticleList> {
  try {
    const allArticles = await getAllArticles();
    return allArticles.filter(article => article.tags.includes(tag));
  } catch (error) {
    console.error(`根據標籤 ${tag} 過濾文章時出錯:`, error);
    return [];
  }
}