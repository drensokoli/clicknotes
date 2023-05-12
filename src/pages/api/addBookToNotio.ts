import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, bookData } = req.body;

    try {
        const notion = new Client({ auth: notionApiKey });

        const existingPages = await notion.databases.query({
            database_id: db_id,
            filter: {
                property: 'ID',
                number: {
                    equals: bookData.id,
                },
            },
        });

        const authorsArray = bookData.authors.map((author: string) => ({ "name": author }));

        if (existingPages.results.length > 0) {
            // Update the existing page
            const existingPageId = existingPages.results[0].id;

            await notion.pages.update({
                page_id: existingPageId,
                properties: {
                    'ID': {
                        number: bookData.id,
                    },
                    'Name': {
                        title: [
                            {
                                text: {
                                    content: bookData.title,
                                },
                            },
                        ],
                    },
                    'Publication Date': {
                        date: {
                            start: bookData.publishedDate,
                        },
                    },
                    'Authors': {
                        multi_select: authorsArray,
                    },
                    'Rating': {
                        number: bookData.averageRating,
                    },
                    'Google Books Link': {
                        url: bookData.infoLink,
                    },
                    'Type': {
                        select: {
                            name: 'Book',
                        },
                    },
                    'Status': {
                        select: {
                            name: 'To read',
                        },
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '📚',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: bookData.thumbnail,
                    },
                },
            });
        } else {
            const newPage = await notion.pages.create({
                parent: {
                    database_id: db_id,
                },
                properties: {
                    'ID': {
                        number: bookData.id,
                    },
                    'Name': {
                        title: [
                            {
                                text: {
                                    content: bookData.title,
                                },
                            },
                        ],
                    },
                    'Publication Date': {
                        date: {
                            start: bookData.publishedDate,
                        },
                    },
                    'Authors': {
                        multi_select: authorsArray,
                    },
                    'Rating': {
                        number: bookData.averageRating,
                    },
                    'Google Books Link': {
                        url: bookData.infoLink,
                    },
                    'Type': {
                        select: {
                            name: 'Book',
                        },
                    },
                    'Status': {
                        select: {
                            name: 'To read',
                        },
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '📚',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: bookData.thumbnail,
                    },
                },
            });

            const contentUpdateResponse = await notion.blocks.children.append({
                block_id: newPage.id,
                children: [
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: bookData.thumbnail,
                        },
                    },
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [
                                {
                                    type: 'text',
                                    text: {
                                        content: bookData.description,
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
        }

        res.status(200).json({ message: "Book added/updated to Notion.", bookData });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating book to Notion.", error });
    }
}