// src/components/cards/StayBuddyCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from '../../../utility/ImageCarousel';
import StayBuddyButtons from '../buttons/StayBuddyButtons';
import CurtainAnimation from '../../../utility/CurtainAnimation';
import InvitationInterface from '../interfaces/InvitationInterface';
import FriendsList from '../interfaces/FriendsList';
import { useSelector } from "react-redux";
import {handleFindTravellers,handleRecieve} from '../../../controllers/SoloTravellers';
import { useDispatch } from 'react-redux';
import { setAcceptedRequests, setSendRequests } from '../../../store/store';

const carouselImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
];

const StayBuddyCard = ({ i, progress, range, targetScale, theme }) => {
  const dispatch = useDispatch();

  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [lottieSrc, setLottieSrc] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [showInvitationInterface, setShowInvitationInterface] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { lat, lng} = useSelector((state) => state.app.latLng);
  const sendRequests = useSelector((state) => state.app.sendRequests);
  const acceptedRequests = useSelector((state) => state.app.acceptedRequests);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!showInvitationInterface && !showFriendsList && !showCurtain) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showInvitationInterface, showFriendsList, showCurtain]);

  const handleButtonClick = (type) => {
    setShowCurtain(true);
    let animationDuration = 3000;

    if (type === 'find') {
      setLottieSrc('/staybuddy.lottie');
      setLoadingText('Finding your stay buddy...');
      handleFindTravellers(lat, lng).then(( sendInvitations) => {
        dispatch(setSendRequests(sendInvitations))
      }
      );
      handleRecieve().then((acceptedInvitations) => {
        dispatch(setAcceptedRequests(acceptedInvitations))
      }
      );
      setTimeout(() => {
        setShowCurtain(false);
        setShowInvitationInterface(true);
      }, animationDuration);
    } else if (type === 'friend') {
      setLottieSrc('/staybuddy.lottie');
      setLoadingText('Loading your friends list...');
      setTimeout(() => {
        setShowCurtain(false);
        setShowFriendsList(true);
      }, animationDuration);
    }
  };

  const handleBackClick = () => {
    setShowInvitationInterface(false);
    setShowFriendsList(false);
  };

  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: '0px' }}>
      <motion.div
        whileHover={!showInvitationInterface && !showFriendsList && !showCurtain ? { y: -10, transition: { duration: 0.3 } } : {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          // Removed fixed height and min-height for better mobile responsiveness
          height: isMobile ? 'auto' : '500px', // 'auto' allows height to be determined by content
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: !showInvitationInterface && !showFriendsList && !showCurtain ? (isMobile ? '24px' : '50px') : '20px',
          background: theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
          border: theme === "dark" ? '1px solid #333333' : '1px solid #e2e8f0',
          top: `calc(-5vh + ${i * 25}px)`,
          transformOrigin: 'top',
          boxShadow: theme === 'dark' ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' : '0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          scale: showCurtain ? 1 : scale,
          // Added min-height for mobile to prevent card from being too small
          minHeight: isMobile ? '60vh' : '500px', 
        }}
      >
        <AnimatePresence>
          {(showInvitationInterface || showFriendsList) && (
            <motion.button
              key="back-button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBackClick}
              style={{
                position: 'absolute',
                top: isMobile ? '10px' : '20px',
                left: isMobile ? '10px' : '20px',
                background: theme === 'dark' ? '#374151' : '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}

          {!showInvitationInterface && !showFriendsList && !showCurtain && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative', // Changed from absolute to relative for better flow
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? '24px' : '50px',
                // Added flex-grow to ensure content fills available space
                flexGrow: 1
              }}
            >
              <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                <span>Find Your </span><span style={{ color: '#6366f1' }}>Stay Buddy</span>
              </h2>
              {/* This flex container is the main reason for the empty space on mobile */}
              <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '24px' : '50px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  // Removed margin 'auto' to prevent centering and empty space
                  marginTop: '0', 
                  marginBottom: '0', 
                  // Added flex-grow to push content and fill space
                  flexGrow: 1, 
                  // Added min-height to ensure flex children have some space
                  minHeight: '0',
                }}>
                {isMobile ? (
                  <>
                    <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
                    <p style={{ fontSize: '16px', color: theme === "dark" ? '#e2e8f0' : '#374151', textAlign: 'center', maxWidth: '100%', padding: '0 10px', margin: '0', marginTop: 'auto' }}>
                      Find your roommate or flatmate for the trip according to your convenience. Connect with like-minded travelers and make your journey memorable.
                    </p>
                    <StayBuddyButtons handleButtonClick={handleButtonClick} theme={theme} />
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', maxWidth: '480px' }}>
                        Find your roommate or flatmate for the trip according to your convenience. Connect with like-minded travelers and make your journey memorable.
                      </p>
                      <StayBuddyButtons handleButtonClick={handleButtonClick} theme={theme} />
                    </div>
                    <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
                  </>
                )}
              </div>
            </motion.div>
          )}

          {showFriendsList && (
            <motion.div key="friends-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', marginTop: '20px', padding: '20px' }}>
              <FriendsList theme={theme} isMobile={isMobile} />
            </motion.div>
          )}

          {showInvitationInterface && (
            <motion.div key="invitation-interface" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', marginTop: '15px', padding: '0px' }}>
              <InvitationInterface theme={theme} isMobile={isMobile} sendInvitations={sendRequests} acceptInvitations={acceptedRequests}/>
            </motion.div>
          )}

          {showCurtain && <CurtainAnimation theme={theme} lottieSrc={lottieSrc} loadingText={loadingText} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StayBuddyCard;