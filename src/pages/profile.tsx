import React, { useState } from 'react';
import { signIn, useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function Profile() {
    const { data: session, status } = useSession();
    const [notionApiKey, setNotionApiKey] = useState('');
    const [notionDatabaseId, setNotionDatabaseId] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Notion API Key:', notionApiKey);
        console.log('Notion Database ID:', notionDatabaseId);
        console.log("MONGO:", process.env.NEXT_PUBLIC_MONGODB_URI);
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
        <div className='bg-peach h-screen background-image'>
            <div className='flex justify-between p-10 items-baseline gap-3'>
                <div className='flex flex-row justify-center items-center cursor-pointer' onClick={back}>
                    <img src="/back-arrow.png" alt="" className='h-3' />
                    <h1 className='text-xl pl-2'>HOME</h1>
                </div>
                <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800" onClick={() => signOut()} >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 md:font-20">
                        Sign out
                    </span>
                </button>
            </div>
            <div className="container mx-auto px-4 py-8 flex flex-col items-center">
                <div className=" flex flex-col items-center ">
                    <h1 className='text-3xl pb-10 font-bold text-center'>Welcome back, {session?.user?.name}</h1>
                    <img src={picture?.toString()} alt="" className='h-auto w-22 p-5' />
                </div>
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