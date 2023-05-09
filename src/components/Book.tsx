import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/dist/client/image';

interface BookProps {
    id: string;
    title: string;
    cover_image?: string;
    previewLink: string;
    onClick: () => void;
}

const Book: React.FC<BookProps> = ({ id, title, cover_image, previewLink, onClick }) => {
    const { data: session } = useSession();

    const handleClick = () => {
        window.open(previewLink, '_blank');
    };

    return (
        <div key={id} className="movie-card" >
            <div className="movie-card-image-container">
                {cover_image ? (
                    <div className='movie-image'>

                        <Image
                            src={cover_image}
                            height={300}
                            width={200}
                            alt={title}
                            className="h-[300px] rounded-sm"
                        />

                        {!session ? (
                            <button
                                type="button"
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                onClick={() => signIn()}
                            >
                                Add to Notion
                            </button>

                        ) : (
                            <button type="button"
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                                Add to Notion
                            </button>
                        )
                        }
                        <Image src="/share.png" className="arrows" alt=""
                           onClick={handleClick} width={30} height={30} />
                    </div>
                ) : (
                    <div className='movie-image'>
                        <div className="bg-transparent backdrop-blur-sm"
                            style={{
                                width: '200px',
                                height: '300px',
                                borderRadius: '5px'
                            }}
                        ></div>

                        {!session ? (

                            <button type="button"
                                className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                onClick={() => signIn()}
                            >
                                Add to Notion
                            </button>
                        )
                            : (
                                <button type="button"
                                    className="movie-card-button text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                                    Add to Notion
                                </button>
                            )
                        }
                        <Image src="/share-black.png" className="arrows" alt="" width={30} height={30}
                            onClick={handleClick} />
                    </div>
                )}
            </div>
            <h2 className="text-l font-bold text-center text-gray-800">
                <span>
                    {title}
                </span>
            </h2>
        </div>
    );

};

export default Book;
