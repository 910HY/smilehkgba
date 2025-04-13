import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header from '@components/Header';
import Footer from '@components/Footer';

interface Article {
  title: string;
  content: string;
  tags?: string[];
  publishedAt?: string;
  summary?: string;
  sources?: Array<{title: string, url: string}>;
}

export default function ArticleDetailPage({ article }: { article: Article }) {
  return (
    <>
      <Head>
        <title>{article.title} | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content={article.summary || "牙GoGo提供各種牙科健康資訊，了解口腔護理常識和牙科治療資訊"} />
        <meta property="og:title" content={`${article.title} | 牙GoGo｜香港牙科資訊搜尋平台`} />
        <meta property="og:description" content={article.summary || "牙GoGo提供各種牙科健康資訊，了解口腔護理常識和牙科治療資訊"} />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-sm text-gray-500 mb-6">更新時間：{article.publishedAt}</p>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <span key={tag} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          
          {article.sources && article.sources.length > 0 && (
            <div className="mt-12 border-t border-gray-700 pt-4">
              <h3 className="text-xl font-semibold mb-2">資料來源</h3>
              <ul className="list-disc list-inside space-y-1">
                {article.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const files = fs.readdirSync(articlesDir);

  const paths = files
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      params: { slug: file.replace(/\.json$/, '') }
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.json`);
  const fileContents = fs.readFileSync(articlePath, 'utf-8');
  const article = JSON.parse(fileContents);

  return {
    props: {
      article,
    },
  };
};