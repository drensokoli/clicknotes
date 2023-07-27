import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { decryptData } from '@/lib/crypto';

const Saved: React.FC = () => {
  const { data: session } = useSession();
  const [pageTitles, setPageTitles] = useState<string[]>([]);

//   useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/getUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session?.user?.email }),
      });

      const user = await response.json();
      const notionApiKey = decryptData(user.notionApiKey);
      const databaseId = decryptData(user.moviesPageLink);

      const pagesResponse = await fetch('/api/getNotionMovies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notionApiKey, databaseId }),
      });

      const data = await pagesResponse.json();
      setPageTitles(data.pageTitles)
    }
    fetchUser();
//   }, []);
console.log(pageTitles)

  return (
      <>
          <div>
              <h1>Saved</h1>
              <p>Here are the movies you've saved to Notion.</p>
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
