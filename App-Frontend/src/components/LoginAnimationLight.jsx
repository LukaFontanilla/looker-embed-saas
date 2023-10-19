import Lottie from "lottie-react";
import React, { useContext } from "react";
import animationData from "../assets/login-light-data.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const LoginAnimationLight = () => {
  return (
    <div className="opacity-100 w-auto h-auto">
      <Lottie
        id="lottie"
        animationData={animationData}
        // loop={true}
        // autoplay={false}
        rendererSettings={defaultOptions.rendererSettings}
      />
    </div>
  );
};

export default LoginAnimationLight;
