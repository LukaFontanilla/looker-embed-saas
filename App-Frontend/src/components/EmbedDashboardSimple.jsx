import React, { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { DashboardContext } from "../contexts/DashboardContext";
import { NavContext } from "../contexts/NavContext";
import { DarkModeContext } from "../contexts/DarkModeContext";
import { SunspotLoaderComponent } from "./Accessories/CustomLoader";

/**
 * @param {number} id the id of the dashboard to embed
 */
const EmbedDashboardSimple = ({ id }) => {
  const {
    setDashboard,
    dashboardConfig,
    setDashboardConfig,
    setDashboardFilters,
  } = useContext(DashboardContext);
  const { active } = useContext(NavContext);
  const { dark } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);

  const animateDashboardLoad = (e) => {
    console.log(e);
    console.log("Loading");
    setLoading(false);
    document.getElementById("dashboard-simple").style.setProperty("opacity", 1);
    document.getElementById("dashboard-simple").style.setProperty("z-index", 1);
  };

  const handleReload = () => {
    setLoading(true);
    document
      .getElementById("dashboard-simple")
      .style.setProperty("opacity", 0.1);
    document
      .getElementById("dashboard-simple")
      .style.setProperty("z-index", -1);
  };

  const handleDashboardLoaded = (dashboard) => {
    setDashboard(dashboard);
  };

  const makeDashboard = useCallback(
    async (el) => {
      if (!el) {
        return;
      }
      el.innerHTML = "";

      handleReload();

      if (id === undefined) {
        return;
      }
      // adds the iframe to the DOM as a child of a specific element
      const embed = LookerEmbedSDK.createDashboardWithId(id);
      embed
        .appendTo(el)
        //   .withTheme("Embed_Workshop")
        .withParams({
          _theme: dashboardConfig,
        })
        // the .on() method allows us to listen for and respond to events inside the iframe. See here for a list of events: https://docs.looker.com/reference/embedding/embed-javascript-events
        .on("dashboard:run:start", (e) => {
          console.log("Dashboard Queries Started");
        })
        .on("drillmenu:click", (e) => {
          console.log("Drill Menu Clicked: ", e);
        })
        .on("dashboard:run:complete", animateDashboardLoad)
        .on("dashboard:loaded", (e) => {
          // console.log("dashboard:loaded", e);
          setDashboardFilters(e.dashboard.dashboard_filters);
        })

        // this line performs the call to the auth service to get the iframe's src='' url, places it in the iframe and the client performs the request to Looker
        .build()
        // this establishes event communication between the iframe and parent page
        .connect()
        .then(handleDashboardLoaded)
        // catch various errors which can occur in the process (note: does not catch 404 on content)
        .catch((error) => {
          console.log("An unexpected error occurred", error);
        });
    },
    [dashboardConfig, id],
  );

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          position: "absolute",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          zIndex: loading ? 1 : -1,
        }}
      >
        <SunspotLoaderComponent />
      </div>
      <DashboardContainer active={active} id="dashboard-simple">
        <Dashboard ref={makeDashboard} loading={loading} />
      </DashboardContainer>
    </>
  );
};

// A little bit of style here for heights and widths.
const Dashboard = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  opacity: 0.1;
  animation: fadeIn ease-in ease-out 3s;
  flex-direction: column;
  align-items: center;
  align-content: center;
`;

export default EmbedDashboardSimple;
