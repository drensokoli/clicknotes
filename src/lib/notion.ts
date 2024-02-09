
export async function getMovies(notionApiKey: string, db_id: string ) {
    const url = process.env.NEXTAUTH_URL;
    const response = await fetch(`${url}/api/getNotionDb`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notionApiKey, db_id }),
    });

    const data = await response.json();
    return data.response.results;
}
