import React from 'react';
import { decryptData } from '@/lib/encryption';
import { genresMapping, getCast, getDirector, getImdb, getTrailer } from '@/lib/movieHelpers';
import Card from '../Helpers/Card';

export default function Movie({ id, title, overview, release_date, vote_average, adult, poster_path, backdrop_path, runtime, onApiResponse, setPageLink, encryptionKey, tmdbApiKey, genre_ids, notionApiKey, moviesPageLink }: {
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
    moviesPageLink: string;
}) {

    const handleAddToNotion = async () => {
        onApiResponse('Adding movie to Notion...');

        const genres = [...genresMapping.genres.filter((genre: { id: number; }) => genre_ids.includes(genre.id)).map((genre: { name: any; }) => ({ name: genre.name }))];
        const cast = await getCast({ id, tmdbApiKey });
        const defaultDate = "0001-01-01";
        const rounded_vote_average = Math.round(vote_average * 10) / 10;
        const tmdb_link = `https://www.themoviedb.org/movie/${id}`;
        const imdb_link = await getImdb({ id, tmdbApiKey });
        const director = await getDirector({ id, tmdbApiKey });
        const trailer = await getTrailer({ id, tmdbApiKey });

        const movieData = {
            id: id,
            title: title,
            overview: overview,
            genres: genres,
            cast: cast,
            release_date: release_date,
            vote_average: rounded_vote_average,
            adult: adult,
            runtime: runtime,
            tmdb_link: tmdb_link,
            imdb_link: imdb_link,
            director: director,
            trailer: trailer,
            poster_path: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null,
            backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
        };

        const notionResponse = await fetch('/api/addMovieToNotion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notionApiKey: decryptData(notionApiKey, encryptionKey),
                db_id: decryptData(moviesPageLink, encryptionKey),
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