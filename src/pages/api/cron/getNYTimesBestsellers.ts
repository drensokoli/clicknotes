import { NextApiRequest, NextApiResponse } from 'next';
import fetchNYTimesBestsellers from '../../../lib/getNYTimesBestsellers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const googleBooksApiKey1 = process.env.GOOGLE_BOOKS_API_KEY_1;
	const googleBooksApiKey2 = process.env.GOOGLE_BOOKS_API_KEY_2;
	const googleBooksApiKeys = [googleBooksApiKey1, googleBooksApiKey2];
	const nyTimesApiKey = process.env.NYTIMES_API_KEY;

    const bestsellersPromise = fetchNYTimesBestsellers(googleBooksApiKeys, nyTimesApiKey);

    // Immediately return a response
    res.status(200).json({ message: 'Processing data...' });

    // Wait for the fetchNYTimesBestsellers function to finish executing
    const redisResponse = await bestsellersPromise;

	console.log('Redis response ', redisResponse);
}