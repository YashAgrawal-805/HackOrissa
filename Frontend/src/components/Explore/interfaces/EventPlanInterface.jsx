// src/components/interfaces/EventPlanInterface.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    const paddingX = mapContainerSize.width * 0.1;
    const paddingY = mapContainerSize.height * 0.2;
    const availableWidth = mapContainerSize.width - 2 * paddingX;
    const availableHeight = mapContainerSize.height - 2 * paddingY;

    const x = numPlaces === 1
      ? mapContainerSize.width / 2
      : paddingX + (availableWidth * (index / (numPlaces - 1)));

    const baseYOscillation = availableHeight * 0.25;
    let y = mapContainerSize.height / 2;

    if (numPlaces > 1) {
      if (index === 0) {
        y = mapContainerSize.height / 2 - baseYOscillation * 0.8;
      } else if (index === numPlaces - 1) {
        y = mapContainerSize.height / 2 + baseYOscillation * 0.8;
      } else {
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
        background: theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
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
          top: isMobile ? '10px' : '20px',
          left: isMobile ? '10px' : '20px',
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
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: isMobile ? '40px' : '60px', width: '100%', flexShrink: 0 }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: theme === 'dark' ? '#ffffff' : '#374151', margin: '0' }}>
          Your Event Plan
        </h2>
        <p style={{ fontSize: isMobile ? '14px' : '16px', color: theme === 'dark' ? '#e2e8f0' : '#6b7280', margin: '8px 0 0 0' }}>
          {selectedPlaces.length} destinations connected for your perfect trip
        </p>
      </div>
      <div
        ref={mapRef}
        style={{
          position: 'relative',
          width: isMobile ? 'calc(100% - 20px)' : 'calc(100% - 40px)',
          height: isMobile ? '40vh' : '400px',
          maxWidth: '900px',
          background: theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(248, 250, 252, 0.6)',
          borderRadius: '20px',
          border: theme === 'dark' ? '2px solid #475569' : '2px solid #e2e8f0',
          boxShadow: theme === 'dark' ? '0 8px 25px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginTop: '20px',
          flexGrow: 1,
          marginBottom: '20px'
        }}
      >
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '10px' : '30px', marginTop: 'auto', flexWrap: 'wrap', flexShrink: 0, paddingBottom: '10px' }}>
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

export default EventPlanInterface;