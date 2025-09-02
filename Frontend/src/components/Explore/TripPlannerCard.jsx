import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ImageCarousel, TripButtons } from './parallex';

const PlaceCard = ({ place, theme, onAdd, isAdded, isMobile }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    style={{
      width: '100%',
      maxWidth: isMobile ? '250px' : '220px', // Responsive width
      minWidth: isMobile ? '140px' : '160px', // Responsive min-width
      height: isMobile ? '220px' : '260px', // Responsive height
      borderRadius: '16px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
      border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
      boxShadow: theme === 'dark'
        ? '0 8px 25px rgba(0,0,0,0.3)'
        : '0 8px 25px rgba(0,0,0,0.1)',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      opacity: isAdded ? 0.6 : 1
    }}
  >
    <div style={{
      width: '100%',
      height: isMobile ? '100px' : '140px', // Responsive image height
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '10px'
    }}>
      <img
        src={place.image}
        alt={place.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>

    <h3 style={{
      fontSize: isMobile ? '14px' : '16px', // Responsive font size
      fontWeight: '600',
      color: theme === 'dark' ? '#ffffff' : '#374151',
      margin: '0 0 10px 0',
      textAlign: 'center',
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {place.name}
    </h3>

    <motion.button
      whileHover={!isAdded ? { scale: 1.05 } : {}}
      whileTap={!isAdded ? { scale: 0.95 } : {}}
      onClick={() => !isAdded && onAdd(place)}
      disabled={isAdded}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        background: isAdded ? '#10b981' : '#6366f1',
        color: '#fff',
        border: 'none',
        cursor: isAdded ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: isAdded
          ? '0 4px 15px rgba(16, 185, 129, 0.3)'
          : '0 4px 15px rgba(99, 102, 241, 0.3)',
        transition: 'all 0.3s ease'
      }}
    >
      {isAdded ? 'ADDED' : 'ADD'}
    </motion.button>
  </motion.div>
);

const EventPlanInterface = ({ theme, onBackToPlaceSelection, selectedPlaces, isMobile }) => {
  const [mapContainerSize, setMapContainerSize] = useState({ width: 0, height: 0 });
  const mapRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (mapRef.current) {
        setMapContainerSize({
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isMobile]);

  const positionedPlaces = selectedPlaces.map((place, index) => {
    const numPlaces = selectedPlaces.length;
    const paddingX = mapContainerSize.width * 0.1; // Reduced horizontal padding for wider path
    const paddingY = mapContainerSize.height * 0.2;
    const availableWidth = mapContainerSize.width - 2 * paddingX;
    const availableHeight = mapContainerSize.height - 2 * paddingY;

    const x = numPlaces === 1
      ? mapContainerSize.width / 2
      : paddingX + (availableWidth * (index / (numPlaces - 1)));

    // Increased y-oscillation for more pronounced zigzag
    const baseYOscillation = availableHeight * 0.25; // More vertical displacement
    let y = mapContainerSize.height / 2;

    if (numPlaces > 1) {
      if (index === 0) { // Start point higher
        y = mapContainerSize.height / 2 - baseYOscillation * 0.8; 
      } else if (index === numPlaces - 1) { // End point lower
        y = mapContainerSize.height / 2 + baseYOscillation * 0.8;
      } else { // Waypoints zigzag
        y += Math.sin(index * Math.PI / (numPlaces - 1) * 2) * baseYOscillation * (index % 2 === 0 ? 1 : -1);
      }
    }
    

    return { ...place, x, y };
  });

  const generatePath = (places) => {
    if (places.length < 2) return '';

    let path = `M ${places[0].x} ${places[0].y}`;
    for (let i = 1; i < places.length; i++) {
      const prev = places[i - 1];
      const curr = places[i];

      const cp1X = prev.x + (curr.x - prev.x) / 3;
      const cp1Y = prev.y;

      const cp2X = curr.x - (curr.x - prev.x) / 3;
      const cp2Y = curr.y;

      path += ` C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${curr.x},${curr.y}`;
    }
    return path;
  };

  const pathData = generatePath(positionedPlaces);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
        borderRadius: '25px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 20,
        overflow: 'hidden'
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBackToPlaceSelection}
        style={{
          position: 'absolute',
          top: isMobile ? '10px' : '20px', // Responsive positioning
          left: isMobile ? '10px' : '20px', // Responsive positioning
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: theme === 'dark' ? '#374151' : '#f3f4f6',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          zIndex: 30
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        marginTop: isMobile ? '40px' : '60px', // Responsive margin-top
        width: '100%',
        flexShrink: 0
      }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '32px', // Responsive font size
          fontWeight: '700',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          margin: '0'
        }}>
          Your Event Plan
        </h2>
        <p style={{
          fontSize: isMobile ? '14px' : '16px', // Responsive font size
          color: theme === 'dark' ? '#e2e8f0' : '#6b7280',
          margin: '8px 0 0 0'
        }}>
          {selectedPlaces.length} destinations connected for your perfect trip
        </p>
      </div>

      <div
        ref={mapRef}
        style={{
          position: 'relative',
          width: isMobile ? 'calc(100% - 20px)' : 'calc(100% - 40px)', // E D I T E D
          height: isMobile ? '40vh' : '400px',
          maxWidth: '900px',
          background: theme === 'dark'
            ? 'rgba(30, 41, 59, 0.3)'
            : 'rgba(248, 250, 252, 0.6)',
          borderRadius: '20px',
          border: theme === 'dark' ? '2px solid #475569' : '2px solid #e2e8f0',
          boxShadow: theme === 'dark'
            ? '0 8px 25px rgba(0,0,0,0.3)'
            : '0 8px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginTop: '20px',
          flexGrow: 1,
          marginBottom: '20px'
        }}
      >
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          {pathData && (
            <motion.path
              d={pathData}
              stroke={theme === 'dark' ? '#6366f1' : '#8b5cf6'}
              strokeWidth="3"
              strokeDasharray="10,6"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
          )}
        </svg>

        {positionedPlaces.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              delay: index === 0 ? 0.3 : 1.5 + (index * 0.5),
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            style={{
              position: 'absolute',
              left: `${place.x}px`,
              top: `${place.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              cursor: 'pointer',
              filter: `drop-shadow(0 4px 8px ${
                index === 0 ? 'rgba(16, 185, 129, 0.7)' :
                index === positionedPlaces.length - 1 ? 'rgba(239, 68, 68, 0.7)' :
                'rgba(99, 102, 241, 0.7)'
              })`
            }}
          >
            <div style={{
              fontSize: isMobile ? '30px' : '40px',
              lineHeight: '1',
              color: index === 0 ? '#10b981' :
                index === positionedPlaces.length - 1 ? '#ef4444' :
                '#6366f1',
            }}>
              📍
            </div>

            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: theme === 'dark' ? '#1e293b' : 'white',
              color: theme === 'dark' ? '#ffffff' : '#374151',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0'
            }}>
              {place.name}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: isMobile ? '10px' : '30px', // Responsive gap
        marginTop: 'auto',
        flexWrap: 'wrap',
        flexShrink: 0,
        paddingBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: '14px', fontWeight: '500', color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>Starting Point</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#6366f1' }} />
          <span style={{ fontSize: '14px', fontWeight: '500', color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>Waypoints</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ fontSize: '14px', fontWeight: '500', color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>Final Destination</span>
        </div>
      </div>
    </motion.div>
  );
};

const PlaceSelectionInterface = ({ theme, onBack, onCreatePlan, isMobile }) => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const places = [
    { id: 1, name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop' },
    { id: 2, name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
    { id: 3, name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
    { id: 4, name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
    { id: 5, name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
    { id: 6, name: 'Sydney', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { id: 7, name: 'Rome', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop' },
    { id: 8, name: 'Barcelona', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop' },
  ];

  const handleAddPlace = (place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleCreatePlan = () => {
    onCreatePlan(selectedPlaces);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
        borderRadius: '25px',
        padding: isMobile ? '16px' : '24px', // Responsive padding
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        style={{
          position: 'absolute',
          top: isMobile ? '10px' : '20px', // Responsive positioning
          left: isMobile ? '10px' : '20px', // Responsive positioning
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: theme === 'dark' ? '#374151' : '#f3f4f6',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          zIndex: 30
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <motion.button
        whileHover={selectedPlaces.length > 0 ? { scale: 1.05, y: -2 } : {}}
        whileTap={selectedPlaces.length > 0 ? { scale: 0.95 } : {}}
        onClick={handleCreatePlan}
        disabled={selectedPlaces.length === 0}
        style={{
          position: 'absolute',
          bottom: isMobile ? '10px' : '20px', // Responsive positioning
          right: isMobile ? '10px' : '20px', // Responsive positioning
          padding: '12px 24px',
          borderRadius: '25px',
          background: selectedPlaces.length > 0 ? '#6366f1' : '#94a3b8',
          color: '#fff',
          border: 'none',
          cursor: selectedPlaces.length > 0 ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: selectedPlaces.length > 0
            ? '0 4px 15px rgba(99, 102, 241, 0.3)'
            : '0 4px 15px rgba(148, 163, 184, 0.3)',
          zIndex: 30,
          transition: 'all 0.3s ease'
        }}
      >
        Create Plan {selectedPlaces.length > 0 && `(${selectedPlaces.length})`}
      </motion.button>

      <div style={{
        textAlign: 'center',
        marginBottom: isMobile ? '20px' : '30px', // Responsive margin
        marginTop: '60px'
      }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '32px', // Responsive font size
          fontWeight: '700',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          margin: '0'
        }}>
          Choose places you want to explore!
        </h2>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: '100px',
          paddingTop: '10px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="hide-scrollbar"
      >
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? 'repeat(auto-fit, minmax(140px, 1fr))' // Responsive grid columns
            : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '12px' : '20px', // Responsive gap
          padding: '0 16px',
          justifyItems: 'center'
        }}>
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              theme={theme}
              onAdd={handleAddPlace}
              isAdded={selectedPlaces.find(p => p.id === place.id)}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TripPlannerCard = ({ color, i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [showPlaceSelection, setShowPlaceSelection] = useState(false);
  const [showEventPlan, setShowEventPlan] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [lottieSrc, setLottieSrc] = useState('/staybuddy.lottie');

  const carouselImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
  ];

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
  }, [carouselImages.length, showMain]);

  const handleButtonClick = (type) => {
    if (type === 'start') {
      setShowMain(false);
      setShowCurtain(true);
      setShowLottie(true);
      setLottieSrc('/staybuddy.lottie');

      setTimeout(() => {
        setShowLottie(false);
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
    setShowLottie(true);
    setLottieSrc('/trip.lottie');

    setTimeout(() => {
      setShowLottie(false);
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
        whileHover={showMain ? { y: -10, transition: { duration: 0.3 } } : {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: isMobile ? '80vh' : '500px',
          minHeight: '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: showMain ? (isMobile ? '24px' : '50px') : '0',
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
                padding:'50px'
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
                      Plan the trip by just selecting the location you want to travel,
                      we will give you the best travel plan efficient to time,
                      traffic and perfect time to travel a place.
                    </p>
                    <TripButtons handleButtonClick={handleButtonClick} theme={theme} />
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
                        Plan the trip by just selecting the location you want to
                        travel, we will give you the best travel plan efficient to
                        time, traffic and perfect time to travel a place.
                      </p>
                      <TripButtons handleButtonClick={handleButtonClick} theme={theme} />
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
          {showCurtain && (
            <motion.div
              key="curtain"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '25px',
                zIndex: 15
              }}
            >
              {showLottie && (
                <>
                  <div style={{
                    width: '200px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <DotLottieReact
                      src={lottieSrc}
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <p style={{
                    color: theme === 'dark' ? '#e2e8f0' : '#374151',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center',
                    margin: 0
                  }}>
                    {lottieSrc === '/staybuddy.lottie' ? 'Preparing your adventure...' : 'Creating your perfect itinerary...'}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TripPlannerCard;