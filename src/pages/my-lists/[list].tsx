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
import { set } from "lodash";
import NoItems from "@/components/Helpers/NoItems";
import { stat } from "fs";
import { useRouter } from "next/router";
import BreadCrumb from "@/components/Helpers/BreadCrumb";
import RandomButton from "@/components/Helpers/RandomButton";

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
  const cancelButtonRef = useRef(null);

  const [input, setInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    // const data = getMovies(notionApiKey, databaseId);
  };

  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);

  const [message, setMessage] = useState("");
  const [listToWatch, setListToWatch] = useState<any[]>();
  const [listWatching, setListWatching] = useState<any[]>();
  const [listWatched, setListWatched] = useState<any[]>();

  const [cursorToWatch, setCursorToWatch] = useState<string | undefined>();
  const [cursorWatching, setCursorWatching] = useState<string | undefined>();
  const [cursorWatched, setCursorWatched] = useState<string | undefined>();

  const [content, setContent] = useState<any[]>();

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
    const statusFilter = listStates.find(
      (listState) => listState.status === status
    )?.status;
    const setList = listStates.find((listState) => listState.status === status)
      ?.setList as any;
    let cursor = listStates.find((listState) => listState.status === status)
      ?.cursor as any;
    const setCursor = listStates.find(
      (listState) => listState.status === status
    )?.setCursor;

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
      setLoading(true);
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
    }
  }, [content]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 10);
  }, []);

  useEffect(() => {
    console.log("content is: ", content);
  }, [status, content]);

  return (
    <>
      <Head>
        <title>ClickNotes |{" "}{titleMapping.find((title) => title.path === listName)?.title} List</title>
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
          />

          <SearchBar
            input={input}
            handleInputChange={handleInputChange}
            setInput={setInput}
          />

          <WidthKeeper />

          {message && content?.length === 0 ? (
            <NoItems message={message} />
          ) : (
            <>
              {!message && (
                <RandomButton handleShuffle={handleShuffle} />
              )}
              <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4">
                {listName === "books" && content ? (
                  <>
                    {content.slice(0, displayCount).map((listItem: any) => (
                      <BooksListCard
                        key={listItem.id}
                        id={listItem.id}
                        title={listItem.properties.Title.title[0].text.content}
                        cover={listItem.properties["Cover Image"].url}
                        published_date={
                          listItem.properties["Published Date"].date.start || ""
                        }
                        link={`https://books.google.com/books?id=${listItem.id}`}
                        handleStatusChange={handleInputChange}
                        statusList={statusList}
                        status={listItem.properties.Status.status.name}
                        rating={listItem.properties["My Rating"].number}
                        description={listItem.properties["Description"]?.rich_text[0]?.text?.content}
                        pageCount={listItem.properties["Page Count"].number}
                        author={listItem.properties.Authors.multi_select.map((author: any) => author.name).join(", ")}
                        notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, "")}`}
                      />
                    ))}
                  </>
                ) : (
                  content && (
                    <>
                      {content.slice(0, displayCount).map((listItem: any) => (
                        <MoviesListCard
                          key={listItem.id}
                          id={listItem.id}
                          title={listItem.properties.Name.title[0].text.content}
                          poster_path={listItem.properties.Poster.url || listItem.cover.external.url}
                          release_date={listItem.properties["Release Date"].date.start || ""}
                          link={`https://www.themoviedb.org/movie/${listItem.id}`}
                          handleStatusChange={handleInputChange}
                          statusList={statusList}
                          status={listItem.properties.Status.status.name}
                          trailer={listItem.properties.Trailer.url}
                          overview={listItem.properties["Overview"]?.rich_text[0]?.text?.content}
                          rating={listItem.properties["My Rating"].number}
                          watch_link={listItem.properties["Watch Link"].url}
                          notion_link={`https://www.notion.so/${listItem.id.replace(/-/g, "")}`}
                          rated={listItem.properties.Rated?.select?.name}
                          awards={listItem.properties.Awards?.rich_text[0]?.text?.content}
                          runtime={listItem.properties.Runtime?.rich_text[0]?.text?.content}
                        />
                      ))}
                    </>
                  )
                )}
              </div>
            </>
          )}
          {loading && <ListSkeleton />}
        </div>
      </div>

      {content && displayCount <= content.length && (
        <div className="mt-4">
          <LoadMore
            displayCount={displayCount}
            setDisplayCount={setDisplayCount}
            media={content}
            secondaryFunction={() =>
              getNotionDatabasePages(
                listStates.find((listState) => listState.status === status)?.status,
                listStates.find((listState) => listState.status === status)?.setList,
                listStates.find((listState) => listState.status === status)?.cursor,
                listStates.find((listState) => listState.status === status)?.setCursor
              )
            }
          />
        </div>
      )}

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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;

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
    const notion = new Client({ auth: notionApiKey });
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
