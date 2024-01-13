export default function LoadMore({ displayCount, setDisplayCount, media }: {

    displayCount: number;
    setDisplayCount: React.Dispatch<React.SetStateAction<number>>;
    media: any[];
}) {
    return (
        <div className='w-full flex justify-center items-center py-4'>
            <button
                type="button"
                className="text-blue-700 select-none hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => setDisplayCount(displayCount + 20)}
            >LOAD MORE</button>
        </div>
    );
}