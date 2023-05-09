import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';

interface TvShowProps {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  onClick: () => void;
}

const TvShow: React.FC<TvShowProps> = ({ id, name, overview, first_air_date, vote_average, poster_path, backdrop_path, onClick }) => {

  const { data: session } = useSession();
  const [genres, setGenres] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const movieDetails = await response.json();
      const genres = movieDetails.genres.map((genre: { name: any; }) => genre.name);
      setGenres(genres);
    };

    fetchGenres();
  }, [id]);
  

  const handleAddToNotion = async () => {
    const response = await fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: session?.user?.email }),
    });
  
    const user = await response.json();
    const rounded_vote_average = Math.round(vote_average * 10) / 10;
    const tmdb_link = `https://www.themoviedb.org/tv/${id}`;

    const tvShowData = {
      id: id,
      name: name,
      overview: overview,
      firstGenre: genres[0],
      secondGenre: genres[1],
      thirdGenre: genres[2],
      first_air_date: first_air_date,
      vote_average: rounded_vote_average,
      tmdb_link: tmdb_link,
      poster_path: `https://image.tmdb.org/t/p/w500${poster_path}`,
      backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
    };
  
    const notionResponse = await fetch('/api/addTvShowToNotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notionApiKey: user.notionApiKey,
        db_id: user.moviesPageLink,
        tvShowData: tvShowData,
      }),
    });
  
    const notionResult = await notionResponse.json();
    console.log(notionResult);
  };
  
  
  return (
    <div key={id} className="movie-card">
      <div className="movie-card-image-container">

        {poster_path ? (
          <div className='movie-image'>

            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`} height={300} width={200}
              alt={name}
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
                  className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
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
        <span>{name}</span>
      </h2>

    </div>
  );
};

export default TvShow;
