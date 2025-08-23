import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Teams from './components/team';
import VantaNetBackground from './components/bg';
import ContactUs from './components/ContactUs';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import AuthApp from './components/auth/AuthApp';

const MainPage = ({ theme, setTheme, dotRef, outlineRef }) => {
  return (
    <>
      <VantaNetBackground theme={theme} />
      <Navbar theme={theme} setTheme={setTheme} />
      <Hero />
      <Services />
      <Teams />
      <ContactUs />
      <Footer theme={theme} />
    </>
  );
};
// const Auth = ({ theme }) => {
//   return (
//     <div className="relative h-[2000px] items-center justify-center overflow-y-hidden">
//       {/* Fullscreen Vanta Background */}
//       <VantaNetBackground theme={theme} />
//     </div>
//   );
// };

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
      <div className={`relative ${theme === 'dark' ? 'dark' : ''}`}>
        <Toaster />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <MainPage 
                theme={theme} 
                setTheme={setTheme} 
                dotRef={dotRef} 
                outlineRef={outlineRef} 
              />
            } 
          />
         <Route path="/auth" element={<AuthApp theme={theme} />} />

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