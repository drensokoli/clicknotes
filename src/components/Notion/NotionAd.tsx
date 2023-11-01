import Image from "next/image";

export default function NotionAd({
    path,
}: {
    path: string;
}) {

    return (
        <a href="https://affiliate.notion.so/8ieljsf8weuq" target="_blank" className="flex justify-center items-center">
            <div className='movie-image flex flex-col justify-center items-center bg-[#f7f6f3] border-2 rounded-md w-[100%] lg:w-[85%] p-8'>
                <Image src={`/${path}-banner-logo.png`} alt="logo"
                    width={20}
                    height={20}
                    className="sm:h-20 h-12 w-auto lg:block"
                />
            </div>
        </a>
    );
}