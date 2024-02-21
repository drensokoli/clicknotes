import Card from "@/components/Helpers/Card";
import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Client } from '@notionhq/client';

export default function Lists({ movies, books, nameList, movieStatusList, bookStatusList }: { movies: any, books: any, nameList: any, movieStatusList: any, bookStatusList: any }) {

    const [input, setInput] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);
    };

    return (
        <>

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="flex justify-end items-center w-[90%] sm:w-[70%] gap-2">
                    <div>
                        <select
                            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        // value={nameList[0].name}
                        >
                            {bookStatusList.map((status: any) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        // value={nameList[0].name}
                        >
                            {movieStatusList.map((status: any) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        // value={nameList[0].name}
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
                        {movies && (
                            <>
                                {movies
                                    // .filter((movie: any) => movie.properties.Status.select.name === 'To watch' || movie.properties.Status.select.name === 'Watching')
                                    .map((movie: any) => (
                                        <Card
                                            key={movie.id}
                                            id={movie.id}
                                            title={movie.properties.Name.title[0].text.content}
                                            poster_path={movie.properties.Poster.url || movie.cover.external.url}
                                            release_date=""
                                            link={`https://www.themoviedb.org/movie/${movie.id}`}
                                            handleAddToNotion={handleInputChange}
                                        />
                                    ))}
                            </>
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

        let moviesResponse, booksResponse;

        const nameList = [];
        let movieStatusList = [] as any;
        let bookStatusList = [] as any;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;

            const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;
            nameList.push({ databaseName: moviesDatabaseName });

            movieStatusList = moviesDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);

            moviesResponse = await notion.databases.query({
                database_id: decryptedMoviesPageLink,
                page_size: 20
            });
        } else {
            moviesResponse = { results: [] };
        }

        if (user.booksPageLink) {
            const decryptedBooksPageLink = decryptData(user.booksPageLink, encryptionKey);
            const booksDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedBooksPageLink }) as any;

            const booksDatabaseName = booksDatabaseInfo.icon.emoji + booksDatabaseInfo.title[0].plain_text;
            nameList.push({ databaseName: booksDatabaseName });

            bookStatusList = booksDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);

            booksResponse = await notion.databases.query({
                database_id: decryptedBooksPageLink,
                page_size: 20
            });
        } else {
            booksResponse = { results: [] };
        }

        return {
            movies: moviesResponse.results,
            books: booksResponse.results,
            nameList,
            movieStatusList,
            bookStatusList
        };
    };

    const { movies, books, nameList, movieStatusList, bookStatusList } = await fetchUser();

    return {
        props: {
            movies,
            books,
            nameList,
            movieStatusList,
            bookStatusList
        },
    };
}
