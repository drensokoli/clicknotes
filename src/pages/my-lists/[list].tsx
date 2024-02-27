import SearchBar from "@/components/Helpers/SearchBar";
import { decryptData } from "@/lib/encryption";
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Client } from '@notionhq/client';
import MoviesListCard from "@/components/Helpers/MoviesListCard";
import LoadMore from "@/components/Helpers/LoadMore";
import BooksListCard from "@/components/Helpers/BooksListCard";

export default function List({ ssrList, statusList, listName }: { ssrList: any, statusList: any, listName: string }) {

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [loading, setLoading] = useState(true);

    const [list, setList] = useState<any[]>();
    const [content, setContent] = useState(ssrList.filter((ssrList: any) => ssrList.properties.Status.status.name === statusList[0]));

    const [input, setInput] = useState('');

    const [displayCount, setDisplayCount] = useState(20);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        // const data = getMovies(notionApiKey, databaseId);
    };

    const getNotionDatabasePages = async () => {
        try {
            const response = await fetch('/api/getNotionDatabasePages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, listName }),
            });
            const data = await response.json();

            if (response.status !== 200) {
                console.error(data.error.message);
                return;
            }

            setList(data.list);
            setContent(data.list.filter((list: any) => statusList && list.properties.Status.status.name === statusList[0]));
            setLoading(false);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (userEmail) {
            getNotionDatabasePages();
        }
    }, [session]);

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
                <SearchBar input={input} handleInputChange={handleInputChange} />

                {statusList && (
                    <div className="flex justify-end items-center w-[90%] sm:w-[70%] gap-2 overflow-auto">
                        <div>
                            <select
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => list && setContent(list.filter((item: any) => item.properties.Status.status.name === e.target.value))}                        >
                                {statusList.map((list: any) => (
                                    <option key={list} value={list}>
                                        {list}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-0'>
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
                                        author={listItem.properties.Authors.rich_text[0].text.content}
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
                {loading && (
                    <img src="/fetching.png" alt="loading" width={50} height={50} />
                )}
                {content && displayCount < content.length && (
                    <LoadMore displayCount={displayCount} setDisplayCount={setDisplayCount} media={content} />
                )}
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

    let ssrList = [] as any;
    let statusList = [] as any;

    if (pageLink) {
        const decryptedNotionApiKey = decryptData(notionApiKey, encryptionKey);
        const notion = new Client({ auth: decryptedNotionApiKey });
        const databaseInfo = await notion.databases.retrieve({ database_id: pageLink }) as any;

        const response = await notion.databases.query({
            database_id: pageLink,
            filter: filter,
            page_size: 30,
        });

        ssrList = response.results;
        statusList = databaseInfo.properties.Status.status.options.map((status: any) => status.name);

    } else {
        ssrList = { results: [] };
    }

    return {
        props: {
            ssrList,
            statusList,
            listName
        },
    };
};