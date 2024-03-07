import Link from "next/link";
import { Transition } from '@headlessui/react'
import { useEffect, useState } from "react";

export default function MyListsCard({ name, id, list, path, databaseName }:
    {
        name: any,
        id: any,
        list: any,
        path: any,
        databaseName: any
    }) {

    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 10);
    }, []);

    return (
        <>
            <Transition
                className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl hover:shadow-xl"
                show={show}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >

                <Link href={path}
                    className="flex flex-row justify-center h-56 mx-4 mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40 shadow-xl">
                    {list.map((list: any, index: any) => (
                        <img key={index} src={list.properties.Poster ? list.properties.Poster.url : list.properties["Cover Image"] ? list.properties["Cover Image"].url : list.cover.external.url} alt=""
                            className="object-cover lg:w-full"
                        />
                    ))}
                </Link>
                <div className="p-6 pb-2">
                    <Link href={path} className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        {name}
                    </Link>
                    <p className="block font-sans text-sm antialiased leading-relaxed text-inherit pb-3">
                        From: <span><Link href={`https://www.notion.so/${id.replace(/-/g, '')}`} target='_blank'>{databaseName}</Link></span>
                    </p>
                    {
                        list.map((list: any, index: any) => (
                            <Link href={`https://www.notion.so/${list.id.replace(/-/g, '')}`} target='_blank' key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 mr-2 mb-2">
                                {list.icon.emoji} {list.properties.Name ? list.properties.Name.title[0].plain_text : list.properties.Title.title[0].plain_text}
                            </Link>
                        ))
                    }
                </div>
                <div className="flex flex-grow"></div>
                <div className="flex flex-col justify-end items-center">
                    <Link href={path}
                        className="mb-4 select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-md bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button">
                        View List
                    </Link>
                </div>
            </Transition>
        </>
    )
}