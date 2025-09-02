// parallex.jsx
import React, { useRef } from 'react';
import { useScroll, motion } from 'framer-motion';
import StayBuddyCard from './StayBuddyCard';
import TripPlannerCard from './TripPlannerCard';
import SafetyCard from './SafetyCard';
// Sample data
const projects = [
  {
    title: "Find Your Stay Buddy",
    isStayBuddyCard: true,
    color: "#BBACAF"
  },
  {
    title: "Plan Trip Like a Pro!",
    isTripPlannerCard: true,
    color: "#BBACAF"
  },
  {
    title: "Stay Connected, Stay Safe",
    isSafetyCard: true,
    color: "#BBACAF"
  }
];

/* ---------------- Reusable Components ---------------- */
export const ImageCarousel = ({ carouselImages, currentImageIndex, imageScale }) => (
  <motion.div 
    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    style={{ 
      position: 'relative', 
      width: '400px', 
      maxWidth: '100%', 
      height: '250px', 
      borderRadius: '25px', 
      overflow: 'hidden', 
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)' 
    }}
  >
    <motion.div style={{ width: '100%', height: '100%', scale: imageScale }}>
      {carouselImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`slide-${index}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: index === currentImageIndex ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
        />
      ))}
    </motion.div>
  </motion.div>
);

export const Buttons = ({ handleButtonClick, theme }) => (
  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        padding: '14px 28px', 
        borderRadius: '50px', 
        background: '#6366f1', 
        color: '#fff', 
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
      }} 
      onClick={() => handleButtonClick('find')}
    >
      Find
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        padding: '14px 28px', 
        borderRadius: '50px', 
        background: theme === 'dark' ? '#000000' : '#ffffff', 
        color: '#6366f1', 
        border: '2px solid #6366f1',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: theme === 'dark' 
          ? '0 4px 15px rgba(99, 102, 241, 0.2)' 
          : '0 4px 15px rgba(99, 102, 241, 0.1)'
      }} 
      onClick={() => handleButtonClick('friend')}
    >
      Friends
    </motion.button>
  </div>
);

export const TripButtons = ({ handleButtonClick, theme }) => (
  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        padding: '14px 28px', 
        borderRadius: '50px', 
        background: '#6366f1', 
        color: '#fff', 
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
      }} 
      onClick={() => handleButtonClick('start')}
    >
      Start Plan
    </motion.button>
  </div>
);

export const SafetyButtons = ({ handleButtonClick, theme }) => (
  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', marginBottom:"10px" }}>
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        padding: '14px 28px', 
        borderRadius: '50px', 
        background: '#6366f1', 
        color: '#fff', 
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
      }} 
      onClick={() => handleButtonClick('create')}
    >
      Create Group
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        padding: '14px 28px', 
        borderRadius: '50px', 
        background: theme === 'dark' ? '#000000' : '#ffffff', 
        color: '#6366f1', 
        border: '2px solid #6366f1',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: theme === 'dark' 
          ? '0 4px 15px rgba(99, 102, 241, 0.2)' 
          : '0 4px 15px rgba(99, 102, 241, 0.1)'
      }} 
      onClick={() => handleButtonClick('existing')}
    >
      Existing Group
    </motion.button>
  </div>
);

// Updated CurtainAnimation component - now optional since TripPlannerCard handles its own
export const CurtainAnimation = ({ curtainType, theme, showLottie = false }) => (
  <motion.div 
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
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '32px', 
      fontWeight: 'bold', 
      color: theme === 'dark' ? '#ffffff' : '#374151', 
      borderRadius: '25px',
      zIndex: 10
    }}
  >
    {showLottie ? (
      <div style={{
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Placeholder for Lottie animation */}
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #a855f7, #6366f1)',
          animation: 'spin 2s linear infinite'
        }}>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    ) : (
      <>
        {curtainType === 'start' && '🚀 Starting Plan...'}
        {curtainType === 'edit' && '✏️ Editing Plan...'}
        {curtainType === 'find' && '🔍 Finding Buddies...'}
        {curtainType === 'friend' && '👫 Loading Friends...'}
        {curtainType === 'create' && '👨‍👩‍👧‍👦 Creating Group...'}
        {curtainType === 'existing' && '🔗 Joining Group...'}
      </>
    )}
  </motion.div>
);

/* ---------------- Main Component ---------------- */
const CardsParallaxAnimation = ({ theme }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

  return (
    <main ref={container} style={{ marginTop: '50vh', marginBottom: '50vh' }}>
      {projects.map((project, i) => {
        const targetScale = 1 - ((projects.length - i) * 0.05);

        if (project.isStayBuddyCard) {
          return <StayBuddyCard key={`stay_buddy_${i}`} i={i} color={project.color} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} theme={theme} />;
        }

        if (project.isTripPlannerCard) {
          return <TripPlannerCard key={`trip_planner_${i}`} i={i} color={project.color} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} theme={theme} />;
        }

        if (project.isSafetyCard) {
          return <SafetyCard key={`safety_card_${i}`} i={i} color={project.color} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} theme={theme} />;
        }

        return null;
      })}
    </main>
  );
};

export default CardsParallaxAnimation;