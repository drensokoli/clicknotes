import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { decryptData } from '@/lib/crypto';
import { Client } from '@notionhq/client';

const Saved: React.FC = () => {
    const { data: session } = useSession();
    const [databaseLink, setDatabaseLink] = useState<string>('');
    const [notionApiKey, setNotionApiKey] = useState<string>('');
    const [pages, setPages] = useState<any[]>([]);
    const { Client } = require('@notionhq/client');


    useEffect(() => {

        const notion = new Client({ auth: notionApiKey });
        const databaseId = databaseLink;

        const fetchPages = async () => {
            const response = await notion.databases.query({
                database_id: databaseId,
                filter_properties: ["title"]
            })
            return response.results;
        }

        fetchPages().then(pages => setPages(pages));

    }, []);

    const fetchUser = async () => {
        const response = fetch('/api/getUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: session?.user?.email }),
        });

        const user = await (await response).json();

        const encryptedNotionApi = user.notionApiKey;
        const notionApi = decryptData(encryptedNotionApi);

        const encryptedDbLink = user.moviesPageLink;
        const decryptedDbLink = decryptData(encryptedDbLink);
        
        console.log(notionApi);
        console.log(decryptedDbLink);
        setDatabaseLink(decryptedDbLink);
        setNotionApiKey(notionApi);
    }

    fetchUser();



    return (
        <>
            <div>
                <h1>Saved</h1>
                <p>Here are the movies you've saved to Notion.</p>
                <ul>
                    {pages.map(page => <li key={page.id}>{page.properties.Name.title[0].plain_text}</li>)}
                </ul>
            </div>
        </>
    );
}

export default Saved;