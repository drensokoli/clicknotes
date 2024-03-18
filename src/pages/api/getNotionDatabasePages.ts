import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { listName, cursor, statusFilter, notionApiKey, databaseId } = req.body;
	const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const decryptedApiKey = decryptData(notionApiKey, encryptionKey);
    
    const notion = new Client({ auth: decryptedApiKey });
    
    let filter = {} as any;

    switch (listName) {
        case 'movies':
            filter = { property: 'Type', select: { equals: 'Movie' } };
            break;
        case 'tvshows':
            filter = { property: 'Type', select: { equals: 'TvShow' } };
            break;
        case 'books':
            filter = { property: 'Type', select: { equals: 'Book' } };
            break;
        default:
            break;
    }

    let list = [] as any;
    let nextCursor;

    if (databaseId) {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    { ...filter },
                    {
                        property: 'Status',
                        status: { equals: statusFilter }
                    },
                ]
            },
            start_cursor: cursor,
            page_size: 20
        });

        list = response.results;
        nextCursor = response.next_cursor;

    } else {
        res.status(500).json({ message: "No connected Notion databases found" });
        return;
    }

    res.status(200).json({ list, nextCursor });
}