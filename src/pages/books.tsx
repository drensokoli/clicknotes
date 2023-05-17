import { useEffect, useState } from 'react';
import axios from 'axios';
import Book from '../components/Book';
import SearchBar from '@/components/SearchBar';

interface Book {
    saleInfo: any;
    id: string;
    volumeInfo: {
        publisher: any;
        language: any;
        title: string;
        authors: string[];
        description: string;
        imageLinks: {
            thumbnail: string;
        };
        previewLink: string;
        publishedDate: string;
        averageRating: number;
        infoLink: string;
        pageCount: number;
    };
}

const GOOGLE_BOOKS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
const NYTIMES_API_KEY = process.env.NEXT_PUBLIC_NYTIMES_API_KEY;

const Books: React.FC = () => {
    const [input, setInput] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [bestsellers, setBestsellers] = useState<Book[]>([]);

    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        if (event.target.value.length > 0) {
            await searchBooksByTitle(event.target.value);
        } else {
            setBooks([]);
        }
    };

    const searchBooksByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}&key=${GOOGLE_BOOKS_API_KEY}`);
            setBooks(response.data.items);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchBestsellers = async () => {
            try {
                const cacheResponse = await fetch("/api/redisHandler");
                const cacheData = await cacheResponse.json();
                if (cacheData) {
                    setBestsellers(JSON.parse(cacheData));
                    return;
                }
                const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${NYTIMES_API_KEY}`);
                const isbns = response.data.results.books.map((book: any) => book.primary_isbn13);
                const bookDetailsPromises = isbns.map((isbn: string) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`));
                const bookDetailsResponses = await Promise.all(bookDetailsPromises);
                const bestsellers = bookDetailsResponses.map((response: any) => response.data.items[0]);
                setBestsellers(bestsellers);

                // Store the best sellers data in Redis
                await fetch('/api/redisHandler', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bestsellers }),
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchBestsellers();
    }, []);

    useEffect(() => {
        if (apiResponse !== 'Adding book to Notion...') {
            const timer = setTimeout(() => {
                setApiResponse(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [apiResponse]);

    return (
        <>
            {apiResponse === 'Added book to Notion' ? (
                <div className="success-message">
                    <p>{apiResponse}</p>
                </div>
            ) : apiResponse === 'Error adding book to Notion' ? (
                <div className="error-message">
                    <p>{apiResponse}</p>
                    Need <a href="/help" target="_blank">
                        <span className="text-blue-500">help</span>?
                    </a>
                </div>
            ) : apiResponse === 'Adding book to Notion...' ? (
                <div className="loading-message">
                    <p>{apiResponse}</p>
                </div>
            ) : null}
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        {books.map((book: Book) => (
                            <Book
                                key={book.id}
                                id={book.id}
                                title={book.volumeInfo.title}
                                previewLink={book.volumeInfo.previewLink}
                                cover_image={book.volumeInfo.imageLinks?.thumbnail}
                                onClick={() => { }}
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
                            />
                        ))}
                        {books.length === 0 && (
                            <>
                                <div className='movie-container w-full'>
                                    <h1 className='text-2xl pb-4'>BEST SELLERS</h1>
                                </div>
                                <div className='movie-container'>
                                    {
                                        bestsellers.map((book: Book) => (
                                            <Book
                                                key={book.id}
                                                id={book.id}
                                                title={book.volumeInfo.title}
                                                previewLink={book.volumeInfo.previewLink}
                                                cover_image={book.volumeInfo.imageLinks?.thumbnail}
                                                onClick={() => { }}
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
                                            />
                                        ))
                                    }
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Books;
