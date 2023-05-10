import React from "react"
import Image from "next/image"

export default function Help() {
    return (
        <div className="flex flex-col justify-center items-center w-full p-16">

            <div className="flex flex-col px-16 justify-center w-4/6">
                <h1 className="text-2xl font-semibold">Connecting MovieNotes to you Notion account</h1>
                <p className="pt-6">The process of connecting MovieNotes to you Notion account may sound intimidating but is fairly simple and I'm here to help. I have divided the process into 3 steps that shouldn't take you more than 5 minutes to finish.</p>
                <p>If you want to learn more about the technical implementaion of this project, make sure to read the <span className="text-blue-500"><a href="https://github.com/drensokoli/MovieNotes">documentation</a></span>.</p>
                <div className="flex flex-col mt-10 justify-center w-full">
                    <h1 className="text-xl font-semibold">1. Create an integration in Notion</h1>
                    <p className="pt-4">If you don't already have a Notion account, you can open one <span className="text-blue-500"><a href="https://www.notion.so/">here</a></span>.</p>
                    <p>Once you have created your account, go to <span className="text-blue-500"><a href="https://www.notion.so/my-integrations"></a>my-integrations</span>, click on 'Create new integration' and give it a name. An Internal Integration Token will be created, which you can copy and paste as your 'Notion API Key' <span className="text-blue-500"><a href="https://MovieNotes.vercel.app/profile">here</a></span>.</p>
                    <div className="w-full h-[400px] bg-gray-200 my-4"></div>
                    <p className="text-center">🎉 Congrats! You just created a Notion integration! 🎉</p>
                </div>
                <div className="flex flex-col mt-10 justify-center w-full">
                    <h1 className="text-xl font-semibold">2. Add a database template</h1>
                    <p className="pt-4">I have created three Notion templates which you need to duplicate to be able to add your content. </p>
                    <ol className="py-4 px-4">
                        <li> • <span className="text-blue-500"><a href="https://drensokoli.notion.site/65f8607afe9e4773a82e6a1806ca312c?v=027421f09805471f8d9c8cb6f5fcb1f3">Movies template</a></span></li>
                        <li> • <span className="text-blue-500"><a href="">TV Shows template</a></span></li>
                        <li> • <span className="text-blue-500"><a href="">Books template</a></span></li>
                    </ol>
                    <div className="w-full h-[400px] bg-gray-200 my-4"></div>
                    <p>The columns of these tables are compatible with the request made by the MovieNotes API, so make sure not to edit the column names or types. Adding new columns should be fine, although they will not be affected by the movinotes API and will need to be filled in manually.</p>
                </div>
                <div className="flex flex-col mt-10 justify-center w-full">
                    <h1 className="text-xl font-semibold">3. Connect your database</h1>
                    <p className="pt-4">After duplicating the template, you need to add the API Key that you made earlier as a connection by clicking on the 'Add connections' button and searching for it by name. This just gives your integration read and write permissions to your movies template.</p>
                    <div className="w-full h-[400px] bg-gray-200 my-4"></div>
                    <p>All that's left is saving your databases link to your MovieNotes account. Click 'Share', 'Copy link' and paste it in your MovieNotes profile page.</p>
                    <p>Note that these steps apply to any type of content you are trying to save. You just need to add the respective template and save the link to the corresponding field in your profile page.</p>
                </div>
                <div className="flex flex-col mt-10 justify-center w-full">
                    <p className="text-center">That's it! You just connected your Notion database to MovieNotes! </p>
                    <p className="text-center">Go ahead and save your favorite movies, tvshows or books.</p>
                </div>
            </div>

        </div>
    )
}
