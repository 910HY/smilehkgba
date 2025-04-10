export interface Source {
  title: string;
  url: string;
}

export interface Article {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  sources: Source[];
  publishedAt: string;
}

export type ArticleList = Article[];