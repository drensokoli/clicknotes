import Link from "next/link";

export default function BookModal({ id, title, rating, coverImage, description, author, pageCount, notion_link, googleBooksId, publisher, publishedDate }:
    {
        id: string | number,
        title: string,
        rating: number | null | undefined,
        coverImage: string | null | undefined,
        description: any,
        author: string,
        pageCount: any,
        notion_link: string,
        googleBooksId: string,
        publisher: string,
        publishedDate: string
    }) {

    // FORMAT THE PUBLISHED DATE TO THIS FORMAT 21 May 2021
    const date = new Date(publishedDate);
    const published_date_format = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return (
        <div key={id} className="w-[400px]" >
            <div className='flex justify-center'>
                {googleBooksId ? (
                    <Link
                        href={`https://books.google.com/books?id=${googleBooksId}`}
                        target='_blank'
                        aria-label={title}>
                        <img
                            src={coverImage ? coverImage : '/no-image.png'}
                            alt={title}
                            width={200}
                            height={300}
                            className="rounded-sm max-h-[300px] min-h-[300px] select-none object-cover shadow-xl"
                            loading="lazy"
                        />
                    </Link>
                ) : (
                    <img
                        src="/no-image.png"
                        alt={title}
                        className="rounded-sm min-h-[240px] max-h-[240px] sm:max-h-[300px] sm:min-h-[300px] select-none object-cover"
                        loading="lazy"
                    />
                )}

            </div>

            <h2 className="font-bold text-center text-gray-800 mt-1 px-6"
            >
                {title} { publishedDate ? `(${published_date_format})` : ''}
                {rating && (
                    <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800 mx-2">{rating}</p>
                )}
            </h2>
            <div className="gap-2 flex flex-col">
                {description && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2">Description</p>
                        <p className="text-sm text-gray-900 text-left w-full">{description}</p>
                    </>
                )}
                {author && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2">Author</p>
                        <p className="text-sm text-gray-900 text-left">{author}</p>
                    </>
                )}
                {publisher && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2">Publisher</p>
                        <p className="text-sm text-gray-900 text-left">{publisher}</p>
                    </>
                )}
                {pageCount && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2">Page count</p>
                        <p className="text-sm text-gray-900 text-left">{pageCount}</p>
                    </>
                )}

                <hr className="my-2 border-1 border-gray-400" />
                <div className="flex justify-center items-center">
                    <Link href={notion_link} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline">
                        <img src="/notion-wordmark.png" alt="Notion" className="w-auto h-6" />
                    </Link>
                </div>
            </div>
        </div>
    )
}