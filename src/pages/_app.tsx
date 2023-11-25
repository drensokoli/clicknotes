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
      <div className='flex flex-row justify-center items-center pb-8'>
        {router.pathname === '/movies' ? (
          <Link
            href="/help" >
            <Image src="/connectmovies.png" alt="Movies Logo" width={250} height={250}
            // className='py-2 px-6 shadow-2xl rounded-lg'
            />
          </Link>
        ) : router.pathname === '/tvshows' ? (
          <Link
            href="/help" >
            <Image src="/connecttvshows.png" alt="TV Shows Logo" width={250} height={250}
            // className='py-2 px-6 shadow-2xl rounded-lg'
            />
          </Link>
        ) : router.pathname === '/books' ? (
          <Link
            href="/help" >
            <Image src="/connectbooks.png" alt="Books Logo" width={250} height={250}
            // className='py-2 px-6 shadow-2xl rounded-lg'
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
