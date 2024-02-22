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
                rich_text: {
                    equals: bookData.id,
                },
            },
        });

        if (existingPages.results.length > 0) {
            const existingPageId = existingPages.results[0].id;

            await notion.pages.update({
                page_id: existingPageId,
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
                    'Title': {
                        title: [
                            {
                                text: {
                                    content: bookData.title,
                                },
                            },
                        ],
                    },
                    'Type': {
                        select: {
                            name: 'Book',
                        },
                    },
                    'Google Books Link': {
                        url: bookData.previewLink,
                    },
                    'Published Date': {
                        "date": {
                            "start": bookData.publishedDate
                        }
                    },
                    'Average Rating': {
                        "number": bookData.averageRating
                    },
                    'Authors': {
                        "rich_text": [
                            {
                                "text": {
                                    "content": bookData.authors.join(', ')
                                }
                            }
                        ]
                    },
                    'Language': {
                        "rich_text": [
                            {
                                "text": {
                                    "content": bookData.language
                                }
                            }
                        ]
                    },
                    'Publisher': {
                        "rich_text": [
                            {
                                "text": {
                                    "content": bookData.publisher
                                }
                            }
                        ]
                    },
                    'Page Count': {
                        "number": bookData.pageCount
                    },
                    'Description': {
                        rich_text: [
                            {
                                text: {
                                    content: bookData.description,
                                },
                            },
                        ],
                    },
                    'Cover Image': {
                        url: bookData.cover_image,
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '📚',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: bookData.cover_image  || 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png',
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
                    'Title': {
                        title: [
                            {
                                text: {
                                    content: bookData.title,
                                },
                            },
                        ],
                    },
                    'Type': {
                        select: {
                            name: 'Book',
                        },
                    },
                    'Google Books Link': {
                        url: bookData.previewLink,
                    },
                    'Published Date': {
                        "date": {
                            "start": bookData.publishedDate
                        }
                    },
                    'Average Rating': {
                        "number": bookData.averageRating
                    },
                    'Authors': {
                        "rich_text": [
                            {
                                "text": {
                                    "content": bookData.authors.join(', ')
                                }
                            }
                        ]
                    },
                    'Language': {
                        "rich_text": [
                            {
                                "text": {
                                    "content": bookData.language
                                }
                            }
                        ]
                    },
                    'Publisher': {
                        "rich_text": [
                            {
                                "text": {
                                    "content": bookData.publisher
                                }
                            }
                        ]
                    },
                    'Page Count': {
                        "number": bookData.pageCount
                    },
                    'Description': {
                        rich_text: [
                            {
                                text: {
                                    content: bookData.description,
                                },
                            },
                        ],
                    },
                    'Cover Image': {
                        url: bookData.cover_image,
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