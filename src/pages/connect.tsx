import React, { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import Image from 'next/dist/client/image';
import { decryptData } from '../lib/encryption';
import 'flowbite';
import { notionApiKeySubmit, moviesLinkSubmit, tvShowsLinkSubmit, booksLinkSubmit, extractValueFromUrl } from '../lib/profileHelpers';
import Head from 'next/head';
import Link from 'next/link';
import Toast from '@/components/Helpers/Toast';
import Input from '@/components/Helpers/Input';
import { Transition } from '@headlessui/react'

export default function Connect() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [input, setInput] = useState<string>('');

    const moviesNotionAuthUrl = process.env.NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL as string;
    const booksNotionAuthUrl = process.env.NEXT_PUBLIC_BOOKS_AUTHORIZATION_URL as string;

    const [moviesApiKey, setMoviesApiKey] = useState<string | null>(null);
    const [moviesDatabaseId, setMoviesDatabaseId] = useState<string | null>(null);

    const [booksApiKey, setBooksApiKey] = useState<string | null>(null);
    const [booksDatabaseId, setBooksDatabaseId] = useState<string | null>(null);

    const connectionMapping = [
        { connection_type: 'movies', apiKey: moviesApiKey, setApiKey: setMoviesApiKey, databaseId: moviesDatabaseId, setDataBaseId: setMoviesDatabaseId },
        { connection_type: 'books', apiKey: booksApiKey, setApiKey: setBooksApiKey, databaseId: booksDatabaseId, setDataBaseId: setBooksDatabaseId }
    ];

    const handleDatabaseIdSubmit = async (e: any, connectionType: string) => {
        e.preventDefault();

        let databaseId = e.target[0].value;

        if (!databaseId.startsWith('https://www.notion.so/') || input.length < 50 || input === '') {
            setApiResponse('Please enter a valid Notion link');
            return 'Please enter a valid Notion link';
        }
        databaseId = extractValueFromUrl(databaseId);

        const response = await fetch('/api/updateUserConnection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail,
                data: null,
                templateId: databaseId,
                type: connectionType,
            }),
        });

        const result = await response.json();

        setMoviesDatabaseId(databaseId);
        setApiResponse(result.message);
    }

    async function fetchUserData() {
        try {
            connectionMapping.forEach(async connection => {
                const response = await fetch('/api/getUserConnection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userEmail,
                        connectionType: connection.connection_type,
                    }),
                });

                const connectionData = await response.json();

                connection.setApiKey(connectionData.access_token);
                connection.setDataBaseId(connectionData.template_id);
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (userEmail) {
            fetchUserData();
        }
    }, [session]);

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 10);
    }, []);

    return (
        <>
            <Head>
                <title>ClickNotes | Connect</title>
                <meta name="robots" content="noindex,nofollow"></meta>
                <meta property="og:title" content="ClickNotes | Connect" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Dren Sokoli" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={undefined} />
            <div className="flex justify-center items-center flex-grow">

                <Transition
                    className="bg-white relative mx-auto rounded-md md:w-[50%] w-[90%] shadow-xl  border-gray-100 border-2"
                    show={show}
                    enter="transition-all ease-in-out duration-500 delay-[200ms]"
                    enterFrom="opacity-0 translate-y-6"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="flex justify-center mt-4">
                        <Image src={session?.user?.image?.toString()!} alt="" className="rounded-full mx-auto w-32 h-32 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 select-none" width={50} height={50} />
                    </div>
                    <h1 className="font-bold text-center text-3xl text-gray-700 mt-2">{session?.user?.name}</h1>
                    <div className="w-full flex flex-col">
                        <div className='flex flex-col my-4 mx-8'>
                            <label htmlFor="" className='block mb-2 text-sm text-gray-400'>Movies and TV Shows Integration Token</label>
                            <h1 className='text-gray-500 mb-4 w-full truncate pr-4 text-sm'>{moviesApiKey ? moviesApiKey : "You don't have a Movies and TV shows connection"}</h1>
                            <Input
                                label='Movies and TV Shows Database'
                                placeHolder='Enter the database ID'
                                field={moviesDatabaseId}
                                link={'https://www.notion.so/' + moviesDatabaseId}
                                setLink={setMoviesDatabaseId}
                                setInput={setInput}
                                handleSubmit={(e: any) => handleDatabaseIdSubmit(e, 'movies')}
                                connectionType='movies'
                            />
                            <div className='flex justify-center items-center'>
                                <Link href={moviesNotionAuthUrl} className="w-[400px] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Connect Movies and Shows</Link>
                            </div>
                        </div>
                        <hr className='mx-8' />
                        <div className='flex flex-col my-4 mx-8'>
                            <label htmlFor="" className='block mb-2 text-sm text-gray-400'>Books Integration Token</label>
                            <h1 className='text-gray-500 mb-4 w-full truncate pr-4 text-sm'>{booksApiKey ? booksApiKey : "You don't have a Books connection"}</h1>
                            <Input
                                label='Books Database'
                                placeHolder='Enter the database ID'
                                field={booksDatabaseId}
                                link={'https://www.notion.so/' + booksDatabaseId}
                                setLink={setBooksDatabaseId}
                                setInput={setInput}
                                handleSubmit={(e: any) => handleDatabaseIdSubmit(e, 'books')}
                                connectionType='books'
                            />
                            <div className='flex justify-center items-center'>
                                <Link href={booksNotionAuthUrl} className="w-[400px] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Connect Books</Link>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

        </>
    );
}

export const getServerSideProps = async (context: any) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
            },
        };
    } else {
        return {
            props: {},
        };
    }
};
