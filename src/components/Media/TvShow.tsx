import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/encryption';
import Link from 'next/link';
import { fetchCast, fetchCrew, fetchGenres, fetchOmdbData, fetchTrailer } from '@/lib/tvShowHelpers';
import Card from '../Helpers/Card';

export default function TvShow({ id, name, overview, first_air_date, vote_average, poster_path, backdrop_path, onApiResponse, setPageLink, encryptionKey, tmdbApiKey, notionApiKey, tvShowsDatabaseId, omdbApiKeys }: {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  onApiResponse: (error: string) => void;
  setPageLink: (pageLink: string) => void;
  encryptionKey: string;
  tmdbApiKey: string;
  notionApiKey: string;
  tvShowsDatabaseId: any;
  omdbApiKeys: string[];
}) {

  const moviesAuthUrl = process.env.NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL as string;

  const handleAddToNotion = async () => {
    if (!notionApiKey || !tvShowsDatabaseId) {
      window.location.href = moviesAuthUrl;
    }
    onApiResponse('Adding TV show to Notion...');

    const rounded_vote_average = Math.round(vote_average * 10) / 10;
    const tmdb_link = `https://www.themoviedb.org/tv/${id}`;
    const defaultDate = "2000-01-01";
    const genres = await fetchGenres({ id, tmdbApiKey });
    const cast = await fetchCast({ id, tmdbApiKey });
    const crew = await fetchCrew({ id, tmdbApiKey });
    const trailer = await fetchTrailer({ id, tmdbApiKey });
    const year = first_air_date.split('-')[0];
    const {
      imdbLink,
      rated,
      runtime,
      awards,
      imdbRating,
      rottenTomatoesRating,
      boxOffice,
      seasons
    } = await fetchOmdbData(omdbApiKeys, name, year);

    const tvShowData = {
      id: id,
      name: name,
      overview: overview,
      genres: genres,
      cast: cast,
      release_date: first_air_date || defaultDate,
      trailer: trailer,
      crew: crew,
      vote_average: rounded_vote_average,
      tmdb_link: tmdb_link,
      imdb_link: imdbLink,
      poster_path: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null,
      backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
      rated: rated,
      runtime: runtime,
      awards: awards,
      imdbRating: imdbRating,
      rottenTomatoesRating: rottenTomatoesRating,
      boxOffice: boxOffice,
      seasons: seasons
    };

    const notionResponse = await fetch('/api/addTvShowToNotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notionApiKey,
        db_id: tvShowsDatabaseId,
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
      release_date={first_air_date}
      link={`https://www.themoviedb.org/tv/${id}`}
      handleAddToNotion={handleAddToNotion}
    />
  );
};
