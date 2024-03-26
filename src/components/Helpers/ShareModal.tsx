import { useEffect } from "react";

export default function ShareModal({ setOpen, shareUrl }: { setOpen: any, shareUrl: string }) {

    return (
        <div className="w-full bg-white shadow-lg rounded-md p-6 relative">
            <div className="flex items-center pb-3 border-b">
                <h3 className="text-xl font-medium flex-1">Share ClickNotes</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                    onClick={() => setOpen(false)}
                    viewBox="0 0 320.591 320.591">
                    <path
                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                        data-original="#000000"></path>
                    <path
                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                        data-original="#000000"></path>
                </svg>
            </div>
            <div className="my-8">
                <div className="flex items-center justify-center space-x-6 mt-6 text-center">

                    {/* FACEBOOK */}
                    <button type="button"
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=ClickNotes`, '_blank')}
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-blue-600 hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 155.139 155.139">
                            <path
                                d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"
                                data-original="#010002" />
                        </svg>
                    </button>

                    {/* TWITTER */}
                    <button type="button"
                        onClick={() => window.open('https://twitter.com/intent/post?text=I%27m%20using%20ClickNotes%20to%20save%20my%20favorite%20movies%2C%20books%20and%20time.%0A&url=https%3A%2F%2Fwww.clicknotes.site', '_blank')}
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#03a9f4] hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path d="M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0z" /><path fill="#fff" fill-rule="nonzero" d="M318.64 157.549h33.401l-72.973 83.407 85.85 113.495h-67.222l-52.647-68.836-60.242 68.836h-33.423l78.052-89.212-82.354-107.69h68.924l47.59 62.917 55.044-62.917zm-11.724 176.908h18.51L205.95 176.493h-19.86l120.826 157.964z" /></svg>
                    </button>

                    {/* LINKEDIN */}
                    <button type="button"
                        onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://www.clicknotes.site', '_blank')}
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#0077b5] hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 24 24">
                            <path
                                d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0z"
                                data-original="#0077b5" />
                        </svg>
                    </button>


                    <button type="button"
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#ea0065] hover:shadow-xl">
                        whatsapp
                    </button>
                </div>
            </div>
            <div>
                <div className="w-full rounded overflow-hidden border flex items-center mt-6">
                    <p className="text-sm text-gray-400 flex-1 ml-4">https://www.clicknotes.site</p>
                    <button className="bg-blue-500 hover:bg-blue-600 px-4 py-3 text-sm text-white">Copy</button>
                </div>
            </div>
        </div>
    );
}