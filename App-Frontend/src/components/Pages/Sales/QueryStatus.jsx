import React from "react";
import { Alert } from "@mui/material";

/**
 * @param {string} status query status
 */
const QueryStatus = ({ status }) => (
  <div className="transition-opacity ease-in duration-700 opacity-100">
    {status !== "fetchedFromDB" ? (
      <Alert severity="info">{status}</Alert>
    ) : (
      <Alert severity="success">{status}</Alert>
    )}
  </div>
);

export default QueryStatus;
