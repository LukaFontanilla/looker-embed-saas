/**
 * Global State for Looker User Permissions, including:
 * locale (what langauage is the Looker content localized to)
 * pdf (does the user have pdf export capabilities)
 */

import { useState, createContext } from "react";

export const PermissionsContext = createContext();
