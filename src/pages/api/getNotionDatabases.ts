import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userEmail, listType } = req.body;

        const dbName = process.env.MONGODB_DB_NAME;
        const dbCollection = 'connections';

        if (!dbName || !dbCollection) {
            throw new Error('Database name or collection not defined');
        }

        let filter: any = {};
        let connectionType: string = '';

        if (listType === 'movies') {
            connectionType = 'movies'
            filter = { property: 'Type', select: { equals: 'Movie' } };
        } else if (listType === 'tvshows') {
            connectionType = 'movies'
            filter = { property: 'Type', select: { equals: 'TvShow' } };
        } else if (listType === 'books') {
            connectionType = 'books'
            filter = { property: 'Type', select: { equals: 'Book' } };
        }

        const client = await clientPromise;
        const collection = client.db(dbName)?.collection(dbCollection);
        const connection = await collection?.findOne({ email: userEmail, connection_type: connectionType });

        if (!connection || !connection.access_token || !connection.template_id) {
            res.status(404).json({ message: 'Connection not found' });
            return;
        }

        const notionApiKey = connection.access_token;
        const databaseId = connection.template_id;

        const notion = new Client({ auth: notionApiKey });

        const fetchAllPages = async (databaseId: string, filter: any) => {
            const response = await notion.databases.query({
                database_id: databaseId,
                filter: filter,
                page_size: 3,
            });

            return response.results;
        };

        const list = await fetchAllPages(databaseId, filter);

        const databaseInfo = await notion.databases.retrieve({ database_id: databaseId }) as any;
        const emoji = databaseInfo.icon.emoji ? databaseInfo.icon.emoji : '';
        const title = databaseInfo.title[0].plain_text;
        const databaseName = emoji + title;

        res.status(200).json({ list, databaseName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}