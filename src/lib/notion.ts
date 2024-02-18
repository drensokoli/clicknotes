
export async function getMovies(notionApiKey: string, db_id: string, setMovies: any) {
    const url = process.env.URL;
    const response = await fetch(`${url}/api/getNotionDb`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notionApiKey, db_id }),
    });

    const data = await response.json();
    setMovies(data);
    return data.response.results;
}
