import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import assets from '../assets/assets';
import ShopCard from './cards/ShopCard';
import { useSelector } from 'react-redux';


const Hero = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [shops, setShops] = useState([
    {},
  ]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupClick = () => navigate('/auth');
  const { lat, lng } = useSelector((state) => state.app.latLng);

  const fetchRestaurants = async () => {
     try {
       const token = localStorage.getItem('token');
       const res = await axios.get('http://localhost:3000/api/find_restaurants',{params: { lat, lng }, 
         withCredentials: true,
       });
       setShops(res.data.restaurants || []);
     } catch (err) {
       console.error('Error fetching restaurants:', err);
       setError('Failed to load restaurants');
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
      return
    };
  
    setIsLoading(true);
    console.log(lat,lng)
    fetchRestaurants();
  
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [isOpen, lat, lng]); // Watch all three
  

  // useEffect(() => {
  //   console.log('Fetching restaurants for coordinates:', lat, lng);
  //   const fetchRestaurants = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const res = await axios.get('http://localhost:3000/api/find_restaurants',{params: { lat, lng }, 
  //         withCredentials: true,
  //       });

  //       setShops(res.data.restaurants || []);
  //     } catch (err) {
  //       console.error('Error fetching restaurants:', err);
  //       setError('Failed to load restaurants');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRestaurants();
  // }, []);

  return (
    <div
      id="hero"
      className="flex flex-col items-center gap-6 py-20 px-4 sm:px-12 lg:px-24 xl:px-40 text-center w-full text-gray-700 dark:text-white"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 border border-gray-300 p-1.5 pr-4 rounded-full"
      >
        <img src={assets.group_profile} alt="Profile" className="w-20" />
        <p className="text-xs font-medium">Customer Friendly</p>
      </motion.div>

      {/* Heading */}
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

      {/* Sub-text */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        viewport={{ once: true }}
        className="text-sm sm:text-lg font-medium text-gray-500 dark:text-white/75 max-w-[80%] sm:max-w-lg pb-3 mt-4"
      >
        Creating meaningful connections and turning big ideas into interactive digital experiences.
      </motion.p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
        <motion.button
          onClick={() => navigate('/explore')}
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

      {/* Floating Animation Button */}
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
            ? ['0 0 20px rgba(59,130,246,0.3)', '0 0 35px rgba(59,130,246,0.6)', '0 0 20px rgba(59,130,246,0.3)']
            : ['0 8px 25px rgba(0,0,0,0.15)', '0 12px 35px rgba(0,0,0,0.2)', '0 8px 25px rgba(0,0,0,0.15)'],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <DotLottieReact
          src="/Food.lottie"
          loop
          autoplay
          style={{ width: '48px', height: '48px', pointerEvents: 'none' }}
        />
      </motion.div>

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
                  boxShadow:
                    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  WebkitMask:
                    'radial-gradient(circle at calc(100% - 32px) calc(100% - 32px), transparent 40px, black 42px)',
                  mask:
                    'radial-gradient(circle at calc(100% - 32px) calc(100% - 32px), transparent 40px, black 42px)',
                }}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-400/10 via-blue-500/10 to-indigo-600/10 backdrop-blur-xl border-b border-white/10 p-6 flex-shrink-0 rounded-t-3xl">
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

                {/* Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4">
                          <DotLottieReact
                            src="/Loading.lottie"
                            loop
                            autoplay
                            style={{ width: '80px', height: '80px' }}
                          />
                        </div>
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-600/20 animate-pulse"></div>
                      </div>
                      <p className="text-white/80 font-medium mt-4">Finding delicious spots...</p>
                    </div>
                  ) : error ? (
                    <p className="text-red-400 text-center mt-4">{error}</p>
                  ) : shops.length === 0 ? (
                    <p className="text-white/80 text-center mt-4">No nearby restaurants found.</p>
                  ) : (
                    <>
                      {/* Stats Bar */}
                      <div className="flex-shrink-0 px-6 py-4">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                          <div className="flex-1 text-left pr-4">
                            <div className="text-xs text-white/60">Location</div>
                            <div className="text-lg font-bold text-white truncate">City Center</div>
                          </div>
                          <div className="w-px h-8 bg-white/20"></div>
                          <div className="flex-shrink-0 text-center pl-4">
                            <div className="text-2xl font-bold text-white">{shops.length}</div>
                            <div className="text-xs text-white/60">Restaurants</div>
                          </div>
                        </div>
                      </div>

                      {/* Shop Cards Grid */}
                      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ minHeight: 'fit-content' }}>
                          {shops.map((s, i) => (
                            <motion.div
                              key={s.id || i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1, duration: 0.3 }}
                            >
                              <ShopCard
                                name={s.name}
                                photo={s.photo}
                                special={s.special}
                                address={s.address}
                              />
                            </motion.div>
                          ))}
                        </div>
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Hero;