import { useNavigate } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";
import useAuth from "../hooks/useAuth";
const LoginAnimation = lazy(() => import("./Accessories/LoginAnimation"));
const LoginAnimationLight = lazy(() =>
  import("./Accessories/LoginAnimationLight"),
);
import { DarkModeContext } from "../contexts/DarkModeContext";
import GoogleIcon from "@mui/icons-material/Google";

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
      <div className="z-10 w-full md:w-2/6 h-full flex flex-col justify-center items-center bg-zinc-50 dark:bg-black p-2 shadow-lg dark:shadow-[#d19]">
        <span className="text-3xl font-semibold m-6 z-1 dark:text-zinc-50 text-zinc-900">
          Google Cloud Next Demo Portal
        </span>
        <button
          onClick={handleLogin}
          className={`z-1 shadow ${
            dark ? "hover:drop-shadow-xl" : "hover:drop-shadow-lg"
          } bg-transparent`}
        >
          <span className="dark:text-zinc-50 text-zinc-900">
            <GoogleIcon className="pr-2" />
            Login
          </span>
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
