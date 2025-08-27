import React, { useRef, useEffect, useState } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';

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

/* ---------------- StayBuddyCard ---------------- */
const StayBuddyCard = ({ color, i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainType, setCurtainType] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Debug log to check theme in individual card
  console.log("StayBuddyCard theme:", theme);

  const carouselImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleButtonClick = (type) => {
    setCurtainType(type);
    setShowCurtain(true);
    setTimeout(() => {
      setShowCurtain(false);
      setCurtainType('');
    }, 3000);
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: '0px' }}>
      <motion.div
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: isMobile ? 'auto' : '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: isMobile ? '24px' : '50px',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
          border: theme === "dark" ? '1px solid #333333' : '1px solid #e2e8f0',
          top: `calc(-5vh + ${i * 25}px)`,
          transformOrigin: 'top',
          boxShadow: theme === 'dark' 
            ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          scale
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          margin: '0 0 20px 0', 
          fontSize: isMobile ? '28px' : '42px', 
          fontWeight: '800',
          color: theme === 'dark' ? '#ffffff' : '#000000'
        }}>
          <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Find Your </span>
          <span style={{ color: '#6366f1' }}>Stay Buddy</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '50px', alignItems: 'center', justifyContent: 'space-between' }}>
          {isMobile ? (
            <>
              <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
              <p style={{ fontSize: isMobile ? '16px' : '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', textAlign: isMobile ? 'center' : 'left', maxWidth: isMobile ? '100%' : '480px' }}>
                Find your roommate or flatmate for the trip according to your convenience. Connect with like-minded travelers and make your journey memorable.
              </p>
              <Buttons handleButtonClick={handleButtonClick} theme={theme} />
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', maxWidth: '480px' }}>
                  Find your roommate or flatmate for the trip according to your convenience. Connect with like-minded travelers and make your journey memorable.
                </p>
                <Buttons handleButtonClick={handleButtonClick} theme={theme} />
              </div>
              <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
            </>
          )}
        </div>

        {showCurtain && (
          <CurtainAnimation curtainType={curtainType} />
        )}
      </motion.div>
    </div>
  );
};

/* ---------------- TripPlannerCard ---------------- */
const TripPlannerCard = ({ color, i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainType, setCurtainType] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const carouselImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleButtonClick = (type) => {
    setCurtainType(type);
    setShowCurtain(true);
    setTimeout(() => {
      setShowCurtain(false);
      setCurtainType('');
    }, 3000);
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: '0px' }}>
      <motion.div
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: isMobile ? 'auto' : '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: isMobile ? '24px' : '50px',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
          border: theme === "dark" ? '1px solid #333333' : '1px solid #e2e8f0',
          top: `calc(-5vh + ${i * 25}px)`,
          transformOrigin: 'top',
          boxShadow: theme === 'dark' 
            ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          scale
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          margin: '0 0 20px 0', 
          fontSize: isMobile ? '28px' : '42px', 
          fontWeight: '800'
        }}>
          <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Plan Trip </span>
          <span style={{ color: '#6366f1' }}>Like a Pro!</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '50px', alignItems: 'center', justifyContent: 'space-between' }}>
          {isMobile ? (
            <>
              <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
              <p style={{ fontSize: isMobile ? '16px' : '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', textAlign: isMobile ? 'center' : 'left', maxWidth: isMobile ? '100%' : '480px' }}>
                Plan the trip by just selecting the location you want to travel, we will give you the best travel plan efficient to time, traffic and perfect time to travel a place.
              </p>
              <TripButtons handleButtonClick={handleButtonClick} theme={theme} />
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', maxWidth: '480px' }}>
                  Plan the trip by just selecting the location you want to travel, we will give you the best travel plan efficient to time, traffic and perfect time to travel a place.
                </p>
                <TripButtons handleButtonClick={handleButtonClick} theme={theme} />
              </div>
              <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
            </>
          )}
        </div>

        {showCurtain && (
          <CurtainAnimation curtainType={curtainType} />
        )}
      </motion.div>
    </div>
  );
};

/* ---------------- SafetyCard (NEW) ---------------- */
const SafetyCard = ({ color, i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainType, setCurtainType] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const carouselImages = [
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556484687-30636164638b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleButtonClick = (type) => {
    setCurtainType(type);
    setShowCurtain(true);
    setTimeout(() => {
      setShowCurtain(false);
      setCurtainType('');
    }, 3000);
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: '0px' }}>
      <motion.div
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: isMobile ? 'auto' : '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: isMobile ? '24px' : '50px',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
          border: theme === "dark" ? '1px solid #333333' : '1px solid #e2e8f0',
          top: `calc(-5vh + ${i * 25}px)`,
          transformOrigin: 'top',
          boxShadow: theme === 'dark' 
            ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          scale
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          margin: '0 0 20px 0', 
          fontSize: isMobile ? '28px' : '42px', 
          fontWeight: '800'
        }}>
          <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Stay Connected, </span>
          <span style={{ color: '#6366f1' }}>Stay Safe</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '50px', alignItems: 'center', justifyContent: 'space-between' }}>
          {isMobile ? (
            <>
              <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
              <p style={{ fontSize: isMobile ? '16px' : '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', textAlign: isMobile ? 'center' : 'left', maxWidth: isMobile ? '100%' : '480px' }}>
                You can add your friends to a group and during the whole journey we will keep updating you if one from the group will go out of a fixed radius area to ensure safety.
              </p>
              <SafetyButtons handleButtonClick={handleButtonClick} theme={theme} />
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '19px', color: theme === "dark" ? '#e2e8f0' : '#374151', maxWidth: '480px' }}>
                  You can add your friends to a group and during the whole journey we will keep updating you if one from the group will go out of a fixed radius area to ensure safety.
                </p>
                <SafetyButtons handleButtonClick={handleButtonClick} theme={theme} />
              </div>
              <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
            </>
          )}
        </div>

        {showCurtain && (
          <CurtainAnimation curtainType={curtainType} />
        )}
      </motion.div>
    </div>
  );
};

/* ---------------- Reusable Components ---------------- */
const ImageCarousel = ({ carouselImages, currentImageIndex, imageScale }) => (
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

const Buttons = ({ handleButtonClick, theme }) => (
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

const TripButtons = ({ handleButtonClick, theme }) => (
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
      onClick={() => handleButtonClick('edit')}
    >
      Edit Plan
    </motion.button>
  </div>
);

const SafetyButtons = ({ handleButtonClick, theme }) => (
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

const CurtainAnimation = ({ curtainType }) => (
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
      background: curtainType === 'start' || curtainType === 'find' || curtainType === 'create' 
        ? 'linear-gradient(135deg, #aeafcaff, #6158e3ff)' 
        : 'linear-gradient(135deg, #aeafcaff, #6158e3ff)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '32px', 
      fontWeight: 'bold', 
      color: 'white', 
      borderRadius: '25px',
      zIndex: 10
    }}
  >
    {curtainType === 'start' && '🚀 Starting Plan...'}
    {curtainType === 'edit' && '✏️ Editing Plan...'}
    {curtainType === 'find' && '🔍 Finding Perfect Stays...'}
    {curtainType === 'friend' && '👥 Connecting Friends...'}
    {curtainType === 'create' && '👨‍👩‍👧‍👦 Creating Group...'}
    {curtainType === 'existing' && '🔗 Joining Group...'}
  </motion.div>
);

/* ---------------- Main Component ---------------- */
const CardsParallaxAnimation = ({ theme }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

  // Debug log to check theme value
  console.log("CardsParallaxAnimation theme:", theme);

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
      })}
    </main>
  );
};

export default CardsParallaxAnimation;