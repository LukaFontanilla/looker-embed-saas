import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import LeftNav from "./components/Layout/LeftNav";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { NavContext } from "./contexts/NavContext";
import { DashboardContext } from "./contexts/DashboardContext";
import { PermissionsContext } from "./contexts/PermissionsContext";
import { ReportConfigContext } from "./contexts/ReportConfig";
import TopBanner from "./components/Layout/TopBanner";
import Footer from "./components/Layout/Footer";
const Home = lazy(() => import("./components/Pages/Home/Home"));
const Login = lazy(() => import("./components/Login"));
import useAuth from "./hooks/useAuth";
import { sdk } from "./helpers/CorsSessionHelper";
import { initDB } from "./helpers/db";
import { initializeDashboard } from "./helpers/staticAssets";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
const SSOEmbedComponent = lazy(() =>
  import("./components/Pages/SSOEmbedComponent"),
);
const CustomSalesDashboard = lazy(() =>
  import("./components/Pages/Sales/CustomSalesDashboard"),
);
const EmbedDashboardFinance = lazy(() =>
  import("./components/Pages/EmbedDashboardFinance"),
);
const EmbedDashboardMarketing = lazy(() =>
  import("./components/Pages/EmbedDashboardMarketing"),
);
const EmbedExplore = lazy(() => import("./components/Pages/EmbedExplore"));
import AnimationLayout from "./components/Layout/PageTransition";

const RequireAuth = ({ children }) => {
  const { authed } = useAuth();

  return authed === true ? children : <Navigate to="/login" replace />;
};

const routes = {
  title: "Embed Examples",
  use_case_examples: [
    {
      url: "/insights/sales",
      text: "Sales Insights",
      component: <CustomSalesDashboard />,
      path: "CustomSalesDashboard.js",
      codeFileName: "CustomSalesDashboard",
    },
  ],
  looker_examples: [
    {
      url: "/",
      text: "Home",
      component: <Home />,
    },
    {
      url: "/insights/new",
      text: "Private Embed",
      component: <SSOEmbedComponent />,
      path: "SSOEmbedComponent.js",
      codeFileName: "SSOEmbedComponent",
    },
    {
      url: "/insights/marketing",
      text: "Marketing Insights",
      component: <EmbedDashboardMarketing />,
      path: "EmbedDashboard/EmbedDashboard.js",
      codeFileName: "EmbedDashboard",
    },
    {
      url: "/insights/finance",
      text: "Finance Insights",
      component: <EmbedDashboardFinance />,
      path: "EmbedDashboardWFilters/EmbedDashboardWFilters.js",
      codeFileName: "EmbedDashboardWFilters",
    },
    {
      url: "/self-service/explore",
      text: "Embedded Explore",
      component: <EmbedExplore />,
      path: "EmbedExplore/EmbedExplore.js",
      codeFileName: "EmbedExplore",
    },
  ],
};

/**
 * Looker function to initialize the LookerEmbedSDK
 * This does not yet call the auth endpoint, only initializes the SDK
 * Headers are included to show an example of passing user information to the backend
 * The auth URL, in this example is a relative path but if the backend and frontend aren't hosted
 * from the same host, this will need to be the full url to the server endpoint
 * @param {string} id the uid of the user from Google
 */
const EmbedSDKInit = (id) => {
  LookerEmbedSDK.init(import.meta.env.VITE_LOOKERSDK_EMBED_HOST, {
    // The location of the service which will privately create a signed URL
    url: `/api/auth`,
    headers: [
      // include some factor which your auth service can use to uniquely identify a user, so that a user specific url can be returned. This could be a token or ID
      { name: "usertoken", value: "advancedUser" },
      { name: "userId", value: id },
    ],
  });
};

