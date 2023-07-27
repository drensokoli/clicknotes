// pages/api/getNotionMovies.ts
import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default async function handler(req: { body: { notionApiKey: any; databaseId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { pageTitles?: any[]; error?: any; }): void; new(): any; }; }; }) {
    const { notionApiKey, databaseId } = req.body;
    const notion = new Client({ auth: notionApiKey });

    try {
        const response = await notion.databases.query({ database_id: databaseId });
        const pageTitles = (response.results as PageObjectResponse[]).map(page => {
            if (page.properties.Name.type === 'title') {
              return page.properties.Name.title[0].plain_text;
            } else {
              return null; // or handle the error in some other way
            }
          });

        res.status(200).json({ pageTitles });
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
