import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';
import ListsCard from "@/components/Helpers/ListsCard";

export default function MyLists({ movies, tvShows, books }: { movies: any, tvShows: any, books: any }) {

    return (
        <>
            <div className="min-h-screen flex-grow">
                <div className="w-full sm:px-20 px-4">
                    <h1 className="text-sm text-gray-500">MY LISTS</h1>
                </div>
                <hr className="sm:mx-20 mx-4 border-gray-500 py-2" />
                <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-4 sm:px-20 px-4">
                    {movies.length > 0 && (
                        <ListsCard name="Movies" id={movies[0].parent.database_id} list={movies} path="/my-lists/movies" />
                    )}
                    {tvShows.length > 0 && (
                        <ListsCard name="TV Shows" id={tvShows[0].parent.database_id} list={tvShows} path="/my-lists/tvshows" />
                    )}
                    {books.length > 0 && (
                        <ListsCard name="Books" id={books[0].parent.database_id} list={books} path="/my-lists/books" />
                    )}
                </div>
                <div className="w-full sm:px-20 px-4 mt-8">
                    <h1 className="text-sm text-gray-500">MY COLLECTIONS</h1>
                </div>
                <hr className="sm:mx-20 mx-4 border-gray-500 py-2" />
                <h1 className="text-center">Coming Soon ...</h1>
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
            return { movies: [], tvShows: [], books: [] };

        const notionApiKey = user.notionApiKey;
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);

        const notion = new Client({ auth: decryptedNotionApiKey });

        const fetchAllPages = async (databaseId: string, filter: any) => {
            const allResults = [];

            const response = await notion.databases.query({
                database_id: databaseId,
                filter: filter,
                page_size: 3,
            });

            allResults.push(...response.results);
            return allResults;
        };

        let movies = [] as any;
        let tvShows = [] as any;
        let books = [] as any;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;

            const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;

            movies = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'Movie' } });
            tvShows = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'TvShow' } });
        } else {
            movies = { results: [] };
            tvShows = { results: [] };
        }

        if (user.booksPageLink) {
            const decryptedBooksPageLink = decryptData(user.booksPageLink, encryptionKey);
            const booksDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedBooksPageLink }) as any;

            const booksDatabaseName = booksDatabaseInfo.icon.emoji + booksDatabaseInfo.title[0].plain_text;

            books = await fetchAllPages(decryptedBooksPageLink, { property: 'Type', select: { equals: 'Book' } });
        } else {
            books = { results: [] };
        }

        return {
            movies,
            tvShows,
            books
        };
    };

    const { movies, tvShows, books } = await fetchUser();

    return {
        props: {
            movies,
            tvShows,
            books
        },
    };
}
