import React, { useCallback, useEffect, useContext, useState } from "react";
import styled from "styled-components";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const url = "";

const SSOEmbedComponent = () => {
  const [dashboardURL, setDashboardURL] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShow(false);
    setDashboardURL("");
  };

  const handleEmbedClick = () => {
    setOpen(false);
    setShow(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter Either an SSO Embed URL or a Private Embed URL
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Embed URL"
            onChange={(e) => setDashboardURL(e.target.value)}
            value={dashboardURL}
            className="opacity-100"
            // type="email"
            fullWidth
            variant="standard"
          />
          {show && dashboardURL !== "" ? (
            <RichTextRender text={dashboardURL} />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <button onClick={() => setShow(true)}>Parse SSO Embed URL</button>
          <button onClick={handleEmbedClick}>Embed</button>
          <button onClick={handleClose}>Cancel</button>
        </DialogActions>
      </Dialog>
      <DashboardContainer>
        <Dashboard>
          {dashboardURL === "" || open ? (
            <div className="flex w-full h-full flex-col justify-center align-middle items-center cursor">
              <span
                style={{
                  color: "#d18",
                  backgroundColor: "transparent",
                  marginBottom: "2rem",
                }}
                aria-label="add"
                onClick={handleClickOpen}
              >
                <AddOutlinedIcon fontSize="large" />
              </span>
              <h3 className="text-lg">Add Looker Dashboard ID to Embed</h3>
            </div>
          ) : (
            <iframe title="Looker Dashboard" src={dashboardURL} />
          )}
        </Dashboard>
      </DashboardContainer>
    </>
  );
};

const RichTextRender = ({ text }) => {
  if (decodeURIComponent(text).split("?").length > 2) {
    return (
      <div
        className="h-[60vh] flex flex-col space-between mt-4 bg-white justify-center items-center dark:bg-black shadow-lg p-2 rounded-xl h-40 hover:brightness-125 hover:drop-shadow-lg mb-2"
        id="svgBackground1"
      >
        <div className="mt-2">
          URL: {decodeURIComponent(text).split("?")[0]}
        </div>
        <div>
          Embed URL Parameters: {decodeURIComponent(text).split("?")[1]}
        </div>
        <div className="text-lg bold mt-4">SSO Embed URL Parameters:</div>
        {decodeURIComponent(text)
          .split("?")[2]
          .split("&")
          .map((param) => {
            const data = param.split("=");
            return (
              <div className="mt-2">
                {data[0]} : {data[1]}
              </div>
            );
          })}
      </div>
    );
  }
};

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
