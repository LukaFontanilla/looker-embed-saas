/**
 * Global State for the Report Customizer Setting
 * Includes a theme object for customizing the styling of Looker Embed content
 * Includes a filter object for filtering the Looker content from outside the iFrame
 */

import { useState, createContext } from "react";

export const ReportConfigContext = createContext();
