import Head from 'next/head';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '600', '800', '900'],
  style: ['normal'],
  subsets: ['latin'],
});

<style jsx global>{`
  html {
    font-family: ${inter.style.fontFamily};
  }
`}</style>

import '@/styles/globals.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Image Performance</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
