import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react';
import Image from 'next/dist/client/image';

export default function ListsSkeleton() {

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 200);
  }, []);

  return (
    <>
      <Transition
        className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 min-h-screen my-4'
        show={show}
        enter="transition-all ease-in-out duration-500 delay-[200ms]"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {Array(15).fill(0).map((_, index) => (
          <div
            className="sm:w-[200px] px-4 sm:px-0 py-2 sm:py-0"
            key={index}
          >
            <div className='relative'>
              <Image
                src="/skeleton-card.png"
                width={200}
                height={300}
                alt="No image"
                className="rounded-sm h-auto select-none"
                loading="lazy"
              />
              <div
                className="movie-card-button select-none backdrop-blur-sm border-2 rounded-lg px-3 sm:px-5 bg-gray-200 py-5 mr-2 mb-2 animate-pulse"
              >
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-3 gap-1">
              <div className="bg-gray-100 rounded-sm h-6 w-[85%]"></div>
              <div className="bg-gray-100 rounded-sm h-6 w-[60%]"></div>
            </div>
          </div >
        ))}
      </Transition>
    </>
  )
}