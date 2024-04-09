import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Fab from "@mui/material/Fab";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useState, useContext } from "react";
import { PermissionsContext } from "../../contexts/PermissionsContext";
import { NavContext } from "../../contexts/NavContext";
import { ReportConfigContext } from "../../contexts/ReportConfig";
import { DashboardContext } from "../../contexts/DashboardContext";
import { LLMConfigContext } from "../../contexts/LLMConfigContext"
import ColorPicker from "../Accessories/ColorPicker";
import useAuth from "../../hooks/useAuth"

// Desc: Footer component for the app
const Footer = () => {
  const { setQueryID } = useContext(ReportConfigContext);
  const { useEmbedSdk, setUseEmbedSdk } = useContext(DashboardContext);
  const { active, showSource, setShowSource } = useContext(NavContext);
  const {
    locale,
    setLocale,
    trafficSource,
    setTrafficSource,
    userType,
    setUserType,
    show,
    setShow,
  } = useContext(PermissionsContext);
  const [id, setID] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [checked, setChecked] = useState(false);
  const [borderRadius, setBorderRadius] = useState(10);

  const handleChange = (event, type) => {
    switch (type) {
      case "userType":
        setUserType(event.target.checked ? "premium" : "basic");
        break;
      case "queryID":
        setID(event.target.value);
        break;
      case "filter":
        setTrafficSource(event.target.textContent);
        break;
      default:
        break;
    }
  };

  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 z-10">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        © 2024 {import.meta.env.VITE_COMPANY_NAME} Inc.
      </p>
      <nav className="flex items-center space-x-4">
        <button disabled={active === "Sales" || active === "Marketing" || active === "Explore" ? false : true} className={`bg-transparent text-sm text-zinc-500 dark:text-zinc-400 
        ${active === "Sales" || active === "Marketing" || active === "Explore" ? "hover:shadow-[#d19]" : "hover:shadow-none"} 
        ${active === "Sales" || active === "Marketing" || active === "Explore" ? "cursor-pointer" : "cursor-arrow"}`} onClick={() => setShowSource(!showSource)}>
          Source
        </button>
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
        <div className="flex flex-col justify-start align-start w-full h-full items-start p-2 overflow-y-scroll">
          <div className="flex flex-col align-star w-full mb-20">
            {active === "Sales" ? (
              <div
                className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-40 w-full hover:brightness-125 hover:drop-shadow-lg"
                id="svgBackground2"
              >
                <h3 className="text-xl font-bold mb-2 mt-4 text-white">
                  Custom Embed Query ID
                </h3>
                <form
                  className="w-full max-w-sm"
                  onSubmit={(e) => {
                    setQueryID(id);
                    e.preventDefault();
                  }}
                >
                  <div className="flex flex-row items-center border-b border-teal-500 py-2">
                    <input
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Query ID"
                      aria-label="Full name"
                      value={id}
                      onChange={(e) => handleChange(e, "queryID")}
                    />
                    <button
                      className="flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
                      type="submit"
                    >
                      Submit
                    </button>
                    <button
                      className="flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
                      type="button"
                      onClick={() => {
                        setID("");
                        setQueryID("");
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            ) : active === "New" ? (
              <>
                <div
                  className="bg-white dark:bg-zinc-800 shadow-lg p-2 rounded-xl h-40 w-full mb-4 hover:brightness-125 hover:drop-shadow-lg"
                  id="svgBackground2"
                >
                  <h3 className="text-xl font-bold mb-2 mt-4 text-white">
                    Embed SDK
                  </h3>
                  <Chip
                    label="Yes"
                    variant={useEmbedSdk === "Yes" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => setUseEmbedSdk(true)}
                  />
                  <Chip
                    label="No"
                    variant={useEmbedSdk === "No" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => setUseEmbedSdk(false)}
                  />
                </div>
                {useEmbedSdk && (
                  <>
                    <WorkshopSettingsComponent
                      color={color}
                      setColor={setColor}
                      checked={checked}
                      setChecked={setChecked}
                      borderRadius={borderRadius}
                      setBorderRadius={setBorderRadius}
                    />
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          {active === "Marketing" || active === "Finance" ? (
            <>
              {active === "Marketing" ? (
                <>
                <h3 className="text-xl font-bold mb-2 mt-4 dark:text-white text-black">
                  Filters
                </h3>
                <div
                className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-40 w-full hover:brightness-125 hover:drop-shadow-lg"
                id="svgBackground2"
                >
                  <h3 className="text-xl font-bold mb-2 mt-4 text-white">
                    Traffic Source
                  </h3>
                  <Chip
                    label="Organic"
                    variant={trafficSource === "Organic" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/3 m-1"
                    onClick={(e) => handleChange(e, "filter")}
                    />
                  <Chip
                    label="Search"
                    variant={trafficSource === "Search" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => handleChange(e, "filter")}
                    />
                  <Chip
                    label="Email"
                    variant={trafficSource === "Email" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => handleChange(e, "filter")}
                    />
                </div>
                </>
              )
            : <></>
            }
              <div className="flex flex-col justify-between align-star w-full mt-6">
                <h3 className="text-xl font-bold mb-2 mt-4 dark:text-white text-black">
                  Permissions
                </h3>
                <div
                  className="bg-white dark:bg-zinc-800 shadow-lg p-2 rounded-xl h-40 w-full mb-4 hover:brightness-125 hover:drop-shadow-lg"
                  id="svgBackground2"
                >
                  <h3 className="text-xl font-bold mb-2 mt-4 text-white">
                    Locale
                  </h3>
                  <Chip
                    label="en"
                    variant={locale === "en" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => setLocale(e.target.textContent)}
                  />
                  <Chip
                    label="ja_JP"
                    variant={locale === "ja_JP" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => setLocale(e.target.textContent)}
                  />
                  <Chip
                    label="fr_FR"
                    variant={locale === "fr_FR" ? "filled" : "outlined"}
                    className="text-white border rounded-xl w-1/4 m-1"
                    onClick={(e) => setLocale(e.target.textContent)}
                  />
                </div>
                <div
                  className="bg-white dark:bg-zinc-800 shadow-lg p-2 rounded-xl h-full w-full hover:brightness-125 hover:drop-shadow-lg"
                  id="svgBackground2"
                  v
                >
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">
                        User Type{" "}
                      </span>
                      <span
                        className={`text-sm ${
                          userType === "basic"
                            ? "text-slate-100"
                            : "text-slate-300"
                        }`}
                      >
                        Basic User: View & Download Access
                      </span>
                      <span
                        className={`text-sm ${
                          userType === "basic"
                            ? "text-slate-100"
                            : "text-slate-300"
                        }`}
                      >
                        Premium User: Explore and Content Creation Access
                      </span>
                    </div>
                    <Switch
                      checked={userType === "basic" ? false : true}
                      onChange={(e) => handleChange(e, "userType")}
                      // defaultChecked
                    />
                  </div>
                </div>
              </div>
            </>
          ) : active === "Data Explore" || active === "Explore" ? (
            <>
              <ChatWidget />
            </>
          ) : <></>
        }
        </div>
      </div>
    </footer>
  );
};

const ChatWidget = () => {
  const { nlq, setNlq, nlqHistory, setNlqHistory, submitNlq, setSubmitNlq, setExploreUrl } = useContext(LLMConfigContext)
  const { authed, user, logout } = useAuth();

  React.useEffect(() => {
    const scrollable = document.getElementById("chat-scroll").lastElementChild
    scrollable.scrollIntoView({ behavior: 'smooth'})
  },[nlqHistory])
  return (
    <div
      className="flex flex-col h-[70%] w-[100%] max-w-sm rounded-lg border border-gray-200 dark:border-gray-800"
      data-id="1"
    >
      <header
        className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800"
        data-id="2"
      >
        <div className="flex items-center space-x-4" data-id="3">
          <img
            src={authed ? user.photoURL : ''}
            width="40"
            height="40"
            alt="Avatar"
            className="rounded-full overflow-hidden ring"
            data-id="4"
            style={{aspectRatio: '40 / 40', objectFit: 'cover'}}
          />
          <div className="space-y-1 leading-none" data-id="5">
            <h3 className="dark:text-slate-100 text-slate-800 font-semibold" data-id="6">
              {authed ? user.displayName : ''}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400" data-id="7">
              Typing...
            </p>
          </div>
        </div>
      </header>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-scroll h-[40vh]" id="chat-scroll" data-id="11">
        <div className="flex flex-col gap-2" data-id="12">
          <div className="rounded-xl p-3 bg-gray-100 dark:bg-gray-800" data-id="13">
            <p className="dark:text-slate-300 text-slate-700 text-sm overflow-x-scroll" data-id="14">
              Hey 👋, I am your dedicated data analyst. Please ask me any questions from the ecommerce dataset you have questions about, and I'll return the best fit Looker Query & visualization embedded.
            </p>
          </div>
        </div>
        <div className="self-end flex flex-col gap-2" data-id="17">
          <time
            className="text-xs text-gray-500 dark:text-gray-400 self-end"
            data-id="18"
          >
            2 minutes ago
          </time>
        </div>
        {nlqHistory.map((value) => (
          <div className="rounded-xl p-3 bg-gray-100 dark:bg-gray-800" data-id="13">
          <p className="dark:text-slate-300 text-slate-700 text-sm" data-id="14">
            {value}
          </p>
        </div>
        ))}
      </div>
      <div
        className="p-4 border-t border-gray-200 dark:border-gray-800"
        data-id="19"
      >
        <form data-id="20" onSubmit={async (e) => {
          e.preventDefault();
          setSubmitNlq(true)
          setNlqHistory([...nlqHistory, nlq])
          const data = await fetch(`/api/nlq?question=${nlq}`)
          const nlqData = await data.text()
          setExploreUrl(nlqData)
        }}>
          <div className="flex rounded-xl border dark:border-gray-800" data-id="21">
            <input
              className="flex h-10 rounded-md border-input dark:bg-background bg-transparent text-slate-400 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-l-xl border-0 w-full"
              placeholder="Type a message..."
              data-id="22"
              type="text"
              onChange={(e) => {
                setSubmitNlq(false)
                setNlq(e.target.value)
              }
              }
            />
            <button
              className="bg-black dark:bg-transparent inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-r-xl border-l-0 dark:border-gray-800"
              type="submit"
              data-id="23"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-5 h-5"
                data-id="24"
              >
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
              <span className="sr-only" data-id="25">
                Send
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const theme = {
  font_color: "#ffffff",
  primary_button_color: "#d20",
  tile_text_color: "#e5e5e5",
  title_color: "#ffffff",
  box_shadow: "0 0 10px 0 rgba(221,17,153)",
};

const WorkshopSettingsComponent = ({
  color,
  setColor,
  checked,
  setChecked,
  borderRadius,
  setBorderRadius,
}) => {
  const { setDashboardConfig, dashboardFilters, dashboard, id, setID } =
    useContext(DashboardContext);
  const [dashboardFilter, setDashboardFilter] = useState();
  const [dashboardFilterValue, setDashboardFilterValue] = useState();
  const [dashboardID, setDashboardID] = useState();

  React.useEffect(() => {
    if (dashboardFilter) {
      setDashboardFilterValue(dashboardFilters[dashboardFilter]);
    }
  }, [dashboardFilter]);

  return (
    <>
      <div
        className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-auto w-full hover:brightness-125 hover:drop-shadow-lg"
        id="svgBackground2"
      >
        <h3 className="text-xl font-bold mb-2 mt-4 text-white">
          Dashboard ID to Embed
        </h3>
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            setID(dashboardID);
            e.preventDefault();
          }}
        >
          <div className="flex flex-row items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-slate-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Dashboard ID"
              aria-label="Full name"
              value={dashboardID !== undefined ? dashboardID : ""}
              onChange={(e) => {
                setDashboardID(e.target.value);
              }}
            />
            <button
              className="flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
              type="submit"
            >
              Submit
            </button>
            <button
              className="flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
              type="button"
              onClick={() => {
                setDashboardID("");
                setID("");
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div
        className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-auto w-full hover:brightness-125 hover:drop-shadow-lg"
        id="svgBackground2"
      >
        <h3 className="text-xl font-bold mb-2 mt-4 text-white">
          Custom Theme Config
        </h3>
        <form
          className="w-2/8 max-w-sm"
          onSubmit={(e) => {
            // For Dynamic themes, you can change the individual theme parameters instead of
            // applying a new named theme.
            // Use the API Explorer or the typed theme object (https://developers.looker.com/api/explorer/4.0/types/Theme/Theme) to understand the individual properties that
            // can be customized

            // To note, the theme object is applied as an embed parameter of the url
            // so you'll need to stringify the object
            setDashboardConfig(
              JSON.stringify({
                ...theme,
                background_color: color,
                tile_background_color: color,
                show_filters_bar: checked,
                border_radius: borderRadius.toString() + "px",
              }),
            );
            e.preventDefault();
          }}
        >
          <div className="flex flex-col items-start justify-between py-2 ">
            <div className="flex flex-col w-full">
              <p className="text-slate-200 mb-2">Background and Tile Color</p>
              <ColorPicker color={color} setColor={setColor} />
            </div>
            <div className="flex flex-row items-center w-full pt-3 divide-slate-200 divide-y">
              <p className="text-slate-200">Show Filters Bar</p>
              <div className="flex items-center pl-4 border border-none">
                <input
                  checked={checked}
                  id="bordered-checkbox-2"
                  type="checkbox"
                  name="bordered-checkbox"
                  onChange={() => setChecked(!checked)}
                />
              </div>
            </div>
            <div className="flex flex-row items-center w-full pt-3">
              <p className="text-slate-200">Select Border Radius</p>
              <div className="grid grid-cols-3 gap-0">
                <Chip
                  label="0"
                  variant={borderRadius === "0" ? "filled" : "outlined"}
                  className="text-white border rounded-xl w-1/8 m-1"
                  onClick={(e) => setBorderRadius(e.target.textContent)}
                />
                <Chip
                  label="10"
                  variant={borderRadius === "10" ? "filled" : "outlined"}
                  className="text-white border rounded-xl w-1/8 m-1"
                  onClick={(e) => setBorderRadius(e.target.textContent)}
                />
                <Chip
                  label="18"
                  variant={borderRadius === "18" ? "filled" : "outlined"}
                  className="text-white border rounded-xl w-1/8 m-1"
                  onClick={(e) => setBorderRadius(e.target.textContent)}
                />
                <Chip
                  label="24"
                  variant={borderRadius === "24" ? "filled" : "outlined"}
                  className="text-white border rounded-xl w-1/8 m-1"
                  onClick={(e) => setBorderRadius(e.target.textContent)}
                />
                <Chip
                  label="32"
                  variant={borderRadius === "32" ? "filled" : "outlined"}
                  className="text-white border rounded-xl w-1/8 m-1"
                  onClick={(e) => setBorderRadius(e.target.textContent)}
                />
              </div>
            </div>
            <div className="pt-4 w-full border-b border-slate-200"></div>
            <button
              className="mt-2 flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div
        className="bg-white dark:bg-black shadow-lg mb-4 p-2 rounded-xl h-auto w-full hover:brightness-125 hover:drop-shadow-lg"
        id="svgBackground2"
      >
        <h3 className="text-xl font-bold mb-2 mt-4 text-white">
          Custom Filter Config
        </h3>
        {dashboardFilters !== undefined ? (
          <>
            <form
              className="w-full max-w-sm"
              onSubmit={(e) => {
                // Function used to send filters updated from the parent application to the iFrame
                // and embedded content

                // Create empty filters object
                const filtersObject = {};

                // Add filter name (this should equal the name of the dashboard filter in Looker)
                // Set this equal to the filter value
                filtersObject[dashboardFilter] = dashboardFilterValue;

                // Post the message to the Looker dashboard
                dashboard.send("dashboard:filters:update", {
                  filters: filtersObject,
                });

                // Re-run dashboard with new filter values
                dashboard.send("dashboard:run");
                // setQueryID(id);
                e.preventDefault();
              }}
            >
              <div className="flex flex-row items-center border-b border-teal-500 py-2">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={dashboardFilters}
                  label="Age"
                  onChange={(e) => setDashboardFilter(e.target.value)}
                >
                  {Object.keys(dashboardFilters).map((filter, index) => (
                    <MenuItem value={filter} key={index}>
                      {filter}
                    </MenuItem>
                  ))}
                </Select>
                <input
                  className="appearance-none bg-transparent border-none w-full text-slate-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Dashboard Filter"
                  aria-label="Full name"
                  value={dashboardFilterValue}
                  onChange={(e) => {
                    setDashboardFilterValue(e.target.value);
                  }}
                />
                <button
                  className="flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
                  type="submit"
                >
                  Submit
                </button>
                <button
                  className="flex-shrink-0 border-transparent border-0 text-white border rounded-xl p-1"
                  type="button"
                  onClick={() => {
                    setDashboardFilterValue("");
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-slate-200">Loading Filter Options</p>
        )}
      </div>
    </>
  );
};

export default Footer;
