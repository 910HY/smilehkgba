import Head from 'next/head';
import '../src/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>牙GoGo — 至關心你啲牙既牙科資訊平台</title>
        <meta name="description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yagogo.vercel.app" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}