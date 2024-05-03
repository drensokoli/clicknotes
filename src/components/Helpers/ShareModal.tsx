import { useEffect, useState } from "react";

export default function ShareModal({ setOpen, shareUrl }: { setOpen: any, shareUrl: string }) {

    const [isCopied, setIsCopied] = useState("Copy");
    function copyTextToClipboard(textToCopy: string, label: string) {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied("Copied!");
        setTimeout(() => {
            setIsCopied("Copy");
        }, 2000);
    }

    return (
        <div className="w-full bg-white shadow-lg rounded-md p-6 relative">
            <div className="flex items-center pb-3 border-b">
                <h3 className="text-xl font-medium flex-1">Share ClickNotes</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 cursor-pointer shrink-0 fill-black"
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
                        className="sm:w-12 sm:h-12 w-8 h-8 inline-flex items-center justify-center rounded-full border-none outline-none bg-blue-600 hover:shadow-xl p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 155.139 155.139">
                            <path
                                d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"
                                data-original="#010002" />
                        </svg>
                    </button>

                    {/* TWITTER */}
                    <button type="button"
                        onClick={() => window.open(`https://twitter.com/intent/post?text=I%27m%20using%20ClickNotes%20to%20save%20my%20favorite%20movies%2C%20books%20and%20time.%0A&url=${shareUrl}`, '_blank')}
                        className="sm:w-12 sm:h-12 w-8 h-8 inline-flex items-center justify-center rounded-full outline-none hover:shadow-xl bg-black p-2">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#ffffff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                        </svg> */}
                        <img src="x-social-media-round-icon.jpg" alt="" />
                    </button>

                    {/* LINKEDIN */}
                    <button type="button"
                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')}
                        className="sm:w-12 sm:h-12 w-8 h-8 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#0077b5] hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="#fff" viewBox="0 0 24 24">
                            <path
                                d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0z"
                                data-original="#0077b5" />
                        </svg>
                    </button>

                    {/* WHATSAPP */}
                    <button type="button"
                        className="sm:w-12 sm:h-12 w-8 h-8 inline-flex items-center justify-center rounded-full border-none outline-none hover:shadow-xl"
                        onClick={() => window.open(`https://wa.me/?text=${shareUrl}`, '_blank')}
                        style={{ fill: '#2CB742' }}>
                        <svg width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 58 58">
                            <path d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z" />
                            <path style={{ fill: '#FFFFFF' }} d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981c-1.713-1.713-1.761-3.41-0.52-5.242c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049c0,0-2.844-4.853-5.331-6.169c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45l5.097,5.097l5.097,5.097c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z" />
                        </svg>
                    </button>

                    {/* REDDIT */}
                    <button type="button"
                        onClick={() => window.open(`https://reddit.com/submit?url=${shareUrl}&title=I'm using ClickNotes to save my favorite movies, books and time.`, '_blank')}
                        className="sm:w-12 sm:h-12 w-8 h-8 inline-flex items-center justify-center rounded-full border-none outline-none hover:shadow-xl"
                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 } as React.CSSProperties}>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="200" viewBox="0 0 256 256">
                            <defs>
                            </defs>
                            <g style={{ stroke: 'none', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'none', fillRule: 'nonzero', opacity: 1 }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                <circle cx="45" cy="45" r="45" style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(255,69,0)', fillRule: 'nonzero', opacity: 1 }} transform="  matrix(1 0 0 1 0 0) " />
                                <path d="M 75.011 45 c -0.134 -3.624 -3.177 -6.454 -6.812 -6.331 c -1.611 0.056 -3.143 0.716 -4.306 1.823 c -5.123 -3.49 -11.141 -5.403 -17.327 -5.537 l 2.919 -14.038 l 9.631 2.025 c 0.268 2.472 2.483 4.262 4.955 3.993 c 2.472 -0.268 4.262 -2.483 3.993 -4.955 s -2.483 -4.262 -4.955 -3.993 c -1.421 0.145 -2.696 0.973 -3.4 2.204 L 48.68 17.987 c -0.749 -0.168 -1.499 0.302 -1.667 1.063 c 0 0.011 0 0.011 0 0.022 l -3.322 15.615 c -6.264 0.101 -12.36 2.025 -17.55 5.537 c -2.64 -2.483 -6.801 -2.36 -9.284 0.291 c -2.483 2.64 -2.36 6.801 0.291 9.284 c 0.515 0.481 1.107 0.895 1.767 1.186 c -0.045 0.66 -0.045 1.32 0 1.98 c 0 10.078 11.745 18.277 26.23 18.277 c 14.485 0 26.23 -8.188 26.23 -18.277 c 0.045 -0.66 0.045 -1.32 0 -1.98 C 73.635 49.855 75.056 47.528 75.011 45 z M 30.011 49.508 c 0 -2.483 2.025 -4.508 4.508 -4.508 c 2.483 0 4.508 2.025 4.508 4.508 s -2.025 4.508 -4.508 4.508 C 32.025 53.993 30.011 51.991 30.011 49.508 z M 56.152 62.058 v -0.179 c -3.199 2.405 -7.114 3.635 -11.119 3.468 c -4.005 0.168 -7.919 -1.063 -11.119 -3.468 c -0.425 -0.515 -0.347 -1.286 0.168 -1.711 c 0.447 -0.369 1.085 -0.369 1.544 0 c 2.707 1.98 6.007 2.987 9.362 2.83 c 3.356 0.179 6.667 -0.783 9.407 -2.74 c 0.492 -0.481 1.297 -0.47 1.779 0.022 C 56.655 60.772 56.644 61.577 56.152 62.058 z M 55.537 54.34 c -0.078 0 -0.145 0 -0.224 0 l 0.034 -0.168 c -2.483 0 -4.508 -2.025 -4.508 -4.508 s 2.025 -4.508 4.508 -4.508 s 4.508 2.025 4.508 4.508 C 59.955 52.148 58.02 54.239 55.537 54.34 z" style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                <div className="w-full rounded overflow-hidden border flex items-center mt-6">
                    <p className="text-sm text-gray-400 flex-1 ml-4">{shareUrl}</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 w-[70px] py-3 text-sm text-white"
                        onClick={() => copyTextToClipboard(shareUrl, 'Share URL')}
                    >{isCopied}</button>
                </div>
            </div>
        </div>
    );
}