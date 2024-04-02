import { NextApiRequest, NextApiResponse } from 'next';
import fetchNYTimesBestsellers from '../../../lib/getNYTimesBestsellers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bestsellersPromise = fetchNYTimesBestsellers();

    // Immediately return a response
    res.status(200).json({ message: 'Processing data...' });

    // Wait for the fetchNYTimesBestsellers function to finish executing
    const redisResponse = await bestsellersPromise;

	console.log('Redis response ', redisResponse);
}