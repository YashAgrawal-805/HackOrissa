import React, { useState } from "react";
import "../components/auth/Styles.css";
import SignInForm from "../components/auth/Signin";
import SignUpForm from "../components/auth/SignUp";
import VantaNetBackground from "../utility/BgAuth";
import { useSelector } from "react-redux";

const AuthApp = ({ theme }) => {
  const [type, setType] = useState("signIn");
  const [splineLoaded, setSplineLoaded] = useState(false);
  const { lat, lng } = useSelector((state) => state.app.latLng);

  const handleOnClick = (text) => {
    console.log(lat, lng);
    if (text !== type) {
      setType(text);
    }
  };

  const handleSplineLoad = () => {
    console.log(lat, lng);
    setSplineLoaded(true);
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="Auth-App relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ✅ Background */}
      <VantaNetBackground theme={theme} />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* ✅ Centered Heading */}
        <h1
          className={`text-3xl font-bold px-4 py-2 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Login Page
        </h1>

        <div className={containerClass} id="container">
          <SignUpForm />
          <SignInForm />

          <div className="overlay-container">
            <div className="overlay">
              {/* Left side (Sign In) */}
              <div className="overlay-panel overlay-left">
                {/* Spline Background */}
                <iframe
                  src="https://my.spline.design/particles-8qMLygXj3y2uVSrhEWStQUmB/"
                  frameBorder="0"
                  className={`spline-bg ${splineLoaded ? 'loaded' : ''}`}
                  onLoad={handleSplineLoad}
                ></iframe>

                {/* Content */}
                <div className="overlay-content">
                  <h1>Welcome Back!</h1>
                  <p>
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    className="ghost"
                    id="signIn"
                    onClick={() => handleOnClick("signIn")}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Right side (Sign Up) */}
              <div className="overlay-panel overlay-right">
                {/* Spline Background */}
                <iframe
                  src="https://my.spline.design/particles-8qMLygXj3y2uVSrhEWStQUmB/"
                  frameBorder="0"
                  className={`spline-bg ${splineLoaded ? 'loaded' : ''}`}
                  onLoad={handleSplineLoad}
                ></iframe>

                {/* Content */}
                <div className="overlay-content">
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <button
                    className="ghost"
                    id="signUp"
                    onClick={() => handleOnClick("signUp")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthApp;