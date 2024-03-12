import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

export default function RandomButton({ handleShuffle }: { handleShuffle: any }) {

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <Transition
      className="flex justify-center items-center sm:mx-auto mx-4 mb-2 gap-2 overflow-auto select-none"
      show={show}
      enter="transition-all ease-in-out duration-500 delay-[200ms]"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all ease-in-out duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <button
        className="my-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        onClick={() => {
          handleShuffle();
        }}
      >
        <div className="flex flex-row justify-center items-center gap-1">
          <h1>Random</h1>
          <img src="/shuffle-white.png" alt="" className="h-[17px]" />
        </div>
      </button>
    </Transition>
  );
}