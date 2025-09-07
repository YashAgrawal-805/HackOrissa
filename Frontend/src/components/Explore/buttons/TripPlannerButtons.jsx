// src/components/buttons/TripPlannerButtons.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TripPlannerButtons = ({ handleButtonClick, theme }) => (
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

export default TripPlannerButtons;