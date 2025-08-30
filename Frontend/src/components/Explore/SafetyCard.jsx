// safetycard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ImageCarousel, SafetyButtons } from './parallex';

// Reusable Lottie Curtain Component
const LottieCurtain = ({ theme, lottieSrc, loadingText }) => (
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
      zIndex: 15,
    }}
  >
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
  </motion.div>
);

const GroupDetailsInterface = ({ theme, onBackToMain, isMobile }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [showMemberInput, setShowMemberInput] = useState(false);
  const [newMemberContact, setNewMemberContact] = useState('');
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState('1 km');

  const radiusOptions = ['100 mt', '200 mt', '500 mt', '1 km', '2 km', '5 km', '10 km', '20 km'];

  const handleAddMember = () => {
    if (newMemberContact) {
      setMembers([...members, { name: newMemberContact, contact: newMemberContact }]);
      setNewMemberContact('');
      setShowMemberInput(false);
    }
  };

  const toggleMemberInput = () => {
    setShowMemberInput(!showMemberInput);
    setNewMemberContact('');
  };

  const toggleRadiusDropdown = () => {
    setIsRadiusOpen(!isRadiusOpen);
  };

  const handleSelectRadius = (radius) => {
    setSelectedRadius(radius);
    setIsRadiusOpen(false);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRadiusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
        padding: isMobile ? '20px' : '50px',
        display: 'flex',
        flexDirection: 'column', // Set to column for proper stacking
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBackToMain}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
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
        ←
      </motion.button>
      
      {/* Centered Heading */}
      <h2 style={{
        textAlign: 'center',
        margin: '0 0 40px 0',
        fontSize: isMobile ? '28px' : '36px',
        fontWeight: '800',
      }}>
        <span style={{ color: '#6366f1' }}>Group </span>
        <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Details</span>
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        width: '100%',
        maxWidth: '900px', // Adjust max-width for better desktop view
        flexGrow: 1, // Allow this container to grow
      }}>
        {/* Left side: Inputs */}
        <div style={{
          flex: isMobile ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: isMobile ? '100%' : '50%',
          paddingRight: isMobile ? '0' : '40px',
        }}>

          {/* Group Name */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#e2e8f0' : '#374151'
            }}>Group Name</span>
            <motion.input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Trip to Goa"
              whileFocus={{ boxShadow: '0 0 0 3px #6366f1, 0 0 0 6px rgba(99, 102, 241, 0.2)' }}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '12px',
                border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4', // Increased border contrast
                background: theme === 'dark' ? '#1e293b' : '#f0f4f9', // Slightly darker background
                color: theme === 'dark' ? '#ffffff' : '#374151',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
            />
          </div>

          {/* Add Members */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#e2e8f0' : '#374151'
            }}>Members</span>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '120px', // Set a max height for scrolling
              overflowY: 'auto',
              paddingRight: '10px',
              scrollbarWidth: 'thin',
              scrollbarColor: `${theme === 'dark' ? '#475569' : '#cbd5e1'} transparent`
            }}>
              <style>
                {`
                  div::-webkit-scrollbar {
                    width: 8px;
                  }
                  div::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: ${theme === 'dark' ? '#475569' : '#cbd5e1'};
                    border-radius: 4px;
                  }
                `}
              </style>
              {members.map((member, index) => (
                <div key={index} style={{
                  background: theme === 'dark' ? '#334155' : '#e2e8f0', // Slightly darker background
                  color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}>
                  {member.name}
                </div>
              ))}
            </div>
            <AnimatePresence>
              {showMemberInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    gap: '10px'
                  }}
                >
                  <motion.input
                    type="text"
                    value={newMemberContact}
                    onChange={(e) => setNewMemberContact(e.target.value)}
                    placeholder="Enter contact number"
                    whileFocus={{ boxShadow: '0 0 0 3px #6366f1, 0 0 0 6px rgba(99, 102, 241, 0.2)' }}
                    style={{
                      flexGrow: 1,
                      padding: '10px 15px',
                      borderRadius: '12px',
                      border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4', // Increased border contrast
                      background: theme === 'dark' ? '#1e293b' : '#f0f4f9', // Slightly darker background
                      color: theme === 'dark' ? '#ffffff' : '#374151',
                      fontSize: '16px',
                      fontWeight: '500',
                      outline: 'none'
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddMember}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Add
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleMemberInput}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'transparent',
                color: '#6366f1',
                border: '2px solid #6366f1',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {showMemberInput ? 'Cancel' : 'Add Member'}
            </motion.button>
          </div>
          
          {/* Select Radius */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#e2e8f0' : '#374151'
            }}>Safety Radius</span>
            <div ref={dropdownRef} style={{
              position: 'relative',
              width: '100%',
            }}>
              <motion.div
                onClick={toggleRadiusDropdown}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4', // Increased border contrast
                  background: theme === 'dark' ? '#1e293b' : '#f0f4f9', // Slightly darker background
                  color: theme === 'dark' ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                <span>{selectedRadius}</span>
                <motion.span
                  animate={{ rotate: isRadiusOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </motion.div>
              <AnimatePresence>
                {isRadiusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      bottom: '100%', // Position dropdown to come up
                      left: 0,
                      width: '100%',
                      background: theme === 'dark' ? '#1e293b' : '#ffffff',
                      border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      marginBottom: '8px', // Adjust margin
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      maxHeight: '150px',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: `${theme === 'dark' ? '#475569' : '#cbd5e1'} transparent`
                    }}
                  >
                    <style>
                      {`
                        div::-webkit-scrollbar {
                          width: 8px;
                        }
                        div::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: ${theme === 'dark' ? '#475569' : '#cbd5e1'};
                          border-radius: 4px;
                        }
                      `}
                    </style>
                    {radiusOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleSelectRadius(option)}
                        style={{
                          padding: '12px 20px',
                          cursor: 'pointer',
                          color: theme === 'dark' ? '#e2e8f0' : '#374151',
                          borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
                        }}
                        onMouseEnter={(e) => e.target.style.background = theme === 'dark' ? '#334155' : '#f1f5f9'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Right side: Lottie Animation and Button */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '0',
          height: '100%',
          marginTop: isMobile ? '40px' : '0'
        }}>
          <DotLottieReact
            src="/car.lottie"
            loop
            autoplay
            style={{ width: isMobile ? '70%' : '80%', height: 'auto', maxWidth: '400px' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Group created!')}
            style={{
              marginTop: '20px',
              padding: '14px 28px',
              borderRadius: '50px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
            }}
          >
            Create Group
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const GroupCard = ({ group, theme }) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: theme === 'dark' ? '#1e293b' : '#f0f4f9',
        border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme === 'dark' ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme === 'dark' ? '#ffffff' : '#374151',
            margin: 0
          }}>
            {group.name}
          </h3>
          <p style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#94a3b8' : '#6b7280',
            margin: '4px 0 0 0'
          }}>
            {group.members.length} Members
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMembers(!showMembers)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {showMembers ? 'Hide Members' : 'Show Members'}
        </motion.button>
      </div>
      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden', marginTop: '16px' }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {group.members.map((member, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    fontSize: '14px',
                    color: theme === 'dark' ? '#e2e8f0' : '#374151',
                    padding: '6px 0'
                  }}
                >
                  {member.name} - {member.contact}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExistingGroupInterface = ({ theme, onBackToMain, isMobile }) => {
  const existingGroups = [
    { name: 'Goa Trip 2025', members: [
      { name: 'John Doe', contact: '+1-555-0101' },
      { name: 'Jane Smith', contact: '+1-555-0102' },
      { name: 'Alice Johnson', contact: '+1-555-0103' }
    ]},
    { name: 'Hackathon Squad', members: [
      { name: 'Michael Scott', contact: '+1-555-0104' },
      { name: 'Jim Halpert', contact: '+1-555-0105' }
    ]},
    { name: 'Ooty Trip', members: [
      { name: 'Dwight Schrute', contact: '+1-555-0106' },
      { name: 'Pam Beesly', contact: '+1-555-0107' },
      { name: 'Angela Martin', contact: '+1-555-0108' },
      { name: 'Kevin Malone', contact: '+1-555-0109' }
    ]},
    { name: 'Mountain Trekkers', members: [
      { name: 'Toby Flenderson', contact: '+1-555-0110' },
      { name: 'Oscar Martinez', contact: '+1-555-0111' },
      { name: 'Stanley Hudson', contact: '+1-555-0112' }
    ]},
  ];

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
        padding: isMobile ? '20px' : '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20,
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBackToMain}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
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
        ←
      </motion.button>
      
      <h2 style={{
        textAlign: 'center',
        margin: '0 0 40px 0',
        fontSize: isMobile ? '28px' : '36px',
        fontWeight: '800',
        marginTop: isMobile ? '60px' : '0'
      }}>
        <span style={{ color: '#6366f1' }}>Existing </span>
        <span style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Groups</span>
      </h2>

      <div
        className="hide-scrollbar"
        style={{
          width: '100%',
          maxWidth: '700px',
          flex: 1,
          overflowY: 'auto',
          paddingRight: '10px',
        }}
      >
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        {existingGroups.map((group, index) => (
          <GroupCard key={index} group={group} theme={theme} />
        ))}
      </div>
    </motion.div>
  );
};


