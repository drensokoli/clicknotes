import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../components/Movie';
import SearchBar from '@/components/SearchBar';

export enum ContentType {
    Movie = 'movie',
    TvShow = 'tv',
}

interface PageContentProps {
    contentType: ContentType;
}

interface Content {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const PageContent: React.FC<PageContentProps> = ({ contentType }) => {
    const [input, setInput] = useState('');
    const [content, setContent] = useState<Content[]>([]);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        await searchContentByTitle(event.target.value);
    };

    const searchContentByTitle = async (title: string) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/${contentType}?api_key=${API_KEY}&query=${title}`);
            setContent(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleContentClick = (contentId: number) => {
        window.open(`https://www.themoviedb.org/${contentType}/${contentId}`, '_blank');
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />
                <div className="content-container w-5/6">
                    <div className="movie-container">
                        {content.map((item) => (
                            <Movie key={item.id} {...item} onClick={() => handleContentClick(item.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageContent;
