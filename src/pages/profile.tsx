import React, { useState } from 'react';
import { signIn, useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Example from '@/components/Navbar';


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
            <div className="antialiased mt-24">
                <div className="container">
                    <div>

                        <div className="bg-white relative w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto shadow-xl border-t-2 rounded-md border-gray-20 ">
                            <div className="flex justify-center">
                                <img src={session?.user?.image?.toString()} alt="" className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 " />
                            </div>

                            <div className="mt-16">
                                <h1 className="font-bold text-center text-3xl text-gray-900">{session?.user?.name}</h1>
                                <div className="w-full">
                                    <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm pb-4">
                                        <form onSubmit={handleSubmit} className='w-full pl-2 pr-2'>
                                            <div className='mb-4 border-b-2 border-gray pb-6 pl-6 pr-6'>
                                                <label className="block mb-2 text-sm text-gray-500">API Key</label>
                                                <input
                                                    type="text"
                                                    value={notionApiKey}
                                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    placeholder="Enter your Notion API Key"
                                                />
                                            </div>
                                            <div className='mb-4 pl-6 pr-6'>
                                                <label className="block mb-2 text-sm text-gray-500">Movies Database ID</label>
                                                <input
                                                    type="text"
                                                    value={notionApiKey}
                                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    placeholder="Enter your Movies Database ID"
                                                />
                                            </div>
                                            <div className='mb-4 pl-6 pr-6'>
                                                <label className="block mb-2 text-sm text-gray-500">TV Shows Database ID</label>
                                                <input
                                                    type="text"
                                                    value={notionApiKey}
                                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    placeholder="Enter your TV Shows Database ID"
                                                />
                                            </div>
                                            <div className='mb-4 pl-6 pr-6'>
                                                <label className="block mb-2 text-sm text-gray-500">Books Database ID</label>
                                                <input
                                                    type="text"
                                                    value={notionApiKey}
                                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                                                    placeholder="Enter your Books Database ID"
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