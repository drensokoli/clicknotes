import axios from "axios";

export async function getCast({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    return credits.cast.slice(0, 11).map((cast: { name: any; }) => ({ "name": cast.name }));
};

export async function getCrew({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    const crew = credits.crew
        .filter((crew: { job: string; known_for_department: string; }) =>
            crew.job.includes('Director') ||
            crew.known_for_department.includes('Directing') ||
            crew.known_for_department.includes('Writing'))
        .slice(0, 15)
        .map((crew: { name: any; }) => ({ "name": crew.name }))
        .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);
    return crew;
}

export async function getTrailer({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${tmdbApiKey}&language=en-US`
    );
    const videoData = await response.json();
    const trailers = videoData.results.filter((video: { type: string; }) => video.type === 'Trailer');

    let trailer = '';
    if (trailers.length > 0) {
        const trailerID = trailers[0].key;
        trailer = `https://www.youtube.com/watch?v=${trailerID}`;
    }

    return trailer;
};

export async function getImdb({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=en-US`
    );

    const movieDetails = await response.json();
    const imdb_id = movieDetails.imdb_id;
    return "https://imdb.com/title/" + imdb_id;
};

export async function searchMovieByTitle({ title, tmdbApiKey }: { title: string, tmdbApiKey: string }) {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${title}&language=en-US&page=1&include_adult=false`);

        const movies = response.data.results;

        const adultContent = ["sex", "porn", "nude", "sadomasochistic", "pussy", "vagina", "erotic", "lust", "softcore", "hardcore"]

        return movies
        // .filter((item: { vote_average: number; }) => item.vote_average > 6)
        // .filter((item: { title: string; }) => !adultContent.some((word) => item.title.toLowerCase().includes(word)))
        // .filter((item: { original_title: string; }) => !adultContent.some((word) => item.original_title.toLowerCase().includes(word)))
        // .filter((item: { overview: string; }) => !adultContent.some((word) => item.overview.toLowerCase().includes(word)))

        // KEYWORD FILTERING

        // const movieIds = response.data.results.map((movie: { id: any; }) => movie.id);
        // const movies = [];
        // for (let id of movieIds) {
        //     const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&append_to_response=keywords`);

        //     const keywords = movieResponse.data.keywords.keywords.map((keyword: { name: any; }) => keyword.name);

        //     if (!keywords.some((keyword: string) => adultContent.includes(keyword))) {
        //         movies.push(movieResponse.data);
        //     }
        // }

    } catch (error) {
        console.error(error);
    }
};

export const genresMapping = {
    "genres": [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 16,
            "name": "Animation"
        },
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentary"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Family"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 36,
            "name": "History"
        },
        {
            "id": 27,
            "name": "Horror"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 9648,
            "name": "Mystery"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Science Fiction"
        },
        {
            "id": 10770,
            "name": "TV Movie"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
            "name": "War"
        },
        {
            "id": 37,
            "name": "Western"
        }
    ]
};

export async function fetchOmdbData(omdbApiKeys: string[], title: string, year: string) {
    let response: any;
    let data: any;

    for (const omdbApiKey of omdbApiKeys) {
        response = await fetch(
            `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${title}&type=movie&y=${year}`
        );

        data = await response.json();
        if (data.Response === "True") {
            break;
        }
    }

    const imdbId = data.imdbID;
    const imdbLink = `https://www.imdb.com/title/${imdbId}`;
    const rated = data.Rated;
    const runtime = data.Runtime;
    const awards = data.Awards;
    const imdbRating = parseInt(data.imdbRating);
    const rottenTomatoesRating = parseInt(data.Ratings?.find((rating: { Source: string; }) => rating.Source === 'Rotten Tomatoes')?.Value.replace('%', '')) ?? null;
    const imdbVotes = data.imdbVotes;
    const boxOffice = data.BoxOffice;

    return {
        rated,
        runtime,
        awards,
        imdbRating,
        rottenTomatoesRating,
        boxOffice
    };
}