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
import EmbedDashboardSimple from "../EmbedDashboardSimple";
import { DashboardContext } from "../../contexts/DashboardContext";

const url = "";

const SSOEmbedComponent = () => {
  const { id, setID, useEmbedSdk } = useContext(DashboardContext);
  const [dashboardURL, setDashboardURL] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  // useEffect(() => {
  //   setID("");
  // }, []);

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

  if (useEmbedSdk) {
    return (
      <>
        <EmbedDashboardSimple id={id} />
      </>
    );
  }

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
              <h3 className="text-lg dark:text-zinc-50 text-zinc-900">Add Looker SSO Embed URL to Embed</h3>
            </div>
          ) : (
            // It's as simple as taking the generated SSO Embed URL OR Private Embed URL and placing that in an iFrame
            <iframe title="Looker Dashboard" src={dashboardURL} />
          )}
        </Dashboard>
      </DashboardContainer>
    </>
  );
};

/**
 * @param {string} text the sso embed url text string
 */
const RichTextRender = ({ text }) => {
  const fieldDisplay = (field) => {
    try {
      const parsedField = JSON.parse(field);
      console.log(parsedField, parsedField instanceof Array);
      if (parsedField instanceof Array) {
        return (
          <ul className="list-disc pl-8">
            {parsedField.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        );
      } else if (parsedField instanceof Object) {
        return (
          <>
            {Object.entries(parsedField).map(([key, value], index) => (
              <p key={index} className="pl-4">
                <span className="bold">{key}: </span>
                {value}
              </p>
            ))}
          </>
        );
      } else {
        return <span>{field}</span>;
      }
    } catch (e) {
      return <span>{field}</span>;
    }
  };
  if (decodeURIComponent(text).split("?").length > 2) {
    return (
      <div
        className="h-[60vh] overflow-y-scroll break-words flex flex-col space-between bg-white justify-start items-start dark:bg-black shadow-lg mt-2 pl-2 pr-2 pb-4 pt-4 rounded-xl hover:brightness-125 hover:drop-shadow-lg"
        id="svgBackground1"
      >
        <div className="pt-2 mb-2 w-full break-words">
          Embed URL Path:{" "}
          <span className="break-words w-full">
            {decodeURIComponent(text).split("?")[0].split("login/embed/")[1]}
          </span>
        </div>
        <div className="break-words w-full">
          <span className="text-lg bold">Embed URL Parameters: </span>
          <div className="flex flex-col pl-4">
            {decodeURIComponent(text)
              .split("?")[1]
              .split("&")
              .map((param, index) => (
                <p key={index}>
                  <span className="text-md bold">{param.split("=")[0]}: </span>
                  <span className="text-md bold">{param.split("=")[1]}</span>
                </p>
              ))}
          </div>
        </div>
        <div className="text-lg bold mt-4">SSO Embed URL Parameters:</div>
        {decodeURIComponent(text)
          .split("?")[2]
          .split("&")
          .map((param) => {
            const data = param.split("=");
            return (
              <div className="mt-2 w-full break-words">
                {data[0]} : {fieldDisplay(data[1])}
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
