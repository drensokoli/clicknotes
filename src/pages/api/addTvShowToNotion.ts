import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, tvShowData } = req.body;
    
    try {
        const notion = new Client({ auth: notionApiKey });

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
                'Type': {
                    select: {
                        name: 'TvShow',
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
        res.status(200).json(newPage);
    } catch (error) {
        res.status(500).json({ error: "It didn't work G" });
    }
}
