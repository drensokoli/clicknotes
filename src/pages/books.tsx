import { useEffect, useState } from 'react';
import axios from 'axios';
import Book from '../components/Media/Book';
import SearchBar from '@/components/Layout/SearchBar';
import { debounce } from 'lodash';
import NotionAd from '@/components/Notion/NotionAd';
import NotionResponse from '@/components/Notion/NotionResponse';
import { Book as BookInterface } from '@/lib/interfaces';

export default function Books({ cryptoKey, googleBooksApiKey, nyTimesApiKey, bestsellers }: {
    cryptoKey: string;
    googleBooksApiKey: string;
    nyTimesApiKey: string;
    bestsellers: BookInterface[];
}) {
    const [input, setInput] = useState('');
    const [books, setBooks] = useState<BookInterface[]>([]);

    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        searchBooksByTitle(event.target.value);
    };

    const searchBooksByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}&key=${googleBooksApiKey}`);
            setBooks(response.data.items);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (apiResponse !== 'Adding book to Notion...') {
            const timer = setTimeout(() => {
                setApiResponse(null);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [apiResponse]);

    return (
        <>
            <NotionResponse apiResponse={apiResponse} setApiResponse={setApiResponse} />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <NotionAd path={"books"} />
                    <div className="movie-container">
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
                                cryptoKey={cryptoKey}
                            />
                        ))}
                        {books.length === 0 && (
                            <>
                                <div className='movie-container'>
                                    {
                                        bestsellers.map((book: BookInterface) => (
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
                                                cryptoKey={cryptoKey}
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

export const getStaticProps = async () => {

    const cryptoKey = process.env.CRYPTO_KEY;
    const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const nyTimesApiKey = process.env.NYTIMES_API_KEY;

    const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${nyTimesApiKey}`);
    const isbns = response.data.results.books.map((book: any) => book.primary_isbn13);
    const bookDetailsPromises = isbns.map((isbn: string) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${googleBooksApiKey}`));
    const bookDetailsResponses = await Promise.all(bookDetailsPromises);
    const bestsellers = bookDetailsResponses.map((response: any) => response.data.items[0]);

    return {
        props: {
            cryptoKey,
            googleBooksApiKey,
            nyTimesApiKey,
            bestsellers
        },

        revalidate: 60 * 60 * 24 // 24 hours
    };
}
