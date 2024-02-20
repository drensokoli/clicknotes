
export async function getMovies(notionApiKey: string, db_id: string, setMovies: any) {
    const response = await fetch('/api/getNotionDb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notionApiKey, db_id }),
    });

    const data = await response.json();
    setMovies(data.response.results);
    return data.response.results;
}


export async function getMoviesInSSR(notionApiKey: string, db_id: string) {
    const response = await fetch('/api/getNotionDb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notionApiKey, db_id }),
    });

    const data = await response.json();
    return data.response.results;
}