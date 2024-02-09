import Card from "@/components/Helpers/Card";
import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getMovies } from "@/lib/notion";
import { getSession } from "next-auth/react";
import { useState } from "react";
import fetch from 'node-fetch';

export default function Gallery({ movies }: { movies: any }) {

    const [input, setInput] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container sm:w-5/6">
                    <div className="movie-container grid grid-cols-2 gap-2 sm:grid-cols-1">
                        {movies ? (
                            <>
                                {movies.map((movie: any) => (
                                    <Card
                                        key={movie.id}
                                        id={movie.id}
                                        title={movie.properties.Name.title[0].text.content}
                                        poster_path={movie.properties.Poster.url || movie.cover.external.url}
                                        release_date="2002"
                                        link={`https://www.themoviedb.org/movie/${movie.id}`}
                                        handleAddToNotion={handleInputChange}
                                    />
                                ))}
                            </>
                        ) : (
                            <p>No movies found</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const session = await getSession(context);

    // if (!session) {
    //     return {
    //         redirect: {
    //             destination: '/movies',
    //         },
    //     };
    // }

    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const url = process.env.URL;
    const userEmail = session?.user?.email;

    async function fetchMovies() {
        const response = await fetch(`${url}/api/getUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail }),
        });
        const user = await response.json();

        const notionApiKey = user.notionApiKey;
        const databaseId = user.moviesPageLink;
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);
        const decryptedDatabaseId = decryptData(databaseId, encryptionKey);

        const data = await getMovies(decryptedNotionApiKey, decryptedDatabaseId);

        return data;

    };

    const movies = await fetchMovies();

    return {
        props: {
            session,
            movies,
        },
    };
}