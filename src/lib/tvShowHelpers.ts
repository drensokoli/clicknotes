import axios from "axios";

export async function searchTvShowByTitle({ title, tmdbApiKey }: { title: string, tmdbApiKey: string }) {
    try {
        const include_genres = '16,35,99,18,10751,14,36,10402,9648,10749,878'
        const certification_country = 'US'
        const certification = 'TV-PG'
        const adultContent = ["sex", "porn", "nude", "sadomasochistic", "pussy", "vagina", "erotic", "lust", "softcore", "hardcore"]

        const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${title}&with_genres=${include_genres}&certification_country=${certification_country}&certification=${certification}`);

        const tvShowIds = response.data.results.map((tvShow: { id: any; }) => tvShow.id);

        const tvShows = [];
        for (let id of tvShowIds) {
            const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}&append_to_response=keywords`);

            const keywords = tvShowResponse.data.keywords.results.map((keyword: { name: any; }) => keyword.name);

            if (!keywords.some((keyword: string) => adultContent.includes(keyword))) {
                tvShows.push(tvShowResponse.data);
            }
        }

        return tvShows
            .filter((item) => item.vote_average > 6)
            .filter((item) => !adultContent.some((word) => item.name && item.name.toLowerCase().includes(word)))
            .filter((item) => !adultContent.some((word) => item.original_name && item.original_name.toLowerCase().includes(word)))
            .filter((item) => !adultContent.some((word) => item.title && item.title.toLowerCase().includes(word)))
            .filter((item) => !adultContent.some((word) => item.overview && item.overview.toLowerCase().includes(word)));

    } catch (error) {
        console.error(error);
    }
};

export async function fetchGenres({ id, tmdbApiKey }: { id: string, tmdbApiKey: string }) {
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
    // setGenres(genresArray);
};