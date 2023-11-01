
export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
}

export interface TvShow {
    id: number;
    title: string;
    original_name: string;
    name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
}

export interface Book {
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
