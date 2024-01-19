import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { NextRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import Image from 'next/image';
import NotionBanner from '@/components/Notion/NotionBanner';
import { Metadata } from 'next';

interface WrappedAppProps extends Omit<AppProps, 'router'> {
  router: NextRouter;
}

export const metadata: Metadata = {
  title: "PWA with Next 13",
  description: "PWA application with Next 13",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "Dren Sokoli" },
    {
      name: "Dren Sokoli",
      url: "https://www.linkedin.com/in/dren-sokoli-0003a81a1/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

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

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      {banner && (
        <NotionBanner image={banner.image} />
      )}

      <Component {...pageProps} />
      <Analytics />
      <Footer />

      <Link
        href="https://affiliate.notion.so/8ieljsf8weuq"
        target='_blank'
        aria-label='Notion affiliate link'
        className='fixed bottom-5 right-5 z-10 shadow-xl'
      >
        <Image src="/affiliate-white.png" alt="logo" width={130} height={130} />
      </Link>

    </div>
  );
}
