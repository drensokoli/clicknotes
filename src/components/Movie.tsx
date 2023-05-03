import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface MovieProps {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  onClick: () => void;
}

const Movie: React.FC<MovieProps> = ({ id, title, release_date, poster_path, onClick }) => {

  const { data: session } = useSession();

  return (
    <div key={id} className="movie-card">
      <div className="movie-card-image-container">

        {poster_path ? (
          <div className='movie-image'>

            <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              className="h-[300px] rounded-sm"
            />

            {!session ? (
              <a href='/signin'>

                <button type="button"
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={() => signIn()}
                  >
                  Add to Notion
                </button>
              </a>
            )
              : (
                <button type="button"
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                  Add to Notion
                </button>
              )
            }
            <img src="/share.png" className="arrows" alt=""
              onClick={onClick} />

          </div>
        ) : (
          <div className='movie-image'>
            <div className="bg-transparent backdrop-blur-sm"
              style={{
                width: '200px',
                height: '300px',
                borderRadius: '5px'
              }}
              onClick={onClick}
            ></div>

            {!session ? (
              <a href='/tvshows'>

                <button type="button"
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={() => signIn()}
                  >
                  Add to Notion
                </button>
              </a>
            )
              : (
                <button type="button"
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                  Add to Notion
                </button>
              )
            }
            <img src="/share-black.png" className="arrows" alt=""
              onClick={onClick} />
          </div>
        )}
      </div>
      <h2 className="text-l font-bold text-center text-gray-800">
        <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
      </h2>
    </div>
  );
};

export default Movie;
