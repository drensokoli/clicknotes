export default function WidthKeeper() {
    return (
        <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 h-0'>
            {Array(5).fill(0).map((_, index) => (
                <div className="w-[200px] px-4 sm:px-0 py-2 sm:py-0" key={index}>
                    <div className="flex items-end justify-center max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none">
                        <div className=" w-[90%] mb-3 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-3 gap-1">
                    </div>
                </div>
            ))}
        </div>
    );
}