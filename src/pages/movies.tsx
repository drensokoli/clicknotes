import { useEffect, useState } from 'react';
import Movie from '@/components/Movie';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';

interface Movie {
    id: number;
    title: string;
    name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Movies: React.FC = () => {

    const [input, setInput] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchMovieByTitle(event.target.value);
    };

    const searchMovieByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`);
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
                const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
                setPopularMovies(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPopularMovies();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        {movies.map((item) => (
                            <Movie key={item.id} {...item} onClick={() => handleMovieClick(item.id)} />
                        ))}
                    </div>
                    {movies.length === 0 && (
                        <>
                            <div className='movie-container'>
                                <h1 className='text-2xl pb-4'>POPULAR</h1>
                            </div>
                            <div className="movie-container">
                                {popularMovies.map((item) => (
                                    <Movie key={item.id} {...item} onClick={() => handleMovieClick(item.id)} />
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
