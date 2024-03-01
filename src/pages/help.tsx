import React from "react"
import Image from "next/image"
import StepOne from "../../public/stepOne.gif"
import StepTwo from "../../public/stepTwo.gif"
import StepThree from "../../public/stepThree.gif"
import BooksTemplate from "../../public/template_books.png"
import MoviesTemplate from "../../public/template_movies.png"
import Logo from "../../public/logo.png"
import Link from "next/link"
import Head from "next/head"
import Header from "@/components/Helpers/Header"
// import { NextSeo } from "next-seo"

export default function Help() {
    return (
        <>
            <Head>
                <title>ClickNotes | Help Page</title>
                <meta name="description" content="How to connect ClickNotes to Notion?" />
                <meta name="robots" content="all"></meta>
                <meta property="og:title" content="ClickNotes | Help Page" />
                <meta property="og:description" content="How to connect ClickNotes to Notion?" />
                <meta property="og:image" content="https://www.clicknotes.site/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Dren Sokoli" />
                <meta name="google-adsense-account" content="ca-pub-3464540666338005"></meta>
                <link rel="icon" href="/favicon.ico" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005"
                    crossOrigin="anonymous"></script>
            </Head>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="lg:w-[60%] w-[80%]">

                    <Header>Connecting ClickNotes to Your Notion Account</Header>
                    <p>Setting up a connection between ClickNotes and your Notion account may seem intimidating, but it's very straightforward. I've broken down the process into three easy steps that should take no more than five minutes to complete.</p>
                    <p>If you want to learn more about the technical implementaion of this project, make sure to read the <span className="text-blue-600 underline"><Link href="https://github.com/drensokoli/clicknotes#clicknotes-documentation" aria-label='GitHub Repo' target="_blank">documentation</Link></span>.</p>

                    <iframe src="https://www.youtube.com/embed/gp2yhkVw0z4" title="What is Notion?" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        className="w-full md:h-[450px] h-48 my-4"
                    ></iframe>

                    <Header>What is ClickNotes?</Header>
                    <p>ClickNotes is an open source project that intends to simplify the note-taking experience for your movies, tvshows and books. ClickNotes uses the TMDB (<span className="text-blue-600 underline "><Link target="_blank" href="https://themoviedb.org" aria-label='Notion'>themoviedb.org</Link></span>), Google Books and NY Times API to fetch movies, tv shows and books which users can then save to their Notion databases using the Notion API - all this done in the single click of a button.</p>

                    <Header>What is Notion?</Header>
                    <p>Notion is a note-taking web application which offers organizational tools including task management, project tracking, to-do lists, and bookmarking. It's known for its flexibility, allowing users to create databases, manage projects, take notes, collaborate with teams, and more. This flexibility enables users to create custom structures that suit their specific needs, whether it's for personal task management, team collaboration, knowledge organization or in our case - media listing and organizing.</p>
                    <iframe
                        src="https://www.youtube.com/embed/gp2yhkVw0z4"
                        title="What is Notion?" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        className="w-full md:h-96 h-48 my-4"
                    ></iframe>
                    <p className="text-center text-lg font-semibold">Use my <span className="text-blue-600 underline italic"><Link target="_blank" href="https://affiliate.notion.so/8ieljsf8weuq" aria-label='Notion'>affiliate link</Link></span> to create a Notion account if you don't already have one.</p>

                    <Header>Step 1: Create an Integration in Notion</Header>
                    <p>In order to connect ClickNotes to your Notion account, you'll need to create an Integration in Notion. This is a simple process that requires no coding knowledge.</p>
                    <p>Once you've set up your account, navigate to the <span className="text-blue-600 underline"><Link target="_blank" href="https://affiliate.notion.so/my-integrations" aria-label='Your Notion Integrations'>notion.so/my-integrations</Link></span> section and click on "Create new integration". This token will be used to establish a connection between ClickNotes and Notion.</p>
                    <Image src={StepOne} width={700} height={600} alt={""} className="m-auto my-4 shadow-xl" />

                    <Header>Step 2: Duplicate the ClickNotes Official Templates</Header>
                    <p>I've created these Notion templates that you'll need to duplicate to store your content. The column names and types of these templates are compatible with the ClickNotes API, so make sure not to modify them. Feel free to add new columns, but note that they won't be affected by the ClickNotes API and will need to be filled in manually (e.g "My rating").</p>
                    <div className="flex md:flex-row flex-col justify-center items-center gap-4 py-4">
                        <div className="flex flex-col justify-center items-center">
                            <Link
                                href="https://affiliate.notion.so/duplicate-movies-template"
                                target="_blank">
                                <Image src={MoviesTemplate} width={450} height={450} alt={""} className="movie-image h-auto" />
                            </Link>
                            <Link
                                href="https://affiliate.notion.so/duplicate-movies-template"
                                target="_blank">
                                <h1 className="text-lg font-semibold text-gray-700 hover:underline">Movies and Shows Template</h1>
                            </Link>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <Link
                                href="https://affiliate.notion.so/duplicate-books-template"
                                target="_blank">
                                <Image src={BooksTemplate} width={450} height={450} alt={""} className="movie-image h-auto" />
                            </Link>
                            <Link
                                href="https://affiliate.notion.so/duplicate-books-template"
                                target="_blank">
                                <h1 className="text-lg font-semibold text-gray-700 hover:underline">Books Template</h1>
                            </Link>
                        </div>
                    </div>

                    <Header>Step 3: Connect Your Database</Header>
                    <p>Add the Integration Token to your new Notion template by clicking on the "Add connections" button and searching for it by name. This action grants your Integration Token read and write permissions to your Notion page.</p>
                    <p>Finally, copy the link of your Notion template and submit it in your <span className="text-blue-600 underline"><Link href="https://clicknotes.site/profile-settings" aria-label='GitHub Repo' target="_blank">ClickNotes profile page</Link></span>.</p>
                    <Image src={StepThree} width={700} height={600} alt={""} className="m-auto my-4 shadow-xl" />
                    <div className="flex flex-col mt-10 justify-center w-full">
                        <p className="text-center">🎉 That's it! You've successfully connected your Notion database to ClickNotes! 🎉</p>
                        <p className="text-center">Go ahead and save your favorite movies, TV shows, or books.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
