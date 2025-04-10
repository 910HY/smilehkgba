import { Article, ArticleList } from '../types/article';

/**
 * 從服務器獲取所有文章
 */
export async function getAllArticles(): Promise<ArticleList> {
  try {
    const response = await fetch('/api/articles');
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * 根據 slug 獲取單篇文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`/api/articles/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch article');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
}

/**
 * 獲取最新的文章（用於首頁展示）
 */
export async function getLatestArticles(limit: number = 3): Promise<ArticleList> {
  try {
    const articles = await getAllArticles();
    
    // 按發佈日期排序（最新的在前）
    return articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }
}

/**
 * 根據標籤過濾文章
 */
export async function getArticlesByTag(tag: string): Promise<ArticleList> {
  try {
    const articles = await getAllArticles();
    return articles.filter(article => article.tags.includes(tag));
  } catch (error) {
    console.error(`Error fetching articles with tag ${tag}:`, error);
    return [];
  }
}