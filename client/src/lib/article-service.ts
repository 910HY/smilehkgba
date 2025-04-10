import { Article, ArticleList } from '../types/article';
import { apiRequest } from './queryClient';

/**
 * 從服務器獲取所有文章
 */
export async function getAllArticles(): Promise<ArticleList> {
  try {
    const response = await apiRequest('/api/articles', {
      method: 'GET',
    });
    const data = await response.json();
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
    const response = await apiRequest(`/api/articles/${slug}`, {
      method: 'GET',
    });
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
    const allArticles = await getAllArticles();
    // 按發佈日期排序，獲取最新的幾篇
    return allArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('獲取最新文章失敗:', error);
    return [];
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