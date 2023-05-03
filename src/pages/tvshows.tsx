import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TVShow from '../components/TVShow';
import React from 'react';
import Example from '@/components/Example';

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

const Movies: React.FC = () => {
    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TVShow[]>([]);
    const [showTVShows, setShowTVShows] = useState(true);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchContentByTitle(event.target.value);
    };

    const searchContentByTitle = async (title: string) => {
        try {
            const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`);
            setTvShows(tvShowResponse.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTVShowClick = (tvShowId: number) => {
        window.open(`https://www.themoviedb.org/tv/${tvShowId}`, '_blank');
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-blue-100 space-y-4  pt-32 background-image">
                <div className='w-full'>
                <form onSubmit={(e) => e.preventDefault()} className="w-5/6 lg:w-2/3 mx-auto">
                        <div className="relative">
                            <i className="absolute fa fa-search text-gray-400 top-5 left-4"></i>
                            <input
                                type="text"
                                placeholder="Enter TV show title"
                                value={input}
                                onChange={handleInputChange}
                                className="bg-white h-12 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer"
                            />
                        </div>
                    </form>
                </div>
                <div className="content-container w-5/6">
                    {showTVShows && (

                        <div className="movie-container">
                            {tvShows.map((tvShow) => (
                                <TVShow key={tvShow.id} {...tvShow} onClick={() => handleTVShowClick(tvShow.id)} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Movies;
