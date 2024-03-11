import React from 'react';
import Card from '../Helpers/Card';
import { genresMapping, getCast, getCrew, getOmdbData, getTrailer } from '@/lib/moviesAndShowsHeleprs';

export default function Movie({ id, title, overview, release_date, vote_average, adult, poster_path, backdrop_path, runtime, onApiResponse, setPageLink, encryptionKey, tmdbApiKey, genre_ids, notionApiKey, moviesDatabaseId, omdbApiKeys }: {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    adult: boolean;
    poster_path: string;
    backdrop_path: string;
    runtime: number;
    onApiResponse: (error: string) => void;
    setPageLink: (pageLink: string) => void;
    encryptionKey: string;
    tmdbApiKey: string;
    genre_ids: number[];
    notionApiKey: string;
    moviesDatabaseId: any;
    omdbApiKeys: string[];
}) {
    const moviesAuthUrl = process.env.NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL as string;

    const handleAddToNotion = async () => {
        if (!notionApiKey || !moviesDatabaseId) {
            window.location.href = moviesAuthUrl;
        }
        onApiResponse('Adding movie to Notion...');

        const genres = [...genresMapping.genres.filter((genre: { id: number; }) => genre_ids.includes(genre.id)).map((genre: { name: any; }) => ({ name: genre.name }))];

        const cast = await getCast({ id, tmdbApiKey, type: 'movie'});
        const defaultDate = "2000-01-01";
        const rounded_vote_average = Math.round(vote_average * 10) / 10;
        const tmdb_link = `https://www.themoviedb.org/movie/${id}`;
        const crew = await getCrew({ id, tmdbApiKey, type: 'movie'});
        const trailer = await getTrailer({ id, tmdbApiKey, type: 'movie'});
        const {
            imdbLink,
            rated,
            runtime,
            awards,
            imdbRating,
            rottenTomatoesRating,
            boxOffice
        } = await getOmdbData(omdbApiKeys, title, release_date.split('-')[0], 'movie');

        const movieData = {
            id: id,
            title: title,
            overview: overview,
            genres: genres,
            cast: cast,
            release_date: release_date || defaultDate,
            vote_average: rounded_vote_average,
            imdbRating: imdbRating,
            rottenTomatoesRating: rottenTomatoesRating,
            adult: adult,
            runtime: runtime,
            rated: rated,
            awards: awards,
            boxOffice: boxOffice,
            tmdb_link: tmdb_link,
            imdb_link: imdbLink,
            crew: crew,
            trailer: trailer,
            poster_path: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null,
            backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
        };

        const notionResponse = await fetch('/api/addMovieToNotion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notionApiKey,
                db_id: moviesDatabaseId,
                movieData: movieData,
            }),
        });


        if (notionResponse.ok) {
            const notionResult = await notionResponse.json();
            onApiResponse('Added movie to Notion');
            setPageLink(notionResult.pageUrl);
        }
        else {
            onApiResponse('Error adding movie to Notion');
        }
    };

    return (
        <Card
            id={id}
            title={title}
            poster_path={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null}
            release_date={release_date}
            link={`https://www.themoviedb.org/movie/${id}`}
            handleAddToNotion={handleAddToNotion}
        />
    );
};