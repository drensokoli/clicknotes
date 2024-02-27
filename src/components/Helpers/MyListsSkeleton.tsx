export default function MyListsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-4 sm:px-20 px-4">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="bg-gray-100 h-96 w-full rounded-lg shadow-lg">
          <div className="h-[60%] bg-gray-100 rounded-lg"></div>
          <div className="my-6 mx-8 h-8 w-[60%] bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex flex-col my-6 mx-8 gap-2">
            <div className="flex flex-row gap-2">
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-200"></div>
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-200"></div>
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-200"></div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-200"></div>
              <div className="animate-pulse rounded-full h-5 w-20 bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}