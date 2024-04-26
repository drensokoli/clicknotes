import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, notionApiKey } = req.body;
        const encryptionKey = process.env.ENCRYPTION_KEY as string;
        const decryptedApiKey = decryptData(notionApiKey, encryptionKey);

        const notion = new Client({ auth: decryptedApiKey });

        await notion.pages.update({
            page_id: id,
            archived: true
        });

        res.status(200).json({ message: "Page deleted successfully" });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}