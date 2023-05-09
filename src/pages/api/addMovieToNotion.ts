import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, movieData } = req.body;

    try {
        const notion = new Client({ auth: notionApiKey });

        const newPage = await notion.pages.create({
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
                'Release Date': {
                    date: {
                        start: movieData.release_date,
                    },
                },
                'Genres': {
                    multi_select: [{"name": movieData.firstGenre},{"name": movieData.secondGenre},{"name": movieData.thirdGenre}],
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
            ],
        });
        res.status(200).json(newPage);
    } catch (error) {
        res.status(500).json({ error: "It didn't work G" });
    }
}
