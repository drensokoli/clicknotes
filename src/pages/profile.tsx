import React, { useState } from 'react';
import { signIn, useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Example from '@/components/Example';


export default function Profile() {
    const { data: session, status } = useSession();
    const [notionApiKey, setNotionApiKey] = useState('');
    const [notionDatabaseId, setNotionDatabaseId] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Notion API Key:', notionApiKey);
        console.log('Notion Database ID:', notionDatabaseId);
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    var picture = session?.user?.image;
    const router = useRouter();

    const back = () => {
        router.push('/');
    }

    return (
        <>
            <Example />

            <div className="antialiased">
                <div className="container mx-auto my-60">
                    <div>

                        <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto">
                            <div className="flex justify-center">
                                <img src={session?.user?.image?.toString()} alt="" className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110" />
                            </div>

                            <div className="mt-16">
                                <h1 className="font-bold text-center text-3xl text-gray-900">{session?.user?.name}</h1>
                                <p>
                                    <span>

                                    </span>
                                </p>

                                <div className="w-full">
                                    <h3 className="font-medium text-gray-900 text-left px-6">Your Notion info</h3>
                                    <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                                        <form onSubmit={handleSubmit} className='w-full pl-2 pr-2'>
                                            <div className="mb-4">
                                                <label htmlFor="">API Key</label>
                                                <input
                                                    type="text"
                                                    value={notionApiKey}
                                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-100"
                                                    placeholder='Enter your Notion API Key'
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="">Movie database</label>
                                                <input
                                                    type="text"
                                                    value={notionDatabaseId}
                                                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  bg-white-100"
                                                    placeholder='Enter your Notion Database ID'
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="">TV Show database</label>
                                                <input
                                                    type="text"
                                                    value={notionDatabaseId}
                                                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  bg-white-100"
                                                    placeholder='Enter your Notion Database ID'
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="">Book database</label>
                                                <input
                                                    type="text"
                                                    value={notionDatabaseId}
                                                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  bg-white-100"
                                                    placeholder='Enter your Notion Database ID'
                                                />
                                            </div>
                                        </form>
                                    </div>

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