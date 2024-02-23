import Card from "@/components/Helpers/Card";
import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';
import MoviesListCard from "@/components/Helpers/MoviesListCard";
import LoadMore from "@/components/Helpers/LoadMore";
import BooksListCard from "@/components/Helpers/BooksListCard";

export default function Lists({ movies, books, nameList, movieStatusList, bookStatusList, movieTypeList }: { movies: any, books: any, nameList: any, movieStatusList: any, bookStatusList: any, movieTypeList: any}) {

    const [input, setInput] = useState('');
    const [displayCount, setDisplayCount] = useState(20);
    const [list, setList] = useState(movies);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);
    };

    useEffect(() => {
        console.log("List: ", list);
    }, [list]);

    return (
        <>

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="flex justify-end items-center w-[90%] sm:w-[70%] gap-2">
                    {list[0].properties.Type.select.name === "Movie" || list[0].properties.Type.select.name === "TvShow" ? (
                        <>
                            <div>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={nameList[0].name}
                                    onChange={(e) => {
                                        setList(movies.filter((movie: any) => movie.properties.Status.status.name === e.target.value));
                                        setDisplayCount(20);
                                    }}
                                >
                                    {movieStatusList.map((status: any) => (
                                        <option key={status} value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={nameList[0].name}
                                    onChange={(e) => {
                                        setList(movies.filter((movie: any) => movie.properties.Type.select.name === e.target.value));
                                        setDisplayCount(20);
                                    }}
                                >
                                    {movieTypeList.map((movieType: any) => (
                                        <option key={movieType} value={movieType}
                                        >
                                            {movieType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : list[0].properties.Type.select.name === "Book" || list[0].properties.Type.select.name === "Article" ? (
                        <div>
                            <select
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={nameList[0].name}
                                onChange={(e) => {
                                    setList(books.filter((book: any) => book.properties.Status.status.name === e.target.value));
                                    setDisplayCount(20);
                                }}
                            >
                                {bookStatusList.map((status: any) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    <div>
                        <select
                            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={nameList[0].name}
                            onChange={(e) => setList(e.target.value === nameList[0].databaseName ? movies : books)}
                        >
                            {nameList.map((list: { databaseName: any; }) => (
                                <option key={list.databaseName} value={list.databaseName}>
                                    {list.databaseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="content-container sm:w-5/6">
                    <div className="movie-container grid grid-cols-2 gap-2 sm:grid-cols-1">
                        {list[0].properties.Type.select.name === "Movie" || list[0].properties.Type.select.name === "TvShow" ? (
                            <>
                                {list
                                    .slice(0, displayCount)
                                    .map((listItem: any) => (
                                        <MoviesListCard
                                            key={listItem.id}
                                            id={listItem.id}
                                            title={listItem.properties.Name.title[0].text.content}
                                            poster_path={listItem.properties.Poster.url || listItem.cover.external.url}
                                            release_date={listItem.properties['Release Date'].date.start || ''}
                                            link={`https://www.themoviedb.org/movie/${listItem.id}`}
                                            handleStatusChange={handleInputChange}
                                            statusList={movieStatusList}
                                            status={listItem.properties.Status.status.name}
                                            trailer={listItem.properties.Trailer.url}
                                            overview={listItem.properties['Overview']?.rich_text[0]?.text?.content}
                                            rating={listItem.properties['My Rating'].number}
                                            watch_link={listItem.properties['Watch Link'].url}
                                            notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, '')}`}
                                        />
                                    ))
                                }
                            </>
                        ) : list[0].properties.Type.select.name === "Book" || list[0].properties.Type.select.name === "Article" ? (
                            <>
                                {list
                                    .slice(0, displayCount)
                                    .map((listItem: any) => (
                                        <BooksListCard
                                            key={listItem.id}
                                            id={listItem.id}
                                            title={listItem.properties.Title.title[0].text.content}
                                            cover={listItem.properties['Cover Image'].url}
                                            published_date={listItem.properties['Published Date'].date.start || ''}
                                            link={`google.com/books/${listItem.id}`}
                                            handleStatusChange={handleInputChange}
                                            statusList={bookStatusList}
                                            status={listItem.properties.Status.status.name}
                                            rating={listItem.properties['My Rating'].number}
                                            description={listItem.properties['Description']?.rich_text[0]?.text?.content}
                                            pageCount={listItem.properties['Page Count'].number}
                                            author={listItem.properties['Authors']?.rich_text[0]?.text?.content}
                                            notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, '')}`}
                                        />
                                    ))
                                }
                            </>
                        ) : (
                            <h1 className="">No Lists</h1>
                        )}
                        {displayCount < list.length && (
                            <LoadMore
                                displayCount={displayCount}
                                setDisplayCount={setDisplayCount}
                                media={list}
                            />
                        )}
                    </div>
                </div>
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
            },
        };
    }

    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const baseUrl = process.env.BASE_URL as string;

    const fetchUser = async () => {
        const response = await fetch(`${baseUrl}/api/getUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: session?.user?.email }),
        });
        const user = await response.json();

        if (!user.notionApiKey)
            return { movies: [], moviesDatabaseName: '', books: [], booksDatabaseName: '' };

        const notionApiKey = user.notionApiKey;
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);

        const notion = new Client({ auth: decryptedNotionApiKey });

        const fetchAllPages = async (databaseId: string) => {
            const allResults = [];

            // do {
            const response = await notion.databases.query({
                database_id: databaseId,
                // start_cursor: cursor,
                // page_size: 40,
            });

            allResults.push(...response.results);
            //     cursor = response.next_cursor;
            // } while (cursor);

            return allResults;
        };

        const nameList = [];
        let movies = [] as any;
        let books = [] as any;
        let movieStatusList = [] as any;
        let movieTypeList = [] as any;
        let bookStatusList = [] as any;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;

            const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;
            nameList.push({ databaseName: moviesDatabaseName });

            movieStatusList = moviesDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);
            movieTypeList = moviesDatabaseInfo.properties.Type.select.options.map((type: any) => type.name);
            movies = await fetchAllPages(decryptedMoviesPageLink);
        } else {
            movies = { results: [] };
        }

        if (user.booksPageLink) {
            const decryptedBooksPageLink = decryptData(user.booksPageLink, encryptionKey);
            const booksDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedBooksPageLink }) as any;

            const booksDatabaseName = booksDatabaseInfo.icon.emoji + booksDatabaseInfo.title[0].plain_text;
            nameList.push({ databaseName: booksDatabaseName });

            bookStatusList = booksDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);
            books = await fetchAllPages(decryptedBooksPageLink);
        } else {
            books = { results: [] };
        }

        return {
            movies,
            books,
            nameList,
            movieStatusList,
            bookStatusList,
            movieTypeList
        };
    };

    const { movies, books, nameList, movieStatusList, bookStatusList, movieTypeList } = await fetchUser();

    return {
        props: {
            movies,
            books,
            nameList,
            movieStatusList,
            bookStatusList,
            movieTypeList
        },
    };
}
