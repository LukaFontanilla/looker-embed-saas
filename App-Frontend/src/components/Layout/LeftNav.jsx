import React, { useContext } from "react";
import { NavContext } from "../../contexts/NavContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { PermissionsContext } from "../../contexts/PermissionsContext";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const LeftNav = () => {
  const matches = useMediaQuery("(min-width: 1280px)");
  const [showNav, setShowNav] = React.useState(false);
  const { active, setActive } = useContext(NavContext);

  const navConfig = [
    {
      name: "Home",
      icon: () => <HomeOutlinedIcon />,
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
          icon: () => <MonetizationOnOutlinedIcon />,
          path: "/insights/sales",
        },
        {
          name: "Marketing",
          icon: () => <AdsClickOutlinedIcon />,
          path: "/insights/marketing",
        },
        {
          name: "Finance",
          icon: () => <PaymentsOutlinedIcon />,
          path: "/insights/finance",
        },
        {
          name: "New",
          icon: () => <AddCircleOutlineOutlinedIcon />,
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
          icon: () => <ExploreOutlinedIcon />,
          path: "/self-service/explore",
        },
      ],
    },
  ];
  return (
    <aside className="w-10 xl:w-auto max-w-screen-2xl border-r border-zinc-200 dark:border-zinc-800 overflow-auto">
      <nav className="flex flex-col gap-4 py-4 xl:px-2 items-center xl:items-start">
        {matches && navConfig.map((group) => <NavGroups group={group} />)}
        {!matches && (
          <>
            {[navConfig[0], ...navConfig[1].children].map((elem) => {
              return (
                <Link to={elem.path}>
                  <h2
                    onClick={() => setActive(elem.name)}
                    className="text-sm md:text-lg font-semibold text-zinc-500 dark:text-zinc-400"
                  >
                    {elem.icon()}
                  </h2>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
};

const NavGroups = ({ group, show }) => {
  const { active, setActive } = useContext(NavContext);

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
