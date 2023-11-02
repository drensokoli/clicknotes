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
  const [showInfoBubble, setShowInfoBubble] = React.useState(false);

  useEffect(() => {
    if (session) {
      const getUser = async () => {
        const response = await fetch('/api/getUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: session?.user?.email }),
        });
        const user = await response.json();

        if (router.pathname === '/help' || router.pathname === '/auth/signin') {
          setShowInfoBubble(false);
        } else if (
          !session ||
          !user?.notionApiKey ||
          (!user?.moviesPageLink && !user?.tvShowsPageLink && !user?.booksPageLink)
        ) {
          setShowInfoBubble(true);
        } else {
          setShowInfoBubble(false);
        }
      };

      getUser();
    }
  }, [session, router.pathname]);


  return (
    <div>
      <Navbar />
      <Component {...pageProps} />
      {/* {showInfoBubble && (
        <div className="info-bubble sm:w-[300px] w-[230px]">
          <div
            className="info-bubble__close"
            onClick={() => setShowInfoBubble(false)}
          >
            &times;
          </div>
          Need help connecting your account to Notion?{" "}
          <Link href="/help" target="_blank" aria-label='Help page'>
            <span className="text-blue-500 font-bold cursor-pointer"
              onClick={() => setShowInfoBubble(false)}
            >Help Page</span>
          </Link>
        </div>
      )} */}
      <Analytics />
      <Footer />
    </div>
  );
}
