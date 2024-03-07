import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '@/components/Helpers/SearchBar';
import Movie from '@/components/Media/Movie';
import { useSession } from 'next-auth/react';
import { searchMovieByTitle } from '@/lib/movieHelpers';
import Toast from '@/components/Helpers/Toast';
import { Movie as MovieInterface } from '@/lib/interfaces';
import Head from 'next/head';
import LoadMore from '@/components/Helpers/LoadMore';

export default function Movies({ tmdbApiKey, encryptionKey, popularMovies }: {
    tmdbApiKey: string;
    encryptionKey: string;
    popularMovies: MovieInterface[];
}) {

    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    const [input, setInput] = useState('');
    const [movies, setMovies] = useState<MovieInterface[]>([]);

    const [notionApiKey, setNotionApiKey] = useState('');
    const [moviesDatabaseId, setMoviesDatabaseId] = useState<string | null>(null);

    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [pageLink, setPageLink] = useState('');
    const [displayCount, setDisplayCount] = useState(20);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        searchMovieByTitle({ title: event.target.value, tmdbApiKey: tmdbApiKey })
            .then(movies => {
                if (movies) {
                    setMovies(movies);
                }
            })
            .catch(error => console.error(error));
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
            setNotionApiKey(connectionData.access_token);
            setMoviesDatabaseId(connectionData.template_id);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (session && !notionApiKey && !moviesDatabaseId) {
            fetchUserData();
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>ClickNotes | Movies</title>
                <meta name="description" content="Save popular and trending movies to your Notion list or search for your favourites. All your movies in one place, displayed in a beautiful Notion template." />
                <meta name="robots" content="all"></meta>
                <meta property="og:title" content="ClickNotes | Movies" />
                <meta property="og:description" content="Save popular and trending movies to your Notion list or search for your favorites. All your movies in one place, displayed in a beautiful Notion template." />
                <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Dren Sokoli" />
                <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
                <meta property="og:title" content="ClickNotes - Save your movies to Notion" />
                <meta property="og:description" content="Save popular and trending movies to your Notion list or search for your favorites. All your movies in one place, displayed in a beautiful Notion template." />
                <meta property="og:image" content="https://www.clicknotes.site/og/movies.png" />
                <meta property="og:url" content="https://clicknotes.site/movies" />
                <meta property="og:site_name" content="ClickNotes" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SokoliDren" />
                <meta name="twitter:creator" content="@SokoliDren" />
                <meta name="twitter:title" content="ClickNotes - Save your movies to Notion" />
                <meta name="twitter:description" content="Save popular and trending movies to your Notion list or search for your favorites. All your movies in one place, displayed in a beautiful Notion template." />
                <meta name="twitter:image" content="https://www.clicknotes.site/og/movies.png" />
                <meta name="twitter:domain" content="www.clicknotes.site" />
                <meta name="twitter:url" content="https://clicknotes.site/movies" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://clicknotes.site/movies" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={pageLink} />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 min-h-screen'>
                    {movies
                        .map((item) => (
                            <Movie
                                {...item}
                                key={item.id}
                                runtime={0}
                                adult={false}
                                backdrop_path={item.backdrop_path}
                                onApiResponse={(error: string) => setApiResponse(error)}
                                setPageLink={setPageLink}
                                tmdbApiKey={tmdbApiKey}
                                encryptionKey={encryptionKey}
                                notionApiKey={notionApiKey}
                                moviesDatabaseId={moviesDatabaseId}
                            />
                        ))
                    }
                    {movies.length === 0 && (
                        <>
                            {popularMovies
                                .slice(0, displayCount)
                                .map((item) => (
                                    <Movie
                                        {...item}
                                        key={item.id}
                                        runtime={0}
                                        adult={false}
                                        backdrop_path={item.backdrop_path}
                                        onApiResponse={(error: string) => setApiResponse(error)}
                                        setPageLink={setPageLink}
                                        tmdbApiKey={tmdbApiKey}
                                        encryptionKey={encryptionKey}
                                        notionApiKey={notionApiKey}
                                        moviesDatabaseId={moviesDatabaseId}
                                    />
                                ))}
                        </>
                    )}
                </div>
                {displayCount < popularMovies.length && movies.length === 0 && (
                    <LoadMore
                        displayCount={displayCount}
                        setDisplayCount={setDisplayCount}
                        media={popularMovies}
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

    let popularMoviesResults = [];

    for (let page = 1; page <= totalPages; page++) {
        const popularMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=${page}&include_adult=false`);
        popularMoviesResults.push(...popularMoviesResponse.data.results);
    }

    return {
        props: {
            tmdbApiKey,
            encryptionKey,
            popularMovies: popularMoviesResults
        },
        revalidate: 60 * 60 * 24 // 24 hours
    };
}
