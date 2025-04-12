import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import '../index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Google AdSense 驗證程式碼 - 使用 next/script 而不是在 head 中添加 */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8354007400602759"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}