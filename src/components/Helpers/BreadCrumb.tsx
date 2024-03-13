import { useEffect, useState } from "react";
import { initDropdowns } from 'flowbite';
import { BsList } from "react-icons/bs";
import Link from "next/link";

export default function BreadCrumb({
  userConnections,
  listName,
  status,
  setStatus,
  listStates,
  setContent,
  setDisplayCount,
  setMessage,
  statusList,
}: {
  userConnections: string[];
  listName: string;
  status: string;
  setStatus: any;
  listStates: any[];
  setContent: any;
  setDisplayCount: any;
  setMessage: any;
  statusList: string[];
}) {

  const url = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    // Initialize the dropdown functionality
    initDropdowns();
  }, []);

  return (
    <nav className="w-full mb-2 sm:pl-0 pl-5" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/my-lists"
            className="inline-flex items-center text-sm text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-3"
          >
            <BsList />
            <h1 className="pl-1">
              My Lists
            </h1>
          </Link>
        </li>
        <h1 className="text-gray-400">/</h1>
        <li aria-current="page">
          <div className="flex items-center">
            <button
              id="dropdownDatabase"
              data-dropdown-toggle="dropdown-database"
              className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-700 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700"
            >
              {listName.charAt(0).toUpperCase() + listName.slice(1).replace("vs", "v s")}
              <svg
                className="w-3 h-2.5 ms-2.5 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdown-database"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefault"
              >
                {userConnections.map((connection: any) => (
                  <li key={connection} value={connection}>
                    <a
                      href={`${url}/my-lists/${connection
                        .toLowerCase()
                        .replace(" ", "")}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {connection}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
        <h1 className="text-gray-400">/</h1>
        <li aria-current="page">
          <div className="flex items-center">
            <button
              id="dropdownStatus"
              data-dropdown-toggle="dropdown-status"
              className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-700 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700"
            >
              {status}
              <svg
                className="w-3 h-2.5 ms-2.5 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdown-status"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownStatus"
              >
                {statusList.map((list: any) => (
                  <li
                    key={list}
                    value={list}
                    onClick={(e) => {
                      setMessage("");
                      setStatus(list);
                      const updatedContent = listStates.find(
                        (listState) => listState.status === list
                      )?.list;
                      if (updatedContent && updatedContent.length > 0) {
                        setContent(updatedContent);
                        setDisplayCount(20);
                      } else {
                        setContent([]);
                        setMessage("No items found");
                      }
                    }}
                  >
                    <Link
                      href={`#${list}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {list}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      </ol>
    </nav>
  );
}
