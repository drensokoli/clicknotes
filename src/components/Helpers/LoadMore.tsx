import React, { useRef, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react'

export default function LoadMore({ displayCount, setDisplayCount, media, secondaryFunction }: {
    displayCount: number;
    setDisplayCount: React.Dispatch<React.SetStateAction<number>>;
    media: any[];
    secondaryFunction?: () => void;
}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 10);
    }, []);

    return (

        <Transition
            className='w-full flex justify-center items-center mt-4'
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
                className=" text-blue-700 select-none hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-14 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => {
                    setDisplayCount(displayCount + 20);
                    if (secondaryFunction) secondaryFunction();
                }}
            >LOAD MORE</button>
        </Transition>
    );
}