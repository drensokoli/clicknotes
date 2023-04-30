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
    <div key={id} className="movie-card ">
      <div className="movie-card-image-container">

        {poster_path ? (
          <div className='movie-image'>

            <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              className="h-[300px] rounded-sm"
              onClick={onClick}
            />
            <button type="button" className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900 movie-card-button">Add to Notion</button>
          </div>
        ) : (
          <div className='movie-image'>
            <div className="bg-transparent backdrop-blur-sm"
              style={{
                width: '200px',
                height: '300px',
                borderRadius: '5px'
              }}
              onClick={onClick}
            ></div>
            <button type="button" className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900 movie-card-button">Add to Notion</button>
          </div>
        )}
      </div>
      <h2 className="text-l font-bold text-center text-gray-800">
        <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
      </h2>
    </div>
  );
};

export default Movie;
