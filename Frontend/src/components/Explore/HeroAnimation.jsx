// heroanimation.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ShopCard from '../cards/ShopCard';

// Helper component for the Heading
const Heading = ({ theme }) => {
  const words = ["TourGuide", "Trip Planner", "Shield", "SafeKeeper"];
  const [index, setIndex] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const safeColor = theme === "dark" ? "text-white" : "text-black";
  const yourColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <>
      <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left w-full">
        {/* Line 1: RoamSafe */}
        <h1 className="font-extrabold mb-2 md:mb-4 responsive-heading-main">
          <span className="text-blue-500">Roam</span>
          <span className={`ml-1 md:ml-2 ${safeColor}`}>Safe</span>
        </h1>

        {/* Line 2: Your ... */}
        <h2 className="font-semibold flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 responsive-heading-sub">
          <span className={yourColor}>Your</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
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

      <style jsx>{`
        .responsive-heading-main {
          font-size: 4vw;
          line-height: 1.1;
        }

        .responsive-heading-sub {
          font-size: 2.4vw;
          line-height: 1.2;
        }

        /* Mobile breakpoint - when screen is smaller than 768px */
        @media (max-width: 767px) {
          .responsive-heading-main {
            font-size: 2.5rem;
          }

          .responsive-heading-sub {
            font-size: 1.5rem;
          }
        }

        /* Very small screens */
        @media (max-width: 480px) {
          .responsive-heading-main {
            font-size: 2rem;
          }

          .responsive-heading-sub {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};

// Main component
const HeroAnimation = ({ theme }) => {
  const isDark = theme === "dark";

  // State and functions for the floating container
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get coordinates from Redux store with proper error handling
  const latLng = useSelector((state) => state?.app?.latLng || {});
  const { lat = null, lng = null } = latLng;

  const fetchRestaurants = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const config = {
        params: { lat, lng },
        withCredentials: true
      };
      
      // Add token to headers if it exists
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await axios.get('http://localhost:3000/api/find_restaurants', config);
      setShops(res.data.restaurants || []);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants');
      // Set some mock data as fallback
      setShops([
        {
          name: "Local Bistro",
          photo: null,
          special: "Traditional cuisine",
          address: "City Center"
        },
        {
          name: "Street Food Corner",
          photo: null,
          special: "Local delicacies",
          address: "Downtown"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const areCoordsValid =
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng);

    if (!isOpen || !areCoordsValid) {
      return;
    }

    setIsLoading(true);
    console.log(lat, lng);
    fetchRestaurants();

    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [isOpen, lat, lng]); // Watch all three

  const cardData = [
    {
      name: 'Stay Connected,Stay Safe',
      description: 'Get instant alerts if any group member steps outside the safety radius.'
    },
    {
      name: 'Find Your StayBuddy',
      description: 'Helping solo travelers connect and find reliable roommates during trips.'
    },
    {
      name: 'Plan Trip Like a Pro !',
      description: 'We design the smartest route based on the places you want to explore.'
    },
    {
      name: 'Local Food Cuisine',
      description: 'Get local cuisine recommendations based on where you are.'
    },
    {
      name: 'SOS',
      description: 'Quick SOS alerts to your group and nearby travellers.'
    },
    {
      name: 'Alert',
      description: 'Know before you go—safety notifications keep you protected.'
    }
  ];

  return (
    <>
      {/* Mobile-only layout */}
      <div className="flex flex-col items-center md:hidden w-full">
        {/* All animation elements, visible on mobile */}
        <div
          className="w-full max-w-4xl mx-auto relative"
          style={{
            aspectRatio: "1 / 1",
            backgroundColor: isDark ? "#000000" : "transparent"
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: "linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1))"
            }}
          >
            <ul
              className="list-none m-0 p-0 relative w-full h-full z-10"
              style={{
                aspectRatio: "1 / 1",
                outline: isDark ? "2px dotted #444" : "2px dotted magenta"
              }}
              onMouseEnter={(e) => {
                const animations = e.currentTarget.querySelectorAll('.rotating-item, .rotating-card');
                animations.forEach(el => el.style.animationPlayState = 'paused');
              }}
              onMouseLeave={(e) => {
                const animations = e.currentTarget.querySelectorAll('.rotating-item, .rotating-card');
                animations.forEach(el => el.style.animationPlayState = 'running');
              }}
            >
              {cardData.map((card, index) => (
                <li
                  key={index}
                  className="absolute top-1/2 w-full rotating-item"
                  style={{
                    transform: "translateY(-50%)",
                    animation: "rotateCW 40s cubic-bezier(0.000, 0.37, 1.000, 0.63) infinite",
                    animationDelay: `${-40 / 6 * index}s`
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center text-center gap-2 font-sans rotating-card"
                    style={{
                      width: "30%",
                      aspectRatio: "1.2 / 1",
                      padding: "12px 16px",
                      background: isDark ? "#1a1a1a" : "#FFFFFF",
                      color: isDark ? "#e0e0e0" : "#535062",
                      boxShadow: isDark
                        ? "0px 4px 12px rgba(255, 255, 255, 0.05), 0px 16px 32px rgba(255, 255, 255, 0.03)"
                        : "0px 4px 12px rgba(0, 0, 0, 0.1), 0px 16px 32px rgba(0, 0, 0, 0.1)",
                      borderRadius: "12px",
                      animation: "rotateCCW 40s cubic-bezier(0.000, 0.37, 1.000, 0.63) infinite",
                      animationDelay: `${-40 / 6 * index}s`
                    }}
                  >
                    <a href="#" className="no-underline" style={{ color: "inherit" }}>
                      <span
                        className="font-medium block"
                        style={{
                          color: isDark ? "#8b5cf6" : "#3B2ED0",
                          fontSize: "12px",
                          lineHeight: "150%"
                        }}
                      >
                        {card.name}
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          fontSize: "10px",
                          lineHeight: "1.2", // Adjusted line height
                          display: "block" // Ensures line height is applied
                        }}
                      >
                        {card.description}
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            {/* Circles and other elements */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: "66%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                background: isDark ? "#0f0f0f" : "#F5F4FE",
                opacity: isDark ? 0.4 : 0.25,
                boxShadow: isDark
                  ? "0px 18px 36px -18px rgba(255, 255, 255, 0.02), 0px 30px 60px -12px rgba(255, 255, 255, 0.01)"
                  : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: "40%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                background: isDark ? "#1a1a1a" : "#F5F4FE",
                opacity: isDark ? 0.6 : 0.5,
                boxShadow: isDark
                  ? "0px 18px 36px -18px rgba(255, 255, 255, 0.03), 0px 30px 60px -12px rgba(255, 255, 255, 0.02)"
                  : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
              }}
            />
          </div>
          <div
            className="absolute top-0 left-0 bottom-0 w-1/2"
            style={{
              animation: "pulseGlow 5s linear infinite alternate",
              backgroundPosition: "100% 50%",
              backgroundRepeat: "no-repeat",
              backgroundImage: isDark
                ? "radial-gradient(100% 50% at 100% 50%, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.35) 11.79%, rgba(59, 130, 246, 0.3) 21.38%, rgba(59, 130, 246, 0.25) 29.12%, rgba(59, 130, 246, 0.2) 35.34%, rgba(59, 130, 246, 0.18) 40.37%, rgba(59, 130, 246, 0.15) 44.56%, rgba(59, 130, 246, 0.12) 48.24%, rgba(59, 130, 246, 0.1) 51.76%, rgba(59, 130, 246, 0.08) 55.44%, rgba(59, 130, 246, 0.06) 59.63%, rgba(59, 130, 246, 0.05) 64.66%, rgba(59, 130, 246, 0.03) 70.88%, rgba(59, 130, 246, 0.02) 78.62%, rgba(59, 130, 246, 0.01) 88.21%, rgba(59, 130, 246, 0) 100%)"
                : "radial-gradient(100% 50% at 100% 50%, rgba(60, 26, 229, 0.25) 0%, rgba(60, 26, 229, 0.247904) 11.79%, rgba(59, 26, 229, 0.241896) 21.38%, rgba(58, 26, 229, 0.2324) 29.12%, rgba(57, 26, 229, 0.219837) 35.34%, rgba(55, 26, 229, 0.20463) 40.37%, rgba(53, 26, 229, 0.1872) 44.56%, rgba(51, 26, 229, 0.16797) 48.24%, rgba(48, 26, 229, 0.147363) 51.76%, rgba(46, 26, 229, 0.1258) 55.44%, rgba(44, 26, 229, 0.103704) 59.63%, rgba(41, 26, 229, 0.0814963) 64.66%, rgba(39, 26, 229, 0.0596) 70.88%, rgba(36, 26, 229, 0.038437) 78.62%, rgba(34, 26, 229, 0.0184296) 88.21%, rgba(32, 26, 229, 0) 100%)"
            }}
          >
            <div
              className="absolute w-px h-full right-0 block"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(180deg, rgba(59, 130, 246, 0) 0%, #3b82f6 50%, rgba(59, 130, 246, 0) 100%)"
                  : "linear-gradient(180deg, rgba(60, 26, 229, 0) 0%, #3C1AE5 50%, rgba(60, 26, 229, 0) 100%)"
              }}
            />
          </div>
          <div
            className="absolute left-1/2 top-1/2 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              width: "150px",
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
              background: isDark ? "#0a0a0a" : "#FFFFFF",
              boxShadow: isDark
                ? "0px 18px 36px -18px rgba(255, 255, 255, 0.05), 0px 30px 60px -12px rgba(255, 255, 255, 0.03)"
                : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
            }}
          >
            <img
              src="/roamsafe.png"
              alt="RoamSafe Logo"
              className="w-full h-full object-contain"
              style={{
                filter: isDark ? "brightness(0) invert(1)" : "none"
              }}
            />
          </div>
        </div>
        <div className="mt-8 px-4">
          <Heading theme={theme} />
        </div>
      </div>

      {/* Desktop Layout - Heading on left, HeroAnimation centered */}
      <div className="hidden md:flex flex-row items-center justify-center w-full min-h-[500px] relative">
        {/* The Heading is positioned absolutely with higher z-index */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 z-30"
          style={{
            width: "40vw",
            paddingLeft: "10vw",
            paddingRight: "10vw"
          }}
        >
          <div style={{ width: "20vw" }}>
            <Heading theme={theme} />
          </div>
        </div>

        {/* The HeroAnimation is centered as it was originally */}
        <div
          className="w-full max-w-4xl mx-auto relative"
          style={{
            aspectRatio: "1 / 1",
            backgroundColor: isDark ? "#000000" : "transparent"
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: "linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1))"
            }}
          >
            <ul
              className="list-none m-0 p-0 relative w-full h-full z-10"
              style={{
                aspectRatio: "1 / 1",
                outline: isDark ? "2px dotted #444" : "2px dotted magenta"
              }}
              onMouseEnter={(e) => {
                const animations = e.currentTarget.querySelectorAll('.rotating-item, .rotating-card');
                animations.forEach(el => el.style.animationPlayState = 'paused');
              }}
              onMouseLeave={(e) => {
                const animations = e.currentTarget.querySelectorAll('.rotating-item, .rotating-card');
                animations.forEach(el => el.style.animationPlayState = 'running');
              }}
            >
              {cardData.map((card, index) => (
                <li
                  key={index}
                  className="absolute top-1/2 w-full rotating-item"
                  style={{
                    transform: "translateY(-50%)",
                    animation: "rotateCW 40s cubic-bezier(0.000, 0.37, 1.000, 0.63) infinite",
                    animationDelay: `${-40 / 6 * index}s`
                  }}
                >
                  <div
                    className="flex flex-col items-start gap-2 font-sans text-sm leading-5 rotating-card"
                    style={{
                      width: "27%",
                      padding: "16px 24px",
                      background: isDark ? "#1a1a1a" : "#FFFFFF",
                      color: isDark ? "#e0e0e0" : "#535062",
                      boxShadow: isDark
                        ? "0px 4px 12px rgba(255, 255, 255, 0.05), 0px 16px 32px rgba(255, 255, 255, 0.03)"
                        : "0px 4px 12px rgba(0, 0, 0, 0.1), 0px 16px 32px rgba(0, 0, 0, 0.1)",
                      borderRadius: "12px",
                      animation: "rotateCCW 40s cubic-bezier(0.000, 0.37, 1.000, 0.63) infinite",
                      animationDelay: `${-40 / 6 * index}s`
                    }}
                  >
                    <a href="#" className="no-underline" style={{ color: "inherit" }}>
                      <span
                        className="font-medium text-lg block mb-2"
                        style={{
                          color: isDark ? "#8b5cf6" : "#3B2ED0",
                          fontSize: "18px",
                          lineHeight: "150%"
                        }}
                      >
                        {card.name}
                      </span>
                      <span style={{ lineHeight: '1.2' }}>{card.description}</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            {/* Circles and other elements */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: "66%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                background: isDark ? "#0f0f0f" : "#F5F4FE",
                opacity: isDark ? 0.4 : 0.25,
                boxShadow: isDark
                  ? "0px 18px 36px -18px rgba(255, 255, 255, 0.02), 0px 30px 60px -12px rgba(255, 255, 255, 0.01)"
                  : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: "19vw",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                background: isDark ? "#1a1a1a" : "#F5F4FE",
                opacity: isDark ? 0.6 : 0.5,
                boxShadow: isDark
                  ? "0px 18px 36px -18px rgba(255, 255, 255, 0.03), 0px 30px 60px -12px rgba(255, 255, 255, 0.02)"
                  : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
              }}
            />
          </div>
          <div
            className="absolute top-0 left-0 bottom-0 w-1/2"
            style={{
              animation: "pulseGlow 5s linear infinite alternate",
              backgroundPosition: "100% 50%",
              backgroundRepeat: "no-repeat",
              backgroundImage: isDark
                ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(59, 130, 246, 0.4) 100%)"
                : "radial-gradient(100% 50% at 100% 50%, rgba(60, 26, 229, 0.25) 0%, rgba(60, 26, 229, 0.247904) 11.79%, rgba(59, 26, 229, 0.241896) 21.38%, rgba(58, 26, 229, 0.2324) 29.12%, rgba(57, 26, 229, 0.219837) 35.34%, rgba(55, 26, 229, 0.20463) 40.37%, rgba(53, 26, 229, 0.1872) 44.56%, rgba(51, 26, 229, 0.16797) 48.24%, rgba(48, 26, 229, 0.147363) 51.76%, rgba(46, 26, 229, 0.1258) 55.44%, rgba(44, 26, 229, 0.103704) 59.63%, rgba(41, 26, 229, 0.0814963) 64.66%, rgba(39, 26, 229, 0.0596) 70.88%, rgba(36, 26, 229, 0.038437) 78.62%, rgba(34, 26, 229, 0.0184296) 88.21%, rgba(32, 26, 229, 0) 100%)"
            }}
          >
            <div
              className="absolute w-px h-full right-0 block"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(180deg, rgba(59, 130, 246, 0) 0%, #3b82f6 50%, rgba(59, 130, 246, 0) 100%)"
                  : "linear-gradient(180deg, rgba(60, 26, 229, 0) 0%, #3C1AE5 50%, rgba(60, 26, 229, 0) 100%)"
              }}
            />
          </div>
          <div
            className="absolute left-1/2 top-1/2 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              width: "230px",
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
              background: isDark ? "#0a0a0a" : "#FFFFFF",
              boxShadow: isDark
                ? "0px 18px 36px -18px rgba(255, 255, 255, 0.05), 0px 30px 60px -12px rgba(255, 255, 255, 0.03)"
                : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
            }}
          >
            <img
              src="/roamsafe.png"
              alt="RoamSafe Logo"
              className="w-full h-full object-contain"
              style={{
                filter: isDark ? "brightness(0) invert(1)" : "none"
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Animation Button */}
      {createPortal(
        <motion.div
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl cursor-pointer z-[1100] transition-all duration-300 ${
            isOpen
              ? 'ring-4 ring-blue-300/30 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
              : 'hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:scale-110'
          }`}
          onClick={() => setIsOpen(!isOpen)}
          animate={{
            scale: isOpen ? [1, 1.05, 1] : [1, 1.1, 1],
            boxShadow: isOpen
              ? ["0 0 20px rgba(59,130,246,0.3)", "0 0 35px rgba(59,130,246,0.6)", "0 0 20px rgba(59,130,246,0.3)"]
              : ["0 8px 25px rgba(0,0,0,0.15)", "0 12px 35px rgba(0,0,0,0.2)", "0 8px 25px rgba(0,0,0,0.15)"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <DotLottieReact
            src="/Food.lottie"
            loop
            autoplay
            style={{ width: '48px', height: '48px', pointerEvents: 'none' }}
          />
        </motion.div>,
        document.body
      )}

      {/* Sliding Container */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999]"
                onClick={() => setIsOpen(false)}
              />

              {/* Main Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, x: 120, y: 120 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: 120, y: 120 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="fixed bottom-6 right-6 w-[320px] sm:w-[620px] h-[82vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl z-[1000] border border-slate-700/50 flex flex-col overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  WebkitMask: 'radial-gradient(circle at calc(100% - 32px) calc(100% - 32px), transparent 40px, black 42px)',
                  mask: 'radial-gradient(circle at calc(100% - 32px) calc(100% - 32px), transparent 40px, black 42px)'
                }}
              >
                {/* Glassmorphism Header */}
                <div className="relative bg-gradient-to-r from-blue-400/10 via-blue-500/10 to-indigo-600/10 backdrop-blur-xl border-b border-white/10 p-6 flex-shrink-0 rounded-t-3xl">
                  {/* Header Content */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Local Cuisine</h2>
                      <p className="text-sm text-white/70">Discover amazing food around you</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Error State */}
                  {error && !isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                      <div className="text-red-400 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 mx-auto">
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="mb-2">{error}</p>
                        <button
                          onClick={fetchRestaurants}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Loader vs Shop Cards */}
                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4">
                          <DotLottieReact
                            src="/Loading.lottie"
                            loop
                            autoplay
                            style={{ width: "80px", height: "80px" }}
                          />
                        </div>
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-600/20 animate-pulse"></div>
                      </div>
                      <p className="text-white/80 font-medium mt-4">Finding delicious spots...</p>
                      <div className="flex gap-1 mt-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                      </div>
                    </div>
                  ) : !error && (
                    <>
                      {/* Stats Bar - Fixed */}
                      <div className="flex-shrink-0 px-6 py-4">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                          {/* Location */}
                          <div className="flex-1 text-left pr-4">
                            <div className="text-xs text-white/60">Location</div>
                            <div className="text-lg font-bold text-white truncate">
                              {lat && lng ? `${lat.toFixed(3)}, ${lng.toFixed(3)}` : 'City Center'}
                            </div>
                          </div>
                          <div className="w-px h-8 bg-white/20"></div>
                          {/* Restaurants Count */}
                          <div className="flex-shrink-0 text-center pl-4">
                            <div className="text-2xl font-bold text-white">{shops.length}</div>
                            <div className="text-xs text-white/60">Restaurants</div>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Shop Cards Grid */}
                      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-6">
                        {shops.length > 0 ? (
                          <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            style={{
                              minHeight: 'fit-content'
                            }}
                          >
                            {shops.map((s, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.3 }}
                              >
                                <ShopCard
                                  name={s.name || `Restaurant ${i + 1}`}
                                  photo={s.photo}
                                  special={s.special || 'Local cuisine'}
                                  address={s.address || 'Local area'}
                                />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="text-white/60 text-center">
                              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl">🍴</span>
                              </div>
                              <p>No restaurants found in this area</p>
                              <p className="text-sm mt-2">Try a different location</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style jsx>{`
        @keyframes rotateCW {
          from {
            transform: translate3d(0px, -50%, -1px) rotate(-45deg);
          }
          to {
            transform: translate3d(0px, -50%, 0px) rotate(-315deg);
          }
        }

        @keyframes rotateCCW {
          from {
            transform: rotate(45deg);
          }
          to {
            transform: rotate(315deg);
          }
        }

        @keyframes pulseGlow {
          from {
            background-size: 60%;
          }
          to {
            background-size: 100%;
          }
        }
        
        /* Styles for the floating container's scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default HeroAnimation;