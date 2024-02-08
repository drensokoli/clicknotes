// pages/api/notionData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_API_TOKEN, // Use your Notion integration token
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { notionApiKey, db_id } = req.body;


    try {
        const notion = new Client({ auth: notionApiKey });

        const response = await notion.databases.query({
            database_id: db_id,
        });

        res.status(200).json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
