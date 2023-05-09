import { useEffect, useState } from 'react';
import axios from 'axios';
import TvShow from '../components/TvShow';
import SearchBar from '@/components/SearchBar';

interface TvShow {
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

const TvShows: React.FC= () => {
    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TvShow[]>([]);
    const [popularTvShows, setPopularTvShows] = useState<TvShow[]>([]);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchTvShowByTitle(event.target.value);
    };

    const searchTvShowByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`);
            setTvShows(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTvShowClick = async (tvShowId: number) => {
        try {
            window.open(`https://www.themoviedb.org/tv/${tvShowId}`, '_blank');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchPopularTvShows = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
                setPopularTvShows(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPopularTvShows();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        {tvShows.map((item) => (
                            <TvShow key={item.id} {...item} onClick={() => handleTvShowClick(item.id)} />
                        ))}
                    </div>
                    {tvShows.length === 0 && (
                        <>
                            <div className='movie-container'>
                                <h1 className='text-2xl pb-4'>POPULAR</h1>
                            </div>
                            <div className="movie-container">
                                {popularTvShows.map((item) => (
                                    <TvShow key={item.id} {...item} onClick={() => handleTvShowClick(item.id)} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );

};

export default TvShows;
