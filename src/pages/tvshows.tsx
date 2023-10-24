import { useEffect, useState } from 'react';
import axios from 'axios';
import TvShow from '../components/TvShow';
import SearchBar from '@/components/SearchBar';
import { debounce } from 'lodash';
import NotionAd from '@/components/NotionAd';

interface TvShow {
    id: number;
    title: string;
    original_name: string;
    name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
}

interface Props {
    tmdbApiKey: string;
    cryptoKey: string;
}

const TvShows: React.FC<Props> = ({ tmdbApiKey, cryptoKey }) => {
    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TvShow[]>([]);
    const [popularTvShows, setPopularTvShows] = useState<TvShow[]>([]);

    const API_KEY = tmdbApiKey;

    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const include_genres = '16,35,99,18,10751,14,36,10402,9648,10749,878'
    const certification_country = 'US'
    const certification = 'TV-PG'


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        searchTvShowByTitle(event.target.value);
    };

    const adultContent = ["sex", "porn", "nude", "sadomasochistic", "pussy", "vagina", "erotic", "lust", "softcore", "hardcore"]

    const searchTvShowByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}&with_genres=${include_genres}&certification_country=${certification_country}&certification=${certification}`);

            const tvShowIds = response.data.results.map((tvShow: { id: any; }) => tvShow.id);

            const tvShows = [];
            for (let id of tvShowIds) {
                const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=keywords`);

                const keywords = tvShowResponse.data.keywords.results.map((keyword: { name: any; }) => keyword.name);

                if (!keywords.some((keyword: string) => adultContent.includes(keyword))) {
                    tvShows.push(tvShowResponse.data);
                }
            }

            setTvShows(tvShows);
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
            }, 1000);

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
                    <NotionAd path={"tvshows"} />
                    <div className="movie-container">
                        {tvShows
                            .filter((item) => item.vote_average > 6)
                            .filter((item) => !adultContent.some((word) => item.name && item.name.toLowerCase().includes(word)))
                            .filter((item) => !adultContent.some((word) => item.original_name && item.original_name.toLowerCase().includes(word)))
                            .filter((item) => !adultContent.some((word) => item.title && item.title.toLowerCase().includes(word)))
                            .filter((item) => !adultContent.some((word) => item.overview && item.overview.toLowerCase().includes(word)))
                            .map((item) => (
                                <TvShow first_air_date={''} backdrop_path={''} key={item.id} {...item} onClick={() => handleTvShowClick(item.id)} onApiResponse={(error: string) => setApiResponse(error)} cryptoKey={cryptoKey} tmdbApiKey={tmdbApiKey} />
                            ))}
                    </div>
                    {tvShows.length === 0 && (
                        <>
                            <div className="movie-container">
                                {popularTvShows.map((item) => (
                                    <TvShow first_air_date={''} backdrop_path={''} key={item.id} {...item} onClick={() => handleTvShowClick(item.id)} onApiResponse={(error: string) => setApiResponse(error)} cryptoKey={cryptoKey} tmdbApiKey={tmdbApiKey} />
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

export const getServerSideProps = async () => {

    const cryptoKey = process.env.CRYPTO_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    return {
        props: {
            cryptoKey,
            tmdbApiKey
        }
    }
}