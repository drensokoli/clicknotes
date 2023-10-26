import React, { use } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';
import Link from 'next/link';

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
    onApiResponse: (error: string) => void;
    language?: string;
    price?: number;
    publisher?: string;
    availability?: string;
    cryptoKey: string;
}


const Book: React.FC<BookProps> = ({
    id,
    title,
    description,
    publishedDate,
    averageRating,
    authors,
    infoLink,
    pageCount,
    thumbnail,
    cover_image,
    previewLink,
    onApiResponse,
    language,
    price,
    publisher,
    availability,
    cryptoKey
}) => {
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
            const defaultDate = '0001-01-01'

            if (description) {
                if (description.length >= 2000) {
                    description = description.slice(0, 1995) + '...';
                }
            }

            const bookData = {
                id: id,
                title: title,
                description: description || '',
                publishedDate: publishedDate || defaultDate,
                averageRating: averageRating || 0,
                authors: authors || [],
                thumbnail: thumbnail || '',
                cover_image: cover_image || 'https://www.frontlist.in/storage/uploads/2019/10/Google-Books-Update.png',
                previewLink: previewLink || '',
                language: language || '',
                publisher: publisher || '',
                pageCount: pageCount || 0,
            };

            const notionResponse = await fetch('/api/addBookToNotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notionApiKey: decryptData(user.notionApiKey, cryptoKey),
                    db_id: decryptData(user.booksPageLink, cryptoKey),
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

    return (
        <div key={id} className="movie-card" >
            <div className="movie-card-image-container">
                <div className='movie-image'>
                    {cover_image ? (
                        <Image
                            src={cover_image} height={300} width={200}
                            alt={title}

                            className="h-[300px] rounded-sm"
                        />
                    ) : (
                        <div className="w-[200px] h-[300px]"></div>
                    )}
                    <Link href={`http://books.google.com/books?id=${id}`} passHref target='_blank'>
                        <Image
                            src="/share-black.png"
                            className="arrows"
                            alt=""
                            width={30}
                            height={30} />
                    </Link>
                    <button type="button"
                        className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                        onClick={() => {
                            session ? handleAddToNotion() : signIn('google')
                        }}
                    >
                        Add to Notion
                    </button>
                </div>
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
