import Card from "@/components/Helpers/Card";
import SearchBar from "@/components/Helpers/SearchBar";
import Movie from "@/components/Media/Movie";
import { decryptData } from "@/lib/encryption";
import { getMovies, getMoviesInSSR } from "@/lib/notion";
import { set } from "lodash";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Client } from '@notionhq/client';

export default function Lists({ encryptionKey, movies, books }: { encryptionKey: string, movies: any, books: any }) {

    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [databaseId, setDatabaseId] = useState<string>('');
    // const [movies, setMovies] = useState<any>();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);
    };

    return (
        <>

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                {movies.length === 0 && (
                    <div>
                        No movies found
                    </div>
                )}
                <div className="content-container sm:w-5/6">
                    <div className="movie-container grid grid-cols-2 gap-2 sm:grid-cols-1">
                        {movies && (
                            <>
                                {movies
                                    .filter((movie: any) => movie.properties.Status.select.name === 'To watch' || movie.properties.Status.select.name === 'Watching')
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
            return { movies: [], books: [] };

        const notionApiKey = user.notionApiKey;
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);

        const notion = new Client({ auth: decryptedNotionApiKey });

        let moviesResponse, booksResponse;

        if (user.moviesPageLink) {
            const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
            moviesResponse = await notion.databases.query({
                database_id: decryptedMoviesPageLink
            });
        } else {
            moviesResponse = { results: [] };
        }

        if (user.booksPageLink) {
            const decryptedBooksPageLink = decryptData(user.booksPageLink, encryptionKey);
            booksResponse = await notion.databases.query({
                database_id: decryptedBooksPageLink
            });
        } else {
            booksResponse = { results: [] };
        }

        return { movies: moviesResponse.results, books: booksResponse.results };
    };

    const { movies, books } = await fetchUser();

    return {
        props: {
            encryptionKey,
            movies,
            books,
        },
    };
}
