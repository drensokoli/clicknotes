import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, movieData } = req.body;

    try {
        const notion = new Client({ auth: notionApiKey });

        const existingPages = await notion.databases.query({
            database_id: db_id,
            filter: {
                property: 'ID',
                number: {
                    equals: movieData.id,
                },
            },
        });

        const genresArray = [];
        const castArray = [];

        for (let index = 0; index < movieData.cast.length; index++) {
            if (movieData.cast[index]) {
                const element = movieData.cast[index];
                castArray.push({ "name": element });
            }
        }

        for (let index = 0; index < movieData.genres.length; index++) {
            if (movieData.genres[index]) {
                const element = movieData.genres[index];
                genresArray.push({ "name": element });
            }
        }

        if (existingPages.results.length > 0) {
            const existingPageId = existingPages.results[0].id;

            await notion.pages.update({
                page_id: existingPageId,
                properties: {
                    'ID': {
                        number: movieData.id,
                    },
                    'Name': {
                        title: [
                            {
                                text: {
                                    content: movieData.title,
                                },
                            },
                        ],
                    },
                    'Release Date': {
                        date: {
                            start: movieData.release_date,
                        },
                    },
                    'Genres': {
                        multi_select: genresArray,
                    },
                    'Cast': {
                        multi_select: castArray
                    },
                    'TMDB Rating': {
                        number: movieData.vote_average,
                    },
                    'TMDB Link': {
                        url: movieData.tmdb_link,
                    },
                    'iMDB Link': {
                        url: movieData.imdb_link,
                    },
                    'Director': {
                        rich_text: [
                            {
                                text: {
                                    content: movieData.director,
                                },
                            },
                        ],
                    },
                    'Adult': {
                        checkbox: movieData.adult,
                    },
                    'Type': {
                        select: {
                            name: 'Movie',
                        },
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '🎬',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: movieData.backdrop_path,
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
                            url: movieData.poster_path,
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
                                        content: movieData.overview,
                                    },
                                },
                            ],

                        },
                    },
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: movieData.trailer,
                        },
                    },
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: movieData.tpb_link,
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
                        number: movieData.id,
                    },
                    'Name': {
                        
                        title: [
                            {
                                text: {
                                    content: movieData.title,
                                },
                            },
                        ],
                    },
                    'Release Date': {
                        date: {
                            start: movieData.release_date,
                        },
                    },
                    'Genres': {
                        multi_select: genresArray,
                    },
                    'Cast': {
                        multi_select: castArray
                    },
                    'TMDB Rating': {
                        number: movieData.vote_average,
                    },
                    'TMDB Link': {
                        url: movieData.tmdb_link,
                    },
                    'iMDB Link': {
                        url: movieData.imdb_link,
                    },
                    'Director': {
                        rich_text: [
                            {
                                text: {
                                    content: movieData.director,
                                },
                            },
                        ],
                    },
                    'Adult': {
                        checkbox: movieData.adult,
                    },
                    'Type': {
                        select: {
                            name: 'Movie',
                        },
                    },
                    'Status': {
                        select: {
                            name: 'To watch',
                        },
                    },
                },
                icon: {
                    type: 'emoji',
                    emoji: '🎬',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: movieData.backdrop_path,
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
                            url: movieData.poster_path,
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
                                        content: movieData.overview,
                                    },
                                },
                            ],

                        },
                    },
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: movieData.trailer,
                        },
                    },
                    {
                        object: 'block',
                        type: 'embed',
                        embed: {
                            url: movieData.tpb_link,
                        },
                    },
                ],
            });

        }
        res.status(200).json({ message: "Movie added/updated to Notion.", movieData });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating movie to Notion.", error });
    }
}
