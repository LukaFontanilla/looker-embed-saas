import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, authed } = useAuth();

  const handleLogin = () => {
    return login().then(() => {
      navigate("/");
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="m-6">Access Your Data</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
