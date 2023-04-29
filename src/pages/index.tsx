import { useEffect, useState } from 'react';
import axios from 'axios';
import { Client as NotionClient } from '@notionhq/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const NOTION_DATABASE_ID = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
const NOTION_API_KEY = process.env.NEXT_PUBLIC_NOTION_API_KEY;

const notion = new NotionClient({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
}

interface MovieInfoProps {
  movie: Movie;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const getMovieIdFromUrl = (url: string): string | null => {
    const splitUrl = url.split('/');
    const movieId = splitUrl[splitUrl.length - 1].split('-')[0];
    return movieId;
  };

  const getMovieById = async (id: string) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
      console.log(response.data);
      setMovie(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const movieId = getMovieIdFromUrl(input);
    if (movieId) {
      await getMovieById(movieId);
      if (movie) {
        try {
          const response = await axios.post('http://localhost:3001/api/addMovie', { movie });
          console.log(response.data);
        } catch (error) {
          console.error('Error adding movie to Notion:', error);
        }
      }
    }
  };

  const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
    const { title, overview, poster_path, vote_average, release_date } = movie;

    const rating = vote_average;
    const formattedRating = parseFloat(rating.toFixed(1));

    const release_year = new Date(release_date).getFullYear();

    return (
      <div className="movie-info w-5/6 lg:w-full">
        <h2 className="text-2xl font-bold text-center">{title} ({release_year})</h2>
        {/* <p className="mt-2 font-bold">Rating: {formattedRating}</p> */}
        {/* <p className="movie-info text-center">{overview}</p> */}
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          className="mt-4 rounded max-h-96 "
        />
      </div>
    );
  };

  return (
    <>
      <div>
        <FontAwesomeIcon
          icon={faGithub}
          style={{
            position: 'absolute',
            top: '25px',
            right: '25px',
            fontSize: '40px',
            color: 'black',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          onClick={() => window.open('https://github.com/drensokoli/movienotes')}
        />
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Add movies to your Notion Page</h1>
          <br />
          <form onSubmit={handleSubmit} className="w-5/6 lg:w-2/4">
            <input
              type="text"
              placeholder="Enter TMDb movie URL"
              value={input}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-gray-900"
            />
            <br />
            <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full mt-2">
              Fetch Movie
            </button>
          </form>
          {movie && <MovieInfo movie={movie} />}
        </div>
      </div>
    </>
  );
}