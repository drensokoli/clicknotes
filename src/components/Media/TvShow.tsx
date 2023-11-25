import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';
import Link from 'next/link';
import { fetchCast, fetchDirector, fetchGenres, fetchTrailer } from '@/lib/tvShowHelpers';
import Card from '../Helpers/Card';

export default function TvShow({ id, name, overview, first_air_date, vote_average, poster_path, backdrop_path, onApiResponse, setPageLink, cryptoKey, tmdbApiKey, notionApiKey, tvShowsPageLink }: {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  onApiResponse: (error: string) => void;
  setPageLink: (pageLink: string) => void;
  cryptoKey: string;
  tmdbApiKey: string;
  notionApiKey: string;
  tvShowsPageLink: string;
}) {

  const { data: session } = useSession();

  const handleAddToNotion = async () => {
    onApiResponse('Adding TV show to Notion...');

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
      poster_path: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null,
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
      setPageLink(notionResult.pageUrl);
    } else {
      onApiResponse('Error adding TV show to Notion');
    }
  };


  return (
    <Card
      id={id}
      title={name}
      poster_path={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null}
      release_date={''}
      link={`https://www.themoviedb.org/tv/${id}`}
      handleAddToNotion={handleAddToNotion}
    />
  );
};
