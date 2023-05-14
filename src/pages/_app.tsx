import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NextRouter } from 'next/router';

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

  const notionConnection = async () => {
    const response = await fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: session?.user?.email }),
    });

    const user = await response.json();

    if (
      !user?.notionApiKey ||
      (!user?.moviesPageLink && !user?.tvShowsPageLink && !user?.booksPageLink)
    ) {
      setShowInfoBubble(true);
    } else {
      setShowInfoBubble(false);
    }
  };

  useEffect(() => {
    if (session) {
      notionConnection();
    }
  }, [session]);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      {!session && (
        <div className="info-bubble sm:w-[300px] w-[230px]">
          <div
            className="info-bubble__close"
            onClick={() => setShowInfoBubble(false)}
          >
            &times;
          </div>
          Need Help connecting?{" "}
          <a href="/help" target="_blank">
            <span className="text-blue-500"
              onClick={() => setShowInfoBubble(false)}
            >Click here</span>
          </a>
        </div>
      )}
      {showInfoBubble && router.pathname !== '/help' && (
        <div className="info-bubble sm:w-[300px] w-[230px]">
          <div
            className="info-bubble__close"
            onClick={() => setShowInfoBubble(false)}
          >
            &times;
          </div>
          Need Help connecting?{" "}
          <a href="/help" target="_blank">
            <span className="text-blue-500"
              onClick={() => setShowInfoBubble(false)}
            >Click here</span>
          </a>
        </div>
      )}
      <Footer />
    </>
  );
}
