import Link from "next/link";

export default function ListsCard({ name, id, databaseNameList, list, path }: { name: any, id: any; databaseNameList: any, list: any, path: any }) {
    return (
        <div className="rounded overflow-hidden movie-image px-2">
            <Link href={path} className="flex flex-row justify-center items-center">
                {list.map((list: any, index: any) => (
                    <img key={index} src={list.properties.Poster ? list.properties.Poster.url : list.properties["Cover Image"].url} alt="" className="h-[200px] object-cover w-full" />
                ))}
            </Link>
            <div className="px-6 py-4">
                <Link href={path} className="text-xl font-medium">{name}</Link>
                <p className="text-gray-700 text-base my-3">From: <span className="hover:text-gray-900 hover:font-medium"><Link href={`https://www.notion.so/${id.replace(/-/g, '')}`} target="_blank">{databaseNameList}</Link></span></p>
            </div>
            <div className="px-6 pb-2">
                {
                    list.map((list: any) => (
                        <Link href={`https://www.notion.so/${list.id.replace(/-/g, '')}`} target='_blank' className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {list.properties.Name ? list.properties.Name.title[0].plain_text : list.properties.Title.title[0].plain_text}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}