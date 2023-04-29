import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Movie from '@/components/Movie';

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

export default function Home() {
  const [input, setInput] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    await searchMoviesByTitle(event.target.value);
  };

  const searchMoviesByTitle = async (title: string) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`);
      setMovies(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovieClick = (movieId: number) => {
    window.open(`https://www.themoviedb.org/movie/${movieId}`, '_blank');
  };

  return (
    <>
      <div>
        <Navbar input={input} handleInputChange={handleInputChange} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-peach space-y-4 pt-40 md:pt-28 background-image">
          <div className="movie-container lg:w-5/6">
            {movies.map((movie) => (
              <Movie
                key={movie.id}
                id={movie.id}
                title={movie.title}
                release_date={movie.release_date}
                poster_path={movie.poster_path}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}