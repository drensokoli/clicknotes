import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';
import Link from 'next/link';
import { genresMapping, getCast, getDirector, getImdb, getTrailer } from '@/lib/movieHelpers';


export default function Movie
    (
        {
            id,
            title,
            overview,
            release_date,
            vote_average,
            adult,
            poster_path,
            backdrop_path,
            runtime,
            onApiResponse,
            cryptoKey,
            tmdbApiKey,
            genre_ids,
            notionApiKey,
            moviesPageLink
        }: {
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
            cryptoKey: string;
            tmdbApiKey: string;
            genre_ids: number[];
            notionApiKey: string;
            moviesPageLink: string;
        }
    ) {

        const { data: session } = useSession();


        const handleAddToNotion = async () => {
            try {

                console.log("sssssss", genre_ids);
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
                    genres: genres || [],
                    cast: cast,
                    release_date: release_date || defaultDate,
                    vote_average: rounded_vote_average,
                    adult: adult,
                    runtime: runtime,
                    tmdb_link: tmdb_link,
                    imdb_link: imdb_link,
                    director: director || "[Missing]",
                    trailer: trailer || '',
                    poster_path: `https://image.tmdb.org/t/p/w500${poster_path}`,
                    backdrop_path: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
                };

                const notionResponse = await fetch('/api/addMovieToNotion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notionApiKey: decryptData(notionApiKey, cryptoKey),
                        db_id: decryptData(moviesPageLink, cryptoKey),
                        movieData: movieData,
                    }),
                });


                if (notionResponse.ok) {
                    const notionResult = await notionResponse.json();
                    onApiResponse('Added movie to Notion');
                    console.log(notionResult);
                }
                else {
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
                    <div className='movie-image'>
                        {poster_path ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${poster_path}`} height={300} width={200}
                                alt={title}
                                className="h-[300px] rounded-sm"
                            />
                        ) : (
                            <div className="w-[200px] h-[300px]"></div>
                        )}

                        <Link href={`https://www.themoviedb.org/movie/${id}`} passHref target='_blank'>
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

                    <h2 className="text-l font-bold text-center text-gray-800">
                        <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
                    </h2>

                </div>
            </div>
        );
    };