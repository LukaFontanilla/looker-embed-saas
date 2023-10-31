import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Fab from "@mui/material/Fab";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import React, { useState, useContext } from "react";
import { PermissionsContext } from "../../contexts/PermissionsContext";
import { NavContext } from "../../contexts/NavContext";
import { ReportConfigContext } from "../../contexts/ReportConfig";
// Desc: Footer component for the app
const Footer = () => {
  const { queryID, setQueryID } = useContext(ReportConfigContext);
  const { active } = useContext(NavContext);
  const {
    locale,
    setLocale,
    trafficSource,
    setTrafficSource,
    pdf,
    setPdf,
    show,
    setShow,
  } = useContext(PermissionsContext);

  const handleChange = (event) => {
    setPdf(event.target.checked);
  };

  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 z-10">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        © 2023 {import.meta.env.VITE_COMPANY_NAME} Inc.
      </p>
      <nav className="flex items-center space-x-4">
        <a className="text-sm text-zinc-500 dark:text-zinc-400" href="/terms">
          Terms
        </a>
        <a className="text-sm text-zinc-500 dark:text-zinc-400" href="/privacy">
          Privacy
        </a>
      </nav>
      <div
        className={`${
          show ? "absolute" : "fixed"
        } bottom-16 right-6 hidden md:inline`}
        onClick={() => setShow(show ? false : true)}
      >
        <Fab
          style={{ color: "#d18", backgroundColor: "transparent" }}
          aria-label="add"
        >
          <SettingsOutlinedIcon />
        </Fab>
      </div>
      <div
        id="settings"
        className={`${
          show ? "absolute" : "fixed"
        } gap-4  p-6 shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black
        transition-all duration-1000 ${show ? "right-0" : "-right-96"} ${
          show && "drop-shadow-[0_15px_15px_#fff]"
        }
        inset-y-0 h-full w-0 md:w-3/4 border-l sm:max-w-sm ${
          show ? "z-50" : "-z-50"
        } hidden md:inline`}
      >
        <div className="flex flex-col justify-start align-start w-full h-full items-start p-6">
          <div className="flex flex-col align-star w-full">
            <h3 className="text-xl font-bold mb-2 mt-4 dark:text-white text-black">
              Filters
            </h3>
            {active === "Sales" ? (
              <div
                className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-40 w-full hover:brightness-125 hover:drop-shadow-lg"
                id="svgBackground2"
              >
                <h3 className="text-xl font-bold mb-2 mt-4 text-white">
                  Custom Embed Query ID
                </h3>
                <Chip
                  label="53185"
                  variant={trafficSource === "53185" ? "filled" : "outlined"}
                  class="text-white border rounded-xl w-1/3 m-1"
                  onClick={(e) => setQueryID(e.target.textContent)}
                />
                <Chip
                  label=""
                  variant={trafficSource === "" ? "filled" : "outlined"}
                  class="text-white border rounded-xl w-1/3 m-1"
                  onClick={(e) => setQueryID(e.target.textContent)}
                />
              </div>
            ) : (
              <div
                className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-40 w-full hover:brightness-125 hover:drop-shadow-lg"
                id="svgBackground2"
              >
                <h3 className="text-xl font-bold mb-2 mt-4 text-white">
                  Country
                </h3>
                <Chip
                  label="Organic"
                  variant={trafficSource === "Organic" ? "filled" : "outlined"}
                  class="text-white border rounded-xl w-1/3 m-1"
                  onClick={(e) => setTrafficSource(e.target.textContent)}
                />
                <Chip
                  label="Search"
                  variant={trafficSource === "Search" ? "filled" : "outlined"}
                  class="text-white border rounded-xl w-1/4 m-1"
                  onClick={(e) => setTrafficSource(e.target.textContent)}
                />
                <Chip
                  label="Email"
                  variant={trafficSource === "Email" ? "filled" : "outlined"}
                  class="text-white border rounded-xl w-1/4 m-1"
                  onClick={(e) => setTrafficSource(e.target.textContent)}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between align-star w-full mt-6">
            <h3 className="text-xl font-bold mb-2 mt-4 dark:text-white text-black">
              Permissions
            </h3>
            <div
              className="bg-white dark:bg-zinc-800 shadow-lg p-2 rounded-xl h-40 w-full mb-4 hover:brightness-125 hover:drop-shadow-lg"
              id="svgBackground2"
            >
              <h3 className="text-xl font-bold mb-2 mt-4 text-white">Locale</h3>
              <Chip
                label="en"
                variant={locale === "en" ? "filled" : "outlined"}
                class="text-white border rounded-xl w-1/4 m-1"
                onClick={(e) => setLocale(e.target.textContent)}
              />
              <Chip
                label="ja_JP"
                variant={locale === "ja_JP" ? "filled" : "outlined"}
                class="text-white border rounded-xl w-1/4 m-1"
                onClick={(e) => setLocale(e.target.textContent)}
              />
              <Chip
                label="fr_FR"
                variant={locale === "fr_FR" ? "filled" : "outlined"}
                class="text-white border rounded-xl w-1/4 m-1"
                onClick={(e) => setLocale(e.target.textContent)}
              />
            </div>
            <di
              className="bg-white dark:bg-zinc-800 shadow-lg p-2 rounded-xl h-12 w-full hover:brightness-125 hover:drop-shadow-lg"
              id="svgBackground2"
              v
            >
              <span className="text-2xl font-bold text-white">
                PDF Download:{" "}
              </span>
              <Switch checked={pdf} onChange={handleChange} defaultChecked />
            </di>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
