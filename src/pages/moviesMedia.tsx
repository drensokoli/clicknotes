import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import NotionAd from '@/components/NotionAd';
import MediaCard from '@/components/MediaCard';
import { useSession } from 'next-auth/react';
import { searchMovieByTitle } from '@/lib/movieFunctions';

interface MovieMedia {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
}

export default function MoviesMedia
    ({
        tmdbApiKey,
        cryptoKey,
        popularMovies
    }: {
        tmdbApiKey: string;
        cryptoKey: string;
        popularMovies: MovieMedia[];
    }) {

    const { data: session } = useSession();

    const [input, setInput] = useState('');
    const [movies, setMovies] = useState<MovieMedia[]>([]);
    const [notionApiKey, setNotionApiKey] = useState('');
    const [moviesPageLink, setMoviesPageLink] = useState('');
    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        searchMovieByTitle({ title: event.target.value, tmdbApiKey: tmdbApiKey })
            .then(movies => {
                if (movies) {
                    setMovies(movies);
                }
            })
            .catch(error => console.error(error));
    };

    const fetchUser = async () => {

        const response = await fetch('/api/getUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: session?.user?.email }),
        });

        const user = await response.json();

        setNotionApiKey(user.notionApiKey);
        setMoviesPageLink(user.moviesPageLink);
    };

    useEffect(() => {
        if (apiResponse !== 'Adding movie to Notion...') {
            const timer = setTimeout(() => {
                setApiResponse(null);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [apiResponse]);

    useEffect(() => {
        if (session && !sessionStorage.getItem('userId') && !sessionStorage.getItem('notionApiKey') && !sessionStorage.getItem('moviesPageLink') && !sessionStorage.getItem('tvShowsPageLink') && !sessionStorage.getItem('booksPageLink')) {
            fetchUser();
        }
    }, [session]);


    return (
        <>
            {apiResponse === 'Added movie to Notion' ? (
                <div className="success-message">
                    <p>{apiResponse}</p>
                </div>
            ) : apiResponse === 'Error adding movie to Notion' ? (
                <div className="error-message">
                    <p>{apiResponse}</p>
                    Need <a href="/help" target="_blank">
                        <span className="text-blue-500">help</span>?
                    </a>
                </div>
            ) : apiResponse === 'Adding movie to Notion...' ? (
                <div className="loading-message">
                    <p>{apiResponse}</p>
                </div>
            ) : null}

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <NotionAd path={"movies"} />
                    <div className="movie-container">
                        {movies
                            .map((item) => (
                                <MediaCard
                                    runtime={0}
                                    adult={false}
                                    backdrop_path={''}
                                    key={item.id} 
                                    {...item}
                                    onApiResponse={(error: string) => setApiResponse(error)}
                                    tmdbApiKey={tmdbApiKey}
                                    cryptoKey={cryptoKey}
                                    genre_ids={item.genre_ids}
                                    notionApiKey={notionApiKey}
                                    moviesPageLink={moviesPageLink}
                                />
                            ))}
                    </div>
                    {movies.length === 0 && (
                        <>
                            <div className="movie-container">
                                {popularMovies
                                    .filter((item) => item.vote_average > 6)
                                    .map((item) => (
                                        <MediaCard
                                            runtime={0}
                                            adult={false}
                                            backdrop_path={''}
                                            key={item.id} {...item}
                                            onApiResponse={(error: string) => setApiResponse(error)}
                                            tmdbApiKey={tmdbApiKey}
                                            cryptoKey={cryptoKey}
                                            genre_ids={item.genre_ids}
                                            notionApiKey={notionApiKey}
                                            moviesPageLink={moviesPageLink}
                                        />
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );


};

export const getStaticProps = async () => {

    const cryptoKey = process.env.CRYPTO_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    try {
        const popularMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1&include_adult=false`);
        const popularMovies = popularMoviesResponse.data.results;

        return {
            props: {
                tmdbApiKey,
                cryptoKey,
                popularMovies
            },

            revalidate: 60 * 60 * 24 // 24 hours
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                tmdbApiKey,
                cryptoKey,
                popularMovies: []
            },
            revalidate: 60 * 60 * 24 // 24 hours
        };
    }
}
