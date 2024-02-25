import Card from "@/components/Helpers/Card";
import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';
import MoviesListCard from "@/components/Helpers/MoviesListCard";
import LoadMore from "@/components/Helpers/LoadMore";
import BooksListCard from "@/components/Helpers/BooksListCard";
import Filter from "@/components/Helpers/Filter";

export default function Lists({ databaseNameList, movies, tvShows, movieStatusList, movieTypeList, books, bookStatusList }: { databaseNameList: any, movies: any, tvShows: any, movieStatusList: any, movieTypeList: any, books: any, bookStatusList: any }) {

    const [input, setInput] = useState('');
    const [displayCount, setDisplayCount] = useState(20);
    const [list, setList] = useState(movies);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);
    };

    return (
        <>

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />

                <div className="flex justify-start items-center w-[90%] sm:w-[70%] gap-2 overflow-auto">
                    <div>
                        <select
                            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => setList(e.target.value === databaseNameList[0].databaseName ? movies : books)}
                        >
                            {databaseNameList.map((list: { databaseName: any; }) => (
                                <option key={list.databaseName} value={list.databaseName}>
                                    {list.databaseName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {list == movies || list == tvShows ? (
                        <>
                            <div>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(e) => setList(e.target.value === movieTypeList[0] ? movies : tvShows)}
                                >
                                    {movieTypeList.map((list: any) => (
                                        <option key={list} value={list}>
                                            {list}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(e) => setList(list.filter((movie: any) => movie.properties.Status.status.name === e.target.value))}
                                >
                                    {movieStatusList.map((list: any) => (
                                        <option key={list} value={list}>
                                            {list}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : null}
                    {list == books ? (
                        <div>
                            <select
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    setList(list.filter((book: any) => book.properties.Status.status.name === e.target.value));
                                    console.log("list", list);
                                }}
                            >
                                {bookStatusList.map((list: any) => (
                                    <option key={list} value={list}>
                                        {list}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}
                </div>

                <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-0'>
                    {list == movies ? (
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
                    ) : list == tvShows ? (
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
                    ) : list == books ? (
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
                    ) : null}

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

        const fetchAllPages = async (databaseId: string, filter: any) => {
            const allResults = [];

            const response = await notion.databases.query({
                database_id: databaseId,
                filter: filter,
                page_size: 30,
                // start_cursor: cursor,
            });

            allResults.push(...response.results);
            return allResults;
        };

        const databaseNameList = [];
        let movies = [] as any;
        let tvShows = [] as any;
        let books = [] as any;
        let movieStatusList = [] as any;
        let movieTypeList = [] as any;
        let bookStatusList = [] as any;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;

            const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;
            databaseNameList.push({ databaseName: moviesDatabaseName });

            movieStatusList = moviesDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);
            movieTypeList = moviesDatabaseInfo.properties.Type.select.options.map((type: any) => type.name);
            movies = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'Movie' } });
            tvShows = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'TvShow' } });
        } else {
            movies = { results: [] };
        }

        if (user.booksPageLink) {
            const decryptedBooksPageLink = decryptData(user.booksPageLink, encryptionKey);
            const booksDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedBooksPageLink }) as any;

            const booksDatabaseName = booksDatabaseInfo.icon.emoji + booksDatabaseInfo.title[0].plain_text;
            databaseNameList.push({ databaseName: booksDatabaseName });

            bookStatusList = booksDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);
            books = await fetchAllPages(decryptedBooksPageLink, { property: 'Type', select: { equals: 'Book' } });
        } else {
            books = { results: [] };
        }

        return {
            databaseNameList,
            movies,
            tvShows,
            movieStatusList,
            movieTypeList,
            books,
            bookStatusList
        };
    };

    const { databaseNameList, movies, tvShows, movieStatusList, movieTypeList, books, bookStatusList } = await fetchUser();

    return {
        props: {
            databaseNameList,
            movies,
            tvShows,
            movieStatusList,
            movieTypeList,
            books,
            bookStatusList
        },
    };
}
