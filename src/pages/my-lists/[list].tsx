import SearchBar from "@/components/Helpers/SearchBar";
import { getSession, useSession } from "next-auth/react";
import { Fragment, use, useEffect, useRef, useState } from "react";
import MoviesListCard from "@/components/Lists/MoviesListCard";
import LoadMore from "@/components/Helpers/LoadMore";
import BooksListCard from "@/components/Lists/BooksListCard";
import ListSkeleton from "@/components/Lists/ListSkeleton";
import { Dialog, Transition } from "@headlessui/react";
import { Client } from "@notionhq/client";
import MovieModal from "@/components/Lists/MovieModal";
import BookModal from "@/components/Lists/BookModal";
import Head from "next/head";
import WidthKeeper from "@/components/Lists/WidthKeeper";
import NoItems from "@/components/Helpers/NoItems";
import { useRouter } from "next/router";
import BreadCrumb from "@/components/Helpers/BreadCrumb";
import RandomButton from "@/components/Helpers/RandomButton";
import { decryptData } from "@/lib/encryption";
import { set } from "lodash";

export default function List({
  statusList,
  listName,
  notionApiKey,
  databaseId,
  userConnections,
}: {
  statusList: any;
  listName: string;
  notionApiKey: string;
  databaseId: string;
  userConnections: string[];
}) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const router = useRouter();

  const titleMapping = [
    { path: "movies", title: "Movies" },
    { path: "tvshows", title: "TV Shows" },
    { path: "books", title: "Books" },
  ];

  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const cancelButtonRef = useRef(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);

  const [rangeValue, setRangeValue] = useState(0);
  const [review, setReview] = useState("");
  const [reviewedPageId, setReviewedPageId] = useState("");
  const [reviewedPageTitle, setReviewedPageTitle] = useState("");

  const [message, setMessage] = useState("");
  const [listToWatch, setListToWatch] = useState<any[]>();
  const [listWatching, setListWatching] = useState<any[]>();
  const [listWatched, setListWatched] = useState<any[]>();

  const [cursorToWatch, setCursorToWatch] = useState<string | undefined>();
  const [cursorWatching, setCursorWatching] = useState<string | undefined>();
  const [cursorWatched, setCursorWatched] = useState<string | undefined>();

  const [content, setContent] = useState<any[]>();
  const [searchResults, setSearchResults] = useState<any[]>();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateProperties = async () => {

    let rating;
    if (listName === "books") rating = (rangeValue / 20);
    else rating = (rangeValue / 10);

    const response = await fetch("/api/updateNotionPageProperties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        connectionType: listName,
        pageId: reviewedPageId,
        rating,
        review: review,
      }),
    });

    const data = await response.json();
    setOpenReview(false);
    setTimeout(() => {
      setReview("");
      setRangeValue(0);
    }, 500);
    if (response.status !== 200) {
      console.error(data.error.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {

    if (newStatus === "Watched" || newStatus === "Finished") {
      setOpenReview(true);
      setReviewedPageId(id);
      if (listName === "books") setReviewedPageTitle(content?.find((item) => item.id === id).properties.Title?.title[0]?.text?.content);
      else setReviewedPageTitle(content?.find((item) => item.id === id).properties.Name?.title[0]?.text?.content);
    }

    const setCurrentList = listStates.find((listState) => listState.status === status)?.setList as any;
    const setNewList = listStates.find((listState) => listState.status === newStatus)?.setList as any;
    const updatedItem = content?.find((item) => item.id === id);

    setCurrentList((prevList: any[]) => prevList.filter((item) => item.id !== id));
    setNewList((prevList: any[]) => [updatedItem, ...prevList]);

    const response = await fetch("/api/changePageStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        connectionType: listName,
        pageId: id,
        status: newStatus,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      updatedItem.properties.Status.status.name = newStatus;
    } else {
      console.error(data.error.message);
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (event.target.value.length === 0 || event.target.value === "") {
      setSearchResults([]);
      setInput("");
      return;
    }

    clearTimeout(debounceTimeout.current!);

    debounceTimeout.current = setTimeout(() => {
      searchNotionDatabase(event.target.value)
        .then((results) => {
          if (results && results.length > 0) {
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        })
        .catch((error) => console.error(error));
    }, 300);
  };

  const searchNotionDatabase = async (query: string) => {
    try {
      const response = await fetch("/api/searchNotionDatabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          notionApiKey,
          listName
        }),
      });

      const data = await response.json();

      return data;

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const statusPath = router.asPath.split("#")[1]?.replace(/%20/g, " ");
    const urlStatus = statusPath || statusList[0];
    setStatus(urlStatus);
  }, [router.asPath]);

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
    },
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
    }, 70);

    if (cursor === null) {
      setTimeout(() => {
        clearInterval(intervalId);
      }, 2000);
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

  const getNotionDatabasePages = async (
    statusFilter: any,
    setList: any,
    cursor: any,
    setCursor: any
  ) => {
    try {
      if (cursor === null) return;
      setFetching(true);
      const response = await fetch("/api/getNotionDatabasePages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listName,
          cursor,
          statusFilter,
          notionApiKey,
          databaseId: databaseId,
        }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        console.error(data.error.message);
        return;
      }

      setCursor(data.nextCursor);

      setList((prevList: any[]) => {
        const newList = [...(prevList || []), ...data.list];
        return newList.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      listStates.map((listState) =>
        getNotionDatabasePages(
          listState.status,
          listState.setList,
          listState.cursor,
          listState.setCursor
        )
      );
    }
  }, [session, listName]);

  useEffect(() => {
    const listState = listStates.find(
      (listState) => listState.status === status
    );

    if (listToWatch || listWatching || listWatched) {
      setContent(listState?.list || []);
    }

  }, [listToWatch, listWatching, listWatched]);

  useEffect(() => {
    if (content && content.length > 0) {
      setLoading(false);
      setFetching(false);
    }
  }, [content]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 10);
  }, []);

  const [skeletonNumber, setSkeletonNumber] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth <= 600) {
        setSkeletonNumber(2);
      } else if (windowWidth <= 900) {
        if (content && content.length % 3 === 2) {
          setSkeletonNumber(4);
        } else if (content && content.length % 3 === 1) {
          setSkeletonNumber(5);
        } else {
          setSkeletonNumber(3);
        }
      } else if (windowWidth <= 1200) {
        setSkeletonNumber(4);
      } else {
        setSkeletonNumber(5);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function initially to set the state based on the initial window size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [content]);

  useEffect(() => {
    if (input === '') {
      setSearchResults([]);
    }
  }, [input]);

  return (
    <>
      <Head>
        <title>ClickNotes | My Lists | {" "}{titleMapping.find((title) => title.path === listName)?.title}</title>
        <meta name="description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
        <meta name="robots" content="all"></meta>
        <meta property="og:title" content={`ClickNotes | ${titleMapping.find((title) => title.path === listName)?.title} List`} />
        <meta property="og:description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
        <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Dren Sokoli" />
        <meta name="google-adsense-account" content="ca-pub-3464540666338005" ></meta>
        <meta property="og:title" content="ClickNotes - Save your movies to Notion" />
        <meta property="og:description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
        <meta property="og:image" content="https://www.clicknotes.site/og/my-lists.png" />
        <meta property="og:url" content={`https://clicknotes.site/my-lists/${listName}`} />
        <meta property="og:site_name" content="ClickNotes" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SokoliDren" />
        <meta name="twitter:creator" content="@SokoliDren" />
        <meta name="twitter:title" content="ClickNotes - Save your movies to Notion" />
        <meta name="twitter:description" content="View your lists and collections from ClickNotes. Save popular and trending movies, tv shows and books to your Notion list or search for your favourites. All your media in one place, displayed in a beautiful Notion template." />
        <meta name="twitter:image" content="https://www.clicknotes.site/og/my-lists.png" />
        <meta name="twitter:domain" content="www.clicknotes.site" />
        <meta name="twitter:url" content={`https://clicknotes.site/my-lists/${listName}`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://clicknotes.site/my-lists/${listName}`} />
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script> */}
      </Head>

      <div className="flex flex-col items-center min-h-screen bg-white space-y-4">
        <div className="w-fit">
          <BreadCrumb
            userConnections={userConnections}
            listName={listName}
            status={status}
            setStatus={setStatus}
            listStates={listStates}
            setContent={setContent}
            setDisplayCount={setDisplayCount}
            setMessage={setMessage}
            statusList={statusList}
            setLoading={setLoading}
            setListToWatch={setListToWatch}
            setListWatching={setListWatching}
            setListWatched={setListWatched}
            setCursorToWatch={setCursorToWatch}
            setCursorWatching={setCursorWatching}
            setCursorWatched={setCursorWatched}
            setFetching={setFetching}
          />

          <SearchBar
            input={input}
            handleInputChange={handleInputChange}
            placeholder={`Search your ${listName.replace("tvs", "TV s")} list`}
          />

          <WidthKeeper />

          {message && content?.length === 0 ? (
            <NoItems message={message} />
          ) : (
            <>
              {!message && input.length === 0 && (
                <RandomButton handleShuffle={handleShuffle} />
              )}
              <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 mb-4">

                {loading && (
                  <ListSkeleton number={skeletonNumber} />
                )}

                {listName === "books" && content && (
                  <>
                    {searchResults && searchResults.length > 0 ? (
                      <>
                        {searchResults.map((result) => (
                          <BooksListCard
                            key={result.id}
                            id={result.id}
                            title={result.title}
                            cover={result.cover}
                            link={result.link}
                            handleStatusChange={handleStatusChange}
                            status={result.status}
                            rating={result.rating}
                            description={result.description}
                            review={result.review}
                            pageCount={result.pageCount}
                            author={result.author}
                            notion_link={result.notion_link}
                            googleBooksId={result.googleBooksId}
                            publisher={result.publisher}
                            publishedDate={result.publishedDate}
                            statusList={statusList}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        {content.slice(0, displayCount).map((listItem) => (
                          <BooksListCard
                            key={listItem.id}
                            id={listItem.id}
                            title={listItem.properties.Title?.title[0]?.text?.content}
                            cover={listItem.properties["Cover Image"]?.url || listItem.cover?.external?.url}
                            link={`https://books.google.com/books?id=${listItem.id}`}
                            handleStatusChange={handleStatusChange}
                            statusList={statusList}
                            status={listItem.properties.Status?.status?.name}
                            rating={listItem.properties["My Rating"]?.number}
                            description={listItem.properties["Description"]?.rich_text[0]?.text?.content}
                            review={listItem.properties.Review?.rich_text[0]?.text?.content}
                            pageCount={listItem.properties["Page Count"]?.number}
                            author={listItem.properties.Authors?.multi_select?.map((author: any) => author?.name).join(", ")}
                            notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, "")}`}
                            googleBooksId={listItem.properties["ID"]?.rich_text[0]?.text?.content}
                            publisher={listItem.properties.Publisher?.select?.name}
                            publishedDate={listItem.properties["Published Date"]?.date?.start}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}

                {listName !== "books" && content && (
                  <>
                    {searchResults && searchResults.length > 0 && input.length > 0 ? (
                      <>
                        {searchResults
                          .filter((result) => result.type === (listName === "movies" ? "Movie" : "TvShow"))
                          .map((result) => (
                            <MoviesListCard
                              key={result.id}
                              id={result.id}
                              title={result.title}
                              poster_path={result.poster}
                              release_date={result.releaseDate}
                              link={result.notionLink}
                              handleStatusChange={handleStatusChange}
                              statusList={statusList}
                              status={result.status}
                              trailer={result.trailer}
                              overview={result.overview}
                              review={result.review}
                              rating={result.myRating}
                              watch_link={result.watchLink}
                              notion_link={result.notionLink}
                              rated={result.rated}
                              awards={result.awards}
                              runtime={result.runtime}
                              imdbLink={result.imdbLink}
                            />
                          ))}
                      </>
                    ) : (
                      <>
                        {content.slice(0, displayCount).map((listItem) => (
                          <MoviesListCard
                            key={listItem.id}
                            id={listItem.id}
                            title={listItem.properties.Name?.title[0]?.text?.content}
                            poster_path={listItem.properties.Poster?.url || listItem.cover?.external?.url}
                            release_date={listItem.properties["Release Date"]?.date?.start || ""}
                            link={`https://www.themoviedb.org/movie/${listItem.id}`}
                            handleStatusChange={handleStatusChange}
                            statusList={statusList}
                            status={listItem.properties.Status.status.name}
                            trailer={listItem.properties.Trailer.url}
                            overview={listItem.properties["Overview"]?.rich_text[0]?.text?.content}
                            review={listItem.properties.Review?.rich_text[0]?.text?.content}
                            rating={listItem.properties["My Rating"].number}
                            watch_link={listItem.properties["Watch Link"].url}
                            notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, "")}`}
                            rated={listItem.properties.Rated?.select?.name}
                            awards={listItem.properties.Awards?.rich_text[0]?.text?.content}
                            runtime={listItem.properties.Runtime?.rich_text[0]?.text?.content}
                            imdbLink={listItem.properties["iMDB Link"]?.url}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}

                {fetching && <ListSkeleton number={skeletonNumber} />}

              </div>
            </>
          )}
        </div>
      </div>

      {((content && displayCount <= content.length) || listStates.find((listState) => listState.status === status)?.cursor !== null) && !fetching && searchResults && searchResults.length === 0 && (
        <LoadMore
          displayCount={displayCount}
          setDisplayCount={setDisplayCount}
          media={content || []}
          secondaryFunction={() =>
            getNotionDatabasePages(
              listStates.find((listState) => listState.status === status)?.status,
              listStates.find((listState) => listState.status === status)?.setList,
              listStates.find((listState) => listState.status === status)?.cursor,
              listStates.find((listState) => listState.status === status)?.setCursor
            )
          }
        />
      )}

      <Transition.Root show={openReview} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenReview}
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
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                  <button
                    onClick={() => setOpenReview(false)}
                    ref={cancelButtonRef}
                    type="button"
                    className="absolute top-2 right-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex flex-col justify-center items-center p-4 w-full mt-2">
                    {reviewedPageTitle && <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{reviewedPageTitle}</h1>}
                    <div className="w-full">
                      <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                      <input id="default-range" type="range" value={rangeValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        onChange={(e) => setRangeValue(parseInt(e.target.value))}
                      />
                      <div className="flex justify-center items-center py-2">
                        <h1 className="bg-blue-100 text-blue-800 font-semibold p-2 rounded dark:bg-blue-200 dark:text-blue-800">{
                          listName === "books" ? (rangeValue / 20).toFixed(1) : (rangeValue / 10).toFixed(1)
                        }</h1>
                      </div>
                    </div>
                    <div className="w-full">
                      <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Write a review</label>
                      <textarea id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."
                        onChange={(e) => setReview(e.target.value)}
                      ></textarea>
                    </div>
                    <button type="button" className="my-4 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                      onClick={() => updateProperties()}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex flex-row justify-center items-center p-10">
                    {listName === "books" &&
                      content &&
                      content[currentShuffleItem] ? (
                      <BookModal
                        id={content[currentShuffleItem].id}
                        title={content[currentShuffleItem].properties.Title?.title[0]?.text.content}
                        rating={content[currentShuffleItem].properties["My Rating"]?.number}
                        coverImage={content[currentShuffleItem].properties["Cover Image"]?.url || content[currentShuffleItem].cover?.external?.url}
                        description={content[currentShuffleItem].properties["Description"]?.rich_text[0]?.text?.content}
                        review={content[currentShuffleItem].properties.Review?.rich_text[0]?.text?.content}
                        author={content[currentShuffleItem].properties.Authors?.multi_select?.map((author: any) => author?.name).join(", ")}
                        pageCount={content[currentShuffleItem].properties["Page Count"]?.number}
                        notion_link={`https://www.notion.so/${content[currentShuffleItem].id.replace(/-/g, "")}`}
                        googleBooksId={content[currentShuffleItem].properties["ID"]?.rich_text[0]?.text?.content}
                        publisher={content[currentShuffleItem].properties.Publisher?.select?.name}
                        publishedDate={content[currentShuffleItem].properties["Published Date"]?.date?.start}
                      />
                    ) : (
                      content &&
                      content[currentShuffleItem] && (
                        <MovieModal
                          id={content[currentShuffleItem].id}
                          name={content[currentShuffleItem].properties.Name?.title[0]?.text?.content}
                          rating={content[currentShuffleItem].properties["My Rating"]?.number}
                          poster={content[currentShuffleItem].properties.Poster?.url || content[currentShuffleItem].cover?.external?.url}
                          overview={content[currentShuffleItem].properties["Overview"]?.rich_text[0]?.text?.content}
                          review={content[currentShuffleItem].properties.Review?.rich_text[0]?.text?.content}
                          trailer={content[currentShuffleItem].properties.Trailer?.url}
                          watchLink={content[currentShuffleItem].properties["Watch Link"]?.url}
                          notionLink={`https://www.notion.so/${content[currentShuffleItem].id.replace(/-/g, "")}`}
                          releaseDate={content[currentShuffleItem].properties["Release Date"]?.date?.start.split("-")[0]}
                          rated={content[currentShuffleItem].properties.Rated?.select?.name}
                          awards={content[currentShuffleItem].properties.Awards?.rich_text[0]?.text?.content}
                          runtime={content[currentShuffleItem].properties.Runtime?.rich_text[0]?.text?.content}
                          imdbLink={content[currentShuffleItem].properties["iMDB Link"]?.url}
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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const encryptionKey = process.env.ENCRYPTION_KEY as string;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const listName = context.params.list;
  let connectionType = "";

  if (listName === "tvshows") connectionType = "movies";
  else connectionType = listName;

  const isValidList = ["movies", "tvshows", "books"].includes(listName);

  if (!isValidList) {
    return {
      redirect: {
        destination: "/my-lists",
        permanent: false,
      },
    };
  }

  const baseUrl = process.env.BASE_URL as string;

  const getUserConnections = async () => {
    const response = await fetch(`${baseUrl}/api/getUserConnections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail }),
    });

    const data = await response.json();
    const userConnections = data.map(
      (connection: any) => connection.connection_type
    );

    let connectionTypes: any[] = [];

    userConnections.forEach((connection: string) => {
      if (connection === "movies") {
        connectionTypes.push("Movies");
        connectionTypes.push("TV shows");
      } else if (connection === "books") {
        connectionTypes.push("Books");
      }
    });

    return connectionTypes;
  };

  const userConnections = await getUserConnections();

  const fetchUserData = async () => {
    const response = await fetch(`${baseUrl}/api/getUserConnection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        connectionType,
      }),
    });

    const data = await response.json();
    const notionApiKey = data.access_token;
    const databaseId = data.template_id;

    return { notionApiKey, databaseId };
  };

  const { notionApiKey, databaseId } = await fetchUserData();

  const decryptedApiKey = decryptData(notionApiKey, encryptionKey);

  if (!notionApiKey) {
    return {
      redirect: {
        destination: "/my-lists",
        permanent: false,
      },
    };
  }

  let statusList = [] as any;

  if (databaseId) {
    const notion = new Client({ auth: decryptedApiKey });
    const databaseInfo = (await notion.databases.retrieve({
      database_id: databaseId,
    })) as any;
    statusList = databaseInfo.properties.Status.status.options.map(
      (status: any) => status.name
    );
  } else {
    statusList = { results: [] };
  }

  return {
    props: {
      statusList,
      listName,
      notionApiKey,
      databaseId,
      userConnections,
    },
  };
}
