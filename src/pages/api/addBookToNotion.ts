import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, bookData } = req.body;

    const checkProperties = [
        { name: 'Title', type: 'title', structure: [{ text: { content: bookData.title } }], data: bookData.title },
        { name: 'Type', type: 'select', structure: { name: 'Book' }, data: bookData.title },
        { name: 'Google Books Link', type: 'url', structure: bookData.previewLink, data: bookData.previewLink },
        { name: 'Published Date', type: 'date', structure: { start: bookData.publishedDate }, data: bookData.publishedDate },
        { name: 'Average Rating', type: 'number', structure: bookData.averageRating, data: bookData.averageRating },
        { name: 'Authors', type: 'multi_select', structure: bookData.authors, data: bookData.authors},
        { name: 'Language', type: 'select', structure: { name: bookData.language }, data: bookData.language },
        { name: 'Publisher', type: 'select', structure: { name: bookData.publisher }, data: bookData.publisher },
        { name: 'Page Count', type: 'number', structure: bookData.pageCount, data: bookData.pageCount },
        { name: 'Description', type: 'rich_text', structure: [{ text: { content: bookData.description } }], data: bookData.description },
        { name: 'Cover Image', type: 'url', structure: bookData.cover_image, data: bookData.cover_image }
    ];

    try {
        const notion = new Client({ auth: notionApiKey });

        const existingPages = await notion.databases.query({
            database_id: db_id,
            filter: {
                property: 'ID',
                rich_text: {
                    equals: bookData.id,
                },
            },
        });

        if (existingPages.results.length > 0) {
            const existingPageId = existingPages.results[0].id;

            const page = await notion.pages.retrieve({
                page_id: existingPageId,
            });

            const existingProperties = (page as any).properties;
            const updatedProperties = {} as any;

            checkProperties.forEach((property) => {
                if (existingProperties[property.name] && property.data) {
                    updatedProperties[property.name] = {
                        [property.type]: property.structure,
                    };
                }
            });

            await notion.pages.update({
                page_id: existingPageId,
                properties: updatedProperties,
                icon: {
                    type: 'emoji',
                    emoji: '📚',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: bookData.cover_image || 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png',
                    },
                },
            });

            const pageUrl = `https://www.notion.so/${existingPageId.replace(/-/g, '')}`;

            res.status(200).json({ message: "Book added/updated to Notion.", pageUrl });
        } else {

            const newPage = await notion.pages.create({
                parent: {
                    database_id: db_id,
                },
                properties: {
                    'ID': {
                        rich_text: [
                            {
                                text: {
                                    content: bookData.id,
                                },
                            },
                        ],
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '📚',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: bookData.cover_image,
                    },
                },
            });

            const existingProperties = (newPage as any).properties;
            const updatedProperties = {} as any;

            checkProperties.forEach((property) => {
                if (existingProperties[property.name] && property.data) {
                    updatedProperties[property.name] = {
                        [property.type]: property.structure,
                    };
                }
            });

            await notion.pages.update({
                page_id: newPage.id,
                properties: updatedProperties,
            });

            const contentUpdateResponse = await notion.blocks.children.append({
                block_id: newPage.id,
                children: [
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
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: bookData.cover_image,
                            caption: [
                                {
                                    type: 'text',
                                    text: {
                                        content: 'Book Cover Image',
                                    },
                                },
                            ],
                        },
                    }
                ],
            });

            const pageUrl = `https://www.notion.so/${newPage.id.replace(/-/g, '')}`;

            res.status(200).json({ message: "Book added/updated to Notion.", pageUrl });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating book to Notion.", error });
    }
}