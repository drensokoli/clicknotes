import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/crypto';
import Link from 'next/link';
import Card from './Card';

export default function Book({ id, title, description, publishedDate, averageRating, authors, infoLink, pageCount, thumbnail, cover_image, previewLink, onApiResponse, language, price, publisher, availability, cryptoKey }: {
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
}) {

    const { data: session } = useSession();

    const handleAddToNotion = async () => {
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
    };
    return (
        <Card
            id={id}
            title={title}
            poster_path={cover_image}
            release_date={publishedDate}
            link={`http://books.google.com/books?id=${id}`}
            handleAddToNotion={handleAddToNotion}
        />
    );

};