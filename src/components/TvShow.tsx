import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';
import Link from 'next/link';
import { fetchCast, fetchDirector, fetchGenres, fetchTrailer } from '@/lib/tvShowHelpers';

export default function TvShow({ id, name, overview, first_air_date, vote_average, poster_path, backdrop_path, onApiResponse, cryptoKey, tmdbApiKey, notionApiKey, tvShowsPageLink }: {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  onApiResponse: (error: string) => void;
  cryptoKey: string;
  tmdbApiKey: string;
  notionApiKey: string;
  tvShowsPageLink: string;
}) {

  const { data: session } = useSession();

  const handleAddToNotion = async () => {
    onApiResponse('Adding TV show to Notion...');

    const response = await fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: session?.user?.email }),
    });

    const user = await response.json();
    const rounded_vote_average = Math.round(vote_average * 10) / 10;
    const tmdb_link = `https://www.themoviedb.org/tv/${id}`;
    const defaultDate = "0001-01-01";
    const genres = await fetchGenres({ id, tmdbApiKey });
    const cast = await fetchCast({ id, tmdbApiKey });
    const director = await fetchDirector({ id, tmdbApiKey });
    const trailer = await fetchTrailer({ id, tmdbApiKey });

    const tvShowData = {
      id: id,
      name: name,
      overview: overview,
      genres: genres,
      cast: cast,
      first_air_date: first_air_date || defaultDate,
      trailer: trailer,
      director: director || '[Missing]',
      vote_average: rounded_vote_average,
      tmdb_link: tmdb_link,
      poster_path: `https://image.tmdb.org/t/p/w500${poster_path}`,
      backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
    };

    const notionResponse = await fetch('/api/addTvShowToNotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notionApiKey: decryptData(notionApiKey, cryptoKey),
        db_id: decryptData(tvShowsPageLink, cryptoKey),
        tvShowData: tvShowData,
      }),
    });

    if (notionResponse.ok) {
      const notionResult = await notionResponse.json();
      onApiResponse('Added TV show to Notion');
      console.log(notionResult);
    } else {
      onApiResponse('Error adding TV show to Notion');
    }
  };


  return (
    <div key={id} className="movie-card">
      <div className="movie-card-image-container">

        <div className='movie-image'>
          {poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`} height={300} width={200}
              alt={name}
              className="h-[300px] rounded-sm"
            />
          ) : (
            <div className="w-[200px] h-[300px]"></div>
          )}
          <Link href={`https://www.themoviedb.org/tv/${id}`} passHref target='_blank'>
            <Image
              src="/share-black.png"
              className="arrows"
              alt=""
              width={30}
              height={30} />
          </Link>
          <button type="button"
            className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => {
              session ? handleAddToNotion() : signIn('google')
            }}
          >
            Add to Notion
          </button>
        </div>
      </div>

      <h2 className="text-l font-bold text-center text-gray-800">
        <span>{name}</span>
      </h2>

    </div>
  );
};
