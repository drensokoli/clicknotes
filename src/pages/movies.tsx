import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Movie from '../components/Movie';
import React from 'react';
import Example from '@/components/Example';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
}


const Movies: React.FC = () => {
    const [input, setInput] = useState('');

    const [movies, setMovies] = useState<Movie[]>([]);
    const [showMovies, setShowMovies] = useState(true);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchContentByTitle(event.target.value);
    };

    const searchContentByTitle = async (title: string) => {
        try {
            const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`);
            setMovies(movieResponse.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMovieClick = (movieId: number) => {
        window.open(`https://www.themoviedb.org/movie/${movieId}`, '_blank');
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4 pt-32">
                <div className='w-full'>
                    <form onSubmit={(e) => e.preventDefault()} className="w-5/6 lg:w-2/3 mx-auto shadow-lg">
                        <div className="relative">
                            <i className="absolute fa fa-search text-gray-400 top-5 left-4"></i>
                            <input
                                type="text"
                                placeholder="Enter movie title"
                                value={input}
                                onChange={handleInputChange}
                                className="bg-white h-12 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer"
                            />
                        </div>
                    </form>
                </div>
                <div className="content-container w-5/6">
                    {showMovies && (

                        <div className="movie-container">
                            {movies.map((movie) => (
                                <Movie key={movie.id} {...movie} onClick={() => handleMovieClick(movie.id)} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </>
    );
};

export default Movies;
