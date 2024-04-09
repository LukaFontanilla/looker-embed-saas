// Embedded dashboards let you build an interactive and highly curated data experience within your application
// This file is used to embed a dashboard using LookerEmbedSDK with EmbedBuilder to initialize your connection and help create the iframe element

import React, { useCallback, useEffect, useContext } from "react";
import styled, { keyframes } from "styled-components";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Fab from "@mui/material/Fab";
import { EmbedCheckAuth } from "../../helpers/EmbedCheckAuth";
import { handleDownload } from "../../helpers/DownloadReport";
import { DashboardContext } from "../../contexts/DashboardContext";
import { NavContext } from "../../contexts/NavContext";
import { PermissionsContext } from "../../contexts/PermissionsContext";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import { SunspotLoaderComponent } from "../Accessories/CustomLoader";
import EmbedMethodHighlight from "../EmbedMethodHighlight";

/**
 * @param {string} id of the dashboard to embed
 */
const EmbedDashboardMarketing = ({ id }) => {
  const { dashboard, setDashboard } = useContext(DashboardContext);
  const { active, setActive } = useContext(NavContext);
  const [loadingDownload, setLoadingDownload] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { company, country, locale, permissions } =
    useContext(PermissionsContext);
  const { dark } = useContext(DarkModeContext);

  // set the global dashboard state
  // this is a common pattern to acquire a reference to the dashboard object (ie. Looker iFrame)
  // use this in the .then() method of the embed sdk
  // the dashboard object can be used for many things, like re-running the dashboard from outside the iFrame
  const handleDashboardLoaded = (dashboard) => {
    setDashboard(dashboard);
  };

  const animateDashboardLoad = () => {
    setLoading(false);
    document
      .getElementById("marketing-dashboard")
      .style.setProperty("opacity", 1);
    document
      .getElementById("marketing-dashboard")
      .style.setProperty("z-index", 1);
  };

  useEffect(() => {
    setLoading(true);
    document
      .getElementById("marketing-dashboard")
      .style.setProperty("opacity", 0.2);
  }, [dark]);

  const makeDashboard = useCallback(
    async (el) => {
      if (!el) {
        return;
      }
      el.innerHTML = "";

      // check if an embed session exists, if so private embed to reduce round trips
      // to the server. Else call auth endpoint and provide SSO Embed URL
      const embed = await EmbedCheckAuth(
        "dashboard",
        import.meta.env.VITE_MARKETING_DASHBOARD_ID,
        import.meta.env.VITE_LOOKER_HOST + "/embed/dashboards/",
        active,
        dark,
      );
      // adds the iframe to the DOM as a child of a specific element
      // const embed = LookerEmbedSDK.createDashboardWithId(id)
      embed
        .appendTo(el)
        .withTheme(
          dark
            ? import.meta.env.VITE_EMBED_THEME_DARK
            : import.meta.env.VITE_EMBED_THEME,
        )
        // the .on() method allows us to listen for and respond to events inside the iframe. See here for a list of events: https://docs.looker.com/reference/embedding/embed-javascript-events
        .on("dashboard:run:start", (e) => {
          console.log("Dashboard Queries Started");
        })
        .on("drillmenu:click", (e) => {
          console.log("Drill Menu Clicked: ", e);
        })
        .on("dashboard:run:complete", animateDashboardLoad)
        .on("dashboard:loaded", (e) => {
          console.log("dashboard:loaded", e);
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

    // only rebuild this function definition when the permissions or dark state change
    // permissions requests a new sso embed url
    // dark updates the dashboard with a new named theme
    [permissions, dark],
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
          zIndex: loading ? 10 : -1,
        }}
      >
        <SunspotLoaderComponent />
      </div>
      {/* {active !== 'Home' && active !== 'Sales' && 
      <div className="flex flex-col items-center p-10">
        <div className="px-13 pt-6 flex flex-row justify-between" style={{width:'80vw'}}>
          <span className="text-4xl subpixel-antialiased font-semibold ">{dashConfig[active]['title']}</span>
          <div className="flex flex-row justify-between w-32">
          {active !== 'Explore' &&
          <>
          <Fab color="primary" aria-label="add" className="hover:cursor" onClick={() => dashboard.openScheduleDialog()}>
            <EmailOutlinedIcon />
          </Fab>
          <Fab color="primary" aria-label="add" className="hover:cursor" onClick={() => handleDownload(id, setLoadingDownload)}>
            <FileDownloadOutlinedIcon />
          </Fab>
          </>
          }
          </div>
        </div>
      </div>
      } */}
      <DashboardContainer id="marketing-dashboard" active={active}>
        <EmbedMethodHighlight />
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
  position: relative;
  opacity: 0.1;
  z-index: -1;
  animation: fadeIn ease-in ease-out 3s;
  flex-direction: column;
  align-items: center;
  align-content: center;
`;

export default EmbedDashboardMarketing;
