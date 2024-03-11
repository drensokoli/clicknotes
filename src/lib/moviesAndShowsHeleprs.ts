import axios from "axios";

export async function searchContentByTitle({ title, tmdbApiKey, type }: { title: string, tmdbApiKey: string, type: string }) {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/${type}?api_key=${tmdbApiKey}&query=${title}&language=en-US&page=1&include_adult=false`);

        const content = response.data.results;

        return content;


    } catch (error) {
        console.error(error);
    }
};

export async function getCast({ id, tmdbApiKey, type }: { id: number, tmdbApiKey: string, type: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    return credits.cast.slice(0, 11).map((cast: { name: any; }) => ({ "name": cast.name.replace(/,/g, "") }));
}

export async function getCrew({ id, tmdbApiKey, type }: { id: number, tmdbApiKey: string, type: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    const crew = credits.crew
        .filter((crew: { job: string; known_for_department: string; }) =>
            crew.job.includes('Director') ||
            crew.known_for_department.includes('Directing') ||
            crew.known_for_department.includes('Writing'))
        .slice(0, 15)
        .map((crew: { name: any; }) => ({ "name": crew.name.replace(/,/g, "") }))
        .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);
    return crew;
}

export async function getTrailer({ id, tmdbApiKey, type }: { id: number, tmdbApiKey: string, type: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${tmdbApiKey}&language=en-US`
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

export async function getOmdbData(omdbApiKeys: string[], title: string, year: string, type: string) {
    let response: any;
    let omdbData: any;

    for (const omdbApiKey of omdbApiKeys) {
        response = await fetch(
            `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${title}&type=${type}&y=${year}`
        );

        omdbData = await response.json();
        if (omdbData.Response === "True") {
            break;
        }
        console.log(omdbData);
    }

    const imdbId = omdbData.imdbID;
    const imdbLink = `https://www.imdb.com/title/${imdbId}`;
    const rated = omdbData.Rated;
    const runtime = omdbData.Runtime;
    const awards = omdbData.Awards;
    const imdbRating = parseInt(omdbData.imdbRating);
    const rottenTomatoesRating = parseInt(omdbData.Ratings?.find((rating: { Source: string; }) => rating.Source === 'Rotten Tomatoes')?.Value.replace('%', '')) ?? null;
    const imdbVotes = omdbData.imdbVotes;
    const boxOffice = omdbData.BoxOffice;
    const seasons = omdbData.totalSeasons;

    return {
        imdbLink,
        rated,
        runtime,
        awards,
        imdbRating,
        rottenTomatoesRating,
        boxOffice,
        seasons
    };
}

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
