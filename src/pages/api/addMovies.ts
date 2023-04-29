import { NextApiRequest, NextApiResponse } from 'next';
import { Client as NotionClient } from '@notionhq/client';

const notion = new NotionClient({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

const addMovieToNotion = async (movie: any, databaseId: string) => {
  try {
    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: movie.title,
              },
            },
          ],
        },
        overview: {
          rich_text: [
            {
              text: {
                content: movie.overview,
              },
            },
          ],
        },
        backdrop_path: {
          url: movie.backdrop_path,
        },
        vote_average: {
          number: movie.vote_average,
        },
        vote_count: {
          number: movie.vote_count,
        },
        release_date: {
          date: {
            start: movie.release_date,
          },
        },
      },
    });
    return true;
  } catch (error) {
    console.error('Error adding movie to Notion:', error);
    return false;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const movie = req.body.movie;
    if (movie && process.env.NEXT_PUBLIC_NOTION_DATABASE_ID) {
      const result = await addMovieToNotion(movie, process.env.NEXT_PUBLIC_NOTION_DATABASE_ID);
      if (result) {
        res.status(200).json({ message: 'Movie added to Notion' });
      } else {
        res.status(500).json({ message: 'Error adding movie to Notion' });
      }
    } else {
      res.status(400).json({ message: 'Invalid movie or database ID' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
