import React, { useContext } from "react";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import useAuth from "../../hooks/useAuth";
// Desc: Top banner component

const TopBanner = () => {
  const { authed, user, logout } = useAuth();
  const { dark, setDark } = useContext(DarkModeContext);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 z-10">
      <div className="flex items-center space-x-4">
        <svg
          version="1.1"
          baseProfile="tiny"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          overflow="visible"
        >
          <g transform="scale(0.889,0.889)">
            <path
              fill="#D2E3FC"
              d="M7.4,1.5c-1.2,0-2.1,0.9-2.1,2.1c0,0.4,0.1,0.8,0.4,1.2l0.9-0.9c0-0.1,0-0.2,0-0.3c0-0.5,0.4-0.9,0.9-0.9
                    s0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.1,0-0.2,0-0.3,0L6.3,5.3c1,0.6,2.3,0.4,2.9-0.6c0.6-1,0.4-2.3-0.6-2.9
                    C8.3,1.6,7.9,1.5,7.4,1.5z"
            />
            <path
              fill="#5E97F6"
              d="M6.6,7.6c0-0.7-0.2-1.4-0.6-2L4.8,6.8C4.9,7.1,5,7.3,5,7.6c0,0.5-0.2,0.9-0.5,1.2l0.6,1.6
                    C6.1,9.8,6.6,8.7,6.6,7.6z"
            />
            <path
              fill="#5E97F6"
              d="M3.4,9.3L3.4,9.3c-0.9,0-1.7-0.7-1.7-1.6c0-0.9,0.7-1.7,1.6-1.7c0.3,0,0.7,0.1,1,0.3l1.2-1.1
                    C4.8,4.6,4.1,4.3,3.3,4.3C1.5,4.3,0,5.8,0,7.6c0,1.8,1.4,3.3,3.3,3.3c0.2,0,0.5,0,0.7-0.1L3.4,9.3z"
            />
            <path
              fill="#4285F4"
              d="M7.5,10.6c-0.7,0-1.4,0.1-2.1,0.3l0.9,2.2C6.7,13.1,7.1,13,7.5,13c2.8,0,5,2.3,5,5c0,2.8-2.3,5-5,5
                    c-2.8,0-5-2.3-5-5c0-1.9,1-3.6,2.7-4.4l-0.9-2.2c-3.7,1.8-5.2,6.3-3.4,9.9c1.8,3.7,6.3,5.2,9.9,3.4c3.7-1.8,5.2-6.3,3.4-9.9
                    C12.9,12.3,10.3,10.6,7.5,10.6z"
            />
          </g>
        </svg>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          <a
            href="https://sites.google.com/corp/google.com/pblv2/home"
            target="_blank"
            className="dark:text-zinc-50 text-zinc-900"
          >
            {import.meta.env.VITE_COMPANY_NAME}
          </a>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <label>
          <input
            id="dark-mode-toggle"
            type="checkbox"
            onClick={() => setDark(dark ? false : true)}
          />
          <svg
            id="sun"
            className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
            viewBox="0 0 512 512"
            width="512"
            height="512"
            fill="#f8f8f8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="32"
              d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"
            />
            <circle
              cx="256"
              cy="256"
              r="80"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
          </svg>
          <svg
            id="moon"
            className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <span className="sr-only">Toggle dark mode</span>
        </label>
        {authed ? (
          <>
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
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">View notifications</span>
            </span>
            <span onClick={logout}>
              <img
                src={user.photoURL} //"https://api.dicebear.com/7.x/shapes/svg?seed=George&radius=50&backgroundType=gradientLinear"
                alt="avatar"
                height="24"
                width="24"
                className="rounded-2xl cursor-pointer"
              />
            </span>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default TopBanner;
