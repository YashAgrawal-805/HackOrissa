// src/components/cards/SafetyCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from '../../../Utilities/ImageCarousel';
import SafetyButtons from '../../../components/Explore/buttons/SafetyButtons';
import LottieCurtain from '../../../Utilities/LottieCurtain';
import GroupDetailsInterface from '../../../components/Explore/interfaces/GroupDetailsInterface';
import ExistingGroupInterface from '../../../components/Explore/interfaces/ExistingGroupInterface';

const carouselImages = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556484687-30636164638b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'
];

const SafetyCard = ({ i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [lottieSrc, setLottieSrc] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [showGroupInterface, setShowGroupInterface] = useState(false);
  const [showExistingGroupUI, setShowExistingGroupUI] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!showGroupInterface && !showExistingGroupUI && !showCurtain) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showGroupInterface, showExistingGroupUI, showCurtain]);

  const handleButtonClick = (type) => {
    setCardExpanded(true);
    setShowCurtain(true);
    let animationDuration = 3000;

    if (type === 'create') {
      setLottieSrc('/staybuddy.lottie');
      setLoadingText('Creating a new group...');
      setTimeout(() => {
        setShowCurtain(false);
        setShowGroupInterface(true);
      }, animationDuration);
    } else if (type === 'existing') {
      setLottieSrc('/staybuddy.lottie');
      setLoadingText('Loading existing groups...');
      setTimeout(() => {
        setShowCurtain(false);
        setShowExistingGroupUI(true);
      }, animationDuration);
    }
  };

  const onBackToMain = () => {
    setShowGroupInterface(false);
    setShowExistingGroupUI(false);
    setCardExpanded(false);
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: '0px'
      }}
    >
      <motion.div
        whileHover={!showGroupInterface && !showExistingGroupUI && !showCurtain ? { y: -10, transition: { duration: 0.3 } } : {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: cardExpanded ? (isMobile ? '80vh' : '650px') : (isMobile ? 'auto' : '500px'),
          minHeight: cardExpanded ? (isMobile ? '80vh' : '650px') : (isMobile ? '60vh' : '500px'),
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: !showGroupInterface && !showExistingGroupUI && !showCurtain ? (isMobile ? '24px' : '50px') : '20px',
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
          border: theme === 'dark' ? '1px solid #333333' : '1px solid #e2e8f0',
          top: `calc(-5vh + ${i * 25}px)`,
          transformOrigin: 'top',
          boxShadow:
            theme === 'dark'
              ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
              : '0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          scale: showCurtain ? 1 : scale
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {(showGroupInterface || showExistingGroupUI) && (
            <motion.button
              key="back-button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBackToMain}
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

          {!showGroupInterface && !showExistingGroupUI && !showCurtain && (
            <motion.div
              key="main-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                flexGrow: 1
              }}
              layout
            >
              <h2
                style={{
                  textAlign: 'center',
                  margin: '0 0 20px 0',
                  fontSize: isMobile ? '24px' : '42px',
                  fontWeight: '800',
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }}
              >
                <span>Stay Connected,{' '}</span>
                <span style={{ color: '#6366f1' }}>Stay Safe</span>
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '24px' : '50px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  flexGrow: 1,
                  minHeight: '0',
                }}
              >
                {isMobile ? (
                  <>
                    <ImageCarousel
                      carouselImages={carouselImages}
                      currentImageIndex={currentImageIndex}
                      imageScale={imageScale}
                    />
                    <p
                      style={{
                        fontSize: '16px',
                        color: theme === 'dark' ? '#e2e8f0' : '#374151',
                        textAlign: 'center',
                        maxWidth: '100%',
                        padding: '0 10px',
                        margin: '0',
                        marginTop: 'auto'
                      }}
                    >
                      You can add your friends to a group and during the whole journey we will keep updating you if one from the group goes out of a fixed radius to ensure safety.
                    </p>
                    <SafetyButtons
                      handleButtonClick={handleButtonClick}
                      theme={theme}
                    />
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: '19px',
                          color: theme === 'dark' ? '#e2e8f0' : '#374151',
                          maxWidth: '480px'
                        }}
                      >
                        You can add your friends to a group and during the whole journey we will keep updating you if one from the group goes out of a fixed radius to ensure safety.
                      </p>
                      <SafetyButtons
                        handleButtonClick={handleButtonClick}
                        theme={theme}
                      />
                    </div>
                    <ImageCarousel
                      carouselImages={carouselImages}
                      currentImageIndex={currentImageIndex}
                      imageScale={imageScale}
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showGroupInterface && (
            <motion.div key="group-details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
              <GroupDetailsInterface
                theme={theme}
                onBackToMain={onBackToMain}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showExistingGroupUI && (
            <motion.div key="existing-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
              <ExistingGroupInterface
                theme={theme}
                onBackToMain={onBackToMain}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showCurtain && (
            <LottieCurtain
              theme={theme}
              lottieSrc={lottieSrc}
              loadingText={loadingText}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SafetyCard;