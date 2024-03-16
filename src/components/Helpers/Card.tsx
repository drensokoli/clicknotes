
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/dist/client/image';
import Link from 'next/link';
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react';

export default function Card({ id, title, poster_path, release_date, link, handleAddToNotion }: {
    id: number | string;
    title: string;
    poster_path: string | null | undefined;
    release_date: string;
    link: string;
    handleAddToNotion: any;
}) {

    const { data: session } = useSession();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 10);
    }, []);
    return (
        <Transition
            className="sm:w-[200px] px-4 sm:px-0 py-2 sm:py-0"
            show={show}
            enter="transition-all ease-in-out duration-500 delay-[200ms]"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className='movie-image'>
                {poster_path ? (
                    <Link href={link} passHref target='_blank' aria-label={`${title} ${release_date}`}>
                        <Image
                            src={poster_path}
                            width={200}
                            height={300}
                            alt={title}
                            className="rounded-sm min-h-[240px] max-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                            loading="lazy"
                        />
                    </Link>
                ) : (
                    <Image
                        src="/no-image.png"
                        width={200}
                        height={300}
                        alt={title}
                        className="rounded-sm h-auto select-none"
                        loading="lazy"
                    />
                )}

                <button type="button"
                    className="movie-card-button bg-blue-800 select-none bg-opacity-80 backdrop-blur-sm text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    onClick={() => { session ? handleAddToNotion() : signIn('google') }}
                >
                    Add to Notion
                </button>
            </div>

            <Link href={link} passHref target='_blank' aria-label={`${title} ${release_date}`}>
                <h2 className="font-bold text-center text-gray-800 hover:text-blue-800 hover:underline transition-colors duration-200 mt-1">
                    <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
                </h2>
            </Link>
        </Transition>
    )
}