const SafetyCard = ({ color, i, progress, range, targetScale, theme }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);
  const [lottieSrc, setLottieSrc] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [showGroupInterface, setShowGroupInterface] = useState(false);
  const [showExistingGroupUI, setShowExistingGroupUI] = useState(false);
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
      setLoadingText('Joining existing group...');
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
          height: isMobile ? 'auto' : '500px',
          minHeight: '500px',
          width: '1000px',
          maxWidth: '90vw',
          borderRadius: '25px',
          padding: !showGroupInterface && !showExistingGroupUI && !showCurtain ? (isMobile ? '24px' : '50px') : '0',
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
                padding: isMobile ? '24px' : '50px'
              }}
            >
              <h2
                style={{
                  textAlign: 'center',
                  margin: '0 0 20px 0',
                  fontSize: isMobile ? '28px' : '42px',
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
                  gap: isMobile ? '16px' : '50px',
                  alignItems: 'center',
                  justifyContent: 'space-between'
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
                        fontSize: isMobile ? '16px' : '19px',
                        color: theme === 'dark' ? '#e2e8f0' : '#374151',
                        textAlign: 'center',
                        maxWidth: '100%'
                      }}
                    >
                      You can add your friends to a group and during the whole journey
                      we will keep updating you if one from the group goes out of a
                      fixed radius to ensure safety.
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
                        You can add your friends to a group and during the whole
                        journey we will keep updating you if one from the group goes
                        out of a fixed radius to ensure safety.
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