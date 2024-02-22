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

            const page = await notion.pages.retrieve({
                page_id: existingPageId,
            });

            const existingProperties = (page as any).properties;
            const updatedProperties = {} as any;

            if (existingProperties['Title'] && bookData.title) {
                updatedProperties['Title'] = {
                    title: [{ text: { content: bookData.title } }],
                };
            }

            if (existingProperties['Type']) {
                updatedProperties['Type'] = {
                    select: {
                        name: 'Book',
                    },
                };
            }

            if (existingProperties['Google Books Link'] && bookData.previewLink) {
                updatedProperties['Google Books Link'] = {
                    url: bookData.previewLink,
                };
            }

            if (existingProperties['Published Date'] && bookData.publishedDate) {
                updatedProperties['Published Date'] = {
                    date: {
                        start: bookData.publishedDate,
                    },
                };
            }

            if (existingProperties['Average Rating'] && bookData.averageRating) {
                updatedProperties['Average Rating'] = {
                    number: bookData.averageRating,
                };
            }

            if (existingProperties['Authors'] && bookData.authors) {
                updatedProperties['Authors'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.authors.join(', '),
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Language'] && bookData.language) {
                updatedProperties['Language'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.language,
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Publisher'] && bookData.publisher) {
                updatedProperties['Publisher'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.publisher,
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Page Count'] && bookData.pageCount) {
                updatedProperties['Page Count'] = {
                    number: bookData.pageCount,
                };
            }

            if (existingProperties['Description'] && bookData.description) {
                updatedProperties['Description'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.description,
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Cover Image'] && bookData.cover_image) {
                updatedProperties['Cover Image'] = {
                    url: bookData.cover_image,
                };
            }

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

            if (existingProperties['Title'] && bookData.title) {
                updatedProperties['Title'] = {
                    title: [{ text: { content: bookData.title } }],
                };
            }

            if (existingProperties['Type']) {
                updatedProperties['Type'] = {
                    select: {
                        name: 'Book',
                    },
                };
            }

            if (existingProperties['Google Books Link'] && bookData.previewLink) {
                updatedProperties['Google Books Link'] = {
                    url: bookData.previewLink,
                };
            }

            if (existingProperties['Published Date'] && bookData.publishedDate) {
                updatedProperties['Published Date'] = {
                    date: {
                        start: bookData.publishedDate,
                    },
                };
            }

            if (existingProperties['Average Rating'] && bookData.averageRating) {
                updatedProperties['Average Rating'] = {
                    number: bookData.averageRating,
                };
            }

            if (existingProperties['Authors'] && bookData.authors) {
                updatedProperties['Authors'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.authors.join(', '),
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Language'] && bookData.language) {
                updatedProperties['Language'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.language,
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Publisher'] && bookData.publisher) {
                updatedProperties['Publisher'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.publisher,
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Page Count'] && bookData.pageCount) {
                updatedProperties['Page Count'] = {
                    number: bookData.pageCount,
                };
            }

            if (existingProperties['Description'] && bookData.description) {
                updatedProperties['Description'] = {
                    rich_text: [
                        {
                            text: {
                                content: bookData.description,
                            },
                        },
                    ],
                };
            }

            if (existingProperties['Cover Image'] && bookData.cover_image) {
                updatedProperties['Cover Image'] = {
                    url: bookData.cover_image,
                };
            }

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