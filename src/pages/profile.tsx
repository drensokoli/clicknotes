import React, { use, useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/dist/client/image';
import { decryptData } from '../lib/crypto';
import 'flowbite';
import { notionApiKeySubmit, moviesLinkSubmit, tvShowsLinkSubmit, booksLinkSubmit } from '../lib/profileHelpers';

export default function Profile() {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email;

    const [notionApiKey, setNotionApiKey] = useState('');
    const [moviesPageLink, setMoviesPageLink] = useState('');
    const [tvShowsPageLink, setTvShowsPageLink] = useState('');
    const [booksPageLink, setBooksPageLink] = useState('');

    const router = useRouter();

    async function handleNotionApiKeySubmit() {
        try {
            notionApiKeySubmit(notionApiKey, userEmail);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleMoviesPageLinkSubmit() {
        try {
            moviesLinkSubmit(moviesPageLink, userEmail);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleTvShowsPageLinkSubmit() {
        try {
            tvShowsLinkSubmit(tvShowsPageLink, userEmail);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleBooksPageLinkSubmit() {
        try {
            booksLinkSubmit(booksPageLink, userEmail);
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

            data.notionApiKey && setNotionApiKey(decryptData(data.notionApiKey));
            data.moviesPageLink && setMoviesPageLink(decryptData(data.moviesPageLink));
            data.tvShowsPageLink && setTvShowsPageLink(decryptData(data.tvShowsPageLink));
            data.booksPageLink && setBooksPageLink(decryptData(data.booksPageLink));

        } catch (error) {
            console.error('Error:', error);
        }
    }


    useEffect(() => {
        if (session) {
            fetchUserData();
        }
    }, [session]);

    return (
        <>
            <div className="antialiased mt-18 flex justify-center items-center h-screen" title='Profile'>
                <div className="container">
                    <div className="bg-white relative w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto rounded-md drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <div className="flex justify-center">
                            <Image src={session?.user?.image?.toString()!} alt="" className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 " width={50} height={50} />
                        </div>
                        <div className="mt-16">
                            <h1 className="font-bold text-center text-3xl text-gray-900">{session?.user?.name}</h1>
                            <div className="w-full">
                                <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm pb-4">
                                    <button data-tooltip-target="tooltip-dark"
                                        type="button"
                                        className="text-white bg-pink-500  font-medium rounded-3xl text-center shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none fixed top-4 right-4 w-8 h-8"
                                        onClick={() => router.push('/help')}
                                    >
                                        ?
                                    </button>
                                    <div id="tooltip-dark" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-small text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                        Need help?
                                        <div className="tooltip-arrow" data-popper-arrow></div>
                                    </div>

                                    <form className='w-full pl-2 pr-2'>
                                        <div className='mb-4 border-b-2 border-gray pb-6 pl-6 pr-6'>
                                            <label className="block mb-2 text-sm text-gray-500">Notion API Key</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setNotionApiKey(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder={notionApiKey || "Enter your Notion API Key"}
                                            />
                                            <button type="submit" onClick={handleNotionApiKeySubmit}>
                                                Save
                                            </button>
                                        </div>
                                        <div className='mb-4 pl-6 pr-6'>
                                            <label className="block mb-2 text-sm text-gray-500">Movies Database link</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setMoviesPageLink(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder={moviesPageLink || "Enter your Movies Page link"}
                                            />
                                            <button type="submit" onClick={handleMoviesPageLinkSubmit}>
                                                Save
                                            </button>
                                        </div>
                                        <div className='mb-4 pl-6 pr-6'>
                                            <label className="block mb-2 text-sm text-gray-500">TV Shows Database link</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setTvShowsPageLink(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder={tvShowsPageLink || "Enter your TV Shows Page link"}
                                            />
                                            <button type="submit" onClick={handleTvShowsPageLinkSubmit}>
                                                Save
                                            </button>
                                        </div>
                                        <div className='mb-4 pl-6 pr-6'>
                                            <label className="block mb-2 text-sm text-gray-500">Books Database link</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setBooksPageLink(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                                                placeholder={booksPageLink || "Enter your Books Page link"}
                                            />
                                            <button type="submit" onClick={handleBooksPageLinkSubmit}>
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

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
    }

    return {
        props: {
            session,
        },
    };
};