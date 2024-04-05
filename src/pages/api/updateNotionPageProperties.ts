import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userEmail, connectionType, pageId, rating, review } = req.body;
    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const dbName = process.env.MONGODB_DB_NAME;
    const dbCollection = 'connections';

    if (!dbName || !dbCollection) {
        return res.status(500).json({ error: 'Database name or collection not defined' });
    }

    try {
        const client = await clientPromise;
        const collection = client.db(dbName).collection(dbCollection);
        const connection = await collection.findOne({ email: userEmail, connection_type: connectionType });

        if (!connection) {
            return res.status(404).json({ error: 'Connection not found' });
        }

        const notionApiKey = connection.access_token;
        const decryptedApiKey = decryptData(notionApiKey, encryptionKey);
        const notion = new Client({ auth: decryptedApiKey });

        const properties: { [key: string]: any } = {};

        if (rating) {
            properties['My Rating'] = { number: rating };
        }

        if (review) {
            properties['Review'] = {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: review,
                        },
                    },
                ],
            };
        }

        if (Object.keys(properties).length === 0) {
            return res.status(400).json({ error: 'No properties provided' });
        }

        await notion.pages.update({ page_id: pageId, properties });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating Notion page:', error);
        return res.status(500).json({ error: 'An error occurred while updating the Notion page' });
    }
}