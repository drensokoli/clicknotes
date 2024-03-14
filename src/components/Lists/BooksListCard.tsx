
import Image from 'next/dist/client/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import BookModal from './BookModal';

export default function BooksListCard({ id, title, cover, link, handleStatusChange, statusList, status, rating, pageCount, description, author, notion_link, googleBooksId, publisher, publishedDate
}: {
    id: number | string;
    title: string;
    cover: string | null | undefined;
    link: string;
    handleStatusChange: any;
    statusList: any;
    status: string;
    rating: number;
    description?: string;
    pageCount?: number;
    author: string;
    notion_link: string;
    googleBooksId: string;
    publisher: string;
    publishedDate: string;
}) {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const cancelButtonRef = useRef(null);

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
                {cover ? (
                    <div
                        onClick={() => setOpen(true)}
                        aria-label={title}>
                        <Image
                            src={cover}
                            width={200}
                            height={300}
                            alt={title}
                            className="rounded-sm min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => setOpen(true)}
                        aria-label={title}>
                        <Image
                            src="/no-image.png"
                            width={200}
                            height={300}
                            alt={title}
                            className="rounded-sm h-auto select-none"
                            loading="lazy"
                        />
                    </div>
                )}
                <select
                    className={`movie-card-button backdrop-blur-sm select-none text-white border-2 bg-transparent focus:ring-4 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2.5 text-center mr-2 mb-2 ${status === 'To read' ? 'border-red-700 hover:bg-red-800 focus:ring-red-800 focus:bg-red-800 focus:border-red-700' :
                        status === 'Reading' ? 'border-blue-700 hover:bg-blue-800 focus:ring-blue-800 focus:bg-blue-800 focus:border-blue-700' :
                            'border-green-700 hover:bg-green-800 focus:ring-green-800 focus:bg-green-800 focus:border-green-700'
                        }`}
                    value={status}
                // onChange={(e) => handleStatusChange(e, id)}
                >
                    {statusList.map((status: any) => (
                        <option key={status} value={status} className='bg-gray-100 text-gray-800'>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
            <h2 className="font-bold text-center text-gray-800 mt-1">
                <span>{title} {publishedDate ? ` (${publishedDate.split('-')[0]})` : ''}</span>
            </h2>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <button
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                        type="button"
                                        className="absolute top-2 right-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="flex flex-row justify-center items-center p-10">
                                        <BookModal
                                            id={id}
                                            title={title}
                                            rating={rating}
                                            coverImage={cover}
                                            description={description}
                                            author={author}
                                            pageCount={pageCount}
                                            notion_link={notion_link}
                                            googleBooksId={googleBooksId}
                                            publisher={publisher}
                                            publishedDate={publishedDate}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </Transition>
    )
}