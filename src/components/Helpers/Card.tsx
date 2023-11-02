
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/dist/client/image';
import Link from 'next/link';

export default function Card({ id, title, poster_path, release_date, link, handleAddToNotion }: {
    id: number | string;
    title: string;
    poster_path: string | null | undefined;
    release_date: string;
    link: string;
    handleAddToNotion: () => void;
}) {

    const { data: session } = useSession();

    return (
        <div key={id} className="movie-card">
            <div className="movie-card-image-container">
                <div className='movie-image'>
                    {poster_path ? (
                        <Image
                            src={poster_path}
                            width={200}
                            height={300}
                            alt={title}
                            className="rounded-sm h-auto"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-[200px] h-[300px]"></div>
                    )}
                    <button type="button"
                        className="movie-card-button text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                        style={{ backdropFilter: 'blur(10px)' }}
                        onClick={() => { session ? handleAddToNotion() : signIn('google') }}
                    >
                        Add to Notion
                    </button>
                </div>

                <Link href={link} passHref target='_blank' aria-label={`${title} web link`}>
                    <h2 className="text-l font-bold text-center text-gray-800 hover:text-blue-800 hover:underline transition-colors duration-200">
                        <span>{title} {release_date ? ` (${release_date.split('-')[0]})` : ''}</span>
                    </h2>
                </Link>
            </div>
        </div>
    )
}