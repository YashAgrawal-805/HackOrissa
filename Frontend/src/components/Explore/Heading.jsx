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
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      {/* Line 1: RoamSafe */}
      <h1 className="text-5xl font-bold mb-4">
        <span className="text-blue-500">Roam</span>
        <span className={`ml-1 ${safeColor}`}>Safe</span>
      </h1>

      {/* Line 2: Your ... */}
      <h2 className="text-2xl font-semibold flex gap-2">
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
  );
};

export default Heading;
