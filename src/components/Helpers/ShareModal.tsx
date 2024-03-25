export default function ShareModal({ setOpen }: {setOpen: any}) {
    return (
        <div className="w-full bg-white shadow-lg rounded-md p-6 relative">
            <div className="flex items-center pb-3 border-b">
                <h3 className="text-xl font-medium flex-1">Share</h3>
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
                <div className="space-x-6 mt-6 text-center">
                    <button type="button"
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 155.139 155.139">
                            <path
                                d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"
                                data-original="#010002" />
                        </svg>
                    </button>
                    <button type="button"
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#03a9f4] hover:bg-[#03a1f4] active:bg-[#03a9f4]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 512 512">
                            <path
                                d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z"
                                data-original="#03a9f4" />
                        </svg>
                    </button>
                    <button type="button"
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#0077b5] hover:bg-[#0055b5] active:bg-[#0077b5]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 24 24">
                            <path
                                d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0z"
                                data-original="#0077b5" />
                        </svg>
                    </button>
                    <button type="button"
                        className="w-12 h-12 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#ea0065] hover:bg-[#ea0065d6] active:bg-[#ea0065]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 512 512">
                            <path d="M301 256c0 24.852-20.148 45-45 45s-45-20.148-45-45 20.148-45 45-45 45 20.148 45 45zm0 0"
                                data-original="#000000" />
                            <path
                                d="M332 120H180c-33.086 0-60 26.914-60 60v152c0 33.086 26.914 60 60 60h152c33.086 0 60-26.914 60-60V180c0-33.086-26.914-60-60-60zm-76 211c-41.355 0-75-33.645-75-75s33.645-75 75-75 75 33.645 75 75-33.645 75-75 75zm86-146c-8.285 0-15-6.715-15-15s6.715-15 15-15 15 6.715 15 15-6.715 15-15 15zm0 0"
                                data-original="#000000" />
                            <path
                                d="M377 0H135C60.562 0 0 60.563 0 135v242c0 74.438 60.563 135 135 135h242c74.438 0 135-60.563 135-135V135C512 60.562 451.437 0 377 0zm45 332c0 49.625-40.375 90-90 90H180c-49.625 0-90-40.375-90-90V180c0-49.625 40.375-90 90-90h152c49.625 0 90 40.375 90 90zm0 0"
                                data-original="#000000" />
                        </svg>
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