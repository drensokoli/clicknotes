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
    name: string;
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
    const [popularMovies, setPopularMovies] = useState<Content[]>([]);

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

    const handleContentClick = async (contentId: number) => {
        try {
            // const response = await axios.get(`https://api.themoviedb.org/3/${contentType}/${contentId}?api_key=${API_KEY}`);
            // const imdbId = response.data.imdb_id;
            // console.log(imdbId);
            // if (imdbId) {
            //     window.open(`https://www.imdb.com/title/${imdbId}`, '_blank');
            // } else {
                window.open(`https://www.themoviedb.org/${contentType}/${contentId}`, '_blank');
            // }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/${contentType}/popular?api_key=${API_KEY}&language=en-US&page=1`);
                setPopularMovies(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPopularMovies();
    }, []);

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
                    {content.length === 0 && (
                        <>
                            <div className='movie-container'>
                                <h1 className='text-2xl pb-4'>POPULAR</h1>
                            </div>
                            <div className="movie-container">
                                {popularMovies.map((item) => (
                                    <Movie key={item.id} {...item} onClick={() => handleContentClick(item.id)} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );

};

export default PageContent;
