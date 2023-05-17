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

const TvShows: React.FC = () => {
    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TvShow[]>([]);
    const [popularTvShows, setPopularTvShows] = useState<TvShow[]>([]);

    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const include_genres = '16,35,99,18,10751,14,36,10402,9648,10749,878'
    const certification_country = 'US'
    const certification = 'TV-PG'

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchTvShowByTitle(event.target.value);
    };

    const searchTvShowByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}&with_genres=${include_genres}&certification_country=${certification_country}&certification=${certification}`);
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

    useEffect(() => {
        if (apiResponse !== 'Adding TV show to Notion...') {
            const timer = setTimeout(() => {
                setApiResponse(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [apiResponse]);

    return (
        <>
            {apiResponse === 'Added TV show to Notion' ? (
                <div className="success-message">
                    <p>{apiResponse}</p>
                </div>
            ) : apiResponse === 'Error adding TV show to Notion' ? (
                <div className="error-message">
                    <p>{apiResponse}</p>
                    Need <a href="/help" target="_blank">
                        <span className="text-blue-500">help</span>?
                    </a>
                </div>
            ) : apiResponse === 'Adding TV show to Notion...' ? (
                <div className="loading-message">
                    <p>{apiResponse}</p>
                </div>
            ) : null}

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        {tvShows.map((item) => (
                            <TvShow first_air_date={''} backdrop_path={''} key={item.id} {...item} onClick={() => handleTvShowClick(item.id)} onApiResponse={(error: string) => setApiResponse(error)} />
                        ))}
                    </div>
                    {tvShows.length === 0 && (
                        <>
                            <div className='movie-container'>
                                <h1 className='text-2xl pb-4'>POPULAR</h1>
                            </div>
                            <div className="movie-container">
                                {popularTvShows.map((item) => (
                                    <TvShow first_air_date={''} backdrop_path={''} key={item.id} {...item} onClick={() => handleTvShowClick(item.id)} onApiResponse={(error: string) => setApiResponse(error)} />
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
