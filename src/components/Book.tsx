import React, { use } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';

// In Book.ts
interface BookProps {
    id: string;
    title: string;
    description: string;
    publishedDate: string;
    averageRating: number;
    authors: string[];
    infoLink: string;
    pageCount: number;
    thumbnail: string;
    cover_image?: string;
    previewLink: string;
    onClick: () => void;
    onApiResponse: (error: string) => void;
    // Add more optional properties here
    language?: string;
    price?: number;
    publisher?: string;
    availability?: string;
}


const Book: React.FC<BookProps> = ({ id, title, description, publishedDate, averageRating, authors, infoLink, pageCount, thumbnail, cover_image, previewLink, onClick, onApiResponse, language, price, publisher, availability }) => {
    const { data: session } = useSession();

    const handleAddToNotion = async () => {
        try {
            onApiResponse('Adding book to Notion...');
            const response = await fetch('/api/getUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: session?.user?.email }),
            });

            const user = await response.json();

            // Check the length of the description and slice it if needed
            if (description.length >= 2000) {
                description = description.slice(0, 1995) + '...';
            }

            const bookData = {
                id: id,
                title: title,
                description: description,
                publishedDate: publishedDate,
                averageRating: averageRating || 0,
                authors: authors,
                infoLink: infoLink,
                thumbnail: thumbnail,
                cover_image: cover_image,
                previewLink: previewLink,
                language: language,
                publisher: publisher,
                pageCount: pageCount,
            };

            const notionResponse = await fetch('/api/addBookToNotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notionApiKey: decryptData(user.notionApiKey),
                    db_id: decryptData(user.booksPageLink),
                    bookData: bookData,
                }),
            });

            if (notionResponse.ok) {
                const notionResult = await notionResponse.json();
                onApiResponse('Added book to Notion');
                console.log(notionResult);
            } else {
                onApiResponse('Error adding book to Notion');
            }
        } catch (error) {
            console.error(error);
            onApiResponse('Error adding book to Notion');
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
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                onClick={handleAddToNotion}
                            >
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
