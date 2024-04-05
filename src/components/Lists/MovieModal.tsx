import Link from "next/link";

export default function MovieModal({ id, name, rating, poster, overview, review, trailer, watchLink, notionLink, releaseDate, rated, awards, runtime, imdbLink }:
    {
        id: string | number,
        name: string,
        rating: number | null | undefined,
        poster: string | null | undefined,
        overview: string,
        review: string,
        trailer: string,
        watchLink: string,
        notionLink: string,
        releaseDate: string,
        rated: any,
        awards: string,
        runtime: string
        imdbLink: any
    }) {
    return (
        <div key={id} className="w-[400px]" >
            <div className='flex justify-center'>
                {imdbLink ? (
                    <Link
                        href={imdbLink}
                        target='_blank'
                        aria-label={name}>
                        <img
                            src={poster ? poster : '/no-image.png'}
                            alt={name}
                            width={200}
                            height={300}
                            className="rounded-sm max-h-[300px] min-h-[300px] select-none object-cover shadow-2xl"
                            loading="lazy"
                        />
                    </Link>
                ) : (
                    <img
                        src="/no-image.png"
                        alt={name}
                        className="rounded-sm min-h-[240px] max-h-[240px] sm:max-h-[300px] sm:min-h-[300px] select-none object-cover"
                        loading="lazy"
                    />
                )}

            </div>

            <h2 className="font-bold text-center text-gray-800 mt-1 px-6"
            >
                {name} {releaseDate ? `(${releaseDate})` : ''}
                {rating && (
                    <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800 mx-2">{rating}</p>
                )}
            </h2>
            <div className="flex flex-row justify-center items-center mt-4">
                {watchLink && (
                    <Link href={watchLink} target='_blank' className="w-full text-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Watch</Link>
                )}
            </div>
            <div className=" gap-2 flex flex-col">
                {overview && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2 w-full">Overview</p>
                        <p className="text-sm text-gray-900 text-left w-full">{overview}</p>
                    </>
                )}

                {rated && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2 w-full">Rated</p>
                        <p className="text-sm text-gray-900 text-left bg-red-500 w-fit px-2 py-1 rounded-lg text-white ">{rated}</p>

                    </>
                )}

                {awards && awards !== 'N/A' && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2 w-full">Awards</p>
                        <p className="text-sm text-gray-900 text-left">{awards}</p>
                    </>
                )}

                {runtime && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2 w-full">Runtime</p>
                        <p className="text-sm text-gray-900 text-left w-full">{runtime}</p>

                    </>
                )}

                {review && (
                    <>
                        <p className="text-sm text-gray-500 text-left mt-2 w-full">Your review</p>
                        <p className="text-sm text-gray-900 text-left w-full">{review}</p>

                    </>
                )}

            </div>
            {trailer && (
                <iframe width="1903" height="742" src={`https://www.youtube.com/embed/${trailer.split('v=')[1]}`} title="Kung Fu Panda 4 | Sand &amp; Spice Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full sm:h-[300px] h-[200px] mt-2"></iframe>
            )}
            <hr className="my-2 border-1 border-gray-400" />
            <div className="flex justify-center items-center">
                <Link href={notionLink} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline">
                    <img src="/notion-wordmark.png" alt="Notion" className="w-auto h-6" />
                </Link>
            </div>
        </div>
    )
}