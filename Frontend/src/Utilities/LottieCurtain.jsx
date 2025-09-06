// src/components/animations/LottieCurtain.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

export default LottieCurtain;