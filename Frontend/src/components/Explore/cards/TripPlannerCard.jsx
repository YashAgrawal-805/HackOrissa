// src/components/cards/TripPlannerCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from '../../../Utilities/ImageCarousel';
import TripPlannerButtons from '../buttons/TripPlannerButtons';
import CurtainAnimation from '../../../Utilities/CurtainAnimation';
import PlaceSelectionInterface from '../interfaces/PlaceSelectionInterface';
import EventPlanInterface from '../interfaces/EventPlanInterface';

const carouselImages = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
];

const TripPlannerCard = ({ i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [showPlaceSelection, setShowPlaceSelection] = useState(false);
  const [showEventPlan, setShowEventPlan] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [lottieSrc, setLottieSrc] = useState('');
  const [loadingText, setLoadingText] = useState('');

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showMain) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showMain]);

  const handleButtonClick = (type) => {
    if (type === 'start') {
      setShowMain(false);
      setShowCurtain(true);
      setLottieSrc('/staybuddy.lottie');
      setLoadingText('Preparing your adventure...');

      setTimeout(() => {
        setShowCurtain(false);
        setShowPlaceSelection(true);
      }, 5000);
    }
  };

  const handleBackToMain = () => {
    setShowPlaceSelection(false);
    setShowEventPlan(false);
    setShowMain(true);
    setSelectedPlaces([]);
  };

  const handleBackToPlaceSelection = () => {
    setShowEventPlan(false);
    setShowPlaceSelection(true);
  };

  const handleCreatePlan = (places) => {
    setSelectedPlaces(places);
    setShowPlaceSelection(false);
    setShowCurtain(true);
    setLottieSrc('/trip.lottie');
    setLoadingText('Creating your perfect itinerary...');

    setTimeout(() => {
      setShowCurtain(false);
      setShowEventPlan(true);
    }, 5000);
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
        whileHover={showMain && !isMobile ? { y: -10, transition: { duration: 0.3 } } : {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: isMobile ? '80vh' : '500px',
          minHeight: '500px',
          width: '95vw',
          maxWidth: '1000px',
          borderRadius: '25px',
          padding: showMain ? (isMobile ? '24px' : '50px') : '0',
          background: theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
          border: theme === 'dark' ? '1px solid #333333' : '1px solid #e2e8f0',
          top: `calc(-5vh + ${i * 25}px)`,
          transformOrigin: 'top',
          boxShadow: theme === 'dark' ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' : '0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          scale: showCurtain ? 1 : scale,
          transition: 'all 0.3s ease'
        }}
      >
        <AnimatePresence>
          {showMain && (
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
                padding: isMobile ? '24px' : '50px'
              }}
            >
              <h2
                style={{
                  textAlign: 'center',
                  margin: '15px 0 10px 0',
                  fontSize: isMobile ? '28px' : '42px',
                  fontWeight: '800'
                }}
              >
                <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  Plan Trip{' '}
                </span>
                <span style={{ color: '#6366f1' }}>Like a Pro!</span>
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
                        fontSize: '14px',
                        color: theme === 'dark' ? '#e2e8f0' : '#374151',
                        textAlign: 'center',
                        maxWidth: '100%',
                        padding: '0 0px 0 10px',
                        margin: '0'
                      }}
                    >
                      Plan the trip by just selecting the location you want to travel, we will give you the best travel plan efficient to time, traffic and perfect time to travel a place.
                    </p>
                    <TripPlannerButtons handleButtonClick={handleButtonClick} theme={theme} />
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
                        Plan the trip by just selecting the location you want to travel, we will give you the best travel plan efficient to time, traffic and perfect time to travel a place.
                      </p>
                      <TripPlannerButtons handleButtonClick={handleButtonClick} theme={theme} />
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
          {showPlaceSelection && (
            <PlaceSelectionInterface
              theme={theme}
              onBack={handleBackToMain}
              onCreatePlan={handleCreatePlan}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {showEventPlan && (
            <EventPlanInterface
              theme={theme}
              onBackToPlaceSelection={handleBackToPlaceSelection}
              selectedPlaces={selectedPlaces}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {showCurtain && <CurtainAnimation theme={theme} lottieSrc={lottieSrc} loadingText={loadingText} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TripPlannerCard;