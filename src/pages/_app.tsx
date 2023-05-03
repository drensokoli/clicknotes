import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import Navbar from '@/components/Navbar';
import Example from '@/components/Example';
import Footer from '@/components/Footer';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      {/* <Navbar /> */}
      <Example />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
}
