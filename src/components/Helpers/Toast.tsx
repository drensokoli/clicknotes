import { Transition } from '@headlessui/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Toast({ apiResponse, setApiResponse, pageLink }: { apiResponse: string | null, setApiResponse: any, pageLink: string | undefined }) {

    const [show, setShow] = useState(false);
    const [showAdding, setShowAdding] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 100);
    }, []);


    if (apiResponse === 'Added movie to Notion' || apiResponse === 'Added TV show to Notion' || apiResponse === 'Added book to Notion') {
        setTimeout(() => {
            setApiResponse(null);
        }, 5000);

        return (
            <Transition id="toast-success" className="flex items-center w-fit max-w-xs p-4 text-gray-800 bg-white border-2 border-green-400 fixed left-5 bottom-5 z-20 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div>
                    <div className="ml-3 text-md font-normal mr-4">{apiResponse}</div>
                    <div className="ml-3 text-sm font-normal"><a href={pageLink} target='_blank' className='text-blue-700 underline font-semibold'>Go to page</a></div>
                </div>
                <button type="button"
                    onClick={() => setApiResponse(null)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </Transition>
        );

    } else if (apiResponse === 'Error adding movie to Notion' || apiResponse === 'Error adding TV show to Notion' || apiResponse === 'Error adding book to Notion') {

        setTimeout(() => {
            setApiResponse(null);
        }, 5000);

        return (
            <Transition id="toast-danger" className="flex items-center w-fit max-w-xs p-4 text-gray-800 bg-white border-2 border-red-400 fixed left-5 bottom-5 z-20 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                    </svg>
                    <span className="sr-only">Error icon</span>
                </div>
                <div>
                    <div className="ml-3 text-sm font-normal mr-4">{apiResponse}</div>
                    <div className="ml-3 text-sm font-normal">
                        <Link href="href='https://affiliate.notion.so/connect-to-notion" target="_blank" aria-label='Help page'>
                            Need <span className="text-blue-700 underline font-semibold">help</span> ?
                        </Link>
                    </div>
                </div>
                <button type="button"
                    onClick={() => setApiResponse(null)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </Transition>
        );
    } else if (apiResponse === 'Adding movie to Notion...' || apiResponse === 'Adding TV show to Notion...' || apiResponse === 'Adding book to Notion...') {
        setTimeout(() => {
            setShowAdding(true);
        }, 100);
        return (
            <Transition id="toast-danger" className="flex items-center w-fit max-w-xs p-4 text-gray-800 bg-white border-2 border-blue-400 fixed left-5 bottom-5 z-20 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert"
                show={showAdding}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9" />
                    </svg>
                    <span className="sr-only">Adding</span>
                </div>
                <div className="ml-3 text-sm font-normal mr-4">{apiResponse}</div>
            </Transition>
        );
    } else if (apiResponse === 'User data updated successfully') {

        setTimeout(() => {
            setApiResponse(null);
        }, 5000);

        return (
            <Transition id="toast-success" className="flex items-center w-fit max-w-xs p-4 text-gray-800 bg-white border-2 border-green-400 fixed left-5 bottom-5 z-20 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ml-3 text-sm font-normal mr-4">{apiResponse}</div>
                <button type="button"
                    onClick={() => setApiResponse(null)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </Transition>
        );
    } else if (apiResponse === 'Please enter a valid Notion link' || apiResponse === 'Please enter a valid Notion Integration Token') {

        setTimeout(() => {
            setApiResponse(null);
        }, 5000);

        return (
            <Transition id="toast-danger" className="flex items-center w-fit max-w-xs p-4 text-gray-800 bg-white border-2 border-red-400 fixed left-5 bottom-5 z-20 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                    </svg>
                    <span className="sr-only">Error icon</span>
                </div>
                <div className="ml-3 text-sm font-normal mr-4">{apiResponse}</div>
                <button type="button"
                    onClick={() => setApiResponse(null)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </Transition>
        );
    } else {
        return null;
    }
}
