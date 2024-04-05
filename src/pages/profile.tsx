import React, { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import Image from 'next/dist/client/image';
import 'flowbite';
import { extractValueFromUrl } from '../lib/profileHelpers';
import Head from 'next/head';
import Link from 'next/link';
import Toast from '@/components/Helpers/Toast';
import Input from '@/components/Helpers/Input';
import { Transition } from '@headlessui/react'
import { decryptData } from '@/lib/encryption';
import NotionBanner from '@/components/Notion/NotionBanner';
import MyListsCard from '@/components/Lists/MyListsCard';
import MyListsSkeleton from '@/components/Lists/MyListsSkeleton';

export default function Connect({ encryptionKey }: { encryptionKey: string }) {
	const { data: session } = useSession();
	const userEmail = session?.user?.email;

	const [apiResponse, setApiResponse] = useState<string | null>(null);
	const [input, setInput] = useState<string>('');

	const moviesNotionAuthUrl = process.env.NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL as string;
	const booksNotionAuthUrl = process.env.NEXT_PUBLIC_BOOKS_AUTHORIZATION_URL as string;

	const [moviesApiKey, setMoviesApiKey] = useState<string | null>(null);
	const [moviesDatabaseId, setMoviesDatabaseId] = useState<string | null>(null);

	const [booksApiKey, setBooksApiKey] = useState<string | null>(null);
	const [booksDatabaseId, setBooksDatabaseId] = useState<string | null>(null);


	const notionBanners = [
		{ image: "/connectmovies.png" },
		{ image: "/connecttvshows.png" },
		{ image: "/connectbooks.png" },
	];

	const [loading, setLoading] = useState(true);

	const [movies, setMovies] = useState<any[]>();
	const [tvShows, setTvShows] = useState<any[]>();
	const [books, setBooks] = useState<any[]>();

	const [movieDatabaseName, setMovieDatabaseName] = useState("");
	const [bookDatabaseName, setBookDatabaseName] = useState("");

	const connectionMapping = [
		{
			listType: "movies",
			list: movies,
			setList: setMovies,
			listName: movieDatabaseName,
			setListName: setMovieDatabaseName,
		},
		{
			listType: "tvshows",
			list: tvShows,
			setList: setTvShows,
			listName: movieDatabaseName,
			setListName: setMovieDatabaseName,
		},
		{
			listType: "books",
			list: books,
			setList: setBooks,
			listName: bookDatabaseName,
			setListName: setBookDatabaseName,
		},
	];

	const fetchLists = async () => {
		try {
			const fetchPromises = connectionMapping.map(async (connection) => {
				const response = await fetch("/api/getNotionDatabases", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userEmail,
						listType: connection.listType,
					}),
				});

				const connectionData = await response.json();

				connection.setList(connectionData.list);
				connection.setListName(connectionData.databaseName);
			});

			await Promise.all(fetchPromises);

			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch lists:", error);
		}
	};

	useEffect(() => {
		if (userEmail) {
			fetchLists();
		}
	}, [session]);

	const [show, setShow] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShow(true);
		}, 200);
	}, []);
	return (
		<>
			<Head>
				<title>ClickNotes | Connect</title>
				<meta name="robots" content="noindex,nofollow"></meta>
				<meta property="og:title" content="ClickNotes | Connect" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="author" content="Dren Sokoli" />
				<link rel="icon" href="/favicon.ico" />
				<meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
				{/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
					crossOrigin="anonymous"></script> */}
			</Head>
			<Toast apiResponse={apiResponse} setApiResponse={setApiResponse} pageLink={undefined} />
			<div className='min-h-screen'>

				<div className="flex justify-center items-center flex-grow">
					<Transition
						className="bg-white mx-auto"
						show={show}
						enter="transition-all ease-in-out duration-500 delay-[200ms]"
						enterFrom="opacity-0 translate-y-6"
						enterTo="opacity-100 translate-y-0"
						leave="transition-all ease-in-out duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="flex justify-center">
							<Image src={session?.user?.image?.toString()!} alt="" className="rounded-full mx-auto w-32 h-32 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 select-none" width={50} height={50} />
						</div>
						<h1 className="font-bold text-center text-3xl text-gray-700 mt-2">{session?.user?.name}</h1>
						{loading ? (
							<MyListsSkeleton />
						) : (
							<>
								{!movies && !tvShows && !books ? (
									<div className="flex flex-col gap-2 px-2">
										<h1 className="text-center text-gray-500 text-2xl my-10">
											You have no lists.
										</h1>
										<NotionBanner
											image={
												notionBanners[
													Math.floor(Math.random() * notionBanners.length)
												].image
											}
											link="/connect"
											session={true}
										/>
									</div>
								) : (
									<div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-4 sm:px-20 px-4">
										{movies && movies.length > 0 && (
											<MyListsCard
												name="Movies"
												id={movies[0].parent.database_id}
												list={movies}
												path="/my-lists/movies"
												databaseName={movieDatabaseName}
											/>
										)}
										{tvShows && tvShows.length > 0 && (
											<MyListsCard
												name="TV Shows"
												id={tvShows[0].parent.database_id}
												list={tvShows}
												path="/my-lists/tvshows"
												databaseName={movieDatabaseName}
											/>
										)}
										{books && books.length > 0 && (
											<MyListsCard
												name="Books"
												id={books[0].parent.database_id}
												list={books}
												path="/my-lists/books"
												databaseName={bookDatabaseName}
											/>
										)}
									</div>
								)}
							</>
						)}
					</Transition>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps = async (context: any) => {
    // const session = await getSession(context);
    // const encryptionKey = process.env.ENCRYPTION_KEY;

    // if (!session) {
    //     return {
    //         redirect: {
    //             destination: '/',
    //         },
    //     };
    // }

    return {
        redirect: {
            destination: '/',
        },
    };
};