import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, databaseId, statusFilter, type } = req.body;
    
    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const decryptedApiKey = decryptData(notionApiKey, encryptionKey);
    
    const notion = new Client({ auth: decryptedApiKey });
    let filter = {} as any;
    switch (type) {
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

    let startCursor: any = undefined;

    const fetchPages = async (): Promise<any[]> => {
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
            start_cursor: startCursor,
        });

        startCursor = response.next_cursor;
        const pages = response.results;

        if (startCursor !== null) {
            const additionalPages = await fetchPages();
            return pages.concat(additionalPages);
        }

        return pages;
    };

    if (databaseId) {
        const allPages = await fetchPages();
        const position = Math.floor(Math.random() * allPages.length);
        const pageToFetch = allPages[position - 1];

        if (pageToFetch) {
            res.status(200).json({ page: pageToFetch });
        } else {
            res.status(404).json({ message: `Page at position ${position} not found` });
        }
    } else {
        res.status(500).json({ message: "No connected Notion databases found" });
    }
}