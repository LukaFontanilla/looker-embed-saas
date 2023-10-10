// Embedded dashboards let you build an interactive and highly curated data experience within your application
// This file is used to embed a dashboard using LookerEmbedSDK with EmbedBuilder to initialize your connection and help create the iframe element


import React, { useCallback, useEffect, useContext } from "react";
import styled from "styled-components";
import Skeleton from '@mui/material/Skeleton';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Fab from '@mui/material/Fab';
import { EmbedCheckAuth } from '../helpers/EmbedCheckAuth'
import { handleDownload } from "../helpers/DownloadReport";
import {DashboardContext}  from '../contexts/DashboardContext'
import { NavContext } from "../contexts/NavContext";
import { PermissionsContext } from "../contexts/PermissionsContext";
import { DarkModeContext } from "../contexts/DarkModeContext";

const EmbedDashboard = ({id}) => {
  const {dashboard, setDashboard, loading, setLoading} = useContext(DashboardContext)
  const {active, setActive} = useContext(NavContext)
  const [loadingDownload, setLoadingDownload] = React.useState(false);
  const [iframeLoading, setIframeLoading] = React.useState(true);
  const { company, country, locale, permissions } = useContext(PermissionsContext)
  const { dark } = useContext(DarkModeContext)

  const handleDashboardLoaded = (dashboard) => {
    setDashboard(dashboard)
  }
  
  /*
   Step 1 Initialization of the EmbedSDK happens when the user first access the application
   See App.js for reference
  */
   const createExplore = useCallback(async(el) => {
    if (!el) {
      return;
    }
    el.innerHTML = "";
    /*
      Step 2 Create your Explore through a simple set of chained methods
    */
    const embed = await EmbedCheckAuth('explore',import.meta.env.VITE_EXPLORE_ID,import.meta.env.VITE_LOOKER_HOST + '/embed/explore/' + import.meta.env.VITE_EXPLORE_ID,dark, active)

    // LookerEmbedSDK.createExploreWithId(id)
      // adds the iframe to the DOM as a child of a specific element
    embed.appendTo(el)
      .withTheme('Embed_Workshop')
      // .withParams({_theme: params})
      .on("explore:ready",(e) => {
        setLoading(false)
      })
      // this line performs the call to the auth service to get the iframe's src='' url, places it in the iframe and the client performs the request to Looker
      .build()
      // this establishes event communication between the iframe and parent page
      .connect()
      .then()
      // catch various errors which can occur in the process (note: does not catch 404 on content)
      .catch((error) => {
        console.error("An unexpected error occurred", error);
      });
  }, [permissions]);


  const makeDashboard = useCallback(async (el) => {
    if (!el) {
      return;
    }
    el.innerHTML = "";
    console.log("Dashboards: ", id, active,import.meta.env.VITE_LOOKER_HOST + '/embed/dashboards/')
    const embed = await EmbedCheckAuth
    (
      'dashboard',
      id,
      import.meta.env.VITE_LOOKER_HOST + '/embed/dashboards/',
      active,
      dark
    )
      // adds the iframe to the DOM as a child of a specific element
    // const embed = LookerEmbedSDK.createDashboardWithId(id)
    embed.appendTo(el)
      .withTheme('Embed_Workshop')
      // the .on() method allows us to listen for and respond to events inside the iframe. See here for a list of events: https://docs.looker.com/reference/embedding/embed-javascript-events
      .on("dashboard:run:start", (e) => {
        console.log("Dashboard Queries Started")
      })
      .on("drillmenu:click", (e) => {
        console.log("Drill Menu Clicked: ", e)
      })
      .on("dashboard:run:complete", (e) => {
        setLoading(false)
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
  }, [permissions,id]);

  return (
    <>
    {active !== 'Home' && active !== 'Sales' && <div style={{overflow:'hidden',display:'flex', position:'absolute', flexDirection:'column', justifyContent:'space-between', width:'92vw',height:'90vh',zIndex:loading || loadingDownload ? 1 : -1}}>
          <Skeleton animation="pulse" variant="rounded" width={"100%"} height={"100%"} />
    </div>}
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
      <DashboardContainer active={active}>
          <Dashboard ref={active === 'Explore' ? createExplore : makeDashboard} loading={loading} />
      </DashboardContainer>
    </>
  );
};

// A little bit of style here for heights and widths.
const Dashboard = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: ${props => props.loading ? 0 : 1};
  ${'' /* border-radius:1rem; */}
  ${'' /* box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1); */}
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
  ${'' /* justify-content: center; */}
  align-items: center;
  align-content: center;
  ${'' /* padding: 2.5rem; */}
  position: ${props => props.active !== 'Home' && props.active !== 'Sales' && props.active !== 'New' ? null : 'absolute'};
  left:${props => props.active !== 'Home' && props.active !== 'Sales' && props.active !== 'New' ? null : '-9999px'};
`;

export default EmbedDashboard;