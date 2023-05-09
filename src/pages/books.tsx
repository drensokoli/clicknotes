import { useEffect, useState } from 'react';
import axios from 'axios';
import Book from '../components/Book';
import SearchBar from '@/components/SearchBar';

interface BookProps { }

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors: string[];
        description: string;
        imageLinks: {
            thumbnail: string;
        };
        previewLink: string;
    };
}

const GOOGLE_BOOKS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
const NYTIMES_API_KEY = process.env.NEXT_PUBLIC_NYTIMES_API_KEY;

const Books: React.FC<BookProps> = () => {
    const [input, setInput] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [bestsellers, setBestsellers] = useState<Book[]>([]);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchBooksByTitle(event.target.value);
    };

    const searchBooksByTitle = async (title: string) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${title}&key=${GOOGLE_BOOKS_API_KEY}`
            );
            setBooks(response.data.items);
        } catch (error) {
            console.error(error);
        }
    };

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


    useEffect(() => {
        fetchBestsellers();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        <div>
                            {books.length === 0 && (
                                <>
                                    <div className='movie-container'>
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
                                                />
                                            ))
                                        }
                                    </div>
                                </>)}
                        </div>
                        {books.map((book: Book) => (
                            <Book
                                key={book.id}
                                id={book.id}
                                title={book.volumeInfo.title}
                                previewLink={book.volumeInfo.previewLink}
                                cover_image={book.volumeInfo.imageLinks?.thumbnail}
                                onClick={() => { }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Books;
