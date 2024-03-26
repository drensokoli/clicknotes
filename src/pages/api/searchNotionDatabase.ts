import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './mongodb';
import { Client } from '@notionhq/client';
import { decryptData } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { query, notionApiKey, listName } = req.body;
    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const decryptedApiKey = decryptData(notionApiKey, encryptionKey);

    const notion = new Client({ auth: decryptedApiKey });

    let list = [] as any;
    const response = await notion.search({
        query: query,
        filter: {
            value: 'page',
            property: 'object'
        },
        page_size: 20
    });

    if (listName === "books") {
        list = response.results.map((result: any) => {
            return {
                id: result.id,
                title: result.properties.Title?.title[0]?.text?.content,
                cover: result.properties["Cover Image"]?.url || result.cover?.external?.url,
                link: `https://books.google.com/books?id=$result.id}`,
                status: result.properties.Status?.status?.name,
                rating: result.properties["My Rating"]?.number,
                description: result.properties["Description"]?.rich_text[0]?.text?.content,
                pageCount: result.properties["Page Count"]?.number,
                author: result.properties.Authors?.multi_select?.map((author: any) => author?.name).join(", "),
                notion_link: result.url,
                googleBooksId: result.properties["ID"]?.rich_text[0]?.text?.content,
                publisher: result.properties.Publisher?.select?.name,
                publishedDate: result.properties["Published Date"]?.date?.start,
                type: result.properties.Type?.select?.name,
            }
        });
    } else {
        list = response.results.map((result: any) => {
            return {
                id: result.id,
                tmdbId: result.properties.ID?.number,
                title: result.properties.Name?.title[0]?.text?.content,
                notionLink: result.url,
                status: result.properties.Status?.status?.name,
                myRating: result.properties["My Rating"]?.number,
                rated: result.properties.Rated?.select?.name,
                releaseDate: result.properties["Release Date"]?.date?.start,
                overview: result.properties.Overview?.rich_text[0]?.text?.content,
                awards: result.properties.Awards?.rich_text[0]?.text?.content,
                runtime: result.properties.Runtime?.rich_text[0]?.text?.content,
                poster: result.properties.Poster?.url,
                imdbLink: result.properties["iMDB Link"]?.url,
                trailer: result.properties.Trailer?.url,
                watchLink: result.properties["Watch Link"]?.url,
                type: result.properties.Type?.select?.name,
            }
        });
    }

    res.status(200).json(list);
}