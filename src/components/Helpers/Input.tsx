import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Input(
    {
        label,
        placeHolder,
        field,
        link,
        setLink,
        setInput,
        handleSubmit
    }: {
        label: string,
        placeHolder: string,
        field: string,
        link: string,
        setLink: any,
        setInput: any,
        handleSubmit: any
    }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    return (
        <>
            {field ? (
                <div className='pb-4 mb-4 px-6 border-b-2 border-gray'>
                    <label className="block mb-2 text-sm text-gray-500">{label}</label>
                    <div className='flex flex-row justify-between items-center'>
                        {field.startsWith('secret_') ? (
                            <Link
                                href={link}
                                target='_blank'
                                className='hover:text-blue-500 hover:underline w-[75%] line-clamp-3 text-gray-600'
                            >{field}</Link>
                        ) : (
                            <Link
                                href={link}
                                target='_blank'
                                className='hover:text-blue-500 hover:underline w-[75%] line-clamp-3 text-gray-600'
                            >{`https://www.notion.so/` + field}</Link>
                        )}
                        <button onClick={() => setLink('')}>
                            <Image src="./edit.png" alt="" width={17} height={17} />
                        </button>
                    </div>
                </div>
            ) : (
                <form className='mb-4 border-b-2 border-gray pb-4 px-6' onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm text-gray-500">{label}</label>
                    <div className='flex flex-row bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 w-full '>
                        <input
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                            className="text-gray-900 text-sm block w-full p-2.5 border-none rounded-l-md"
                            placeholder={placeHolder}
                        />
                        <button type="submit" className='py-2 px-2'>
                            <Image src="./send.png" alt="" width={25} height={25} />
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}