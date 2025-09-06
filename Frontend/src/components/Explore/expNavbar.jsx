import React, { useState } from "react";
import assets from "../../assets/assets";
import ThemeToggleBtn from "../../Utilities/ThemeToggleBtn";
import ToggleBtn from "./expToggle"; // reusable toggle button
import { motion } from "framer-motion";

const ExpNavbar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // state for each toggle
  const [sosActive, setSosActive] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [notifActive, setNotifActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70"
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_dark : assets.logo}
        className="w-32 sm:w-40"
        alt="logo"
      />

      {/* Sidebar (mobile mode) */}
      <div
        className={`${
          !sidebarOpen
            ? "max-sm:w-0 overflow-hidden"
            : "max-sm:w-60 max-sm:pl-10"
        } max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full flex-col bg-white dark:bg-gray-900 text-gray-700 dark:text-white pt-20 transition-all relative sm:hidden`}
      >
        {/* Close button */}
        <img
          src={assets.close_icon}
          alt="close"
          className="w-5 absolute right-4 top-4 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Toggles (Mobile Only) */}
        <div className="flex flex-col gap-3 mt-6 px-4">
          <ToggleBtn label="SOS" active={sosActive} setActive={setSosActive} />
          <ToggleBtn
            label="Alert"
            active={alertActive}
            setActive={setAlertActive}
          />
          <ToggleBtn
            label="Notification"
            active={notifActive}
            setActive={setNotifActive}
          />
          <ThemeToggleBtn theme={theme} setTheme={setTheme} />
        </div>
      </div>

      {/* Right Section (Desktop) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Show Toggles only on Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <ToggleBtn label="SOS" active={sosActive} setActive={setSosActive} />
          <ToggleBtn
            label="Alert"
            active={alertActive}
            setActive={setAlertActive}
          />
          <ToggleBtn
            label="Notification"
            active={notifActive}
            setActive={setNotifActive}
          />
          <ThemeToggleBtn theme={theme} setTheme={setTheme} />
        </div>

        {/* Menu Icon (Mobile Only) */}
        <img
          src={theme === "dark" ? assets.menu_icon_dark : assets.menu_icon}
          alt="menu"
          onClick={() => setSidebarOpen(true)}
          className="w-8 sm:hidden cursor-pointer"
        />

        {/* Connect Button */}
        <a
          href="#contact-us"
          className="text-sm max-sm:hidden flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-103 transition-all"
        >
          Connect <img src={assets.arrow_icon} width={14} alt="arrow" />
        </a>
      </div>
    </motion.div>
  );
};

export default ExpNavbar;
