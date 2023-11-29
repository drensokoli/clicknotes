import Image from "next/image";
import Link from "next/link";

export default function NotionBanner({
    image,
}: {
    image: string;
}) {

    return (
        <div className='flex flex-row justify-center items-center'>
            <Link
                href="https://affiliate.notion.so/connect-to-notion"
                target='_blank'
                className='w-[90%] sm:w-[70%] h-[100px] rounded-md mb-4 flex flex-row justify-center items-center hover:shadow-xl shadow-lg border-2 hover:border-gray-500'
            >
                <Image src={image} alt="Connect to Notion" width={250} height={250} />
            </Link>
        </div>
    );
}