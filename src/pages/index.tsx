import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Movie from '../components/Movie';
import TVShow from '../components/TVShow';
import React from 'react';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
}


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
  const [tvShows, setTvShows] = useState<TVShow[]>([]);

  const [showMovies, setShowMovies] = useState(true);
  const [showTVShows, setShowTVShows] = useState(true);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    await searchContentByTitle(event.target.value);
  };

  const searchContentByTitle = async (title: string) => {
    try {
      const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`);
      setMovies(movieResponse.data.results);

      const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`);
      setTvShows(tvShowResponse.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTVShowClick = (tvShowId: number) => {
    window.open(`https://www.themoviedb.org/tv/${tvShowId}`, '_blank');
  };

  const handleMovieClick = (movieId: number) => {
    window.open(`https://www.themoviedb.org/movie/${movieId}`, '_blank');
  };

  return (
    <>
      <div>
        <Navbar input={input} handleInputChange={handleInputChange} />
        <div className="flex flex-col items-center min-h-screen bg-peach space-y-4 pt-28 background-image">
          <div className="content-container w-5/6">

            <div className='pt-4 sm:pt-0 cursor-pointer'>
              <div className="border-b border-gray-400 flex justify-between items-end w-full" onClick={() => setShowMovies(!showMovies)}>
                <h2 className="text-xl font-bold mb-2 text-center cursor-pointer pt-10 text-gray-600" >
                  Movies
                </h2>
                <img src="/down-arrow.png" alt="" className='h-8 w-auto'></img>
              </div>
            </div>

            {showMovies && (

              <div className="movie-container">
                {movies.map((movie) => (
                  <Movie key={movie.id} {...movie} onClick={() => handleMovieClick(movie.id)} />
                ))}
              </div>
            )}

            <div className='cursor-pointer'>
              <div className="border-b border-gray-400 flex justify-between items-end w-full" onClick={() => setShowTVShows(!showTVShows)}>
                <h2 className="text-xl font-bold mb-2 text-center cursor-pointer pt-10 text-gray-600" >
                  TV Shows
                </h2>
                <img src="/down-arrow.png" alt="" className='h-8 w-auto'></img>
              </div>
            </div>

            {showTVShows && (

              <div className="movie-container">
                {tvShows.map((tvShow) => (
                  <TVShow key={tvShow.id} {...tvShow} onClick={() => handleTVShowClick(tvShow.id)} />
                ))}
              </div>
            )}

          </div>
        </div>
        <Footer />
      </div>
    </>
  );

}