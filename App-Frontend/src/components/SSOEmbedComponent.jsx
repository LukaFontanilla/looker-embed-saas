import React, { useCallback, useEffect, useContext } from "react";
import styled from "styled-components";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Fab from '@mui/material/Fab';

const SSOEmbedComponent = ({url}) => {

    return (
        <DashboardContainer>
            <Dashboard>
                {url === '' 
                  ? 
                    <div className="flex w-full h-full flex-col justify-center align-middle items-center">
                    <span style={{color:'#d18',backgroundColor:'transparent',marginBottom:'2rem'}} aria-label="add">
                        <AddOutlinedIcon fontSize="large" />
                    </span>
                      <h3 className='text-lg'>
                        Add Looker Dashboard ID to Embed
                      </h3>
                    </div>
                  :
                    <iframe
                        title="Looker Dashboard"
                        src={url}
                    />
                }
            </Dashboard>
        </DashboardContainer>
    )
}

// A little bit of style here for heights and widths.
const Dashboard = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
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
`;

export default SSOEmbedComponent;