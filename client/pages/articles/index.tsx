import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { useState } from 'react';
import { GetStaticProps } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Article {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  publishedAt: string;
}

interface ArticlesPageProps {
  articles: Article[];
}

export default function ArticlesPage({ articles }: ArticlesPageProps) {
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // 收集所有標籤
  const allTags = [...new Set(articles.flatMap(article => article.tags))];
  
  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredArticles(articles);
    } else {
      setSelectedTag(tag);
      setFilteredArticles(articles.filter(article => article.tags.includes(tag)));
    }
  };

  return (
    <>
      <Head>
        <title>牙科健康資訊 | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo提供各種牙科健康資訊，了解口腔護理常識、牙齒保健方法和牙科治療資訊" />
        <meta property="og:title" content="牙科健康資訊 | 牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo提供各種牙科健康資訊，了解口腔護理常識、牙齒保健方法和牙科治療資訊" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">牙科健康資訊</h1>
          
          {/* 標籤過濾器 */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* 文章列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <div key={article.slug} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                <Link href={`/articles/${article.slug}`} legacyBehavior>
                  <a className="block p-5">
                    <h2 className="text-xl font-semibold mb-2 text-orange-400">{article.title}</h2>
                    <p className="text-gray-300 mb-4 line-clamp-3">{article.summary}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 2 && <span className="text-gray-400 text-xs">+{article.tags.length - 2}</span>}
                      </div>
                      <time className="text-gray-400 text-sm">
                        {new Date(article.publishedAt).toLocaleDateString('zh-HK')}
                      </time>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-400">沒有找到相關的文章</h3>
              <button 
                onClick={() => {
                  setSelectedTag(null);
                  setFilteredArticles(articles);
                }}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                顯示所有文章
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const files = fs.readdirSync(articlesDir);
  
  const articles = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const fileContent = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
      const article = JSON.parse(fileContent);
      return article;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  return {
    props: {
      articles,
    },
  };
};