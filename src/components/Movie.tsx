// components/Movie.tsx
import React from 'react';

interface MovieProps {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  onClick: () => void;
}

const Movie: React.FC<MovieProps> = ({ id, title, release_date, poster_path, onClick }) => {
  return (
    <div key={id} className="movie-card" onClick={onClick}>
      {poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          className="movie-image h-[300px] shadow-2xl rounded"
        />
      ) : (
        <div className=' bg-white bg-opacity-10 backdrop-blur-lg rounded drop-shadow-md'
          style={{
            width: '200px',
            height: '300px',
            borderRadius: '5px'
          }}
        />
      )}
      <h2 className="text-l font-bold text-center text-gray-800">
        {title} {release_date ? ` (${release_date.split('-')[0]})` : ''}
      </h2>
    </div>
  );
};

export default Movie;
