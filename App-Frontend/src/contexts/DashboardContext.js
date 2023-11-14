/**
 * Global State for Dashboard, including:
 * dashboard (the Looker iFrame object)
 * setDashboard (function to set the state of the dashboard object)
 */

import { useState, createContext } from "react";

export const DashboardContext = createContext();
