import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react'

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
                    templateId: response.duplicated_template_id.split('-').join(''),
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

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 100);
    }, []);

    return (
        <div className="flex flex-col items-center h-screen">
            <Transition
                className="mx-auto my-16 max-w-md space-y-4"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <img src="/connected.png" alt="logo" width={400} height={400} />
            </Transition>
            <Transition
                className="mx-auto max-w-md space-y-4"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <h1 className='text-3xl text-center'>You successfully connected to Notion!</h1>
            </Transition>
            <a href="/my-lists" className='m-10'>
                <Transition
                    className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline text-lg"
                    show={show}
                    enter="transition-all ease-in-out duration-500 delay-[200ms]"
                    enterFrom="opacity-0 translate-y-6"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    My Lists
                    <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Transition>
            </a>
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
    console.log("response", response);

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