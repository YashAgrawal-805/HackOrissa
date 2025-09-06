// src/components/Parallax.jsx
import React, { useRef } from 'react';
import { useScroll, motion } from 'framer-motion';
import StayBuddyCard from './cards/StayBuddyCard';
import TripPlannerCard from './cards/TripPlannerCard';
import SafetyCard from './cards/SafetyCard';

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

const CardsParallaxAnimation = ({ theme }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

  return (
    <main ref={container} style={{ marginTop: '50vh', marginBottom: '50vh' }}>
      {projects.map((project, i) => {
        const targetScale = 1 - ((projects.length - i) * 0.05);
        const cardProps = { key: project.title, i, color: project.color, progress: scrollYProgress, range: [i * 0.25, 1], targetScale, theme };

        if (project.isStayBuddyCard) {
          return <StayBuddyCard {...cardProps} />;
        }
        if (project.isTripPlannerCard) {
          return <TripPlannerCard {...cardProps} />;
        }
        if (project.isSafetyCard) {
          return <SafetyCard {...cardProps} />;
        }
        return null;
      })}
    </main>
  );
};

export default CardsParallaxAnimation;