
export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
}

export interface TvShow {
    genre_ids: number[];
    first_air_date: string;
    id: number;
    title: string;
    original_name: string;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    vote_count: number;
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
