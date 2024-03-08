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
        handleSubmit,
        connectionType
    }: {
        label: string,
        placeHolder: string,
        field: any,
        link: any,
        setLink: any,
        setInput: any,
        handleSubmit: any
        connectionType?: string
    }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    return (
        <>
            {field ? (
                <div className='pb-4 bg-white'>
                    <label className="block mb-2 text-sm text-gray-400">{label}</label>
                    <div className='flex flex-row justify-between items-center'>
                        <Link
                            href={link}
                            target='_blank'
                            className='hover:text-blue-500 hover:underline w-[95%] truncate text-gray-600 text-sm'
                        >{`https://www.notion.so/` + field}</Link>
                        <button onClick={() => setLink('')} className=" select-none">
                            <Image src="./edit.png" alt="" width={17} height={17} />
                        </button>
                    </div>
                </div>
            ) : (
                <form className='pb-4 bg-white' onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm text-gray-400">{label}</label>
                    <div className='flex flex-row bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 w-full '>
                        <input
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                            className="text-gray-900 text-sm block w-full p-2.5 border-none rounded-md truncate rounded-r-none mr-[1px]"
                            placeholder={placeHolder}
                        />
                        <button className='bg-gray-100 py-2 px-2 rounded-md rounded-l-none hover:bg-gray-200 focus:bg-gray-300'>
                            <h1 className="text-blue-600 text-xs font-semibold hover:underline">
                                Update
                            </h1>
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}