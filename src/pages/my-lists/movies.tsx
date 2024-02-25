import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';
import MoviesListCard from "@/components/Helpers/MoviesListCard";

export default function Movies({ movies, movieStatusList }: { movies: any, movieStatusList: any }) {

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

                <div className="flex justify-end items-center w-[90%] sm:w-[70%] gap-2 overflow-auto">
                    <div>
                        <select
                            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => setList(movies.filter((movie: any) => movie.properties.Status.status.name === e.target.value))}
                        >
                            {movieStatusList.map((list: any) => (
                                <option key={list} value={list}>
                                    {list}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-0'>
                    {movies ? (
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
            return { movies: [] };

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

        let movies = [] as any;
        let movieStatusList = [] as any;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;

            const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;
            movieStatusList = moviesDatabaseInfo.properties.Status.status.options.map((status: any) => status.name);
            movies = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'Movie' } });
        } else {
            movies = { results: [] };
        }

        return {
            movies,
            movieStatusList,
        };
    };

    const { movies, movieStatusList } = await fetchUser();

    return {
        props: {
            movies,
            movieStatusList,
        },
    };
}
