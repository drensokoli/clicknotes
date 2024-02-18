import { Html, Head, Main, NextScript } from 'next/document'
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { Metadata } from 'next';

export default function Document({ }: any) {
  return (
    <Html lang="en">
      <title>ClickNotes</title>
      <meta name="ClickNotes" content="Keeping track of your favourite movies, made easier" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta property="og:title" content="ClickNotes - Save your media content to Notion" />
      <meta property="og:description" content="Save popular and trending media content to your Notion list or search for your favorites. All your media content in one place, displayed in a beautiful Notion template." />
      <meta property="og:image" content="https://www.clicknotes.site/og/movies.png" />
      <meta property="og:url" content="https://clicknotes.site/" />
      <meta property="og:site_name" content="ClickNotes" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@drensokoli" />
      <meta name="twitter:creator" content="@drensokoli" />
      <meta name="twitter:title" content="ClickNotes - Save your media content to Notion" />
      <meta name="twitter:description" content="Save popular and trending media content to your Notion list or search for your favorites. All your media content in one place, displayed in a beautiful Notion template." />
      <meta name="twitter:image" content="https://www.clicknotes.site/og/movies.png" />
      <meta name="twitter:domain" content="clicknotes.site" />
      <meta name="twitter:url" content="https://clicknotes.site/" />
      <Head />
      <body>
        <Main />
        <NextScript />
        <Analytics />
      </body>
    </Html>
  )
}
