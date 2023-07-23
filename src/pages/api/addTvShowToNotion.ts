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
        const castArray = [];

        for (let index = 0; index < tvShowData.genres.length; index++) {
            if (tvShowData.genres[index]) {
                const element = tvShowData.genres[index];
                genresArray.push({ "name": element });
            }
        }

        for (let index = 0; index < tvShowData.cast.length; index++) {
            if (tvShowData.cast[index]) {
                const element = tvShowData.cast[index];
                castArray.push({ "name": element });
            }
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
                    'Cast': {
                        multi_select: castArray,
                    },
                    'TMDB Rating': {
                        number: tvShowData.vote_average,
                    },
                    'TMDB Link': {
                        url: tvShowData.tmdb_link,
                    },
                    'Type': {
                        select: {
                            name: 'TvShow',
                        },
                    },                    
                    'Director': {
                        rich_text: [
                            {
                                text: {
                                    content: tvShowData.director,
                                },
                            },
                        ],
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
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: tvShowData.trailer,
                        },
                    },
                    {
                        object: 'block',
                        type: 'bookmark',
                        bookmark: {
                            url: tvShowData.tpb_link,
                        },
                    }
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
                    'Cast': {
                        multi_select: castArray,
                    },
                    'TMDB Rating': {
                        number: tvShowData.vote_average,
                    },
                    'TMDB Link': {
                        url: tvShowData.tmdb_link,
                    },
                    'Type': {
                        select: {
                            name: 'TvShow',
                        },
                    },                    
                    'Director': {
                        rich_text: [
                            {
                                text: {
                                    content: tvShowData.director,
                                },
                            },
                        ],
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
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: tvShowData.trailer,
                        },
                    },
                    {
                        object: 'block',
                        type: 'bookmark',
                        bookmark: {
                            url: tvShowData.tpb_link,
                        },
                    }
                ],
            });
        }
        res.status(200).json({ message: "TV show added/updated to Notion.", tvShowData });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating TV show to Notion.", error });
    }
}
