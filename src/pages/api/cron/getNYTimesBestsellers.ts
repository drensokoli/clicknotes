import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const googleBooksApiKey1 = process.env.GOOGLE_BOOKS_API_KEY_1;
	const googleBooksApiKey2 = process.env.GOOGLE_BOOKS_API_KEY_2;
	const googleBooksApiKeys = [googleBooksApiKey1, googleBooksApiKey2];
	const nyTimesApiKey = process.env.NYTIMES_API_KEY;

	const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${nyTimesApiKey}`);

	const listNames = [
		"combined-print-and-e-book-fiction",
		"combined-print-and-e-book-nonfiction",
		"hardcover-fiction",
		"hardcover-nonfiction",
		"trade-fiction-paperback",
		"paperback-nonfiction",
		"advice-how-to-and-miscellaneous",
		"childrens-middle-grade-hardcover",
		"picture-books",
		"series-books",
		"young-adult-hardcover",
		"audio-fiction",
		"audio-nonfiction",
		"business-books",
		"graphic-books-and-manga",
		"mass-market-monthly",
		"middle-grade-paperback-monthly",
		"young-adult-paperback-monthly"
	];

	let isbns: any[] = [];

	listNames.forEach(listName => {
		const list = response.data.results.lists.find((list: any) => list.list_name_encoded === listName);
		if (list) {
			isbns = [...isbns, ...list.books.map((book: any) => book.primary_isbn13)];
		}
	});

	console.log("ISBNs: ", isbns.length);

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
					console.log('API limit reached, switching to next key');
					currentKeyIndex = (currentKeyIndex + 1) % googleBooksApiKeys.length;
					const nextKey = googleBooksApiKeys[currentKeyIndex];
					await fetchWithKey(nextKey);
					break;
				} else {
					if (response.data.items && response.data.items.length > 0) {
						console.log(`Found item for ISBN: ${isbn}`);
						responses.push(response.data.items[0]);
					} else {
						console.log(`No items found for ISBN: ${isbn}`);
						continue;
					}
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
		};

		await fetchWithKey(googleBooksApiKeys[0]);
		console.log('Finished fetching book details');
		return responses;
	};

	const allBestsellers = await bookDetailsPromises();
	const lengthToSlice = Math.floor(allBestsellers.length / 20) * 20;
	const bestsellers = allBestsellers.slice(0, lengthToSlice);

	const redisReq = await axios.post(`${process.env.BASE_URL}/api/redisHandler`, { bestsellers });
	console.log("Redis response: ", redisReq.data);

	res.status(redisReq.status).json({ redisResponse: redisReq.data});
}