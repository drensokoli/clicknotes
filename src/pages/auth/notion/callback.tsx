import { useEffect, useState } from 'react';

export default function NotionCallback({ response }: { response: any }) {

    useEffect(() => {
        if (response) {
            console.log("response", response);
        }
    }, [response]);

    return (
            <div className="justify-center align-center flex h-screen">
                <h1>{response.access_token}</h1>
                <h1>{response.duplicated_template_id}</h1>
            </div>
    );
}

export async function getServerSideProps(context: any) {

        const code = context.query.code

        // Send credentials to Notion API to get the access code
        const res = await fetch('https://api.notion.com/v1/oauth/token', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Basic ' + Buffer.from(process.env.NOTION_OAUTH_CLIENT_ID + ":" + process.env.NOTION_OAUTH_CLIENT_SECRET).toString('base64'),
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                grant_type: `authorization_code`,
                code: code,
                redirect_uri: `${process.env.BASE_URL}/auth/notion/callback`
            }),
        });

        const response = await res.json();

        return { props: { response } };

}
