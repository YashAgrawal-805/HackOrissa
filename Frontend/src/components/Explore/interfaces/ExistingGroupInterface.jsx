// src/components/interfaces/ExistingGroupInterface.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        margin: '0 0 40px 0',
        fontSize: isMobile ? '28px' : '36px',
        fontWeight: '800',
        marginTop: isMobile ? '15px' : '0'
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

export default ExistingGroupInterface;