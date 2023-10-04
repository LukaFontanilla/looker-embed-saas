// Embedded Explore Pages allow you to expose your modeled data to power users and allow users to create and save content in a highly curated experience within your application
// This file is used to embed an explore using LookerEmbedSDK with EmbedBuilder to initialize your connection and help create the iframe element

import React, { useCallback } from "react";
import styled from "styled-components";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import Skeleton from '@mui/material/Skeleton';

/**
 * First initialized the embed sdk using the endpoint in /backend/routes/api.js
 * Gets explore with ID, can be found in the url by viewing the explore via your looker instance   */

const EmbedExtension = ({id}) => {
  const [loading, setLoading] = React.useState(true);
  const params = 
  // encodeURIComponent(
  JSON.stringify({
    show_explore_header: false,
    show_explore_title: false,
    // background_color: "black",
    // background_color: '#f6e7f2',
    base_font_size: '12px'
  })
  // )
  /*
   Step 1 Initialization of the EmbedSDK happens when the user first access the application
   See App.js for reference
  */
  const createExtension = useCallback((el) => {
    if (!el) {
      return;
    }
    el.innerHTML = "";
    /*
      Step 2 Create your Explore through a simple set of chained methods
    */
    LookerEmbedSDK.createExtensionWithId('demo_extensions::explore_match')
      // adds the iframe to the DOM as a child of a specific element
      .appendTo(el)
    //   .withParams({_theme: params})
    //   .on("explore:run:complete",(e) => setLoading(false))
      // this line performs the call to the auth service to get the iframe's src='' url, places it in the iframe and the client performs the request to Looker
      .build()
      // this establishes event communication between the iframe and parent page
      .connect()
      .then(() => setLoading(false))
      // catch various errors which can occur in the process (note: does not catch 404 on content)
      .catch((error) => {
        console.error("An unexpected error occurred", error);
      });
  }, [id]);
  return (
    <>
      <div
        // className="stuff"
        style={{ width: "100%", height: "100%" }}
      >
        {/* <PageTitle text={"Embedded Explore"} /> */}
        {/* <LoadingSpinner loading={loading} /> */}
        {/* Step 0 we have a simple container, which performs a callback to our createExplore function */}
        <ExtensionContainer>
        <div style={{overflow:'hidden', borderRadius: '1rem',display:'flex', position:'absolute', flexDirection:'column', justifyContent:'space-between', width:'80vw',height:'80vh',zIndex:loading ? 1 : -1}}>
          <Skeleton animation="pulse" variant="rounded" width={"100%"} height={"100%"} />
          {/* <Skeleton variant="rounded" width={"100%"} height={"30%"} />
          <Skeleton variant="rounded" width={"100%"} height={"30%"} /> */}
        </div>
          {/* <div style={{position:'fixed',height:'auto',width:'80vw',zIndex:'0'}}>
          <svg width="100%" height="90vh">
            <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#000"></circle>
            </pattern>
            <rect  id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
          </div> */}
          <Extension ref={createExtension}/>
        </ExtensionContainer>
      </div>
    </>
  );
};

const Extension = styled.div`
  z-index: 1;
  width: 80vw;
  height: 80vh;
  border-radius: 10px;
  overflow: hidden;
  z-index: ${props => props.loading ? 0 : 1};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const ExtensionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding: 3rem;
  width: 100%;
  height: 90vh;
  position: relative;
`;

export default EmbedExtension;