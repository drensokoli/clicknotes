// Navbar.tsx
import React from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleProfile = () => {
        router.push('/profile');
    };
    const menuItems = [
        { title: 'Movies', path: '/movies' },
        { title: 'TV Shows', path: '/tvshows' },
        { title: 'Books', path: '/books' },
    ];

    return (
        <>
            <nav>
                <div className="bg-peach-dark p-4 fixed w-full top-0 z-10 shadow-md flex justify-between">
                    <a href="/">
                        <Image src="/logo.png" alt="logo" width={30} height={100} className='ml-6 mr-6' />
                    </a>
                    <div className='flex flex-row gap-10 items-center'>
                        {menuItems.map(item => (
                            <Link key={item.path} href={item.path}>
                                <h1
                                    className={`text-xl font-bold ${router.pathname === item.path ? 'border-b-2 border-indigo-500' : ''
                                        }`}
                                >
                                    {item.title}
                                </h1>
                            </Link>
                        ))}
                    </div>
                    <div>
                        {!session ? (
                            <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800" onClick={() => signIn()}>
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 md:font-20">
                                    Sign in
                                </span>
                            </button>

                        ) : (
                            <button
                                className="profile-icon"
                                onClick={handleProfile}
                            >

                                <FontAwesomeIcon icon={faUser} height={100} width={100} className='pt-3' />
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
