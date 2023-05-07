import { useEffect, useState } from 'react';
import axios from 'axios';
import Book from '../components/Book';
import SearchBar from '@/components/SearchBar';

interface BooksPageContentProps {}

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
  

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

const BooksPageContent: React.FC<BooksPageContentProps> = () => {
  const [input, setInput] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    await searchBooksByTitle(event.target.value);
  };

  const searchBooksByTitle = async (title: string) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${title}&key=${API_KEY}`
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

return (
    <>
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
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
  
};

export default BooksPageContent;
