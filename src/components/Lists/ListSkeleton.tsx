export default function ListsSkeleton() {
  return (
    <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4'>
      {Array(10).fill(0).map((_, index) => (
        <div className="w-[200px] px-4 sm:px-0 py-2 sm:py-0" key={index}>
          <div className="flex items-end justify-center bg-gray-100 rounded-sm max-h-[240px] min-h-[240px] sm:max-h-[300px] sm:min-h-[300px] h-auto select-none object-cover">
            <div className="border-2 border-gray-350 bg-gray-200 rounded-lg h-12 w-[90%] mb-3 animate-pulse"></div>
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