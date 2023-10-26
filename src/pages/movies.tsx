import { useEffect, useState } from 'react';
import Movie from '@/components/Movie';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import NotionAd from '@/components/NotionAd';

interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
}

interface Props {
    tmdbApiKey: string;
    cryptoKey: string;
}

const Movies: React.FC<Props> = ({ tmdbApiKey, cryptoKey }) => {

    const [input, setInput] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const adultContent = ["sex", "porn", "nude", "sadomasochistic", "pussy", "vagina", "erotic", "lust", "softcore", "hardcore", "beautiful sisters: strip!"]

    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        searchMovieByTitle(event.target.value);
    };

    const searchMovieByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${title}&language=en-US&page=1&include_adult=false`);

            const movieIds = response.data.results.map((movie: { id: any; }) => movie.id);

            const movies = [];
            for (let id of movieIds) {
                const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&append_to_response=keywords`);

                const keywords = movieResponse.data.keywords.keywords.map((keyword: { name: any; }) => keyword.name);

                if (!keywords.some((keyword: string) => adultContent.includes(keyword))) {
                    movies.push(movieResponse.data);
                }
            }

            setMovies(movies);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1&include_adult=false`);
                setPopularMovies(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPopularMovies();
    }, []);

    useEffect(() => {
        if (apiResponse !== 'Adding movie to Notion...') {
            const timer = setTimeout(() => {
                setApiResponse(null);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [apiResponse]);


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
                            .filter((item) => item.vote_average > 6)
                            .filter((item) => !adultContent.some((word) => item.title.toLowerCase().includes(word)))
                            .filter((item) => !adultContent.some((word) => item.original_title.toLowerCase().includes(word)))
                            .filter((item) => !adultContent.some((word) => item.overview.toLowerCase().includes(word)))
                            .map((item) => (
                                <Movie runtime={0} adult={false} backdrop_path={''} key={item.id} {...item} onApiResponse={(error: string) => setApiResponse(error)} tmdbApiKey={tmdbApiKey} cryptoKey={cryptoKey} />
                            ))}
                    </div>
                    {movies.length === 0 && (
                        <>
                            <div className="movie-container">
                                {popularMovies
                                    .filter((item) => item.vote_average > 6)
                                    .map((item) => (
                                        <Movie runtime={0} adult={false} backdrop_path={''} key={item.id} {...item} onApiResponse={(error: string) => setApiResponse(error)} tmdbApiKey={tmdbApiKey} cryptoKey={cryptoKey} />
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );


};

export default Movies;

export const getServerSideProps = async () => {

    const cryptoKey = process.env.CRYPTO_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    return {
        props: {
            tmdbApiKey,
            cryptoKey,
        },
    };
}