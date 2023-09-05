import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { decryptData } from '@/lib/crypto';

const Saved: React.FC = () => {
  const { data: session } = useSession();
  const [pageTitles, setPageTitles] = useState<string[]>([]);
  const [notionApiKey, setNotionApiKey] = useState('');
  const [moviesPageLink, setMoviesPageLink] = useState('');
  const [tvShowsPageLink, setTvShowsPageLink] = useState('');
  const [booksPageLink, setBooksPageLink] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/getUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session?.user?.email }),
      });

      const user = await response.json();
      const decryptedNotionApiKey = decryptData(user.notionApiKey);
      const decryptedMoviesPageLink = decryptData(user.moviesPageLink);
      const decryptedTvShowsPageLink = decryptData(user.tvShowsPageLink);
      const decryptedBooksPageLink = decryptData(user.booksPageLink);

      setNotionApiKey(decryptedNotionApiKey);
      setMoviesPageLink(decryptedMoviesPageLink);
      setTvShowsPageLink(decryptedTvShowsPageLink);
      setBooksPageLink(decryptedBooksPageLink);
      
      console.log(decryptedNotionApiKey)
      console.log(decryptedMoviesPageLink)
      console.log(decryptedTvShowsPageLink)
      console.log(decryptedBooksPageLink)

      const pagesResponse = await fetch('/api/getNotionMovies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notionApiKey: decryptData(user.notionApiKey),
          databaseId: decryptData(user.moviesPageLink),
        }),
      });
      
      const data = await pagesResponse.json();
      console.log(data)
      setPageTitles(data.pageTitles)
    }
    if(session){
      fetchUser();
    }
  }, [session]);

  return (
      <>
          <div>
              <ul>
                {pageTitles.map((title, index) =>
                    <li key={index}>
                      {title}
                    </li>
                  )}
              </ul>
          </div>
      </>
  );
}

export default Saved;
