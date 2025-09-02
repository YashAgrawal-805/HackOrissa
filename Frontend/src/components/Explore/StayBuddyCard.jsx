import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ImageCarousel, Buttons } from './parallex';

// CurtainAnimation component definition
const CurtainAnimation = ({ curtainType, theme, lottieSrc, loadingText }) => (
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '25px',
      zIndex: 15
    }}
  >
    {lottieSrc && (
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
          {loadingText}
        </p>
      </>
    )}
  </motion.div>
);


const StayBuddyCard = ({ color, i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainType, setCurtainType] = useState('');
  const [lottieSrc, setLottieSrc] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [showInvitationInterface, setShowInvitationInterface] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const carouselImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  ];

  // Sample data for invitations
  const sendInvitations = [
    { name: 'Alex Johnson', contact: '+1 234 567 8901' },
    { name: 'Sarah Chen', contact: '+1 234 567 8902' },
    { name: 'Mike Davis', contact: '+1 234 567 8903' },
    { name: 'Emily Brown', contact: '+1 234 567 8904' },
    { name: 'David Wilson', contact: '+1 234 567 8905' }
  ];

  const acceptInvitations = [
    { name: 'John Smith', contact: '+1 234 567 8906' },
    { name: 'Lisa Taylor', contact: '+1 234 567 8907' },
    { name: 'Robert Lee', contact: '+1 234 567 8908' },
    { name: 'Maria Garcia', contact: '+1 234 567 8909' },
    { name: 'James Miller', contact: '+1 234 567 8910' }
  ];

  // Sample data for friends list
  const friendsList = [
    { name: 'Emma Watson', contact: '+1 234 567 9001' },
    { name: 'Michael Scott', contact: '+1 234 567 9002' },
    { name: 'Jennifer Lopez', contact: '+1 234 567 9003' },
    { name: 'Ryan Reynolds', contact: '+1 234 567 9004' },
    { name: 'Scarlett Johansson', contact: '+1 234 567 9005' },
    { name: 'Leonardo DiCaprio', contact: '+1 234 567 9006' },
    { name: 'Angelina Jolie', contact: '+1 234 567 9007' },
    { name: 'Chris Evans', contact: '+1 234 567 9008' }
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
    let animationDuration = 3000;

    if (type === 'find') {
      setLottieSrc('/staybuddy.lottie');
      setLoadingText('Finding your stay buddy...');

      setTimeout(() => {
        setShowCurtain(false);
        setShowInvitationInterface(true);
        setCurtainType('');
        setLottieSrc('');
        setLoadingText('');
      }, animationDuration);
    } else if (type === 'friend') {
      setLottieSrc('/friends_loading.lottie');
      setLoadingText('Loading your friends list...');

      setTimeout(() => {
        setShowCurtain(false);
        setShowFriendsList(true);
        setCurtainType('');
        setLottieSrc('');
        setLoadingText('');
      }, animationDuration);
    } else {
      setLottieSrc('');
      setLoadingText('');
      setTimeout(() => {
        setShowCurtain(false);
        setCurtainType('');
      }, 800);
    }
  };

  const handleBackClick = () => {
    setShowInvitationInterface(false);
    setShowFriendsList(false);
  };

  const handleSendInvitation = (name) => {
    console.log(`Sending invitation to ${name}`);
  };

  const handleAcceptInvitation = (name) => {
    console.log(`Accepting invitation from ${name}`);
  };

  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  const FriendCard = ({ person }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
        borderRadius: '15px',
        padding: '16px',
        marginBottom: '12px',
        minWidth: '0',
        boxShadow: theme === 'dark'
          ? '0 4px 15px rgba(0,0,0,0.3)'
          : '0 4px 15px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#ffffff' }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: '0' }}>
          <h4 style={{
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {person.name}
          </h4>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {person.contact}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const InvitationCard = ({ person, type, onAction }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
        borderRadius: '15px',
        padding: '16px',
        marginBottom: '12px',
        minWidth: '0',
        boxShadow: theme === 'dark'
          ? '0 4px 15px rgba(0,0,0,0.3)'
          : '0 4px 15px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: '0' }}>
          <h4 style={{
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {person.name}
          </h4>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {person.contact}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction(person.name)}
          style={{
            padding: '8px 16px',
            borderRadius: '25px',
            background: type === 'send' ? '#10b981' : '#6366f1',
            color: '#ffffff',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: type === 'send'
              ? '0 2px 8px rgba(16, 185, 129, 0.3)'
              : '0 2px 8px rgba(99, 102, 241, 0.3)'
          }}
        >
          {type === 'send' ? 'Send' : 'Accept'}
        </motion.button>
      </div>
    </motion.div>
  );

  const InvitationSection = ({ title, data, type, onAction }) => (
    <div style={{
      flex: 1,
      minHeight: '0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{
        textAlign: 'center',
        margin: '0 0 20px 0',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: '700',
        color: theme === 'dark' ? '#ffffff' : '#000000',
      }}>
        {title}
      </h3>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        maxHeight: isMobile ? '200px' : 'auto'
      }}>
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {data.map((person, index) => (
          <InvitationCard
            key={index}
            person={person}
            type={type}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div ref={container} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: '0px' }}>
      <motion.div
        whileHover={!showInvitationInterface && !showFriendsList && !showCurtain ? { y: -10, transition: { duration: 0.3 } } : {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: isMobile ? '80vh' : '500px',
          minHeight: '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: !showInvitationInterface && !showFriendsList && !showCurtain ? (isMobile ? '24px' : '50px') : '20px',
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
          scale: showCurtain ? 1 : scale
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
              <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                <span>Find Your </span><span style={{ color: '#6366f1' }}>Stay Buddy</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '50px', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 'auto', marginBottom: 'auto' }}>
                {isMobile ? (
                  <>
                    <ImageCarousel carouselImages={carouselImages} currentImageIndex={currentImageIndex} imageScale={imageScale} />
                    <p style={{ fontSize: '16px', color: theme === "dark" ? '#e2e8f0' : '#374151', textAlign: 'center', maxWidth: '100%', padding: '0 10px', margin: '0' }}>
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
            </motion.div>
          )}

          {showFriendsList && (
            <motion.div
              key="friends-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '20px',
                padding: '20px'
              }}
            >
              <h2 style={{
                textAlign: 'center',
                margin: '0 0 20px 0',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}>
                <span style={{ color: '#6366f1' }}>Friend</span> List
              </h2>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: '8px',
                paddingBottom: '20px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
                <style>
                  {`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>
                {friendsList.map((friend, index) => (
                  <FriendCard key={index} person={friend} />
                ))}
              </div>
            </motion.div>
          )}

          {showInvitationInterface && (
            <motion.div
              key="invitation-interface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '15px',
                padding: '0px'
              }}
            >
              <h2 style={{
                textAlign: 'center',
                margin: '10px 0 10px 0',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}>
                Stay Buddy <span style={{ color: '#6366f1' }}>Invitations</span>
              </h2>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : '40px',
                minHeight: '0',
                paddingBottom: '20px'
              }}>
                <InvitationSection
                  title="Send Invitation"
                  data={sendInvitations}
                  type="send"
                  onAction={handleSendInvitation}
                />

                {!isMobile && (
                  <div style={{
                    width: '1px',
                    background: theme === 'dark' ? '#475569' : '#e2e8f0',
                    margin: '0 10px'
                  }} />
                )}

                <InvitationSection
                  title="Accept Invitation"
                  data={acceptInvitations}
                  type="accept"
                  onAction={handleAcceptInvitation}
                />
              </div>
            </motion.div>
          )}

          {showCurtain && <CurtainAnimation curtainType={curtainType} theme={theme} lottieSrc={lottieSrc} loadingText={loadingText} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StayBuddyCard;