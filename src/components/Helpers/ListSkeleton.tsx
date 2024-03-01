export default function MyListsSkeleton() {
  return (
    <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-0'>
      {Array(25).fill(0).map((_, index) => (
        <div className="w-[200px] px-4 sm:px-0 py-2 sm:py-0">
          <div className="flex items-end justify-center bg-gray-200 animate-pulse rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover">
            <div className="border-2 border-gray-350 bg-gray-300 rounded-lg h-12 w-[90%] mb-3 animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center justify-center mt-3 gap-1">
            <div className="bg-gray-200 rounded-sm animate-pulse h-6 w-[85%] animate-pulse"></div>
            <div className="bg-gray-200 rounded-sm animate-pulse h-6 w-[60%] animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}