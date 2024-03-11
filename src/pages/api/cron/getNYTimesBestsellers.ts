import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    const googleBooksApiKey1 = process.env.GOOGLE_BOOKS_API_KEY_1;
    const googleBooksApiKey2 = process.env.GOOGLE_BOOKS_API_KEY_2;
    const googleBooksApiKeys = [googleBooksApiKey1, googleBooksApiKey2];
    const nyTimesApiKey = process.env.NY_TIMES_API_KEY;

	const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${nyTimesApiKey}`);

	const listNames = [
		'hardcover-fiction', 'hardcover-nonfiction', 'trade-fiction-paperback', 
		'paperback-nonfiction', 'series-books', 'business-books', 
		'graphic-books-and-manga', 'mass-market-monthly'
	];

	let isbns: any[] = [];

	listNames.forEach(listName => {
		const list = response.data.results.lists.find((list: any) => list.list_name_encoded === listName);
		if (list) {
			isbns = [...isbns, ...list.books.map((book: any) => book.primary_isbn13)];
		}
	});

	const bookDetailsPromises = async () => {
		let responses: any[] = [];
		let currentIndex = 0;
		let currentKeyIndex = 0;

		const fetchWithKey = async (key: any) => {
			while (currentIndex < isbns.length) {
				const isbn = isbns[currentIndex];
				currentIndex++;

				const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${key}`);
				if (response.status === 429) {
					currentKeyIndex = (currentKeyIndex + 1) % googleBooksApiKeys.length;
					const nextKey = googleBooksApiKeys[currentKeyIndex];
					await fetchWithKey(nextKey);
					break;
				} else {
					responses.push(response.data.items[0]);
				}
			}
		};

		await fetchWithKey(googleBooksApiKeys[0]);

		return responses;
    };

    const bookDetailsResponses = await bookDetailsPromises();
    const bestsellers = bookDetailsResponses.map((response: any) => response.data.items[0]);
    await axios.post(`${process.env.BASE_URL}/api/redisHandler`, { bestsellers });
}