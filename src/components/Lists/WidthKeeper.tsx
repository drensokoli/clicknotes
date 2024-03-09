import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react';
import Image from 'next/dist/client/image';

export default function WidthKeeper() {

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        setTimeout(() => {
            setShow(true);
        }, 200);
    }, []);

    return (
        <>
            <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 h-0'>
                {Array(5).fill(0).map((_, index) => (
                    <div className="sm:w-[200px] px-4 sm:px-0 py-2 sm:py-0 h-0" key={index}>
                        <div className='relative'>
                            <Image
                                src="/skeleton-card.png"
                                width={200}
                                height={300}
                                alt="No image"
                                className="rounded-sm h-0 select-none"
                                loading="lazy"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}