import React, { useRef, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react'
import Link from 'next/link';

export default function SearchBar({ input, handleInputChange, setInput }:
  {
    input: string;
    handleInputChange: any;
    setInput: any;
  }) {

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyPress(event: { key: string; preventDefault: () => void; }) {
      if (event.key === '/') {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <>
      <Transition
        className="mx-4 mb-4 sm:mx-auto rounded-md shadow-xl "
        show={show}
        enter="transition-all ease-in-out duration-500 delay-[200ms]"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <form
          onChange={(event) => setInput((event.target as HTMLInputElement).value)}
          onSubmit={(e) => {
            e.preventDefault();
            handleInputChange();
          }}
        >
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute top-3.5 left-4" fill="currentColor" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <input
              type="text"
              placeholder="Enter title"
              value={input}
              // onChange={setInput(event?.target.value)}
              className="bg-white h-12 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer border-2 border-blue-500 select-none"
              ref={inputRef}
            />
            {input.length > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInputChange();
                }}
               className='absolute top-3.5 right-4 text-blue-600 dark:text-blue-500 cursor-pointer'>
                <svg className="w-5 h-5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </Transition>

    </>
  );

};