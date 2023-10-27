import { useEffect, useState } from 'react';
import axios from 'axios';
import TvShow from '../components/TvShow';
import SearchBar from '@/components/SearchBar';
import { debounce } from 'lodash';
import NotionAd from '@/components/NotionAd';
import NotionResponse from '@/components/NotionResponse';
import { useSession } from 'next-auth/react';
import { searchTvShowByTitle } from '@/lib/tvShowHelpers';

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

export default function TvShows({ tmdbApiKey, cryptoKey, popularTvShows }: {
    tmdbApiKey: string;
    cryptoKey: string;
    popularTvShows: TvShow[];
}) {
    
    const { data: session } = useSession();

    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TvShow[]>([]);
    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [tvShowsPageLink, setTvShowPageLink] = useState<string>('');
    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        searchTvShowByTitle({ title: event.target.value, tmdbApiKey: tmdbApiKey })
            .then(movies => {
                if (movies) {
                    setTvShows(movies);
                }
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/getUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: session?.user?.email }),
            });
            const user = await response.json();
            setNotionApiKey(user.notionApiKey);
            setTvShowPageLink(user.tvShowsPageLink);
        };
        fetchUser();
    }, [session]);

    return (
        <>
            <NotionResponse apiResponse={apiResponse} setApiResponse={setApiResponse} />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <NotionAd path={"tvshows"} />
                    <div className="movie-container">
                        {tvShows
                            .map((item) => (
                                <TvShow 
                                {...item} 
                                first_air_date={''} 
                                backdrop_path={''} 
                                onApiResponse={(error: string) => setApiResponse(error)} 
                                cryptoKey={cryptoKey} 
                                tmdbApiKey={tmdbApiKey} />
                            ))}
                    </div>
                    {tvShows.length === 0 && (
                        <>
                            <div className="movie-container">
                                {popularTvShows.map((item) => (
                                    <TvShow 
                                    {...item} 
                                    first_air_date={''} 
                                    backdrop_path={''} 
                                    onApiResponse={(error: string) => setApiResponse(error)} 
                                    cryptoKey={cryptoKey} 
                                    tmdbApiKey={tmdbApiKey} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );

};

export const getStaticProps = async () => {

    const cryptoKey = process.env.CRYPTO_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    const popularTvShowsResponse = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${tmdbApiKey}&language=en-US&page=1`);
    const popularTvShows = popularTvShowsResponse.data.results;

    return {
        props: {
            tmdbApiKey,
            cryptoKey,
            popularTvShows
        },

        revalidate: 60 * 60 * 24 // 24 hours
    };

}
