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
  const [dashboardURL, setDashboardURL] = useState();
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
          <Button onClick={() => setShow(true)}>Parse SSO Embed URL</Button>
          <Button onClick={handleClose}>Embed</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <DashboardContainer>
        <Dashboard>
          {url === "" ? (
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
            <iframe title="Looker Dashboard" src={""} />
          )}
        </Dashboard>
      </DashboardContainer>
    </>
  );
};

const RichTextRender = ({ text }) => {
  if (decodeURIComponent(text).split("?").length > 2) {
    return (
      <div className="h-2/3">
        <span>URL: {decodeURIComponent(text).split("?")[0]}</span>
        <span>
          Embed URL Parameters: {decodeURIComponent(text).split("?")[1]}
        </span>
        <span>
          SSO Embed URL Parameters: {decodeURIComponent(text).split("?")[2]}
        </span>
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
