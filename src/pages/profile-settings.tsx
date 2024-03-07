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

export default function ProfileSettings({ encryptionKey }: { encryptionKey: string }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [input, setInput] = useState('');
    const [notionApiKey, setNotionApiKey] = useState('');
    const [moviesPageLink, setMoviesPageLink] = useState('');
    const [booksPageLink, setBooksPageLink] = useState('');

    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const moviesNotionAuthUrl = process.env.NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL as string
    const booksNotionAuthUrl = process.env.NEXT_PUBLIC_BOOKS_AUTHORIZATION_URL as string

    async function handleNotionApiKeySubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            if (!input.startsWith('secret_') || input.length < 45 || input === '') {
                setApiResponse('Please enter a valid Notion Integration Token');
                return 'Please enter a valid Notion Integration Token';
            }

            const notionApiKeyResponse = await notionApiKeySubmit(input, userEmail, encryptionKey);
            setApiResponse(notionApiKeyResponse);
            setNotionApiKey(input);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleMoviesPageLinkSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();

            if (!input.startsWith('https://www.notion.so/') || input.length < 45 || input === '') {
                setApiResponse('Please enter a valid Notion link');
                return 'Please enter a valid Notion link';
            }

            const extractedValue = extractValueFromUrl(input);
            const moviesLinkResponse = await moviesLinkSubmit(extractedValue, userEmail, encryptionKey);
            setApiResponse(moviesLinkResponse);
            setMoviesPageLink(extractedValue);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleBooksPageLinkSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();

            if (!input.startsWith('https://www.notion.so/') || input.length < 50 || input === '') {
                setApiResponse('Please enter a valid Notion link');
                return 'Please enter a valid Notion link';
            }

            const extractedValue = extractValueFromUrl(input);
            const booksLinkResponse = await booksLinkSubmit(extractedValue, userEmail, encryptionKey);
            setApiResponse(booksLinkResponse);
            setBooksPageLink(extractedValue);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchUserData() {
        try {
            const response = await fetch('/api/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: session?.user?.email,
                }),
            });
            const data = await response.json();

            data.notionApiKey && setNotionApiKey(decryptData(data.notionApiKey, encryptionKey));
            data.moviesPageLink && setMoviesPageLink(decryptData(data.moviesPageLink, encryptionKey));
            data.booksPageLink && setBooksPageLink(decryptData(data.booksPageLink, encryptionKey));

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            <Head>
                <title>ClickNotes | Profile</title>
                <meta name="robots" content="noindex,nofollow"></meta>
                <meta property="og:title" content="ClickNotes | Profile" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Dren Sokoli" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={undefined} />
            <div className="flex justify-center items-center flex-grow" title='Profile'>
                <div className="bg-white relative mx-auto rounded-md md:w-[50%] w-[90%] shadow-xl">
                    <div className="flex justify-center">
                        <Image src={session?.user?.image?.toString()!} alt="" className="rounded-full mx-auto w-32 h-32 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 " width={50} height={50} />
                    </div>
                    <h1 className="font-bold text-center text-3xl text-gray-700 mt-2">{session?.user?.name}</h1>
                    <div className="w-full">
                        <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm pb-4">
                            <div id="tooltip-dark" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-small text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                Need help?
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                            <div className='w-full pl-2 pr-2'>
                                <Input label="Notion Integration Token" placeHolder="Enter your Notion Integration Token" field={notionApiKey} link="https://www.notion.so/my-integrations" setLink={setNotionApiKey} setInput={setInput} handleSubmit={handleNotionApiKeySubmit} />
                                <Input label="Movies and Shows Page Link" placeHolder="Enter your Movies and Shows Page Link" field={moviesPageLink} link={`https://www.notion.so/` + moviesPageLink} setLink={setMoviesPageLink} setInput={setInput} handleSubmit={handleMoviesPageLinkSubmit} />
                                <Input label="Books Page Link" placeHolder="Enter your Books Page Link" field={booksPageLink} link={`https://www.notion.so/` + booksPageLink} setLink={setBooksPageLink} setInput={setInput} handleSubmit={handleBooksPageLinkSubmit} />
                            </div>
                            <Link
                                className='flex flex-row justify-center items-center gap-2 py-4'
                                href='/help'
                            >
                                <button
                                    type="button"
                                    className="text-white bg-pink-500  font-medium rounded-3xl text-center shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-8 h-8"
                                >?</button>
                                <h1 className='text-md font-semibold hover:underline text-gray-600'>Not sure what to do?</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div >

        </>
    );
}

export const getServerSideProps = async (context: any) => {
    // const session = await getSession(context);
    // const encryptionKey = process.env.ENCRYPTION_KEY;

    // if (!session) {
    //     return {
    //         redirect: {
    //             destination: '/',
    //         },
    //     };
    // }

    return {
        redirect: {
            destination: '/',
        },
    };
};
