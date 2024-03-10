import Image from "next/image";
import Link from "next/link";
import { Transition } from '@headlessui/react'
import { useEffect, useState } from "react";
import { sign } from "crypto";
import { signIn } from "next-auth/react";

export default function NotionBanner({
    image,
    link,
    session
}: {
    image: any;
    link: string;
    session: any;
}) {

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 100);
    }, []);

    return (

        <Transition
            className="bg-white shadow-2xl border-2 border-gray-200 sm:w-[400px] w-full h-[100px] fixed sm:bottom-2 bottom-0 left-0 right-0 m-auto rounded-md z-50"
            show={show}
            enter="transition-all ease-in-out duration-500 delay-[200ms]"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <button
                type="button"
                onClick={() => setShow(false)}
                className="absolute top-2 right-2 text-gray-900 bg-white border border-gray-300 focus:outline-none rounded-full focus:ring-4 focus:ring-gray-100 text-xs p-1"
            >
                <span className="sr-only">Close menu</span>
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {session ? (
                <Link
                    href={link}
                    className='w-full h-full flex justify-center items-center'
                >
                    <Image src={image} alt="Connect to Notion" width={220} height={220} className="select-none" />
                </Link>
            ) : (
                <button
                    className='w-full h-full flex justify-center items-center'
                    onClick={() => {
                        signIn('google')
                            .finally(() => {
                                window.location.href = '/tvshows';
                            });
                    }}
                >
                    <Image src={image} alt="Connect to Notion" width={220} height={220} className="select-none" />
                </button>
            )}
        </Transition>
    );
}