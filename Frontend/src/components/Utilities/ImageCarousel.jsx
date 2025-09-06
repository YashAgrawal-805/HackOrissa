// src/components/common/ImageCarousel.jsx
import React from 'react';
import { motion } from 'framer-motion';

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

export default ImageCarousel;