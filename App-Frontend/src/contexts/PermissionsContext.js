/**
 * Global State for Looker User Permissions, including:
 * locale (what langauage is the Looker content localized to)
 * userType (does the user have premium user capabilities)
 */

import { useState, createContext } from "react";

export const PermissionsContext = createContext();
