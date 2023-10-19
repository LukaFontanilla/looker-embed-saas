import { useNavigate } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";
import useAuth from "../hooks/useAuth";
const LoginAnimation = lazy(() => import("./LoginAnimation"));
const LoginAnimationLight = lazy(() => import("./LoginAnimationLight"));
import { DarkModeContext } from "../contexts/DarkModeContext";

const Login = () => {
  const { dark } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { login, authed } = useAuth();

  const handleLogin = () => {
    return login().then(() => {
      navigate("/");
    });
  };

  return (
    <div className="w-full h-full flex flex-row justify-start items-center">
      <div className="z-10 w-full md:w-3/5 lg:w-2/5 xl:w-2/6 h-full flex flex-column justify-start items-center bg-zinc-50 dark:bg-black p-2 shadow-md">
        <h1 className="m-6 z-1 dark:text-zinc-50 text-zinc-900">
          Access Your Data
        </h1>
        <button
          onClick={handleLogin}
          className="z-1 shadow hover:drop-shadow-lg"
        >
          Login
        </button>
      </div>
      <div
        className={`absolute ${!dark && "right-0"} ${!dark && "bottom-10"} ${
          dark ? "w-full" : "w-[70rem]"
        } ${dark ? "h-full" : "h-[50rem]"} -z-1`}
      >
        <Suspense fallback={<></>}>
          {dark ? <LoginAnimation /> : <LoginAnimationLight />}
        </Suspense>
      </div>
    </div>
  );
};

export default Login;
