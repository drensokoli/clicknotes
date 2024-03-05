import { useEffect, useState } from 'react';
import axios from 'axios';
import TvShow from '../components/Media/TvShow';
import SearchBar from '@/components/Helpers/SearchBar';
import Toast from '@/components/Helpers/Toast';
import { useSession } from 'next-auth/react';
import { searchTvShowByTitle } from '@/lib/tvShowHelpers';
import { TvShow as TvShowInterface } from '@/lib/interfaces';
import Head from 'next/head';
import LoadMore from '@/components/Helpers/LoadMore';

export default function TvShows({ tmdbApiKey, encryptionKey, popularTvShows }: {
    tmdbApiKey: string;
    encryptionKey: string;
    popularTvShows: TvShowInterface[];
}) {

    const { data: session } = useSession();

    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TvShowInterface[]>([]);
    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [tvShowsPageLink, setTvShowPageLink] = useState<string>('');
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [pageLink, setPageLink] = useState('');
    const [displayCount, setDisplayCount] = useState(20);

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
        if (session && !notionApiKey && !tvShowsPageLink) {
            const fetchUser = async () => {
                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail: session?.user?.email }),
                });
                const user = await response.json();
                setNotionApiKey(user.notionApiKey);
                setTvShowPageLink(user.moviesPageLink);
            };
            fetchUser();
            console.log("popular tv shows", popularTvShows.length)
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>ClickNotes | TV Shows</title>
                <meta name="description" content="Save popular and trending TV shows to your Notion list or search for your favourites. All your TV shows in one place, displayed in a beautiful Notion template." />
                <meta name="robots" content="all"></meta>
                <meta property="og:title" content="ClickNotes | TV Shows" />
                <meta property="og:description" content="Save popular and trending TV shows to your Notion list or search for your favorites. All your TV shows in one place, displayed in a beautiful Notion template." />
                <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Dren Sokoli" />
                <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
                <meta property="og:title" content="ClickNotes - Save your TV shows to Notion" />
                <meta property="og:description" content="Save popular and trending TV shows to your Notion list or search for your favorites. All your TV shows in one place, displayed in a beautiful Notion template." />
                <meta property="og:image" content="https://www.clicknotes.site/og/tvshows.png" />
                <meta property="og:url" content="https://clicknotes.site/tvshows" />
                <meta property="og:site_name" content="ClickNotes" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SokoliDren" />
                <meta name="twitter:creator" content="@SokoliDren" />
                <meta name="twitter:title" content="ClickNotes - Save your TV shows to Notion" />
                <meta name="twitter:description" content="Save popular and trending TV shows to your Notion list or search for your favorites. All your TV shows in one place, displayed in a beautiful Notion template." />
                <meta name="twitter:image" content="https://www.clicknotes.site/og/tvshows.png" />
                <meta name="twitter:domain" content="clicknotes.site" />
                <meta name="twitter:url" content="https://clicknotes.site/tvshows" />
                <link rel="icon" href="/favicon.ico" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={pageLink} />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4'>
                    {tvShows
                        .map((item) => (
                            <TvShow
                                {...item}
                                key={item.id}
                                first_air_date={item.first_air_date}
                                backdrop_path={item.backdrop_path}
                                onApiResponse={(error: string) => setApiResponse(error)}
                                setPageLink={setPageLink}
                                encryptionKey={encryptionKey}
                                tmdbApiKey={tmdbApiKey}
                                notionApiKey={notionApiKey}
                                tvShowsPageLink={tvShowsPageLink}
                            />
                        ))
                    }
                    {tvShows.length === 0 && (
                        <>
                            {popularTvShows
                                .slice(0, displayCount)
                                .map((item) => (
                                    <TvShow
                                        {...item}
                                        key={item.id}
                                        first_air_date={item.first_air_date}
                                        backdrop_path={item.backdrop_path}
                                        onApiResponse={(error: string) => setApiResponse(error)}
                                        setPageLink={setPageLink}
                                        encryptionKey={encryptionKey}
                                        tmdbApiKey={tmdbApiKey}
                                        notionApiKey={notionApiKey}
                                        tvShowsPageLink={tvShowsPageLink}
                                    />
                                ))
                            }
                        </>
                    )}
                </div>
                {displayCount < popularTvShows.length && tvShows.length === 0 && (
                    <LoadMore
                        displayCount={displayCount}
                        setDisplayCount={setDisplayCount}
                        media={popularTvShows}
                    />
                )}
            </div>
        </>
    );
};

export const getStaticProps = async () => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const totalPages = 20; // Total number of pages to fetch

    let popularTvShowsResults = [];

    for (let page = 1; page <= totalPages; page++) {
        const popularTvShowsResponse = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${tmdbApiKey}&language=en-US&page=${page}`);
        popularTvShowsResults.push(...popularTvShowsResponse.data.results);
    }

    return {
        props: {
            tmdbApiKey,
            encryptionKey,
            popularTvShows: popularTvShowsResults
        },
        revalidate: 60 * 60 * 24 // 24 hours
    };
}
