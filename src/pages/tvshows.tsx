import { SetStateAction, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TvShow from '../components/Media/TvShow';
import SearchBar from '@/components/Helpers/SearchBar';
import Toast from '@/components/Helpers/Toast';
import { useSession } from 'next-auth/react';
import { searchContentByTitle } from '@/lib/moviesAndShowsHeleprs';
import { TvShow as TvShowInterface } from '@/lib/interfaces';
import Head from 'next/head';
import LoadMore from '@/components/Helpers/LoadMore';
import NotionBanner from '@/components/Notion/NotionBanner';
import WidthKeeper from '@/components/Lists/WidthKeeper';

export default function TvShows({ tmdbApiKey, omdbApiKeys, encryptionKey, popularTvShows }: {
    tmdbApiKey: string;
    omdbApiKeys: string[];
    encryptionKey: string;
    popularTvShows: TvShowInterface[];
}) {

    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    const tvShowsAuthUrl = process.env.NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL as string;

    const [showNotionBanner, setShowNotionBanner] = useState(false);

    const [input, setInput] = useState('');
    const [tvShows, setTvShows] = useState<TvShowInterface[]>([]);

    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [tvShowsDatabaseId, setTvShowDatabaseId] = useState<string>('');

    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [pageLink, setPageLink] = useState('');
    const [displayCount, setDisplayCount] = useState(20);

    const [noItemsFound, setNoItemsFound] = useState(false);
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        if (event.target.value === '') {
            setTvShows([]);
            setInput('');
            setNoItemsFound(false);
            return;
        }

        // Clear the existing debounce timeout
        clearTimeout(debounceTimeout.current!);

        // Set a new debounce timeout
        debounceTimeout.current = setTimeout(() => {
            searchContentByTitle({ title: event.target.value, tmdbApiKey: tmdbApiKey, type: 'tv' })
            .then((tvShows) => {
                if (tvShows && tvShows.length > 0) {
                    setTvShows(tvShows);
                    setNoItemsFound(false);
                } else {
                    setTvShows([]);
                    setNoItemsFound(true);
                }
            })
            .catch((error: any) => console.error(error));
        }, 300);
    };

    async function fetchUserData() {
        try {
            const response = await fetch('/api/getUserConnection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    connectionType: "movies",
                }),
            });

            const connectionData = await response.json();

            if (!connectionData || !connectionData.access_token || !connectionData.template_id) {
                setShowNotionBanner(true);
            } else if (connectionData.access_token && connectionData.template_id) {
                setNotionApiKey(connectionData.access_token);
                setTvShowDatabaseId(connectionData.template_id);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (session && !notionApiKey && !tvShowsDatabaseId) {
            fetchUserData();
        }
    }, [session]);
    useEffect(() => {
        if (input === '') {
            setTvShows([]);
            setNoItemsFound(false);
        }
    }, [input]);

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
                <meta property="og:url" content="https://www.clicknotes.site/tvshows" />
                <meta property="og:site_name" content="ClickNotes" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SokoliDren" />
                <meta name="twitter:creator" content="@SokoliDren" />
                <meta name="twitter:title" content="ClickNotes - Save your TV shows to Notion" />
                <meta name="twitter:description" content="Save popular and trending TV shows to your Notion list or search for your favorites. All your TV shows in one place, displayed in a beautiful Notion template." />
                <meta name="twitter:image" content="https://www.clicknotes.site/og/tvshows.png" />
                <meta name="twitter:domain" content="www.clicknotes.site" />
                <meta name="twitter:url" content="https://www.clicknotes.site/tvshows" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://www.clicknotes.site/tvshows" />
                {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script> */}
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink='/my-lists/tvshows' />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <div className='w-fit'>
                    <SearchBar input={input} handleInputChange={handleInputChange} placeholder='Search for TV shows' />
                    <WidthKeeper />
                    {showNotionBanner && (
                        <NotionBanner image='/connecttvshows.png' link={tvShowsAuthUrl} session={session ? true : false} />
                    )}
                    <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 flex-grow'>
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
                                    tvShowsDatabaseId={tvShowsDatabaseId}
                                    omdbApiKeys={omdbApiKeys}
                                    genre_ids={item.genre_ids}
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
                                            tvShowsDatabaseId={tvShowsDatabaseId}
                                            omdbApiKeys={omdbApiKeys}
                                            genre_ids={item.genre_ids}
                                        />
                                    ))
                                }
                            </>
                        )}
                    </div>
                    {displayCount < popularTvShows.length && tvShows.length === 0 && !noItemsFound && (
                        <LoadMore
                            displayCount={displayCount}
                            setDisplayCount={setDisplayCount}
                            media={popularTvShows}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export const getStaticProps = async () => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const omdbApiKey1 = process.env.OMDB_API_KEY_1;
    const omdbApiKey2 = process.env.OMDB_API_KEY_2;
    const omdbApiKey3 = process.env.OMDB_API_KEY_3;
    const omdbApiKeys = [omdbApiKey1, omdbApiKey2, omdbApiKey3];
    const totalPages = 20; // Total number of pages to fetch

    let popularTvShowsResults = [];

    for (let page = 1; page <= totalPages; page++) {
        const popularTvShowsResponse = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${tmdbApiKey}&language=en-US&page=${page}`);
        popularTvShowsResults.push(...popularTvShowsResponse.data.results);
    }

    return {
        props: {
            tmdbApiKey,
            omdbApiKeys,
            encryptionKey,
            popularTvShows: popularTvShowsResults
        },
        revalidate: 60 * 60 * 24 // 24 hours
    };
}
