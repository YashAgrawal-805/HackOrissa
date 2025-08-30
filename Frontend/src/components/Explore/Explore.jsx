import React from "react";
import VantaNetBackground from "../bg";     // path correct if bg.jsx is in components
import ExpNavbar from "../Explore/expNavbar"; // navbar
import Footer from "../Footer";             // optional: if you have a footer
import HeroAnimation from "../Explore/HeroAnimation";
import CardsParallaxAnimation from "../Explore/parallex";
import Heading from "../Explore/Heading";
const Explore = ({ theme, setTheme }) => {
  // pick grid color depending on theme
  const gridColor =
    theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px", // bigger grid squares
      }}
    >
      {/* Background + Navbar */}
      {/* <VantaNetBackground theme={theme} /> */}

      <ExpNavbar theme={theme} setTheme={setTheme} />
      <HeroAnimation theme={theme} />
      <Heading theme={theme}/>
      <CardsParallaxAnimation theme={theme} />
       <Footer /> 
    </div>
  );
};

export default Explore;
