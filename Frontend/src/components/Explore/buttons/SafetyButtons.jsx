// src/components/buttons/SafetyButtons.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SafetyButtons = ({ handleButtonClick, theme }) => (
  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', marginBottom: '10px' }}>
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

export default SafetyButtons;