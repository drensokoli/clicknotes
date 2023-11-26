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
  const { data: session } = useSession();

  return (
    <div>
      <Navbar />
      <div>
        <Link href="https://affiliate.notion.so/8ieljsf8weuq" target='_blank' aria-label='Notion'>
          <Image src="/affiliate-white.png" alt="logo" width={130} height={130} className='fixed bottom-5 right-5 z-10 shadow-xl' />
        </Link>
      </div>
      <div className='flex flex-row justify-center items-center pb-8'>
        {router.pathname === '/movies' ? (
          <Link
            href="/help" >
            <Image src="/connectmovies.png" alt="Connect Movies" width={250} height={250}
            className='py-2 px-6 hover:shadow-2xl shadow-lg rounded-lg'
            />
          </Link>
        ) : router.pathname === '/tvshows' ? (
          <Link
            href="/help" >
            <Image src="/connecttvshows.png" alt="Connect TVShows" width={250} height={250}
            className='py-2 px-6 hover:shadow-2xl shadow-lg rounded-lg'
            />
          </Link>
        ) : router.pathname === '/books' ? (
          <Link
            href="/help" >
            <Image src="/connectbooks.png" alt="Connect Books" width={250} height={250}
            className='py-2 px-6 hover:shadow-2xl shadow-lg rounded-lg'
            />
          </Link>
        ) : null
        }
      </div>
      <Component {...pageProps} />
      <Analytics />
      <Footer />
    </div>
  );
}
