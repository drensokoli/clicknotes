import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, movieData } = req.body;
    const watchLinkName = movieData.title.replace(/ /g, '%20').toLowerCase();
    const watchLink = `https://movie-web.app/media/tmdb-movie-${movieData.id}-${watchLinkName}`

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
                        multi_select: movieData.genres,
                    },
                    'Cast': {
                        multi_select: movieData.cast,
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
                    // 'Adult': {
                    //     checkbox: movieData.adult,
                    // },
                    'Type': {
                        select: {
                            name: 'Movie',
                        },
                    },
                    'Poster': {
                        url: movieData.poster_path,
                    },
                    'Overview': {
                        rich_text: [
                            {
                                text: {
                                    content: movieData.overview,
                                },
                            },
                        ],
                    },
                    'Trailer': {
                        url: movieData.trailer,
                    },
                    'Watch Link': {
                        url: watchLink,
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

            const pageUrl = `https://www.notion.so/${existingPageId.replace(/-/g, '')}`;

            res.status(200).json({ message: "Movie updated in Notion.", pageUrl });
        }
        else {
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
                        multi_select: movieData.genres,
                    },
                    'Cast': {
                        multi_select: movieData.cast,
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
                    // 'Adult': {
                    //     checkbox: movieData.adult,
                    // },
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
                    'Poster': {
                        url: movieData.poster_path,
                    },
                    'Watch Link': {
                        url: watchLink,
                    },
                    'Overview': {
                        rich_text: [
                            {
                                text: {
                                    content: movieData.overview,
                                },
                            },
                        ],
                    },
                    'Trailer': {
                        url: movieData.trailer,
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
                    // {
                    //     object: 'block',
                    //     type: 'bookmark',
                    //     bookmark: {
                    //         url: movieData.tpb_link,
                    //     },
                    // }
                ],
            });

            const pageUrl = `https://www.notion.so/${newPage.id.replace(/-/g, '')}`;

            res.status(200).json({ message: "Movie added to Notion.", pageUrl });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating movie to Notion.", error });
    }
}