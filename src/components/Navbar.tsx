import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/dist/client/image';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const navigation = [
        { name: 'Movies', href: '/movies' },
        { name: 'TV Shows', href: '/tvshows', current: false },
        { name: 'Books', href: '/books', current: false },
    ];

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    };


    return (
        <>
            <Disclosure as="nav" className="backdrop-blur-md bg-white bg-opacity-75 fixed w-full top-0 z-10 shadow-lg ">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-18">
                            <div className="relative flex h-16 justify-between items-center">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-between">
                                    <div className="flex flex-shrink-0 hidden sm:block sm:items-center">
                                        <Link href="/">
                                            <Image src="/logo.png" alt="logo" width={30} height={40}
                                                className="block h-8 w-auto lg:hidden"
                                            />
                                        </Link>
                                        <Link href="/">
                                            <Image src="/logo.png" alt="logo" width={30} height={40}
                                                className="hidden h-8 w-auto lg:block"
                                            />
                                        </Link>
                                    </div>
                                    <div className="hidden sm:block pr-14">
                                        <div className="flex gap-6">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}

                                                    className={`text-gray-500 hover:border-b-2 hover:border-indigo-400 text-sm font-medium ${router.pathname === item.href ? ' text-gray-800 border-b-2 border-blue-700' : ''
                                                        }`}
                                                >{item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center sm:static ">

                                        <Menu as="div" className="relative">

                                            <div>
                                                {status === 'loading' ? (

                                                    <div role="status">
                                                        <svg aria-hidden="true" className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>

                                                ) : !session ? (

                                                    <button type="button"
                                                        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                                        onClick={() => signIn('google')}
                                                    >Sign in</button>

                                                ) : (
                                                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <Image
                                                            className="h-8 w-8 rounded-full"
                                                            src={session?.user?.image?.toString()!}
                                                            width={30} height={40}
                                                            alt=""
                                                        />
                                                    </Menu.Button>
                                                )}

                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                href="/profile"
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Your Profile
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <h1
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                                onClick={() => signOut()}>
                                                                Sign out
                                                            </h1>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2 flex flex-col items-center">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={`text-gray-400 hover:bg-gray-700 hover:text-white w-full text-center block rounded-md px-3 py-2 text-base font-medium ${router.pathname === item.href ? ' bg-gray-900 text-black' : ''
                                                        }`}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div className='h-24'></div>
        </>
    )
}
