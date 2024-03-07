import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '@/lib/encryption';
import Link from 'next/link';
import Card from '../Helpers/Card';

export default function Book({ id, title, description, publishedDate, averageRating, authors, infoLink, pageCount, thumbnail, cover_image, previewLink, onApiResponse, setPageLink, language, price, publisher, availability, encryptionKey, notionApiKey, booksDatabaseId }: {
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
    setPageLink: (pageLink: string) => void;
    language?: string;
    price?: number;
    publisher?: string;
    availability?: string;
    encryptionKey: string;
    notionApiKey: string;
    booksDatabaseId: any;
}) {

    const handleAddToNotion = async () => {
        onApiResponse('Adding book to Notion...');
        
        const defaultDate = '0001-01-01'

        if (description) {
            if (description.length >= 2000) {
                description = description.slice(0, 1995) + '...';
            }
        }

        const bookData = {
            id: id,
            title: title,
            description: description,
            publishedDate: publishedDate,
            averageRating: averageRating,
            authors: authors.map(author => ({ name: author })),
            thumbnail: thumbnail,
            cover_image: cover_image,
            previewLink: previewLink,
            language: language?.toUpperCase(),
            publisher: publisher,
            pageCount: pageCount,
        };

        const notionResponse = await fetch('/api/addBookToNotion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notionApiKey,
                db_id: booksDatabaseId,
                bookData: bookData,
            }),
        });

        if (notionResponse.ok) {
            const notionResult = await notionResponse.json();
            onApiResponse('Added book to Notion');
            setPageLink(notionResult.pageUrl);
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
            link={`https://books.google.com/books?id=${id}`}
            handleAddToNotion={handleAddToNotion}
        />
    );

};