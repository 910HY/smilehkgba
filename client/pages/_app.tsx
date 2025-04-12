import Head from 'next/head';
import '../../index.css';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>牙GoGo — 至關心你啲牙既牙科資訊平台</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}