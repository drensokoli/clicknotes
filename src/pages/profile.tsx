import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function Profile() {
    const { data: session, status } = useSession();
    const [notionApiKey, setNotionApiKey] = useState('');
    const [notionDatabaseId, setNotionDatabaseId] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Save the Notion API Key and database ID to your desired storage, e.g., local storage, database, etc.
        console.log('Notion API Key:', notionApiKey);
        console.log('Notion Database ID:', notionDatabaseId);
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return (
            <div className='h-screen background-image bg-peach p-10'>
                <div className="not-signed-in-message ">
                    Please sign in to view your profile.
                </div>
            </div>
        );
    }


    return (
        <div className='bg-peach h-screen background-image'>
            <div className="container mx-auto px-4 py-8 centered-form">
                <h1 className='text-3xl pb-10 font-bold text-center'>Welcome back, User</h1>
                <form onSubmit={handleSubmit} className='sm:w-5/6 w-full'>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={notionApiKey}
                            onChange={(e) => setNotionApiKey(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-100"
                            placeholder='Enter your Notion API Key'
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={notionDatabaseId}
                            onChange={(e) => setNotionDatabaseId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  bg-white-100"
                            placeholder='Enter your Notion Database ID'
                        />
                    </div>
                    <div className='flex justify-center'>

                        <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
