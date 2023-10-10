// Embedded dashboards let you build an interactive and highly curated data experience within your application
// This file is used to embed a dashboard using LookerEmbedSDK with EmbedBuilder to initialize your connection and help create the iframe element

import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import { EmbedCheckAuth } from "../helpers/EmbedCheckAuth";
import { DashboardContext } from "../contexts/DashboardContext";
import { NavContext } from "../contexts/NavContext";
import { DarkModeContext } from "../contexts/DarkModeContext";

const EmbedDashboard = ({ id }) => {
  const { setDashboard, loading, setLoading } = useContext(DashboardContext);
  const { active } = useContext(NavContext);
  const { dark } = useContext(DarkModeContext);

  const handleDashboardLoaded = (dashboard) => {
    setDashboard(dashboard);
  };

  const makeDashboard = useCallback(async (el) => {
    if (!el) {
      return;
    }
    el.innerHTML = "";

    const embed = await EmbedCheckAuth(
      "dashboard",
      id,
      import.meta.env.VITE_LOOKER_HOST + "/embed/dashboards/",
      active,
      dark,
    );
    // adds the iframe to the DOM as a child of a specific element
    // const embed = LookerEmbedSDK.createDashboardWithId(id)
    embed
      .appendTo(el)
      .withTheme("Embed_Workshop")
      // the .on() method allows us to listen for and respond to events inside the iframe. See here for a list of events: https://docs.looker.com/reference/embedding/embed-javascript-events
      .on("dashboard:run:start", (e) => {
        console.log("Dashboard Queries Started");
      })
      .on("drillmenu:click", (e) => {
        console.log("Drill Menu Clicked: ", e);
      })
      .on("dashboard:run:complete", (e) => {
        setLoading(false);
      })
      .on("dashboard:loaded", (e) => {
        // console.log("dashboard:loaded", e);
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
  }, []);

  return (
    <>
      <DashboardContainer active={active}>
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
  z-index: ${(props) => (props.loading ? 0 : 1)};
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  position: absolute;
  left: -9999px;
`;

export default EmbedDashboard;
