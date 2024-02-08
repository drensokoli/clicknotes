import Card from "@/components/Helpers/Card";
import SearchBar from "@/components/Helpers/SearchBar";
import Movie from "@/components/Media/Movie";
import { decryptData } from "@/lib/encryption";
import { getMovies } from "@/lib/notion";
import { set } from "lodash";
import { useSession } from "next-auth/react";
import { JSXElementConstructor, Key, ReactElement, ReactFragment, useEffect, useState } from "react";

export default function Gallery({ encryptionKey }: { encryptionKey: string }) {

    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [databaseId, setDatabaseId] = useState<string>('');
    const [movies, setMovies] = useState<any>();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);

    };

    useEffect(() => {
        if (session && !movies) {
            const fetchUser = async () => {
                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail: session?.user?.email }),
                });
                const user = await response.json();

                const notionApiKey = user.notionApiKey;
                const databaseId = user.moviesPageLink;
                const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);
                const decryptedDatabaseId = decryptData(databaseId, encryptionKey);

                setNotionApiKey(decryptedNotionApiKey);
                setDatabaseId(decryptedDatabaseId);
                const data = await getMovies(decryptedNotionApiKey, decryptedDatabaseId, setMovies);

                console.log("data: ", data);

            };
            fetchUser();
        }
    }, [session, notionApiKey, databaseId, movies, setMovies]);
    useEffect(() => {
        console.log("movies: ", movies);
    }, [movies]);

    return (
        <>

            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container sm:w-5/6">
                    <div className="movie-container grid grid-cols-2 gap-2 sm:grid-cols-1">
                        {movies && (
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
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export const getStaticProps = async () => {

    const encryptionKey = process.env.ENCRYPTION_KEY;

    return {
        props: {
            encryptionKey,
        },
    };
}