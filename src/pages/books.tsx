import { useEffect, useState } from 'react';
import axios from 'axios';
import Book from '../components/Media/Book';
import SearchBar from '@/components/Helpers/SearchBar';
import Toast from '@/components/Helpers/Toast';
import { Book as BookInterface } from '@/lib/interfaces';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

export default function Books({ encryptionKey, googleBooksApiKey, nyTimesApiKey, bestsellers }: {
    encryptionKey: string;
    googleBooksApiKey: string;
    nyTimesApiKey: string;
    bestsellers: BookInterface[];
}) {
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [books, setBooks] = useState<BookInterface[]>([]);
    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [booksPageLink, setBooksPageLink] = useState<string>('');

    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [pageLink, setPageLink] = useState('');

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setInput(event.target.value);
            const titleResults = await searchBooksByTitle(event.target.value);
            const authorResults = await searchBooksByAuthor(event.target.value);

            console.log("Title Results: ", titleResults);
            console.log("Author Results: ", authorResults);

            const combinedResults = [...titleResults, ...authorResults];

            setBooks(combinedResults);
        } catch (error) {
            console.error(error);
        }
    };

    const searchBooksByTitle = async (title: string) => {
        try {
            if (title.length === 0) {
                return [];
            }
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=15&key=${googleBooksApiKey}`);

            return response.data.items;
        } catch (error) {
            console.error(error);
        }
    };

    const searchBooksByAuthor = async (author: string) => {
        try {
            if (author.length === 0) {
                return [];
            }
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&maxResults=15&key=${googleBooksApiKey}`);
            return response.data.items;
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

    useEffect(() => {
        if (session && !notionApiKey && !booksPageLink) {
            const fetchUser = async () => {
                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail: session?.user?.email }),
                });
                const user = await response.json();
                setNotionApiKey(user.notionApiKey);
                setBooksPageLink(user.booksPageLink);
            };
            fetchUser();
        }
    }, [session]);

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
                <meta name="twitter:domain" content="clicknotes.site" />
                <meta name="twitter:url" content="https://clicknotes.site/books" />
                <link rel="icon" href="/favicon.ico" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={pageLink} />
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-0'>
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
                            booksPageLink={booksPageLink}
                        />
                    ))}
                    {books.length === 0 && (
                        <>
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
                                        setPageLink={setPageLink}
                                        encryptionKey={encryptionKey}
                                        notionApiKey={notionApiKey}
                                        booksPageLink={booksPageLink}
                                    />
                                ))
                            }
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export const getStaticProps = async () => {

    const encryptionKey = process.env.ENCRYPTION_KEY;
    const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const nyTimesApiKey = process.env.NYTIMES_API_KEY;

    const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${nyTimesApiKey}`);
    const isbns = response.data.results.books.map((book: any) => book.primary_isbn13);
    const bookDetailsPromises = isbns.map((isbn: string) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${googleBooksApiKey}`));
    const bookDetailsResponses = await Promise.all(bookDetailsPromises);
    const bestsellers = bookDetailsResponses.map((response: any) => response.data.items[0]);

    return {
        props: {
            encryptionKey,
            googleBooksApiKey,
            nyTimesApiKey,
            bestsellers
        },

        revalidate: 60 * 60 * 24 // 24 hours
    };
}
