import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/auth');
  };

  return (
    <div
      id="hero"
      className="flex flex-col items-center gap-6 py-20 px-4 sm:px-12 lg:px-24 xl:px-40 text-center w-full overflow-hidden text-gray-700 dark:text-white"
    >
      {/* badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 border border-gray-300 p-1.5 pr-4 rounded-full"
      >
        <img src={assets.group_profile} alt="" className="w-20" />
        <p className="text-xs font-medium">Customer Friendly</p>
      </motion.div>

      {/* heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl md:text-6xl xl:text-[84px] font-medium xl:leading-[95px] max-w-5xl mt-6"
      >
        Travel Smart,{' '}
        <span className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent">
          Stay Connected
        </span>
        , Explore More.
      </motion.h1>

      {/* sub-text */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        viewport={{ once: true }}
        className="text-sm sm:text-lg font-medium text-gray-500 dark:text-white/75 max-w-[80%] sm:max-w-lg pb-3 mt-4"
      >
        Creating meaningful connections and turning big ideas into interactive
        digital experiences.
      </motion.p>

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
        {/* Explore button */}
        <motion.button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-shadow shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95, rotate: -2 }}
          viewport={{ once: true }}
        >
          Explore
        </motion.button>

        {/* Sign-up button - Updated with onClick handler */}
        <motion.button
          onClick={handleSignupClick}
          className="bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-xl font-semibold transition-shadow shadow-lg cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95, rotate: -2 }}
          viewport={{ once: true }}
        >
          Sign Up
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;