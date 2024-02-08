
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/dist/client/image';
import Link from 'next/link';

export default function Card({ id, title, poster_path, release_date, link, handleAddToNotion }: {
    id: number | string;
    title: string;
    poster_path: string | null | undefined;
    release_date: string;
    link: string;
    handleAddToNotion: any;
}) {

    const { data: session } = useSession();

    return (
        <div key={id} className="movie-card sm:w-[200px]" >
            <div className="movie-card-image-container">
                <div className='movie-image'>
                    {poster_path ? (
                        <Link href={link} passHref target='_blank' aria-label={`${title} ${release_date}`}>
                            <Image
                                src={poster_path}
                                width={200}
                                height={300}
                                alt={title}
                                className="rounded-sm max-h-[240px] min-h-[160px] sm:max-h-[300px] sm:min-h-[300px]h-auto select-none"
                                loading="lazy"
                            />
                        </Link>
                    ) : (
                        <Image
                            src="/no-image.png"
                            width={200}
                            height={300}
                            alt={title}
                            className="rounded-sm h-auto select-none"
                            loading="lazy"
                        />
                    )}
                    <button type="button"
                        className="movie-card-button select-none text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                        style={{ backdropFilter: 'blur(10px)' }}
                        onClick={() => { session ? handleAddToNotion() : window.open('/help', '_blank') }}
                    >
                        Add to Notion
                    </button>
                </div>

                <Link href={link} passHref target='_blank' aria-label={`${title} ${release_date}`}>
                    <h2 className="font-bold text-center text-gray-800 hover:text-blue-800 hover:underline transition-colors duration-200 mt-1">
                        <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
                    </h2>
                </Link>
            </div>
        </div>
    )
}