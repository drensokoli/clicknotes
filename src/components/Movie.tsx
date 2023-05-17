import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';

interface MovieProps {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  adult: boolean;
  poster_path: string;
  backdrop_path: string;
  onClick: () => void;
  onApiResponse: (error: string) => void;
}

const Movie: React.FC<MovieProps> = ({ id, title, overview, release_date, vote_average, adult, poster_path, backdrop_path, onClick, onApiResponse }) => {

  const { data: session } = useSession();
  const [genres, setGenres] = useState<string[]>([]);
  const [imdbId, setImdbId] = useState<string>('');

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const movieDetails = await response.json();
      const genres = movieDetails.genres.map((genre: { name: any; }) => genre.name);
      const imdb_id = movieDetails.imdb_id;
      setImdbId(imdb_id);
      setGenres(genres);
    };

    fetchGenres();
  }, [id]);

  const handleAddToNotion = async () => {
    try {
    onApiResponse('Adding movie to Notion...');
    const response = await fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: session?.user?.email }),
    });

    const user = await response.json();
    const rounded_vote_average = Math.round(vote_average * 10) / 10;
    const tmdb_link = `https://www.themoviedb.org/movie/${id}`;
    const imdb_link = `https://www.imdb.com/title/${imdbId}`;

    const movieData = {
      id: id,
      title: title,
      overview: overview,
      firstGenre: genres[0],
      secondGenre: genres[1],
      thirdGenre: genres[2],
      release_date: release_date,
      vote_average: rounded_vote_average,
      adult: adult,
      tmdb_link: tmdb_link,
      imdb_link: imdb_link,
      poster_path: `https://image.tmdb.org/t/p/w500${poster_path}`,
      backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
    };

    const notionResponse = await fetch('/api/addMovieToNotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notionApiKey: decryptData(user.notionApiKey),
        db_id: decryptData(user.moviesPageLink),
        movieData: movieData,
      }),
    });
  
    if (notionResponse.ok) {
      const notionResult = await notionResponse.json();
      onApiResponse('Added movie to Notion');
      console.log(notionResult);
    } else {
      onApiResponse('Error adding movie to Notion');
    }
  } catch (error) {
    console.error(error);
    onApiResponse('Error adding movie to Notion');
  }
  };


  return (
    <div key={id} className="movie-card">
      <div className="movie-card-image-container">

        {poster_path ? (
          <div className='movie-image'>

            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`} height={300} width={200}
              alt={title}
              className="h-[300px] rounded-sm"
            />

            {!session ? (

              <button type="button"
                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => signIn()}
              >
                Add to Notion
              </button>
            )
              : (
                <button type="button"
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={handleAddToNotion}
                >
                  Add to Notion
                </button>
              )
            }
            <Image src="/share.png" className="arrows" alt=""
              onClick={onClick} width={30} height={30} />

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

              <button type="button"
                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => signIn()}
              >
                Add to Notion
              </button>
            )
              : (
                <button type="button"
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={handleAddToNotion}
                  >
                  Add to Notion
                </button>
              )
            }
            <Image src="/share-black.png" className="arrows" alt="" width={30} height={30}
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
