import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Heading = ({ theme }) => {
  const words = ["TourGuide", "Trip Planner", "Shield", "SafeKeeper"];
  const [index, setIndex] = useState(0);

  // change word every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  // theme-based colors
  const safeColor = theme === "dark" ? "text-white" : "text-black";
  const yourColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[50vh] text-center"
      style={{
        width: "100%",
        padding: "0 10vw", // 10% padding on each side
      }}
    >
      <div 
        style={{
          width: "20vw", // Always 20% of viewport width
          minWidth: "200px", // Minimum width for very small screens
        }}
      >
        {/* Line 1: RoamSafe */}
        <h1 
          className="font-bold mb-4"
          style={{
            // Font size scales with the container width (20vw)
            // Using 4vw makes it 20% of the 20vw container = good proportion
            fontSize: "4vw",
            lineHeight: "1.1",
            minFontSize: "24px", // Fallback for very small screens
          }}
        >
          <span className="text-blue-500">Roam</span>
          <span className={`ml-1 ${safeColor}`}>Safe</span>
        </h1>

        {/* Line 2: Your ... */}
        <h2 
          className="font-semibold flex flex-wrap justify-center gap-2"
          style={{
            // Font size proportional to main heading
            fontSize: "2.4vw", // About 60% of main heading size
            lineHeight: "1.2",
            minFontSize: "16px", // Fallback for very small screens
          }}
        >
          <span className={yourColor}>Your</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={index} // trigger re-render when word changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="text-blue-500"
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </h2>
      </div>
    </div>
  );
};

export default Heading;