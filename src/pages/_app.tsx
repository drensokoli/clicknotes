import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { NextRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import Image from 'next/image';
import NotionBanner from '@/components/Notion/NotionBanner';
import Head from 'next/head';

interface WrappedAppProps extends Omit<AppProps, 'router'> {
  router: NextRouter;
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <WrappedApp Component={Component} pageProps={pageProps} router={router} />
    </SessionProvider>
  );
}

function WrappedApp({ Component, pageProps, router }: WrappedAppProps) {

  const notionBanners = [
    { path: '/movies', image: '/connectmovies.png' },
    { path: '/tvshows', image: '/connecttvshows.png' },
    { path: '/books', image: '/connectbooks.png' },
  ];

  const banner = notionBanners.find((banner) => banner.path === router.pathname);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsSmallDevice(mediaQuery.matches);

    const mediaQueryListener = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
      setIsSmallDevice(event.matches);
    };

    mediaQuery.addListener(mediaQueryListener);

    return () => {
      mediaQuery.removeListener(mediaQueryListener);
    };
  }, []);

  return (
    <>

      <Head>
        <title>ClickNotes</title>
        <meta name="description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta name="robots" content="all"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Dren Sokoli" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.clicknotes.site" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta property="og:title" content="ClickNotes - Save your favorite content to Notion" />
        <meta property="og:description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta property="og:image" content="https://www.clicknotes.site/og/movies.png" />
        <meta property="og:url" content="https://www.clicknotes.site" />
        <meta property="og:site_name" content="ClickNotes" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SokoliDren" />
        <meta name="twitter:creator" content="@SokoliDren" />
        <meta name="twitter:title" content="ClickNotes - Save your favorite content to Notion" />
        <meta name="twitter:description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta name="twitter:image" content="https://www.clicknotes.site/og/movies.png" />
        <meta name="twitter:domain" content="www.clicknotes.site" />
        <meta name="twitter:url" content="https://www.clicknotes.site" />
      </Head>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <Component {...pageProps} />
        <Analytics />
        <Footer />

        <Link
          href="https://affiliate.notion.so/8ieljsf8weuq"
          target='_blank'
          aria-label='Notion affiliate link'
          className='fixed bottom-5 left-5 z-10 shadow-xl'
        >
          <Image
            src={isSmallDevice ? "/affiliate-white-sm.png" : "/affiliate-white.png"}
            alt="logo"
            width={130}
            height={130}
            className='h-[50px] w-auto cursor-pointer select-none'
          />
        </Link>

      </div>
    </>
  );
}