import Link from "next/link";

export default function BookModal({ id, title, rating, coverImage, published_date, description, author, pageCount, notion_link }:
    {
        id: string | number,
        title: string,
        rating: number | null | undefined,
        coverImage: string | null | undefined,
        published_date: string,
        description: any,
        author: string,
        pageCount: any,
        notion_link: string
    }) {
    return (
        <div key={id} className="w-[400px] py-2 sm:py-0" >
            <div className='flex justify-center'>
                {coverImage ? (
                    <div
                        aria-label={title}>
                        <img
                            src={coverImage}
                            alt={title}
                            className="rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <img
                        src="/no-image.png"
                        alt={title}
                        className="rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                        loading="lazy"
                    />
                )}

            </div>

            <h2 className="font-bold text-center text-gray-800 hover:text-blue-800 hover:underline transition-colors duration-200 mt-1"
            >
                {title} {`(${published_date})`}
                {rating && (
                    <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800 mx-2">{rating}</p>
                )}
            </h2>
            <div className="sm:m-0 mx-6 gap-2 flex flex-col">
                <p className="text-sm text-gray-500 text-left mt-2">Description:</p>
                {description ? (
                    <p className="text-sm text-gray-900 text-left">{description}</p>
                ) : (
                    <p className="text-sm text-gray-400 text-left">No description for this book</p>
                )}
                <p className="text-sm text-gray-500 text-left mt-2">Author:</p>
                {author ? (
                    <p className="text-sm text-gray-900 text-left">{author}</p>
                ) : (
                    <p className="text-sm text-gray-400 text-left">No author for this book</p>
                )}
                <p className="text-sm text-gray-500 text-left mt-2">Page count:</p>
                {pageCount ? (
                    <p className="text-sm text-gray-900 text-left">{pageCount}</p>
                ) : (
                    <p className="text-sm text-gray-400 text-left">No page count for this book</p>
                )}
                <p className="text-sm text-gray-500 text-left mt-2">Notion:</p>
                <Link href={notion_link} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline">{notion_link}</Link>
            </div>
        </div>
    )
}