import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function NotionCallback({ response, type }: { response: any, type: any }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const updateNotionConnection = async () => {
        try {
            const res = await fetch('/api/updateUserConnection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: userEmail,
                    data: response,
                    type
                })
            })

            const result = await res.json();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (response && userEmail) {
            updateNotionConnection();
        }
    }, [response, userEmail]);

    return (
        <div className="flex flex-col items-center h-screen">
            <h1>{response.access_token}</h1>
            <h1>{response.duplicated_template_id}</h1>
        </div>
    );
}

export async function getServerSideProps(context: any) {

    const type = context.params.type;
    let clientId;
    let clientSecret;

    if (type === 'movies') {
        clientId = process.env.MOVIES_NOTION_OAUTH_CLIENT_ID;
        clientSecret = process.env.MOVIES_NOTION_OAUTH_CLIENT_SECRET;
    } else if (type === 'books') {
        clientId = process.env.BOOKS_NOTION_OAUTH_CLIENT_ID;
        clientSecret = process.env.BOOKS_NOTION_OAUTH_CLIENT_SECRET;
    } else {
        return {
            redirect: {
                destination: '/profile-settings',
                permanent: false,
            },
        }
    }

    const code = context.query.code

    // Send credentials to Notion API to get the access code
    const res = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'post',
        headers: new Headers({
            'Authorization': 'Basic ' + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            grant_type: `authorization_code`,
            code: code,
            redirect_uri: `${process.env.BASE_URL}/auth/notion/callback/${type}`
        }),
    });

    const response = await res.json();

    if (response.error) {
        return {
            redirect: {
                destination: '/profile-settings',
                permanent: false,
            },
        }
    }

    return { props: { response, type } };
}