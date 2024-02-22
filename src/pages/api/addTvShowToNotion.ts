import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, tvShowData } = req.body;

    const watchLinkName = tvShowData.name.replace(/ /g, '%20').toLowerCase();
    const watchLink = `https://movie-web.app/media/tmdb-tv-${tvShowData.id}-${watchLinkName}`

    const checkProperties = [
        { name: 'Name', type: 'title', structure: [{ text: { content: tvShowData.name } }], data: tvShowData.name },
        { name: 'Release Date', type: 'date', structure: { start: tvShowData.release_date }, data: tvShowData.release_date },
        { name: 'Genres', type: 'multi_select', structure: tvShowData.genres, data: tvShowData.genres },
        { name: 'Cast', type: 'multi_select', structure: tvShowData.cast, data: tvShowData.cast },
        { name: 'TMDB Rating', type: 'number', structure: tvShowData.vote_average, data: tvShowData.vote_average },
        { name: 'TMDB Link', type: 'url', structure: tvShowData.tmdb_link, data: tvShowData.tmdb_link },
        { name: 'iMDB Link', type: 'url', structure: tvShowData.imdb_link, data: tvShowData.imdb_link },
        { name: 'Director', type: 'rich_text', structure: [{ text: { content: tvShowData.director } }], data: tvShowData.director },
        { name: 'Type', type: 'select', structure: { name: 'TvShow' }, data: tvShowData.name },
        { name: 'Poster', type: 'url', structure: tvShowData.poster_path, data: tvShowData.poster_path },
        { name: 'Watch Link', type: 'url', structure: watchLink },
        { name: 'Overview', type: 'rich_text', structure: [{ text: { content: tvShowData.overview } }], data: tvShowData.overview },
        { name: 'Trailer', type: 'url', structure: tvShowData.trailer, data: tvShowData.trailer },
        { name: 'Watch Link', type: 'url', structure: watchLink, data: watchLink}
    ];

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
                    emoji: '📺',
                },
                cover: {
                    type: 'external',
                    external: {
                        url: tvShowData.backdrop_path,
                    },
                },
            });

            const pageUrl = `https://www.notion.so/${existingPageId.replace(/-/g, '')}`;

            res.status(200).json({ message: "TV show added/updated to Notion.", pageUrl });
        } else {
            const newPage = await notion.pages.create({
                parent: {
                    database_id: db_id,
                },
                properties: {
                    'ID': {
                        number: tvShowData.id,
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
                properties: updatedProperties
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
                    // {
                    //     object: 'block',
                    //     type: 'bookmark',
                    //     bookmark: {
                    //         url: tvShowData.tpb_link,
                    //     },
                    // }
                ],
            });

            const pageUrl = `https://www.notion.so/${newPage.id.replace(/-/g, '')}`;

            res.status(200).json({ message: "TV show added/updated to Notion.", pageUrl });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating TV show to Notion.", error });
    }
}