import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';
import MyListsCard from "@/components/Lists/MyListsCard";
import NotionBanner from "@/components/Notion/NotionBanner";
import MyListsSkeleton from "@/components/Lists/MyListsSkeleton";
import Head from "next/head";

export default function MyLists() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const notionBanners = [
        { image: '/connectmovies.png' },
        { image: '/connecttvshows.png' },
        { image: '/connectbooks.png' },
    ];

    const [loading, setLoading] = useState(true);

    const [movies, setMovies] = useState<any[]>();
    const [tvShows, setTvShows] = useState<any[]>();
    const [books, setBooks] = useState<any[]>();

    const [movieDatabaseName, setMovieDatabaseName] = useState('');
    const [bookDatabaseName, setBookDatabaseName] = useState('');

    const connectionMapping = [
        { listType: 'movies', list: movies, setList: setMovies, listName: movieDatabaseName, setListName: setMovieDatabaseName },
        { listType: 'tvshows', list: tvShows, setList: setTvShows, listName: movieDatabaseName, setListName: setMovieDatabaseName },
        { listType: 'books', list: books, setList: setBooks, listName: bookDatabaseName, setListName: setBookDatabaseName },
    ];

    const fetchLists = async () => {
        try {
            const fetchPromises = connectionMapping.map(async connection => {
                const response = await fetch('/api/getNotionDatabases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userEmail,
                        listType: connection.listType,
                    }),
                });

                const connectionData = await response.json();

                connection.setList(connectionData.list);
                connection.setListName(connectionData.databaseName);
            });

            await Promise.all(fetchPromises);

            setLoading(false);

        } catch (error) {
            console.error('Failed to fetch lists:', error);
        }
    }

    useEffect(() => {
        if (userEmail) {
            fetchLists();
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>ClickNotes | My Lists</title>
                <meta name="description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
                <meta name="robots" content="all"></meta>
                <meta property="og:title" content="ClickNotes | My Lists" />
                <meta property="og:description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
                <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Dren Sokoli" />
                <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
                <meta property="og:title" content="ClickNotes - Save your movies to Notion" />
                <meta property="og:description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
                <meta property="og:image" content="https://www.clicknotes.site/og/my-lists.png" />
                <meta property="og:url" content="https://clicknotes.site/my-lists" />
                <meta property="og:site_name" content="ClickNotes" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SokoliDren" />
                <meta name="twitter:creator" content="@SokoliDren" />
                <meta name="twitter:title" content="ClickNotes - Save your movies to Notion" />
                <meta name="twitter:description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
                <meta name="twitter:image" content="https://www.clicknotes.site/og/my-lists.png" />
                <meta name="twitter:domain" content="www.clicknotes.site" />
                <meta name="twitter:url" content="https://clicknotes.site/my-lists" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://clicknotes.site/my-lists" />
                {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script> */}
            </Head>

            <div className="min-h-screen flex-grow">
                <div className="w-full sm:px-20 px-4">
                    <h1 className="text-sm text-gray-400">MY LISTS</h1>
                </div>
                <hr className="sm:mx-20 mx-4 border-gray-400 py-2" />
                {loading ? (
                    <MyListsSkeleton />
                ) : (
                    <>
                        {!movies && !tvShows && !books ? (
                            <div className="flex flex-col gap-2 px-2">
                                <h1 className="text-center text-lg">You have no lists.</h1>
                                <h1 className="text-center text-lg">Follow the guide below to create your first ClickNotes list!</h1>
                                <NotionBanner image={notionBanners[Math.floor(Math.random() * notionBanners.length)].image} />
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-4 sm:px-20 px-4">
                                {movies && movies.length > 0 && (
                                    <MyListsCard name="Movies" id={movies[0].parent.database_id} list={movies} path="/my-lists/movies" databaseName={movieDatabaseName} />
                                )}
                                {tvShows && tvShows.length > 0 && (
                                    <MyListsCard name="TV Shows" id={tvShows[0].parent.database_id} list={tvShows} path="/my-lists/tvshows" databaseName={movieDatabaseName} />
                                )}
                                {books && books.length > 0 && (
                                    <MyListsCard name="Books" id={books[0].parent.database_id} list={books} path="/my-lists/books" databaseName={bookDatabaseName} />
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* <div className="w-full sm:px-20 px-4 mt-8">
                    <h1 className="text-sm text-gray-400">MY COLLECTIONS</h1>
                </div>
                <hr className="sm:mx-20 mx-4 border-gray-400 py-2" />
                {loading ? (
                    <MyListsSkeleton />
                ) : (
                    <h1 className="text-center py-2">Coming Soon ...</h1>
                )} */}
            </div>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {}
    };
}
