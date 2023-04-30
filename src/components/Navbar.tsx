// Navbar.tsx
import React from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ input, handleInputChange }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // const signIn = () => {
    //     signIn('google');
    // };

    const handleProfile = () => {
        router.push('/profile');
    };

    return (
        <>
            <nav>
                <div className="bg-peach-dark p-4 fixed w-full top-0 z-10 shadow-md flex justify-around">
                    <a href="/">
                        <Image src="/logo.png" alt="logo" width={30} height={100} className='ml-2' />
                    </a>
                    <form onSubmit={(e) => e.preventDefault()} className="w-3/5 md:w-2/4 mx-auto invisible sm:visible">
                        <input
                            type="text"
                            placeholder="Enter movie title"
                            value={input}
                            onChange={handleInputChange}
                            className="border rounded p-2 w-full text-gray-900 bg-peach-light"
                        />
                    </form>
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
                                {/* Replace the "Profile" text with an actual profile icon */}

                                <FontAwesomeIcon icon={faUser} height={100} width={100} className='pt-3'/>
                            </button>
                        )}
                    </div>
                </div>
                <div className="bg-peach-dark p-4 fixed w-full top-16 z-10 shadow-sm flex items-center sm:hidden">
                    <form onSubmit={(e) => e.preventDefault()} className="w-full lg:w-2/4 mx-auto">
                        <input
                            type="text"
                            placeholder="Enter movie title"
                            value={input}
                            onChange={handleInputChange}
                            className="border rounded p-2 w-full text-gray-900"
                        />
                    </form>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
