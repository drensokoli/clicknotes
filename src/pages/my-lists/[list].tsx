import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Client } from '@notionhq/client';
import MoviesListCard from "@/components/Lists/MoviesListCard";
import LoadMore from "@/components/Helpers/LoadMore";
import BooksListCard from "@/components/Lists/BooksListCard";
import ListSkeleton from "@/components/Lists/ListSkeleton";
import { Dialog, Transition } from '@headlessui/react'
import Link from "next/link";
import MovieModal from "@/components/Lists/MovieModal";
import BookModal from "@/components/Lists/BookModal";

export default function List({ statusList, listName }: { statusList: any, listName: string }) {

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);

    const [input, setInput] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);
    };

    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(20);

    const [listToWatch, setListToWatch] = useState<any[]>();
    const [listWatching, setListWatching] = useState<any[]>();
    const [listWatched, setListWatched] = useState<any[]>();

    const [cursorToWatch, setCursorToWatch] = useState<string | undefined>();
    const [cursorWatching, setCursorWatching] = useState<string | undefined>();
    const [cursorWatched, setCursorWatched] = useState<string | undefined>();

    const [content, setContent] = useState<any[]>();

    const [status, setStatus] = useState(statusList[0]);

    const listStates = [
        {
            status: statusList[0],
            list: listToWatch,
            setList: setListToWatch,
            cursor: cursorToWatch,
            setCursor: setCursorToWatch,
        },
        {
            status: statusList[1],
            list: listWatching,
            setList: setListWatching,
            cursor: cursorWatching,
            setCursor: setCursorWatching,
        },
        {
            status: statusList[2],
            list: listWatched,
            setList: setListWatched,
            cursor: cursorWatched,
            setCursor: setCursorWatched,
        }
    ];

    const [currentShuffleItem, setCurrentShuffleItem] = useState(0);

    const handleShuffle = async () => {
        setOpen(true);
        let contentLength = content?.length;
        const statusFilter = listStates.find((listState) => listState.status === status)?.status;
        const setList = listStates.find((listState) => listState.status === status)?.setList as any;
        let cursor = listStates.find((listState) => listState.status === status)?.cursor as any;
        const setCursor = listStates.find((listState) => listState.status === status)?.setCursor;

        const intervalId = setInterval(() => {
            setCurrentShuffleItem(Math.floor(Math.random() * (contentLength || 0)));
        }, 100);

        if (cursor === null) {
            setTimeout(() => {
                clearInterval(intervalId);
            }, 2500);
        } else {
            while (cursor !== null) {
                await getNotionDatabasePages(
                    statusFilter,
                    setList,
                    cursor,
                    setCursor
                ).then((data) => {
                    cursor = data.nextCursor;
                    contentLength += data.list.length;
                    if (cursor === null) {
                        clearInterval(intervalId);
                    }
                });
            }
        }
    };

    const getNotionDatabasePages = async (statusFilter: any, setList: any, cursor: any, setCursor: any) => {
        try {
            if (cursor === null) return;
            const response = await fetch('/api/getNotionDatabasePages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, listName, cursor, statusFilter }),
            });

            const data = await response.json();

            if (response.status !== 200) {
                console.error(data.error.message);
                return;
            }

            setCursor(data.nextCursor);
            setList((prevList: any[]) => {
                const newList = [...(prevList || []), ...data.list];
                return newList.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );
            });
            setContent(listStates.find((listState) => listState.status === status)?.list || []);
            setLoading(false);

            return data;

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (userEmail) {
            listStates.forEach((listState) => {
                getNotionDatabasePages(listState.status, listState.setList, listState.cursor, listState.setCursor);
            });
        }
    }, [session]);

    useEffect(() => {
        setContent(listStates.find((listState) => listState.status === status)?.list || []);
    }, [listToWatch, listWatching, listWatched, currentShuffleItem]);

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />

                {statusList && (
                    <div className="flex justify-end items-center w-[90%] sm:w-[70%] gap-2 overflow-auto">
                        <button
                            className="m-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            onClick={() => {
                                handleShuffle();
                            }}
                        >
                            <div className="flex flex-row justify-center items-center gap-1">
                                <h1>Shuffle</h1>
                                <img src="/shuffle-white.png" alt="" className="h-[17px]" />
                            </div>
                        </button>
                        <div>
                            <select
                                className="m-1 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setContent(listStates.find((listState) => listState.status === e.target.value)?.list || []);
                                    setDisplayCount(20);
                                }}
                                value={status}
                            >
                                {statusList.map((list: any) => (
                                    <option key={list} value={list}>
                                        {list}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {loading ? (
                    <ListSkeleton />
                ) : (
                    <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4'>
                        {listName === 'books' && content ? (
                            <>
                                {content
                                    .slice(0, displayCount)
                                    .map((listItem: any) => (
                                        <BooksListCard
                                            key={listItem.id}
                                            id={listItem.id}
                                            title={listItem.properties.Title.title[0].text.content}
                                            cover={listItem.properties["Cover Image"].url}
                                            published_date={listItem.properties['Published Date'].date.start || ''}
                                            link={`https://books.google.com/books?id=${listItem.id}`}
                                            handleStatusChange={handleInputChange}
                                            statusList={statusList}
                                            status={listItem.properties.Status.status.name}
                                            rating={listItem.properties['My Rating'].number}
                                            description={listItem.properties["Description"]?.rich_text[0]?.text?.content}
                                            pageCount={listItem.properties['Page Count'].number}
                                            author={listItem.properties.Authors.multi_select.map((author: any) => author.name).join(', ')}
                                            notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, '')}`}
                                        />
                                    ))
                                }
                            </>
                        ) : content && (
                            <>
                                {content
                                    .slice(0, displayCount)
                                    .map((listItem: any) => (
                                        <MoviesListCard
                                            key={listItem.id}
                                            id={listItem.id}
                                            title={listItem.properties.Name.title[0].text.content}
                                            poster_path={listItem.properties.Poster.url || listItem.cover.external.url}
                                            release_date={listItem.properties['Release Date'].date.start || ''}
                                            link={`https://www.themoviedb.org/movie/${listItem.id}`}
                                            handleStatusChange={handleInputChange}
                                            statusList={statusList}
                                            status={listItem.properties.Status.status.name}
                                            trailer={listItem.properties.Trailer.url}
                                            overview={listItem.properties['Overview']?.rich_text[0]?.text?.content}
                                            rating={listItem.properties['My Rating'].number}
                                            watch_link={listItem.properties['Watch Link'].url}
                                            notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, '')}`}
                                        />
                                    ))
                                }
                            </>
                        )}
                    </div>
                )}

                {content && displayCount < content.length && (
                    <LoadMore displayCount={displayCount} setDisplayCount={setDisplayCount} media={content}
                        secondaryFunction={() => getNotionDatabasePages(listStates.find((listState) => listState.status === status)?.status, listStates.find((listState) => listState.status === status)?.setList, listStates.find((listState) => listState.status === status)?.cursor, listStates.find((listState) => listState.status === status)?.setCursor)}
                    />
                )}

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
                                        <div className="flex flex-row justify-center items-center p-10">
                                            {listName === 'books' && content && content[currentShuffleItem] ? (
                                                <BookModal
                                                    id={content[currentShuffleItem].id}
                                                    title={content[currentShuffleItem].properties.Title.title[0].text.content}
                                                    coverImage={content[currentShuffleItem].properties["Cover Image"].url}
                                                    published_date={content[currentShuffleItem].properties['Published Date'].date.start || ''}
                                                    description={content[currentShuffleItem].properties["Description"]?.rich_text[0]?.text?.content}
                                                    author={content[currentShuffleItem].properties.Authors.multi_select.map((author: any) => author.name).join(', ')}
                                                    pageCount={content[currentShuffleItem].properties['Page Count'].number}
                                                    notion_link={`https://www.notion.so/${content[currentShuffleItem].id.replace(/-/g, '')}`}
                                                />
                                            ) : content && content[currentShuffleItem] && (
                                                <MovieModal
                                                    id={content[currentShuffleItem].id}
                                                    name={content[currentShuffleItem].properties.Name.title[0].text.content}
                                                    poster={content[currentShuffleItem].properties.Poster.url || content[currentShuffleItem].cover.external.url}
                                                    overview={content[currentShuffleItem].properties['Overview']?.rich_text[0]?.text?.content}
                                                    trailer={content[currentShuffleItem].properties.Trailer.url}
                                                    watchLink={content[currentShuffleItem].properties['Watch Link'].url}
                                                    notionLink={`https://www.notion.so/${content[currentShuffleItem].id.replace(/-/g, '')}`}
                                                    releaseDate={`(${content[currentShuffleItem].properties['Release Date'].date.start.split('-')[0]})`}
                                                />
                                            )}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </div>
        </>
    )
}

export async function getServerSideProps(context: any) {

    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const listName = context.params.list;

    const isValidList = ['movies', 'tvshows', 'books'].includes(listName);

    if (!isValidList) {
        return {
            redirect: {
                destination: '/my-lists',
                permanent: false,
            },
        };
    }

    const encryptionKey = process.env.ENCRYPTION_KEY as string;
    const baseUrl = process.env.BASE_URL as string;

    const fetchUserData = async () => {
        const response = await fetch(`${baseUrl}/api/getUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: session?.user?.email }),
        });
        return await response.json();
    };

    const { moviesPageLink, booksPageLink, notionApiKey } = await fetchUserData();

    if (!notionApiKey) {
        return {
            redirect: {
                destination: '/my-lists',
                permanent: false,
            },
        };
    }

    let pageLink;
    let filter;

    switch (listName) {
        case 'movies':
            pageLink = decryptData(moviesPageLink, encryptionKey);
            filter = { property: 'Type', select: { equals: 'Movie' } };
            break;
        case 'tvshows':
            pageLink = decryptData(moviesPageLink, encryptionKey);
            filter = { property: 'Type', select: { equals: 'TvShow' } };
            break;
        case 'books':
            pageLink = decryptData(booksPageLink, encryptionKey);
            filter = { property: 'Type', select: { equals: 'Book' } };
            break;
        default:
            pageLink = '';
            break;
    }

    let statusList = [] as any;

    if (pageLink) {
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);
        const notion = new Client({ auth: decryptedNotionApiKey });
        const databaseInfo = await notion.databases.retrieve({ database_id: pageLink }) as any;
        statusList = databaseInfo.properties.Status.status.options.map((status: any) => status.name);

    } else {
        statusList = { results: [] };
    }

    return {
        props: {
            statusList,
            listName
        },
    };
};