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
        loginWithGoogle().then((user) => {
          console.log("User Info from Firebase: ", user);
          setUser(user);
          setAuthed(true);
          res();
        });
      });
    },
    logout() {
      return new Promise((res) => {
        logout();
        setAuthed(false);
        // authed.current = false;
        res();
      });
    },
    authed,
    user,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
