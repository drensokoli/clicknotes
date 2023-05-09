import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, movieData } = req.body;

    try {
        const notion = new Client({ auth: notionApiKey });

        const response = await notion.pages.create({
            parent: {
                database_id: db_id,
            },
            properties: {
                'Name': {
                    title: [
                        {
                            text: {
                                content: movieData.title,
                            },
                        },
                    ],
                },
            },
        });


        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "It didn't work G" });
    }
}
