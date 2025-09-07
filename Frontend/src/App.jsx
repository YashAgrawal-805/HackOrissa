// src/app.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthApp from './pages/AuthApp';
import Explore from './pages/Explore';
import MainPage from './pages/MainPage'; 
import LiveTracker from "./controllers/LiveTraking";


const App = () => {
  const [theme, setTheme] = useState('light');
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  // Refs for custom cursor Position tracking
  const mouse = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.1;
      position.current.y += (mouse.current.y - position.current.y) * 0.1;

      if (dotRef.current && outlineRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x - 6}px, ${mouse.current.y - 6}px, 0)`;
        outlineRef.current.style.transform = `translate3d(${position.current.x - 20}px, ${position.current.y - 20}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Router>
      <LiveTracker />
      <div className={`relative ${theme === 'dark' ? 'dark' : ''}`}>
        <Toaster />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <MainPage 
                theme={theme} 
                setTheme={setTheme} 
              />
            } 
          />
          <Route path="/auth" element={<AuthApp theme={theme} />} />
          <Route path="/explore" element={<Explore theme={theme} setTheme={setTheme} />} />
        </Routes>

        {/* Custom Cursor Ring */}
        <div 
          ref={outlineRef} 
          className='fixed top-0 left-0 h-10 w-10 rounded-full border border-primary pointer-events-none z-[9999]'
          style={{ transition: 'transform 0.1s ease-out' }}
        ></div>

        {/* Custom Cursor Dot */}
        <div 
          ref={dotRef} 
          className='fixed top-0 left-0 h-3 w-3 rounded-full bg-primary pointer-events-none z-[9999]'
        ></div>
      </div>
    </Router>
  );
};

export default App;