import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function NoItems({message}: {message: string}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <Transition
      show={show}
      enter="transition-all ease-in-out duration-500 delay-[200ms]"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all ease-in-out duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="flex justify-center my-10"
    >
      <h1 className="text-lg font-semibold text-gray-600">{message}</h1>
    </Transition>
  );
}
