import Link from "next/link";

export default function MovieModal({ id, name, poster, overview, trailer, watchLink, notionLink, releaseDate }:
    {
        id: string | number,
        name: string,
        poster: string | null | undefined,
        overview: string,
        trailer: string,
        watchLink: string,
        notionLink: string,
        releaseDate: string

    }) {
    return (
        <div key={id} className="w-[400px] py-2 sm:py-0" >
            <div className='flex justify-center'>
                {poster ? (
                    <div
                        aria-label={name}>
                        <img
                            src={poster}
                            alt={name}
                            className="rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <img
                        src="/no-image.png"
                        alt={name}
                        className="rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover"
                        loading="lazy"
                    />
                )}

            </div>

            <h2 className="font-bold text-center text-gray-800 hover:text-blue-800 hover:underline transition-colors duration-200 mt-1"
            >
                <span>{name} {releaseDate}</span>
            </h2>
            <div className="sm:m-0 mx-6 gap-2 flex flex-col">
                <p className="text-sm text-gray-500 text-left mt-2">Overview:</p>
                {overview ? (
                    <p className="text-sm text-gray-900 text-left">{overview}</p>
                ) : (
                    <p className="text-sm text-gray-400 text-left">No overview for this movie</p>
                )}
                <p className="text-sm text-gray-500 text-left mt-2">Trailer:</p>
                {trailer ? (
                    <Link href={trailer} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline truncate">{trailer}</Link>
                ) : (
                    <p className="text-sm text-gray-400 text-left">No trailer for this movie</p>
                )}
                <p className="text-sm text-gray-500 text-left mt-2">Watch:</p>
                {watchLink ? (
                    <Link href={watchLink} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline truncate">{watchLink}</Link>
                ) : (
                    <p className="text-sm text-gray-400 text-left">No watch link for this movie</p>
                )}
                <p className="text-sm text-gray-500 text-left mt-2">Notion:</p>
                <Link href={notionLink} target='_blank' className="text-sm text-blue-500 text-left hover:text-blue-700 hover:underline truncate">{notionLink}</Link>
            </div>
        </div>
    )
}