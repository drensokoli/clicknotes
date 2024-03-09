import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react'
import Input from '@/components/Helpers/Input';
import { template } from 'lodash';
import { extractValueFromUrl } from '@/lib/profileHelpers';
import Toast from '@/components/Helpers/Toast';

export default function NotionCallback({ response, type }: { response: any, type: any }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [input, setInput] = useState('');
    const [databaseId, setDatabaseId] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [apiResponse, setApiResponse] = useState<string>('');

    const updateNotionConnection = async () => {
        try {
            const templateId = response.duplicated_template_id ? response.duplicated_template_id.split('-').join('') : null;
            const res = await fetch('/api/updateUserConnection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    data: response,
                    templateId: templateId,
                    type: type,
                }),
            });

            const result = await res.json();

            if (templateId === null) {
                setShowInput(true);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateDatabaseId = async () => {
        if (!input.startsWith('https://www.notion.so/') || input.length < 50 || input === '') {
            return 'Please enter a valid Notion link';
        }

        const extractedDatabaseId = extractValueFromUrl(input);

        const updateDatabaseIdResponse = await fetch('/api/updateUserConnection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail,
                data: null,
                templateId: extractedDatabaseId,
                type: type,
            }),
        });

        const data = await updateDatabaseIdResponse.json();;

        setShowInput(false);
        setApiResponse(data.message);
    }

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
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={undefined} />
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
                <h1 className='sm:text-3xl text-2xl text-center py-4 px-12'>You successfully connected to Notion!</h1>
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
                <img src="/connected.png" alt="logo" className='w-[300px] h-auto sm:w-[400px]'/>
            </Transition>
            {!showInput ? (
                <Transition
                    className="m-10"
                    show={show}
                    enter="transition-all ease-in-out duration-500 delay-[200ms]"
                    enterFrom="opacity-0 translate-y-6"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Link href="/my-lists" className='inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline text-lg'>
                        My Lists
                        <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </Link>
                </Transition>
            ) : (
                <Transition
                    className="mx-auto max-w-md space-y-4 w-[90%] m-10"
                    show={show}
                    enter="transition-all ease-in-out duration-500 delay-[200ms]"
                    enterFrom="opacity-0 translate-y-6"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Input
                        label='Database ID'
                        placeHolder='Enter your Notion database ID'
                        field={databaseId}
                        link={'https://www.notion.so/' + databaseId}
                        setLink={setDatabaseId}
                        setInput={setInput}
                        handleSubmit={updateDatabaseId}
                        connectionType={type}
                    />
                </Transition>
            )}
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
                destination: '/movies',
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
                destination: '/movies',
                permanent: false,
            },
        }
    }

    return {
        props: {
            response,
            type
        }
    };
}