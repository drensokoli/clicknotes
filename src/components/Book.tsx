import React, { use } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';

interface BookProps {
    id: string;
    title: string;
    description: string;
    publishedDate: string;
    rating: number;
    authors: string[];
    infoLink: string;
    pageCount: number;
    thumbnail: string;
    cover_image?: string;
    previewLink: string;
    onClick: () => void;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Book: React.FC<BookProps> = ({ id, title, description, publishedDate, rating, authors, infoLink, pageCount, thumbnail, cover_image, previewLink, onClick }) => {
    const { data: session } = useSession();

    const handleAddToNotion = async () => {
        const response = await fetch('/api/getUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: session?.user?.email }),
        });
        
        const user = await response.json();
        const rounded_rating = Math.round(rating * 10) / 10;

        const bookData = {
            id: id,
            title: title,
            description: description,
            publishedDate: publishedDate,
            rating: rounded_rating,
            authors: authors,
            infoLink: infoLink,
            pageCount: pageCount,
            thumbnail: thumbnail,
            cover_image: cover_image,
            previewLink: previewLink,
        };

        const notionResponse = await fetch('/api/addBookToNotion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notionApiKey: user.notionApiKey,
                db_id: decryptData(user.notionDbId),
                bookData: bookData,
            }),
        });

        const notionData = await notionResponse.json();

        if (notionData.error) {
            console.log(notionData.error);
        } else {
            console.log(notionData);
        }
    };

    const handleClick = () => {
        window.open(previewLink, '_blank');
    };

    return (
        <div key={id} className="movie-card" >
            <div className="movie-card-image-container">
                {cover_image ? (
                    <div className='movie-image'>

                        <Image
                            src={cover_image}
                            height={300}
                            width={200}
                            alt={title}
                            className="h-[300px] rounded-sm"
                        />

                        {!session ? (
                            <button
                                type="button"
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                onClick={() => signIn()}
                            >
                                Add to Notion
                            </button>

                        ) : (
                            <button type="button"
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                                Add to Notion
                            </button>
                        )
                        }
                        <Image src="/share.png" className="arrows" alt=""
                           onClick={handleClick} width={30} height={30} />
                    </div>
                ) : (
                    <div className='movie-image'>
                        <div className="bg-transparent backdrop-blur-sm"
                            style={{
                                width: '200px',
                                height: '300px',
                                borderRadius: '5px'
                            }}
                        ></div>

                        {!session ? (

                            <button type="button"
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                onClick={() => signIn()}
                            >
                                Add to Notion
                            </button>
                        )
                            : (
                                <button type="button"
                                    className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                                    Add to Notion
                                </button>
                            )
                        }
                        <Image src="/share-black.png" className="arrows" alt="" width={30} height={30}
                            onClick={handleClick} />
                    </div>
                )}
            </div>
            <h2 className="text-l font-bold text-center text-gray-800">
                <span>
                    {title}
                </span>
            </h2>
        </div>
    );

};

export default Book;
