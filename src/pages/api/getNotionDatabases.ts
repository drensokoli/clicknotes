import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userEmail } = req.body;
        const encryptionKey = process.env.ENCRYPTION_KEY as string;

        const dbName = process.env.MONGODB_DB_NAME;
        const dbCollection = process.env.MONGODB_COLLECTION;

        if (!dbName || !dbCollection) {
            throw new Error('Database name or collection not defined');
        }

        const client = await clientPromise;
        const collection = client.db(dbName)?.collection(dbCollection);
        const user = await collection?.findOne({ email: userEmail });

        if (!user?.notionApiKey || (!user?.moviesPageLink && !user?.booksPageLink)) {
            res.status(500).json({ message: "No connected Notion databases found" });
            return;
        }

        const notionApiKey = user.notionApiKey;
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);
        const decryptedMoviesPageLink = decryptData(user.moviesPageLink, encryptionKey);
        const decryptedBooksPageLink = decryptData(user.booksPageLink, encryptionKey);

        const notion = new Client({ auth: decryptedNotionApiKey });

        const fetchAllPages = async (databaseId: string, filter: any) => {
            const response = await notion.databases.query({
                database_id: databaseId,
                filter: filter,
                page_size: 3,
            });

            return response.results;
        };

        const movies = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'Movie' } });
        const tvShows = await fetchAllPages(decryptedMoviesPageLink, { property: 'Type', select: { equals: 'TvShow' } });
        const books = await fetchAllPages(decryptedBooksPageLink, { property: 'Type', select: { equals: 'Book' } });

        const moviesDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedMoviesPageLink }) as any;
        const moviesDatabaseName = moviesDatabaseInfo.icon.emoji + moviesDatabaseInfo.title[0].plain_text;

        const booksDatabaseInfo = await notion.databases.retrieve({ database_id: decryptedBooksPageLink }) as any;
        const booksDatabaseName = booksDatabaseInfo.icon.emoji + booksDatabaseInfo.title[0].plain_text;

        res.status(200).json({ movies, tvShows, books, moviesDatabaseName, booksDatabaseName});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}