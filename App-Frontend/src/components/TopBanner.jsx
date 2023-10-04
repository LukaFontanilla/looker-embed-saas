import React, {useContext} from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';
// Desc: Top banner component

const TopBanner = () => {
    const {dark, setDark} = useContext(DarkModeContext)
    function switchTheme(e) {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
    }

    return (

        <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 z-10" >
            <div className="flex items-center space-x-4" >
            <svg
                className=" h-8 w-8 text-zinc-900 dark:text-zinc-50"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"  />
            </svg>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50" >
                {import.meta.env.VITE_COMPANY_NAME}
            </h1>
            </div>
            <div className="flex items-center space-x-4" >
            <span id="dark-mode-toggle" onClick={() => setDark(dark ? false : true)}>
                <svg
                className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"  />
                </svg>
                <span className="sr-only" >
                                    Toggle dark mode
                </span>
            </span>
            <span>
                <svg
                className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"  />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"  />
                </svg>
                <span className="sr-only" >
                                    View notifications
                </span>
            </span>
            <span>
            <img
                src="https://api.dicebear.com/7.x/shapes/svg?seed=George&radius=50&backgroundType=gradientLinear"
                alt="avatar" height="24" width="24"/>
            </span>
            </div>
        </nav>
    )
}

export default TopBanner;