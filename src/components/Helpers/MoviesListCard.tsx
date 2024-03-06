
import Image from 'next/dist/client/image';
import Link from 'next/link';
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function MoviesListCard({ id, title, poster_path, release_date, link, handleStatusChange, statusList, status, trailer, overview, rating, watch_link, notion_link }: {
    id: number | string;
    title: string;
    poster_path: string | null | undefined;
    release_date: string;
    link: string;
    handleStatusChange: any;
    statusList: any;
    status: string;
    trailer: string;
    overview: any;
    rating: number;
    watch_link: string;
    notion_link: string;
}) {
    const [open, setOpen] = useState(false);

    const cancelButtonRef = useRef(null);

    return (
        <div key={id} className="w-[200px] px-4 sm:px-0 py-2 sm:py-0" >
            <div className='movie-image'>
                {poster_path ? (
                    <div
                        onClick={() => setOpen(true)}
                        aria-label={title}>
                        <Image
                            src={poster_path}
                            width={200}
                            height={300}
                            alt={title}
                            className="rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                            loading="lazy"
                        />
                    </div>
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

                <select
                    className={`movie-card-button backdrop-blur-sm select-none text-white border-2 focus:border-red-700 bg-transparent focus:ring-4 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2.5 text-center mr-2 mb-2 ${status === 'To watch' ? 'border-red-700 hover:bg-red-800 focus:ring-red-800  focus:bg-red-800' :
                        status === 'Watching' ? 'border-blue-700 hover:bg-blue-800 focus:ring-blue-800 focus:bg-blue-800 focus:border-blue-700' :
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
                <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
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
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 mb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex items-center justify-center ">
                                                <Image src={poster_path || "/no-image.png"} width={200} height={200} alt={title} className='sm:w-[350px] w-[200px] h-auto' />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    <div className="w-[90%]">
                                                        {title} {release_date ? ` (${release_date.split('-')[0]})` : ''}
                                                        {rating && (
                                                            <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800 mx-2">{rating}</p>
                                                        )}
                                                    </div>
                                                </Dialog.Title>
                                                <div className="mt-2 gap-2 flex flex-col">
                                                    <p className="text-sm text-gray-500 text-left mt-2">Overview:</p>
                                                    {overview ? (
                                                        <p className="text-sm text-gray-900 text-left">{overview}</p>
                                                    ) : (
                                                        <p className="text-sm text-gray-400 text-left">No overview for this movie</p>
                                                    )}
                                                    <p className="text-sm text-gray-500 text-left mt-2">Trailer:</p>
                                                    {trailer ? (
                                                        <Link href={trailer} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline truncate">{trailer}</Link>
                                                    ) : (
                                                        <p className="text-sm text-gray-400 text-left">No trailer for this movie</p>
                                                    )}
                                                    <p className="text-sm text-gray-500 text-left mt-2">Watch:</p>
                                                    {watch_link ? (
                                                        <Link href={watch_link} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline truncate">{watch_link}</Link>
                                                    ) : (
                                                        <p className="text-sm text-gray-400 text-left">No watch link for this movie</p>
                                                    )}
                                                    <p className="text-sm text-gray-500 text-left mt-2">Notion:</p>
                                                    <Link href={notion_link} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline truncate">{notion_link}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div >
    )
}