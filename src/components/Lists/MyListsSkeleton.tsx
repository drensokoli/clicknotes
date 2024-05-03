import { Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react';

export default function MyListsSkeleton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-4 sm:px-20 px-4">
      {Array(3).fill(0).map((_, index) => (
        <Transition
          className="bg-gray-100 h-fit w-full rounded-lg shadow-lg"
          show={show}
          key={index}
          enter="transition-all ease-in-out duration-500 delay-[200ms]"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >

          <div className="flex flex-row justify-center h-56 mx-4 mt-6 overflow-hidden text-white bg-clip-border rounded-xl bg-gray-300 animate-pulse"></div>
          <div className="my-4 mx-4 h-8 w-[40%] bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="mx-4 h-4 w-[60%] bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="flex flex-col my-6 mx-4 gap-2">
            <div className="flex flex-row gap-2">
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-300"></div>
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-300"></div>
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-300"></div>
            </div>
            <div className="flex flex-col justify-end items-center">
              <div className="mt-2 h-10 w-28 rounded-md bg-gray-300 animate-pulse"></div>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  )
}