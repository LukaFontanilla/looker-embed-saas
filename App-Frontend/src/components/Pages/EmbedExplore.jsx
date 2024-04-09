// Embedded Explore Pages allow you to expose your modeled data to power users and allow users to create and save content in a highly curated experience within your application
// This file is used to embed an explore using LookerEmbedSDK with EmbedBuilder to initialize your connection and help create the iframe element

import React, { useCallback, useContext, useEffect } from "react";
import styled from "styled-components";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import { SunspotLoaderComponent } from "../Accessories/CustomLoader";
import { LLMConfigContext } from "../../contexts/LLMConfigContext"
import EmbedMethodHighlight from "../EmbedMethodHighlight";

/**
 * First initialized the embed sdk using the endpoint in /backend/routes/api.js
 * Gets explore with ID, can be found in the url by viewing the explore via your looker instance  */

/**
 * @param {string} id id the explore to embed. Usually follows this naming convention model_name/explore_name
 */

const EmbedExplore = ({ id }) => {
  const [loading, setLoading] = React.useState(true);
  const { dark } = useContext(DarkModeContext);
  const { exploreUrl, submitNlq, setSubmitNlq } = useContext(LLMConfigContext)


  useEffect(() => {
    if(loading) {
      document.getElementById("loader")
      .style.setProperty("z-index",1)
      document
      .getElementById("explore-container")
      .style.setProperty("z-index", -1);
      document
      .getElementById("explore-container")
      .style.setProperty("opacity", 0.2);
    }
  },[loading])

  const animateExploreLoad = () => {
    setLoading(false);
    document
      .getElementById("loader")
      .style.setProperty("z-index",-1);
    document
      .getElementById("explore-container")
      .style.setProperty("opacity", 1);
    document
      .getElementById("explore-container")
      .style.setProperty("z-index", 10);
  };

  useEffect(() => {
    setLoading(true);
    // document
    //   .getElementById("loader")
    //   .style.setProperty("z-index",1);
    document
      .getElementById("explore-container")
      .style.setProperty("opacity", 0.2);
  }, [dark]);

  // )
  /*
   Step 1 Initialization of the EmbedSDK happens when the user first access the application
   See App.js for reference
  */

   const paramsObj = {
      embed_domain: import.meta.env.VITE_EMBED_HOST,
      sdk: '2',
      // _theme: JSON.stringify({
      //   key_color: '#174ea6',
      //   background_color: '#f4f6fa',
      // }),
  }

  const createExplore = useCallback(
    (el) => {
      if (!el) {
        return;
      }
      el.innerHTML = "";
      /*
      Step 2 Create your Explore through a simple set of chained methods
    */
      setLoading(true)
      const urlParams = { ...paramsObj }

      exploreUrl && exploreUrl
          .split('&')
          .map((param) => (urlParams[param.split('=')[0]] = param.split('=')[1]))

      LookerEmbedSDK.createExploreWithUrl(
        `${import.meta.env.VITE_LOOKER_HOST}/embed/explore/${import.meta.env.VITE_EXPLORE_ID}?embed_domain=${import.meta.env.VITE_EMBED_HOST}&sdk=2&theme=${dark ? import.meta.env.VITE_EMBED_THEME_DARK : import.meta.env.VITE_EMBED_THEME}&${exploreUrl}`
      )
      // .createExploreWithId(import.meta.env.VITE_EXPLORE_ID)
        // adds the iframe to the DOM as a child of a specific element
        .appendTo(el)
        .on("explore:ready", () => {
          if(exploreUrl === undefined) {
            // print(exploreUrl)
            animateExploreLoad()
          } 
        })
        .on("explore:run:complete", () => {
          if(exploreUrl !== undefined) {
            // print(exploreUrl)
            animateExploreLoad()
          } 
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
    },
    [dark,exploreUrl],
  );
  return (
    <>
      <div
        id="loader"
        style={{
          overflow: "hidden",
          display: "flex",
          position: "absolute",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          animation: "fadeIn ease-in ease-out 3s",
          zIndex: loading ? 1 : -1,
        }}
      >
        <SunspotLoaderComponent />
      </div>
      <ExploreContainer id="explore-container" className="bg-white dark:bg-zinc-900">
        <EmbedMethodHighlight />
        <Explore ref={createExplore}></Explore>
      </ExploreContainer>
    </>
  );
};

const Explore = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const ExploreContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  z-index: -1;
  flex-direction: column;
  align-items: center;
  align-content: center;
  opacity: 0.1;
  animation: fadeIn ease-in ease-out 3s;
`;

export default EmbedExplore;
