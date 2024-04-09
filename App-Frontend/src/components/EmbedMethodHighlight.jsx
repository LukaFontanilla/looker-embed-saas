import React, { useContext } from "react";
import { NavContext } from "../contexts/NavContext";
import { DarkModeContext } from "../contexts/DarkModeContext";
import darkmodeCodeApi from "../assets/darkmode-api.svg"
import lightmodeCodeApi from "../assets/darkmode-light.svg"
import darkmodeCodeDashboard from "../assets/darkmode-dashboard.svg"
import lightmodeCodeDashboard from "../assets/darkmode-light-dashboard.svg"
import darkmodeNlq from "../assets/darkmode-nlq.svg"

const EmbedMethodHighlight = () => {
    const { active, showSource } = useContext(NavContext);
    const { dark } = useContext(DarkModeContext);

    if(showSource && active === "Sales") {
        return (
            <div className={`z-10 rounded-xl absolute backdrop-blur-sm backdrop-brightness-100 dark:backdrop-brightness-200 backdrop-opacity-60 h-full w-full dark:bg-white/50 bg-zinc-900/50 flex flex-col justify-center align-center items-center`}>
                <div className="relative z-1 rounded-xl flex flex-row justify-center align-end items-center w-[80%] h-[80%] bg-white dark:bg-zinc-900 p-4 drop-shadow-none transition-drop-shadow ease-in duration-200 hover:drop-shadow-2xl">
                    <div className="absolute -top-7 rounded-tr-xl rounded-tl-xl w-full h-10 bg-white dark:bg-zinc-900 p-2" style={{
                        clipPath: "path('M 0 0 L 150 0 C 185 2, 175 16, 200 40 L 0 40 z')"
                    }}>
                        <div className="absolute rounded-xl top-0 bg-[#d19] dark:bg-white h-[0.1rem] w-[10%] ml-7"></div>
                        <h3 className="text-lg font-bold mb-2 text-black dark:text-white">Embed API Query</h3>
                    </div>
                    <div className="h-[80%] flex flex-row justify-center align-center">
                        <img height="100%" width="auto" src={dark ? darkmodeCodeApi : lightmodeCodeApi} />
                    </div>
                </div>
            </div>
        )
    } else if(showSource && active === "Marketing") {
        return (
            <div className={`z-10 absolute backdrop-blur-sm backdrop-brightness-100 dark:backdrop-brightness-200 backdrop-opacity-60 h-full w-full dark:bg-white/50 bg-zinc-900/50 flex flex-col justify-center align-center items-center`}>
                <div className="relative z-1 rounded-xl flex flex-row justify-center align-end items-center w-[80%] h-[80%] bg-white dark:bg-zinc-900 p-4 drop-shadow-none transition-drop-shadow ease-in duration-200 hover:drop-shadow-2xl">
                    <div className="absolute -top-7 rounded-tr-xl rounded-tl-xl w-full h-10 bg-white dark:bg-zinc-900 p-2" style={{
                        clipPath: "path('M 0 0 L 150 0 C 185 2, 175 16, 200 40 L 0 40 z')"
                    }}>
                        <div className="absolute rounded-xl top-0 bg-[#d19] dark:bg-white h-[0.1rem] w-[10%] ml-7"></div>
                        <h3 className="text-lg font-bold mb-2 text-black dark:text-white">Embed API Query</h3>
                    </div>
                    <div className="h-[80%] flex flex-row justify-center align-center">
                        <img height="100%" width="auto" src={dark ? darkmodeCodeDashboard : lightmodeCodeDashboard} />
                    </div>
                </div>
            </div>
        )
    } else if(showSource && active === "Explore") {
        return (
            <div className={`z-10 absolute backdrop-blur-sm backdrop-brightness-100 dark:backdrop-brightness-200 backdrop-opacity-60 h-full w-full dark:bg-white/50 bg-zinc-900/50 flex flex-col justify-center align-center items-center`}>
                <div className="relative z-1 rounded-xl flex flex-row justify-center align-end items-center w-[80%] h-[80%] bg-white dark:bg-zinc-900 p-4 drop-shadow-none transition-drop-shadow ease-in duration-200 hover:drop-shadow-2xl">
                    <div className="absolute -top-7 rounded-tr-xl rounded-tl-xl w-full h-10 bg-white dark:bg-zinc-900 p-2" style={{
                        clipPath: "path('M 0 0 L 150 0 C 185 2, 175 16, 200 40 L 0 40 z')"
                    }}>
                        <div className="absolute rounded-xl top-0 bg-[#d19] dark:bg-white h-[0.1rem] w-[10%] ml-7"></div>
                        <h3 className="text-lg font-bold mb-2 text-black dark:text-white">Explore Assistant</h3>
                    </div>
                    <div className="h-[80%] flex flex-row justify-center align-center">
                        <img height="100%" width="auto" src={darkmodeNlq} />
                    </div>
                </div>
            </div>
        )
    }
}

export default EmbedMethodHighlight;