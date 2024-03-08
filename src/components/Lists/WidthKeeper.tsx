export default function WidthKeeper() {
    return (
        <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4'>
            {Array(5).fill(0).map((_, index) => (
                <div className="sm:w-[200px] h-0" key={index}>
                </div>
            ))}
        </div>
    );
}