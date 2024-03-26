import { Html, Head, Main, NextScript } from 'next/document'
import { Analytics } from '@vercel/analytics/react';
import MicrosoftClarity from '@/metrics/MicrosoftClarity';
import Script from 'next/script';

export default function Document({ }: any) {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta name="robots" content="all"></meta>
        <meta property="og:title" content="ClickNotes" />
        <meta property="og:description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
        <meta name="author" content="Dren Sokoli" />
        <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
        <meta property="og:title" content="ClickNotes - Save your favorite content to Notion" />
        <meta property="og:description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta property="og:image" content="https://www.clicknotes.site/og/movies.png" />
        <meta property="og:url" content="https://clicknotes.site" />
        <meta property="og:site_name" content="ClickNotes" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SokoliDren" />
        <meta name="twitter:creator" content="@SokoliDren" />
        <meta name="twitter:title" content="ClickNotes - Save your movies to Notion" />
        <meta name="twitter:description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your content in one place, displayed in a beautiful Notion template." />
        <meta name="twitter:image" content="https://www.clicknotes.site/og/movies.png" />
        <meta name="twitter:domain" content="www.clicknotes.site" />
        <meta name="twitter:url" content="https://clicknotes.site" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://clicknotes.site" />
        <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="drenso" data-description="Support me on Buy me a coffee!" data-message="" data-color="#FF813F" data-position="Right" data-x_margin="18" data-y_margin="18" defer></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <MicrosoftClarity />
        <Analytics />
      </body>
    </Html>
  )
}
