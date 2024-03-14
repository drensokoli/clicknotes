import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ShuffleItem({ id, name, rating, poster, overview, trailer, watchLink, notionLink, releaseDate, rated, awards, runtime, show }:
    {
        id: string | number,
        name: string,
        rating: number | null | undefined,
        poster: string | null | undefined,
        overview: string,
        trailer: string,
        watchLink: string,
        notionLink: string,
        releaseDate: string,
        rated: any,
        awards: string,
        runtime: string
        show: boolean
        ) {
    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
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
                                        {listName === "books" &&
                                            content &&
                                            content[currentShuffleItem] ? (
                                            <BookModal
                                                id={content[currentShuffleItem].id}
                                                title={content[currentShuffleItem].properties.Title.title[0].text.content}
                                                rating={content[currentShuffleItem].properties["My Rating"].number}
                                                coverImage={content[currentShuffleItem].properties["Cover Image"].url}
                                                published_date={content[currentShuffleItem].properties["Published Date"].date.start.split("-")[0]}
                                                description={content[currentShuffleItem].properties["Description"]?.rich_text[0]?.text?.content}
                                                author={content[currentShuffleItem].properties.Authors.multi_select.map((author: any) => author.name).join(", ")}
                                                pageCount={content[currentShuffleItem].properties["Page Count"].number}
                                                notion_link={`https://www.notion.so/${content[currentShuffleItem].id.replace(/-/g, "")}`}
                                            />
                                        ) : (
                                            content &&
                                            content[currentShuffleItem] && (
                                                <MovieModal
                                                    id={content[currentShuffleItem].id}
                                                    name={content[currentShuffleItem].properties.Name.title[0].text.content}
                                                    rating={content[currentShuffleItem].properties["My Rating"].number}
                                                    poster={content[currentShuffleItem].properties.Poster.url || content[currentShuffleItem].cover.external.url}
                                                    overview={content[currentShuffleItem].properties["Overview"]?.rich_text[0]?.text?.content}
                                                    trailer={content[currentShuffleItem].properties.Trailer.url}
                                                    watchLink={content[currentShuffleItem].properties["Watch Link"].url}
                                                    notionLink={`https://www.notion.so/${content[currentShuffleItem].id.replace(/-/g, "")}`}
                                                    releaseDate={content[currentShuffleItem].properties["Release Date"].date.start.split("-")[0]}
                                                    rated={content[currentShuffleItem].properties.Rated?.select?.name}
                                                    awards={content[currentShuffleItem].properties.Awards?.rich_text[0]?.text?.content}
                                                    runtime={content[currentShuffleItem].properties.Runtime?.rich_text[0]?.text?.content}
                                                />
                                            )
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}