function App() {
  const [active, setActive] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState();
  const [locale, setLocale] = useState();
  const [trafficSource, setTrafficSource] = useState("");
  const [userType, setUserType] = useState("basic");
  const [permissions, setPermissions] = useState([]);
  const [queryID, setQueryID] = useState("53185");
  const [id, setID] = useState(import.meta.env.VITE_SALES_DASHBOARD_ID);
  const [dashboardConfig, setDashboardConfig] = useState();
  const [useEmbedSdk, setUseEmbedSdk] = useState(false);
  const [dashboardFilters, setDashboardFilters] = useState();
  const { authed, user } = useAuth();
  const [dark, setDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
  const { pathname } = useLocation();

  useEffect(() => {
    if (authed && user) {
      // initialize indexdb
      initDB();

      console.log(user)

      // initialize embed sdk once the user exists and is authed
      EmbedSDKInit(JSON.stringify(user));
    }
  }, [authed, user]);

  useEffect(() => {
    // when locale and userType permissions change
    // make call to server to update the app user's permissions in Looker
    // and re-call sso embed url
    console.log(userType);
    if (locale) {
      fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: {
            userType: userType,
          },
          userAttributes: {
            locale: locale,
          },
        }),
      }).then(() => {
        setID(initializeDashboard(active));
        setPermissions([locale, userType]);
      });
    }
  }, [locale, userType]);

  useEffect(() => {
    // Effect for responding to changes in external filter values
    // This responds to a change in the traffic source state and posts the value into a filter object
    // that's passed to the Looker iFrame and filters the dashboard
    if (dashboard && trafficSource !== "") {
      dashboard.send("dashboard:filters:update", {
        filters: {
          "Traffic Source": trafficSource,
        },
      });

      dashboard.send("dashboard:run");
    }
  }, [trafficSource]);

  return (
    <>
      <NavContext.Provider value={{ active, setActive }}>
        <DarkModeContext.Provider value={{ dark, setDark }}>
          <DashboardContext.Provider
            value={{
              dashboard,
              setDashboard,
              loading,
              setLoading,
              id,
              setID,
              dashboardConfig,
              setDashboardConfig,
              useEmbedSdk,
              setUseEmbedSdk,
              dashboardFilters,
              setDashboardFilters,
            }}
          >
            <ReportConfigContext.Provider value={{ queryID, setQueryID }}>
              <PermissionsContext.Provider
                value={{
                  sdk,
                  locale,
                  setLocale,
                  trafficSource,
                  setTrafficSource,
                  userType,
                  setUserType,
                  show,
                  setShow,
                  permissions,
                }}
              >
                <div className={dark ? "dark" : "light"}>
                  <div className="flex flex-col h-screen w-screen bg-white dark:bg-black">
                    <TopBanner />
                    <div className="flex flex-1 overflow-hidden">
                      {authed ? <LeftNav /> : <></>}
                      <main
                        className={`flex-1 overflow-hidden ${
                          (active !== "Home" && active !== "Sales") ||
                          pathname === "/login"
                            ? "p-0"
                            : "p-4"
                        } bg-zinc-50 dark:bg-black ${
                          pathname === "/login" ? "h-full" : "h-full"
                        }`}
                        onClick={() => setShow(false)}
                      >
                        <div className="grid gap-1 h-full relative overflow-y-scroll">
                          <Routes>
                            <Route element={<AnimationLayout />}>
                              <Route
                                exact
                                path="/"
                                element={
                                  <RequireAuth>
                                    <Suspense fallback={<></>}>
                                      {
                                        [
                                          ...routes.looker_examples,
                                          ...routes.use_case_examples,
                                        ][0].component
                                      }
                                    </Suspense>
                                  </RequireAuth>
                                }
                              />

                              {[
                                ...routes.looker_examples,
                                ...routes.use_case_examples,
                              ]
                                .slice(
                                  1,
                                  [
                                    ...routes.looker_examples,
                                    ...routes.use_case_examples,
                                  ].length,
                                )
                                .map((e) => {
                                  return (
                                    <Route
                                      path={e.url}
                                      // default
                                      element={
                                        <RequireAuth>
                                          <Suspense fallback={<></>}>
                                            {e.component}
                                          </Suspense>
                                        </RequireAuth>
                                      }
                                      key={e.text}
                                    />
                                  );
                                })}
                              <Route path="/login" element={<Login />} />
                            </Route>
                          </Routes>
                        </div>
                      </main>
                    </div>
                    {authed ? <Footer /> : <></>}
                  </div>
                </div>
              </PermissionsContext.Provider>
            </ReportConfigContext.Provider>
          </DashboardContext.Provider>
        </DarkModeContext.Provider>
      </NavContext.Provider>
    </>
  );
}

export default App;
