import { useEffect, useState } from 'react';
import Movie from '@/components/Movie';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Movies: React.FC = () => {

    const [input, setInput] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchMovieByTitle(event.target.value);
    };

    const searchMovieByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}&language=en-US&page=1&include_adult=false`);
            setMovies(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMovieClick = async (movieId: number) => {
        try {
            window.open(`https://www.themoviedb.org/movie/${movieId}`, '_blank');
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`);
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
            }, 3000);

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
            ) : apiResponse === 'Adding movie to Notion...' ?(
                <div className="loading-message">
                    <p>{apiResponse}</p>
                </div>
            ) : null}

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        {movies.map((item) => (
                            <Movie runtime={0} adult={false} backdrop_path={''} key={item.id} {...item} onClick={() => handleMovieClick(item.id)} onApiResponse={(error: string) => setApiResponse(error)}                            />
                        ))}
                    </div>
                    {movies.length === 0 && (
                        <>
                            <div className='movie-container'>
                                <h1 className='text-2xl pb-4'>POPULAR</h1>
                            </div>
                            <div className="movie-container">
                                {popularMovies.map((item) => (
                                    <Movie runtime={0} adult={false} backdrop_path={''} key={item.id} {...item} onClick={() => handleMovieClick(item.id)} onApiResponse={(error: string) => setApiResponse(error)}                                    />
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
