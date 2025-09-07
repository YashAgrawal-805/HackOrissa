// src/components/cards/SafetyCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from '../../../utility/ImageCarousel';
import SafetyButtons from '../buttons/SafetyButtons';
import LottieCurtain from '../../../utility/LottieCurtain';
import GroupDetailsInterface from '../interfaces/GroupDetailsInterface';
import ExistingGroupInterface from '../interfaces/ExistingGroupInterface';

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
          height: isMobile ? '80vh' : '500px',
          minHeight: '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: '24px',
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
      >
        <AnimatePresence mode="wait">
          {!showGroupInterface && !showExistingGroupUI && !showCurtain && (
            <motion.div
              key="main-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '50px'
              }}
            >
              <h2
                style={{
                  textAlign: 'center',
                  margin: '0 0 20px 0',
                  fontSize: isMobile ? '24px' : '42px',
                  fontWeight: '800'
                }}
              >
                <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  Stay Connected,{' '}
                </span>
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
                  marginTop: 'auto',
                  marginBottom: 'auto'
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
                        padding: '0 0px',
                        margin: '0'
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
            <GroupDetailsInterface
              theme={theme}
              onBackToMain={onBackToMain}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showExistingGroupUI && (
            <ExistingGroupInterface
              theme={theme}
              onBackToMain={onBackToMain}
              isMobile={isMobile}
            />
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