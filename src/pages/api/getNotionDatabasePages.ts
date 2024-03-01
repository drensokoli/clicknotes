import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { userEmail, listName, cursor, statusFilter } = req.body;
    const encryptionKey = process.env.ENCRYPTION_KEY as string;

    const client = await clientPromise;
    const collection = client.db("users")?.collection("users");
    const user = await collection?.findOne({ email: userEmail });

    const notionApiKey = user?.notionApiKey;
    const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);
    const notion = new Client({ auth: decryptedNotionApiKey });

    let databaseId;
    let filter = {} as any;

    switch (listName) {
        case 'movies':
            databaseId = decryptData(user?.moviesPageLink, encryptionKey);
            filter = { property: 'Type', select: { equals: 'Movie' } };
            break;
        case 'tvshows':
            databaseId = decryptData(user?.moviesPageLink, encryptionKey);
            filter = { property: 'Type', select: { equals: 'TvShow' } };
            break;
        case 'books':
            databaseId = decryptData(user?.booksPageLink, encryptionKey);
            filter = { property: 'Type', select: { equals: 'Book' } };
            break;
        default:
            databaseId = '';
            break;
    }

    let list = [] as any;
    let nextCursor;

    if (databaseId) {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {...filter},
                    {
                        property: 'Status',
                        status: { equals: statusFilter }
                    },
                ]
            },
            start_cursor: cursor,
            page_size: 30
        });

        list = response.results;
        nextCursor = response.next_cursor;

    } else {
        res.status(500).json({ message: "No connected Notion databases found" });
        return;
    }

    res.status(200).json({ list, nextCursor });
}