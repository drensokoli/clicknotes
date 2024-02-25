import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';

export default function MyLists({ databaseNameList, movies, tvShows, books }: { databaseNameList: any, movies: any, tvShows: any, books: any }) {



    return (
        <>
            <div className="min-h-screen flex-grow">
                <div className="flex md:flex-row flex-col justify-center gap-4 ">
                    <div className="max-w-sm rounded overflow-hidden movie-image">
                        <div className="flex flex-row justify-center items-center">
                            {movies.map((movie: any) => (
                                <img src={movie.properties.Poster.url} alt="" className="h-[200px] object-cover w-full" />
                            ))}
                        </div>
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{databaseNameList[0].databaseName} - Movies</div>
                            <p className="text-gray-700 text-base">
                                Recents:
                            </p>
                        </div>
                        <div className="px-6 pb-2">
                            {
                                movies.map((movie: any) => (
                                    <button className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:shadow-lg">{movie.properties.Name.title[0].text.content}</button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="max-w-sm rounded overflow-hidden movie-image">
                        <div className="flex flex-row justify-center items-center">
                            {tvShows.map((movie: any) => (
                                <img src={movie.properties.Poster.url} alt="" className="h-[200px] object-cover w-full" />
                            ))}
                        </div>
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{databaseNameList[0].databaseName} - TV Shows</div>
                            <p className="text-gray-700 text-base">
                                Recents:
                            </p>
                        </div>
                        <div className="px-6 pb-2">
                            {
                                tvShows.map((tvShow: any) => (
                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tvShow.properties.Name.title[0].text.content}</span>
                                ))
                            }
                        </div>
                    </div>
                    <div className="max-w-sm rounded overflow-hidden movie-image">
                        <div className="flex flex-row justify-center items-center">
                            {books.map((movie: any) => (
                                <img src={movie.properties["Cover Image"].url} alt="" className="h-[200px] object-cover w-full" />
                            ))}
                        </div>
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{databaseNameList[1].databaseName}</div>
                            <p className="text-gray-700 text-base">
                                Recents:
                            </p>
                        </div>
                        <div className="px-6 pb-2">
                            {
                                books.map((book: any) => (
                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{book.properties.Title.title[0].text.content}</span>
                                ))
                            }
                        </div>
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

        const fetchAllPages = async (databaseId: string, filter: any) => {
            const allResults = [];

            const response = await notion.databases.query({
                database_id: databaseId,
                filter: filter,
                page_size: 4,
            });

            allResults.push(...response.results);
            return allResults;
        };

        const databaseNameList = [];
        let movies = [] as any;
        let tvShows = [] as any;
        let books = [] as any;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;

            const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;
            databaseNameList.push({ databaseName: moviesDatabaseName });

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

            books = await fetchAllPages(decryptedBooksPageLink, { property: 'Type', select: { equals: 'Book' } });
        } else {
            books = { results: [] };
        }

        return {
            databaseNameList,
            movies,
            tvShows,
            books
        };
    };

    const { databaseNameList, movies, tvShows, books } = await fetchUser();

    return {
        props: {
            databaseNameList,
            movies,
            tvShows,
            books
        },
    };
}
