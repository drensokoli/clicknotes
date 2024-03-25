import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Book from '../components/Media/Book';
import SearchBar from '@/components/Helpers/SearchBar';
import Toast from '@/components/Helpers/Toast';
import { Book as BookInterface } from '@/lib/interfaces';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import NotionBanner from '@/components/Notion/NotionBanner';
import WidthKeeper from '@/components/Lists/WidthKeeper';
import { set } from 'lodash';
import NoItems from '@/components/Helpers/NoItems';
import LoadMore from '@/components/Helpers/LoadMore';

export default function Books({ encryptionKey, googleBooksApiKey, bestsellers }: {
	encryptionKey: string;
	googleBooksApiKey: string[];
	bestsellers: BookInterface[];
}) {
	const { data: session } = useSession();
	const userEmail = session?.user?.email;
	const booksAuthUrl = process.env.NEXT_PUBLIC_BOOKS_AUTHORIZATION_URL as string;

	const [showNotionBanner, setShowNotionBanner] = useState(false);

	const [input, setInput] = useState('');
	const [books, setBooks] = useState<BookInterface[]>([]);
	const [displayCount, setDisplayCount] = useState(20);

	const [notionApiKey, setNotionApiKey] = useState<string>('');
	const [booksDatabaseId, setBooksDatabaseId] = useState<string>('');

	const [apiResponse, setApiResponse] = useState<string | null>(null);
	const [pageLink, setPageLink] = useState('');

	const [noItemsFound, setNoItemsFound] = useState(false);
	const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
		if (event.target.value === '') {
			setBooks([]);
			setInput('');
			setNoItemsFound(false);
			return;
		}

		clearTimeout(debounceTimeout.current!);

		debounceTimeout.current = setTimeout(() => {
			searchBooksByTitle(event.target.value)
				.then((books) => {
					if (books && books.length > 0) {
						setBooks(books);
						setNoItemsFound(false);
					} else if (books && books.length === 0 && event.target.value.length > 0) {
						setBooks([]);
						setNoItemsFound(true);
					} else {
						setBooks([]);
						setNoItemsFound(false);
					}
				})
				.catch((error) => console.error(error));
		}, 300);
	};


	const searchBooksByTitle = async (title: string) => {
		try {
			const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=40&key=${googleBooksApiKey}`);

			return response.data.items;

		} catch (error) {
			console.error(error);
		}
	};

	const searchBooksByAuthor = async (author: string) => {
		try {
			if (author.length === 0) {
				setNoItemsFound(false);
				return [];
			}
			const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&maxResults=20&key=${googleBooksApiKey}`);
			if (response && response.data?.items) {
				return response.data.items;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	};

	useEffect(() => {
		if (apiResponse !== 'Adding book to Notion') {
			const timer = setTimeout(() => {
				setApiResponse(null);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [apiResponse]);

	async function fetchUserData() {
		try {
			const response = await fetch('/api/getUserConnection', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userEmail,
					connectionType: "books",
				}),
			});

			const connectionData = await response.json();

			if (!connectionData || !connectionData.access_token || !connectionData.template_id) {
				setShowNotionBanner(true);
			} else if (connectionData.access_token && connectionData.template_id) {
				setNotionApiKey(connectionData.access_token);
				setBooksDatabaseId(connectionData.template_id);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	useEffect(() => {
		if (session && !notionApiKey && !booksDatabaseId) {
			fetchUserData();
		}
	}, [session]);

	useEffect(() => {
		if (input === '') {
			setBooks([]);
			setNoItemsFound(false);
		} else if (input.length === 0) {
			setBooks([]);
			setNoItemsFound(false);
		}
	}, [input]);
	return (
		<>
			<Head>
				<title>ClickNotes | Books</title>
				<meta name="description" content="Save the New York Times best sellers to your Notion list or search for your favourite books. All your Books in one place, displayed in a beautiful Notion template." />
				<meta name="robots" content="index, follow"></meta>
				<meta property="og:title" content="ClickNotes | Books" />
				<meta property="og:description" content="Save the New York Times best sellers to your Notion list or search for your books. All your Books in one place, displayed in a beautiful Notion template." />
				<meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="author" content="Dren Sokoli" />
				<meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
				<meta property="og:title" content="ClickNotes - Save your books to Notion" />
				<meta property="og:description" content="Save popular and trending books to your Notion list or search for your favorites. All your books in one place, displayed in a beautiful Notion template." />
				<meta property="og:image" content="https://www.clicknotes.site/og/books.png" />
				<meta property="og:url" content="https://clicknotes.site/books" />
				<meta property="og:site_name" content="ClickNotes" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@SokoliDren" />
				<meta name="twitter:creator" content="@SokoliDren" />
				<meta name="twitter:title" content="ClickNotes - Save your books to Notion" />
				<meta name="twitter:description" content="Save popular and trending books to your Notion list or search for your favorites. All your books in one place, displayed in a beautiful Notion template." />
				<meta name="twitter:image" content="https://www.clicknotes.site/og/books.png" />
				<meta name="twitter:domain" content="www.clicknotes.site" />
				<meta name="twitter:url" content="https://clicknotes.site/books" />
				<link rel="icon" href="/favicon.ico" />
				{/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
	crossOrigin="anonymous"></script> */}
			</Head>
			<Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink='/my-lists/books' />
			<div className="flex flex-col items-center min-h-screen bg-white space-y-4">
				<div className='w-fit'>
					<SearchBar input={input} handleInputChange={handleInputChange} placeholder='Search for books' />
					<WidthKeeper />
					{showNotionBanner && (
						<NotionBanner image='/connectbooks.png' link={booksAuthUrl} session={session ? true : false} />
					)}
					<div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 flex-grow'>
						{books && books.length > 0 && input.length > 0 ? (
							<>
								{books.map((book: BookInterface) => (
									<Book
										key={book.id}
										id={book.id}
										title={book.volumeInfo.title}
										previewLink={book.volumeInfo.previewLink}
										cover_image={book.volumeInfo.imageLinks?.thumbnail}
										description={book.volumeInfo.description}
										publishedDate={book.volumeInfo.publishedDate}
										averageRating={book.volumeInfo.averageRating}
										authors={book.volumeInfo.authors}
										infoLink={book.volumeInfo.infoLink}
										pageCount={book.volumeInfo.pageCount}
										thumbnail={book.volumeInfo.imageLinks?.thumbnail}
										language={book.volumeInfo.language}
										price={book.saleInfo.listPrice?.amount}
										publisher={book.volumeInfo.publisher}
										availability={book.saleInfo.saleability}
										onApiResponse={(error: string) => setApiResponse(error)}
										setPageLink={setPageLink}
										encryptionKey={encryptionKey}
										notionApiKey={notionApiKey}
										booksDatabaseId={booksDatabaseId}
									/>
								))}
							</>
						) : noItemsFound ? (
							<NoItems message={'No books found'} />
						) : (
							<>
								{bestsellers
									.slice(0, displayCount)
									.map((book: BookInterface) => (
										<Book
											key={book.id}
											id={book.id}
											title={book.volumeInfo.title}
											previewLink={book.volumeInfo.previewLink}
											cover_image={book.volumeInfo.imageLinks?.thumbnail}
											description={book.volumeInfo.description}
											publishedDate={book.volumeInfo.publishedDate}
											averageRating={book.volumeInfo.averageRating}
											authors={book.volumeInfo.authors}
											infoLink={book.volumeInfo.infoLink}
											pageCount={book.volumeInfo.pageCount}
											thumbnail={book.volumeInfo.imageLinks?.thumbnail}
											language={book.volumeInfo.language}
											price={book.saleInfo.listPrice?.amount}
											publisher={book.volumeInfo.publisher}
											availability={book.saleInfo.saleability}
											onApiResponse={(error: string) => setApiResponse(error)}
											setPageLink={setPageLink}
											encryptionKey={encryptionKey}
											notionApiKey={notionApiKey}
											booksDatabaseId={booksDatabaseId}
										/>
									))}
							</>
						)}

					</div>
				</div>
				{displayCount < bestsellers.length && books.length === 0 && !noItemsFound && (
					<LoadMore
						displayCount={displayCount}
						setDisplayCount={setDisplayCount}
						media={bestsellers}
					/>
				)}
			</div>
		</>
	);
};

export const getStaticProps = async () => {
	const encryptionKey = process.env.ENCRYPTION_KEY;
	const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY_2;
	const nyTimesApiKey = process.env.NYTIMES_API_KEY;

	let bestsellers;
	const bestsellersData = await fetch(`${process.env.BASE_URL}/api/redisHandler`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	});

	if (bestsellersData.status !== 200) {
		const data = await bestsellersData.json();
		bestsellers = data ? (typeof data === 'string' ? JSON.parse(data) : data) : [];
	} else {
		// Handle the case where the response is not a valid JSON
		console.error('Error fetching bestsellers data:', bestsellersData.status);
		const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${nyTimesApiKey}`);
		const isbns = response.data.results.books.map((book: any) => book.primary_isbn13);
		const bookDetailsPromises = isbns.map((isbn: string) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${googleBooksApiKey}`));
		const bookDetailsResponses = await Promise.all(bookDetailsPromises);
		bestsellers = bookDetailsResponses.flatMap((response: any) => {
			const items = response.data?.items;
			if (Array.isArray(items) && items.length > 0) {
				return items;
			} else {
				return [];
			}
		});
	}

	return {
		props: {
			encryptionKey,
			googleBooksApiKey,
			nyTimesApiKey,
			bestsellers
		},
		revalidate: 60 * 60 * 24
	};
};