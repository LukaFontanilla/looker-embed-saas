/**
 * A standard hook to handle authentication in the application
 * Here we are using firebase to handle authentication but this pattern can be
 * used with any authentication provider. We are returning variables that:
 * can login a user, logout a user, and describe whether the user exists and is authenticated.
 *
 * No call to Looker is made in this code. The server API will handle the core Looker logic for
 * authentication.
 */

import * as React from "react";
import { loginWithGoogle, logout } from "../helpers/firebase";

const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [user, setUser] = React.useState();
  // const authed = React.useRef(false);

  return {
    login() {
      return new Promise((res) => {
        // wait for promise to resolve (ie. user sign in with popup)
        // then set auth to true and redirect to private route
        loginWithGoogle().then(async (user) => {
          fetch("/api/check-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: user,
            }),
          }).then(() => {
            setUser(user);
            setAuthed(true);
            res();
          });
        });
      });
    },
    logout() {
      return new Promise((res) => {
        fetch("/api/logout-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => {
          logout();
          setAuthed(false);
          // authed.current = false;
          res();
        })
      });
    },
    authed,
    user,
  };
}

/**
 * @param {React.ReactNode} children
 */
export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
