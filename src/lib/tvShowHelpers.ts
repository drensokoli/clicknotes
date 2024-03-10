import axios from "axios";

export async function searchTvShowByTitle({ title, tmdbApiKey }: { title: string, tmdbApiKey: string }) {
    try {
        const include_genres = '16,35,99,18,10751,14,36,10402,9648,10749,878'
        const certification_country = 'US'
        const certification = 'TV-PG'
        const adultContent = ["sex", "porn", "nude", "sadomasochistic", "pussy", "vagina", "erotic", "lust", "softcore", "hardcore"]

        const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${title}&with_genres=${include_genres}&certification_country=${certification_country}&certification=${certification}`);
        const tvShows = response.data.results;

        return tvShows
        // .filter((item: { vote_average: number; }) => item.vote_average > 6)
        // .filter((item: { name: string; }) => !adultContent.some((word) => item.name && item.name.toLowerCase().includes(word)))
        // .filter((item: { title: string; }) => !adultContent.some((word) => item.title && item.title.toLowerCase().includes(word)))
        // .filter((item: { overview: string; }) => !adultContent.some((word) => item.overview && item.overview.toLowerCase().includes(word)))
        // .filter((item: { original_language: string; }) => item.original_language === 'yue');

        // KEYWORD FILTERING

        // const tvShowIds = response.data.results.map((tvShow: { id: any; }) => tvShow.id);

        // const tvShows = [];
        // for (let id of tvShowIds) {
        //     const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}&append_to_response=keywords`);

        //     const keywords = tvShowResponse.data.keywords.results.map((keyword: { name: any; }) => keyword.name);

        //     if (!keywords.some((keyword: string) => adultContent.includes(keyword))) {
        //         tvShows.push(tvShowResponse.data);
        //     }
        // }

    } catch (error) {
        console.error(error);
    }
};

export async function fetchGenres({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}&language=en-US`
    );

    const movieDetails = await response.json();
    const genres = movieDetails.genres.map((genre: { name: any; }) => genre.name);
    const genresArray = [];

    for (let index = 0; index < genres.length; index++) {
        if (genres[index]) {
            const element = genres[index];
            genresArray.push({ "name": element });
        }
    }

    return genresArray;
};


export async function fetchCast({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    const theCast = credits.cast.map((cast: { name: any; }) => cast.name);
    const castArray = [];

    for (let index = 0; index < 11; index++) {
        if (theCast[index]) {
            const element = theCast[index];
            castArray.push({ "name": element.replace(/,/g, "")});
        }
    }
    return castArray;
};

export async function fetchCrew({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    const crew = credits.crew
        .filter((crew: { job: string; known_for_department: string; }) =>
            crew.job.includes('Director') ||
            crew.known_for_department.includes('Directing') ||
            crew.known_for_department.includes('Writing'))
        .slice(0, 15)
        .map((crew: { name: any; }) => ({ "name": crew.name.replace(/,/g, "")}))
        .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);
    return crew;
};

export async function fetchTrailer({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {

    const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${tmdbApiKey}&language=en-US`
    );
    const videoData = await response.json();
    const trailers = videoData.results.filter((video: { type: string; }) => video.type === 'Trailer');

    if (trailers.length > 0) {
        const trailerID = trailers[0].key;
        const trailer = `https://www.youtube.com/watch?v=${trailerID}`;
        return trailer;
    }

    return '';

};

export async function fetchOmdbData(omdbApiKeys: string[], title: string, year: string) {
    let response: any;
    let omdbData: any;

    for (const omdbApiKey of omdbApiKeys) {
        response = await fetch(
            `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${title}&type=series&y=${year}`
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