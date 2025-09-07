// src/components/interfaces/GroupDetailsInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';

const GroupDetailsInterface = ({ theme, onBackToMain, isMobile }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [showMemberInput, setShowMemberInput] = useState(false);
  const [newMemberContact, setNewMemberContact] = useState('');
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState('1 km');
   const [isLoading, setIsLoading] = useState(false);

  const radiusOptions = ['100 mt', '200 mt', '500 mt', '1 km', '2 km', '5 km', '10 km', '20 km'];

  const handleAddMember = () => {
    if (newMemberContact) {
      setMembers([...members, { name: newMemberContact, contact: newMemberContact }]);
      setNewMemberContact('');
      setShowMemberInput(false);
    }
  };

    const handleCreateGroup = async () => {
    if (!groupName || members.length === 0) {
      alert("Please enter group name and add at least one member.");
      return;
    }

    setIsLoading(true);
    try {
      // Collect all member phone numbers
      const memberPhones = members.map(m => m.contact);
      console.log("Member Phones:", memberPhones);

      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const res = await axios.post(
        "http://localhost:3000/api/create-group", // adjust backend URL
        {
          groupName,
          memberPhones,   // send phone numbers
          subAdminPhone: null // can add UI for sub-admin later
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // backend uses authenticateToken
          },
        }
      );

      alert("✅ Group created successfully!");
      console.log("Group Response:", res.data);

      // Optional: reset form
      setGroupName("");
      setMembers([]);
    } catch (err) {
      console.error("Error creating group:", err);
      alert("❌ Failed to create group");
    } finally {
      setIsLoading(false);
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
        flexDirection: 'column',
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
      <h2 style={{
        textAlign: 'center',
        margin: '20px 0 30px 0',
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
        maxWidth: '900px',
        flexGrow: 1,
      }}>
        <div style={{
          flex: isMobile ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '10px' : '15px',
          width: isMobile ? '100%' : '50%',
          paddingRight: isMobile ? '0' : '40px',
        }}>
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
                padding: '12px 8px',
                borderRadius: '12px',
                border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4',
                background: theme === 'dark' ? '#1e293b' : '#f0f4f9',
                color: theme === 'dark' ? '#ffffff' : '#374151',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
            />
          </div>
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
              maxHeight: '120px',
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
                  background: theme === 'dark' ? '#334155' : '#e2e8f0',
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
                      border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4',
                      background: theme === 'dark' ? '#1e293b' : '#f0f4f9',
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
                  border: theme === 'dark' ? '1px solid #475569' : '1px solid #c9d6e4',
                  background: theme === 'dark' ? '#1e293b' : '#f0f4f9',
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
                      bottom: '100%',
                      left: 0,
                      width: '100%',
                      background: theme === 'dark' ? '#1e293b' : '#ffffff',
                      border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      marginBottom: '8px',
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
  onClick={handleCreateGroup}   // ✅ Call the actual function
  disabled={isLoading}
  style={{
    marginTop: '20px',
    marginBottom: '20px',
    padding: '14px 28px',
    borderRadius: '50px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    cursor: isLoading ? "not-allowed" : "pointer",
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    opacity: isLoading ? 0.6 : 1
  }}
>
  {isLoading ? "Creating..." : "Create Group"}
</motion.button>

        </div>
      </div>
    </motion.div>
  );
};

export default GroupDetailsInterface;