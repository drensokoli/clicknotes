import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/movies');
  }, []);

  return (

    <Head>
      <title>ClickNotes</title>
      <meta name="description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your media in one place, displayed in beautiful Notion templates." />
      <meta name="robots" content="all"></meta>
      <meta property="og:title" content="ClickNotes" />
      <meta property="og:description" content="Save popular and trending movies, TV shows and books to your Notion list or search for your favourites. All your media in one place, displayed in beautiful Notion templates." />
      <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="Dren Sokoli" />
      <link rel="icon" href="/favicon.ico" />
      {/* <link rel="canonical" href="https://clicknotes.site/movies" /> */}
    </Head>
  )
};

export default IndexPage;
