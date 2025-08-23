import React, { useState } from "react";
import Title from "./Title";
import { teamData } from "../assets/assets";
import { motion } from "framer-motion";

const Teams = () => {
  const [activeIndex, setActiveIndex] = useState(0); // track which card is in center

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-800 dark:text-white"
    >
      <Title
        title="Meet the team"
        desc="A passionate team of digital experts dedicated to your brand's success."
      />

      {/* Carousel */}
      <div className="flex gap-6 justify-center items-center overflow-hidden w-full max-w-6xl">
        {teamData.map((member, index) => {
          const isActive = index === activeIndex;
          const isSide = Math.abs(index - activeIndex) === 1;

          return (
            <motion.div
              key={member.name}
              onClick={() => setActiveIndex(index)}
              animate={{
                scale: isActive ? 1 : 0.85,
                opacity: isActive ? 1 : 0.5,
                filter: isActive ? "blur(0px)" : "blur(4px)",
              }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-64 rounded-2xl shadow-lg cursor-pointer overflow-hidden flex flex-col items-center bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg border border-white/30"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="text-center py-2 font-semibold text-sm">
                {member.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Teams;



