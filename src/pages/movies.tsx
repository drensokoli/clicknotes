import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import NotionAd from '@/components/NotionAd';
import Movie from '@/components/Movie';
import { useSession } from 'next-auth/react';
import { searchMovieByTitle } from '@/lib/movieHelpers';
import NotionResponse from '@/components/NotionResponse';

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

export default function Movies({ tmdbApiKey, cryptoKey, popularMovies }: {
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
        console.log(movies)
    };

    useEffect(() => {
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
        fetchUser();
    }, [session]);

    return (
        <>
            <NotionResponse apiResponse={apiResponse} setApiResponse={setApiResponse} />

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <NotionAd path={"movies"} />
                    <div className="movie-container">
                        {movies
                            .map((item) => (
                                <Movie
                                    {...item}
                                    key={item.id}
                                    runtime={0}
                                    adult={false}
                                    backdrop_path={''}
                                    onApiResponse={(error: string) => setApiResponse(error)}
                                    tmdbApiKey={tmdbApiKey}
                                    cryptoKey={cryptoKey}
                                    notionApiKey={notionApiKey}
                                    moviesPageLink={moviesPageLink}
                                />
                            ))}
                    </div>
                    {movies.length === 0 && (
                        <div className="movie-container">
                            {popularMovies
                                .filter((item) => item.vote_average > 6)
                                .map((item) => (
                                    <Movie
                                        {...item}
                                        key={item.id}
                                        runtime={0}
                                        adult={false}
                                        backdrop_path={''}
                                        onApiResponse={(error: string) => setApiResponse(error)}
                                        tmdbApiKey={tmdbApiKey}
                                        cryptoKey={cryptoKey}
                                        notionApiKey={notionApiKey}
                                        moviesPageLink={moviesPageLink}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );


};

export const getStaticProps = async () => {

    const cryptoKey = process.env.CRYPTO_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    const popularMoviesResponsePageOne = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1&include_adult=false`);
    const popularMoviesResponsePageTwo = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=2&include_adult=false`);
    const popularMoviesResponsePageThree = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=3&include_adult=false`);
    const popularMoviesResponsePageFour = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=4&include_adult=false`);

    const popularMoviesResponse = {
        data: {
            results: [
                ...popularMoviesResponsePageOne.data.results,
                ...popularMoviesResponsePageTwo.data.results,
                ...popularMoviesResponsePageThree.data.results,
                ...popularMoviesResponsePageFour.data.results
            ]
        }
    };

    const popularMovies = popularMoviesResponse.data.results;

    return {
        props: {
            tmdbApiKey,
            cryptoKey,
            popularMovies
        },

        revalidate: 60 * 60 * 24 // 24 hours
    };
}
