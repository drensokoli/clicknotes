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
                <div className="flex flex-col py-8 px-8 sm:px-16 justify-center lg:w-4/6 w-full">
                    <h1 className="text-2xl font-semibold">What is ClickNotes?</h1>
                    <p className="py-6">ClickNotes uses the TMDB, Google Books and NY Times API to fetch movies, tv shows and books which they can then save to their Notion databases using the Notion API.</p>
                    {/* <Image src={Logo} width={180} height={200} alt={""} style={{ display: 'block', margin: 'auto' }} className="py-8" /> */}
                    <h1 className="text-2xl font-semibold">What is Notion?</h1>
                    <p className="py-6">Notion is a freemium productivity and note-taking web application developed by Notion Labs Inc. It offers organizational tools including task management, project tracking, to-do lists, and bookmarking.</p>
                    <h1 className="text-2xl font-semibold">Connecting ClickNotes to Your Notion Account</h1>
                    <p className="pt-6">Setting up a connection between ClickNotes and your Notion account may seem intimidating, but it's very straightforward. I've broken down the process into three easy steps that should take no more than five minutes to complete.</p>
                    <p>If you want to learn more about the technical implementaion of this project, make sure to read the <span className="text-blue-500"><Link href="https://github.com/drensokoli/clicknotes" aria-label='GitHub Repo'>documentation</Link></span>.</p>
                    <div className="flex flex-col mt-10 justify-center w-full">
                        <h1 className="text-xl font-semibold">Step 1: Create an Integration in Notion</h1>
                        <p className="pt-4">If you don't already have a Notion account, you can create one <span className="text-blue-500"><Link href="https://www.notion.so/" aria-label='Notion'>here</Link></span>.</p>
                        <p>Once you've set up your account, navigate to the <span className="text-blue-500 underline"><Link href="https://www.notion.so/my-integrations" aria-label='Your Notion Integrations'>notion.so/my-integrations</Link></span> section and click on "Create new integration." Give it a name and Notion will generate an Internal Integration Token for you. This token will be used to establish a connection between ClickNotes and Notion.</p>
                        <Image src={StepOne} width={700} height={600} alt={""} style={{ display: 'block', margin: 'auto' }} className="py-8" />
                    </div>
                    <div className="flex flex-col mt-10 justify-center w-full">
                        <h1 className="text-xl font-semibold">Step 2: Duplicate the ClickNotes Official Templates</h1>
                        <p className="pt-4">I've created three Notion templates that you'll need to duplicate to store your content. The column names and types of these templates are compatible with the ClickNotes API, so make sure not to modify them. Feel free to add new columns, but note that they won't be affected by the ClickNotes API and will need to be filled in manually (e.g "My rating").</p>
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
                        {/* <Image src={StepTwo} width={700} height={600} alt={""} style={{ display: 'block', margin: 'auto' }} className="py-4" /> */}
                    </div>
                    <div className="flex flex-col mt-10 justify-center w-full">
                        <h1 className="text-xl font-semibold">Step 3: Connect Your Database</h1>
                        <p className="pt-4">After duplicating the templates, you'll need to add the Token generated in the previous step as a connection by clicking on the "Add connections" button and searching for it by name. This action grants your Integration Token read and write permissions to the corresponding Notion page.</p>
                        <Image src={StepThree} width={700} height={600} alt={""} style={{ display: 'block', margin: 'auto' }} className="py-8" />
                        <p>Finally, save your page (database) link in your ClickNotes profile page by clicking "Share," "Copy link," and pasting it in the appropriate input field in your ClickNotes profile page.</p>
                        <p>These steps apply to any of the three content types you want to save. Just add the respective template and save the link to the corresponding field in your profile page.</p>
                    </div>
                    <div className="flex flex-col mt-10 justify-center w-full">
                        <p className="text-center">🎉 That's it! You've successfully connected your Notion database to ClickNotes! 🎉</p>
                        <p className="text-center">Go ahead and save your favorite movies, TV shows, or books.</p>
                    </div>
                </div>

            </div>
        </>
    )
}
