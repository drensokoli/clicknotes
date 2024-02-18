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

    const [input, setInput] = useState('');
    const [movies, setMovies] = useState<MovieInterface[]>([]);
    const [notionApiKey, setNotionApiKey] = useState('');
    const [moviesPageLink, setMoviesPageLink] = useState('');
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

    useEffect(() => {
        if (session && !notionApiKey && !moviesPageLink) {
            const fetchUser = async () => {
                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail: session?.user?.email }),
                });
                const user = await response.json();
                setNotionApiKey(user.notionApiKey);
                setMoviesPageLink(user.moviesPageLink);
            };
            fetchUser();
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
                <meta name="twitter:site" content="@drensokoli" />
                <meta name="twitter:creator" content="@drensokoli" />
                <meta name="twitter:title" content="ClickNotes - Save your movies to Notion" />
                <meta name="twitter:description" content="Save popular and trending movies to your Notion list or search for your favorites. All your movies in one place, displayed in a beautiful Notion template." />
                <meta name="twitter:image" content="https://www.clicknotes.site/og/movies.png" />
                <meta name="twitter:domain" content="clicknotes.site" />
                <meta name="twitter:url" content="https://clicknotes.site/movies" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://clicknotes.site/movies" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={pageLink} />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container sm:w-5/6">
                <div className="movie-container grid grid-cols-2 gap-2 sm:grid-cols-1">
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
                                    moviesPageLink={moviesPageLink}
                                />
                            ))}
                        {movies.length === 0 && (
                            <>
                                {popularMovies
                                    .filter((item) => item.vote_average > 6)
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
                                            moviesPageLink={moviesPageLink}
                                        />
                                    ))}
                                {displayCount < 180 &&
                                    <LoadMore
                                        displayCount={displayCount}
                                        setDisplayCount={setDisplayCount}
                                        media={popularMovies}
                                    />
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );


};

export const getStaticProps = async () => {

    const encryptionKey = process.env.ENCRYPTION_KEY;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    const popularMoviesResponsePageOne = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1&include_adult=false`);
    const popularMoviesResponsePageTwo = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=2&include_adult=false`);
    const popularMoviesResponsePageThree = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=3&include_adult=false`);
    const popularMoviesResponsePageFour = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=4&include_adult=false`);
    const popularMoviesResponsePageFive = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=5&include_adult=false`);
    const popularMoviesResponsePageSix = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=6&include_adult=false`);
    const popularMoviesResponsePageSeven = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=7&include_adult=false`);
    const popularMoviesResponsePageEight = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=8&include_adult=false`);
    const popularMoviesResponsePageNine = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=9&include_adult=false`);
    const popularMoviesResponsePageTen = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=10&include_adult=false`);

    const popularMoviesResponse = {
        data: {
            results: [
                ...popularMoviesResponsePageOne.data.results,
                ...popularMoviesResponsePageTwo.data.results,
                ...popularMoviesResponsePageThree.data.results,
                ...popularMoviesResponsePageFour.data.results,
                ...popularMoviesResponsePageFive.data.results,
                ...popularMoviesResponsePageSix.data.results,
                ...popularMoviesResponsePageSeven.data.results,
                ...popularMoviesResponsePageEight.data.results,
                ...popularMoviesResponsePageNine.data.results,
                ...popularMoviesResponsePageTen.data.results
            ]
        }
    };

    const popularMovies = popularMoviesResponse.data.results;

    return {
        props: {
            tmdbApiKey,
            encryptionKey,
            popularMovies
        },

        revalidate: 60 * 60 * 24 // 24 hours
    };
}
