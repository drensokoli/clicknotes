import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { notionApiKey, db_id, movieData } = req.body;

    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const decryptedApiKey = decryptData(notionApiKey, encryptionKey);

    const watchLinkName = movieData.title.replace(/ /g, '-').toLowerCase();
    const imdbId = movieData.imdb_link.split('/')[4].replace('tt', '');
    const watchLink = `https://www.strem.io/s/movie/${watchLinkName}-${imdbId}`;

    let isAdult = false;
    if (movieData.rated === "R" || movieData.rated === "NC-17" || movieData.rated === "X" || movieData.adult === true) {
        isAdult = true;
    }

    const checkProperties = [
        { name: 'Name', type: 'title', structure: [{ text: { content: movieData.title } }], data: movieData.title },
        { name: 'Release Date', type: 'date', structure: { start: movieData.release_date }, data: movieData.release_date },
        { name: 'Genres', type: 'multi_select', structure: movieData.genres, data: movieData.genres },
        { name: 'Cast', type: 'multi_select', structure: movieData.cast, data: movieData.cast },
        { name: 'TMDB Rating', type: 'number', structure: movieData.vote_average, data: movieData.vote_average },
        { name: 'IMDB Rating', type: 'number', structure: movieData.imdbRating, data: movieData.imdbRating },
        { name: 'Rotten Tomatoes Rating', type: 'number', structure: movieData.rottenTomatoesRating, data: movieData.rottenTomatoesRating },
        { name: 'TMDB Link', type: 'url', structure: movieData.tmdb_link, data: movieData.tmdb_link },
        { name: 'iMDB Link', type: 'url', structure: movieData.imdb_link, data: movieData.imdb_link },
        { name: 'Crew', type: 'multi_select', structure: movieData.crew, data: movieData.crew },
        { name: 'Type', type: 'select', structure: { name: 'Movie' }, data: movieData.title },
        { name: 'Poster', type: 'url', structure: movieData.poster_path, data: movieData.poster_path },
        { name: 'Overview', type: 'rich_text', structure: [{ text: { content: movieData.overview } }], data: movieData.overview },
        { name: 'Trailer', type: 'url', structure: movieData.trailer, data: movieData.trailer },
        { name: 'Watch Link', type: 'url', structure: watchLink, data: watchLink },
        { name: 'Adult', type: 'checkbox', structure: isAdult, data: isAdult },
        { name: 'Runtime', type: 'rich_text', structure: [{ text: { content: movieData.runtime } }], data: movieData.runtime },
        { name: 'Rated', type: 'select', structure: { name: movieData.rated }, data: movieData.rated },
        { name: 'Awards', type: 'rich_text', structure: [{ text: { content: movieData.awards } }], data: movieData.awards },
        // { name: 'Box Office', type: 'number', structure: movieData.boxOffice, data: movieData.boxOffice },
    ];

    try {
        const notion = new Client({ auth: decryptedApiKey });

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
        } else {
            const newPage = await notion.pages.create({
                parent: {
                    database_id: db_id,
                },
                properties: {
                    'ID': {
                        number: movieData.id,
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
                    }
                ],
            });

            const pageUrl = `https://www.notion.so/${newPage.id.replace(/-/g, '')}`;

            res.status(200).json({ message: "Movie added to Notion.", pageUrl });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while adding/updating movie to Notion.", error });
    }
}