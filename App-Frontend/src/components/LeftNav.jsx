import React, { useContext } from "react";
import { NavContext } from "../contexts/NavContext";
import { DashboardContext } from "../contexts/DashboardContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { initializeDashboard } from "../helpers/staticAssets";
import { PermissionsContext } from "../contexts/PermissionsContext";

const LeftNav = () => {
  const matches = useMediaQuery("(min-width: 1280px)");
  const [showNav, setShowNav] = React.useState(false);
  const navCongfig = [
    {
      name: "Home",
      icon: "home",
      path: "/",
      children: [],
    },
    {
      name: "Insights",
      icon: "dashboard",
      path: "/insights",
      children: [
        {
          name: "Sales",
          path: "/insights/sales",
        },
        {
          name: "Marketing",
          path: "/insights/marketing",
        },
        {
          name: "Finance",
          path: "/insights/finance",
        },
        {
          name: "New",
          path: "/insights/new",
        },
      ],
    },
    {
      name: "Self Service",
      icon: "explore",
      path: "/self-service",
      children: [
        {
          name: "Explore",
          path: "/self-service/explore",
        },
        // {
        //     name: "Custom",
        //     path: "/self-service/custom"
        // },
        // {
        //     name: "Finance",
        //     path: "/self-service/fi"
        // }
      ],
    },
  ];
  return (
    <aside className="sm:min-w-1000 w-1/12 md-lg:w-2/12 border-r border-zinc-200 dark:border-zinc-800 overflow-auto">
      <nav className="flex flex-col gap-4 p-4">
        <button
          onClick={() => setShowNav(showNav ? false : true)}
          data-collapse-toggle="navbar-dropdown"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        {matches && navCongfig.map((group) => <NavGroups group={group} />)}
        {!matches && showNav && (
          <div class="fixed top-40 left-8 bg-white shadow-lg w-40 z-10 p-2 rounded-lg">
            {navCongfig.map((group) => (
              <NavGroups group={group} show={showNav} />
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};

const NavGroups = ({ group, show }) => {
  const { active, setActive } = useContext(NavContext);
  const { dashboard, setDashboard, loading, setLoading, id, setID } =
    useContext(DashboardContext);

  //   const handleDashboardClick = (type) => {
  //     console.log("Inside Handle Dashboard Click Left Nav", type);
  //     active === "Explore" && setID(initializeDashboard(type));
  //     setLoading(true);
  //     // dashboard.send("dashboard:load", {
  //     //     id: initializeDashboard(type),
  //     //     pushHistory: true
  //     // })

  //     // dashboard.send("dashboard:run")
  //     setActive(type);
  //   };

  //   const handleExploreClick = (type) => {
  //     setActive(type);
  //     setLoading(true);
  //     setID(null);
  //   };
  return (
    <>
      {group.name === "Home" ? (
        <Link to="/">
          <h2
            onClick={() => setActive("Home")}
            className="text-sm md:text-lg font-semibold text-zinc-500 dark:text-zinc-400"
          >
            {group.name}
          </h2>
        </Link>
      ) : (
        <h2 className="text-sm md:text-lg font-semibold text-zinc-500 dark:text-zinc-400">
          {group.name}
        </h2>
      )}
      {group.children.map((child) => (
        <Link to={child.path}>
          <div
            className={
              active === child.name
                ? "text-zinc-500 dark:text-zinc-400 space-y-4 pl-2 md:pl-4 bg-sky-700/10 rounded-md cursor-pointer"
                : "space-y-4 pl-2 md:pl-4 rounded-md cursor-pointer"
            }
            onClick={(e) => setActive(e.currentTarget.innerText)}
          >
            {child.name}
          </div>
        </Link>
      ))}
    </>
  );
};

export default LeftNav;
