import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavContext } from "../../../contexts/NavContext";
import EmbedDashboard from "../../EmbedDashboard";
import { DashboardContext } from "../../../contexts/DashboardContext";
import { PermissionsContext } from "../../../contexts/PermissionsContext";
import { DarkModeContext } from "../../../contexts/DarkModeContext";
import {
  initializeDashboard,
  homePageConfig,
} from "../../../helpers/staticAssets";
import HomepageLineChartContainer from "./HomepageLineChart";
import useAuth from "../../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  const { active, setActive } = useContext(NavContext);
  const { dashboard, setDashboard, loading, setLoading, id, setID } =
    useContext(DashboardContext);
  const { trafficSource, locale, pdf } = useContext(PermissionsContext);
  const { dark } = useContext(DarkModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    setActive("Home");
  }, []);

  const handleDashboardClick = (type) => {
    active === "Explore" && setID(initializeDashboard(type));
    setActive(type);
    setLoading(true);
    dashboard.send("dashboard:load", {
      id: initializeDashboard(type),
      pushHistory: true,
    });

    dashboard.send("dashboard:run");
  };

  const handleClick = (data) => {
    setActive(data);
    console.log(data);
    data !== "Explore"
      ? navigate(`/insights/${data.toLowerCase()}`)
      : navigate(`/self-service/explore`);
  };

  return (
    <>
      <div className={`p-4 z-1`} style={{ height: "70vh" }} id="home">
        <section className="mb-14">
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">
            Welcome {user.displayName}!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-transparent dark:bg-zinc-800 shadow-lg rounded-xl w-120 hover:drop-shadow-lg">
              <HomepageLineChartContainer />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                Weekly Analytics Wrap
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Brief summary of your weekly analytics data.
              </p>
            </div>
          </div>
        </section>
        {homePageConfig.map((section, index) => (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
              {section.section}
            </h2>
            <div
              className={`grid ${
                index === 0
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-2"
              } gap-6`}
            >
              {section["sub-sections"].map((subsection, index) => (
                <div>
                  <div
                    onClick={() => handleClick(subsection.title)}
                    className="cursor-pointer"
                  >
                    <div
                      className="bg-white flex justify-center items-center dark:bg-black shadow-lg p-2 rounded-xl h-40 hover:brightness-125 hover:drop-shadow-lg mb-2"
                      id={"svgBackground" + (index + 2).toString()}
                    >
                      <h3
                        className="text-4xl font-bold mb-2 mt-4 dark:text-black text-white"
                        style={{
                          textShadow:
                            "0px 1px 0px rgba(221,17,153,.9), 0px -1px 0px rgba(0,0,0,.7)",
                          // color: '#fff',
                        }}
                      >
                        {subsection.title}
                      </h3>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {subsection.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <EmbedDashboard id={import.meta.env.VITE_SALES_DASHBOARD_ID} />
    </>
  );
};

export default Home;
