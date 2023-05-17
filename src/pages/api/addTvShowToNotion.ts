import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, tvShowData } = req.body;

    try {
        const notion = new Client({ auth: notionApiKey });

        const existingPages = await notion.databases.query({
            database_id: db_id,
            filter: {
                property: 'ID',
                number: {
                    equals: tvShowData.id,
                },
            },
        });

        const genresArray = [];

        if (tvShowData.firstGenre) {
            genresArray.push({ "name": tvShowData.firstGenre });
        }

        if (tvShowData.secondGenre) {
            genresArray.push({ "name": tvShowData.secondGenre });
        }

        if (tvShowData.thirdGenre) {
            genresArray.push({ "name": tvShowData.thirdGenre });
        }

        if (existingPages.results.length > 0) {
            // Update the existing page
            const existingPageId = existingPages.results[0].id;

            await notion.pages.update({
                page_id: existingPageId,
                properties: {
                    'ID': {
                        number: tvShowData.id,
                    },
                    'Name': {
                        title: [
                            {
                                text: {
                                    content: tvShowData.name,
                                },
                            },
                        ],
                    },
                    'Release Date': {
                        date: {
                            start: tvShowData.first_air_date,
                        },
                    },
                    'Genres': {
                        multi_select: genresArray,
                    },
                    'TMDB Rating': {
                        number: tvShowData.vote_average,
                    },
                    'TMDB Link': {
                        url: tvShowData.tmdb_link,
                    },
                    'Status': {
                        select: {
                            name: 'To watch',
                        },
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '📺',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: tvShowData.backdrop_path,
                    },
                },
            });

            const contentUpdateResponse = await notion.blocks.children.append({
                block_id: existingPageId,
                children: [
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: tvShowData.poster_path,
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
                                        content: tvShowData.overview,
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
        } else {
            const newPage = await notion.pages.create({
                parent: {
                    database_id: db_id,
                },
                properties: {
                    'ID': {
                        number: tvShowData.id,
                    },
                    'Name': {
                        title: [
                            {
                                text: {
                                    content: tvShowData.name,
                                },
                            },
                        ],
                    },
                    'Release Date': {
                        date: {
                            start: tvShowData.first_air_date,
                        },
                    },
                    'Genres': {
                        multi_select: genresArray,
                    },
                    'TMDB Rating': {
                        number: tvShowData.vote_average,
                    },
                    'TMDB Link': {
                        url: tvShowData.tmdb_link,
                    },
                    'Status': {
                        select: {
                            name: 'To watch',
                        },
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '📺',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: tvShowData.backdrop_path,
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
                            url: tvShowData.poster_path,
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
                                        content: tvShowData.overview,
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
        }
        res.status(200).json({ message: "TV show added/updated to Notion.", tvShowData });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating TV show to Notion.", error });
    }
}
