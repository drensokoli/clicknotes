import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { userEmail, connectionType, pageId, status } = req.body;
    const encryptionKey = process.env.ENCRYPTION_KEY as string;

    const dbName = process.env.MONGODB_DB_NAME;
    const dbCollection = 'connections';

    if (!dbName || !dbCollection) {
        throw new Error('Database name or collection not defined');
    }

    const client = await clientPromise;
    const collection = client.db(dbName)?.collection(dbCollection);
    const connection = await collection?.findOne({ email: userEmail, connection_type: connectionType });

    const notionApiKey = connection?.access_token;
    const decryptedApiKey = decryptData(notionApiKey, encryptionKey);

    const notion = new Client({ auth: decryptedApiKey });

    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            Status: {
                status: {
                    name: status,
                },
            },
        },
    });

    res.status(200).json({ success: true }); // Send a JSON response
}