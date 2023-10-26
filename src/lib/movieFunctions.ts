import axios from "axios";

export async function getCast({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    return credits.cast.slice(0, 11).map((cast: { name: any; }) => ({ "name": cast.name }));
};

export async function getDirector({ id, tmdbApiKey }: { id: number, tmdbApiKey: string }) {
    const response = await fetch(

        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}&language=en-US`
    );

    const credits = await response.json();
    return credits.crew.filter((crew: { job: string; }) => crew.job === 'Director').map((crew: { name: any; }) => crew.name)[0];
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

        const movieIds = response.data.results.map((movie: { id: any; }) => movie.id);
        const adultContent = ["sex", "porn", "nude", "sadomasochistic", "pussy", "vagina", "erotic", "lust", "softcore", "hardcore", "beautiful sisters: strip!"]

        const movies = [];
        for (let id of movieIds) {
            const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&append_to_response=keywords`);

            const keywords = movieResponse.data.keywords.keywords.map((keyword: { name: any; }) => keyword.name);

            if (!keywords.some((keyword: string) => adultContent.includes(keyword))) {
                movies.push(movieResponse.data);
            }
        }

        return movies
            .filter((item) => item.vote_average > 6)
            .filter((item) => !adultContent.some((word) => item.title.toLowerCase().includes(word)))
            .filter((item) => !adultContent.some((word) => item.original_title.toLowerCase().includes(word)))
            .filter((item) => !adultContent.some((word) => item.overview.toLowerCase().includes(word)));
    } catch (error) {
        console.error(error);
    }
};
